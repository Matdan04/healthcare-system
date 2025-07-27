const { setupDatabase, seedDatabase } = require('../src/lib/db/setup.ts');

async function main() {
  console.log('🚀 Starting database setup...');
  
  const setupSuccess = await setupDatabase();
  if (!setupSuccess) {
    process.exit(1);
  }

  const seedSuccess = await seedDatabase();
  if (!seedSuccess) {
    process.exit(1);
  }

  console.log('🎉 Database setup and seeding completed!');
  console.log('\n📋 Sample accounts created:');
  console.log('👨‍💼 Admin: admin@generalhospital.com / Admin123!');
  console.log('👨‍⚕️ Doctor: dr.smith@generalhospital.com / Doctor123!');
  console.log('👩‍⚕️ Nurse: nurse.johnson@generalhospital.com / Nurse123!');
  console.log('👤 Patient: patient@example.com / Patient123!');
  
  process.exit(0);
}

main().catch(console.error);