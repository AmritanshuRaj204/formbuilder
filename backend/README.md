# Dynamic Form Generator Backend

This is a FastAPI backend for your Angular dynamic form generator project. It uses simple JSON file storage (no database required).

## Setup

1. Install Python 3.8+
2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/Mac:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   # Or if uvicorn is not found:
   python -m uvicorn main:app --reload
   ```

## API Endpoints
- `GET /schemas` — List all schemas/frameworks
- `GET /schemas/{id}` — Get a specific schema
- `POST /schemas` — Add a new schema
- `PUT /schemas/{id}` — Update a schema
- `DELETE /schemas/{id}` — Delete a schema

## Notes
- Schemas are stored as JSON files in the `json_schemas/` folder inside `backend/`.
- No database is required. All changes are persistent as long as files are not deleted.
- CORS is enabled for all origins for development. Restrict in production.
