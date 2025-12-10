const { query, transaction } = require('../config/db');

// Get all programs
exports.getAllPrograms = async (req, res, next) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    
    let sql = 'SELECT * FROM programs WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND status = $${paramIndex++}`;
      params.push(status);
    }

    if (search) {
      sql += ` AND (name ILIKE $${paramIndex} OR code ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sql, params);
    
    // Get total count
    const countResult = await query('SELECT COUNT(*) FROM programs');
    
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

// Get program by ID
exports.getProgramById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM programs WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Create program
exports.createProgram = async (req, res, next) => {
  try {
    const { name, code, description, start_date, end_date, status = 'active' } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' });
    }

    const result = await query(
      `INSERT INTO programs (name, code, description, start_date, end_date, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, code, description, start_date, end_date, status]
    );

    res.status(201).json({ success: true, data: result.rows[0], message: 'Program created successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Program code already exists' });
    }
    next(error);
  }
};

// Update program
exports.updateProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, description, start_date, end_date, status } = req.body;

    const result = await query(
      `UPDATE programs 
       SET name = COALESCE($1, name),
           code = COALESCE($2, code),
           description = COALESCE($3, description),
           start_date = COALESCE($4, start_date),
           end_date = COALESCE($5, end_date),
           status = COALESCE($6, status)
       WHERE id = $7
       RETURNING *`,
      [name, code, description, start_date, end_date, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    res.json({ success: true, data: result.rows[0], message: 'Program updated successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Program code already exists' });
    }
    next(error);
  }
};

// Delete program
exports.deleteProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM programs WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Bulk upload programs
exports.bulkUploadPrograms = async (req, res, next) => {
  try {
    const { programs } = req.body;

    if (!Array.isArray(programs) || programs.length === 0) {
      return res.status(400).json({ success: false, message: 'Programs array is required' });
    }

    const results = await transaction(async (client) => {
      const inserted = [];
      const errors = [];

      for (const program of programs) {
        try {
          const result = await client.query(
            `INSERT INTO programs (name, code, description, start_date, end_date, status)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (code) DO UPDATE SET
               name = EXCLUDED.name,
               description = EXCLUDED.description,
               start_date = EXCLUDED.start_date,
               end_date = EXCLUDED.end_date,
               status = EXCLUDED.status
             RETURNING *`,
            [program.name, program.code, program.description, program.start_date, program.end_date, program.status || 'active']
          );
          inserted.push(result.rows[0]);
        } catch (err) {
          errors.push({ program: program.code, error: err.message });
        }
      }

      return { inserted, errors };
    });

    res.json({
      success: true,
      message: `${results.inserted.length} programs processed`,
      data: results.inserted,
      errors: results.errors
    });
  } catch (error) {
    next(error);
  }
};
