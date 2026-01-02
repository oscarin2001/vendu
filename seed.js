const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Crear compañía de prueba
  const company = await prisma.tbcompanies.upsert({
    where: { slug: 'rous-boutique' },
    update: {},
    create: {
      name: 'Rous Boutique',
      slug: 'rous-boutique',
      taxId: '123456789',
      country: 'Bolivia',
    },
  });

  console.log('✅ Company created:', company);

  // Crear un privilegio básico si no existe
  const privilege = await prisma.tbprivileges.upsert({
    where: { privilegeCode: 'BRANCH_MANAGER' },
    update: {},
    create: {
      privilegeName: 'Gerente de Sucursal',
      privilegeCode: 'BRANCH_MANAGER',
      description: 'Gerente responsable de una sucursal',
    },
  });

  console.log('✅ Privilege created:', privilege);

  // Crear cuenta de autenticación
  const auth = await prisma.tbauth.upsert({
    where: { username: 'admin@test.com' },
    update: {},
    create: {
      username: 'admin@test.com',
      password: '$2b$10$dummy.hash.for.testing.purposes.only', // Hash dummy
      FK_privilege: privilege.PK_privilege,
      FK_company: company.PK_company,
    },
  });

  console.log('✅ Auth account created:', auth);

  // Crear un empleado básico
  const employee = await prisma.tbemployee_profiles.upsert({
    where: { ci: '12345678' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'Test',
      ci: '12345678',
      hireDate: new Date(),
      status: 'ACTIVE',
      FK_company: company.PK_company,
      FK_auth: auth.PK_auth,
    },
  });

  console.log('✅ Employee created:', employee);

  // Actualizar registros existentes para usar la nueva compañía
  await prisma.tbauth.updateMany({
    where: { FK_company: 1 },
    data: { FK_company: company.PK_company },
  });

  await prisma.tbemployee_profiles.updateMany({
    where: { FK_company: 1 },
    data: { FK_company: company.PK_company },
  });

  console.log('✅ Updated existing records to use new company');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });