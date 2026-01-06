# Managers Components

Esta carpeta contiene todos los componentes relacionados con la gestión de encargados/gerentes en el sistema de administración.

## Estructura de Carpetas

```
managers/
├── pages/                 # Componentes principales de páginas
│   ├── ManagersManagement.tsx
│   └── index.ts
├── metrics/               # Componentes de métricas y dashboard
│   ├── ManagersMetrics.tsx (ManagersMetricsGrid)
│   └── index.ts
├── shared/                # Componentes compartidos y reutilizables
│   ├── components/        # Componentes UI reutilizables
│   │   ├── ManagersFilters.tsx
│   │   ├── ManagersList.tsx
│   │   ├── MetricCard.tsx
│   │   └── index.ts
│   ├── hooks/             # Hooks personalizados
│   │   ├── useManagerMetrics.ts
│   │   └── index.ts
│   ├── types.ts           # Tipos TypeScript
│   └── index.ts
├── tables/                # Componentes de tabla
│   ├── ManagersTable.tsx
│   └── components/
│       ├── ManagersTableSkeleton.tsx
│       ├── ManagerTableRow.tsx
│       └── index.ts
├── forms/                 # Formularios de encargados
├── modals/                # Modales de encargados
│   ├── ManagerCreateModal.tsx
│   ├── ManagerDetailsModal.tsx
│   ├── ManagerEditModal.tsx
│   ├── ManagerServiceConfigModal.tsx
│   └── delete/
│       ├── ManagerDeleteFinalModal.tsx
│       ├── ManagerDeleteInitialModal.tsx
│       └── ManagerDeleteWarningModal.tsx
├── index.ts               # Barrel exports principal
└── README.md              # Documentación
```

## Componentes Principales

### Pages

- **ManagersManagement**: Componente principal que maneja la gestión completa de encargados

### Metrics

- **ManagersMetricsGrid**: Dashboard de métricas de encargados usando MetricCard

### Shared Components

- **ManagersFilters**: Filtros reutilizables para encargados
- **ManagersList**: Lista de encargados con funcionalidades de selección
- **MetricCard**: Componente reutilizable para mostrar métricas con iconos

### Shared Hooks

- **useManagerMetrics**: Hook personalizado para manejar el estado y carga de métricas

### Tables

- **ManagersTable**: Tabla principal de encargados con skeleton y row components
- **ManagersTableSkeleton**: Componente de carga para la tabla
- **ManagerTableRow**: Fila individual de la tabla con todas las funcionalidades

## Métricas Disponibles

- Total de Encargados (12)
- Activos (10)
- Con Sucursal (8)
- Sin Sucursal (4)
- Desactivados (1)
- Inactivos (1)

## Principios de Diseño

- **Fragmentación**: Ningún archivo supera las 150 líneas de código
- **Reutilización**: Componentes compartidos en `shared/` para uso futuro
- **Pure TSX**: Componentes limpios sin lógica de negocio compleja
- **Barrel Exports**: Imports limpios usando archivos `index.ts`
- **TypeScript**: Interfaces bien definidas para type safety

## Características de la Tabla

La tabla de encargados incluye:

- Información completa del encargado (avatar, nombre, CI)
- Estado laboral (Activo/Inactivo/Desactivado)
- Estado de conexión (En línea/Fuera de línea)
- Sucursales asignadas con badges
- Información de contribución financiera con tooltips
- Fecha de registro
- Menú de acciones completo (ver, editar, activar/desactivar, configurar, eliminar)

## Uso

```tsx
import {
  ManagersManagement,
  ManagersMetricsGrid,
} from "@/components/admin/managers";
import {
  ManagersFilters,
  ManagersList,
} from "@/components/admin/managers/shared/components";
import { ManagersTable } from "@/components/admin/managers/tables";
import { useManagerMetrics } from "@/components/admin/managers/shared/hooks";
```
