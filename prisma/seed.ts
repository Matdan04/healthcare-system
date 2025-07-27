import { PrismaClient, UserRole, SubscriptionPlan } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create clinics
  const clinic1 = await prisma.clinic.upsert({
    where: { email: 'admin@generalhospital.com' },
    update: {},
    create: {
      name: 'General Hospital',
      email: 'admin@generalhospital.com',
      phone: '+1-555-0100',
      address: '123 Health St, Medical City, MC 12345',
      subscriptionPlan: SubscriptionPlan.PROFESSIONAL,
    },
  });

  const clinic2 = await prisma.clinic.upsert({
    where: { email: 'info@citymedical.com' },
    update: {},
    create: {
      name: 'City Medical Center',
      email: 'info@citymedical.com',
      phone: '+1-555-0200',
      address: '456 Care Ave, Health Town, HT 67890',
      subscriptionPlan: SubscriptionPlan.ENTERPRISE,
    },
  });

  // Create users
  const passwordHash = await bcrypt.hash('Admin123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@generalhospital.com' },
    update: {},
    create: {
      email: 'admin@generalhospital.com',
      passwordHash,
      firstName: 'System',
      lastName: 'Administrator',
      role: UserRole.ADMIN,
      clinicId: clinic1.id,
      licenseNumber: 'ADM001',
      emailVerified: true,
    },
  });

  const doctor = await prisma.user.upsert({
    where: { email: 'dr.smith@generalhospital.com' },
    update: {},
    create: {
      email: 'dr.smith@generalhospital.com',
      passwordHash: await bcrypt.hash('Doctor123!', 12),
      firstName: 'John',
      lastName: 'Smith',
      role: UserRole.DOCTOR,
      clinicId: clinic1.id,
      phone: '+1-555-0101',
      licenseNumber: 'MD12345',
      specialization: 'Cardiology',
      emailVerified: true,
    },
  });

  const nurse = await prisma.user.upsert({
    where: { email: 'nurse.johnson@generalhospital.com' },
    update: {},
    create: {
      email: 'nurse.johnson@generalhospital.com',
      passwordHash: await bcrypt.hash('Nurse123!', 12),
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: UserRole.NURSE,
      clinicId: clinic1.id,
      phone: '+1-555-0102',
      licenseNumber: 'RN67890',
      emailVerified: true,
    },
  });

  const patient = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      email: 'patient@example.com',
      passwordHash: await bcrypt.hash('Patient123!', 12),
      firstName: 'Michael',
      lastName: 'Wilson',
      role: UserRole.PATIENT,
      clinicId: clinic1.id,
      phone: '+1-555-0103',
      emailVerified: true,
    },
  });

  console.log('✅ Seed completed');
  console.log('\n📋 Sample accounts created:');
  console.log('👨‍💼 Admin: admin@generalhospital.com / Admin123!');
  console.log('👨‍⚕️ Doctor: dr.smith@generalhospital.com / Doctor123!');
  console.log('👩‍⚕️ Nurse: nurse.johnson@generalhospital.com / Nurse123!');
  console.log('👤 Patient: patient@example.com / Patient123!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });