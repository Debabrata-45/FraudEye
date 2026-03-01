const { z } = require("zod");

const createTxSchema = z.object({
  merchantId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().min(3).max(5).default("INR"),
  deviceId: z.string().optional(),
  ipAddress: z.string().optional(),
  geoLat: z.number().optional(),
  geoLng: z.number().optional(),
  occurredAt: z.string().datetime(), // ISO
  meta: z.record(z.any()).optional(), // extra raw fields
});

module.exports = { createTxSchema };