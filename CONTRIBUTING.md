# Contributing to Diablo II .txt Editor

Thank you for your interest in contributing to the Diablo II .txt Editor! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 14+
- VS Code 1.70.0+
- Git

### Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/bethington/vscode-d2-txt-editor-extension.git
   cd vscode-d2-txt-editor-extension
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start Development**

   ```bash
   npm run watch
   ```

4. **Run Tests**

   ```bash
   npm test
   ```

5. **Test in VS Code**
   - Press `F5` to open a new Extension Development Host window
   - Open a Diablo II .txt file to test your changes

## 📝 Contributing Guidelines

### Code Style

- Use TypeScript for all code
- Follow existing code formatting and conventions
- Use meaningful variable and function names
- Add comments for complex logic

### Commit Messages

Use conventional commits format:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for test additions/changes

Example: `feat: add column highlighting on hover`

### Pull Request Process

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, well-documented code
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Thoroughly**
   - Test with various Diablo II data files
   - Test in both light and dark themes
   - Verify keyboard shortcuts work correctly

4. **Submit Pull Request**
   - Fill out the PR template
   - Link any related issues
   - Provide clear description of changes

## 🐛 Bug Reports

When reporting bugs, please include:

- VS Code version
- Extension version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Sample files (if possible)

Use the [Bug Report Template](https://github.com/bethington/vscode-d2-txt-editor-extension/issues/new?template=bug_report.md)

## 💡 Feature Requests

For feature requests, please:

- Check existing issues first
- Describe the feature clearly
- Explain the use case
- Consider implementation complexity

Use the [Feature Request Template](https://github.com/bethington/vscode-d2-txt-editor-extension/issues/new?template=feature_request.md)

## 🏗️ Architecture Overview

### Key Components

- **TsvEditorProvider**: Main custom editor provider
- **Webview**: HTML/CSS/JS interface for table editing
- **Message Handling**: Communication between VS Code and webview
- **File Parsing**: Tab-delimited file processing with Papa Parse

### File Structure

```text
src/
├── extension.ts          # Main extension entry point
├── types/               # TypeScript type definitions
└── test/               # Unit tests
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
npm test -- --grep "specific test name"

# Run with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for new functions
- Test edge cases and error conditions
- Mock VS Code APIs when needed
- Test with sample Diablo II data files

## 📚 Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Custom Editor Guide](https://code.visualstudio.com/api/extension-guides/custom-editors)
- [Webview Guide](https://code.visualstudio.com/api/extension-guides/webview)
- [Papa Parse Documentation](https://www.papaparse.com/docs)

## 🤝 Community

- Be respectful and constructive
- Help others learn and grow
- Share knowledge and best practices
- Focus on the Diablo II modding community needs

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes (for significant contributions)
- Special thanks section

Thank you for helping make this extension better for the Diablo II modding community! 🎮
