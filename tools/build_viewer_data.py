#!/usr/bin/env python3
"""Build static data for the local strategy document viewer."""

from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
VIEWER_DIR = ROOT / "viewer"
OUTPUT_FILE = VIEWER_DIR / "data.js"

DOC_GLOBS = [
    "reports/**/*.md",
    "cache/**/*.md",
    "sources/**/*.md",
    "logic/**/*.md",
    "docs/**/*.md",
    "strategy-monitor/inputs/**/*.md",
    "strategy-monitor/templates/**/*.md",
    "strategy-monitor/SKILL.md",
    "strategy-monitor/README.md",
    "strategy-monitor/prompts/**/*.md",
    "*.md",
]

EV_ID_RE = re.compile(r"\bEV-\d{8}-[A-Z0-9_]+-\d{3}\b")
HTML_COLOR_RE = re.compile(r"<span\s+style=\"color:([^\";]+)[^\"]*\">(.*?)</span>", re.I | re.S)


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def classify(path: Path) -> tuple[str, str, list[str]]:
    parts = path.parts
    name = path.name
    tags: list[str] = []

    if parts[0] == "reports":
        if "competitor-dossier" in name:
            return "竞品档案", "reports", ["report", "competitor"]
        if "evidence-matrix" in name:
            return "证据矩阵", "reports", ["report", "evidence"]
        if "quarterly" in name:
            return "季度报告", "reports", ["report", "quarterly"]
        if "monthly" in name:
            return "月度报告", "reports", ["report", "monthly"]
        if "skill-audit" in name:
            return "系统审计", "reports", ["report", "audit"]
        return "输出报告", "reports", ["report"]

    if "cache" in parts:
        idx = parts.index("cache")
        area = parts[idx + 1] if len(parts) > idx + 1 else "cache"
        if area == "competitors":
            competitor = parts[idx + 2] if len(parts) > idx + 2 else "unknown"
            return "竞品证据库", competitor, ["cache", "competitor", competitor]
        if area == "market_policy":
            return "市场政策证据库", "market_policy", ["cache", "market_policy"]
        if area == "customers":
            customer = parts[idx + 2] if len(parts) > idx + 2 else "customers"
            return "客户内部缺口", customer, ["cache", "customer", customer]
        if area == "product_strategy":
            return "产品策略库", "product_strategy", ["cache", "product_strategy"]
        return "证据库规则", "cache", ["cache"]

    if "inputs" in parts:
        return "运行输入", "inputs", ["input"]
    if parts[0] == "sources":
        return "信息来源", "sources", ["source"]
    if parts[0] == "logic":
        return "商业逻辑", "logic", ["logic"]
    if parts[0] == "docs":
        return "系统文档", "docs", ["docs"]
    if "templates" in parts:
        return "模板", "templates", ["template"]
    if "prompts" in parts:
        return "运行入口", "prompts", ["prompt"]
    if name in {"SKILL.md", "README.md"}:
        return "系统说明", "system", ["system"]
    return "根文档", "root", ["root"]


def title_from_text(path: Path, text: str) -> str:
    for line in text.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return path.stem.replace("-", " ")


def headings(text: str) -> list[dict[str, str | int]]:
    result = []
    for line in text.splitlines():
        match = re.match(r"^(#{1,4})\s+(.+?)\s*$", line)
        if match:
            title = re.sub(r"<[^>]+>", "", match.group(2)).strip()
            result.append({"level": len(match.group(1)), "title": title})
    return result


def plain_excerpt(text: str, limit: int = 220) -> str:
    stripped = re.sub(r"```.*?```", " ", text, flags=re.S)
    stripped = re.sub(r"<[^>]+>", " ", stripped)
    stripped = re.sub(r"[#>*|`\-\[\]():]", " ", stripped)
    stripped = re.sub(r"\s+", " ", stripped).strip()
    return stripped[:limit]


def status_counts(text: str) -> dict[str, int]:
    counts = {"red": 0, "orange": 0, "green": 0, "gray": 0}
    for color, _ in HTML_COLOR_RE.findall(text):
        color = color.strip().lower()
        if color in counts:
            counts[color] += 1
    return counts


