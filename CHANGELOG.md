# Changelog

All notable changes to PaisaPulse are documented here.

## [1.3.0] - 2026-03-24

### Changed
- **Neon Nocturne UI Revamp**: Complete color theme overhaul from Neon Yellow/Cyan to Black/Purple (`#B026FF`, `#FF2E93`). All hardcoded hex/rgba values replaced globally.
- **Logo & Icons**: SVG app icon updated with neon purple-to-fuchsia gradient and glow. Favicon and PWA icons synced via Next.js `icon.svg`.
- **Responsive Layout**: Full Desktop, Tablet, and Mobile responsiveness across all pages (Dashboard, Analytics, Add Expense, History, Settings). Added persistent `<SideNav />` for desktop.

## [0.2.0] - 2026-03-06

### Added
- **Global Dashboard Context**: Centralized time-filtering (`DashboardContext`) for month/year across Home and Analytics.
- **Premium Custom Dropdowns**: Native `<select>` replaced with animated Framer Motion custom UI in Settings.
- **Home Page Date Jump**: "Viewing Past Data" badge + "Jump to Current" shortcut.

### Fixed
- **Refund Miscalculations**: Reclassified refunds as spending offsets via `calculateFinancials()`.
- **History Page Math Crash**: Fixed net spend aggregation adding Expenses + Income incorrectly.
- **Native Input Scrollbars**: Removed browser-native spin buttons on forms.

## [0.1.0] - Initial Release
- Auth, layout components, expense creation, deletion, and category breakdown.
