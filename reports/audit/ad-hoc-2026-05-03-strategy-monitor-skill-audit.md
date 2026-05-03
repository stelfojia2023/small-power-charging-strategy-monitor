# Strategy Monitor Skill 自身审计报告

审计日期：2026-05-03  
审计对象：`strategy-monitor`  
审计范围：`SKILL.md`、`inputs/`、`templates/`、`prompts/strategy-monitor.md`、`scripts/strategy_monitor_menu.py`、现有 `reports/` 样例  
审计类型：skill-audit

## 1. 执行结论

- <span style="color:green">结论：当前 skill 已经具备长期战略监控的基本骨架。</span> 它覆盖公司画像、H1-H6 战略假设、竞品清单、来源政策、内部数据需求、战略阈值、报告模板和菜单入口，能支撑周度、月度、临时事件、竞品档案、证据矩阵和行动跟踪。
- <span style="color:orange">结论：最大短板不是研究框架，而是执行稳定性。</span> `/strategy-monitor` 在当前 Codex CLI 中未被识别，说明“slash-style invocation”不能作为唯一入口；应把自然语言菜单触发和脚本入口写成主路径。
- <span style="color:orange">结论：skill-audit 模式本身缺少模板。</span> 脚本里选项 7 的 `template` 为 `None`，只生成 `# Skill 自身审计` 骨架，无法强制输出审计结论、问题分级、整改项和验收标准。
- <span style="color:orange">结论：证据纪律较强，但来源优先级和证据字段还不够可审计。</span> `SKILL.md` 与 `source_policy.md` 的来源排序不完全一致；模板中也缺少 `URL`、发布日期、访问日期、原始口径等字段。
- <span style="color:red">结论：若要把该 skill 用作管理层周期性决策工具，必须补内部红线参数。</span> 当前阈值仍有较多定性表达，缺少客户集中度红线、项目毛利红线、VAVE 降本目标、RFQ 变化阈值和小功率 DC 升级判据。

## 2. 审计依据

| 审计项 | 当前证据 | 判断 |
|---|---|---|
| skill 主入口 | `SKILL.md` 定义 overview、report modes、workflow、evidence rules、decision guardrails、output requirements | <span style="color:green">完整度较高</span> |
| 输入资料 | `inputs/` 包含公司画像、竞品清单、内部数据需求、提示词本体、来源政策、战略假设、战略阈值 | <span style="color:green">结构完整</span> |
| 输出模板 | `templates/` 包含 weekly、monthly、decision、evidence、competitor、action tracker | <span style="color:green">覆盖主要交付物</span> |
| 菜单提示词 | `prompts/strategy-monitor.md` 定义 10 个菜单项和执行规则 | <span style="color:green">对话入口清晰</span> |
| 终端脚本 | `scripts/strategy_monitor_menu.py` 可按编号生成报告骨架 | <span style="color:orange">可用但不是完整执行器</span> |
| 当前 CLI 行为 | `/strategy-monitor` 重启后仍显示 unrecognized command | <span style="color:orange">slash 命令路径不可靠</span> |
| 历史输出 | `reports/` 已有月度报告和证据矩阵 | <span style="color:green">已有实际产物</span> |

## 3. 主要问题

| 编号 | 严重度 | 问题 | 影响 | 证据 |
|---|---|---|---|---|
| A1 | P0 | `/strategy-monitor` 入口不可依赖 | 用户按文档操作后会得到 `Unrecognized command`，重启也不能保证恢复 | `README.md` 和 `SKILL.md` 都建议复制到 `~/.codex/prompts` 后使用 `/strategy-monitor`；当前实际未识别 |
| A2 | P0 | `skill-audit` 缺少专用模板 | 选项 7 无法强制形成稳定审计结构，输出质量依赖模型临场发挥 | `strategy_monitor_menu.py` 中选项 7 的 `template: None`，默认只写 `# Skill 自身审计` |
| A3 | P1 | 来源优先级存在轻微不一致 | 可能导致报告中“政府/监管”与“交易所/年报/官网”的优先级不一致，影响证据排序 | `SKILL.md` 优先级先列交易所/年报，再列官网，再列政府/协会；`source_policy.md` 首选来源先列政府/监管/标准/协会 |
| A4 | P1 | 战略阈值缺少内部数值红线 | H1-H6 仍容易停留在“成立/部分变化”的定性判断，难以支持管理层升级或止损 | `strategic_thresholds.md` 提到毛利红线、集中度红线、连续 RFQ，但未给具体数值或默认占位 |
| A5 | P1 | 内部数据需求没有落成可填数据表 | 报告会反复写“需内部验证”，但没有强制把缺口转成可追踪任务 | `internal_data_requirements.md` 有字段和责任建议，但没有 CSV/Markdown 台账模板、状态、截止日期默认规则 |
| A6 | P2 | 证据矩阵字段不够可追溯 | 缺少 URL、发布日期、访问日期、原文口径、适用区域，后续复核成本高 | `evidence_matrix.md` 只有“来源”自由文本字段 |
| A7 | P2 | 专题模式复用月度模板过重 | 小功率 DC、海外 AC、标准认证专题会生成过宽报告，难以聚焦专题判断 | 脚本选项 8/9/10 都使用 `monthly_report_template.md` |
| A8 | P2 | 缺少报告质量校验脚本 | 不能自动检查是否读取 inputs、是否有颜色结论、是否创建 output、是否包含证据等级和内部缺口 | 当前只有菜单脚本，没有 report linter |

