from fastapi import FastAPI,Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import psycopg
from pwdlib import PasswordHash
from fastapi import Header
from jose import jwt
from datetime import datetime, timedelta
from ai_assistant import ask_menu_ai
from rag_context import get_rag_context

password_hash = PasswordHash.recommended()
SECRET_KEY = "meridian-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(username: str, role: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": username,
        "role": role,
        "exp": expire
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")
        role = payload.get("role")

        return {
            "username": username,
            "role": role
        }

    except Exception:
        return {
            "message": "Invalid or expired token"
        }

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InventoryItem(BaseModel):
    ingredient: str
    outlet: str
    quantity: int
    reorder_threshold: int

class InventoryUpdate(BaseModel):
    quantity: int
    reorder_threshold: int


class ReorderRequest(BaseModel):
    inventory_id: int
    quantity_requested: int
    supplier: str

class ReorderStatusUpdate(BaseModel):
    status: str

class LoginRequest(BaseModel):
    username: str
    password: str


@app.post("/inventory")
def add_inventory(item: InventoryItem):

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
        INSERT INTO inventory_stock
        (ingredient, outlet, quantity, reorder_threshold)
        VALUES (%s, %s, %s, %s)
        RETURNING id
        """,
        (
            item.ingredient,
            item.outlet,
            item.quantity,
            item.reorder_threshold
        )
    )

    new_id = cursor.fetchone()[0]

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Inventory item added successfully",
        "id": new_id
    }

@app.delete("/inventory/{item_id}")
def delete_inventory(item_id: int):

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
        DELETE FROM inventory_stock
        WHERE id = %s
        RETURNING id
        """,
        (item_id,)
    )

    deleted_id = cursor.fetchone()

    conn.commit()

    cursor.close()
    conn.close()

    if deleted_id is None:
        return {"message": "Inventory item not found"}

    return {
        "message": "Inventory item deleted successfully",
        "id": deleted_id[0]
    }

@app.get("/")
def home():
    return {"message": "Meridian Kitchens Backend is running!"}


@app.put("/inventory/{item_id}")
def update_inventory(
    item_id: int,
    item: InventoryUpdate,
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") != "staff":
        return {
        "message": "Only staff can update inventory"
    }

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
        UPDATE inventory_stock
        SET quantity = %s,
            reorder_threshold = %s
        WHERE id = %s
        RETURNING id
        """,
        (
            item.quantity,
            item.reorder_threshold,
            item_id
        )
    )

    updated_id = cursor.fetchone()

    conn.commit()

    cursor.close()
    conn.close()

    if updated_id is None:
        return {"message": "Inventory item not found"}

    return {
        "message": "Inventory item updated successfully",
        "id": updated_id[0]
    }

@app.get("/inventory")
def get_inventory():
    conn=psycopg.connect(
        host="localhost",
        port=5432,
        dbname="meridian_kitchens",
        user="postgres",
        password="srinath@2918"

    )
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM inventory_stock")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    inventory =[]

    for row in rows:
        # status = "LOW STOCK" if row[3] < row[4] else "STOCK OK"
        if row[3] == 0:
            status = "OUT OF STOCK"
        elif row[3] < row[4]:
            status = "LOW STOCK"
        else:
            status = "STOCK OK"

        inventory.append({
            "id": row[0],
            "ingredient": row[1],
            "outlet": row[2],
            "quantity": row[3],
            "reorder_threshold": row[4],
            "status": status
        })
    return {"inventory": inventory}

@app.get("/inventory/low-stock")
def get_low_stock():

    conn = psycopg.connect(
        host="localhost",
        port=5432,
        dbname="meridian_kitchens",
        user="postgres",
        password="srinath@2918"
    )

    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM inventory_stock
        WHERE quantity < reorder_threshold
    """)

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    inventory = []

    for row in rows:
        inventory.append({
            "id": row[0],
            "ingredient": row[1],
            "outlet": row[2],
            "quantity": row[3],
            "reorder_threshold": row[4],
            "status": "LOW STOCK"
        })

    return inventory


