# Warehouses Module

Este módulo maneja la gestión completa de bodegas en el sistema de administración.

## Estructura de Carpetas

```
warehouses/
├── components/           # Componentes compartidos y modales
│   └── modals/          # Modales para operaciones CRUD
├── forms/               # Formularios para crear/editar bodegas
├── metrics/             # ✅ Componentes de métricas y dashboard
├── pages/               # Preparado para futuras páginas
├── shared/              # ✅ Componentes y hooks reutilizables
│   ├── components/      # ✅ MetricCard, WarehousesFilters + index.ts
│   ├── hooks/          # ✅ useWarehouseMetrics + index.ts
│   └── types/          # ✅ WarehouseMetrics type
├── tables/              # ✅ Tabla completamente fragmentada
│   ├── components/      # ✅ WarehousesTableSkeleton, WarehouseTableRow + index.ts
│   └── index.ts
├── index.ts             # ✅ Barrel exports principales
└── README.md            # ✅ Documentación completa
```

## Componentes Principales

### Métricas

- `WarehousesMetricsGrid`: Grid de métricas del dashboard de bodegas
- `MetricCard`: Componente reutilizable para mostrar métricas individuales

### Tabla

- `WarehousesTable`: Tabla principal de bodegas
- `WarehousesTableSkeleton`: Skeleton loader para la tabla
- `WarehouseTableRow`: Componente de fila individual de bodega

### Filtros y Formularios

- `WarehousesFilters`: Componentes de filtrado
- `WarehouseForm`: Formulario para crear/editar bodegas

### Modales

- `WarehouseDetailsModal`: Modal de detalles de bodega
- `WarehouseServiceConfigModal`: Modal de configuración de servicios
- `WarehouseDeleteInitialModal`: Modal inicial de eliminación
- `WarehouseDeleteWarningModal`: Modal de advertencia de eliminación
- `WarehouseDeleteFinalModal`: Modal final de confirmación de eliminación

## Hooks

- `useWarehouseMetrics`: Hook para gestión de métricas de bodegas

## Principios de Diseño

1. **Fragmentación**: Ningún archivo supera las 150 líneas de código
2. **Reutilización**: Componentes compartidos como `MetricCard`
3. **Separación de responsabilidades**: Cada carpeta tiene un propósito específico
4. **Pure TSX**: Componentes enfocados únicamente en la UI
5. **Barrel exports**: Imports limpios a través de archivos `index.ts`

## Uso

```tsx
import {
  WarehousesMetricsGrid,
  WarehousesTable,
  WarehousesFilters,
} from "@/components/admin/warehouses";
```
