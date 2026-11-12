from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    mobile = Column(String(20), nullable=False)
    state = Column(String(60), nullable=False, default="Maharashtra")
    district = Column(String(60), nullable=True)
    city = Column(String(60), nullable=True)
    pincode = Column(String(10), nullable=True)
    property_type = Column(String(30), nullable=False, default="Home") # Home, Shop, Institution
    consumer_category = Column(String(40), nullable=True, default="Domestic/Residential")
    hashed_password = Column(String(200), nullable=False)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    electricity_profiles = relationship("ElectricityProfile", back_populates="user", cascade="all, delete-orphan")
    solar_assessments = relationship("SolarAssessment", back_populates="user", cascade="all, delete-orphan")
    calculations = relationship("Calculation", back_populates="user", cascade="all, delete-orphan")
    reports = relationship("SolarReport", back_populates="user", cascade="all, delete-orphan")


class ElectricityProfile(Base):
    __tablename__ = "electricity_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    monthly_units = Column(Float, nullable=False) # kWh
    monthly_bill = Column(Float, nullable=False) # INR
    tariff = Column(Float, nullable=False) # INR per kWh
    annual_consumption = Column(Float, nullable=False) # kWh
    calculation_mode = Column(String(20), default="units") # "units" or "bill"
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="electricity_profiles")


class SolarAssessment(Base):
    __tablename__ = "solar_assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    roof_area = Column(Float, nullable=False) # sq.ft.
    roof_type = Column(String(50), default="RCC") # RCC, Metal, Other
    shading = Column(String(20), default="Low") # Low, Medium, High
    recommended_capacity = Column(Float, nullable=False) # kW
    panel_count = Column(Integer, nullable=False)
    panel_wattage = Column(Integer, default=550) # 550W
    annual_generation = Column(Float, nullable=False) # kWh/year
    monthly_generation = Column(Float, nullable=False) # kWh/month
    roof_required_sqft = Column(Float, nullable=False)
    roof_utilization_pct = Column(Float, nullable=False)
    state = Column(String(60), nullable=True)
    district = Column(String(60), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="solar_assessments")
    calculations = relationship("Calculation", back_populates="assessment", cascade="all, delete-orphan")


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    scheme_name = Column(String(200), nullable=False)
    ministry = Column(String(200), nullable=False)
    state = Column(String(60), nullable=False, default="All India") # "All India" or specific state
    applicable_property_type = Column(String(100), default="Home, Shop, Institution") # Comma separated
    description = Column(Text, nullable=False)
    eligibility = Column(Text, nullable=False)
    subsidy_type = Column(String(50), default="Direct Subsidy (CFA)")
    subsidy_amount = Column(String(100), nullable=False)
    subsidy_percentage = Column(String(50), nullable=True)
    application_process = Column(Text, nullable=False)
    required_documents = Column(Text, nullable=False)
    official_url = Column(String(300), nullable=False)
    active_status = Column(Boolean, default=True)
    category = Column(String(50), default="Central") # Central, State, Solar Policy
    last_verified_date = Column(String(30), default="2026-03-15")
    max_capacity_kw = Column(Float, default=10.0)
    min_capacity_kw = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)


class Installer(Base):
    __tablename__ = "installers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    state = Column(String(60), nullable=False)
    district = Column(String(60), nullable=False)
    city = Column(String(60), nullable=False)
    contact = Column(String(100), nullable=False)
    phone = Column(String(30), nullable=False)
    email = Column(String(100), nullable=True)
    website = Column(String(200), nullable=True)
    service_area = Column(String(200), nullable=False)
    authorised_status = Column(String(50), default="Empanelled / Authorised")
    verification_source = Column(String(150), default="DISCOM / MNRE Empanelled")
    rating = Column(Float, default=4.8)
    completed_projects = Column(Integer, default=150)
    is_demo = Column(Boolean, default=True)
    last_verified_date = Column(String(30), default="2026-03-01")
    created_at = Column(DateTime, default=datetime.utcnow)


class Calculation(Base):
    __tablename__ = "calculations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    assessment_id = Column(Integer, ForeignKey("solar_assessments.id", ondelete="CASCADE"), nullable=True)
    system_cost = Column(Float, nullable=False) # INR
    subsidy = Column(Float, nullable=False) # INR
    net_cost = Column(Float, nullable=False) # INR
    annual_savings = Column(Float, nullable=False) # INR
    monthly_savings = Column(Float, nullable=False) # INR
    payback_period = Column(Float, nullable=False) # Years
    co2_avoided = Column(Float, nullable=False) # kg/year
    co2_avoided_25yr = Column(Float, nullable=False) # kg over 25 years
    trees_equivalent = Column(Float, nullable=False) # trees / year
    coal_saved_kg = Column(Float, nullable=False) # kg coal / year
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="calculations")
    assessment = relationship("SolarAssessment", back_populates="calculations")


class SolarReport(Base):
    __tablename__ = "solar_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    report_code = Column(String(50), unique=True, index=True)
    report_data = Column(JSON, nullable=False) # Complete snapshot of calculations, profile, schemes, installer suggestions
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reports")


class SystemAssumption(Base):
    __tablename__ = "system_assumptions"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(80), unique=True, nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String(30), nullable=True)
    category = Column(String(50), default="Technical")
    description = Column(String(255), nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
