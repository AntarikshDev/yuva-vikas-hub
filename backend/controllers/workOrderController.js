const pool = require('../config/db');

// Get all work orders (with role-based filtering)
const getAllWorkOrders = async (req, res) => {
  try {
    const { role, userId, stateId } = req.query;
    
    let query = `
      SELECT 
        wo.*,
        p.name as program_name,
        p.code as program_code,
        s.name as state_name,
        d.name as district_name
      FROM work_orders wo
      LEFT JOIN programs p ON wo.program_id = p.id
      LEFT JOIN states s ON wo.state_id = s.id
      LEFT JOIN districts d ON wo.district_id = d.id
    `;
    
    const params = [];
    
    // Filter for national head - only show assigned work orders
    if (role === 'national-head' && userId) {
      query += ` WHERE wo.assigned_national_head_id = $1`;
      params.push(userId);
    }
    
    // Filter by state if provided
    if (stateId) {
      query += params.length > 0 ? ` AND wo.state_id = $${params.length + 1}` : ` WHERE wo.state_id = $1`;
      params.push(stateId);
    }
    
    query += ` ORDER BY wo.created_at DESC`;
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        id: row.id,
        workOrderNo: row.work_order_no,
        programId: row.program_id,
        programName: row.program_name,
        programCode: row.program_code,
        assignedDate: row.assigned_date,
        startDate: row.start_date,
        endDate: row.end_date,
        totalTarget: row.total_target,
        targetSc: row.target_sc,
        targetSt: row.target_st,
        targetObc: row.target_obc,
        targetGeneral: row.target_general,
        targetMinority: row.target_minority,
        stateId: row.state_id,
        stateName: row.state_name,
        districtId: row.district_id,
        districtName: row.district_name,
        assignedNationalHeadId: row.assigned_national_head_id,
        assignedNationalHeadName: row.assigned_national_head_name,
        status: row.status,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })),
      total: result.rowCount
    });
  } catch (error) {
    console.error('Error fetching work orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get work order by ID
const getWorkOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        wo.*,
        p.name as program_name,
        p.code as program_code,
        s.name as state_name,
        d.name as district_name
      FROM work_orders wo
      LEFT JOIN programs p ON wo.program_id = p.id
      LEFT JOIN states s ON wo.state_id = s.id
      LEFT JOIN districts d ON wo.district_id = d.id
      WHERE wo.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Work order not found' });
    }
    
    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        id: row.id,
        workOrderNo: row.work_order_no,
        programId: row.program_id,
        programName: row.program_name,
        programCode: row.program_code,
        assignedDate: row.assigned_date,
        startDate: row.start_date,
        endDate: row.end_date,
        totalTarget: row.total_target,
        targetSc: row.target_sc,
        targetSt: row.target_st,
        targetObc: row.target_obc,
        targetGeneral: row.target_general,
        targetMinority: row.target_minority,
        stateId: row.state_id,
        stateName: row.state_name,
        districtId: row.district_id,
        districtName: row.district_name,
        assignedNationalHeadId: row.assigned_national_head_id,
        assignedNationalHeadName: row.assigned_national_head_name,
        status: row.status,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    });
  } catch (error) {
    console.error('Error fetching work order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create work order
const createWorkOrder = async (req, res) => {
  try {
    const {
      workOrderNo,
      programId,
      assignedDate,
      startDate,
      endDate,
      totalTarget,
      targetSc,
      targetSt,
      targetObc,
      targetGeneral,
      targetMinority,
      stateId,
      districtId,
      assignedNationalHeadId,
      assignedNationalHeadName,
      createdBy
    } = req.body;
    
    const result = await pool.query(`
      INSERT INTO work_orders (
        work_order_no, program_id, assigned_date, start_date, end_date,
        total_target, target_sc, target_st, target_obc, target_general, target_minority,
        state_id, district_id, assigned_national_head_id, assigned_national_head_name, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
      workOrderNo, programId, assignedDate, startDate, endDate,
      totalTarget, targetSc || 0, targetSt || 0, targetObc || 0, targetGeneral || 0, targetMinority || 0,
      stateId || null, districtId || null, assignedNationalHeadId, assignedNationalHeadName, createdBy || null
    ]);
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Work order created successfully'
    });
  } catch (error) {
    console.error('Error creating work order:', error);
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Work order number already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update work order
const updateWorkOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      workOrderNo,
      programId,
      assignedDate,
      startDate,
      endDate,
      totalTarget,
      targetSc,
      targetSt,
      targetObc,
      targetGeneral,
      targetMinority,
      stateId,
      districtId,
      assignedNationalHeadId,
      assignedNationalHeadName,
      status
    } = req.body;
    
    const result = await pool.query(`
      UPDATE work_orders SET
        work_order_no = $1,
        program_id = $2,
        assigned_date = $3,
        start_date = $4,
        end_date = $5,
        total_target = $6,
        target_sc = $7,
        target_st = $8,
        target_obc = $9,
        target_general = $10,
        target_minority = $11,
        state_id = $12,
        district_id = $13,
        assigned_national_head_id = $14,
        assigned_national_head_name = $15,
        status = $16,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $17
      RETURNING *
    `, [
      workOrderNo, programId, assignedDate, startDate, endDate,
      totalTarget, targetSc || 0, targetSt || 0, targetObc || 0, targetGeneral || 0, targetMinority || 0,
      stateId || null, districtId || null, assignedNationalHeadId, assignedNationalHeadName,
      status || 'active', id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Work order not found' });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Work order updated successfully'
    });
  } catch (error) {
    console.error('Error updating work order:', error);
    if (error.code === '23505') {
      return res.status(400).json({ success: false, message: 'Work order number already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete work order
const deleteWorkOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM work_orders WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Work order not found' });
    }
    
    res.json({
      success: true,
      message: 'Work order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting work order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllWorkOrders,
  getWorkOrderById,
  createWorkOrder,
  updateWorkOrder,
  deleteWorkOrder
};
