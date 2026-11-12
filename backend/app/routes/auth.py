from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt, JWTError
import bcrypt
from app.database.session import get_db
from app.database.models import User
from app.schemas.user import UserRegister, UserLogin, UserResponse, Token
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        pwd_bytes = plain_password.encode('utf-8')[:72]
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(pwd_bytes, hashed_bytes)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    # Check if email exists
    clean_email = user_in.email.strip().lower()
    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please log in instead."
        )

    user = User(
        name=user_in.name.strip(),
        email=clean_email,
        mobile=user_in.mobile.strip(),
        state=user_in.state.strip(),
        district=user_in.district.strip() if user_in.district else None,
        city=user_in.city.strip() if user_in.city else None,
        pincode=user_in.pincode.strip() if user_in.pincode else None,
        property_type=user_in.property_type,
        consumer_category=user_in.consumer_category,
        hashed_password=get_password_hash(user_in.password or "solarsahayak123"),
        is_demo=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    clean_email = credentials.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials and try again."
        )

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/demo-login", response_model=Token)
def demo_login(db: Session = Depends(get_db)):
    """Instant one-click demo login for presentations and hackathons"""
    user = db.query(User).filter(User.email == "demo@solarsahayak.in").first()
    if not user:
        user = User(
            name="Aarav Sharma",
            email="demo@solarsahayak.in",
            mobile="9876543210",
            state="Maharashtra",
            district="Pune",
            city="Pune",
            pincode="411001",
            property_type="Home",
            consumer_category="Domestic/Residential",
            hashed_password=get_password_hash("solardemo2026"),
            is_demo=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/profile/{user_id}", response_model=UserResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return UserResponse.model_validate(user)
