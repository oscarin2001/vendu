# Branches Components

Esta carpeta contiene todos los componentes relacionados con la gestión de sucursales en el sistema de administración.

## Estructura de Carpetas

```
branches/
├── pages/                 # Componentes principales de páginas
│   ├── BranchesManagement.tsx
│   └── index.ts
├── metrics/               # Componentes de métricas y dashboard
│   ├── BranchesMetrics.tsx
│   └── index.ts
├── shared/                # Componentes compartidos y reutilizables
│   ├── components/        # Componentes UI reutilizables
│   │   ├── BranchesFilters.tsx
│   │   ├── BranchesList.tsx
│   │   ├── MetricCard.tsx
│   │   └── index.ts
│   └── index.ts
├── forms/                 # Formularios de sucursales
├── modals/                # Modales de sucursales
│   ├── details/
│   ├── service/
│   └── delete/
└── index.ts               # Barrel exports
```

## Componentes Principales

### Pages

- **BranchesManagement**: Componente principal que maneja la gestión completa de sucursales

### Metrics

- **BranchesMetrics**: Dashboard de métricas de sucursales usando MetricCard

### Shared Components

- **BranchesFilters**: Filtros reutilizables para sucursales
- **BranchesList**: Lista de sucursales con funcionalidades de selección
- **MetricCard**: Componente reutilizable para mostrar métricas con iconos

## Principios de Diseño

- **Fragmentación**: Ningún archivo supera las 150 líneas de código
- **Responsabilidad Única**: Cada componente tiene una responsabilidad clara
- **Reutilización**: Componentes compartidos en `shared/` para uso en múltiples lugares
- **Pure TSX**: Componentes puros sin lógica de negocio compleja
- **Barrel Exports**: Imports limpios usando archivos `index.ts`

## Uso

```tsx
import {
  BranchesManagement,
  BranchesMetrics,
} from "@/components/admin/branches";
import {
  BranchesFilters,
  BranchesList,
} from "@/components/admin/branches/shared/components";
```
