import os

import psycopg
from psycopg import sql

from config import get_db_connection


TABLES = [
    "app_user",
    "inventory_stock",
    "loyalty_account",
    "menu_item",
    "reorder_request",
]


def get_columns(connection, table_name):
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = %s
            ORDER BY ordinal_position
            """,
            (table_name,),
        )
        return [row[0] for row in cursor.fetchall()]


def copy_table(source, target, table_name):
    source_columns = get_columns(source, table_name)
    target_columns = get_columns(target, table_name)
    columns = [column for column in target_columns if column in source_columns]

    if not columns:
        raise RuntimeError(f"No shared columns found for {table_name}")

    with source.cursor() as source_cursor:
        source_cursor.execute(
            sql.SQL("SELECT {} FROM {} ORDER BY id").format(
                sql.SQL(", ").join(sql.Identifier(column) for column in columns),
                sql.Identifier(table_name),
            )
        )
        rows = source_cursor.fetchall()

    placeholders = sql.SQL(", ").join(sql.Placeholder() for _ in columns)
    insert_statement = sql.SQL("INSERT INTO {} ({}) VALUES ({})").format(
        sql.Identifier(table_name),
        sql.SQL(", ").join(sql.Identifier(column) for column in columns),
        placeholders,
    )

    with target.cursor() as target_cursor:
        target_cursor.executemany(insert_statement, rows)

        if "id" in columns:
            target_cursor.execute(
                sql.SQL(
                    "SELECT setval(pg_get_serial_sequence(%s, 'id'), "
                    "COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM {}"
                ).format(sql.Identifier(table_name)),
                (table_name,),
            )

    return len(rows)


def import_old_database():
    old_password = os.getenv("OLD_DB_PASSWORD")
    if not old_password:
        raise RuntimeError("OLD_DB_PASSWORD is not configured")

    old_connection = psycopg.connect(
        host=os.getenv("OLD_DB_HOST", "host.docker.internal"),
        port=int(os.getenv("OLD_DB_PORT", "5432")),
        dbname=os.getenv("OLD_DB_NAME", "meridian_kitchens"),
        user=os.getenv("OLD_DB_USER", "postgres"),
        password=old_password,
    )

    try:
        with get_db_connection() as target_connection:
            with target_connection.cursor() as cursor:
                cursor.execute(
                    "TRUNCATE TABLE app_user, inventory_stock, loyalty_account, "
                    "menu_item, reorder_request RESTART IDENTITY CASCADE"
                )

            counts = {
                table_name: copy_table(old_connection, target_connection, table_name)
                for table_name in TABLES
            }
            target_connection.commit()
    finally:
        old_connection.close()

    print("Imported old database records:")
    for table_name, count in counts.items():
        print(f"  {table_name}: {count}")


if __name__ == "__main__":
    import_old_database()
