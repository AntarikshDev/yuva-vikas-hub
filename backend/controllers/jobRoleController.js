const { query, transaction } = require('../config/db');

// Get all job roles
exports.getAllJobRoles = async (req, res, next) => {
  try {
    const { is_active, sector_id, search, limit = 50, offset = 0 } = req.query;
    
    let sql = `
      SELECT jr.*, s.name as sector_name 
      FROM job_roles jr
      LEFT JOIN sectors s ON jr.sector_id = s.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (is_active !== undefined) {
      sql += ` AND jr.is_active = $${paramIndex++}`;
      params.push(is_active === 'true');
    }

    if (sector_id) {
      sql += ` AND jr.sector_id = $${paramIndex++}`;
      params.push(sector_id);
    }

    if (search) {
      sql += ` AND (jr.name ILIKE $${paramIndex} OR jr.code ILIKE $${paramIndex} OR jr.qp_code ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    sql += ` ORDER BY jr.name ASC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sql, params);
    const countResult = await query('SELECT COUNT(*) FROM job_roles');

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

// Get job role by ID
exports.getJobRoleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT jr.*, s.name as sector_name 
       FROM job_roles jr
       LEFT JOIN sectors s ON jr.sector_id = s.id
       WHERE jr.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job role not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Get job roles by sector
exports.getJobRolesBySector = async (req, res, next) => {
  try {
    const { sectorId } = req.params;
    const result = await query(
      'SELECT * FROM job_roles WHERE sector_id = $1 AND is_active = true ORDER BY name ASC',
      [sectorId]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

// Create job role
exports.createJobRole = async (req, res, next) => {
  try {
    const { name, code, sector_id, qp_code, nsqf_level, description, is_active = true } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' });
    }

    const result = await query(
      `INSERT INTO job_roles (name, code, sector_id, qp_code, nsqf_level, description, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, code, sector_id, qp_code, nsqf_level, description, is_active]
    );

    res.status(201).json({ success: true, data: result.rows[0], message: 'Job role created successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Job role code already exists' });
    }
    next(error);
  }
};

// Update job role
exports.updateJobRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, sector_id, qp_code, nsqf_level, description, is_active } = req.body;

    const result = await query(
      `UPDATE job_roles 
       SET name = COALESCE($1, name),
           code = COALESCE($2, code),
           sector_id = COALESCE($3, sector_id),
           qp_code = COALESCE($4, qp_code),
           nsqf_level = COALESCE($5, nsqf_level),
           description = COALESCE($6, description),
           is_active = COALESCE($7, is_active)
       WHERE id = $8
       RETURNING *`,
      [name, code, sector_id, qp_code, nsqf_level, description, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job role not found' });
    }

    res.json({ success: true, data: result.rows[0], message: 'Job role updated successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Job role code already exists' });
    }
    next(error);
  }
};

// Delete job role
exports.deleteJobRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM job_roles WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Job role not found' });
    }

    res.json({ success: true, message: 'Job role deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Bulk upload job roles
exports.bulkUploadJobRoles = async (req, res, next) => {
  try {
    const { jobRoles } = req.body;

    if (!Array.isArray(jobRoles) || jobRoles.length === 0) {
      return res.status(400).json({ success: false, message: 'Job roles array is required' });
    }

    const results = await transaction(async (client) => {
      const inserted = [];
      const errors = [];

      for (const role of jobRoles) {
        try {
          const result = await client.query(
            `INSERT INTO job_roles (name, code, sector_id, qp_code, nsqf_level, description, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (code) DO UPDATE SET
               name = EXCLUDED.name,
               sector_id = EXCLUDED.sector_id,
               qp_code = EXCLUDED.qp_code,
               nsqf_level = EXCLUDED.nsqf_level,
               description = EXCLUDED.description,
               is_active = EXCLUDED.is_active
             RETURNING *`,
            [role.name, role.code, role.sector_id, role.qp_code, role.nsqf_level, role.description, role.is_active ?? true]
          );
          inserted.push(result.rows[0]);
        } catch (err) {
          errors.push({ jobRole: role.code, error: err.message });
        }
      }

      return { inserted, errors };
    });

    res.json({
      success: true,
      message: `${results.inserted.length} job roles processed`,
      data: results.inserted,
      errors: results.errors
    });
  } catch (error) {
    next(error);
  }
};
