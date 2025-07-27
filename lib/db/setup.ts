import fs from 'fs';
import path from 'path';
import { query, testConnection } from './connection';

export async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...');
    
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Could not connect to database');
    }

    // Read and execute init script
    const initScript = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/db/init.sql'), 
      'utf8'
    );

    // Split by semicolons and execute each statement
    const statements = initScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      if (statement.toLowerCase().includes('create database')) {
        // Skip CREATE DATABASE as we handle this separately
        continue;
      }
      await query(statement);
    }

    console.log('✅ Database setup completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    return false;
  }
}

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');
    
    // Check if data already exists
    const existingUsers = await query('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0]?.count > 0) {
      console.log('📊 Database already contains data, skipping seed');
      return true;
    }

    // The sample data is already included in init.sql
    console.log('✅ Database seeded successfully');
    return true;
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    return false;
  }
}