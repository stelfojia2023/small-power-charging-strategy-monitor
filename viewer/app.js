(function () {
  const data = window.STRATEGY_VIEWER_DATA || {};
  const docs = data.documents || [];
  const state = { view: "overview", query: "", reportType: "全部", evidenceGroup: "全部", docCategory: "全部" };

  const $ = (id) => document.getElementById(id);
  const views = {
    overview: $("overviewView"),
    reports: $("reportsView"),
    evidence: $("evidenceView"),
    competitors: $("competitorsView"),
    gaps: $("gapsView"),
    documents: $("documentsView"),
  };

  const labels = {
    zhida: "挚达", bull: "公牛", keda_intelligent: "科大智能", star_charge: "星星充电",
    wattsaving: "Wattsaving", tesla_china: "Tesla", wuling: "五菱", xpeng: "小鹏",
    ccc: "CCC", small_dc: "小功率DC", vave: "VAVE",
  };
  let mermaidId = 0;

  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "base",
      themeVariables: {
        primaryColor: "#e5f3ec",
        primaryTextColor: "#202724",
        primaryBorderColor: "#1f7a5a",
        lineColor: "#66736e",
        fontFamily: "Inter, Segoe UI, Microsoft YaHei, Arial, sans-serif",
      },
    });
  }

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stripMarkup(value) {
    return String(value ?? "")
      .replace(/<span\s+style="color:[^"]*">(.*?)<\/span>/gis, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function inline(value) {
    let html = esc(value);
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
    html = html.replace(/&lt;span style=&quot;color:([a-z]+)&quot;&gt;(.+?)&lt;\/span&gt;/gis, '<span style="color:$1">$2</span>');
    return html;
  }

  function markdown(md) {
    const lines = String(md || "").split(/\r?\n/);
    const out = [];
    let i = 0, para = [];
    const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
    const tableCells = (value) => {
      let row = value.trim();
      if (row.startsWith("|")) row = row.slice(1);
      if (row.endsWith("|")) row = row.slice(0, -1);
      return row.split("|").map((cell) => cell.trim());
    };
    const isTableRow = (value) => /^\s*\|.*\|\s*$/.test(value);
    const isSeparator = (value) => {
      const cells = tableCells(value);
      return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, "")));
    };
    const renderCell = (cell) => cell ? inline(cell) : "&nbsp;";

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith("```")) {
        flush();
        const lang = line.replace(/^```/, "").trim().toLowerCase();
        const code = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) code.push(lines[i++]);
        const source = code.join("\n");
        if (lang === "mermaid") {
          mermaidId += 1;
          out.push(`<div class="mermaid-wrap"><div class="mermaid" id="mermaid-${mermaidId}">${esc(source)}</div></div>`);
        } else {
          out.push(`<pre><code>${esc(source)}</code></pre>`);
        }
        i++;
        continue;
      }

      const h = line.match(/^(#{1,4})\s+(.+)$/);
      if (h) {
        flush();
        out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);
        i++;
        continue;
      }

      if (isTableRow(line) && i + 1 < lines.length && isSeparator(lines[i + 1])) {
        flush();
        const header = tableCells(line);
        i += 2;
        const bodyRows = [];
        while (i < lines.length && isTableRow(lines[i])) {
          if (!isSeparator(lines[i])) bodyRows.push(tableCells(lines[i]));
          i++;
        }
        const width = Math.max(header.length, ...bodyRows.map((row) => row.length));
        const normalize = (row) => Array.from({ length: width }, (_, index) => row[index] || "");
        const head = `<thead><tr>${normalize(header).map((cell) => `<th>${renderCell(cell)}</th>`).join("")}</tr></thead>`;
        const body = `<tbody>${bodyRows.map((row) => `<tr>${normalize(row).map((cell) => `<td>${renderCell(cell)}</td>`).join("")}</tr>`).join("")}</tbody>`;
        out.push(`<div class="table-wrap"><table>${head}${body}</table></div>`);
        continue;
      }

      if (/^\s*[-*]\s+/.test(line)) {
        flush();
        const items = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s+/, ""));
        out.push(`<ul>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`);
        continue;
      }

      if (/^\s*\d+\.\s+/.test(line)) {
        flush();
        const items = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+\.\s+/, ""));
        out.push(`<ol>${items.map((item) => `<li>${inline(item)}</li>`).join("")}</ol>`);
        continue;
      }

      if (!line.trim()) { flush(); i++; continue; }
      para.push(line.trim());
      i++;
    }
    flush();
    return out.join("\n");
  }

  function match(doc) {
    const q = state.query.trim().toLowerCase();
    if (!q) return true;
    return `${doc.title}\n${doc.path}\n${doc.excerpt}\n${doc.content}`.toLowerCase().includes(q);
  }

  function pill(text, cls = "") {
    return `<span class="pill ${cls}">${esc(text)}</span>`;
  }

  function openDoc(id) {
    const doc = docs.find((item) => item.id === id);
    if (!doc) return;
    $("dialogKicker").textContent = `${doc.category} · ${doc.path}`;
    $("dialogTitle").textContent = doc.title;
    $("dialogMeta").innerHTML = [
      pill(`${doc.lineCount} 行`),
      pill(doc.updated),
      ...(doc.evIds || []).slice(0, 5).map((id) => pill(id)),
    ].join("");
    $("dialogContent").innerHTML = markdown(doc.content);
    $("readerDialog").showModal();
    renderMermaid();
  }

  function renderMermaid() {
    if (!window.mermaid) return;
    const nodes = $("dialogContent").querySelectorAll(".mermaid");
    if (!nodes.length) return;
    window.mermaid.run({ nodes }).catch((error) => {
      console.error("Mermaid render failed", error);
    });
  }

  function latestReport() {
    const reports = data.reports || [];
    return (
      reports.find((doc) => doc.path.includes("reports/monthly/")) ||
      reports.find((doc) => doc.path.includes("reports/quarterly/")) ||
      reports.find((doc) => doc.path.includes("reports/weekly/")) ||
      reports[0]
    );
  }

  function counts() {
    const ev = new Set();
    let red = 0, orange = 0, gaps = (data.gaps || []).length;
    docs.forEach((doc) => {
      (doc.evIds || []).forEach((id) => ev.add(id));
      red += doc.statusCounts?.red || 0;
      orange += doc.statusCounts?.orange || 0;
    });
    return { documents: docs.length, evidence: ev.size, reports: (data.reports || []).length, red, orange, gaps };
  }

  function sectionText(content, titlePattern) {
    const lines = String(content || "").split(/\r?\n/);
    const titleRe = titlePattern instanceof RegExp ? titlePattern : new RegExp(titlePattern);
    const start = lines.findIndex((line) => /^#{2,4}\s+/.test(line) && titleRe.test(stripMarkup(line)));
    if (start < 0) return "";
    const level = (lines[start].match(/^#+/) || [""])[0].length;
    const body = [];
    for (let i = start + 1; i < lines.length; i++) {
      const heading = lines[i].match(/^(#{2,4})\s+/);
      if (heading && heading[1].length <= level) break;
      body.push(lines[i]);
    }
    return body.join("\n");
  }

  function colorForText(text) {
    const value = stripMarkup(text);
    if (/止损|高风险|威胁强化|不成立|负毛利|红色|P0|触发/.test(value)) return "red";
    if (/小幅调整|风险上升|部分变化|证据不足|观察|倒排|P1|预警|需内部验证/.test(value)) return "orange";
    if (/灰|暂停|缺口/.test(value)) return "gray";
    return "green";
  }

  function decisionFromReport(report) {
    if (!report) {
      return {
        title: "暂无战略结论",
        description: "尚未生成报告。请先运行周度、月度或季度战略复盘。",
        cls: "gray",
        pills: [pill("无报告", "gray")],
      };
    }

    const text = stripMarkup(report.content);
    const decisionLine = text.match(/战略调整判断[:：]\s*([^。；\n]+)[。；]?\s*([^。\n]*)/);
    const decisionToken = text.match(/(?:^|\s)([ABCD][\.、]\s*(?:维持战略|小幅调整|重大调整|立即止损))/);

    const title = decisionLine?.[1]?.trim() || decisionToken?.[1]?.trim() || "未识别战略结论";
    const description =
      decisionLine?.[2]?.trim() ||
      firstExecutiveBullet(report) ||
      "已从最新报告读取数据，但未识别到明确的战略调整说明。";
    const cls = colorForText(title + description);

    const pills = [
      pill(report.category || "最新报告", cls === "red" ? "red" : "green"),
      report.statusCounts?.red ? pill(`红色结论 ${report.statusCounts.red}`, "red") : "",
      report.statusCounts?.orange ? pill(`橙色结论 ${report.statusCounts.orange}`, "orange") : "",
      (report.evIds || []).length ? pill(`证据ID ${(report.evIds || []).length}`) : "",
    ].filter(Boolean);

    return { title, description, cls, pills };
  }

  function firstExecutiveBullet(report) {
    const section = sectionText(report.content, /执行结论/);
    const line = section.split(/\r?\n/).find((item) => /^\s*[-*]\s+/.test(item));
    return line ? stripMarkup(line.replace(/^\s*[-*]\s+/, "")) : "";
  }

  function tableRows(section) {
    return section
      .split(/\r?\n/)
      .filter((line) => /^\s*\|.*\|\s*$/.test(line) && !/^\s*\|\s*:?-{3,}/.test(line))
      .map((line) => {
        let row = line.trim();
        if (row.startsWith("|")) row = row.slice(1);
        if (row.endsWith("|")) row = row.slice(0, -1);
        return row.split("|").map((cell) => stripMarkup(cell));
      });
  }

  function hypothesisRows(report) {
    const fallback = ["H1 商品化", "H2 OEM/ODM", "H3 挚达威胁", "H4 公牛C端", "H5 小功率DC", "H6 负毛利"]
      .map((h) => `<div class="status-row"><strong>${esc(h)}</strong>${pill("待报告更新", "gray")}</div>`)
      .join("");

    if (!report) return fallback;

    const rows = tableRows(sectionText(report.content, /战略假设验证|H1-H6/))
      .filter((row) => /^H[1-6]/.test(row[0] || ""))
      .slice(0, 6);

    if (!rows.length) return fallback;

    return rows.map((row) => {
      const hypothesis = row[0] || "未命名假设";
      const status = row[1] || "未识别";
      return `<div class="status-row"><strong>${esc(hypothesis)}</strong>${pill(status, colorForText(status))}</div>`;
    }).join("");
  }

  function priorityCards(report) {
    if (!report) {
      return [
        card("先生成战略报告", "运行月度或周度任务后，总览会自动读取报告结论。", "gray"),
      ].join("");
    }

    const rows = tableRows(sectionText(report.content, /1-4周行动|立即动作|行动/))
      .filter((row) => row.some((cell) => /P0|P1|P2|红|橙|高|中/.test(cell)))
      .slice(0, 3);

    if (rows.length) {
      return rows.map((row) => {
        const title = row[0] || row[1] || "行动项";
        const desc = row[1] && row[1] !== title ? row[1] : row.slice(2, 5).filter(Boolean).join("；");
        const cls = colorForText(row.join(" "));
        return card(title, desc || "详见最新报告行动表。", cls);
      }).join("");
    }

    return sectionText(report.content, /执行结论/)
      .split(/\r?\n/)
      .filter((line) => /^\s*[-*]\s+/.test(line))
      .slice(0, 3)
      .map((line) => {
        const text = stripMarkup(line.replace(/^\s*[-*]\s+/, ""));
        const [title, ...rest] = text.split(/[：:]/);
        return card(title || "重点事项", rest.join("：") || text, colorForText(text));
      })
      .join("");
  }

  function competitorCards(report) {
    if (!report) {
      return card("等待竞品报告", "生成报告后，系统会从竞品战略更新表中提取威胁项。", "gray");
    }

    const rows = tableRows(sectionText(report.content, /竞品战略更新|竞品/))
      .filter((row) => row.length >= 3 && !/竞品|对象/.test(row[0]))
      .slice(0, 4);

    if (!rows.length) {
      return card("未识别竞品表", "最新报告中未找到可解析的竞品战略更新表。", "gray");
    }

    return rows.map((row) => {
      const name = row[0] || "竞品";
      const desc = [row[2], row[5], row[6]].filter(Boolean).join("；") || row.slice(1, 4).filter(Boolean).join("；");
      return card(name, desc || "详见最新报告。", colorForText(row.join(" ")));
    }).join("");
  }

  function renderOverview() {
    const c = counts();
    const latest = latestReport();
    const decision = decisionFromReport(latest);

    views.overview.innerHTML = `
      <div class="hero">
        <section class="decision-panel">
          <p class="kicker">当前战略结论 · ${latest ? esc(latest.path) : "无报告"}</p>
          <h2>${esc(decision.title)}</h2>
          <p>${esc(decision.description)}</p>
          <div class="pill-row">${decision.pills.join("")}</div>
        </section>
        <section class="metric-grid">
          <div class="metric"><span>报告</span><strong>${c.reports}</strong></div>
          <div class="metric"><span>证据ID</span><strong>${c.evidence}</strong></div>
          <div class="metric red"><span>红色结论</span><strong>${c.red}</strong></div>
          <div class="metric orange"><span>内部缺口文档</span><strong>${c.gaps}</strong></div>
        </section>
      </div>
      <div class="dashboard-grid">
        <section class="panel"><h3>H1-H6 状态</h3><div class="status-list">${hypothesisRows(latest)}</div></section>
        <section class="panel"><h3>最高优先级</h3><div class="card-list">${priorityCards(latest)}</div></section>
        <section class="panel"><h3>竞品威胁</h3><div class="card-list">${competitorCards(latest)}</div></section>
        <section class="panel wide"><h3>最新报告</h3>${latest ? docCard(latest) : "暂无报告"}</section>
        <section class="panel"><h3>下一步</h3><div class="card-list">
          ${card("刷新 viewer", "内容变更后运行 python3 tools/build_viewer_data.py。")}
          ${card("补 data/jsonl", "将关键证据从 Markdown 同步到结构化数据层。")}
        </div></section>
      </div>`;
  }

  function card(title, desc, cls = "") {
    const label = cls === "red" ? "高" : cls === "orange" ? "中" : cls === "gray" ? "待定" : cls === "green" ? "稳" : "";
    return `<div class="status-row"><div><strong>${esc(title)}</strong><p>${esc(desc)}</p></div>${label ? pill(label, cls) : ""}</div>`;
  }

  function docCard(doc) {
    const colorTags = [];
    if (doc.statusCounts?.red) colorTags.push(pill(`红 ${doc.statusCounts.red}`, "red"));
    if (doc.statusCounts?.orange) colorTags.push(pill(`橙 ${doc.statusCounts.orange}`, "orange"));
    if (doc.evIds?.length) colorTags.push(pill(`EV ${doc.evIds.length}`));
    return `<article class="doc-card" data-open="${esc(doc.id)}"><h3>${esc(doc.title)}</h3><p>${esc(doc.path)}</p><div class="pill-row">${pill(doc.category)}${colorTags.join("")}</div></article>`;
  }

  function renderListView(view, items, filtersHtml, title) {
    const filtered = items.filter(match);
    view.innerHTML = `
      <div class="split-layout">
        <aside class="side-panel"><h3>${title}</h3><div class="filter-stack">${filtersHtml}</div></aside>
        <section class="card-list">${filtered.map(docCard).join("") || "<p>没有匹配内容。</p>"}</section>
      </div>`;
  }

  function filters(values, active, attr) {
    return values.map((value) => `<button class="filter ${active === value ? "active" : ""}" data-${attr}="${esc(value)}">${esc(value)}</button>`).join("");
  }

  function renderReports() {
    const all = data.reports || [];
    const cats = ["全部", ...new Set(all.map((doc) => doc.category))];
    const items = all.filter((doc) => state.reportType === "全部" || doc.category === state.reportType);
    renderListView(views.reports, items, filters(cats, state.reportType, "report-filter"), "报告类型");
  }

  function renderEvidence() {
    const all = data.evidence || [];
    const groups = ["全部", ...new Set(all.map((doc) => doc.group || doc.category))];
    const items = all.filter((doc) => state.evidenceGroup === "全部" || doc.group === state.evidenceGroup || doc.category === state.evidenceGroup);
    renderListView(views.evidence, items, filters(groups, state.evidenceGroup, "evidence-filter"), "证据对象");
  }

  function renderCompetitors() {
    const cards = (data.competitors || []).map((item) => {
      const name = labels[item.id] || item.id;
      const first = item.documents?.[0];
      return `<article class="competitor-card" data-open="${esc(first?.id || "")}">
        <h3>${esc(name)}</h3>
        <p>${item.documents.length} 份文档，${item.evidenceIds.length} 条证据 ID</p>
        <div class="pill-row">${item.evidenceIds.slice(0, 3).map((id) => pill(id)).join("")}</div>
      </article>`;
    }).join("");
    views.competitors.innerHTML = `<section class="panel"><p class="section-kicker">竞品视图</p><h3>按对象查看竞品画像和证据</h3><div class="card-list">${cards}</div></section>`;
  }

  function renderGaps() {
    views.gaps.innerHTML = `<div class="dashboard-grid">
      <section class="panel wide"><h3>内部缺口</h3><div class="card-list">${(data.gaps || []).filter(match).map(docCard).join("")}</div></section>
      <section class="panel"><h3>关闭标准</h3><div class="card-list">
        ${card("报价可比", "同规格、同服务范围、同付款条件。", "red")}
        ${card("毛利闭环", "BOM、制造、物流、售后和认证成本齐全。", "orange")}
        ${card("责任闭环", "明确责任部门、截止日期和关闭标准。", "green")}
      </div></section>
    </div>`;
  }

  function renderDocuments() {
    const cats = ["全部", ...new Set(docs.map((doc) => doc.category))];
    const items = docs.filter((doc) => (state.docCategory === "全部" || doc.category === state.docCategory) && match(doc));
    renderListView(views.documents, items, filters(cats, state.docCategory, "doc-filter"), "文档分类");
  }

  function render() {
    $("generatedAt").textContent = `数据 ${data.generatedAt || ""}`;
    Object.entries(views).forEach(([key, el]) => el.classList.toggle("active", key === state.view));
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === state.view));
    renderOverview();
    renderReports();
    renderEvidence();
    renderCompetitors();
    renderGaps();
    renderDocuments();
  }

  document.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-view]");
    if (tab) { state.view = tab.dataset.view; render(); return; }
    const open = event.target.closest("[data-open]");
    if (open && open.dataset.open) { openDoc(open.dataset.open); return; }
    const rf = event.target.closest("[data-report-filter]");
    if (rf) { state.reportType = rf.dataset.reportFilter; renderReports(); return; }
    const ef = event.target.closest("[data-evidence-filter]");
    if (ef) { state.evidenceGroup = ef.dataset.evidenceFilter; renderEvidence(); return; }
    const df = event.target.closest("[data-doc-filter]");
    if (df) { state.docCategory = df.dataset.docFilter; renderDocuments(); }
  });
  $("globalSearch").addEventListener("input", (event) => { state.query = event.target.value; render(); });
  $("closeDialog").addEventListener("click", () => $("readerDialog").close());
  render();
})();
