# Obsidian O'Reilly Learning Plugin

Import your O'Reilly Learning highlights and notes directly into your [Obsidian](https://obsidian.md) vault. Keep your technical knowledge organized and under your control.

## Overview

This plugin helps you export highlights from O'Reilly Learning Platform and import them into Obsidian. Your learning notes remain under your control and are never held hostage in the cloud.

## Features

- 📚 **Import highlights from O'Reilly Learning** — Export all your book highlights and annotations
- 📝 **Smart organization** — Creates markdown files with highlights sorted by reading order
- 📂 **Flexible file management** — Choose where to save your highlights in your vault
- 🔗 **Direct links** — Each highlight includes a link back to the exact location in O'Reilly
- 🚀 **Simple workflow** — Copy script, run in browser, import JSON file

## Installation

### From Obsidian Community Plugins (Coming Soon)

1. Open **Settings** → **Community plugins**
2. Click **Browse** and search for "O'Reilly Learning"
3. Click **Install**, then **Enable**

### Manual Installation

1. Download the latest release from the [Releases](https://github.com/scova0731/obsidian-oreilly-learning-plugin/releases) page
2. Extract the `obsidian-oreilly-learning-plugin` folder to your vault's `.obsidian/plugins/` directory
3. Reload Obsidian
4. Enable the plugin in **Settings** → **Community plugins**

## Usage

### Step 1: Export your highlights

1. Log in to [O'Reilly Learning](https://learning.oreilly.com)
2. Open the browser console (F12 → Console)
3. In Obsidian, click the book icon or use command palette: "Import O'Reilly highlights from JSON"
4. Copy the export script from the modal (click to copy)
5. Paste and run it in the browser console
6. A JSON file will be downloaded automatically

### Step 2: Import to Obsidian

1. In the same modal, click "Choose file"
2. Select the downloaded JSON file
3. Your highlights will be imported and organized by book

### File Organization

By default, highlights are saved to:
```
oreilly-highlights/
├── Book Title 1.md
├── Book Title 2.md
└── ...
```

Each book file contains:
- Book metadata (ISBN, cover image, O'Reilly URL)
- All highlights sorted by reading order
- Chapter headers for easy navigation
- Your personal notes/annotations
- Direct links to each highlight location

## Configuration

### Settings

| Setting | Description | Default |
|---------|-------------|---------|
| **Highlights folder** | Where to save imported highlights | `oreilly-highlights/` |

## Example Output

```markdown
# Learning Python, 5th Edition

![Cover](https://learning.oreilly.com/covers/...)

**ISBN:** 9781449355739
**URL:** [View on O'Reilly](https://learning.oreilly.com/library/view/...)

---

## Highlights

### Chapter 1: A Python Q&A Session

Python is a general-purpose programming language... - [link](https://learning.oreilly.com/.../ch01.html#abc123)

**Location:** 42

---

### Chapter 2: How Python Runs Programs

Source code you type is translated to byte code... - [link](https://learning.oreilly.com/.../ch02.html#def456)

**Note:** Important concept for understanding performance

**Location:** 156

---
```

## Troubleshooting

### Export script doesn't work
- Make sure you're logged in to O'Reilly Learning
- Try refreshing the page and running the script again
- Check the browser console for error messages
- Some books may have special characters that need escaping

### Import fails
- Ensure the JSON file downloaded completely
- Check that you selected the correct file
- Verify the file isn't corrupted

### Highlights appear in wrong order
- The plugin automatically detects and handles different highlight formats
- Books with location data are sorted by reading position
- Books without location data are sorted by creation date

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

[MIT License](LICENSE)

## Acknowledgments

- Inspired by [obsidian-kindle-plugin](https://github.com/hadynz/obsidian-kindle-plugin) by @hadynz
- Built with the [Obsidian API](https://github.com/obsidianmd/obsidian-api)
- Developed with assistance from [Claude Code](https://github.com/anthropics/claude-code)

---

Made with ❤️ for the Obsidian and O'Reilly Learning communities