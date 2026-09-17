# import json
# import re
# from pathlib import Path

# from pwdlib import PasswordHash

# from config import get_db_connection


# password_hash = PasswordHash.recommended()


# SCHEMA = """
# CREATE TABLE IF NOT EXISTS app_user (
#     id SERIAL PRIMARY KEY,
#     username VARCHAR(100) NOT NULL UNIQUE,
#     password TEXT NOT NULL,
#     role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'staff'))
# );

# CREATE TABLE IF NOT EXISTS inventory_stock (
#     id SERIAL PRIMARY KEY,
#     ingredient VARCHAR(150) NOT NULL,
#     outlet VARCHAR(100) NOT NULL,
#     quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
#     reorder_threshold INTEGER NOT NULL DEFAULT 0 CHECK (reorder_threshold >= 0)
# );

# CREATE TABLE IF NOT EXISTS loyalty_account (
#     id SERIAL PRIMARY KEY,
#     member_name VARCHAR(150) NOT NULL,
#     points_balance INTEGER NOT NULL DEFAULT 0 CHECK (points_balance >= 0),
#     tier VARCHAR(50) NOT NULL
# );

# CREATE TABLE IF NOT EXISTS menu_item (
#     id SERIAL PRIMARY KEY,
#     name VARCHAR(150) NOT NULL UNIQUE,
#     description TEXT NOT NULL,
#     price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
#     ingredients TEXT NOT NULL,
#     allergens TEXT NOT NULL,
#     outlet VARCHAR(100) NOT NULL,
#     category VARCHAR(100) NOT NULL
# );

# CREATE TABLE IF NOT EXISTS reorder_request (
#     id SERIAL PRIMARY KEY,
#     inventory_id INTEGER NOT NULL REFERENCES inventory_stock(id),
#     quantity_requested INTEGER NOT NULL CHECK (quantity_requested > 0),
#     supplier VARCHAR(150) NOT NULL,
#     status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
#         CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
#     requested_by VARCHAR(100) NOT NULL,
#     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
# );
# """


# MENU_SOURCE = Path(__file__).parent / "knowledge" / "embeddings.json"


# def get_category(name, ingredients):
#     item_text = f"{name} {ingredients}".lower()
#     if any(word in item_text for word in ("cake", "ice cream", "gulab jamun", "dessert")):
#         return "Desserts"
#     if any(word in item_text for word in ("chicken", "mutton", "lamb", "fish", "prawn", "shrimp", "egg")):
#         return "Main Course"
#     return "Starters"


# def load_menu():
#     records = json.loads(MENU_SOURCE.read_text(encoding="utf-8"))
#     menu = []

#     for record in records:
#         lines = record["text"].splitlines()
#         name = re.sub(r"^\d+\.\s*", "", lines[0]).strip()
#         price_match = re.search(r"Price:\s*[^0-9]*([0-9]+(?:\.[0-9]+)?)", lines[1])
#         outlet_match = re.search(r"Outlet:\s*(.*?)\s+Source:", lines[1])
#         description = next(line.removeprefix("Description:").strip() for line in lines if line.startswith("Description:"))
#         ingredients = next(line.removeprefix("Ingredients:").strip() for line in lines if line.startswith("Ingredients:"))
#         allergens = next(line.removeprefix("Allergens:").strip() for line in lines if line.startswith("Allergens:"))

#         if not price_match or not outlet_match:
#             raise ValueError(f"Invalid menu record: {name}")

#         menu.append(
#             (
#                 name,
#                 description,
#                 float(price_match.group(1)),
#                 ingredients,
#                 allergens,
#                 outlet_match.group(1).strip(),
#                 get_category(name, ingredients),
#             )
#         )

#     return menu


# def seed():
#     menu = load_menu()

#     with get_db_connection() as connection:
#         with connection.cursor() as cursor:
#             cursor.execute(SCHEMA)

#             menu_names = [item[0] for item in menu]
#             cursor.execute(
#                 "DELETE FROM menu_item WHERE NOT (name = ANY(%s))",
#                 (menu_names,),
#             )

#             for item in menu:
#                 cursor.execute(
#                     """
#                     INSERT INTO menu_item
#                         (name, description, price, ingredients, allergens, outlet, category)
#                     VALUES (%s, %s, %s, %s, %s, %s, %s)
#                     ON CONFLICT (name) DO UPDATE SET
#                         description = EXCLUDED.description,
#                         price = EXCLUDED.price,
#                         ingredients = EXCLUDED.ingredients,
#                         allergens = EXCLUDED.allergens,
#                         outlet = EXCLUDED.outlet,
#                         category = EXCLUDED.category
#                     """,
#                     item,
#                 )

#     print(f"Database schema and {len(menu)} menu records imported successfully.")


# if __name__ == "__main__":
#     seed()
import json
import re
from pathlib import Path

from pwdlib import PasswordHash

from config import get_db_connection


password_hash = PasswordHash.recommended()


# ============================================================
# DATABASE SCHEMA
# ============================================================

