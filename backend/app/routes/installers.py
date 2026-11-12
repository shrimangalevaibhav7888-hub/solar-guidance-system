from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database.session import get_db
from app.database.models import Installer
from app.schemas.installer import InstallerResponse, InstallerListResponse
from app.services.installer_service import InstallerService

router = APIRouter(prefix="/installers", tags=["Installers Directory"])

@router.get("", response_model=InstallerListResponse)
def list_installers(
    state: Optional[str] = None,
    city: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return InstallerService.get_installers(
        db=db,
        state=state,
        city=city,
        search=search
    )

@router.get("/{installer_id}", response_model=InstallerResponse)
def get_installer(installer_id: int, db: Session = Depends(get_db)):
    inst = db.query(Installer).filter(Installer.id == installer_id).first()
    if not inst:
        raise HTTPException(status_code=404, detail="Installer not found in directory.")
    return InstallerResponse.model_validate(inst)
