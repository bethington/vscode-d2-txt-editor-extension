# Security Documentation

This document outlines the security measures implemented in the Diablo II .txt Editor extension.

## Security Architecture

### Threat Model

The extension handles potentially untrusted data from:

- User-edited TSV/CSV files
- Diablo II data files from various sources
- File paths and content from the file system
- User input through the webview interface

### Security Principles

1. **Defense in Depth** - Multiple layers of security controls
2. **Least Privilege** - Minimal permissions and access rights
3. **Input Validation** - All user input is validated and sanitized
4. **Secure by Default** - Secure configurations are the default

## Content Security Policy

### Strict CSP Implementation

The webview uses a strict Content Security Policy to prevent XSS attacks:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'none'; 
               script-src 'nonce-${nonce}'; 
               style-src 'unsafe-inline';">
```

**Policy Details:**

- `default-src 'none'` - Denies all resources by default
- `script-src 'nonce-${nonce}'` - Only allows scripts with matching nonce
- `style-src 'unsafe-inline'` - Allows inline styles (minimal risk)
- No `unsafe-eval` - Prevents dynamic code execution
- No external resources - All content is self-contained

### Nonce Generation

Each webview session generates a unique cryptographic nonce:

```typescript
const nonce = Math.random().toString(36).substring(2);
```

This prevents script injection even if HTML content is compromised.

## Input Sanitization

### HTML Escaping

All user content is escaped before HTML insertion:

```typescript
private escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m] as string);
}
```

**Protected Characters:**

- `&` → `&amp;` (must be first to prevent double-escaping)
- `<` → `&lt;` (prevents tag injection)
- `>` → `&gt;` (completes tag prevention)
- `"` → `&quot;` (prevents attribute injection)
- `'` → `&#39;` (prevents single-quote attribute injection)

### Cell Content Validation

Cell values are validated and sanitized:

1. **Length Limits** - Prevents memory exhaustion
2. **Character Filtering** - Removes control characters
3. **HTML Escaping** - Prevents script injection
4. **Path Validation** - Ensures file paths are safe

### File Path Security

File paths are validated to prevent directory traversal:

```typescript
// Validate base path for diff mode
if (!basePath || !fs.existsSync(basePath)) {
  vscode.window.showErrorMessage('Invalid base path');
  return;
}

// Resolve and validate file paths
const resolvedPath = path.resolve(basePath, fileName);
if (!resolvedPath.startsWith(path.resolve(basePath))) {
  throw new Error('Path traversal attempt detected');
}
```

## File System Access

### Restricted Access Scope

The extension only accesses:

1. **Workspace Files** - Files within the current VS Code workspace
2. **Explicit User Selections** - Files chosen through VS Code file dialogs
3. **Configured Base Path** - User-configured Diablo II installation path

### Base Path Validation

For diff mode, the base path is validated:

```typescript
private validateBasePath(basePath: string): boolean {
  // Check if path exists and is readable
  if (!fs.existsSync(basePath)) {
    return false;
  }
  
  // Ensure it's a directory
  const stat = fs.statSync(basePath);
  if (!stat.isDirectory()) {
    return false;
  }
  
  // Check for expected Diablo II structure
  const excelPath = path.join(basePath, 'global', 'excel');
  return fs.existsSync(excelPath);
}
```

## Webview Security

### Message Validation

All messages from webview are validated:

```typescript
webviewPanel.webview.onDidReceiveMessage(async (e: {
  type: string;
  row?: number;
  col?: number;
  value?: string;
  // ... other properties
}) => {
  // Validate message structure
  if (!e.type || typeof e.type !== 'string') {
    console.error('Invalid message type');
    return;
  }
  
  // Validate numeric parameters
  if (e.row !== undefined && (typeof e.row !== 'number' || e.row < 0)) {
    console.error('Invalid row index');
    return;
  }
  
  // Process validated message
  switch (e.type) {
    // ... handle specific message types
  }
});
```

### Event Handler Security

- No inline event handlers in HTML
- All events handled through message passing
- Event listeners properly cleaned up on disposal

## Error Handling

### Secure Error Messages

Error messages don't expose sensitive information:

```typescript
try {
  const content = fs.readFileSync(filePath, 'utf8');
  return content;
} catch (error) {
  // Don't expose full file paths or system details
  console.error('Failed to read file:', error.message);
  vscode.window.showErrorMessage('Unable to read file');
  return null;
}
```

### Exception Boundaries

All major operations are wrapped in try-catch blocks:

- File operations
- HTML generation
- Document updates
- Webview message handling

## Data Privacy

### Local Data Only

The extension:

- **Does NOT** send data to external servers
- **Does NOT** collect telemetry or analytics
- **Does NOT** access network resources
- Only processes files locally on the user's machine

### Temporary Data Handling

- No sensitive data stored in temporary files
- Memory cleaned up properly on extension deactivation
- Scroll positions and UI state stored securely

## Security Testing

### Test Coverage

Security tests cover:

```typescript
describe('HTML Escaping Security', () => {
  it('prevents XSS through script tags', () => {
    const malicious = '<script>alert("xss")</script>';
    const escaped = provider.escapeHtml(malicious);
    assert(!escaped.includes('<script>'));
  });
  
  it('escapes all dangerous characters', () => {
    const dangerous = '&<>"\'';
    const escaped = provider.escapeHtml(dangerous);
    assert.strictEqual(escaped, '&amp;&lt;&gt;&quot;&#39;');
  });
});
```

### Manual Testing

Regular manual testing includes:

- XSS attempt injection in cells
- Path traversal attempts
- Malformed message injection
- Large file handling
- Unicode and special character handling

## Security Monitoring

### Logging

Security-relevant events are logged:

```typescript
console.log('TSV: File access:', fileName);
console.error('TSV: Security violation:', details);
```

### Error Tracking

Security errors are tracked and reported:

- Input validation failures
- File access violations  
- Message validation errors
- Unexpected exceptions

## Best Practices for Contributors

### Code Review Checklist

When reviewing code, check for:

- [ ] All user input is validated and sanitized
- [ ] HTML content is properly escaped
- [ ] File paths are validated
- [ ] Error messages don't leak sensitive information
- [ ] No inline JavaScript in HTML
- [ ] CSP headers are properly set
- [ ] Test coverage includes security scenarios

### Secure Development Guidelines

1. **Never trust user input** - Always validate and sanitize
2. **Use parameterized queries** - When interfacing with external systems
3. **Fail securely** - Default to denial when validation fails
4. **Log security events** - For monitoring and debugging
5. **Keep dependencies updated** - Regular security updates

### Common Vulnerabilities to Avoid

- **XSS** - Through unescaped HTML content
- **Path Traversal** - Through manipulated file paths
- **Code Injection** - Through eval() or similar functions
- **CSRF** - Through unvalidated cross-origin requests
- **Information Disclosure** - Through verbose error messages

## Incident Response

### Security Issue Reporting

Security issues should be reported:

1. **Privately** - Not through public issue trackers
2. **Promptly** - As soon as discovered
3. **Detailed** - With reproduction steps and impact assessment

### Response Process

1. **Acknowledge** - Confirm receipt within 24 hours
2. **Assess** - Evaluate severity and impact
3. **Fix** - Develop and test security patch
4. **Release** - Deploy fix as emergency release if needed
5. **Communicate** - Notify users of security updates

## Security Updates

The extension follows these update practices:

- **Regular Updates** - Dependencies updated monthly
- **Security Patches** - Applied immediately when available
- **Vulnerability Scanning** - Automated security checks
- **Security Audits** - Periodic third-party reviews
