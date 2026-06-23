from sqlalchemy.orm import Session
from models import VibePreset
from constants.vibe_templates import VIBE_TEMPLATES

def get_builtin_presets() -> list[dict]:
    return [
        {
            "id": -idx - 1,
            "name": template["name"],
            "description": template["description"],
            "config": {
                "colors": template["colors"],
                "typography": template["typography"],
                "effects": template["effects"],
                "timing": template["timing"],
            },
            "is_builtin": True,
        }
        for idx, template in enumerate(VIBE_TEMPLATES)
    ]

def create_preset(db: Session, user_id: int, name: str, config: dict) -> int:
    preset = VibePreset(
        user_id=user_id,
        name=name,
        config=config,
    )
    db.add(preset)
    db.commit()
    db.refresh(preset)
    return preset.id

def get_presets(db: Session, user_id: int) -> list[dict]:
    user_presets = db.query(VibePreset).filter(VibePreset.user_id == user_id).all()
    result = get_builtin_presets()
    result.extend([
        {
            "id": p.id,
            "name": p.name,
            "config": p.config,
            "is_builtin": False,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        }
        for p in user_presets
    ])
    return result

def get_preset(db: Session, preset_id: int, user_id: int) -> dict | None:
    if preset_id < 0:
        builtin_list = get_builtin_presets()
        return next((t for t in builtin_list if t["id"] == preset_id), None)
    preset = db.query(VibePreset).filter(VibePreset.id == preset_id, VibePreset.user_id == user_id).first()
    return {
        "id": preset.id,
        "name": preset.name,
        "config": preset.config,
        "is_builtin": False,
    } if preset else None

def update_preset(db: Session, preset_id: int, user_id: int, name: str | None, config: dict | None) -> bool:
    preset = db.query(VibePreset).filter(VibePreset.id == preset_id, VibePreset.user_id == user_id).first()
    if not preset:
        return False
    if name:
        preset.name = name
    if config:
        preset.config = config
    db.commit()
    return True

def delete_preset(db: Session, preset_id: int, user_id: int) -> bool:
    preset = db.query(VibePreset).filter(VibePreset.id == preset_id, VibePreset.user_id == user_id).first()
    if not preset:
        return False
    db.delete(preset)
    db.commit()
    return True
