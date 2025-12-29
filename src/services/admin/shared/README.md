# Organization Services

Esta carpeta contiene todos los servicios relacionados con la gestión organizacional del sistema de e-commerce multi-tenant.

## Estructura de Carpetas

```
organization/
├── branch/           # Servicios relacionados con sucursales
│   ├── repos/        # Repositorios de datos para sucursales
│   ├── services/     # Lógica de negocio y server actions
│   ├── utils/        # Funciones utilitarias puras
│   └── validators/   # Validaciones y esquemas
├── company/          # Servicios relacionados con empresas
│   ├── repos/        # Repositorios de datos para empresas
│   ├── services/     # Lógica de negocio (company, subscription, updates)
│   └── validators/   # Validaciones de empresa
├── employee/         # Servicios relacionados con empleados
│   └── services/     # Lógica de negocio para empleados
├── manager/          # Servicios relacionados con encargados
│   └── services/     # Lógica de negocio para managers
└── permissions/      # Servicios de permisos y autorización
    └── services/     # Lógica de permisos del sistema
```

## Principios de Organización

### 1. **Separación por Dominio**

Cada entidad de negocio tiene su propia carpeta principal (branch, company, employee, manager, permissions).

### 2. **Separación por Responsabilidad**

Dentro de cada dominio, los archivos están organizados por tipo:

- `services/`: Lógica de negocio, server actions, operaciones CRUD
- `repos/`: Acceso directo a base de datos, queries complejas
- `utils/`: Funciones utilitarias puras, helpers, transformadores
- `validators/`: Esquemas de validación, reglas de negocio

### 3. **Consistencia de Nombres**

- Archivos siguen el patrón: `{dominio}-{tipo}.ts`
- Funciones exportadas siguen convenciones claras
- Imports relativos dentro del mismo dominio

### 4. **Server Actions**

Los archivos en `services/` que contienen operaciones de base de datos usan `"use server"` para Next.js App Router.

## Guías de Desarrollo

### Agregar Nueva Funcionalidad

1. Identificar el dominio correcto
2. Colocar en la subcarpeta apropiada (services/repos/utils/validators)
3. Seguir las convenciones de nomenclatura
4. Actualizar imports en archivos que consuman la nueva funcionalidad

### Importaciones

```typescript
// Dentro del mismo dominio (relativo)
import { someFunction } from "../utils/some-utils";

// Desde otros dominios (absoluto)
import { someService } from "@/services/organization/other-domain/services/other-service";
```

### Testing

Cada tipo de archivo debe tener su correspondiente archivo de test en la misma carpeta con extensión `.test.ts`.
