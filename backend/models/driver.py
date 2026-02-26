from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from models.base import Base


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(String, primary_key=True)  # e.g. "hamilton"
    code = Column(String(3), nullable=False)  # e.g. "HAM"
    full_name = Column(String, nullable=False)
    nationality = Column(String)
    team_id = Column(String, ForeignKey("constructors.id"))

    constructor = relationship("Constructor", back_populates="drivers")
    laps = relationship("Lap", back_populates="driver")
    telemetry_points = relationship("TelemetryPoint", back_populates="driver")
    standings = relationship("StandingsSnapshot", back_populates="driver")
