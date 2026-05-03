#!/usr/bin/env python3
"""Interactive strategy monitor launcher.

This script provides a terminal menu and creates at least one Markdown report
skeleton under output/. It does not replace Codex research; it prepares the
correct artifact and embeds the execution instructions for Codex to complete.
"""

from __future__ import annotations

import argparse
import datetime as dt
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SKILL = ROOT / "small-power-charging-strategy-monitor"
OUTPUT = ROOT / "output"


OPTIONS = {
    "1": {
        "label": "月度战略复盘",
        "period": "monthly",
        "filename": "monthly-{date}-small-power-charging-strategy-review.md",
        "template": SKILL / "templates" / "monthly_report_template.md",
        "instruction": "运行本月小功率充电桩战略复盘。",
    },
    "2": {
        "label": "周度战略监控",
        "period": "weekly",
        "filename": "weekly-{date}-small-power-charging-strategy-review.md",
        "template": SKILL / "templates" / "weekly_report_template.md",
        "instruction": "运行本周小功率充电桩战略监控。",
    },
    "3": {
        "label": "临时事件判断",
        "period": "ad-hoc",
        "filename": "ad-hoc-{date}-small-power-charging-strategy-review.md",
        "template": SKILL / "templates" / "decision_matrix.md",
        "instruction": "针对临时事件判断是否需要调整战略。",
    },
    "4": {
        "label": "单一竞品档案",
        "period": "ad-hoc",
        "filename": "ad-hoc-{date}-competitor-dossier.md",
        "template": SKILL / "templates" / "competitor_dossier.md",
        "instruction": "生成单一竞品档案。",
    },
    "5": {
        "label": "证据矩阵刷新",
        "period": "ad-hoc",
        "filename": "ad-hoc-{date}-evidence-matrix.md",
        "template": SKILL / "templates" / "evidence_matrix.md",
        "instruction": "刷新证据矩阵。",
    },
    "6": {
        "label": "行动跟踪表",
        "period": "ad-hoc",
        "filename": "ad-hoc-{date}-action-tracker.md",
        "template": SKILL / "templates" / "action_tracker.md",
        "instruction": "生成行动跟踪表。",
    },
    "7": {
        "label": "Skill 自身审计",
        "period": "ad-hoc",
        "filename": "ad-hoc-{date}-strategy-monitor-skill-audit.md",
        "template": None,
        "instruction": "执行 skill-audit，评估并优化当前 skill。",
    },
    "8": {
        "label": "小功率 DC 专题",
        "period": "ad-hoc",
        "filename": "ad-hoc-{date}-small-dc-strategy-review.md",
        "template": SKILL / "templates" / "monthly_report_template.md",
        "instruction": "专题判断小功率 DC 20/30/40/60/80kW 是否应升级为重点产品线。",
    },
    "9": {
        "label": "海外 AC 专题",
        "period": "ad-hoc",
        "filename": "ad-hoc-{date}-overseas-ac-strategy-review.md",
        "template": SKILL / "templates" / "monthly_report_template.md",
        "instruction": "专题分析海外 AC 7/11/21kW 机会。",
    },
    "10": {
        "label": "标准与认证专题",
        "period": "ad-hoc",
        "filename": "ad-hoc-{date}-certification-strategy-review.md",
        "template": SKILL / "templates" / "monthly_report_template.md",
        "instruction": "专题扫描 CCC、GB/T、OCPP 和海外认证变化。",
    },
    "11": {
        "label": "季度历史报告综合分析",
        "period": "quarterly",
        "filename": "quarterly-{date}-small-power-charging-strategy-review.md",
        "template": SKILL / "templates" / "quarterly_report_template.md",
        "instruction": (
            "运行季度历史报告综合分析，读取 output/ 下最近 3 份月度报告、"
            "最近 1 份证据矩阵、最近 1 份行动跟踪表和上一季度报告，"
            "按 historical_report_synthesis_rules.md 进行趋势判断。"
        ),
    },
    "12": {
        "label": "管理层一页纸",
        "period": "ad-hoc",
        "filename": "ad-hoc-{date}-one-page-strategy-brief.md",
        "template": SKILL / "templates" / "one_page_strategy_brief.md",
        "instruction": "根据最近一次报告或用户指定报告生成管理层一页纸。",
    },
    "13": {
        "label": "研发资源决策",
        "period": "ad-hoc",
        "filename": "ad-hoc-{date}-rd-resource-decision.md",
        "template": SKILL / "templates" / "rd_resource_decision.md",
        "instruction": "将市场和竞品信号转为研发资源决策。",
    },
    "14": {
        "label": "TCO 低价反制",
        "period": "ad-hoc",
        "filename": "ad-hoc-{date}-tco-countermeasure.md",
        "template": SKILL / "templates" / "tco_countermeasure.md",
        "instruction": "针对低价压力或疑似低于成本报价生成 TCO 反制方案。",
    },
}


