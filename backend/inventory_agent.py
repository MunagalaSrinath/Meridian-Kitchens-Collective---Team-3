import psycopg


def get_low_stock_items():

    conn = psycopg.connect(
        host="localhost",
        port=5432,
        dbname="meridian_kitchens",
        user="postgres",
        password="srinath@2918"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            id,
            ingredient,
            outlet,
            quantity,
            reorder_threshold
        FROM inventory_stock
        WHERE quantity < reorder_threshold
        ORDER BY quantity ASC
        """
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    low_stock_items = []

    for row in rows:

        low_stock_items.append({
            "inventory_id": row[0],
            "ingredient": row[1],
            "outlet": row[2],
            "quantity": row[3],
            "reorder_threshold": row[4]
        })

    return low_stock_items


def calculate_reorder_quantity(
    quantity: int,
    reorder_threshold: int
) -> int:

    suggested_quantity = (
        reorder_threshold * 2
    ) - quantity

    return max(suggested_quantity, 0)


def generate_reorder_recommendations():

    low_stock_items = get_low_stock_items()

    recommendations = []

    for item in low_stock_items:

        suggested_quantity = calculate_reorder_quantity(
            item["quantity"],
            item["reorder_threshold"]
        )

        recommendations.append({
            "inventory_id": item["inventory_id"],
            "ingredient": item["ingredient"],
            "outlet": item["outlet"],
            "current_quantity": item["quantity"],
            "reorder_threshold": item["reorder_threshold"],
            "suggested_quantity": suggested_quantity
        })

    return recommendations





def get_supplier_for_inventory(inventory_id: int):

    conn = psycopg.connect(
        host="localhost",
        port=5432,
        dbname="meridian_kitchens",
        user="postgres",
        password="srinath@2918"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT supplier
        FROM reorder_request
        WHERE inventory_id = %s
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (inventory_id,)
    )

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if row:
        return row[0]

    return "Manager to assign"


def run_inventory_agent():

    recommendations = generate_reorder_recommendations()

    for item in recommendations:

        supplier = get_supplier_for_inventory(
            item["inventory_id"]
        )

        item["supplier"] = supplier

    return recommendations





def create_agent_reorder_requests():

    recommendations = run_inventory_agent()

    conn = psycopg.connect(
        host="localhost",
        port=5432,
        dbname="meridian_kitchens",
        user="postgres",
        password="srinath@2918"
    )

    cursor = conn.cursor()

    created_requests = []

    for item in recommendations:

        cursor.execute(
            """
            SELECT id
            FROM reorder_request
            WHERE inventory_id = %s
            AND status = 'PENDING'
            LIMIT 1
            """,
            (item["inventory_id"],)
        )

        existing_request = cursor.fetchone()

        if existing_request:
            continue

        cursor.execute(
            """
            INSERT INTO reorder_request
            (
                inventory_id,
                quantity_requested,
                supplier,
                status,
                requested_by
            )
            VALUES (%s, %s, %s, 'PENDING', %s)
            RETURNING id
            """,
            (
                item["inventory_id"],
                item["suggested_quantity"],
                item["supplier"],
                "AI_AGENT"
            )
        )

        reorder_id = cursor.fetchone()[0]

        created_requests.append({
            "reorder_id": reorder_id,
            "inventory_id": item["inventory_id"],
            "ingredient": item["ingredient"],
            "outlet": item["outlet"],
            "quantity_requested": item["suggested_quantity"],
            "supplier": item["supplier"],
            "status": "PENDING"
        })

    conn.commit()

    cursor.close()
    conn.close()

    return created_requests