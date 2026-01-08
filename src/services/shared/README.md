# shared services

Notes:

- The previous `src/services/utils` directory (which contained `errors.ts` and `logger.ts`) was removed because it was unused and introduced duplication risk.
- If you need domain errors or a logging utility, prefer implementing them in `src/services/shared` or a dedicated `src/services/shared/utils` module so they are available cross-domain and documented here.

Recommendations:

- Add structured `Logger` with configurable levels and context (requestId, tenantId).
- Add `DomainError` subclasses (e.g., `NotFoundError`, `ValidationError`) with `status` and `code` fields so HTTP layers can map errors to proper HTTP responses.