@app.get("/loyalty")
def get_loyalty():

    conn = psycopg.connect(
        host="localhost",
        port=5432,
        dbname="meridian_kitchens",
        user="postgres",
        password="srinath@2918"
    )

    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM loyalty_account
        ORDER BY id
    """)

    rows = cursor.fetchall()

    loyalty = []

    for row in rows:
        loyalty.append({
            "id": row[0],
            "member_name": row[1],
            "points_balance": row[2],
            "tier": row[3]
        })

    cursor.close()
    conn.close()

    return {"loyalty": loyalty}


@app.post("/login")
def login(data: LoginRequest):

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
        SELECT id, username, password, role
        FROM app_user
        WHERE username = %s
        """,
        (data.username,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user is None:
        return {"message": "Invalid username or password"}

    if not password_hash.verify(data.password, user[2]):
        return {"message": "Invalid username or password"}

    access_token = create_access_token(user[1], user[3])

    return {
        "message": "Login successful",
        "access_token": access_token,
        "username": user[1],
        "role": user[3]
    }



@app.post("/reorders")
def create_reorder(
    data: ReorderRequest,
    current_user: dict = Depends(get_current_user)
):
    # Only managers can create reorder requests
    if current_user.get("role") != "manager":
        return {
            "message": "Only managers can create reorder requests"
        }

    conn = psycopg.connect(
        host="localhost",
        port=5432,
        dbname="meridian_kitchens",
        user="postgres",
        password="srinath@2918"
    )

    cursor = conn.cursor()

    # Check whether the inventory item exists
    cursor.execute(
        """
        SELECT quantity, reorder_threshold
        FROM inventory_stock
        WHERE id = %s
        """,
        (data.inventory_id,)
    )

    inventory = cursor.fetchone()

    # Inventory item does not exist
    if inventory is None:
        cursor.close()
        conn.close()

        return {
            "message": "Inventory item not found"
        }

    quantity, reorder_threshold = inventory

    # Allow reorder only when stock is LOW or OUT OF STOCK
    if quantity > 0 and quantity >= reorder_threshold:
        cursor.close()
        conn.close()

        return {
            "message": "Reorder is allowed only for LOW STOCK or OUT OF STOCK items"
        }

    # Create reorder request
    cursor.execute(
        """
        INSERT INTO reorder_request
        (inventory_id, quantity_requested, supplier, requested_by)
        VALUES (%s, %s, %s, %s)
        RETURNING id
        """,
        (
            data.inventory_id,
            data.quantity_requested,
            data.supplier,
            current_user.get("username")
        )
    )

    reorder_id = cursor.fetchone()[0]

    conn.commit()
    cursor.close()
    conn.close()

    return {
        "message": "Reorder request created successfully",
        "reorder_id": reorder_id
    }


@app.put("/reorders/{reorder_id}")
def update_reorder_status(
    reorder_id: int,
    status_update: ReorderStatusUpdate,
    current_user: dict = Depends(get_current_user)
):
    # Only managers can approve or reject
    if current_user.get("role") != "manager":
        return {
            "message": "Only managers can update reorder status"
        }

    if status_update.status not in ["APPROVED", "REJECTED"]:
        return {
            "message": "Status must be APPROVED or REJECTED"
        }

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
        UPDATE reorder_request
        SET status = %s
        WHERE id = %s
        """,
        (
            status_update.status,
            reorder_id
        )
    )

    if cursor.rowcount == 0:
        cursor.close()
        conn.close()

        return {
            "message": "Reorder request not found"
        }

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": f"Reorder request {status_update.status.lower()} successfully",
        "status": status_update.status
    }



@app.get("/reorders")
def get_reorders(
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") != "manager":
        return {"message": "Only managers can view reorder requests"}

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
            r.id,
            r.inventory_id,
            i.ingredient,
            i.outlet,
            r.quantity_requested,
            r.supplier,
            r.status,
            r.requested_by,
            r.created_at
        FROM reorder_request r
        JOIN inventory_stock i
            ON r.inventory_id = i.id
        ORDER BY r.created_at DESC
        """
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    reorders = []

    for row in rows:
        reorders.append({
            "id": row[0],
            "inventory_id": row[1],
            "ingredient": row[2],
            "outlet": row[3],
            "quantity_requested": row[4],
            "supplier": row[5],
            "status": row[6],
            "requested_by": row[7],
            "created_at": row[8]
        })

    return {"reorders": reorders}





@app.get("/menu")
def get_menu():
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
            name,
            description,
            price,
            ingredients,
            allergens,
            outlet,
            category
        FROM menu_item
        ORDER BY id
        """
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    menu = []

    for row in rows:
        menu.append({
            "id": row[0],
            "name": row[1],
            "description": row[2],
            "price": float(row[3]),
            "ingredients": row[4],
            "allergens": row[5],
            "outlet": row[6],
            "category": row[7]
        })

    return {
        "menu": menu
    }





@app.get("/outlets")
def get_outlets():
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
        SELECT DISTINCT outlet
        FROM inventory_stock
        ORDER BY outlet
        """
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    outlets = [row[0] for row in rows]

    return {
        "outlets": outlets
    }



@app.post("/ai/menu-assistant")
def menu_ai_assistant(data: dict):

    question = data.get("question", "").strip()

    if not question:
        return {
            "answer": "Please enter a question about our menu."
        }

    try:

        # Retrieve relevant information from the RAG system
        rag_context = get_rag_context(
            question,
            top_k=3
        )

        # Generate the final AI answer
        answer = ask_menu_ai(
            question,
            rag_context
        )

        return {
            "answer": answer
        }

    except Exception as error:

        print("RAG Assistant error:", error)

        return {
            "answer": (
                "Sorry, I am temporarily unable to answer "
                "your question. Please try again."
            )
        }