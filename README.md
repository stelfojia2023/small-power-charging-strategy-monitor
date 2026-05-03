# Strategy Intelligence System

本项目用于按周、月、季度、半年和全年持续收集小功率充电桩市场与竞品信息，并基于证据、商业逻辑和内部数据缺口辅助企业战略判断。

## 目录边界

- `strategy-monitor/`：Codex skill、提示词、输入约束和报告模板。
- `sources/`：固定来源、检索问题和采集任务定义。
- `cache/`：人类可读的长期证据库。
- `data/`：机器可读的 JSONL 数据层。
- `logic/`：H1-H6、评分卡、止损和竞品模型规则。
- `reports/`：按周期和用途分类的报告输出。
- `viewer/`：本地静态可视化浏览器。
- `tools/`：菜单、viewer 数据构建和后续自动化脚本。

## 常用命令

```bash
python3 tools/strategy_monitor_menu.py
python3 tools/build_viewer_data.py
python3 -m py_compile tools/*.py
node --check viewer/app.js
```

打开 `viewer/index.html` 可浏览本地报告、证据库和规则文件。
