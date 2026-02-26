from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from models.base import Base


class Constructor(Base):
    __tablename__ = "constructors"

    id = Column(String, primary_key=True)  # e.g. "mercedes"
    name = Column(String, nullable=False)
    nationality = Column(String)

    drivers = relationship("Driver", back_populates="constructor")
