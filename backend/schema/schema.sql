-- Master Data Management Database Schema
-- PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CENTRES TABLE (needed for programs)
-- =============================================
CREATE TABLE IF NOT EXISTS centres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    state_id UUID,
    district_id UUID,
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_centres_code ON centres(code);
CREATE INDEX idx_centres_is_active ON centres(is_active);

-- =============================================
-- 2. PROGRAMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    full_name VARCHAR(500),
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_programs_code ON programs(code);
CREATE INDEX idx_programs_is_active ON programs(is_active);

-- =============================================
-- 3. SECTORS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    ssc VARCHAR(255),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sectors_code ON sectors(code);
CREATE INDEX idx_sectors_is_active ON sectors(is_active);

-- =============================================
-- 4. JOB ROLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS job_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    sector_id UUID REFERENCES sectors(id) ON DELETE SET NULL,
    qp_code VARCHAR(100),
    nsqf_level INTEGER CHECK (nsqf_level BETWEEN 1 AND 10),
    training_hours INTEGER DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_roles_code ON job_roles(code);
CREATE INDEX idx_job_roles_sector_id ON job_roles(sector_id);
CREATE INDEX idx_job_roles_is_active ON job_roles(is_active);

-- =============================================
-- 5. DOCUMENT TYPES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS document_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    is_required BOOLEAN DEFAULT false,
    allowed_formats TEXT[] DEFAULT ARRAY['pdf', 'jpg', 'png'],
    max_size_kb INTEGER DEFAULT 5120,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_document_types_code ON document_types(code);
CREATE INDEX idx_document_types_category ON document_types(category);
CREATE INDEX idx_document_types_is_active ON document_types(is_active);

-- =============================================
-- 6. PROGRAM-CENTRE JUNCTION TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS program_centres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    centre_id UUID NOT NULL REFERENCES centres(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(program_id, centre_id)
);

CREATE INDEX idx_program_centres_program_id ON program_centres(program_id);
CREATE INDEX idx_program_centres_centre_id ON program_centres(centre_id);

-- =============================================
-- 7. PROGRAM-DOCUMENT JUNCTION TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS program_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    document_type_id UUID NOT NULL REFERENCES document_types(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(program_id, document_type_id)
);

CREATE INDEX idx_program_documents_program_id ON program_documents(program_id);
CREATE INDEX idx_program_documents_document_type_id ON program_documents(document_type_id);

-- =============================================
-- 8. STATES TABLE (Location Hierarchy Level 1)
-- =============================================
CREATE TABLE IF NOT EXISTS states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_states_code ON states(code);
CREATE INDEX idx_states_is_active ON states(is_active);

-- =============================================
-- 9. DISTRICTS TABLE (Location Hierarchy Level 2)
-- =============================================
CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_districts_code ON districts(code);
CREATE INDEX idx_districts_state_id ON districts(state_id);
CREATE INDEX idx_districts_is_active ON districts(is_active);

-- =============================================
-- 10. BLOCKS TABLE (Location Hierarchy Level 3)
-- =============================================
CREATE TABLE IF NOT EXISTS blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(30) UNIQUE NOT NULL,
    district_id UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blocks_code ON blocks(code);
CREATE INDEX idx_blocks_district_id ON blocks(district_id);
CREATE INDEX idx_blocks_is_active ON blocks(is_active);

-- =============================================
-- 11. PANCHAYATS TABLE (Location Hierarchy Level 4)
-- =============================================
CREATE TABLE IF NOT EXISTS panchayats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(40) UNIQUE NOT NULL,
    block_id UUID NOT NULL REFERENCES blocks(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_panchayats_code ON panchayats(code);
CREATE INDEX idx_panchayats_block_id ON panchayats(block_id);
CREATE INDEX idx_panchayats_is_active ON panchayats(is_active);

-- =============================================
-- 12. VILLAGES TABLE (Location Hierarchy Level 5)
-- =============================================
CREATE TABLE IF NOT EXISTS villages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    panchayat_id UUID NOT NULL REFERENCES panchayats(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_villages_code ON villages(code);
CREATE INDEX idx_villages_panchayat_id ON villages(panchayat_id);
CREATE INDEX idx_villages_is_active ON villages(is_active);

-- =============================================
-- 13. PINCODES TABLE (Location Hierarchy Level 6)
-- =============================================
CREATE TABLE IF NOT EXISTS pincodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) NOT NULL,
    area VARCHAR(255),
    village_id UUID REFERENCES villages(id) ON DELETE SET NULL,
    district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
    state_id UUID REFERENCES states(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pincodes_code ON pincodes(code);
CREATE INDEX idx_pincodes_village_id ON pincodes(village_id);
CREATE INDEX idx_pincodes_district_id ON pincodes(district_id);
CREATE INDEX idx_pincodes_is_active ON pincodes(is_active);

-- Add foreign keys to centres after states/districts exist
ALTER TABLE centres ADD CONSTRAINT fk_centres_state FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE SET NULL;
ALTER TABLE centres ADD CONSTRAINT fk_centres_district FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL;

-- =============================================
-- UPDATE TIMESTAMP TRIGGER FUNCTION
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_centres_updated_at BEFORE UPDATE ON centres FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sectors_updated_at BEFORE UPDATE ON sectors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_roles_updated_at BEFORE UPDATE ON job_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_types_updated_at BEFORE UPDATE ON document_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_states_updated_at BEFORE UPDATE ON states FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_districts_updated_at BEFORE UPDATE ON districts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blocks_updated_at BEFORE UPDATE ON blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_panchayats_updated_at BEFORE UPDATE ON panchayats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_villages_updated_at BEFORE UPDATE ON villages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pincodes_updated_at BEFORE UPDATE ON pincodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (Optional)
-- =============================================
INSERT INTO states (name, code) VALUES 
    ('Maharashtra', 'MH'),
    ('Karnataka', 'KA'),
    ('Tamil Nadu', 'TN'),
    ('Gujarat', 'GJ'),
    ('Rajasthan', 'RJ')
ON CONFLICT (code) DO NOTHING;

INSERT INTO sectors (name, code, ssc, description) VALUES 
    ('Information Technology', 'IT', 'NASSCOM', 'IT and ITES sector'),
    ('Healthcare', 'HC', 'HSSC', 'Healthcare and allied services'),
    ('Retail', 'RT', 'RASCI', 'Retail sector skills'),
    ('Agriculture', 'AG', 'ASCI', 'Agriculture and allied sectors'),
    ('Electronics', 'EL', 'ESSCI', 'Electronics manufacturing')
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- 14. WORK ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_no VARCHAR(50) UNIQUE NOT NULL,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_target INTEGER NOT NULL,
    
    -- Category-wise targets (optional)
    target_sc INTEGER DEFAULT 0,
    target_st INTEGER DEFAULT 0,
    target_obc INTEGER DEFAULT 0,
    target_general INTEGER DEFAULT 0,
    target_minority INTEGER DEFAULT 0,
    
    -- Location (optional)
    state_id UUID REFERENCES states(id) ON DELETE SET NULL,
    district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
    
    -- Assigned National Head (from user management)
    assigned_national_head_id UUID,
    assigned_national_head_name VARCHAR(255),
    
    status VARCHAR(20) DEFAULT 'active',
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_work_orders_work_order_no ON work_orders(work_order_no);
CREATE INDEX idx_work_orders_program_id ON work_orders(program_id);
CREATE INDEX idx_work_orders_state_id ON work_orders(state_id);
CREATE INDEX idx_work_orders_assigned_national_head_id ON work_orders(assigned_national_head_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);

CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
