# Changelog

All notable changes to this project are documented here.
This project follows Keep a Changelog and Semantic Versioning.

## [1.0.0] - 2026-07-12

### Added
- Email/password authentication (register, login) with JWT-based sessions.
- Invoice CRUD: create, edit, delete, and mark invoices as Paid/Pending.
- Dashboard with total billed, outstanding amount, overdue count, and unique clients stats.
- Search, status filter, and sort controls for the invoice table.
- PDF export for individual invoices.
- Responsive layout (mobile card view + desktop table view).
- Toast notifications for all mutation outcomes.

### Fixed
- API base URL now read from VITE_API_URL environment variable instead of being hardcoded, so the frontend correctly targets the production backend when deployed.