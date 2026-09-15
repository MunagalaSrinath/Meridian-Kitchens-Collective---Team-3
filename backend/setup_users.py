import psycopg
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

manager_password = "Manager@123"
staff_password = "Staff@123"

manager_hashed = password_hash.hash(manager_password)
staff_hashed = password_hash.hash(staff_password)

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
    UPDATE app_user
    SET password = %s
    WHERE username = 'manager1'
    """,
    (manager_hashed,)
)

cursor.execute(
    """
    UPDATE app_user
    SET password = %s
    WHERE username = 'staff1'
    """,
    (staff_hashed,)
)

conn.commit()

cursor.close()
conn.close()

print("User passwords updated with secure hashes!")