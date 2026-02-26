from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class StandingsSnapshot(Base):
    __tablename__ = "standings_snapshots"

    id = Column(Integer, primary_key=True, autoincrement=True)
    season = Column(Integer, nullable=False)
    round = Column(Integer, nullable=False)   # 0 = pre-season / final
    driver_id = Column(String, ForeignKey("drivers.id"), nullable=True)
    constructor_id = Column(String, ForeignKey("constructors.id"), nullable=True)
    position = Column(Integer, nullable=False)
    points = Column(Float, nullable=False)
    wins = Column(Integer, default=0)
    type = Column(String, nullable=False)  # "driver" or "constructor"

    driver = relationship("Driver", back_populates="standings")
