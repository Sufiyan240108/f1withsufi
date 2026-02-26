from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class TelemetryPoint(Base):
    __tablename__ = "telemetry_points"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    driver_id = Column(String, ForeignKey("drivers.id"))
    lap_number = Column(Integer, nullable=False)
    distance = Column(Float)   # meters from start of lap
    speed = Column(Float)      # km/h
    throttle = Column(Float)   # 0–100
    brake = Column(Float)      # 0 or 1
    gear = Column(Integer)
    rpm = Column(Integer)
    drs = Column(Integer)      # 0/1/2/... FastF1 DRS status codes
    x = Column(Float, nullable=True)  # track X coordinate
    y = Column(Float, nullable=True)  # track Y coordinate

    session = relationship("SessionRecord", back_populates="telemetry_points")
    driver = relationship("Driver", back_populates="telemetry_points")
