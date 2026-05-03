---
name: small-power-charging-strategy-monitor
description: Periodic strategy validation for the China small-power EV charging industry. Use when Codex needs to run weekly, monthly, or ad hoc monitoring of portable chargers, AC 3.5/7/11/21kW chargers, small DC 20/30/40/60/80kW chargers, OEM/ODM charging supply, automaker aftermarket, regional installation partners, competitor moves such as Zhida, Keda Intelligent, Bull, Star Charge, Wattsaving, or Tesla China, and decide whether the company's strategic route should be maintained, adjusted, or stopped.
---

# Small Power Charging Strategy Monitor

## Overview

Run this skill to determine whether the current small-power charging strategy is still correct. Do not produce a news digest; produce a strategy decision backed by current evidence.

Before each run, read:

- `inputs/company_profile.md`
- `inputs/strategic_assumptions.md`
- `inputs/competitor_watchlist.md`
- `inputs/source_policy.md`
- `inputs/internal_data_requirements.md`
- `inputs/prompt_ontology.md`
- `inputs/strategic_thresholds.md`
- `inputs/historical_report_synthesis_rules.md` when running quarterly or historical synthesis

Use the appropriate template:

- Weekly monitoring: `templates/weekly_report_template.md`
- Monthly review: `templates/monthly_report_template.md`
- Quarterly historical synthesis: `templates/quarterly_report_template.md`
- Strategy decision: `templates/decision_matrix.md`
- Evidence review: `templates/evidence_matrix.md`
- Competitor deep dive: `templates/competitor_dossier.md`
- Action tracking: `templates/action_tracker.md`

## Report Modes

Choose the mode from the user request:

- `strategy-review`: generate a weekly, monthly, quarterly, or ad hoc strategy review. This is the default mode.
- `quarterly-synthesis`: synthesize the last several reports, evidence matrices, and action trackers before making a quarterly strategy decision.
- `skill-audit`: evaluate whether the monitoring system itself is complete, whether data fields are missing, and how the skill should be improved.
- `competitor-dossier`: create or update a single competitor profile using the same evidence rules.
- `evidence-refresh`: update only the evidence matrix and unresolved internal data gaps.

## Slash-Style Invocation

This skill includes a reusable prompt at `prompts/strategy-monitor.md`. When installed into the Codex prompts directory as `~/.codex/prompts/strategy-monitor.md`, the user can type:

```text
/strategy-monitor
```

The prompt must show a numbered menu, wait for the user's selection, then execute the selected workflow and generate at least one Markdown report under `output/`.

If custom prompts are unavailable in the active Codex CLI, use the terminal launcher:

```bash
python3 small-power-charging-strategy-monitor/scripts/strategy_monitor_menu.py
```

The launcher creates the correct report skeleton in `output/` and embeds the Codex execution prompt at the top of the file.

## Run Cadence

Use this operating rhythm unless the user specifies another cadence:

- Weekly: scan high-risk signals, competitor moves, tender/pricing changes, OEM customer changes, and policy/standard updates.
- Monthly: run the full assumption validation table and update the strategy map.
- Quarterly: read recent historical reports first, then re-check core strategic direction, R&D allocation, cost/VAVE targets, product line priorities, channel direction, and negative-margin red lines.

## Evidence Rules

Use current external evidence for each run. Follow `inputs/source_policy.md`.

Prioritize sources in this order:

1. Exchange filings, annual reports, prospectuses, and official disclosures.
2. Official company websites and public announcements.
3. Government agencies, China Charging Alliance, industry associations, and standards bodies.
4. Automaker announcements, tender documents, and procurement signals.
5. Reputable industry or financial media.

Treat self-media, forums, social posts, distributor claims, and unverified screenshots as weak signals. Label them as unverified and never use them as decisive evidence.

For recent market, competitor, financial, policy, pricing, tender, or product data, browse or otherwise verify current sources before drawing conclusions. Include source links or source names in the evidence column.

