from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String
)

from sqlalchemy.ext.declarative import (
    declarative_base
)

from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./users.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    }
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# USER MODEL
class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(
        String,
        unique=True
    )

    password = Column(String)

# CHAT MODEL
class Chat(Base):

    __tablename__ = "chats"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(String)

    title = Column(String)

    messages = Column(String)

# CREATE TABLES
Base.metadata.create_all(
    bind=engine
)