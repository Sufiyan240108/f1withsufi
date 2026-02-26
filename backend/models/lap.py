from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class Lap(Base):
    __tablename__ = "laps"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    driver_id = Column(String, ForeignKey("drivers.id"))
    lap_number = Column(Integer, nullable=False)
    lap_time_ms = Column(Float, nullable=True)
    sector1_ms = Column(Float, nullable=True)
    sector2_ms = Column(Float, nullable=True)
    sector3_ms = Column(Float, nullable=True)
    compound = Column(String, nullable=True)  # SOFT, MEDIUM, HARD, INTER, WET
    stint = Column(Integer, nullable=True)
    is_personal_best = Column(Boolean, default=False)
    gap_to_leader_s = Column(Float, nullable=True)
    gap_ahead_s = Column(Float, nullable=True)
    track_status = Column(String, nullable=True)  # 1=clear, 4=SC, 5=VSC, 6=red flag

    session = relationship("SessionRecord", back_populates="laps")
    driver = relationship("Driver", back_populates="laps")
