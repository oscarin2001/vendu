# Suppliers Module

Este módulo maneja la gestión completa de proveedores en el sistema de administración.

## Estructura de Carpetas

```
suppliers/
├── components/           # Componentes compartidos y modales
│   └── modals/          # Modales para operaciones CRUD
├── forms/               # Formularios para crear/editar proveedores
├── metrics/             # Componentes de métricas y dashboard
├── pages/               # Páginas principales (si se necesitan)
├── shared/              # Componentes y hooks compartidos
│   ├── components/      # Componentes reutilizables
│   ├── hooks/          # Hooks personalizados
│   └── types/          # Tipos TypeScript compartidos
└── tables/              # Componentes de tabla y filas
    └── components/      # Subcomponentes de tabla
```

## Componentes Principales

### Métricas

- `SuppliersMetricsGrid`: Grid de métricas del dashboard de proveedores
- `MetricCard`: Componente reutilizable para mostrar métricas individuales

### Tabla

- `SuppliersTable`: Tabla principal de proveedores
- `SuppliersTableSkeleton`: Skeleton loader para la tabla
- `SupplierTableRow`: Componente de fila individual de proveedor

### Filtros y Formularios

- `SuppliersFilters`: Componentes de filtrado
- `SupplierForm`: Formulario para crear/editar proveedores

### Modales

- `SupplierDeleteInitialModal`: Modal inicial de eliminación
- `SupplierDeleteWarningModal`: Modal de advertencia de eliminación
- `SupplierDeleteFinalModal`: Modal final de confirmación de eliminación
- `SupplierServiceConfigModal`: Modal de configuración de servicios

## Hooks

- `useSupplierMetrics`: Hook para gestión de métricas de proveedores

## Principios de Diseño

1. **Fragmentación**: Ningún archivo supera las 150 líneas de código
2. **Reutilización**: Componentes compartidos como `MetricCard`
3. **Separación de responsabilidades**: Cada carpeta tiene un propósito específico
4. **Pure TSX**: Componentes enfocados únicamente en la UI
5. **Barrel exports**: Imports limpios a través de archivos `index.ts`

## Uso

```tsx
import {
  SuppliersMetricsGrid,
  SuppliersTable,
  SuppliersFilters,
} from "@/components/admin/suppliers";
```
