# Change Log

All notable changes to the "Diablo II .txt Editor" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Rainbow color scheme for column text with 12 distinct colors for better visual separation
- Improved button styling with padding for better user experience
- Comprehensive documentation following VS Code extension best practices

### Changed

- Removed support for .tsv files to focus exclusively on Diablo II data files
- Enhanced visual design with theme-aware color palettes
- Refined file associations to better serve Diablo II modding community

### Fixed

- Build configuration issues with VS Code tasks and launch settings
- Markdown formatting compliance for all documentation files

## [1.0.0] - Initial Release

### Features

- Custom editor for Diablo II .txt data files
- Table-based editing interface with sortable columns
- Support for all Diablo II data file types including:
  - Character stats (CharStats.txt)
  - Item properties (ItemStatCost.txt, ItemTypes.txt, Weapons.txt, Armor.txt)
  - Skill definitions (Skills.txt, SkillDesc.txt)
  - Monster data (MonStats.txt, MonType.txt, MonPlace.txt)
  - Level configuration (Levels.txt, LvlTypes.txt, LvlPrest.txt)
  - Game mechanics (Experience.txt, DifficultyLevels.txt)
  - And many more Diablo II modding files
- Raw text editing mode for advanced users
- Keyboard shortcuts for efficient workflow
- Light and dark theme support
- Auto-detection of tab-delimited format
- Undo/redo functionality
- Real-time preview of changes

### Capabilities

- **Table Editor**: Visual editing with sortable columns and cell selection
- **Raw Text Mode**: Direct text editing for complex modifications
- **File Support**: Comprehensive support for Diablo II data files
- **Theme Integration**: Seamless integration with VS Code themes
- **Keyboard Shortcuts**:
  - `Ctrl+E` / `Cmd+E`: Toggle between table and raw text modes
  - Standard editing shortcuts supported
- **Data Integrity**: Preserves file structure and formatting
