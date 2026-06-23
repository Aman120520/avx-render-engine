from pydantic import BaseModel

class PresetConfig(BaseModel):
    colors: dict
    typography: dict
    effects: dict
    timing: dict

class PresetCreate(BaseModel):
    name: str
    config: PresetConfig

class PresetUpdate(BaseModel):
    name: str | None = None
    config: PresetConfig | None = None

class PresetResponse(BaseModel):
    id: int
    name: str
    config: dict
    is_builtin: bool = False
    created_at: str | None = None

    class Config:
        from_attributes = True

class RenderRequest(BaseModel):
    preset_id: int
    enabled_hooks: list[int]

class RenderStatusResponse(BaseModel):
    job_id: int
    status: str
    progress: int
    output_path: str | None = None
    error_message: str | None = None

    class Config:
        from_attributes = True
