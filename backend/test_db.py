import psycopg

conn = psycopg.connect(
    host="localhost",
    port=5432,
    dbname="meridian_kitchens",
    user="postgres",
    password="srinath@2918"
)

print("Database connection successful!")

conn.close()