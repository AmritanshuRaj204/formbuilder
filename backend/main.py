import json
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCHEMA_DIR = os.path.join(os.path.dirname(__file__), "json_schemas")
os.makedirs(SCHEMA_DIR, exist_ok=True)

def schema_path(schema_id):
    return os.path.join(SCHEMA_DIR, f"{schema_id}.json")

@app.get("/schemas")
def get_schemas():
    schemas = []
    for fname in os.listdir(SCHEMA_DIR):
        if fname.endswith(".json"):
            with open(os.path.join(SCHEMA_DIR, fname), "r", encoding="utf-8") as f:
                data = json.load(f)
                data["id"] = fname[:-5]
                schemas.append(data)
    return schemas

@app.get("/schemas/{schema_id}")
def get_schema(schema_id: str):
    path = schema_path(schema_id)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Schema not found")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        data["id"] = schema_id
        return data

@app.post("/schemas")
def create_schema(schema: dict):
    # Use the 'framework' field as the schema_id if present, else fallback to uuid
    schema_id = schema.get("framework")
    if not schema_id:
        schema_id = str(uuid.uuid4())
    path = schema_path(schema_id)
    # Prevent overwriting existing schemas with the same name
    if os.path.exists(path):
        raise HTTPException(status_code=400, detail="Schema with this framework name already exists")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(schema, f, indent=2)
    return {"id": schema_id}

@app.put("/schemas/{schema_id}")
def update_schema(schema_id: str, schema: dict):
    path = schema_path(schema_id)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Schema not found")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(schema, f, indent=2)
    return {"status": "updated"}

@app.delete("/schemas/{schema_id}")
def delete_schema(schema_id: str):
    path = schema_path(schema_id)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Schema not found")
    os.remove(path)
    return {"status": "deleted"}

RESPONSES_DIR = os.path.join(os.path.dirname(__file__), "json_conf_responses")
os.makedirs(RESPONSES_DIR, exist_ok=True)

@app.post("/responses")
def save_response(data: dict):
    framework = data.get("framework")
    if not framework:
        raise HTTPException(status_code=400, detail="Framework name required")
    response_id = data.get("response_id") or str(uuid.uuid4())
    # Only save field-value pairs
    field_values = data.get("field_values", {})

    # Save as JSON (legacy, optional)
    json_path = os.path.join(RESPONSES_DIR, f"{framework}_{response_id}.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({"framework": framework, "field_values": field_values}, f, indent=2)

    # Save as plaintext .conf
    conf_path = os.path.join(RESPONSES_DIR, f"{framework}_{response_id}.conf")
    def write_conf_lines(d, prefix=None, lines=None):
        if lines is None:
            lines = []
        for k, v in d.items():
            if isinstance(v, dict):
                # For map fields, output as a single JSON string
                lines.append(f"{k}={json.dumps(v, ensure_ascii=False)}")
            else:
                key = f"{prefix}.{k}" if prefix else k
                lines.append(f"{key}={v}")
        return lines
    conf_lines = write_conf_lines(field_values)
    with open(conf_path, "w", encoding="utf-8") as f:
        for line in conf_lines:
            if not line.strip().startswith('#'):
                f.write(line + "\n")
    return {"status": "saved", "json_file": json_path, "conf_file": conf_path}
