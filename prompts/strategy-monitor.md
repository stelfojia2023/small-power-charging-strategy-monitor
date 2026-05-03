# 小功率充电桩战略监控菜单

你正在使用 `./small-power-charging-strategy-monitor` 这个 skill。

先不要直接生成长报告。请先在对话中显示以下选择菜单，并要求用户只输入编号或编号加补充说明。用户选择后，必须自动执行对应任务，至少生成一个 Markdown 报告文件到 `output/`。

## 可选项

1. 月度战略复盘
   - 使用 `templates/monthly_report_template.md`
   - 输出：`output/monthly-YYYY-MM-DD-small-power-charging-strategy-review.md`
   - 必须包含：执行结论、H1-H6验证、证据矩阵、内部数据缺口、市场动态、竞品更新、战略调整、1-4周行动、6-24个月战略、预警信号、最终决策。

2. 周度战略监控
   - 使用 `templates/weekly_report_template.md`
   - 输出：`output/weekly-YYYY-MM-DD-small-power-charging-strategy-review.md`
   - 必须包含：高风险信号、竞品动作、假设影响、证据缺口、标准认证快扫、1-4周行动、最终决策。

3. 临时事件判断
   - 使用 `templates/decision_matrix.md`
   - 输出：`output/ad-hoc-YYYY-MM-DD-small-power-charging-strategy-review.md`
   - 如果用户没有给事件，先询问事件；如果用户已经在编号后补充事件，则直接执行。

4. 单一竞品档案
   - 使用 `templates/competitor_dossier.md`
   - 输出：`output/ad-hoc-YYYY-MM-DD-<competitor>-competitor-dossier.md`
   - 如果用户没有给竞品名，先询问竞品名；如果用户已经在编号后补充竞品名，则直接执行。

5. 证据矩阵刷新
   - 使用 `templates/evidence_matrix.md`
   - 输出：`output/ad-hoc-YYYY-MM-DD-evidence-matrix.md`
   - 只刷新关键结论、证据、来源、来源类型、证据等级、置信度、内部缺口和下一步验证。

6. 行动跟踪表
   - 使用 `templates/action_tracker.md`
   - 输出：`output/ad-hoc-YYYY-MM-DD-action-tracker.md`
   - 根据最近一次报告或用户指定报告生成行动跟踪。

7. Skill 自身审计
   - 输出：`output/ad-hoc-YYYY-MM-DD-strategy-monitor-skill-audit.md`
   - 检查 `SKILL.md`、`inputs/`、`templates/` 是否足以支撑长期战略监控，并提出优化建议。

8. 小功率 DC 专题
   - 输出：`output/ad-hoc-YYYY-MM-DD-small-dc-strategy-review.md`
   - 重点验证 H5：是否应从订单驱动试点升级为重点产品线。

9. 海外 AC 专题
   - 输出：`output/ad-hoc-YYYY-MM-DD-overseas-ac-strategy-review.md`
   - 必须按欧盟、英国、北美、东南亚拆分认证、标准、车企出口、家充需求和 ODM 机会。

10. 标准与认证专题
    - 输出：`output/ad-hoc-YYYY-MM-DD-certification-strategy-review.md`
    - 覆盖 CCC、GB/T、OCPP、欧盟、英国、北美、东南亚认证变化。

11. 季度历史报告综合分析
    - 使用 `templates/quarterly_report_template.md`
    - 输出：`output/quarterly-YYYY-MM-DD-small-power-charging-strategy-review.md`
    - 读取 `output/` 下最近 3 份月度报告、最近 1 份证据矩阵、最近 1 份行动跟踪表和上一季度报告。
    - 使用 `inputs/historical_report_synthesis_rules.md`，必须分析 H1-H6 历史趋势、证据等级变化、未关闭内部数据缺口、上期行动闭环和季度级战略调整触发条件。

12. 管理层一页纸
    - 使用 `templates/one_page_strategy_brief.md`
    - 输出：`output/ad-hoc-YYYY-MM-DD-one-page-strategy-brief.md`
    - 根据最近一次报告或用户指定报告生成一页纸结论，必须包含本期结论、最大变化、最大风险、必须立即做、暂时不要做、需要老板决策。

13. 研发资源决策
    - 使用 `templates/rd_resource_decision.md`
    - 输出：`output/ad-hoc-YYYY-MM-DD-rd-resource-decision.md`
    - 将市场和竞品信号转为研发继续、加速、暂停、只做预研或禁止投入的决策。

14. TCO 低价反制
    - 使用 `templates/tco_countermeasure.md`
    - 输出：`output/ad-hoc-YYYY-MM-DD-tco-countermeasure.md`
    - 用于客户目标价下移、竞品低价压价或疑似低于成本报价，必须校正报价范围、服务责任、质保、安装、返修和付款条件。

## 执行规则

无论选择哪一项，都必须遵守：

- 读取 `SKILL.md`。
- 读取 `inputs/company_profile.md`、`inputs/strategic_assumptions.md`、`inputs/competitor_watchlist.md`、`inputs/source_policy.md`、`inputs/source_registry.md`、`inputs/search_playbook.md`、`inputs/internal_data_requirements.md`、`inputs/internal_data_template.md`、`inputs/prompt_ontology.md`、`inputs/strategic_thresholds.md`。
- 如选择 11，额外读取 `inputs/historical_report_synthesis_rules.md` 和 `output/` 中的历史报告；不得直接复制历史结论，必须对比本期新增证据和历史趋势。
- 如任务涉及挚达/智达，额外读取 `inputs/zhida_risk_model.md`。
- 如选择 1、3、8、9、10、11，必须使用或嵌入 `templates/strategy_scorecard.md`。
- 正文必须中文，无法自然替代的名称、标准、型号、URL、`OEM/ODM`、`VAVE`、`AC`、`DC`、`RFQ`、`GB/T`、`OCPP`、`Tesla`、`Wattsaving` 可保留英文。
- 结论性内容必须用 Markdown 兼容 HTML 颜色标注。
- 关键结论必须标注证据等级和内部数据缺口。
- 不得只在对话中输出，必须创建 `output/` 下的 Markdown 文件。

## 菜单显示格式

请显示：

```text
请选择要运行的战略监控任务：
1. 月度战略复盘
2. 周度战略监控
3. 临时事件判断
4. 单一竞品档案
5. 证据矩阵刷新
6. 行动跟踪表
7. Skill 自身审计
8. 小功率 DC 专题
9. 海外 AC 专题
10. 标准与认证专题
11. 季度历史报告综合分析
12. 管理层一页纸
13. 研发资源决策
14. TCO 低价反制

请输入编号；如选择 3、4 或 14，可直接追加事件、竞品名或低价场景。
示例：3 智达/挚达最新低价竞标是否影响五菱策略
示例：4 公牛
示例：14 五菱项目竞品低价压价
```
