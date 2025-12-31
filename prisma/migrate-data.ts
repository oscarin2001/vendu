// Script de migración de datos para normalización
// Ejecutar después de aplicar la migración del schema

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateData() {
  console.log('🚀 Iniciando migración de datos para normalización...')

  try {
    // 1. Migrar horarios de sucursales usando SQL directo (campo ya eliminado del schema)
    console.log('📅 Migrando horarios de sucursales...')
    const branchesData = await prisma.$queryRaw`
      SELECT PK_branch, openingHours FROM tbbranches WHERE openingHours IS NOT NULL
    ` as any[]

    for (const branch of branchesData) {
      if (branch.openingHours && typeof branch.openingHours === 'object') {
        const hours = branch.openingHours as any
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

        for (let i = 0; i < days.length; i++) {
          const dayData = hours[days[i]]
          if (dayData) {
            await prisma.tbbranch_hours.create({
              data: {
                FK_branch: branch.PK_branch,
                day_of_week: i,
                opening_time: dayData.isClosed ? null : dayData.openingTime,
                closing_time: dayData.isClosed ? null : dayData.closingTime,
                is_closed: dayData.isClosed || false
              }
            })
          }
        }
      }
    }

    // 2. Migrar historial de sesiones de caja usando SQL directo
    console.log('💰 Migrando historial de sesiones de caja...')
    const sessionsData = await prisma.$queryRaw`
      SELECT PK_session, actionHistory FROM tbcash_sessions WHERE actionHistory IS NOT NULL
    ` as any[]

    for (const session of sessionsData) {
      if (session.actionHistory && Array.isArray(session.actionHistory)) {
        for (const action of session.actionHistory as any[]) {
          await prisma.tbcash_session_actions.create({
            data: {
              FK_session: session.PK_session,
              action: action.action || 'UNKNOWN',
              amount: action.amount ? parseFloat(action.amount) : null,
              details: action.details
            }
          })
        }
      }
    }

    // 3. Migrar detalles de dispositivos usando SQL directo
    console.log('📱 Migrando detalles de dispositivos...')
    const devicesData = await prisma.$queryRaw`
      SELECT PK_device, devices FROM tbdevices WHERE devices IS NOT NULL
    ` as any[]

    for (const device of devicesData) {
      if (device.devices && Array.isArray(device.devices)) {
        for (const deviceInfo of device.devices as any[]) {
          await prisma.tbdevice_details.create({
            data: {
              FK_device: device.PK_device,
              device_type: deviceInfo.type || 'unknown',
              browser: deviceInfo.browser,
              os: deviceInfo.os,
              user_agent: deviceInfo.userAgent,
              ip_address: deviceInfo.ip,
              last_seen: new Date()
            }
          })
        }
      }
    }

    console.log('✅ Migración de datos completada exitosamente!')
    console.log('📋 Resumen:')
    console.log(`   - Horarios de sucursales migrados: ${branchesData.length} sucursales`)
    console.log(`   - Historial de sesiones migrado: ${sessionsData.length} sesiones`)
    console.log(`   - Detalles de dispositivos migrados: ${devicesData.length} dispositivos`)

  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar la migración
migrateData()
  .then(() => console.log('🎉 Migración completada!'))
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })