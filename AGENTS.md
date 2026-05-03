# Repository Guidelines

## Project Structure & Module Organization

This repository maintains a small-power EV charging strategy monitor skill, generated reports, a local evidence cache, and a static document viewer.

- `strategy-monitor/`: skill package and operating rules.
- `strategy-monitor/inputs/`: stable strategy assumptions, source policy, internal data templates, prompt ontology, and thresholds.
- `strategy-monitor/templates/`: report templates for weekly, monthly, quarterly, evidence, competitor, R&D, and TCO outputs.
- `sources/`: fixed source registry and reusable search playbooks.
- `cache/`: human-readable reusable evidence library. Update `cache/evidence_index.md` when adding reusable evidence.
- `data/`: machine-readable JSONL facts, evidence, scores, gaps, and actions.
- `logic/`: hypothesis, scorecard, stop-loss, and competitor model rules.
- `reports/`: generated strategy reports grouped by cadence and purpose.
- `tools/`: Python utilities for report skeletons and viewer data generation.
- `viewer/`: static local browser for Markdown content. `viewer/data.js` is generated.

## Build, Test, and Development Commands

- `python3 tools/strategy_monitor_menu.py`: open the report menu and create a report skeleton in `reports/`.
- `python3 tools/build_viewer_data.py`: rebuild `viewer/data.js` from Markdown files.
- `python3 -m py_compile tools/*.py`: syntax-check Python scripts.
- `node --check viewer/app.js`: syntax-check the static viewer JavaScript.
- Open `viewer/index.html` in a browser to inspect the local viewer; no server is required.

## Coding Style & Naming Conventions

Use UTF-8 Markdown. Keep report text in Chinese unless a template, title, standard, company name, or fixed term requires English. Python scripts should follow standard library-first style, 4-space indentation, and clear `Path`-based file handling. JavaScript should remain dependency-free and browser-native.

Generated reports should follow existing names, for example `monthly-YYYY-MM-DD-small-power-charging-strategy-review.md`. Evidence IDs use `EV-YYYYMMDD-OBJECT-001`.

## Testing Guidelines

There is no formal test suite. Validate changes with syntax checks and a viewer rebuild:

```bash
python3 -m py_compile tools/*.py
node --check viewer/app.js
python3 tools/build_viewer_data.py
```

After content changes, inspect `viewer/index.html` for search, filters, rendered Markdown, and related document links.

## Commit & Pull Request Guidelines

Git history is not available in this checkout, so no existing commit convention can be inferred. Use concise imperative messages such as `Add evidence cache viewer` or `Update monthly strategy template`.

Pull requests should summarize changed report, cache, script, or viewer areas; list validation commands run; and note any stale evidence, internal data gaps, or generated files such as `viewer/data.js`.

## Agent-Specific Instructions

Do not replace cached evidence blindly. Check `cache/freshness_rules.md` first, refresh stale decision-critical sources, and preserve source URL, evidence grade, collection date, and internal data gaps.
