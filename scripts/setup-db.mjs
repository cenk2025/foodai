import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Usage: DATABASE_URL="postgres://postgres:<password>@db.<project>.supabase.co:5432/postgres" node scripts/setup-db.mjs
// Never commit the connection string — it contains the database password.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
}

async function setupDatabase() {
    console.log('🔌 Connecting to Supabase database...');
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false } // Required for Supabase connections
    });

    try {
        await client.connect();
        console.log('✅ Connected successfully.');

        // 1. Read Schema SQL
        console.log('📄 Reading schema file...');
        const schemaPath = path.join(__dirname, '../supabase/migrations/20250101000000_initial_schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // 2. Read Seed SQL
        console.log('📄 Reading seed data file...');
        const seedPath = path.join(__dirname, '../supabase/migrations/20250101000001_seed_data.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        // 3. Execute Schema
        console.log('🚀 Creating tables and policies (Schema)...');
        await client.query(schemaSql);
        console.log('✅ Schema created successfully.');

        // 4. Execute Seed
        console.log('🌱 Seeding database with initial data...');
        await client.query(seedSql);
        console.log('✅ Data seeded successfully.');

    } catch (err) {
        console.error('❌ Database setup failed:', err);
    } finally {
        await client.end();
        console.log('🔌 Disconnected.');
    }
}

setupDatabase();