## 4. 能力覆盖评估

| 能力 | 当前状态 | 评价 |
|---|---|---|
| 周度信号扫描 | 已有 weekly 模板，覆盖高风险信号、竞品动作、假设影响、认证快扫 | <span style="color:green">可运行</span> |
| 月度战略复盘 | 已有 monthly 模板，覆盖 H1-H6、证据矩阵、竞品、行动、最终决策 | <span style="color:green">可运行</span> |
| 临时事件判断 | 已有 decision matrix，能回答维持/调整/止损 | <span style="color:green">可运行</span> |
| 单一竞品档案 | 已有 dossier 模板，覆盖客户入口、产品线、服务平台、财务与响应 | <span style="color:green">可运行</span> |
| 证据矩阵刷新 | 已有 evidence matrix | <span style="color:orange">可运行但复核字段不足</span> |
| 行动跟踪 | 已有 action tracker | <span style="color:orange">可运行但缺少状态闭环机制</span> |
| Skill 自身审计 | 菜单有选项，但无模板 | <span style="color:red">需要补齐</span> |
| 小功率 DC 专题 | 菜单有选项，但复用月度模板 | <span style="color:orange">需要专题模板</span> |
| 海外 AC 专题 | 菜单有选项，但复用月度模板 | <span style="color:orange">需要按区域拆分模板</span> |
| 标准认证专题 | 菜单有选项，但复用月度模板 | <span style="color:orange">需要法规/标准专用模板</span> |

## 5. 整改建议

### 5.1 P0：先修执行入口和审计模板

1. 将 `README.md` 和 `SKILL.md` 中的入口说明改为：
   - 主入口：用户输入“打开 strategy-monitor 菜单”或“使用 strategy-monitor 运行选项 X”。
   - 备用入口：`python3 tools/strategy_monitor_menu.py --choice 7`。
   - slash 入口：标注为“如果当前 Codex CLI 支持自定义 prompts 才可用”。
2. 新增 `templates/skill_audit_template.md`，至少包含：
   - 执行结论。
   - 审计依据。
   - 文件完整性检查。
   - 证据纪律检查。
   - 内部数据闭环检查。
   - 模板覆盖检查。
   - 执行入口检查。
   - 问题分级。
   - 整改计划。
   - 验收清单。
3. 修改 `strategy_monitor_menu.py`，让选项 7 使用 `templates/skill_audit_template.md`，而不是 `None`。

### 5.2 P1：统一证据规则并参数化红线

1. 统一 `SKILL.md` 与 `source_policy.md` 的来源优先级，建议采用：
   - 政府/监管/标准/协会。
   - 交易所公告、年报、招股书。
   - 正式招投标、采购公告、车企公告。
   - 公司官网、产品页、安装服务政策。
   - 权威行业/财经媒体。
   - 弱信号。
2. 新增 `inputs/strategy_redlines.md`，把以下字段显式参数化：
   - 客户收入/出货集中度红线。
   - 单项目毛利红线。
   - 负毛利订单占比红线。
   - VAVE 年度降本目标。
   - 新客户 RFQ 数量阈值。
   - 小功率 DC 升级为重点产品线的订单/RFQ/毛利/认证条件。
