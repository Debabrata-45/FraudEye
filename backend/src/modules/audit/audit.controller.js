const db = require("../../db");

/* ── GET /api/audit-logs ─────────────────────────────────── */
async function getAuditLogs(req, res, next) {
  try {
    const { page = 1, limit = 50, search = "", sort = "newest" } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const orderBy =
      sort === "oldest" ? "al.created_at ASC" : "al.created_at DESC";
    const params = [];
    const conditions = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(
        `(al.event_type ILIKE $${params.length} OR al.meta::text ILIKE $${params.length})`,
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countRes = await db.query(
      `SELECT COUNT(*) FROM audit_logs al ${where}`,
      params,
    );
    const total = parseInt(countRes.rows[0].count);

    params.push(parseInt(limit), offset);
    const dataRes = await db.query(
      `SELECT
         al.id,
         al.actor_user_id,
         al.event_type,
         al.meta,
         al.created_at,
         u.email   AS actor_email,
         u.role    AS actor_role
       FROM audit_logs al
       LEFT JOIN users u ON u.id = al.actor_user_id
       ${where}
       ORDER BY ${orderBy}
       LIMIT $${params.length - 1}
       OFFSET $${params.length}`,
      params,
    );

    return res.json({
      success: true,
      data: {
        logs: dataRes.rows,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

/* ── GET /api/audit-logs/:id ─────────────────────────────── */
async function getAuditLogById(req, res, next) {
  try {
    const { id } = req.params;
    const res2 = await db.query(
      `SELECT
         al.id,
         al.actor_user_id,
         al.event_type,
         al.meta,
         al.created_at,
         u.email AS actor_email,
         u.role  AS actor_role
       FROM audit_logs al
       LEFT JOIN users u ON u.id = al.actor_user_id
       WHERE al.id = $1`,
      [id],
    );
    if (!res2.rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Audit log not found" });
    }
    return res.json({ success: true, data: res2.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAuditLogs, getAuditLogById };
