from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class SessionRecord(Base):
    """A session within a race event (Practice1, Qualifying, Race, etc.)"""
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(Integer, ForeignKey("race_events.id"))
    type = Column(String, nullable=False)  # practice1, practice2, practice3, qualifying, sprint, race, testing
    date = Column(Date, nullable=True)

    event = relationship("RaceEvent", back_populates="sessions")
    laps = relationship("Lap", back_populates="session")
    telemetry_points = relationship("TelemetryPoint", back_populates="session")
