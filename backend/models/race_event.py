from sqlalchemy import Column, Integer, String, Date, Boolean
from sqlalchemy.orm import relationship
from models.base import Base


class RaceEvent(Base):
    __tablename__ = "race_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    season = Column(Integer, nullable=False)
    round = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    circuit = Column(String)
    country = Column(String)
    locality = Column(String)
    date = Column(Date)
    is_sprint = Column(Boolean, default=False)
    sprint_date = Column(Date, nullable=True)

    sessions = relationship("SessionRecord", back_populates="event")