Every key conclusion must have:

- Evidence strength: `强`、`中`、`弱`、`内部必需`、`证据不足`.
- Source type: official, filing, regulator, association, automaker, tender, company website, reputable media, weak signal, or internal data.
- Confidence: `高`、`中`、`低`.
- Internal data gap, if the conclusion cannot be closed by public sources.

Do not state that a competitor is bidding below cost unless one of these is available:

- Internal competitor quote plus internal BOM/cost benchmark.
- Audited financial evidence proving project-level cost structure.
- Customer RFQ evidence with price, scope, service obligation, and comparable cost base.

Otherwise mark it as `低价压力` or `疑似低于成本，需内部验证`.

## Workflow

1. Define the monitoring period, such as weekly, monthly, quarterly, or ad hoc.
2. Read the company profile, strategic assumptions, competitor watchlist, source policy, prompt ontology, internal data requirements, and strategic thresholds from `inputs/`.
3. Normalize keywords and company aliases using `inputs/prompt_ontology.md`.
4. Collect evidence for market demand, price, tenders, OEM procurement, installation services, competitor products, competitor customers, financing, margins, overseas moves, standards, CCC/GB/T/OCPP updates, and overseas certification.
5. Build or update an evidence matrix using `templates/evidence_matrix.md`.
6. Separate conclusions into:
   - Publicly verifiable.
   - Internally required.
   - Weak signal only.
   - Evidence insufficient.
7. Check internal data needs using `inputs/internal_data_requirements.md`; list missing fields explicitly.
8. Evaluate H1-H6 against `inputs/strategic_thresholds.md`. Do not rely only on qualitative wording.
9. For each important competitor, use `templates/competitor_dossier.md` when the monthly report needs deeper support.
10. Filter noise. Keep only evidence that affects demand, price, customer access, profit pool, competitor strategy, product roadmap, margin risk, R&D allocation, standards/certification, or channel strategy.
11. Validate H1-H6. Mark each assumption as `成立`, `部分变化`, `不成立`, or `证据不足`.
12. Update the competitor strategy map for Zhida, Keda Intelligent, Bull, Star Charge, Wattsaving, and Tesla China. Add other competitors only when evidence shows strategic relevance.
13. Decide the adjustment level:
   - A. 维持战略
   - B. 小幅调整
   - C. 重大调整
   - D. 立即止损
14. Convert the decision into actions for 1-4 weeks and 6-24 months. Use `templates/action_tracker.md` for action tracking.
15. State what should not be done. Explicitly reject attractive but unsupported moves.

For quarterly or historical synthesis runs:

1. Read `inputs/historical_report_synthesis_rules.md`.
2. Read the latest available historical artifacts under `output/`:
   - Recent `monthly-*-small-power-charging-strategy-review.md` files, ideally the latest 3.
   - The latest `*-evidence-matrix.md`.
   - The latest `*-action-tracker.md`.
   - The latest previous `quarterly-*-small-power-charging-strategy-review.md`, if present.
3. Extract H1-H6 status, final decisions, evidence levels, unresolved internal data gaps, high-risk signals, and unfinished actions.
4. Compare historical conclusions with current evidence. Do not copy historical conclusions as current conclusions.
5. Treat repeated risks and unresolved gaps according to `inputs/historical_report_synthesis_rules.md`.
6. Use `templates/quarterly_report_template.md` and answer whether the strategy should stay at `维持战略` or move to `小幅调整`、`重大调整`、or `立即止损`.

Legacy workflow mapping:

```text
Evidence collection -> evidence matrix -> H1-H6 threshold check -> competitor dossier -> strategy decision -> action tracker
```

## First-Principles Checks

Every strategic conclusion must explain:

