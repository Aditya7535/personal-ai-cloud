from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

# SECRET KEY
SECRET_KEY = "supersecretkey"

ALGORITHM = "HS256"

# PASSWORD HASHER
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# HASH PASSWORD
def hash_password(password):

    return pwd_context.hash(password)

# VERIFY PASSWORD
def verify_password(
    plain_password,
    hashed_password
):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )

# CREATE JWT TOKEN
def create_access_token(data):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        hours=24
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt

from fastapi import HTTPException
from jose import JWTError

# VERIFY TOKEN
def verify_token(token):

    try:

        payload = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        if username is None:

            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return username

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )