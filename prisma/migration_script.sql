// Script de migración para normalizar la base de datos
// Ejecutar después de crear las nuevas tablas

-- Paso 1: Migrar datos de openingHours JSON a tbbranch_hours
INSERT INTO tbbranch_hours (FK_branch, day_of_week, opening_time, closing_time, is_closed)
SELECT
  b.PK_branch,
  json_extract.value as day_of_week,
  CASE WHEN json_extract.value ->> 'isClosed' = 'true' THEN NULL ELSE json_extract.value ->> 'openingTime' END,
  CASE WHEN json_extract.value ->> 'isClosed' = 'true' THEN NULL ELSE json_extract.value ->> 'closingTime' END,
  COALESCE(json_extract.value ->> 'isClosed', 'false') = 'true'
FROM tbbranches b
CROSS JOIN json_each(b.openingHours) as json_extract
WHERE b.openingHours IS NOT NULL;

-- Paso 2: Migrar datos de actionHistory JSON a tbcash_session_actions
INSERT INTO tbcash_session_actions (FK_session, action, amount, details)
SELECT
  s.PK_session,
  json_extract.value ->> 'action',
  CAST(json_extract.value ->> 'amount' AS DECIMAL),
  json_extract.value ->> 'details'
FROM tbcash_sessions s
CROSS JOIN json_each(s.actionHistory) as json_extract
WHERE s.actionHistory IS NOT NULL;

-- Paso 3: Migrar datos de devices JSON a tbdevice_details
INSERT INTO tbdevice_details (FK_device, device_type, browser, os, user_agent, ip_address)
SELECT
  d.PK_device,
  json_extract.value ->> 'type',
  json_extract.value ->> 'browser',
  json_extract.value ->> 'os',
  json_extract.value ->> 'userAgent',
  json_extract.value ->> 'ip'
FROM tbdevices d
CROSS JOIN json_each(d.devices) as json_extract
WHERE d.devices IS NOT NULL;

-- Paso 4: Eliminar columnas JSON después de migrar los datos
-- ALTER TABLE tbbranches DROP COLUMN openingHours;
-- ALTER TABLE tbcash_sessions DROP COLUMN actionHistory;
-- ALTER TABLE tbdevices DROP COLUMN devices;</content>
<parameter name="filePath">c:\Users\oscar\Desktop\ecommerce-management\prisma\migration_script.sql