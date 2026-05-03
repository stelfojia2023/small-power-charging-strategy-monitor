# 数据治理

## 证据分层

- `cache/`：面向人工阅读，保留完整上下文、来源、证据等级和内部缺口。
- `data/`：面向程序处理，按 JSONL 记录事实、评分、行动项和缺口。
- `reports/`：面向输出消费，不作为唯一事实来源。

## 时效规则

先查 `cache/freshness_rules.md`：

- `current`：可直接复用。
- `stale_check`：影响关键结论时必须刷新。
- `expired`：只能作历史背景。
- `internal_required`：公开资料无法闭环，必须补内部数据。

## 内部数据

报价、BOM、项目毛利、竞品报价、安装/售后责任和客户目标价不得用公开资料推断。缺失时写入 `cache/unresolved_internal_gaps.md`。
