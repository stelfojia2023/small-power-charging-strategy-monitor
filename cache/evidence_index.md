# 本地证据索引

本文件只做索引，不承载完整证据。完整证据块保存在对应分类文件中。

| 证据编号 | 对象 | 分类 | 结论摘要 | 证据文件 | 证据等级 | 刷新状态 | 采集日期 |
|---|---|---|---|---|---|---|---|
| EV-20260503-MARKET-001 | 市场 | 充电基础设施 | 2026年3月底全国充电基础设施2148.1万个，私人1661.8万个 | `cache/market_policy/charging_infrastructure.md` | 强 | current | 2026-05-03 |
| EV-20260503-MARKET-002 | 市场 | 新能源车销量/出口 | 2026年一季度新能源车销量296万辆，出口95.4万辆 | `cache/market_policy/new_energy_vehicle_sales.md` | 中 | current | 2026-05-03 |
| EV-20260503-CCC-001 | 认证 | CCC | 2026年8月1日起未获CCC认证的电动汽车供电设备不得出厂、销售、进口或经营使用 | `cache/market_policy/certification_ccc.md` | 强 | current | 2026-05-03 |
| EV-20260503-ZHIDA-001 | 挚达/智达 | 财务/交付/海外 | 挚达2025年收入约7.165亿元、毛利率约15.2%、亏损约1.638亿元 | `cache/competitors/zhida/financials.md` | 强/中 | current | 2026-05-03 |
| EV-20260503-BULL-001 | 公牛 | 财务/渠道/新能源 | 公牛2025年新能源产品收入8.22亿元，终端网点超3万家 | `cache/competitors/bull/financials.md` | 强/中 | current | 2026-05-03 |
| EV-20260503-WATTSAVING-001 | Wattsaving | 产品规格 | Wattsaving公开20kW和30kW小功率DC产品规格 | `cache/competitors/wattsaving/products.md` | 中 | stale_check | 2026-05-03 |
| EV-20260503-TESLA-001 | Tesla China | 目的地充电 | Tesla中国目的地充电站超过700座，非Tesla车辆服务支持GB/T 20234.2-2015 | `cache/competitors/tesla_china/charging_network.md` | 中 | stale_check | 2026-05-03 |

## 使用规则

- 生成报告前先读本索引，再按 `freshness_rules.md` 判断是否需要刷新。
- `current` 证据可进入本期证据矩阵。
- `stale_check` 证据可作背景，但若影响关键决策，应刷新。
- 涉及价格、项目毛利、低于成本、客户定点和服务范围，必须查 `cache/unresolved_internal_gaps.md`。
