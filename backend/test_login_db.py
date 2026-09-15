import psycopg

conn = psycopg.connect(
    host="localhost",
    port=5432,
    dbname="meridian_kitchens",
    user="postgres",
    password="srinath@2918"
)

cursor = conn.cursor()

cursor.execute("""
    SELECT id, username, password, role
    FROM app_user
    WHERE username = 'manager1'
""")

user = cursor.fetchone()

print("Database connection successful!")
print("User found:", user is not None)

if user:
    print("Username:", user[1])
    print("Role:", user[3])

cursor.close()
conn.close()