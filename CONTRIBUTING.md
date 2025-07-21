# Contributing to Obsidian O'Reilly Learning Plugin

Thank you for your interest in contributing to this project! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

1. Check if the issue has already been reported
2. Create a new issue with a clear title and description
3. Include steps to reproduce the problem
4. Add any relevant error messages or screenshots

### Suggesting Features

1. Check if the feature has already been requested
2. Create a new issue with the "enhancement" label
3. Clearly describe the feature and its benefits
4. Provide use cases if possible

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Development Setup

```bash
# Clone the repository
git clone https://github.com/scova0731/obsidian-oreilly-learning-plugin.git
cd obsidian-oreilly-learning-plugin

# Install dependencies
npm install

# Build the plugin
npm run build

# For development with auto-rebuild
npm run dev
```

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Test your changes with different types of O'Reilly books
- Verify that highlights are imported correctly
- Check for edge cases (empty highlights, special characters, etc.)

## Questions?

Feel free to open an issue if you have any questions about contributing.