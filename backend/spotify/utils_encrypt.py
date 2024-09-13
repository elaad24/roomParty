from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.fernet import Fernet
import base64

# Deriving a Fernet key from "python"
password = "python".encode()  # Convert "python" to bytes
salt = b'some_salt_value'  # Use a constant salt value (you can generate one for more security)

kdf = PBKDF2HMAC(
    algorithm=hashes.SHA256(),
    length=32,
    salt=salt,
    iterations=100000,
    backend=default_backend()
)
key = base64.urlsafe_b64encode(kdf.derive(password))  # Use .derive() instead of .generate_key()

cipher_suite = Fernet(key)

# Encryption function
def encrypt_token(plain_text):
    encrypted_token = cipher_suite.encrypt(plain_text.encode())
    return encrypted_token.decode()  # Convert to string for transport

# Decryption function
def decrypt_token(encrypted_text):
    decrypted_token = cipher_suite.decrypt(encrypted_text.encode())
    return decrypted_token.decode()  # Convert to string