SCHEMA = """
CREATE TABLE IF NOT EXISTS app_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('manager', 'staff'))
);

CREATE TABLE IF NOT EXISTS inventory_stock (
    id SERIAL PRIMARY KEY,
    ingredient VARCHAR(150) NOT NULL,
    outlet VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reorder_threshold INTEGER NOT NULL DEFAULT 0 CHECK (reorder_threshold >= 0)
);

CREATE TABLE IF NOT EXISTS loyalty_account (
    id SERIAL PRIMARY KEY,
    member_name VARCHAR(150) NOT NULL,
    points_balance INTEGER NOT NULL DEFAULT 0 CHECK (points_balance >= 0),
    tier VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_item (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    ingredients TEXT NOT NULL,
    allergens TEXT NOT NULL,
    outlet VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS reorder_request (
    id SERIAL PRIMARY KEY,
    inventory_id INTEGER NOT NULL REFERENCES inventory_stock(id),
    quantity_requested INTEGER NOT NULL CHECK (quantity_requested > 0),
    supplier VARCHAR(150) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    requested_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"""


# ============================================================
# MENU SOURCE
# ============================================================

MENU_SOURCE = Path(__file__).parent / "knowledge" / "embeddings.json"


# ============================================================
# FIVE MERIDIAN KITCHENS LOCATIONS
# ============================================================

OUTLETS = [
    "Bengaluru",
    "Chennai",
    "Hyderabad",
    "Vijayawada",
    "Visakhapatnam",
]


# ============================================================
# CATEGORY DETECTION
# ============================================================

def get_category(name, ingredients):
    item_text = f"{name} {ingredients}".lower()

    if any(
        word in item_text
        for word in (
            "cake",
            "ice cream",
            "gulab jamun",
            "dessert",
        )
    ):
        return "Desserts"

    if any(
        word in item_text
        for word in (
            "chicken",
            "mutton",
            "lamb",
            "fish",
            "prawn",
            "shrimp",
            "egg",
        )
    ):
        return "Main Course"

    return "Starters"


# ============================================================
# LOAD MENU
# ============================================================

def load_menu():
    records = json.loads(
        MENU_SOURCE.read_text(encoding="utf-8")
    )

    menu = []

    for index, record in enumerate(records):

        lines = record["text"].splitlines()

        # ----------------------------------------------------
        # Menu name
        # ----------------------------------------------------

        name = re.sub(
            r"^\d+\.\s*",
            "",
            lines[0]
        ).strip()

        # ----------------------------------------------------
        # Price
        # ----------------------------------------------------

        price_match = re.search(
            r"Price:\s*[^0-9]*([0-9]+(?:\.[0-9]+)?)",
            lines[1]
        )

        # ----------------------------------------------------
        # Description
        # ----------------------------------------------------

        description = next(
            line.removeprefix("Description:").strip()
            for line in lines
            if line.startswith("Description:")
        )

        # ----------------------------------------------------
        # Ingredients
        # ----------------------------------------------------

        ingredients = next(
            line.removeprefix("Ingredients:").strip()
            for line in lines
            if line.startswith("Ingredients:")
        )

        # ----------------------------------------------------
        # Allergens
        # ----------------------------------------------------

        allergens = next(
            line.removeprefix("Allergens:").strip()
            for line in lines
            if line.startswith("Allergens:")
        )

        # ----------------------------------------------------
        # Validation
        # ----------------------------------------------------

        if not price_match:
            raise ValueError(
                f"Invalid menu record: {name}"
            )

        # ----------------------------------------------------
        # Assign outlet
        #
        # 100 menu items:
        #
        # 1  - 20  → Bengaluru
        # 21 - 40  → Chennai
        # 41 - 60  → Hyderabad
        # 61 - 80  → Vijayawada
        # 81 - 100 → Visakhapatnam
        # ----------------------------------------------------

        outlet_index = index // 20

        if outlet_index >= len(OUTLETS):
            raise ValueError(
                "More than 100 menu records found. "
                "Please update the outlet distribution."
            )

        outlet = OUTLETS[outlet_index]

        # ----------------------------------------------------
        # Add menu item
        # ----------------------------------------------------

        menu.append(
            (
                name,
                description,
                float(price_match.group(1)),
                ingredients,
                allergens,
                outlet,
                get_category(name, ingredients),
            )
        )

    return menu


# ============================================================
# SEED DATABASE
# ============================================================

def seed():

    menu = load_menu()

    with get_db_connection() as connection:

        with connection.cursor() as cursor:

            # ------------------------------------------------
            # Create tables
            # ------------------------------------------------

            cursor.execute(SCHEMA)

            # ------------------------------------------------
            # Remove menu items that no longer exist
            # ------------------------------------------------

            menu_names = [
                item[0]
                for item in menu
            ]

            cursor.execute(
                """
                DELETE FROM menu_item
                WHERE NOT (name = ANY(%s))
                """,
                (menu_names,),
            )

            # ------------------------------------------------
            # Insert / Update menu items
            # ------------------------------------------------

            for item in menu:

                cursor.execute(
                    """
                    INSERT INTO menu_item
                        (
                            name,
                            description,
                            price,
                            ingredients,
                            allergens,
                            outlet,
                            category
                        )
                    VALUES
                        (
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s
                        )

                    ON CONFLICT (name)
                    DO UPDATE SET
                        description = EXCLUDED.description,
                        price = EXCLUDED.price,
                        ingredients = EXCLUDED.ingredients,
                        allergens = EXCLUDED.allergens,
                        outlet = EXCLUDED.outlet,
                        category = EXCLUDED.category
                    """,
                    item,
                )

    print(
        f"Database schema and {len(menu)} menu records "
        "imported successfully."
    )

    print("\nMenu distribution:")

    for index, outlet in enumerate(OUTLETS):

        start = index * 20 + 1
        end = start + 19

        print(
            f"{outlet}: menu items {start}-{end}"
        )


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    seed()