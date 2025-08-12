# User Guide

Welcome to the Diablo II .txt Editor! This comprehensive guide will help you get the most out of this powerful extension for editing Diablo II data files.

## Table of Contents

- [Getting Started](#getting-started)
- [Basic Features](#basic-features)
- [Advanced Features](#advanced-features)
- [Diff Mode](#diff-mode)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Tips and Tricks](#tips-and-tricks)

## Getting Started

### Installation

1. **Open VS Code**
2. **Open Extensions** (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. **Search for** "Diablo II .txt Editor"
4. **Click Install**

### Opening Files

The extension automatically handles these Diablo II file types:

- **Character Data:** CharStats.txt, Experience.txt, ItemStatCost.txt
- **Item Data:** Weapons.txt, Armor.txt, Misc.txt, UniqueItems.txt
- **Skill Data:** Skills.txt, SkillDesc.txt, Missiles.txt
- **Monster Data:** MonStats.txt, MonType.txt, MonPlace.txt
- **Level Data:** Levels.txt, LvlTypes.txt, LvlPrest.txt
- **And 50+ more Diablo II data files**

Simply open any supported file and the custom editor will launch automatically.

### First Time Setup

1. **Open a Diablo II data file** (e.g., weapons.txt)
2. **The table editor loads automatically**
3. **Configure your preferences** using the Command Palette:
   - `Ctrl+Shift+P` → "Diablo II: Toggle Header Row"
   - `Ctrl+Shift+P` → "Diablo II: Change Font Family"

## Basic Features

### Table View

The extension displays your data in a spreadsheet-like interface:

- **Column Headers** - First row treated as headers (configurable)
- **Rainbow Colors** - Each column has a distinct color for easy tracking
- **Row Numbers** - Optional serial index for easy reference
- **Sticky Headers** - Headers stay visible while scrolling

### Cell Editing

**Direct Editing:**
1. **Double-click any cell** to start editing
2. **Type your changes**
3. **Press Enter** to save, **Escape** to cancel

**Keyboard Editing:**
1. **Click a cell** to select it
2. **Press Enter** to start editing
3. **Use Tab/Shift+Tab** to move between cells while editing

### Data Types

The editor automatically detects and color-codes data types:

- **Boolean** - True/false values (green tones)
- **Integer** - Whole numbers (blue tones)  
- **Float** - Decimal numbers (purple tones)
- **Date** - Date values (orange tones)
- **String** - Text content (red tones)
- **Empty** - No data (gray)

### Row and Column Operations

**Adding Rows/Columns:**
1. **Right-click** on a row number or column header
2. **Select** "Add ROW: above/below" or "Add COLUMN: left/right"

**Deleting Rows/Columns:**
1. **Right-click** on a row number or column header  
2. **Select** "Delete ROW" or "Delete COLUMN"

**Warning:** Deletions cannot be undone easily - save your work first!

## Advanced Features

### Column Sorting

**Sort any column:**
1. **Click the column header** 
2. **Choose** "Sort: A-Z" (ascending) or "Sort: Z-A" (descending)

**Multi-level sorting:**
- Sort by primary column first
- Then sort by secondary column
- Data maintains relationships between rows

### Selection and Copy/Paste

**Cell Selection:**
- **Single cell** - Click to select
- **Range** - Click and drag across multiple cells
- **Column** - Click column header to select entire column
- **Row** - Click row number to select entire row
- **All** - Click top-left corner to select everything

**Copy/Paste:**
1. **Select cells** using methods above
2. **Copy** with `Ctrl+C` (or `Cmd+C`)
3. **Paste** in another application as tab-delimited text

### Virtual Scrolling

For large files (1000+ rows):
- Only visible rows are rendered for performance
- Smooth scrolling with automatic loading
- Memory efficient handling of massive datasets

### Find and Replace

**Search within data:**
1. **Press** `Ctrl+F` (or `Cmd+F`)
2. **Type** your search term
3. **Navigate** results with Enter/Shift+Enter
4. **Close** search with Escape

## Diff Mode

Compare your modded files with the original Diablo II data:

### Setup

1. **Set Base Path:**
   - `Ctrl+Shift+P` → "Diablo II: Set Base Path"
   - Select your Diablo II installation directory
   - Extension looks for files in `basePath/global/excel/`

2. **Open Diff Viewer:**
   - Open a modded file (e.g., modified weapons.txt)
   - `Ctrl+Shift+P` → "Diablo II: Open Diff Viewer"

### Understanding Diff Colors

- **🟢 Green** - Added in mod (not in base game)
- **🟡 Yellow** - Modified from base game
- **🔵 Blue** - Exists in base but not in mod
- **⚪ White** - Unchanged from base game

### Diff Operations

**Accept Changes:**
- **Right-click** modified cells → "Accept diff change"
- **Right-click** row numbers → "Accept entire row"

**View Base Values:**
- Modified cells show both current and base values
- Base values appear in smaller italic text below

## Keyboard Shortcuts

### Navigation
- **Arrow Keys** - Move between cells
- **Tab** - Move to next cell
- **Shift+Tab** - Move to previous cell
- **Page Up/Down** - Scroll through large datasets
- **Home/End** - Go to beginning/end of row
- **Ctrl+Home/End** - Go to beginning/end of document

### Editing
- **Enter** - Start editing selected cell
- **F2** - Start editing selected cell (alternative)
- **Escape** - Cancel editing
- **Delete** - Clear cell content
- **Ctrl+Z** - Undo last change
- **Ctrl+Y** - Redo last change

### Selection
- **Ctrl+A** - Select all cells
- **Shift+Arrow** - Extend selection
- **Ctrl+Click** - Add cell to selection
- **Shift+Click** - Select range to clicked cell

### File Operations
- **Ctrl+S** - Save file
- **Ctrl+O** - Open file
- **Ctrl+N** - New file

## Configuration

### Extension Settings

Access via `File → Preferences → Settings` and search for "Diablo II":

**Core Settings:**
- `tsv.enabled` - Enable/disable the extension
- `tsv.treatFirstRowAsHeader` - Treat first row as headers
- `tsv.addSerialIndex` - Show row numbers

**Display Settings:**
- `csv.fontFamily` - Custom font for the editor
- `csv.cellPadding` - Cell padding in pixels

**Diff Mode Settings:**
- `diablo2TxtEditor.basePath` - Path to Diablo II installation

### Command Palette Commands

Access via `Ctrl+Shift+P`:

- **"Diablo II: Toggle Extension"** - Enable/disable extension
- **"Diablo II: Toggle Header Row"** - Show/hide headers
- **"Diablo II: Toggle Serial Index"** - Show/hide row numbers
- **"Diablo II: Change Font Family"** - Select custom font
- **"Diablo II: Set Base Path"** - Configure base game path
- **"Diablo II: Open Diff Viewer"** - Start diff comparison
- **"Diablo II: Open as Text"** - Switch to text editor

## Troubleshooting

### Common Issues

**Extension not working:**
1. Check if extension is enabled: `Ctrl+Shift+P` → "Diablo II: Toggle Extension"
2. Try reloading VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"
3. Check file extension is supported (see Getting Started section)

**Performance issues with large files:**
1. The extension uses virtual scrolling for files >1000 rows
2. Consider splitting very large files if performance is poor
3. Close other VS Code extensions temporarily

**Diff mode not working:**
1. Verify base path is set correctly
2. Ensure base path contains `global/excel/` folder structure
3. Check that base file exists (same name as your modded file)

**Content not displaying correctly:**
1. Check file encoding (should be UTF-8 or ASCII)
2. Verify file uses tab delimiters (not spaces or commas)
3. Try opening as text editor to check raw content

### Error Messages

**"TSV extension is disabled"**
- Solution: `Ctrl+Shift+P` → "Diablo II: Toggle Extension"

**"Base game file not found"**
- Solution: Check base path configuration and file names match

**"Failed to parse data"**
- Solution: Check file format and encoding

### Getting Help

1. **Check this documentation** for common solutions
2. **Search existing issues** on GitHub
3. **Create new issue** with:
   - VS Code version
   - Extension version  
   - Steps to reproduce
   - Sample file (if possible)

## Tips and Tricks

### Productivity Tips

**Quick Navigation:**
- Use `Ctrl+G` to go to specific row number
- Double-click column borders to auto-resize
- Use Find (`Ctrl+F`) to quickly locate specific values

**Editing Efficiency:**
- Use Tab to quickly move through cells while editing
- Copy formulas or patterns and paste to multiple cells
- Use column sorting to organize data before editing

**Data Management:**
- Save frequently when making large changes
- Use diff mode to track changes from base game
- Keep backups of working files

### Working with Large Files

**Performance optimization:**
- Close other tabs/extensions when working with >10,000 rows
- Use virtual scrolling (automatic for large files)
- Consider splitting massive files into smaller sections

**Memory management:**
- Restart VS Code occasionally with very large datasets
- Monitor system memory usage
- Save work frequently

### Modding Workflows

**Creating New Items:**
1. Open relevant file (weapons.txt, armor.txt, etc.)
2. Find similar existing item to copy
3. Add new row and modify properties
4. Use diff mode to see changes from base game
5. Test in-game and iterate

**Balancing Existing Items:**
1. Enable diff mode to see current vs base values
2. Make incremental changes
3. Use column sorting to compare similar items
4. Document changes for future reference

### Collaboration

**Sharing Changes:**
- Export modified data using copy/paste
- Share entire files through version control
- Document changes in commit messages

**Code Reviews:**
- Use diff mode to highlight all changes
- Export diff summary for review
- Test changes incrementally

### Advanced Techniques

**Bulk Operations:**
- Sort by column to group similar items
- Select multiple cells for pattern changes
- Use find/replace for systematic updates

**Data Analysis:**
- Sort by different columns to find patterns
- Use color coding to identify data types
- Export to spreadsheet for complex analysis

**Quality Assurance:**
- Use diff mode to verify intended changes only
- Check data types after modifications
- Test edge cases and boundary values