def choose() -> tuple[str, str]:
    print("请选择要运行的战略监控任务：")
    for key, item in OPTIONS.items():
        print(f"{key}. {item['label']}")
    raw = input("请输入编号；3/4/14 可追加事件、竞品名或低价场景：").strip()
    if not raw:
        raise SystemExit("未选择任务。")
    parts = raw.split(maxsplit=1)
    key = parts[0]
    extra = parts[1] if len(parts) > 1 else ""
    if key not in OPTIONS:
        raise SystemExit(f"无效编号：{key}")
    return key, extra


def build_report(key: str, extra: str, date: str) -> Path:
    item = OPTIONS[key]
    OUTPUT.mkdir(parents=True, exist_ok=True)
    filename = item["filename"].format(date=date)
    if key == "4" and extra:
        safe_name = (
            extra.lower()
            .replace("/", "-")
            .replace(" ", "-")
            .replace("_", "-")
        )
        filename = f"ad-hoc-{date}-{safe_name}-competitor-dossier.md"
    if key == "14" and extra:
        safe_name = (
            extra.lower()
            .replace("/", "-")
            .replace(" ", "-")
            .replace("_", "-")
        )
        filename = f"ad-hoc-{date}-{safe_name}-tco-countermeasure.md"
    path = OUTPUT / filename

    template_path = item["template"]
    template = template_path.read_text(encoding="utf-8") if template_path else "# Skill 自身审计\n\n"
    prompt = make_codex_prompt(item["instruction"], extra, path)

    content = (
        f"<!--\n"
        f"Codex 执行提示：\n{prompt}\n"
        f"-->\n\n"
        f"{template}\n"
    )
    path.write_text(content, encoding="utf-8")
    return path


def make_codex_prompt(instruction: str, extra: str, path: Path) -> str:
    extra_text = f"补充输入：{extra}" if extra else "补充输入：无"
    return (
        "使用 ./small-power-charging-strategy-monitor 这个 skill，"
        f"{instruction} {extra_text} "
        "读取所有 inputs/ 文件，优先使用 source_registry.md 和 search_playbook.md，按证据分级和战略阈值执行，"
        "如涉及挚达/智达，读取 zhida_risk_model.md，"
        "如为季度或历史综合任务，读取 historical_report_synthesis_rules.md 并综合历史报告，"
        "如涉及内部数据缺口，使用 internal_data_template.md 转成补数任务，"
        "正文必须中文，结论性内容使用颜色标注，"
        f"最终完整报告写入 {path.as_posix()}。"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Open a strategy monitor menu and create a report skeleton.")
    parser.add_argument("--choice", help="Menu choice number")
    parser.add_argument("--extra", default="", help="Extra event or competitor name")
    parser.add_argument("--date", default=dt.date.today().isoformat(), help="YYYY-MM-DD")
    args = parser.parse_args()

    key, extra = (args.choice, args.extra) if args.choice else choose()
    if key not in OPTIONS:
        raise SystemExit(f"无效编号：{key}")
    path = build_report(key, extra, args.date)
    print(f"已生成报告骨架：{path}")
    print("下一步：让 Codex 按文件顶部的执行提示补全报告。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