- Demand source: EV stock, OEM bundling, home charging, destination charging, aftermarket, policy, or overseas export.
- Commoditization: whether the product is standardized, price-transparent, and supplier-abundant.
- Profit pool: hardware, installation, service, channel, scenario resources, platform, aftermarket, or OEM entry.
- Scarce resource: OEM access, brand, channel, installation network, station resources, capital, technology, certification, or data.
- Low-price sustainability: structural cost advantage versus strategic loss-making.
- Recovery path: installation, service, aftermarket, capital market story, supply-chain scale, overseas growth, or none.
- Replicability: whether our company can copy the strategy; if not, recommend avoidance or side attack.
- R&D impact: platformization, cost reduction, certification, test scope, product roadmap, or resource pause.

## Decision Guardrails

Do not recommend:

- A nationwide C-end brand war against Bull without strong evidence that channel economics and service capability are favorable.
- Copying Zhida's national installation network without checking capital, management capacity, and recovery path.
- Full-line small DC development without customer orders or a verified high-probability pipeline.
- Accepting normalized negative-margin orders without a defined recovery path and stop-loss condition.
- Expanding R&D scope before converting the evidence into customer, product, certification, cost, and test requirements.

Always address customer concentration risk and negative-margin risk.

Always address standards and certification risk:

- China CCC for EV supply equipment.
- GB/T and related charging standards.
- OCPP when platform or overseas compatibility matters.
- Overseas certification by region, at least EU, UK, North America, and Southeast Asia when overseas AC is discussed.

## Output Requirements

Use `templates/weekly_report_template.md` for weekly scans, `templates/monthly_report_template.md` for full monthly reviews, and `templates/quarterly_report_template.md` for quarterly historical synthesis. Use `templates/decision_matrix.md` whenever the user asks whether to maintain, adjust, or stop a strategic direction.

Every run must create a Markdown file under `output/`. Do not only answer in chat unless the user explicitly asks for chat-only output.

Create `output/` if it does not exist.

Filename format:

```text
<period>-<YYYY-MM-DD>-small-power-charging-strategy-review.md
```

Examples:

- `weekly-2026-05-03-small-power-charging-strategy-review.md`
- `monthly-2026-05-03-small-power-charging-strategy-review.md`
- `quarterly-2026-05-03-small-power-charging-strategy-review.md`
- `ad-hoc-2026-05-03-small-power-charging-strategy-review.md`

Write the report content in Chinese. Keep English only when the name cannot be naturally replaced, such as company names, product model names, standards, URLs, stock tickers, or fixed strategy labels like `OEM/ODM`, `VAVE`, `AC`, `DC`, `RFQ`, `GB/T`, `OCPP`, `Tesla`, `Wattsaving`.

The first section must be a Chinese executive conclusion of no more than five bullets.

Use color marking for conclusion-style content. Use HTML spans inside Markdown:

- Positive or maintain decision: `<span style="color:green">结论：维持当前方向</span>`
- Warning or minor adjustment: `<span style="color:orange">结论：需要小幅调整</span>`
- High risk or stop-loss: `<span style="color:red">结论：触发止损或重大风险</span>`
- Evidence gap: `<span style="color:gray">结论：证据不足，继续跟踪</span>`

Apply color marking at least to:

- Executive conclusion bullets.
- Strategic adjustment decision.
- Each final decision answer.
- High-risk warning signals.
- Evidence gaps that block conclusions.
- Immediate stop-loss or negative-margin warnings.

For monthly and quarterly `strategy-review` runs, include an evidence matrix section in the main report. If the report is long or the user asks for separate artifacts, also create companion files:

```text
output/<period>-<YYYY-MM-DD>-evidence-matrix.md
output/<period>-<YYYY-MM-DD>-action-tracker.md
```

For competitor deep dives, create:

```text
output/<period>-<YYYY-MM-DD>-<competitor>-competitor-dossier.md
```

The final decision must answer clearly:

1. Should we adjust strategy now?
2. What should be adjusted?
3. What must be done immediately?
4. What should not be done?
5. What should be tracked next time?
