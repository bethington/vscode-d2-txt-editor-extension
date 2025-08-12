# API Documentation

## Diablo II .txt Editor Extension

Comprehensive API documentation for the VS Code extension that enables editing of Diablo II tab-delimited data files.

**Author:** bethington  
**Version:** 1.1.3  
**Since:** 1.0.0

## Table of Contents

- [Core Interfaces](#core-interfaces)
- [Main Classes](#main-classes)
- [Extension Functions](#extension-functions)
- [Configuration](#configuration)
- [File Support](#file-support)
- [Performance](#performance)
- [Security](#security)
- [Testing](#testing)
- [Accessibility](#accessibility)

## Core Interfaces

### WebviewMessage

Message interface for communication between webview and extension.

**Properties:**

- `type: string` - The type of message being sent
- `row?: number` - Row index for cell operations
- `col?: number` - Column index for cell operations
- `value?: string` - Cell value for update operations
- `text?: string` - Text content for clipboard operations
- `index?: number` - Index for row/column operations
- `ascending?: boolean` - Sort direction for column sorting
- `x?: number` - X coordinate for scroll position
- `y?: number` - Y coordinate for scroll position

### DiffCell

Represents a single cell in diff comparison mode.

**Properties:**

- `columnIndex: number` - The column index of this cell
- `baseValue: string` - Value from the base game file
- `modValue: string` - Value from the mod file
- `status: 'same' | 'modified' | 'base-only' | 'mod-only'` - Comparison status

### DiffRow

Represents a complete row in diff comparison mode.

**Properties:**

- `rowIndex: number` - The row index in the current view
- `baseRowIndex: number` - Row index in the base file
- `modRowIndex: number` - Row index in the mod file
- `cells: DiffCell[]` - Array of diff cells in this row
- `status: 'same' | 'modified' | 'base-only' | 'mod-only'` - Row comparison status
- `isHeader?: boolean` - Whether this is a header row

## Main Classes

### TsvEditorProvider

Main provider class for the custom TSV editor.

**Implements:** `vscode.CustomTextEditorProvider`

This class handles:

- Custom text editor implementation for Diablo II data files
- Webview content generation and management
- Document editing operations (CRUD for cells, rows, columns)
- Diff mode functionality for comparing base vs modded files
- Virtual scrolling for large datasets
- Theme-aware rendering

**Example:**

```typescript
// Extension activation registers the provider
const provider = new TsvEditorProvider(context);
context.subscriptions.push(
  vscode.window.registerCustomEditorProvider(
    TsvEditorProvider.viewType, 
    provider
  )
);
```

## Extension Functions

### activate

Extension activation function that registers all commands and the custom editor provider.

**Parameters:**

- `context: vscode.ExtensionContext` - The extension context

**Registered Commands:**

- `tsv.toggleExtension` - Enable/disable the extension
- `tsv.toggleHeader` - Toggle header row treatment
- `tsv.toggleSerialIndex` - Toggle row numbering
- `tsv.changeFontFamily` - Change editor font
- `tsv.openAsText` - Open file in text editor
- `diablo2TxtEditor.setBasePath` - Set base game path for diff mode
- `diablo2TxtEditor.openDiffViewer` - Open diff comparison view

**Example:**

```typescript
// Called automatically by VS Code when extension loads
export function activate(context: vscode.ExtensionContext) {
  // Registration logic here
}
```

### deactivate

Extension deactivation function. Cleanup function called when extension is deactivated.
Currently no cleanup is required as VS Code handles disposal of registered commands and providers automatically.

## Configuration

Configuration settings for the extension in VS Code settings.json:

- `tsv.enabled: boolean` - Enable/disable the extension (default: true)
- `tsv.treatFirstRowAsHeader: boolean` - Treat first row as header (default: true)
- `tsv.addSerialIndex: boolean` - Add row numbers (default: false)
- `csv.fontFamily: string` - Font family for the editor (default: inherit)
- `csv.cellPadding: number` - Cell padding in pixels (default: 8)
- `diablo2TxtEditor.basePath: string` - Path to base Diablo II files for diff mode

## File Support

The extension supports 60+ Diablo II data file types including:

### Character & Stats

- `CharStats.txt` - Character class definitions
- `Experience.txt` - Character experience tables
- `ItemStatCost.txt` - Item property definitions

### Items & Equipment

- `Weapons.txt` - Weapon definitions
- `Armor.txt` - Armor definitions
- `Misc.txt` - Miscellaneous items
- `UniqueItems.txt` - Unique item properties
- `SetItems.txt` - Set item definitions

### Skills & Spells

- `Skills.txt` - Skill definitions
- `SkillDesc.txt` - Skill descriptions
- `Missiles.txt` - Projectile definitions

### Monsters & AI

- `MonStats.txt` - Monster statistics
- `MonType.txt` - Monster type classifications
- `MonPlace.txt` - Monster placement rules

### Level Design

- `Levels.txt` - Level definitions
- `LvlTypes.txt` - Level type classifications
- `LvlPrest.txt` - Level presets

And many more game data files used in Diablo II modding.

## Performance

The extension includes several performance optimizations:

### Virtual Scrolling

- Large datasets (>1000 rows) use virtual scrolling
- Only visible rows are rendered in the DOM
- Smooth scrolling with intersection observers

### Efficient Parsing

- Uses Papa Parse library for robust CSV/TSV parsing
- Lazy loading of table chunks for better responsiveness
- Optimized column width calculation

### Memory Management

- Proper cleanup of event listeners and subscriptions
- Webview disposal handling
- Document change throttling to prevent excessive updates

### Diff Mode Optimization

- Efficient diff algorithm for comparing files
- Cached diff results to avoid recomputation
- Progressive rendering of diff highlights

## Security

### Content Security Policy

- Strict CSP prevents execution of untrusted scripts
- Nonce-based script loading for webview content
- No inline event handlers or unsafe-eval

### Input Sanitization

- All user input is properly escaped before HTML insertion
- Protection against XSS attacks in cell content
- Safe handling of file paths and content

### File System Access

- Limited to workspace files and explicitly selected paths
- Base path validation for diff mode
- No arbitrary file system access

## Testing

### Test Structure

- Unit tests for utility functions
- Integration tests for provider methods
- Security tests for input validation
- Type tests for interface compliance

### Test Commands

```bash
npm test              # Run all tests
npm run test:unit     # Run unit tests only
npm run test:security # Run security tests
npm run test:types    # Run type validation tests
```

### Coverage Requirements

- Minimum 80% code coverage for core functionality
- 100% coverage for security-critical functions
- Regular testing with various Diablo II file formats

## Accessibility

### Keyboard Navigation

- Arrow keys for cell navigation
- Tab/Shift+Tab for moving between cells
- Enter to edit cells, Escape to cancel
- Ctrl+C/Ctrl+V for copy/paste operations

### Screen Reader Support

- Proper ARIA labels for table elements
- Role attributes for custom UI components
- Accessible context menus
- Status announcements for operations

### Visual Accessibility

- High contrast theme support
- Configurable font sizes
- Color-blind friendly diff highlighting
- Focus indicators for all interactive elements
