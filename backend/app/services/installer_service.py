from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database.models import Installer
from app.schemas.installer import InstallerResponse, InstallerListResponse

class InstallerService:
    @staticmethod
    def get_installers(
        db: Session,
        state: Optional[str] = None,
        city: Optional[str] = None,
        search: Optional[str] = None
    ) -> InstallerListResponse:
        query = db.query(Installer)

        if state and state.lower() != "all":
            query = query.filter(Installer.state.ilike(f"%{state}%"))

        if city and city.lower() != "all":
            query = query.filter(or_(Installer.city.ilike(f"%{city}%"), Installer.district.ilike(f"%{city}%")))

        if search:
            search_filter = or_(
                Installer.name.ilike(f"%{search}%"),
                Installer.city.ilike(f"%{search}%"),
                Installer.service_area.ilike(f"%{search}%"),
                Installer.state.ilike(f"%{search}%")
            )
            query = query.filter(search_filter)

        installers = query.order_by(Installer.rating.desc(), Installer.completed_projects.desc()).all()

        # Get list of unique states in DB for quick filtering dropdown
        all_states = [s[0] for s in db.query(Installer.state).distinct().all() if s[0]]

        return InstallerListResponse(
            total=len(installers),
            installers=[InstallerResponse.model_validate(inst) for inst in installers],
            states_available=sorted(all_states),
            filter_state=state
        )
