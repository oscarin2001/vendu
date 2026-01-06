# Sales Components Architecture

Estructura profesional y escalable para los componentes de ventas y finanzas.

## 📁 Estructura de Carpetas

```
src/components/admin/sales/
├── pages/                    # Páginas principales
│   └── SalesPageContent.tsx  # Página principal de ventas con tabs
├── cards/                    # Componentes de tarjetas (próximamente)
├── tables/                   # Tablas de datos
│   └── SalesTable.tsx        # Tabla de ventas con filtros
├── charts/                   # Gráficos y visualizaciones (próximamente)
└── metrics/                  # Componentes de métricas
    └── SalesMetricsCards.tsx # Cards con métricas principales
```

## 🏗️ Arquitectura de Servicios

```
src/services/admin/sales/
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
- **Tabla de ventas** con estados y formato
- **Types TypeScript** completos
- **Hooks de datos** preparados para API

### 🚧 Próximamente

- **API integration** con las tablas mencionadas
- **Gráficos interactivos** para análisis visual
- **Filtros avanzados** por fecha, sucursal, empleado
- **Exportación de datos** (PDF, Excel)
- **Dashboard financiero** completo
- **Gestión de pagos** y estados

## 🗂️ Tablas de Base de Datos

### Ventas Generales

- `tborders` - Órdenes principales
- `tborderitems` - Items de cada orden
- `tbemployee_profiles` - Perfiles de empleados
- `tbbranches` - Información de sucursales

### Ingresos y Egresos

- `tbcash_flows` - Flujo de caja
- `tbexpenses` - Gastos registrados
- `tbcash_sessions` - Sesiones de caja

### Pagos y Estado Financiero

- `tbpayments` - Pagos realizados
- `tborders` - Referencia a órdenes

## 🎯 Estados de Implementación

| Módulo               | Estado       | Prioridad |
| -------------------- | ------------ | --------- |
| Estructura Base      | ✅ Completo  | Alta      |
| Navegación           | ✅ Completo  | Alta      |
| Métricas Básicas     | ✅ Completo  | Alta      |
| Tabla de Ventas      | ✅ Completo  | Alta      |
| API Integration      | 🚧 Pendiente | Alta      |
| Gráficos             | 📋 Planeado  | Media     |
| Filtros Avanzados    | 📋 Planeado  | Media     |
| Dashboard Financiero | 📋 Planeado  | Media     |

## 🔧 Próximos Pasos

1. **Implementar APIs** para conectar con las tablas de BD
2. **Crear componentes de gráficos** usando recharts
3. **Agregar filtros por fecha** y criterios múltiples
4. **Implementar exportación** de reportes
5. **Dashboard financiero** con análisis detallado
6. **Gestión de pagos** con diferentes métodos
