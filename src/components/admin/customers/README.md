# Customers Module

Módulo completo de análisis y gestión de clientes para el sistema de e-commerce.

## Funcionalidades

### 1. Análisis de Comportamiento de Clientes
- **Métricas principales**: Total de clientes, clientes activos, nuevos este mes, clientes leales
- **Valor promedio de orden**: Seguimiento del gasto promedio por transacción
- **Tasa de retención**: Porcentaje de clientes recurrentes
- **Valor de vida del cliente**: Valor promedio total por cliente

### 2. Gestión de Clientes Frecuentes
- **Programa de lealtad**: Sistema de puntos con niveles (Bronce, Plata, Oro, Platino)
- **Puntos acumulados**: Seguimiento de puntos por cliente
- **Beneficios por nivel**: Multiplicadores de puntos, envíos gratis, descuentos exclusivos
- **Top clientes**: Ranking de clientes por puntos acumulados

### 3. Sistema de Reservas
- **Reservas de productos**: Sistema para que los clientes reserven productos
- **Estados de reserva**: Activa, expirada, completada, cancelada
- **Fechas de expiración**: Control automático de reservas vencidas
- **Gestión por cliente**: Historial de reservas por cliente

### 4. Segmentación de Clientes
- **Segmentos automáticos**: High Value, Frequent, New, Occasional
- **Criterios configurables**: Mínimo de órdenes, gasto mínimo, días desde última orden
- **Métricas por segmento**: Conteo de clientes, valor total, valor promedio
- **Análisis de distribución**: Porcentajes por segmento

## Arquitectura

```
customers/
├── components/          # Modales y componentes específicos
│   ├── modals/         # CustomerDetailsModal
│   └── CustomersModals.tsx
├── hooks/              # useCustomerHandlers
├── metrics/            # CustomersMetricsGrid
├── pages/              # CustomersPageContent (con tabs)
├── shared/             # MetricCard, CustomerFilters
├── tables/             # CustomerBehaviorTable, CustomerSegmentsTable, ReservationsTable
└── index.ts
```

## Estados de Reserva

- **Activa**: Reserva vigente y disponible
- **Expirada**: Reserva vencida sin completar
- **Completada**: Reserva convertida en compra
- **Cancelada**: Reserva cancelada por el cliente o administrador

## Niveles de Lealtad

- **Bronce** (0-99 puntos): 1x puntos
- **Plata** (100-499 puntos): 1.5x puntos + envío gratis
- **Oro** (500-999 puntos): 2x puntos + envío gratis + descuento cumpleaños
- **Platino** (1000+ puntos): 3x puntos + envío gratis + descuento cumpleaños + ofertas exclusivas

## Filtros Disponibles

- **Por segmento**: Todos, Leales, Nuevos, Inactivos
- **Por nivel de lealtad**: Todos, Platino, Oro, Plata, Bronce
- **Búsqueda**: Por ID de cliente o nombre

## Métricas en Tiempo Real

- Actualización automática de métricas
- Tendencias con indicadores de crecimiento
- Comparativas mensuales
- KPIs principales del negocio