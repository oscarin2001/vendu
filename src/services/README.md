# Servicios (src/services)

Esta carpeta contiene toda la lógica de negocio organizada por dominios y capas.

Convenciones:

- Controller -> Service -> Repo -> Adapter
- Exportaciones nombradas
- Firmas: service methods reciben `companyId` y `actor` cuando mutan datos
- Archivos limitados a ~120 líneas

Dominios incluidos: auth, tenant, billing, organization, inventory, payments, audit, roles, jobs, infra, utils
