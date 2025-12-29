# Servicios (src/services)

Esta carpeta contiene toda la lógica de negocio organizada por dominios y capas.

## Estructura de Carpetas

```
services/
├── admin/          # Servicios administrativos (empleados, sucursales, etc.)
│   ├── company/    # Servicios de compañías
│   │   ├── services/
│   │   │   ├── company-service.ts      # Lógica de negocio de compañías
│   │   │   ├── company-api.ts          # Funciones API para compañías
│   │   │   └── ...
├── api/            # Funciones de API centralizadas (server actions)
├── auth/           # Autenticación y autorización
├── organization/   # Gestión organizacional
├── tenant/         # Lógica multi-tenant
├── utils/          # Utilidades compartidas
└── README.md
```

## Funciones API en Servicios Admin

Las funciones de API específicas de un dominio se ubican junto con los otros servicios del mismo dominio en `services/admin/{dominio}/services/`.

**Ejemplos:**

- `services/admin/company/services/company-api.ts` - Funciones API para compañías
- `services/admin/employee/services/employee-api.ts` - Funciones API para empleados

## Convenciones

- Controller -> Service -> Repo -> Adapter
- Exportaciones nombradas
- Firmas: service methods reciben `companyId` y `actor` cuando mutan datos
- Archivos limitados a ~120 líneas

Dominios incluidos: auth, tenant, billing, organization, inventory, payments, audit, roles, jobs, infra, utils
