const { query, transaction } = require('../config/db');

// =============================================
// STATES
// =============================================
exports.getAllStates = async (req, res, next) => {
  try {
    const { is_active, search } = req.query;
    let sql = 'SELECT * FROM states WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (is_active !== undefined) {
      sql += ` AND is_active = $${paramIndex++}`;
      params.push(is_active === 'true');
    }
    if (search) {
      sql += ` AND (name ILIKE $${paramIndex} OR code ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY name ASC';

    const result = await query(sql, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.getStateById = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM states WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'State not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// UI params: name, code, isActive
exports.createState = async (req, res, next) => {
  try {
    const { name, code, isActive = true } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' });
    }
    const result = await query(
      'INSERT INTO states (name, code, is_active) VALUES ($1, $2, $3) RETURNING *',
      [name, code, isActive]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'State created successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'State code already exists' });
    }
    next(error);
  }
};

exports.updateState = async (req, res, next) => {
  try {
    const { name, code, isActive } = req.body;
    const result = await query(
      `UPDATE states SET name = COALESCE($1, name), code = COALESCE($2, code), is_active = COALESCE($3, is_active) WHERE id = $4 RETURNING *`,
      [name, code, isActive, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'State not found' });
    }
    res.json({ success: true, data: result.rows[0], message: 'State updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteState = async (req, res, next) => {
  try {
    const result = await query('DELETE FROM states WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'State not found' });
    }
    res.json({ success: true, message: 'State deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.bulkUploadStates = async (req, res, next) => {
  try {
    const { states } = req.body;
    if (!Array.isArray(states)) {
      return res.status(400).json({ success: false, message: 'States array is required' });
    }
    const results = await transaction(async (client) => {
      const inserted = [];
      for (const state of states) {
        const result = await client.query(
          'INSERT INTO states (name, code, is_active) VALUES ($1, $2, $3) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, is_active = EXCLUDED.is_active RETURNING *',
          [state.name, state.code, state.isActive ?? true]
        );
        inserted.push(result.rows[0]);
      }
      return inserted;
    });
    res.json({ success: true, data: results, message: `${results.length} states processed` });
  } catch (error) {
    next(error);
  }
};

// =============================================
// DISTRICTS
// =============================================
exports.getAllDistricts = async (req, res, next) => {
  try {
    const { state_id, is_active, search } = req.query;
    let sql = `SELECT d.*, s.name as state_name FROM districts d JOIN states s ON d.state_id = s.id WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (state_id) {
      sql += ` AND d.state_id = $${paramIndex++}`;
      params.push(state_id);
    }
    if (is_active !== undefined) {
      sql += ` AND d.is_active = $${paramIndex++}`;
      params.push(is_active === 'true');
    }
    if (search) {
      sql += ` AND (d.name ILIKE $${paramIndex} OR d.code ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY d.name ASC';

    const result = await query(sql, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.getDistrictById = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT d.*, s.name as state_name FROM districts d JOIN states s ON d.state_id = s.id WHERE d.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'District not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.getDistrictsByState = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM districts WHERE state_id = $1 AND is_active = true ORDER BY name ASC',
      [req.params.stateId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

// UI params: name, code, stateId, isActive
exports.createDistrict = async (req, res, next) => {
  try {
    const { name, code, stateId, isActive = true } = req.body;
    if (!name || !code || !stateId) {
      return res.status(400).json({ success: false, message: 'Name, code, and stateId are required' });
    }
    const result = await query(
      'INSERT INTO districts (name, code, state_id, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, code, stateId, isActive]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'District created successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'District code already exists' });
    }
    next(error);
  }
};

exports.updateDistrict = async (req, res, next) => {
  try {
    const { name, code, stateId, isActive } = req.body;
    const result = await query(
      `UPDATE districts SET name = COALESCE($1, name), code = COALESCE($2, code), state_id = COALESCE($3, state_id), is_active = COALESCE($4, is_active) WHERE id = $5 RETURNING *`,
      [name, code, stateId, isActive, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'District not found' });
    }
    res.json({ success: true, data: result.rows[0], message: 'District updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteDistrict = async (req, res, next) => {
  try {
    const result = await query('DELETE FROM districts WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'District not found' });
    }
    res.json({ success: true, message: 'District deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.bulkUploadDistricts = async (req, res, next) => {
  try {
    const { districts } = req.body;
    if (!Array.isArray(districts)) {
      return res.status(400).json({ success: false, message: 'Districts array is required' });
    }
    const results = await transaction(async (client) => {
      const inserted = [];
      for (const district of districts) {
        const result = await client.query(
          'INSERT INTO districts (name, code, state_id, is_active) VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, state_id = EXCLUDED.state_id, is_active = EXCLUDED.is_active RETURNING *',
          [district.name, district.code, district.stateId, district.isActive ?? true]
        );
        inserted.push(result.rows[0]);
      }
      return inserted;
    });
    res.json({ success: true, data: results, message: `${results.length} districts processed` });
  } catch (error) {
    next(error);
  }
};

// =============================================
// BLOCKS
// =============================================
exports.getAllBlocks = async (req, res, next) => {
  try {
    const { district_id, is_active, search } = req.query;
    let sql = `SELECT b.*, d.name as district_name, s.name as state_name FROM blocks b JOIN districts d ON b.district_id = d.id JOIN states s ON d.state_id = s.id WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (district_id) {
      sql += ` AND b.district_id = $${paramIndex++}`;
      params.push(district_id);
    }
    if (is_active !== undefined) {
      sql += ` AND b.is_active = $${paramIndex++}`;
      params.push(is_active === 'true');
    }
    if (search) {
      sql += ` AND (b.name ILIKE $${paramIndex} OR b.code ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY b.name ASC';

    const result = await query(sql, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.getBlockById = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT b.*, d.name as district_name FROM blocks b JOIN districts d ON b.district_id = d.id WHERE b.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Block not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.getBlocksByDistrict = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM blocks WHERE district_id = $1 AND is_active = true ORDER BY name ASC',
      [req.params.districtId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

// UI params: name, code, districtId, isActive
exports.createBlock = async (req, res, next) => {
  try {
    const { name, code, districtId, isActive = true } = req.body;
    if (!name || !code || !districtId) {
      return res.status(400).json({ success: false, message: 'Name, code, and districtId are required' });
    }
    const result = await query(
      'INSERT INTO blocks (name, code, district_id, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, code, districtId, isActive]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'Block created successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Block code already exists' });
    }
    next(error);
  }
};

exports.updateBlock = async (req, res, next) => {
  try {
    const { name, code, districtId, isActive } = req.body;
    const result = await query(
      `UPDATE blocks SET name = COALESCE($1, name), code = COALESCE($2, code), district_id = COALESCE($3, district_id), is_active = COALESCE($4, is_active) WHERE id = $5 RETURNING *`,
      [name, code, districtId, isActive, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Block not found' });
    }
    res.json({ success: true, data: result.rows[0], message: 'Block updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteBlock = async (req, res, next) => {
  try {
    const result = await query('DELETE FROM blocks WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Block not found' });
    }
    res.json({ success: true, message: 'Block deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.bulkUploadBlocks = async (req, res, next) => {
  try {
    const { blocks } = req.body;
    if (!Array.isArray(blocks)) {
      return res.status(400).json({ success: false, message: 'Blocks array is required' });
    }
    const results = await transaction(async (client) => {
      const inserted = [];
      for (const block of blocks) {
        const result = await client.query(
          'INSERT INTO blocks (name, code, district_id, is_active) VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, district_id = EXCLUDED.district_id, is_active = EXCLUDED.is_active RETURNING *',
          [block.name, block.code, block.districtId, block.isActive ?? true]
        );
        inserted.push(result.rows[0]);
      }
      return inserted;
    });
    res.json({ success: true, data: results, message: `${results.length} blocks processed` });
  } catch (error) {
    next(error);
  }
};

// =============================================
// PANCHAYATS
// =============================================
exports.getAllPanchayats = async (req, res, next) => {
  try {
    const { block_id, is_active, search } = req.query;
    let sql = `SELECT p.*, b.name as block_name FROM panchayats p JOIN blocks b ON p.block_id = b.id WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (block_id) {
      sql += ` AND p.block_id = $${paramIndex++}`;
      params.push(block_id);
    }
    if (is_active !== undefined) {
      sql += ` AND p.is_active = $${paramIndex++}`;
      params.push(is_active === 'true');
    }
    if (search) {
      sql += ` AND (p.name ILIKE $${paramIndex} OR p.code ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY p.name ASC';

    const result = await query(sql, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.getPanchayatById = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT p.*, b.name as block_name FROM panchayats p JOIN blocks b ON p.block_id = b.id WHERE p.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Panchayat not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.getPanchayatsByBlock = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM panchayats WHERE block_id = $1 AND is_active = true ORDER BY name ASC',
      [req.params.blockId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

// UI params: name, code, blockId, isActive
exports.createPanchayat = async (req, res, next) => {
  try {
    const { name, code, blockId, isActive = true } = req.body;
    if (!name || !code || !blockId) {
      return res.status(400).json({ success: false, message: 'Name, code, and blockId are required' });
    }
    const result = await query(
      'INSERT INTO panchayats (name, code, block_id, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, code, blockId, isActive]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'Panchayat created successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Panchayat code already exists' });
    }
    next(error);
  }
};

exports.updatePanchayat = async (req, res, next) => {
  try {
    const { name, code, blockId, isActive } = req.body;
    const result = await query(
      `UPDATE panchayats SET name = COALESCE($1, name), code = COALESCE($2, code), block_id = COALESCE($3, block_id), is_active = COALESCE($4, is_active) WHERE id = $5 RETURNING *`,
      [name, code, blockId, isActive, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Panchayat not found' });
    }
    res.json({ success: true, data: result.rows[0], message: 'Panchayat updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deletePanchayat = async (req, res, next) => {
  try {
    const result = await query('DELETE FROM panchayats WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Panchayat not found' });
    }
    res.json({ success: true, message: 'Panchayat deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.bulkUploadPanchayats = async (req, res, next) => {
  try {
    const { panchayats } = req.body;
    if (!Array.isArray(panchayats)) {
      return res.status(400).json({ success: false, message: 'Panchayats array is required' });
    }
    const results = await transaction(async (client) => {
      const inserted = [];
      for (const panchayat of panchayats) {
        const result = await client.query(
          'INSERT INTO panchayats (name, code, block_id, is_active) VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, block_id = EXCLUDED.block_id, is_active = EXCLUDED.is_active RETURNING *',
          [panchayat.name, panchayat.code, panchayat.blockId, panchayat.isActive ?? true]
        );
        inserted.push(result.rows[0]);
      }
      return inserted;
    });
    res.json({ success: true, data: results, message: `${results.length} panchayats processed` });
  } catch (error) {
    next(error);
  }
};

// =============================================
// VILLAGES
// =============================================
exports.getAllVillages = async (req, res, next) => {
  try {
    const { panchayat_id, is_active, search } = req.query;
    let sql = `SELECT v.*, p.name as panchayat_name FROM villages v JOIN panchayats p ON v.panchayat_id = p.id WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (panchayat_id) {
      sql += ` AND v.panchayat_id = $${paramIndex++}`;
      params.push(panchayat_id);
    }
    if (is_active !== undefined) {
      sql += ` AND v.is_active = $${paramIndex++}`;
      params.push(is_active === 'true');
    }
    if (search) {
      sql += ` AND (v.name ILIKE $${paramIndex} OR v.code ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY v.name ASC';

    const result = await query(sql, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.getVillageById = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT v.*, p.name as panchayat_name FROM villages v JOIN panchayats p ON v.panchayat_id = p.id WHERE v.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Village not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.getVillagesByPanchayat = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM villages WHERE panchayat_id = $1 AND is_active = true ORDER BY name ASC',
      [req.params.panchayatId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

// UI params: name, code, panchayatId, isActive
exports.createVillage = async (req, res, next) => {
  try {
    const { name, code, panchayatId, isActive = true } = req.body;
    if (!name || !code || !panchayatId) {
      return res.status(400).json({ success: false, message: 'Name, code, and panchayatId are required' });
    }
    const result = await query(
      'INSERT INTO villages (name, code, panchayat_id, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, code, panchayatId, isActive]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'Village created successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Village code already exists' });
    }
    next(error);
  }
};

exports.updateVillage = async (req, res, next) => {
  try {
    const { name, code, panchayatId, isActive } = req.body;
    const result = await query(
      `UPDATE villages SET name = COALESCE($1, name), code = COALESCE($2, code), panchayat_id = COALESCE($3, panchayat_id), is_active = COALESCE($4, is_active) WHERE id = $5 RETURNING *`,
      [name, code, panchayatId, isActive, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Village not found' });
    }
    res.json({ success: true, data: result.rows[0], message: 'Village updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteVillage = async (req, res, next) => {
  try {
    const result = await query('DELETE FROM villages WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Village not found' });
    }
    res.json({ success: true, message: 'Village deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.bulkUploadVillages = async (req, res, next) => {
  try {
    const { villages } = req.body;
    if (!Array.isArray(villages)) {
      return res.status(400).json({ success: false, message: 'Villages array is required' });
    }
    const results = await transaction(async (client) => {
      const inserted = [];
      for (const village of villages) {
        const result = await client.query(
          'INSERT INTO villages (name, code, panchayat_id, is_active) VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, panchayat_id = EXCLUDED.panchayat_id, is_active = EXCLUDED.is_active RETURNING *',
          [village.name, village.code, village.panchayatId, village.isActive ?? true]
        );
        inserted.push(result.rows[0]);
      }
      return inserted;
    });
    res.json({ success: true, data: results, message: `${results.length} villages processed` });
  } catch (error) {
    next(error);
  }
};

// =============================================
// PINCODES
// =============================================
exports.getAllPincodes = async (req, res, next) => {
  try {
    const { village_id, district_id, is_active, search } = req.query;
    let sql = `SELECT * FROM pincodes WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (village_id) {
      sql += ` AND village_id = $${paramIndex++}`;
      params.push(village_id);
    }
    if (district_id) {
      sql += ` AND district_id = $${paramIndex++}`;
      params.push(district_id);
    }
    if (is_active !== undefined) {
      sql += ` AND is_active = $${paramIndex++}`;
      params.push(is_active === 'true');
    }
    if (search) {
      sql += ` AND (code ILIKE $${paramIndex} OR area ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY code ASC';

    const result = await query(sql, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

exports.getPincodeById = async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM pincodes WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pincode not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

exports.searchByPincode = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT * FROM pincodes WHERE code = $1 AND is_active = true',
      [req.params.pincode]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

// UI params: code, area, villageId, districtId, stateId, isActive
exports.createPincode = async (req, res, next) => {
  try {
    const { code, area, villageId, districtId, stateId, isActive = true } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Pincode code is required' });
    }
    const result = await query(
      'INSERT INTO pincodes (code, area, village_id, district_id, state_id, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [code, area, villageId, districtId, stateId, isActive]
    );
    res.status(201).json({ success: true, data: result.rows[0], message: 'Pincode created successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updatePincode = async (req, res, next) => {
  try {
    const { code, area, villageId, districtId, stateId, isActive } = req.body;
    const result = await query(
      `UPDATE pincodes SET code = COALESCE($1, code), area = COALESCE($2, area), village_id = COALESCE($3, village_id), district_id = COALESCE($4, district_id), state_id = COALESCE($5, state_id), is_active = COALESCE($6, is_active) WHERE id = $7 RETURNING *`,
      [code, area, villageId, districtId, stateId, isActive, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pincode not found' });
    }
    res.json({ success: true, data: result.rows[0], message: 'Pincode updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deletePincode = async (req, res, next) => {
  try {
    const result = await query('DELETE FROM pincodes WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pincode not found' });
    }
    res.json({ success: true, message: 'Pincode deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.bulkUploadPincodes = async (req, res, next) => {
  try {
    const { pincodes } = req.body;
    if (!Array.isArray(pincodes)) {
      return res.status(400).json({ success: false, message: 'Pincodes array is required' });
    }
    const results = await transaction(async (client) => {
      const inserted = [];
      for (const pin of pincodes) {
        const result = await client.query(
          'INSERT INTO pincodes (code, area, village_id, district_id, state_id, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [pin.code, pin.area, pin.villageId, pin.districtId, pin.stateId, pin.isActive ?? true]
        );
        inserted.push(result.rows[0]);
      }
      return inserted;
    });
    res.json({ success: true, data: results, message: `${results.length} pincodes processed` });
  } catch (error) {
    next(error);
  }
};
