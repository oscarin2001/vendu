# Inventory Components Architecture

Estructura profesional y escalable para los componentes de inventario.

## 📁 Estructura de Carpetas

```
src/components/admin/inventory/
├── pages/                    # Páginas principales
│   └── InventoryPageContent.tsx # Página principal con tabs
├── cards/                    # Componentes de tarjetas (próximamente)
├── tables/                   # Tablas de datos
│   ├── InventoryTable.tsx    # Tabla de stock global
│   └── ProductPerformanceTable.tsx # Tabla de rendimiento
├── metrics/                  # Componentes de métricas
│   └── InventoryMetricsCards.tsx # Cards con métricas principales
└── README.md                 # Documentación
```

## 🏗️ Arquitectura de Servicios

```
src/services/admin/inventory/
├── hooks/                    # React hooks personalizados
│   ├── data/                 # Hooks de carga de datos
│   ├── actions/              # Hooks de acciones (próximamente)
│   └── main/                 # Hooks principales
├── types/                    # Definiciones TypeScript
│   └── entities/             # Interfaces de datos
└── index.ts                  # Exportaciones principales
```

## 📊 Funcionalidades Implementadas

### ✅ Completado
- **Estructura base** de carpetas y archivos
- **Navegación integrada** en el sidebar
- **Página principal** con tabs organizados
- **Métricas básicas** (cards informativos)
- **Tabla de inventario** con estados de condición
- **Tabla de rendimiento** de productos con indicadores
- **Types TypeScript** completos
- **Hooks de datos** preparados para API

### 🚧 Próximamente
- **API integration** con las tablas mencionadas
- **Gráficos de distribución** por sucursal/bodega
- **Filtros avanzados** por condición y categoría
- **Alertas de stock** bajo
- **Gestión de ajustes** de inventario
- **Reportes de inventario** detallados

## 🗂️ Tablas de Base de Datos

### Stock Global
- `tbinventories` - Registros principales de inventario
- `tbbranches` - Información de sucursales
- `tbproductvariants` - Variantes de productos

### Estado de Productos
- `tbwarehouse_entry` - Entradas a bodega
- `tbstock_adjustments` - Ajustes de stock

### Productos Más/Menos Vendidos
- `tborders` - Órdenes de venta
- `tborderitems` - Items de cada orden
- `tbproductvariants` - Variantes de productos
- `tbproducts` - Información de productos

## 🎯 Estados de Condición

| Estado | Descripción | Color |
|--------|-------------|-------|
| Excelente | Producto en perfectas condiciones | Verde |
| Bueno | Producto en buen estado | Azul |
| Aceptable | Producto aceptable para venta | Amarillo |
| Dañado | Producto dañado | Rojo |

## 📈 Indicadores de Rendimiento

### Rotación de Productos
- **Alta Rotación** (≥2): Producto vende rápido
- **Buena Rotación** (≥1): Producto vende bien
- **Baja Rotación** (<1): Producto se queda en stock

### Métricas Clave
- **Total vendido**: Cantidad total vendida
- **Ingresos totales**: Valor monetario generado
- **Precio promedio**: Valor promedio de venta
- **Stock actual**: Cantidad disponible
- **Última venta**: Fecha de última transacción

## 🔧 Próximos Pasos

1. **Implementar APIs** para conectar con las tablas de BD
2. **Crear componentes de gráficos** para visualización
3. **Agregar sistema de alertas** para stock bajo
4. **Implementar filtros** por condición y categoría
5. **Dashboard de inventario** con análisis detallado
6. **Gestión de movimientos** de inventario