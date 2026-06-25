---
name: defuddle
description: Extract clean markdown from web pages using Defuddle, removing clutter like navigation and ads to save tokens. Use when fetching web content for analysis, when the user wants to read an article or documentation page, or as a token-efficient alternative to WebFetch for standard web pages.
---

# Defuddle

CLI utility to extract clean, readable content from web pages. Preferred over WebFetch for standard web content (articles, docs, blog posts) since it strips clutter and saves tokens.

## Basic Usage

```bash
# Extract as markdown (most common — token efficient)
defuddle parse <url> --md

# Extract as JSON with metadata
defuddle parse <url> --json

# Extract as HTML
defuddle parse <url> --html

# Save directly to file
defuddle parse <url> --md > output.md

# Extract specific metadata
defuddle parse <url> --title
defuddle parse <url> --domain
defuddle parse <url> --description
```

## When to Use

| Use defuddle | Use WebFetch |
|---|---|
| Articles, blog posts | URLs already in `.md` format |
| Documentation pages | GitHub raw content |
| News sites | APIs returning JSON |
| Any HTML page with content | Already clean content |

## Notes

- Requires `defuddle` to be installed: `npm install -g defuddle-cli`
- Strips navigation, ads, sidebars, footers
- Preserves headings, paragraphs, lists, code blocks
- Output is clean markdown suitable for further processing
