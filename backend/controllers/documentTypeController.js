const { query, transaction } = require('../config/db');

// Get all document types
exports.getAllDocumentTypes = async (req, res, next) => {
  try {
    const { is_active, category, is_required, search, limit = 50, offset = 0 } = req.query;
    
    let sql = 'SELECT * FROM document_types WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (is_active !== undefined) {
      sql += ` AND is_active = $${paramIndex++}`;
      params.push(is_active === 'true');
    }

    if (category) {
      sql += ` AND category = $${paramIndex++}`;
      params.push(category);
    }

    if (is_required !== undefined) {
      sql += ` AND is_required = $${paramIndex++}`;
      params.push(is_required === 'true');
    }

    if (search) {
      sql += ` AND (name ILIKE $${paramIndex} OR code ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    sql += ` ORDER BY name ASC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sql, params);
    const countResult = await query('SELECT COUNT(*) FROM document_types');

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

// Get document type by ID
exports.getDocumentTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM document_types WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Document type not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Get document types by category
exports.getDocumentTypesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const result = await query(
      'SELECT * FROM document_types WHERE category = $1 AND is_active = true ORDER BY name ASC',
      [category]
    );
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

// Create document type - UI params: code, name, category, isRequired, allowedFormats, maxSizeKb, isActive
exports.createDocumentType = async (req, res, next) => {
  try {
    const { code, name, category, isRequired = false, allowedFormats, maxSizeKb = 5120, isActive = true } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Name and code are required' });
    }

    // Convert allowedFormats to PostgreSQL array format
    const formatsArray = allowedFormats && allowedFormats.length > 0 
      ? allowedFormats 
      : ['pdf', 'jpg', 'png'];

    const result = await query(
      `INSERT INTO document_types (code, name, category, is_required, allowed_formats, max_size_kb, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [code, name, category, isRequired, formatsArray, maxSizeKb, isActive]
    );

    res.status(201).json({ success: true, data: result.rows[0], message: 'Document type created successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Document type code already exists' });
    }
    next(error);
  }
};

// Update document type
exports.updateDocumentType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, name, category, isRequired, allowedFormats, maxSizeKb, isActive } = req.body;

    const result = await query(
      `UPDATE document_types 
       SET code = COALESCE($1, code),
           name = COALESCE($2, name),
           category = COALESCE($3, category),
           is_required = COALESCE($4, is_required),
           allowed_formats = COALESCE($5, allowed_formats),
           max_size_kb = COALESCE($6, max_size_kb),
           is_active = COALESCE($7, is_active)
       WHERE id = $8
       RETURNING *`,
      [code, name, category, isRequired, allowedFormats, maxSizeKb, isActive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Document type not found' });
    }

    res.json({ success: true, data: result.rows[0], message: 'Document type updated successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Document type code already exists' });
    }
    next(error);
  }
};

// Delete document type
exports.deleteDocumentType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM document_types WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Document type not found' });
    }

    res.json({ success: true, message: 'Document type deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Bulk upload document types
exports.bulkUploadDocumentTypes = async (req, res, next) => {
  try {
    const { documentTypes } = req.body;

    if (!Array.isArray(documentTypes) || documentTypes.length === 0) {
      return res.status(400).json({ success: false, message: 'Document types array is required' });
    }

    const results = await transaction(async (client) => {
      const inserted = [];
      const errors = [];

      for (const doc of documentTypes) {
        try {
          const formatsArray = doc.allowedFormats && doc.allowedFormats.length > 0 
            ? doc.allowedFormats 
            : ['pdf', 'jpg', 'png'];

          const result = await client.query(
            `INSERT INTO document_types (code, name, category, is_required, allowed_formats, max_size_kb, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (code) DO UPDATE SET
               name = EXCLUDED.name,
               category = EXCLUDED.category,
               is_required = EXCLUDED.is_required,
               allowed_formats = EXCLUDED.allowed_formats,
               max_size_kb = EXCLUDED.max_size_kb,
               is_active = EXCLUDED.is_active
             RETURNING *`,
            [doc.code, doc.name, doc.category, doc.isRequired ?? false, formatsArray, doc.maxSizeKb ?? 5120, doc.isActive ?? true]
          );
          inserted.push(result.rows[0]);
        } catch (err) {
          errors.push({ documentType: doc.code, error: err.message });
        }
      }

      return { inserted, errors };
    });

    res.json({
      success: true,
      message: `${results.inserted.length} document types processed`,
      data: results.inserted,
      errors: results.errors
    });
  } catch (error) {
    next(error);
  }
};
