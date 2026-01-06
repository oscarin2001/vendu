# Dashboard Components

Esta carpeta contiene todos los componentes relacionados con el dashboard de administración del sistema.

## Estructura de Carpetas

```
dashboard/
├── pages/                 # Componentes principales de páginas
│   ├── AdminDashboard.tsx
│   └── index.ts
├── metrics/               # Componentes de métricas y dashboard
│   ├── DashboardMetrics.tsx
│   └── index.ts
├── shared/                # Componentes compartidos y reutilizables
│   ├── components/        # Componentes UI reutilizables
│   │   ├── MetricCard.tsx
│   │   └── index.ts
│   ├── hooks/             # Hooks personalizados
│   │   ├── useDashboardMetrics.ts
│   │   └── index.ts
│   ├── types.ts           # Tipos TypeScript
│   └── index.ts
├── index.ts               # Barrel exports principal
└── README.md              # Documentación
```

## Componentes Principales

### Pages

- **AdminDashboard**: Componente principal del dashboard de administración

### Metrics

- **DashboardMetrics**: Dashboard completo de métricas usando MetricCard

### Shared Components

- **MetricCard**: Componente reutilizable para mostrar métricas con iconos

### Shared Hooks

- **useDashboardMetrics**: Hook personalizado para manejar el estado y carga de métricas

### Shared Types

- **DashboardMetrics**: Interface que define la estructura de las métricas del dashboard

## Métricas Disponibles

- Total de Usuarios
- Total de Sucursales
- Ventas Totales
- Total de Inventario
- Usuarios Activos
- Total de Gerentes
- Total de Proveedores
- Total de Almacenes

## Principios de Diseño

- **Fragmentación**: Cada componente tiene una responsabilidad clara
- **Reutilización**: Componentes compartidos en `shared/` para uso futuro
- **Pure TSX**: Componentes limpios sin lógica de negocio compleja
- **Barrel Exports**: Imports limpios usando archivos `index.ts`
- **TypeScript**: Interfaces bien definidas para type safety

## Uso

```tsx
import { AdminDashboard, DashboardMetrics } from "@/components/admin/dashboard";
import { useDashboardMetrics } from "@/components/admin/dashboard/shared/hooks";
```
