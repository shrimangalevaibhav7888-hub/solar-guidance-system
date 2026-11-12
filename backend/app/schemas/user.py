from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    mobile: str = Field(..., pattern=r"^[6-9]\d{9}$", description="Valid 10-digit Indian Mobile Number")
    state: str = Field(..., min_length=2)
    district: Optional[str] = "Pune"
    city: Optional[str] = "Pune"
    pincode: Optional[str] = None
    property_type: str = Field(default="Home", description="Home, Shop, Institution")
    consumer_category: Optional[str] = "Domestic/Residential"

class UserRegister(UserBase):
    password: Optional[str] = "solarsahayak123"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    is_demo: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
