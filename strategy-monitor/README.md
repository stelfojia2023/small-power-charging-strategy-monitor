# Small Power Charging Strategy Monitor

This skill periodically validates whether the company's small-power EV charging strategy remains correct.

It is designed for:

- Weekly signal scans.
- Monthly full strategy reviews.
- Ad hoc decisions when a competitor, customer, tender, price, policy, or product signal appears.

## Directory

```text
strategy-monitor/
├── SKILL.md
├── inputs/
│   ├── company_profile.md
│   ├── strategic_assumptions.md
│   ├── competitor_watchlist.md
│   ├── source_policy.md
│   ├── internal_data_requirements.md
│   ├── internal_data_template.md
│   ├── prompt_ontology.md
│   ├── strategic_thresholds.md
│   ├── historical_report_synthesis_rules.md
│   └── zhida_risk_model.md
├── templates/
│   ├── weekly_report_template.md
│   ├── monthly_report_template.md
│   ├── quarterly_report_template.md
│   ├── decision_matrix.md
│   ├── evidence_matrix.md
│   ├── strategy_scorecard.md
│   ├── one_page_strategy_brief.md
│   ├── rd_resource_decision.md
│   ├── tco_countermeasure.md
│   ├── competitor_dossier.md
│   └── action_tracker.md
└── README.md
```

Repository-level directories used by this skill:

- `sources/`: fixed source registry and reusable search playbooks.
- `cache/`: human-readable reusable evidence library.
- `data/`: machine-readable JSONL facts, evidence, scores, gaps, and actions.
- `logic/`: hypothesis, scorecard, stop-loss, and competitor model rules.
- `reports/`: generated reports grouped by cadence and purpose.
- `tools/`: local automation scripts.

## How to Run

Ask Codex to use this skill for a weekly or monthly review.

Example:

```text
Use $strategy-monitor to run this month's small-power charging strategy review.
```

The output must decide whether to maintain the current strategy, make a minor adjustment, make a major adjustment, or trigger immediate stop-loss.

For quarterly monitoring, ask Codex to synthesize historical reports first:

```text
Use $strategy-monitor to run quarterly historical report synthesis.
```

## Slash-style Menu

Codex CLI's built-in slash popup is controlled by the CLI. To make this skill work like a slash command, install or copy `prompts/strategy-monitor.md` into the Codex prompts directory:

```bash
mkdir -p ~/.codex/prompts
cp strategy-monitor/prompts/strategy-monitor.md ~/.codex/prompts/strategy-monitor.md
```

Restart Codex, then type:

```text
/strategy-monitor
```

The prompt will show a numbered menu. Choose an option and Codex must generate at least one Markdown report under `reports/`.

If the local CLI version does not load custom prompts from `~/.codex/prompts`, use the terminal launcher instead:

```bash
python3 tools/strategy_monitor_menu.py
```

This opens the same numbered menu and creates a report skeleton under `reports/`.

## Optimized Workflow

Each run must follow this sequence:

```text
读取输入 -> 读取本地证据库 -> 判断证据是否过期 -> 只刷新缺失/过期/关键证据 -> 更新本地证据库 -> 填写证据矩阵 -> 标注内部数据缺口 -> 按阈值验证 H1-H6 -> 更新竞品档案 -> 输出战略决策 -> 输出行动跟踪
```

The skill now separates:

- Publicly verifiable evidence.
- Local reusable evidence cache.
- Fixed source registry.
- Reusable search questions.
- Internal data required for closure.
- Internal data fill-in workflow.
- Weak signals.
- Evidence gaps.
- Historical report trends.
- Strategy scoring.
- R&D resource decisions.
- TCO low-price countermeasures.

## Local Evidence Cache

The `cache/` directory stores reusable evidence so repeated runs do not need to search the same sources every time.

Use it as a long-lived evidence library, not as a permanent replacement for current verification.

Key files:

| File | Purpose |
|---|---|
| `cache/evidence_index.md` | Top-level index of reusable evidence blocks |
| `cache/freshness_rules.md` | Rules for deciding whether cached evidence is current, stale, expired, or internally required |
| `cache/unresolved_internal_gaps.md` | Internal data gaps that public sources cannot close |
| `cache/market_policy/` | Market, policy, charging infrastructure, CCC, GB/T, overseas regulation |
| `cache/competitors/` | Competitor profiles, financials, products, customers, services, pricing signals |
| `cache/customers/` | Internal customer/RFQ/pricing/margin placeholders for Wuling, XPeng, and new OEMs |
| `cache/product_strategy/` | Product-line decisions, VAVE, certification roadmap, testing needs |

Each run should first read `cache/evidence_index.md` and `cache/freshness_rules.md`.

Cached evidence marked `current` can be reused. Cached evidence marked `stale_check` should be refreshed if it affects a key decision. Cached evidence marked `expired` cannot support a current decision. Evidence marked `internal_required` must be converted into an internal data gap.

When a run finds reusable new evidence, append it to the relevant cache file and update `cache/evidence_index.md`.

Do not claim below-cost bidding, negative-margin expansion, or project profitability without internal data such as quote, BOM, margin, RFQ, installation cost, and service scope.

For quarterly analysis, the skill must read `inputs/historical_report_synthesis_rules.md` and then synthesize recent `reports/` artifacts before producing the current decision. The goal is to identify repeated risks, evidence upgrades, unresolved internal data gaps, and unfinished actions across months.

For Zhida-related analysis, the skill must read `inputs/zhida_risk_model.md` and evaluate OEM scale delivery, price-anchor attack, installation recovery, platform/data, capital support, overseas growth, and aftermarket entry.

## Output Rules

Each run must generate a Markdown file in `reports/`.

Filename format:

```text
<period>-<YYYY-MM-DD>-small-power-charging-strategy-review.md
```

Examples:

```text
weekly-2026-05-03-small-power-charging-strategy-review.md
monthly-2026-05-03-small-power-charging-strategy-review.md
quarterly-2026-05-03-small-power-charging-strategy-review.md
```

The report body must be written in Chinese. English is allowed only for names or terms that cannot be naturally replaced, such as `OEM/ODM`, `VAVE`, `AC`, `DC`, `RFQ`, `GB/T`, `OCPP`, `Tesla`, and `Wattsaving`.

Conclusion-style content must use Markdown-compatible HTML color marks, for example:

```html
<span style="color:orange">结论：需要小幅调整</span>
```

Monthly and quarterly runs should include an evidence matrix in the main report. When a separate evidence artifact is useful, create:

```text
reports/evidence_matrix/<period>-YYYY-MM-DD-evidence-matrix.md
reports/action_trackers/<period>-YYYY-MM-DD-action-tracker.md
reports/management_briefs/<period>-YYYY-MM-DD-one-page-strategy-brief.md
reports/rd_decisions/<period>-YYYY-MM-DD-rd-resource-decision.md
```

## Core Question

The final report must answer:

```text
Does the latest evidence change our strategy?
```

If not, say maintain. If yes, state what changed, why it matters, and what action should be taken.