def infer_relations(path: str, text: str, tags: list[str]) -> list[str]:
    relations = set(tags)
    for ev_id in EV_ID_RE.findall(text):
        relations.add(ev_id)
    keywords = {
        "zhida": ["挚达", "智达", "ZHIDA"],
        "bull": ["公牛", "BULL"],
        "keda_intelligent": ["科大智能", "KEDA"],
        "wattsaving": ["Wattsaving", "能效电气", "WATTSAVING"],
        "tesla_china": ["Tesla", "特斯拉", "TESLA"],
        "star_charge": ["星星充电", "STAR"],
        "wuling": ["五菱", "WULING"],
        "xpeng": ["小鹏", "XPENG"],
        "ccc": ["CCC", "强制性产品认证"],
        "small_dc": ["小功率 DC", "20/30kW", "20kW", "30kW"],
        "vave": ["VAVE", "降本", "平台化"],
    }
    haystack = f"{path}\n{text}"
    for key, words in keywords.items():
        if any(word in haystack for word in words):
            relations.add(key)
    return sorted(relations)


def collect_documents() -> list[dict[str, object]]:
    seen: set[Path] = set()
    docs: list[dict[str, object]] = []

    for pattern in DOC_GLOBS:
        for path in ROOT.glob(pattern):
            if not path.is_file() or path in seen:
                continue
            seen.add(path)
            rel_path = rel(path)
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                text = path.read_text(encoding="utf-8", errors="replace")
            category, group, tags = classify(Path(rel_path))
            doc_headings = headings(text)
            relations = infer_relations(rel_path, text, tags)
            stat = path.stat()
            docs.append(
                {
                    "id": rel_path,
                    "path": rel_path,
                    "title": title_from_text(path, text),
                    "category": category,
                    "group": group,
                    "tags": sorted(set(tags)),
                    "relations": relations,
                    "evIds": sorted(set(EV_ID_RE.findall(text))),
                    "headings": doc_headings,
                    "excerpt": plain_excerpt(text),
                    "statusCounts": status_counts(text),
                    "lineCount": text.count("\n") + 1,
                    "updated": datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M"),
                    "content": text,
                }
            )

    return sorted(docs, key=lambda item: (str(item["category"]), str(item["path"])))


def build_collections(docs: list[dict[str, object]]) -> dict[str, list[dict[str, object]]]:
    reports = []
    evidence = []
    competitors: dict[str, dict[str, object]] = {}
    gaps = []
    logic_docs = []

    for doc in docs:
        path = str(doc["path"])
        category = str(doc["category"])
        relations = list(doc.get("relations", []))

        if path.startswith("reports/"):
            reports.append(doc)

        if doc.get("evIds") or path.startswith("cache/market_policy/") or path == "cache/evidence_index.md":
            evidence.append(doc)

        if path.startswith("cache/competitors/"):
            parts = Path(path).parts
            name = parts[2] if len(parts) > 2 else "unknown"
            item = competitors.setdefault(
                name,
                {
                    "id": name,
                    "name": name,
                    "documents": [],
                    "evidenceIds": set(),
                    "riskTags": set(),
                },
            )
            item["documents"].append(doc)
            item["evidenceIds"].update(doc.get("evIds", []))
            item["riskTags"].update(r for r in relations if r in {"zhida", "bull", "keda_intelligent", "star_charge", "wattsaving", "tesla_china"})

        if path.startswith("cache/customers/") or path == "cache/unresolved_internal_gaps.md":
            gaps.append(doc)

        if path.startswith("logic/"):
            logic_docs.append(doc)

    competitor_list = []
    for item in competitors.values():
        item["evidenceIds"] = sorted(item["evidenceIds"])
        item["riskTags"] = sorted(item["riskTags"])
        competitor_list.append(item)

    return {
        "reports": sorted(reports, key=lambda item: str(item["path"]), reverse=True),
        "evidence": sorted(evidence, key=lambda item: str(item["path"])),
        "competitors": sorted(competitor_list, key=lambda item: str(item["id"])),
        "gaps": sorted(gaps, key=lambda item: str(item["path"])),
        "logic": sorted(logic_docs, key=lambda item: str(item["path"])),
    }


def main() -> None:
    VIEWER_DIR.mkdir(exist_ok=True)
    docs = collect_documents()
    collections = build_collections(docs)
    payload = {
        "generatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "root": str(ROOT),
        "documents": docs,
        **collections,
    }
    OUTPUT_FILE.write_text(
        "window.STRATEGY_VIEWER_DATA = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUTPUT_FILE.relative_to(ROOT)} with {len(docs)} documents")


if __name__ == "__main__":
    main()
