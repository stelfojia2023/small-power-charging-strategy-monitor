# 本地战略浏览器

用途：把 `reports/`、`cache/`、`sources/`、`logic/`、`docs/`、`strategy-monitor/inputs/`、`strategy-monitor/templates/` 中的 Markdown 聚合成本地可视化浏览界面。

## 使用

打开：

```text
viewer/index.html
```

## 刷新数据

新增或修改 Markdown 后运行：

```bash
python3 tools/build_viewer_data.py
```

脚本会重新生成：

```text
viewer/data.js
```

浏览器页面不依赖网络，也不需要本地服务。
