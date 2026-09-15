from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

password = "Manager@123"

hashed_password = password_hash.hash(password)

print("Original password:", password)
print("Hashed password:", hashed_password)