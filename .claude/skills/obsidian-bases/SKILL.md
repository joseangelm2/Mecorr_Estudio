---
name: obsidian-bases
description: Create and edit Obsidian Bases (.base files) with views, filters, formulas, and summaries. Use when working with .base files, creating database-like views of notes, or when the user mentions Bases, table views, card views, filters, or formulas in Obsidian.
---

# Obsidian Bases

Base files use the `.base` extension and contain valid YAML. They create database-like views over your vault notes.

## Workflow

1. **Create the file**: Create a `.base` file with valid YAML content
2. **Define scope**: Add `filters` to select which notes appear
3. **Add formulas** (optional): Define computed properties in `formulas`
4. **Configure views**: Add one or more views (`table`, `cards`, `list`, `map`)
5. **Validate**: Verify valid YAML, all referenced properties/formulas exist
6. **Test in Obsidian**: Open the `.base` file to confirm it renders

## Schema

```yaml
# Global filters (apply to ALL views)
filters:
  and:
    - 'status == "active"'
    - not:
        - 'file.hasTag("archived")'

# Computed properties
formulas:
  formula_name: 'expression'

# Display names and settings
properties:
  property_name:
    displayName: "Display Name"
  formula.formula_name:
    displayName: "Formula Display Name"

# Custom summary formulas
summaries:
  custom_summary_name: 'values.mean().round(3)'

# Views
views:
  - type: table | cards | list | map
    name: "View Name"
    limit: 10
    groupBy:
      property: property_name
      direction: ASC | DESC
    filters:
      and:
        - 'status == "active"'
    order:
      - file.name
      - property_name
      - formula.formula_name
    summaries:
      property_name: Average
```

## Filter Syntax

```yaml
# Single filter
filters: 'status == "done"'

# AND
filters:
  and:
    - 'status == "done"'
    - 'priority > 3'

# OR
filters:
  or:
    - 'file.hasTag("book")'
    - 'file.hasTag("article")'

# NOT
filters:
  not:
    - 'file.hasTag("archived")'

# Nested
filters:
  or:
    - file.hasTag("tag")
    - and:
        - file.hasTag("book")
        - file.hasLink("Textbook")
```

## File Properties Reference

| Property | Type | Description |
|----------|------|-------------|
| `file.name` | String | File name |
| `file.basename` | String | Name without extension |
| `file.path` | String | Full path |
| `file.folder` | String | Parent folder path |
| `file.ext` | String | File extension |
| `file.size` | Number | Size in bytes |
| `file.ctime` | Date | Created time |
| `file.mtime` | Date | Modified time |
| `file.tags` | List | All tags |
| `file.links` | List | Internal links |
| `file.backlinks` | List | Files linking here |

## Formula Syntax

```yaml
formulas:
  total: "price * quantity"
  status_icon: 'if(done, "✅", "⏳")'
  created: 'file.ctime.format("YYYY-MM-DD")'
  days_old: '(now() - file.ctime).days'
  days_until_due: 'if(due_date, (date(due_date) - today()).days, "")'
```

### Duration Rules

Subtracting two dates returns a **Duration** — not a number. Always access `.days`, `.hours`, etc. before calling math functions:

```yaml
# CORRECT
"(now() - file.ctime).days.round(0)"

# WRONG — Duration doesn't support round() directly
"(now() - file.ctime).round(0)"
```

## Key Functions

| Function | Description |
|----------|-------------|
| `date(string)` | Parse string to date |
| `now()` | Current datetime |
| `today()` | Current date (00:00:00) |
| `if(cond, t, f?)` | Conditional |
| `duration(string)` | Parse duration |
| `file(path)` | Get file object |
| `link(path, display?)` | Create link |

## Default Summary Formulas

`Average`, `Min`, `Max`, `Sum`, `Range`, `Median`, `Stddev` (Numbers) · `Earliest`, `Latest` (Dates) · `Checked`, `Unchecked` (Booleans) · `Empty`, `Filled`, `Unique` (Any)

## YAML Quoting Rules

- Use single quotes for formulas containing double quotes: `'if(done, "Yes", "No")'`
- Strings with `:`, `{`, `}`, `[`, `]` etc. must be quoted

## Embedding Bases

```markdown
![[MyBase.base]]
![[MyBase.base#View Name]]
```
