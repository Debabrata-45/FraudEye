const bcrypt = require("bcrypt");
const { query, pool } = require("./index");

async function seed() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@fraudeye.com";
  const adminPass = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";

  const analystEmail = process.env.SEED_ANALYST_EMAIL || "analyst@fraudeye.com";
  const analystPass = process.env.SEED_ANALYST_PASSWORD || "Analyst@12345";

  const adminHash = await bcrypt.hash(adminPass, 10);
  const analystHash = await bcrypt.hash(analystPass, 10);

  await query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1,$2,'admin')
     ON CONFLICT (email) DO NOTHING`,
    [adminEmail, adminHash]
  );

  await query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1,$2,'analyst')
     ON CONFLICT (email) DO NOTHING`,
    [analystEmail, analystHash]
  );

  console.log("✅ Seed complete:");
  console.log("Admin:", adminEmail, adminPass);
  console.log("Analyst:", analystEmail, analystPass);
}

seed()
  .then(() => pool.end())
  .catch((e) => {
    console.error(e);
    pool.end();
    process.exit(1);
  });