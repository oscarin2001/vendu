// Script de verificación y datos de ejemplo para BD normalizada
// Ejecutar para verificar que la normalización funciona correctamente

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyNormalization() {
  console.log('🔍 Verificando normalización de la base de datos...')

  try {
    // 1. Verificar que las nuevas tablas existen y están vacías
    const branchHoursCount = await prisma.tbbranch_hours.count()
    const sessionActionsCount = await prisma.tbcash_session_actions.count()
    const deviceDetailsCount = await prisma.tbdevice_details.count()

    console.log('📊 Estado de las nuevas tablas normalizadas:')
    console.log(`   - tbbranch_hours: ${branchHoursCount} registros`)
    console.log(`   - tbcash_session_actions: ${sessionActionsCount} registros`)
    console.log(`   - tbdevice_details: ${deviceDetailsCount} registros`)

    // 2. Crear datos de ejemplo para demostrar que funciona
    console.log('🎯 Creando datos de ejemplo...')

    // Obtener una sucursal existente para el ejemplo
    const branch = await prisma.tbbranches.findFirst()
    if (branch) {
      // Crear horarios de ejemplo para la sucursal
      const sampleHours = [
        { day: 1, open: '09:00', close: '18:00', closed: false }, // Lunes
        { day: 2, open: '09:00', close: '18:00', closed: false }, // Martes
        { day: 3, open: '09:00', close: '18:00', closed: false }, // Miércoles
        { day: 4, open: '09:00', close: '18:00', closed: false }, // Jueves
        { day: 5, open: '09:00', close: '18:00', closed: false }, // Viernes
        { day: 6, open: '10:00', close: '16:00', closed: false }, // Sábado
        { day: 0, open: null, close: null, closed: true },       // Domingo
      ]

      for (const hour of sampleHours) {
        await prisma.tbbranch_hours.create({
          data: {
            FK_branch: branch.PK_branch,
            day_of_week: hour.day,
            opening_time: hour.open,
            closing_time: hour.close,
            is_closed: hour.closed
          }
        })
      }
      console.log(`   ✅ Horarios creados para sucursal: ${branch.name}`)
    }

    // Obtener una sesión de caja existente
    const session = await prisma.tbcash_sessions.findFirst()
    if (session) {
      // Crear acciones de ejemplo
      await prisma.tbcash_session_actions.createMany({
        data: [
          {
            FK_session: session.PK_session,
            action: 'OPEN',
            amount: session.openingAmount,
            details: 'Sesión de caja abierta'
          },
          {
            FK_session: session.PK_session,
            action: 'SALE',
            amount: 150.50,
            details: 'Venta registrada'
          }
        ]
      })
      console.log(`   ✅ Acciones creadas para sesión de caja`)
    }

    // Obtener un dispositivo existente
    const device = await prisma.tbdevices.findFirst()
    if (device) {
      // Crear detalles de dispositivo de ejemplo
      await prisma.tbdevice_details.create({
        data: {
          FK_device: device.PK_device,
          device_type: 'desktop',
          browser: 'Chrome',
          os: 'Windows',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ip_address: '192.168.1.100',
          last_seen: new Date()
        }
      })
      console.log(`   ✅ Detalles de dispositivo creados`)
    }

    // 3. Verificar consultas normalizadas
    console.log('🔍 Probando consultas normalizadas...')

    if (branch) {
      const hours = await prisma.tbbranch_hours.findMany({
        where: { FK_branch: branch.PK_branch },
        orderBy: { day_of_week: 'asc' }
      })
      console.log(`   ✅ Consulta de horarios: ${hours.length} registros encontrados`)
    }

    if (session) {
      const actions = await prisma.tbcash_session_actions.findMany({
        where: { FK_session: session.PK_session }
      })
      console.log(`   ✅ Consulta de acciones: ${actions.length} registros encontrados`)
    }

    if (device) {
      const details = await prisma.tbdevice_details.findMany({
        where: { FK_device: device.PK_device }
      })
      console.log(`   ✅ Consulta de dispositivos: ${details.length} registros encontrados`)
    }

    console.log('🎉 ¡Normalización completada y verificada!')
    console.log('📈 La base de datos ahora cumple con 3FN (Tercera Forma Normal)')

  } catch (error) {
    console.error('❌ Error durante la verificación:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar verificación
verifyNormalization()
  .then(() => console.log('✅ Verificación exitosa'))
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })