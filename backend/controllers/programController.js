const { query, transaction } = require('../config/db');

// Get all programs with centres and documents
exports.getAllPrograms = async (req, res, next) => {
  try {
    const { is_active, search, limit = 50, offset = 0 } = req.query;
    
    let sql = `
      SELECT p.*,
        COALESCE(
          (SELECT json_agg(json_build_object('id', c.id, 'name', c.name, 'code', c.code))
           FROM program_centres pc
           JOIN centres c ON pc.centre_id = c.id
           WHERE pc.program_id = p.id), '[]'
        ) as centres,
        COALESCE(
          (SELECT json_agg(json_build_object('id', dt.id, 'name', dt.name, 'code', dt.code))
           FROM program_documents pd
           JOIN document_types dt ON pd.document_type_id = dt.id
           WHERE pd.program_id = p.id), '[]'
        ) as required_documents
      FROM programs p
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (is_active !== undefined) {
      sql += ` AND p.is_active = $${paramIndex++}`;
      params.push(is_active === 'true');
    }

    if (search) {
      sql += ` AND (p.name ILIKE $${paramIndex} OR p.code ILIKE $${paramIndex} OR p.full_name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    sql += ` ORDER BY p.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sql, params);
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
    const result = await query(`
      SELECT p.*,
        COALESCE(
          (SELECT json_agg(json_build_object('id', c.id, 'name', c.name, 'code', c.code))
           FROM program_centres pc
           JOIN centres c ON pc.centre_id = c.id
           WHERE pc.program_id = p.id), '[]'
        ) as centres,
        COALESCE(
          (SELECT json_agg(json_build_object('id', dt.id, 'name', dt.name, 'code', dt.code))
           FROM program_documents pd
           JOIN document_types dt ON pd.document_type_id = dt.id
           WHERE pd.program_id = p.id), '[]'
        ) as required_documents
      FROM programs p
      WHERE p.id = $1
    `, [id]);
    
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
    const { code, name, fullName, centreIds, requiredDocuments, isActive = true } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' });
    }

    const result = await transaction(async (client) => {
      // Insert program
      const programResult = await client.query(
        `INSERT INTO programs (code, name, full_name, is_active)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [code, name, fullName, isActive]
      );
      const program = programResult.rows[0];

      // Insert centre mappings
      if (centreIds && centreIds.length > 0) {
        for (const centreId of centreIds) {
          await client.query(
            'INSERT INTO program_centres (program_id, centre_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [program.id, centreId]
          );
        }
      }

      // Insert document mappings
      if (requiredDocuments && requiredDocuments.length > 0) {
        for (const docId of requiredDocuments) {
          await client.query(
            'INSERT INTO program_documents (program_id, document_type_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [program.id, docId]
          );
        }
      }

      return program;
    });

    res.status(201).json({ success: true, data: result, message: 'Program created successfully' });
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
    const { code, name, fullName, centreIds, requiredDocuments, isActive } = req.body;

    const result = await transaction(async (client) => {
      // Update program
      const programResult = await client.query(
        `UPDATE programs 
         SET code = COALESCE($1, code),
             name = COALESCE($2, name),
             full_name = COALESCE($3, full_name),
             is_active = COALESCE($4, is_active)
         WHERE id = $5
         RETURNING *`,
        [code, name, fullName, isActive, id]
      );

      if (programResult.rows.length === 0) {
        throw new Error('Program not found');
      }

      // Update centre mappings if provided
      if (centreIds !== undefined) {
        await client.query('DELETE FROM program_centres WHERE program_id = $1', [id]);
        for (const centreId of centreIds) {
          await client.query(
            'INSERT INTO program_centres (program_id, centre_id) VALUES ($1, $2)',
            [id, centreId]
          );
        }
      }

      // Update document mappings if provided
      if (requiredDocuments !== undefined) {
        await client.query('DELETE FROM program_documents WHERE program_id = $1', [id]);
        for (const docId of requiredDocuments) {
          await client.query(
            'INSERT INTO program_documents (program_id, document_type_id) VALUES ($1, $2)',
            [id, docId]
          );
        }
      }

      return programResult.rows[0];
    });

    res.json({ success: true, data: result, message: 'Program updated successfully' });
  } catch (error) {
    if (error.message === 'Program not found') {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
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
            `INSERT INTO programs (code, name, full_name, is_active)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (code) DO UPDATE SET
               name = EXCLUDED.name,
               full_name = EXCLUDED.full_name,
               is_active = EXCLUDED.is_active
             RETURNING *`,
            [program.code, program.name, program.fullName, program.isActive ?? true]
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
