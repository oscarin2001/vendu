"use strict";
// Script de migración de datos para normalización
// Ejecutar después de aplicar la migración del schema
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function migrateData() {
    console.log('🚀 Iniciando migración de datos para normalización...');
    try {
        // 1. Migrar horarios de sucursales
        console.log('📅 Migrando horarios de sucursales...');
        const branches = await prisma.tbbranches.findMany({
            where: { openingHours: { not: null } }
        });
        for (const branch of branches) {
            if (branch.openingHours && typeof branch.openingHours === 'object') {
                const hours = branch.openingHours;
                const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                for (let i = 0; i < days.length; i++) {
                    const dayData = hours[days[i]];
                    if (dayData) {
                        await prisma.tbbranch_hours.create({
                            data: {
                                FK_branch: branch.PK_branch,
                                day_of_week: i,
                                opening_time: dayData.isClosed ? null : dayData.openingTime,
                                closing_time: dayData.isClosed ? null : dayData.closingTime,
                                is_closed: dayData.isClosed || false
                            }
                        });
                    }
                }
            }
        }
        // 2. Migrar historial de sesiones de caja
        console.log('💰 Migrando historial de sesiones de caja...');
        const sessions = await prisma.tbcash_sessions.findMany({
            where: { actionHistory: { not: null } }
        });
        for (const session of sessions) {
            if (session.actionHistory && Array.isArray(session.actionHistory)) {
                for (const action of session.actionHistory) {
                    await prisma.tbcash_session_actions.create({
                        data: {
                            FK_session: session.PK_session,
                            action: action.action || 'UNKNOWN',
                            amount: action.amount ? parseFloat(action.amount) : null,
                            details: action.details
                        }
                    });
                }
            }
        }
        // 3. Migrar detalles de dispositivos
        console.log('📱 Migrando detalles de dispositivos...');
        const devices = await prisma.tbdevices.findMany({
            where: { devices: { not: null } }
        });
        for (const device of devices) {
            if (device.devices && Array.isArray(device.devices)) {
                for (const deviceInfo of device.devices) {
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
                    });
                }
            }
        }
        console.log('✅ Migración de datos completada exitosamente!');
        // Opcional: Limpiar campos JSON después de verificar que todo funciona
        // await prisma.tbbranches.updateMany({ data: { openingHours: null } })
        // await prisma.tbcash_sessions.updateMany({ data: { actionHistory: null } })
        // await prisma.tbdevices.updateMany({ data: { devices: null } })
    }
    catch (error) {
        console.error('❌ Error durante la migración:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
// Ejecutar la migración
migrateData()
    .then(() => console.log('🎉 Migración completada!'))
    .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
}) < /content>
    < parameter;
name = "filePath" > c;
Users;
oscar;
Desktop;
ecommerce - management;
prisma;
migrate - data.ts;
