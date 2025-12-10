const { query, transaction } = require('../config/db');

// Get all sectors
exports.getAllSectors = async (req, res, next) => {
  try {
    const { is_active, search, limit = 50, offset = 0 } = req.query;
    
    let sql = 'SELECT * FROM sectors WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (is_active !== undefined) {
      sql += ` AND is_active = $${paramIndex++}`;
      params.push(is_active === 'true');
    }

    if (search) {
      sql += ` AND (name ILIKE $${paramIndex} OR code ILIKE $${paramIndex} OR ssc ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    sql += ` ORDER BY name ASC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sql, params);
    const countResult = await query('SELECT COUNT(*) FROM sectors');

    res.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    next(error);
  }
};

// Get sector by ID
exports.getSectorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM sectors WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sector not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Create sector
exports.createSector = async (req, res, next) => {
  try {
    const { name, code, ssc, description, is_active = true } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' });
    }

    const result = await query(
      `INSERT INTO sectors (name, code, ssc, description, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, code, ssc, description, is_active]
    );

    res.status(201).json({ success: true, data: result.rows[0], message: 'Sector created successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Sector code already exists' });
    }
    next(error);
  }
};

// Update sector
exports.updateSector = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, ssc, description, is_active } = req.body;

    const result = await query(
      `UPDATE sectors 
       SET name = COALESCE($1, name),
           code = COALESCE($2, code),
           ssc = COALESCE($3, ssc),
           description = COALESCE($4, description),
           is_active = COALESCE($5, is_active)
       WHERE id = $6
       RETURNING *`,
      [name, code, ssc, description, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sector not found' });
    }

    res.json({ success: true, data: result.rows[0], message: 'Sector updated successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Sector code already exists' });
    }
    next(error);
  }
};

// Delete sector
exports.deleteSector = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM sectors WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sector not found' });
    }

    res.json({ success: true, message: 'Sector deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Bulk upload sectors
exports.bulkUploadSectors = async (req, res, next) => {
  try {
    const { sectors } = req.body;

    if (!Array.isArray(sectors) || sectors.length === 0) {
      return res.status(400).json({ success: false, message: 'Sectors array is required' });
    }

    const results = await transaction(async (client) => {
      const inserted = [];
      const errors = [];

      for (const sector of sectors) {
        try {
          const result = await client.query(
            `INSERT INTO sectors (name, code, ssc, description, is_active)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (code) DO UPDATE SET
               name = EXCLUDED.name,
               ssc = EXCLUDED.ssc,
               description = EXCLUDED.description,
               is_active = EXCLUDED.is_active
             RETURNING *`,
            [sector.name, sector.code, sector.ssc, sector.description, sector.is_active ?? true]
          );
          inserted.push(result.rows[0]);
        } catch (err) {
          errors.push({ sector: sector.code, error: err.message });
        }
      }

      return { inserted, errors };
    });

    res.json({
      success: true,
      message: `${results.inserted.length} sectors processed`,
      data: results.inserted,
      errors: results.errors
    });
  } catch (error) {
    next(error);
  }
};
