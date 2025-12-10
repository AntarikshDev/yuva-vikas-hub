# Master Data Management API

A Node.js/Express REST API for managing master data including Programs, Locations, Sectors, Job Roles, and Document Types.

## Tables Created

| # | Table Name | Description |
|---|------------|-------------|
| 1 | `programs` | Training programs with code, dates, status |
| 2 | `sectors` | Industry sectors with SSC (Sector Skill Council) |
| 3 | `job_roles` | Job roles linked to sectors with QP code & NSQF level |
| 4 | `document_types` | Document types with category & mandatory flag |
| 5 | `states` | Indian states (Location Level 1) |
| 6 | `districts` | Districts under states (Location Level 2) |
| 7 | `blocks` | Blocks under districts (Location Level 3) |
| 8 | `panchayats` | Panchayats under blocks (Location Level 4) |
| 9 | `villages` | Villages under panchayats (Location Level 5) |
| 10 | `pincodes` | Pincodes linked to villages/districts (Location Level 6) |

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Setup Database
```bash
# Connect to PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE master_data_db;"

# Run schema
psql -U postgres -d master_data_db -f schema/schema.sql
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Programs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/programs` | Get all programs |
| GET | `/api/programs/:id` | Get program by ID |
| POST | `/api/programs` | Create program |
| PUT | `/api/programs/:id` | Update program |
| DELETE | `/api/programs/:id` | Delete program |
| POST | `/api/programs/bulk` | Bulk upload programs |

### Locations (States, Districts, Blocks, Panchayats, Villages, Pincodes)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations/states` | Get all states |
| GET | `/api/locations/districts` | Get all districts |
| GET | `/api/locations/districts/state/:stateId` | Get districts by state |
| GET | `/api/locations/blocks` | Get all blocks |
| GET | `/api/locations/blocks/district/:districtId` | Get blocks by district |
| GET | `/api/locations/panchayats` | Get all panchayats |
| GET | `/api/locations/villages` | Get all villages |
| GET | `/api/locations/pincodes` | Get all pincodes |
| POST | `/api/locations/{entity}` | Create entity |
| PUT | `/api/locations/{entity}/:id` | Update entity |
| DELETE | `/api/locations/{entity}/:id` | Delete entity |
| POST | `/api/locations/{entity}/bulk` | Bulk upload |

### Sectors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sectors` | Get all sectors |
| GET | `/api/sectors/:id` | Get sector by ID |
| POST | `/api/sectors` | Create sector |
| PUT | `/api/sectors/:id` | Update sector |
| DELETE | `/api/sectors/:id` | Delete sector |
| POST | `/api/sectors/bulk` | Bulk upload sectors |

### Job Roles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/job-roles` | Get all job roles |
| GET | `/api/job-roles/:id` | Get job role by ID |
| GET | `/api/job-roles/sector/:sectorId` | Get roles by sector |
| POST | `/api/job-roles` | Create job role |
| PUT | `/api/job-roles/:id` | Update job role |
| DELETE | `/api/job-roles/:id` | Delete job role |
| POST | `/api/job-roles/bulk` | Bulk upload job roles |

### Document Types
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/document-types` | Get all document types |
| GET | `/api/document-types/:id` | Get document type by ID |
| GET | `/api/document-types/category/:category` | Get by category |
| POST | `/api/document-types` | Create document type |
| PUT | `/api/document-types/:id` | Update document type |
| DELETE | `/api/document-types/:id` | Delete document type |
| POST | `/api/document-types/bulk` | Bulk upload document types |

## Query Parameters

All list endpoints support:
- `search` - Search by name/code
- `is_active` - Filter by active status (true/false)
- `limit` - Pagination limit (default: 50)
- `offset` - Pagination offset (default: 0)

## Response Format

```json
{
  "success": true,
  "data": [...],
  "total": 100,
  "limit": 50,
  "offset": 0,
  "message": "Success message"
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```