3. 在 monthly、weekly、decision 模板中引用这些红线，避免只写“低于红线”。

### 5.3 P1：把内部数据缺口变成台账

1. 新增 `templates/internal_data_gap_tracker.md`，字段建议为：
   - 缺口编号。
   - 缺失字段。
   - 影响的战略判断。
   - 所属假设 H1-H6。
   - 责任部门。
   - 责任人。
   - 截止日期。
   - 当前状态。
   - 补数结果。
   - 是否关闭。
2. 每次报告生成时，同步更新行动跟踪表或内部数据缺口表。
3. 对“竞品疑似低于成本”“五菱价格锚下移”“负毛利订单扩大”这类高风险项，要求必须形成 P0/P1 补数任务。

### 5.4 P2：增强可复核性和专题模板

1. 扩展 `evidence_matrix.md` 字段：
   - 来源名称。
   - URL。
   - 发布日期。
   - 访问日期。
   - 原始口径。
   - 适用区域。
   - 是否交叉验证。
2. 新增三个专题模板：
   - `small_dc_topic_template.md`。
   - `overseas_ac_topic_template.md`。
   - `certification_topic_template.md`。
3. 新增 `scripts/validate_report.py`，检查：
   - 是否包含执行结论。
   - 是否包含颜色标注。
   - 是否包含证据等级。
   - 是否包含内部数据缺口。
   - 是否输出到 `reports/`。
   - 是否对 H1-H6 做出状态判断。

## 6. 建议整改顺序

| 顺序 | 动作 | 优先级 | 预期收益 |
|---|---|---|---|
| 1 | 增加 `skill_audit_template.md` 并绑定菜单选项 7 | P0 | 让审计输出稳定、可复用 |
| 2 | 修正文档中的 `/strategy-monitor` 说明，明确自然语言菜单为主入口 | P0 | 避免用户重启后仍无法调用 |
| 3 | 新增 `strategy_redlines.md` | P1 | 把 H1-H6 从定性判断变成可执行阈值 |
| 4 | 新增内部数据缺口台账模板 | P1 | 把“需内部验证”转成责任闭环 |
| 5 | 扩展证据矩阵字段 | P2 | 提高报告复核能力 |
| 6 | 新增专题模板 | P2 | 让 DC、海外 AC、认证专题更聚焦 |
| 7 | 新增报告校验脚本 | P2 | 降低长期使用中的格式漂移 |

## 7. 验收清单

| 验收项 | 通过标准 |
|---|---|
| 入口可用 | 输入“打开 strategy-monitor 菜单”能显示 1-10 菜单；脚本 `--choice 7` 能生成完整审计骨架 |
| 审计模板可用 | 选项 7 输出不再只有标题，而是包含结论、问题、整改、验收 |
| 来源规则一致 | `SKILL.md` 与 `source_policy.md` 的来源优先级一致 |
| 红线可引用 | 报告中“毛利红线/集中度红线/负毛利红线”能引用具体字段或明确标注“未配置” |
| 内部缺口闭环 | 每个高风险内部缺口都有责任建议、截止时间和状态 |
| 证据可复核 | 关键证据至少包含来源名称、URL 或可定位出处、发布日期/访问日期 |
| 专题不跑偏 | DC、海外 AC、认证专题分别使用专用模板，不再完整复用月度大模板 |
| 报告质量可检查 | 校验脚本能发现缺少颜色结论、证据等级、内部数据缺口或输出文件的问题 |

## 8. 最终判断

1. <span style="color:orange">现在是否需要调整 skill？</span> 需要小幅调整。当前框架方向正确，但入口、审计模板、红线参数和数据闭环需要补齐。
2. <span style="color:orange">应该调整什么？</span> 优先调整执行入口说明、选项 7 的模板、来源优先级一致性、内部红线参数和内部缺口台账。
3. <span style="color:orange">必须立即做什么？</span> 新增 `skill_audit_template.md`，并把菜单选项 7 绑定到该模板；同时把 `/strategy-monitor` 改成可选入口而不是主入口。
4. <span style="color:red">不应该做什么？</span> 不应继续把 `/strategy-monitor` 当成稳定命令，也不应在缺少内部报价、BOM、毛利和服务范围时写“低于成本报价”。
5. <span style="color:gray">下次应该跟踪什么？</span> 跟踪 P0 整改是否落地，以及月度报告是否能引用明确红线和内部数据台账。
