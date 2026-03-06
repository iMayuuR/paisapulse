# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-03-06

### Added
- **Global Dashboard Context**: Introduced a centralized time-filtering mechanism (`DashboardContext`) mapping month and year selections identically to both Home and Analytics pages.
- **Premium Custom Dropdowns**: Completely replaced native browser `<select>` dropdowns in Settings with a sleek, Framer Motion-animated custom UI for a premium Dark Mode aesthetic.
- **Home Page Date Jump**: Added a contextual "Viewing Past Data" badge and a "Jump to Current" shortcut button when viewing non-current months on the Home feed.

### Fixed
- **Refund Miscalculations**: Rearchitected mathematical aggregation explicitly mapping "Refunds" as direct offsets to spending rather than pure income (via unified `calculateFinancials` utility).
- **History Page Math Crash**: Fixed a critical algebraic bug on the `/history` screen where month totals were adding Expenses + Income rather than mapping net spend.
- **Native Input Scrollbars**: Removed ugly browser-native spin buttons on the Transaction input forms for a cleaner cross-platform layout.

## [0.1.0] - Initial Release
- Basic Auth and layout components.
- Initial expense creation, deletion, and categorical breakdown.
