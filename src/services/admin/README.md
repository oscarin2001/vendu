# Admin services

Convención: Cada dominio bajo `src/services/admin/<domain>` debe seguir la estructura:

- `repos/` - acceso a la BD
- `queries/` - consultas/lecturas
- `mutations/` - operaciones de escritura (fragmentadas por operación cuando correspondan)
- `services/` - lógica de negocio y validaciones
- `types/` - tipos y entidades
- `hooks/` - hooks react local al dominio

Si una carpeta contiene UI (componentes o páginas), muévela a `src/components/admin/` o a `src/app/...`.

Si encuentras carpetas obsoletas (como `dashboard` en este repo), marca como `DEPRECATED` con un `README.md` y crea una PR para borrarlas si no tienen referencias.
