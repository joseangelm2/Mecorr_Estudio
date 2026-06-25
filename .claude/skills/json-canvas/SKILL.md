---
name: json-canvas
description: Create and edit JSON Canvas files (.canvas) with nodes, edges, groups, and connections. Use when working with .canvas files, creating visual diagrams, mind maps, or flowcharts in Obsidian.
---

# JSON Canvas

A canvas file (`.canvas`) contains two top-level arrays following the JSON Canvas Spec 1.0: `nodes` (visual elements) and `edges` (connections between them).

## Core Structure

```json
{
  "nodes": [],
  "edges": []
}
```

## Node Types

### Text Node
```json
{
  "id": "abc1234567890abc",
  "type": "text",
  "x": 0,
  "y": 0,
  "width": 400,
  "height": 200,
  "text": "# Heading\n\nMarkdown content here."
}
```

### File Node
```json
{
  "id": "abc1234567890abc",
  "type": "file",
  "x": 500,
  "y": 0,
  "width": 400,
  "height": 300,
  "file": "Notes/My Note.md",
  "subpath": "#Heading"
}
```

### Link Node
```json
{
  "id": "abc1234567890abc",
  "type": "link",
  "x": 0,
  "y": 300,
  "width": 400,
  "height": 200,
  "url": "https://example.com"
}
```

### Group Node
```json
{
  "id": "abc1234567890abc",
  "type": "group",
  "x": -50,
  "y": -50,
  "width": 900,
  "height": 500,
  "label": "Group Label",
  "background": "path/to/image.png",
  "backgroundStyle": "cover"
}
```

## Edges

```json
{
  "id": "edge1234567890ab",
  "fromNode": "abc1234567890abc",
  "fromSide": "right",
  "fromEnd": "none",
  "toNode": "def1234567890def",
  "toSide": "left",
  "toEnd": "arrow",
  "color": "1",
  "label": "Edge Label"
}
```

Side values: `top`, `right`, `bottom`, `left`
End values: `none`, `arrow`

## Node Colors

```
"1" = red
"2" = orange
"3" = yellow
"4" = green
"5" = cyan
"6" = purple
Or any hex: "#AA11AA"
```

## Layout Rules

- Generate unique **16-character hexadecimal IDs** for each element
- Position nodes with **50–100px spacing** to avoid overlap
- Coordinate system: x increases rightward, y increases downward
- Align to **10 or 20px grid** for cleaner layouts
- All edge `fromNode` and `toNode` values must reference existing node IDs

## Validation Checklist

Before saving:
- [ ] All IDs are unique 16-char hex strings
- [ ] All edge node references exist in `nodes`
- [ ] JSON is valid (no trailing commas, proper escaping)
- [ ] Use `\n` for newlines in text content (not `\\n`)
