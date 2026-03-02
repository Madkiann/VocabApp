# Changelog

All notable changes to the VocabApp project will be documented in this file.

## [1.1.0] - 2026-03-02
### Added
- Created `INSTRUCTIONS.md` as the master system roadmap.
- Implemented "Vaka Örnekleri" (Case Examples) logic for Phrasal Verbs.
- Added intelligent text truncation for sharing cards to prevent content overlap.
- Added `isSharing` state tracking with loading indicators (`Loader2`) for share buttons.

### Fixed
- **CRITICAL**: Fixed "Objects are not valid as a React child" error in `ChillMode`, `PhrasalCard`, `CommunityHub`, `Dashboard`, and `Vault`.
- Fixed share button unresponsiveness by refactoring to Promise-based flow.
- Fixed Phrasal Verb speaker icon; it now works before the card is revealed and doesn't trigger the reveal.
- Corrected share card mascot placement to the consistent bottom-right position.
- Removed English translations from Case Examples in-app and on shareable cards for a cleaner UI as requested.

### Changed
- Refactored `shareWord.js` to handle asynchronous canvas operations more reliably.
- Updated `CommunityHub` with the latest changelogs.

## [1.0.5] - 2026-03-01
### Added
- Introduced "Mind Bonds" concept logic.
- Added Daily Discovery Limit (concept).
- New mascot animations and transitions.

### Fixed
- UI alignment on small screens.
- Local storage sync issues.

## [1.0.0] - 2026-02-24
### Added
- Initial release.
- Vocab and Phrasal Verb modes.
- SM-2 spaced repetition integration.
- Chill Mode for passive learning.
