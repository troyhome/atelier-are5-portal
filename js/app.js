/* ==========================================================================
   ATELIER ARE 5.0 & AXP LICENSURE PORTAL — INTERACTIVE ENGINE
   ========================================================================== */

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1bLGH_YofHmm9wYqN4Vzu7RJ3PuEuocV_lL7DidNsJwQ/edit";
const DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1byu3GdNMRKkKVPfkb-XYmMLPF1pIOxr3";

let db = window.__ATELIER_DB__ || null;

const state = {
  theme: localStorage.getItem("atelier_theme") || "light",
  tab: "overview",
  radarFocus: "PjM",
  expandedDiv: null,
  // Simulator
  simDivision: "ALL",
  simLegacy: "ALL",
  simType: "ALL",
  simItems: [],
  simIdx: 0,
  simAnswers: {},
  simRevealed: {},
  simFlags: {},
  simStrikes: {},
  simCaseTab: 0,
  simSeconds: 160 * 60,
  simReport: null,
  // AXP
  axpSuggestion: null,
  // Visual Atlas Interactive Controls
  finRevenue: 4200000,
  finDirectLabor: 1400000,
  finOverhead: 2100000,
  climateMode: "cold", // 'cold' (CZ6 Chicago) or 'humid' (CZ2 Houston)
  zoningLotW: 100,
  zoningLotD: 150,
  zoningFar: 2.0,
  zoningSetbackF: 10,
  zoningSetbackS: 5,
  // Coach & Flashcards
  coachTopic: "multiplier",
   coachCustomReply: null,
  fcIdx: 0,
  fcFlipped: false,
  // Resources & News
  resFilter: "ALL",
  midwestState: "IL"
};

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initData(loadedDb) {
  db = loadedDb;
  try {
    const savedLogs = localStorage.getItem("atelier_axp_logs_v2");
    const savedAreas = localStorage.getItem("atelier_axp_areas_v2");
    if (savedLogs) db.axpData.workLogs = JSON.parse(savedLogs);
    if (savedAreas) db.axpData.areas = JSON.parse(savedAreas);
  } catch (e) {}
  state.simItems = [...db.questions];
  document.documentElement.setAttribute("data-theme", state.theme);
  renderApp();
}

function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", state.theme);
  localStorage.setItem("atelier_theme", state.theme);
  renderApp();
}

function saveAxpState() {
  try {
    localStorage.setItem("atelier_axp_logs_v2", JSON.stringify(db.axpData.workLogs));
    localStorage.setItem("atelier_axp_areas_v2", JSON.stringify(db.axpData.areas));
  } catch (e) {}
}

function formatTimer(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

setInterval(() => {
  if (state.tab === "simulator" && state.simSeconds > 0) {
    state.simSeconds--;
    const el = document.getElementById("psi-live-clock");
    if (el) el.textContent = formatTimer(state.simSeconds);
  }
}, 1000);

/* ==========================================================================
   SVG RADAR / SPIDER COMPETENCY CHART (6 ARE 5.0 DIVISIONS)
   ========================================================================== */
function buildCompetencyRadarSvg() {
  const divs = db.divisions;
  const cx = 190, cy = 165, maxR = 112;
  const angles = divs.map((_, i) => (-Math.PI / 2) + (i * 2 * Math.PI / divs.length));

  const pt = (angle, score) => {
    const ratio = Math.max(0.15, Math.min(1, (score - 200) / 600));
    const r = ratio * maxR;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  // Concentric hexagon rings (400, 550 Cut Score, 700, 800)
  const ringScores = [350, 550, 675, 800];
  const ringsSvg = ringScores.map(sc => {
    const pts = angles.map(a => pt(a, sc).map(n => n.toFixed(1)).join(",")).join(" ");
    const isCut = sc === 550;
    return `<polygon points="${pts}" fill="none" stroke="${isCut ? 'var(--accent-terracotta)' : 'var(--hairline-strong)'}" stroke-width="${isCut ? '1.6' : '0.8'}" ${isCut ? 'stroke-dasharray="4,3"' : ''} />`;
  }).join("");

  // Axis spokes & labels
  const axesSvg = divs.map((d, i) => {
    const [xEnd, yEnd] = pt(angles[i], 800);
    const lx = cx + (maxR + 28) * Math.cos(angles[i]);
    const ly = cy + (maxR + 22) * Math.sin(angles[i]);
    const isSel = state.radarFocus === d.code;
    return `
      <line x1="${cx}" y1="${cy}" x2="${xEnd.toFixed(1)}" y2="${yEnd.toFixed(1)}" stroke="var(--hairline-strong)" stroke-width="0.8" />
      <g style="cursor:pointer" onclick="selectRadarDiv('${d.code}')">
        <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-family="var(--font-mono)" font-size="11" font-weight="${isSel ? '700' : '600'}" fill="${isSel ? 'var(--accent-terracotta)' : 'var(--ink-primary)'}">${d.code} (${d.readinessScaledScore})</text>
      </g>
    `;
  }).join("");

  // Candidate Readiness Polygon
  const userPts = divs.map((d, i) => pt(angles[i], d.readinessScaledScore).map(n => n.toFixed(1)).join(",")).join(" ");
  const dotsSvg = divs.map((d, i) => {
    const [px, py] = pt(angles[i], d.readinessScaledScore);
    const pass = d.readinessScaledScore >= 550;
    return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4.5" fill="${pass ? 'var(--accent-verdigris)' : 'var(--accent-terracotta)'}" stroke="var(--bg-surface)" stroke-width="1.5" style="cursor:pointer" onclick="selectRadarDiv('${d.code}')" />`;
  }).join("");

  return `
    <svg viewBox="0 0 380 330" style="width:100%;height:auto;display:block;">
      ${ringsSvg}
      ${axesSvg}
      <polygon points="${userPts}" fill="var(--accent-cobalt-soft)" stroke="var(--accent-cobalt)" stroke-width="2.2" />
      ${dotsSvg}
      <g transform="translate(14, 308)" font-family="var(--font-mono)" font-size="10" fill="var(--ink-secondary)">
        <line x1="0" y1="-4" x2="18" y2="-4" stroke="var(--accent-terracotta)" stroke-width="1.8" stroke-dasharray="4,2" />
        <text x="24" y="0">NCARB 550 Cut Score Ring</text>
        <rect x="195" y="-9" width="10" height="10" fill="var(--accent-cobalt-soft)" stroke="var(--accent-cobalt)" stroke-width="1.5" />
        <text x="210" y="0">Your Scaled Readiness</text>
      </g>
    </svg>
  `;
}

window.selectRadarDiv = function(code) {
  state.radarFocus = code;
  renderApp();
};

/* ==========================================================================
   EVALUATE QUESTION & CLASSIFY AXP TASK
   ========================================================================== */
function evaluateItem(q, ans) {
  if (ans === undefined || ans === null) return false;
  if (q.type === "mc" || q.type === "cata") {
    const a = Array.isArray(ans) ? [...ans].sort() : [ans].sort();
    const c = [...(q.correctAnswer || [])].sort();
    return a.length === c.length && a.every((v, idx) => v === c[idx]);
  }
  if (q.type === "fib") {
    const num = parseFloat(String(ans).replace(/[^0-9.-]/g, ""));
    if (isNaN(num)) return false;
    return Math.abs(num - Number(q.correctAnswer)) <= Number(q.tolerance ?? 0.05);
  }
  if (q.type === "hotspot") {
    const z = q.targetZone;
    return ans.x >= z.xMin && ans.x <= z.xMax && ans.y >= z.yMin && ans.y <= z.yMax;
  }
  if (q.type === "drag") {
    return Object.entries(q.correctMapping || {}).every(([k, v]) => ans[k] === v);
  }
  return false;
}

function classifyWorkTask(description) {
  const text = (description || "").toLowerCase();
  const rules = [
    {
      code: "CE", name: "Construction & Evaluation",
      keywords: ["rfi", "submittal", "shop drawing", "site visit", "punch list", "pay app", "g702", "g703", "change order", "g701", "ccd", "g714", "asi", "g710", "field report", "closeout", "substantial completion", "cylinder"],
      competency: "Review shop drawings, submittals, RFIs, and payment applications during construction administration",
      synergy: "Directly reinforces ARE 5.0 CE Section 2 (Construction Observation) & Section 3 (Administrative Procedures)."
    },
    {
      code: "PDD", name: "Project Development & Documentation",
      keywords: ["wall section", "detail", "flashing", "spec", "masterformat", "csi", "cd", "construction document", "door schedule", "window schedule", " coordination", "clash", "vapor", "acoustical", "structural detail"],
      competency: "Prepare construction documents, technical specifications (CSI 3-Part), and wall assembly details",
      synergy: "Directly reinforces ARE 5.0 PDD Section 1 (Integration of Building Materials) & Section 2 (Construction Documentation)."
    },
    {
      code: "PPD", name: "Project Planning & Design",
      keywords: ["schematic", "massing", "hvac", "mechanical", "daylight", "solar", "structural system", "egress", "life safety", "occupancy", "fire rating", "ibc", "energy model", "acoustic"],
      competency: "Perform schematic design alternatives, IBC life-safety egress sizing, and MEP/structural system selection",
      synergy: "Directly reinforces ARE 5.0 PPD Section 3 (Building Systems) & Section 4 (Project Planning)."
    },
    {
      code: "PA", name: "Programming & Analysis",
      keywords: ["zoning", "setback", "far", "site analysis", "program", "adjacency", "bubble", "topography", "contour", "geotech", "soil", "wetland", "feasibility", "existing building"],
      competency: "Analyze site zoning constraints, FAR, topographic drainage contours, and client space programming",
      synergy: "Directly reinforces ARE 5.0 PA Section 1 (Environmental & Contextual Conditions) & Section 3 (Programming)."
    },
    {
      code: "PjM", name: "Project Management",
      keywords: ["schedule", "critical path", "cpm", "b101", "a101", "a201", "c401", "consultant", "work plan", "fee budget", "qa/qc", "quality control", "client meeting", "scope"],
      competency: "Manage project work plans, CPM schedules, AIA Owner/Consultant agreements, and QA/QC reviews",
      synergy: "Directly reinforces ARE 5.0 PjM Section 2 (Project Execution) & Section 3 (Project Quality Control)."
    },
    {
      code: "PcM", name: "Practice Management",
      keywords: ["multiplier", "overhead", "utilization", "marketing", "proposal", "rfp", "insurance", "llc", "llp", "corporation", "firm", "staffing", "hr", "ethics", "standard of care"],
      competency: "Calculate firm financial metrics (Net Multiplier, Overhead Rate, Utilization) and evaluate business risk",
      synergy: "Directly reinforces ARE 5.0 PcM Section 2 (Finances, Risk & Development) & Section 3 (Practice-Wide Delivery)."
    }
  ];

  const scored = rules.map(r => {
    let hits = 0;
    r.keywords.forEach(k => { if (text.includes(k)) hits += 2; });
    return { ...r, hits };
  }).sort((a, b) => b.hits - a.hits);

  const primary = scored[0].hits > 0 ? scored[0] : rules[1];
  const secondary = scored[1];
  return {
    primary,
    secondary,
    confidence: primary.hits >= 4 ? "98% Match" : primary.hits >= 2 ? "92% Match" : "85% Match"
  };
}

/* ==========================================================================
   MASTER RENDER FUNCTION
   ========================================================================== */
function renderApp() {
  if (!db) return;
  const root = document.getElementById("app-root");
  const totalAxp = db.axpData.areas.reduce((s, a) => s + a.totalLogged, 0);
  const avgScaled = Math.round(db.divisions.reduce((s, d) => s + d.readinessScaledScore, 0) / db.divisions.length);

  root.innerHTML = `
    <div class="monograph-shell">
      <!-- Architectural Sheet Titleblock Header -->
      <div class="titleblock-bar">
        <div class="titleblock-meta">
          <span><strong>PROJECT:</strong> NCARB ARE 5.0 &amp; AXP LICENSURE MONOGRAPH</span>
          <span><strong>JURISDICTION:</strong> MIDWEST / CENTRAL (IL · MN · OH · TX · MI · WI)</span>
          <span><strong>CUT SCORE:</strong> 550 / 800 SCALED</span>
        </div>
        <div class="titleblock-meta">
          <span><strong>AXP RECORD:</strong> ${totalAxp.toLocaleString()} / 3,740 HRS (${((totalAxp / 3740) * 100).toFixed(1)}%)</span>
          <span><strong>GOOGLE SHEET SYNC:</strong> <a href="${GOOGLE_SHEET_URL}" target="_blank" rel="noopener" style="color:var(--accent-verdigris);font-weight:700;text-decoration:underline;">LIVE CONNECTED ↗</a></span>
        </div>
      </div>

      <!-- Sticky Studio Masthead -->
      <header class="atelier-masthead">
        <div class="brand-lockup">
          <div class="brand-monogram" aria-hidden="true">A</div>
          <div class="brand-titles">
            <h1>Atelier ARE 5.0 &amp; AXP Licensure Studio</h1>
            <div class="brand-subtitle">NCARB · PPI2Pass · Amber Book · Black Spectacles · Walking the ARE · Hyperfine</div>
          </div>
        </div>

        <nav class="studio-nav" aria-label="Primary Workspace Navigation">
          <button id="nav-tab-overview" class="studio-tab ${state.tab === 'overview' ? 'active' : ''}" onclick="switchTab('overview')">
            <span class="tab-index">01</span> Command Monograph
          </button>
          <button id="nav-tab-simulator" class="studio-tab ${state.tab === 'simulator' ? 'active' : ''}" onclick="switchTab('simulator')">
            <span class="tab-index">02</span> PSI Exam Simulator (${db.questions.length})
          </button>
          <button id="nav-tab-axp" class="studio-tab ${state.tab === 'axp' ? 'active' : ''}" onclick="switchTab('axp')">
            <span class="tab-index">03</span> AXP Tracker &amp; Task AI
          </button>
          <button id="nav-tab-atlas" class="studio-tab ${state.tab === 'atlas' ? 'active' : ''}" onclick="switchTab('atlas')">
            <span class="tab-index">04</span> Visual Concept Atlas &amp; Coach
          </button>
          <button id="nav-tab-library" class="studio-tab ${state.tab === 'library' ? 'active' : ''}" onclick="switchTab('library')">
            <span class="tab-index">05</span> Drive PDF Library (${db.driveResources.length})
          </button>
          <button id="nav-tab-stats" class="studio-tab ${state.tab === 'stats' ? 'active' : ''}" onclick="switchTab('stats')">
            <span class="tab-index">06</span> Pass Rates &amp; Board News
          </button>
        </nav>

        <div class="masthead-actions">
          <button id="btn-theme-toggle" class="btn-arch" onclick="toggleTheme()" title="Switch between Warm Vellum and Obsidian Studio Theme">
            ${state.theme === 'light' ? '☾ Obsidian Blueprint' : '☀ Warm Vellum'}
          </button>
          <a href="${GOOGLE_SHEET_URL}" target="_blank" rel="noopener" class="btn-arch verdigris">
            Google Sheet ↗
          </a>
        </div>
      </header>

      <!-- Active Workspace View -->
      <main id="workspace-main">
        ${state.tab === 'overview' ? renderOverviewTab(totalAxp, avgScaled) : ''}
        ${state.tab === 'simulator' ? renderSimulatorTab() : ''}
        ${state.tab === 'axp' ? renderAxpTab(totalAxp) : ''}
        ${state.tab === 'atlas' ? renderAtlasTab() : ''}
        ${state.tab === 'library' ? renderLibraryTab() : ''}
        ${state.tab === 'stats' ? renderStatsTab() : ''}
      </main>
    </div>
  `;
}

/* ==========================================================================
   TAB 01: COMMAND MONOGRAPH (HERO + RADAR + 6 DIVISIONS)
   ========================================================================== */
function renderOverviewTab(totalAxp, avgScaled) {
  const focusDiv = db.divisions.find(d => d.code === state.radarFocus) || db.divisions[1];
  const heroSrc = window.__HERO_B64__ || "assets/hero.jpg";

  return `
    <!-- Editorial Hero Monograph -->
    <section class="hero-monograph">
      <div class="hero-editorial-copy">
        <div>
          <div class="hero-kicker">Architectural Registration Examination · Edition 5.0 + Legacy 4.0 Synthesis</div>
          <h2 class="hero-headline">Precision Preparation Across All Six NCARB Divisions &amp; 3,740 AXP Hours.</h2>
          <p class="hero-lead">
            Synthesizing your 13 Google Drive study manuals (<em>NCARB Guidelines, PPI2Pass Review Manuals, Walking the ARE 2.1, Hyperfine PcM/PjM, RMS Study Guide, and BYoung Matrix</em>) into an interactive PSI testing workbench, visual building-science atlas, and live Google Sheet AXP ledger.
          </p>
        </div>

        <div class="hero-kpi-strip">
          <div class="kpi-cell">
            <div class="kpi-label">Composite Scaled</div>
            <div class="kpi-val">${avgScaled}<span style="font-size:1rem;color:var(--ink-muted)">/800</span></div>
            <div class="kpi-sub" style="color:var(--accent-verdigris)">4 of 6 Divisions ≥ 550 Cut</div>
          </div>
          <div class="kpi-cell">
            <div class="kpi-label">AXP Experience</div>
            <div class="kpi-val">${totalAxp.toLocaleString()}<span style="font-size:1rem;color:var(--ink-muted)">h</span></div>
            <div class="kpi-sub" style="color:var(--accent-cobalt)">${(3740 - totalAxp).toFixed(0)} hrs to 3,740 Req</div>
          </div>
          <div class="kpi-cell">
            <div class="kpi-label">Simulator Bank</div>
            <div class="kpi-val">${db.questions.length}<span style="font-size:1rem;color:var(--ink-muted)"> Items</span></div>
            <div class="kpi-sub" style="color:var(--accent-terracotta)">+ 6 Multi-Doc Case Studies</div>
          </div>
          <div class="kpi-cell">
            <div class="kpi-label">National Pass Avg</div>
            <div class="kpi-val">55%</div>
            <div class="kpi-sub" style="color:var(--ink-secondary)">Midwest Avg: 57.5%</div>
          </div>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:0.75rem;">
          <button class="btn-arch primary" onclick="switchTab('simulator')">Launch Full PSI Exam Simulator →</button>
          <button class="btn-arch cobalt" onclick="switchTab('atlas')">Explore Interactive Visual Concept Atlas</button>
          <button class="btn-arch" onclick="switchTab('axp')">Classify Work Tasks for AXP Hours</button>
        </div>
      </div>

      <div class="hero-visual-frame">
        <img src="${heroSrc}" alt="Architectural studio table with structural wall section blueprints, brass scale ruler, concrete and oak material samples, and basswood pavilion model" />
        <div class="hero-caption-plate">
          <span>FIG 1.0 — ATELIER STUDIO WORKBENCH (PA · PPD · PDDTECHNICAL SYNTHESIS)</span>
          <span>SCALE: NTS</span>
        </div>
      </div>
    </section>

    <!-- 12-Col Analytics Row: 6-Axis Radar + Selected Division Diagnostic -->
    <div class="sheet-grid-12">
      <div class="col-6 arch-sheet">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">DIAG-01</span>
            <h3 class="sheet-title">Six-Division Scaled Competency Radar</h3>
          </div>
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted)">Click any vertex to inspect</span>
        </div>
        <div class="sheet-body">
          ${buildCompetencyRadarSvg()}
        </div>
      </div>

      <div class="col-6 arch-sheet">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">${focusDiv.code}</span>
            <h3 class="sheet-title">${esc(focusDiv.name)} — Deep Diagnostic</h3>
          </div>
          <button class="btn-arch primary" onclick="launchDivisionSim('${focusDiv.code}')">Practice ${focusDiv.code} Items →</button>
        </div>
        <div class="sheet-body" style="display:flex;flex-direction:column;gap:1rem;">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;background:var(--bg-elevated);padding:0.85rem;border:1px solid var(--hairline);font-family:var(--font-mono);font-size:0.78rem;">
            <div><div style="color:var(--ink-muted)">Scaled Score</div><div style="font-size:1.1rem;font-weight:700;color:${focusDiv.readinessScaledScore >= 550 ? 'var(--accent-verdigris)' : 'var(--accent-terracotta)'}">${focusDiv.readinessScaledScore} / 800</div></div>
            <div><div style="color:var(--ink-muted)">Exam Format</div><div style="font-weight:700">${focusDiv.totalItems} Qs · ${focusDiv.testDurationDisplay}</div></div>
            <div><div style="color:var(--ink-muted)">Nat'l / 1st Try</div><div style="font-weight:700">${focusDiv.passRates['2025']}% / ${focusDiv.passRates.firstAttempt}%</div></div>
            <div><div style="color:var(--ink-muted)">AXP Area Req</div><div style="font-weight:700">${focusDiv.axpRequiredHours} hrs</div></div>
          </div>

          <div style="font-size:0.84rem;font-family:var(--font-mono);color:var(--ink-secondary);">
            <strong>Legacy ARE 4.0 Crosswalk:</strong> ${esc(focusDiv.legacyAre4.join(" + "))}
          </div>

          <div style="display:flex;flex-direction:column;gap:0.65rem;">
            ${focusDiv.sections.map(sec => `
              <div style="border:1px solid var(--hairline);padding:0.75rem 0.95rem;background:var(--bg-canvas);">
                <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">
                  <span>${esc(sec.id)}: ${esc(sec.title)}</span>
                  <span style="color:var(--accent-cobalt)">Weight: ${esc(sec.weight)} (${esc(sec.items)})</span>
                </div>
                <ul style="margin:0.4rem 0 0;padding-left:1.15rem;font-size:0.8rem;color:var(--ink-secondary);">
                  ${sec.objectives.map(o => `<li>${esc(o)}</li>`).join("")}
                </ul>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>

    <!-- All 6 ARE 5.0 Divisions Matrix -->
    <div style="margin-top:2rem;">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:1rem;border-bottom:1px solid var(--hairline-strong);padding-bottom:0.6rem;">
        <h3 style="margin:0;font-family:var(--font-display);font-size:1.65rem;font-weight:400;">All Six ARE 5.0 Divisions — Specifications, Pass Rates &amp; Study Progress</h3>
        <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted)">2026 NCARB Examination Fee: $263 / Division ($1,578 Total)</span>
      </div>

      <div class="divisions-matrix">
        ${db.divisions.map(d => {
          const pass = d.readinessScaledScore >= 550;
          const pct = Math.min(100, Math.round((d.loggedStudyHours / d.recommendedStudyHours) * 100));
          return `
            <article class="division-plate">
              <div>
                <div class="division-plate-top">
                  <div class="division-badge-row">
                    <span class="div-code-tag">DIV 0${d.number} · ${d.code}</span>
                    <span class="status-tag ${pass ? 'status-pass' : 'status-focus'}">
                      ${d.readinessScaledScore} / 800 (${pass ? 'PASS READY' : 'NEEDS FOCUS'})
                    </span>
                  </div>
                  <h4 class="division-name">${esc(d.name)}</h4>
                  <p class="division-desc">${esc(d.description)}</p>
                </div>

                <div class="division-specs-strip">
                  <div><div class="spec-lbl">Items</div><div class="spec-val">${d.totalItems}</div></div>
                  <div><div class="spec-lbl">Seat Time</div><div class="spec-val">${d.testDurationDisplay}</div></div>
                  <div><div class="spec-lbl">Nat'l Pass</div><div class="spec-val">${d.passRates['2025']}%</div></div>
                  <div><div class="spec-lbl">Midwest</div><div class="spec-val">${d.passRates.midwestAvg}%</div></div>
                </div>
              </div>

              <div class="division-plate-foot">
                <div>
                  <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.75rem;margin-bottom:0.35rem;">
                    <span>Study Logged: <strong>${d.loggedStudyHours} / ${d.recommendedStudyHours} hrs</strong> (${pct}%)</span>
                    <span>AXP Req: <strong>${d.axpRequiredHours}h</strong></span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill" style="width:${pct}%;background:${pass ? 'var(--accent-verdigris)' : 'var(--accent-terracotta)'}"></div>
                  </div>
                </div>

                <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted);">
                  ARE 4.0 Legacy: <strong style="color:var(--ink-secondary)">${esc(d.legacyAre4.join(" · "))}</strong>
                </div>

                <div style="display:flex;gap:0.5rem;">
                  <button class="btn-arch primary" style="flex:1;justify-content:center;" onclick="launchDivisionSim('${d.code}')">
                    Launch ${d.code} Exam →
                  </button>
                  <button class="btn-arch" onclick="selectRadarDiv('${d.code}');window.scrollTo({top:420,behavior:'smooth'})">
                    Objectives
                  </button>
                </div>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

/* ==========================================================================
   TAB 02: PSI / NCARB PRACTICE EXAM SIMULATOR
   ========================================================================== */
function renderSimulatorTab() {
  const q = state.simItems[state.simIdx] || db.questions[0];
  const cs = q.caseStudyId ? db.caseStudies.find(c => c.id === q.caseStudyId) : null;
  const ans = state.simAnswers[q.id];
  const rev = Boolean(state.simRevealed[q.id]);
  const flagged = Boolean(state.simFlags[q.id]);
  const isOk = rev ? evaluateItem(q, ans) : false;

  return `
    <!-- Filter & Mode Control Bar -->
    <div class="arch-sheet" style="margin-top:1.25rem;padding:0.9rem 1.25rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;">
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:0.65rem;">
        <select id="sim-flt-div" class="arch-select" style="width:auto;" onchange="applySimFilters()">
          <option value="ALL" ${state.simDivision === 'ALL' ? 'selected' : ''}>All 6 ARE 5.0 Divisions (${db.questions.length} Items)</option>
          ${db.divisions.map(d => `<option value="${d.code}" ${state.simDivision === d.code ? 'selected' : ''}>${d.code} — ${esc(d.name)}</option>`).join("")}
        </select>

        <select id="sim-flt-leg" class="arch-select" style="width:auto;" onchange="applySimFilters()">
          <option value="ALL" ${state.simLegacy === 'ALL' ? 'selected' : ''}>ARE 5.0 + Legacy ARE 4.0 Mock Exams</option>
          <option value="PPP" ${state.simLegacy === 'PPP' ? 'selected' : ''}>Legacy ARE 4.0 PPP (Programming, Planning &amp; Practice)</option>
          <option value="CDS" ${state.simLegacy === 'CDS' ? 'selected' : ''}>Legacy ARE 4.0 CDS (Construction Documents &amp; Services)</option>
          <option value="SPD" ${state.simLegacy === 'SPD' ? 'selected' : ''}>Legacy ARE 4.0 SPD (Site Planning &amp; Design)</option>
          <option value="BDCS" ${state.simLegacy === 'BDCS' ? 'selected' : ''}>Legacy ARE 4.0 BDCS (Building Design &amp; Construction Systems)</option>
        </select>

        <select id="sim-flt-type" class="arch-select" style="width:auto;" onchange="applySimFilters()">
          <option value="ALL" ${state.simType === 'ALL' ? 'selected' : ''}>All 5 NCARB Item Types</option>
          <option value="mc" ${state.simType === 'mc' ? 'selected' : ''}>Multiple Choice (MC)</option>
          <option value="cata" ${state.simType === 'cata' ? 'selected' : ''}>Check-All-That-Apply (CATA)</option>
          <option value="fib" ${state.simType === 'fib' ? 'selected' : ''}>Quantitative Fill-in-the-Blank (FIB)</option>
          <option value="hotspot" ${state.simType === 'hotspot' ? 'selected' : ''}>Interactive CAD Blueprint Hotspot</option>
          <option value="drag" ${state.simType === 'drag' ? 'selected' : ''}>Drag-and-Place Matching</option>
        </select>
      </div>

      <div style="display:flex;align-items:center;gap:0.6rem;">
        <button class="btn-arch verdigris" onclick="scoreExamSession()">Grade Exam &amp; Generate Score Report</button>
      </div>
    </div>

    ${state.simReport ? `
      <div class="arch-sheet" style="margin-top:1.25rem;border:2px solid ${state.simReport.passed ? 'var(--accent-verdigris)' : 'var(--accent-terracotta)'};padding:1.25rem;">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;">
          <div>
            <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;color:${state.simReport.passed ? 'var(--accent-verdigris)' : 'var(--accent-terracotta)'}">
              NCARB DIAGNOSTIC SCORE REPORT · ${state.simReport.passed ? 'PASSING PERFORMANCE (≥ 550 CUT SCORE)' : 'BELOW PASSING THRESHOLD (< 550 CUT SCORE)'}
            </div>
            <h3 style="margin:0.25rem 0 0;font-family:var(--font-display);font-size:1.75rem;font-weight:400;">
              Scaled Score: <strong>${state.simReport.scaledScore} / 800</strong> (${state.simReport.correct} of ${state.simReport.total} Correct · ${state.simReport.accuracy}%)
            </h3>
          </div>
          <button class="btn-arch" onclick="state.simReport=null;renderApp()">Dismiss Score Report ✕</button>
        </div>
      </div>
    ` : ''}

    <!-- Authentic PSI Testing Frame -->
    <div class="psi-frame">
      <div class="psi-top-chrome">
        <div style="display:flex;align-items:center;gap:0.85rem;">
          <span style="background:var(--accent-terracotta);color:#fff;padding:0.2rem 0.55rem;font-weight:700;">NCARB / PSI EXAM ENGINE</span>
          <span>DIVISION: <strong>${esc(q.division)}</strong> · ${esc(q.section)} (Obj ${esc(q.objective)})</span>
          ${q.legacyExam ? `<span style="background:rgba(56,189,248,0.2);color:#7dd3fc;padding:0.15rem 0.5rem;">ARE 4.0 ${esc(q.legacyExam)}</span>` : ''}
        </div>

        <div style="display:flex;align-items:center;gap:0.75rem;">
          <span>ITEM <strong>${state.simIdx + 1}</strong> OF <strong>${state.simItems.length}</strong></span>
          <span>⏱ <strong id="psi-live-clock">${formatTimer(state.simSeconds)}</strong></span>
        </div>
      </div>

      <div class="psi-sub-chrome">
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
          <button class="psi-tool-btn ${flagged ? 'active-flag' : ''}" onclick="toggleFlag('${q.id}')">
            ⚑ ${flagged ? 'Flagged for Review' : 'Flag Item'}
          </button>
          <button class="psi-tool-btn" onclick="openCalculatorModal()">🖩 NCARB Calculator &amp; Formulas</button>
          <button class="psi-tool-btn" onclick="openWhiteboardModal()">✎ Digital Canvas Scratchpad</button>
          <button class="psi-tool-btn" onclick="openReferenceModal()">📖 AIA / IBC Quick Reference</button>
        </div>
        <div>SOURCE: ${esc(q.source)} · DIFFICULTY: ${esc(q.difficulty || 'Medium')}</div>
      </div>

      <div class="psi-workbench ${cs ? '' : 'single-col'}">
        <!-- Left Question Column -->
        <div class="psi-question-pane">
          <div style="display:flex;flex-direction:column;gap:1.25rem;">
            <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted);">
              <span>ITEM ID: ${esc(q.id)} (${esc(q.type.toUpperCase())})</span>
              <span>RIGHT-CLICK OR CLICK 'STRIKE' TO ELIMINATE DISTRACTors</span>
            </div>

            <div class="question-stem">${esc(q.stem)}</div>

            ${renderQuestionInteractiveBody(q, ans, rev)}

            ${rev ? `
              <div style="padding:1.15rem;background:var(--bg-elevated);border-left:4px solid ${isOk ? 'var(--accent-verdigris)' : 'var(--accent-crimson)'};font-size:0.88rem;">
                <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;color:${isOk ? 'var(--accent-verdigris)' : 'var(--accent-crimson)'};margin-bottom:0.4rem;">
                  ${isOk ? '✓ CORRECT (+1 RAW SCORE — MEETS NCARB COMPETENCY STANDARD)' : '✕ INCORRECT (0 POINTS — REVIEW ARCHITECTURAL RATIONALE)'}
                </div>
                <div style="line-height:1.6;color:var(--ink-primary);">${esc(q.explanation)}</div>
                <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted);margin-top:0.5rem;">
                  Primary Study Reference: <strong>${esc(q.reference)}</strong>
                </div>
              </div>
            ` : ''}
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:1rem;border-top:1px solid var(--hairline);">
            <button class="btn-arch" onclick="stepSimItem(-1)" ${state.simIdx === 0 ? 'disabled' : ''}>← Previous Item</button>
            <div style="display:flex;gap:0.6rem;">
              <button class="btn-arch cobalt" onclick="revealCurrentItem('${q.id}')">Check Answer &amp; Rationale</button>
              <button class="btn-arch primary" onclick="stepSimItem(1)">Next Item →</button>
            </div>
          </div>
        </div>

        <!-- Right Case Study Exhibit Drawer -->
        ${cs ? `
          <div class="psi-case-pane">
            <div style="padding:0.9rem 1.25rem;background:var(--bg-surface);border-bottom:1px solid var(--hairline-strong);">
              <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-terracotta);font-weight:700;">
                CASE STUDY EXHIBIT BINDER · ${esc(cs.division)}
              </div>
              <h4 style="margin:0.2rem 0;font-family:var(--font-display);font-size:1.3rem;font-weight:400;">${esc(cs.title)}</h4>
              <p style="margin:0;font-size:0.8rem;color:var(--ink-secondary);">${esc(cs.scenario)}</p>
            </div>

            <div style="display:flex;flex-wrap:wrap;gap:0.35rem;padding:0.65rem 1.25rem;background:var(--bg-inset);border-bottom:1px solid var(--hairline);">
              ${cs.resources.map((r, idx) => `
                <button class="btn-arch ${state.simCaseTab === idx ? 'primary' : ''}" style="padding:0.35rem 0.7rem;font-size:0.75rem;" onclick="state.simCaseTab=${idx};renderApp()">
                  📄 ${esc(r.title)}
                </button>
              `).join("")}
            </div>

            <div style="padding:1.25rem;flex:1;">
              ${renderFormattedCaseExhibit(cs.resources[state.simCaseTab] || cs.resources[0], cs)}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Bottom Item Navigator Ribbon -->
      <div class="item-ribbon">
        <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted);margin-right:0.5rem;">ITEM NAVIGATOR:</span>
        ${state.simItems.map((it, idx) => {
          const hasAns = state.simAnswers[it.id] !== undefined;
          const isCur = idx === state.simIdx;
          const isFlg = Boolean(state.simFlags[it.id]);
          return `<button class="nav-num-btn ${isCur ? 'current' : hasAns ? 'answered' : ''} ${isFlg ? 'flagged' : ''}" onclick="state.simIdx=${idx};state.simCaseTab=0;renderApp()">${idx + 1}</button>`;
        }).join("")}
      </div>
    </div>
  `;
}

function renderFormattedCaseExhibit(res, cs) {
  const lines = String(res.content || "").split("\n");
  return `
    <div style="background:var(--bg-surface);border:1px solid var(--hairline-strong);box-shadow:var(--shadow-sheet);">
      <div style="padding:0.55rem 0.9rem;background:var(--bg-elevated);border-bottom:1px solid var(--hairline-strong);display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.75rem;">
        <span><strong>DOCUMENT:</strong> ${esc(res.title.toUpperCase())}</span>
        <span><strong>SHEET:</strong> ${esc(cs.id.toUpperCase())}-0${state.simCaseTab + 1}</span>
      </div>
      <div style="padding:1rem;font-family:var(--font-mono);font-size:0.78rem;line-height:1.65;">
        ${lines.map(line => {
          const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
          const parts = line.split(":");
          if (parts.length >= 2 && parts[0].length < 42) {
            return `<div style="padding:0.3rem 0;border-bottom:1px dashed var(--hairline);"><strong style="color:var(--accent-cobalt)">${esc(parts[0])}:</strong> ${esc(parts.slice(1).join(":"))}</div>`;
          }
          return `<div style="padding:0.25rem 0;${isBullet ? 'color:var(--ink-primary);font-weight:500;' : ''}">${esc(line)}</div>`;
        }).join("")}
      </div>
    </div>
  `;
}

function renderQuestionInteractiveBody(q, ans, rev) {
  if (q.type === "mc" || q.type === "cata") {
    const sel = new Set(Array.isArray(ans) ? ans : ans ? [ans] : []);
    const corr = new Set(q.correctAnswer || []);
    const struck = new Set(state.simStrikes[q.id] || []);
    return `
      <div>
        ${q.type === "cata" ? `<div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-terracotta);font-weight:700;margin-bottom:0.5rem;">CHECK ALL THAT APPLY — NO PARTIAL CREDIT PER NCARB SCORING RULES</div>` : ''}
        ${q.options.map(o => {
          const isS = sel.has(o.id);
          const isC = corr.has(o.id);
          const isSt = struck.has(o.id);
          let cls = isS ? "selected" : "";
          if (rev) {
            if (isC) cls = "correct";
            else if (isS && !isC) cls = "wrong";
          }
          return `
            <div class="option-row">
              <button class="option-card-btn ${cls} ${isSt ? 'struck' : ''}" onclick="selectSimOption('${q.id}','${o.id}','${q.type}')">
                <span class="opt-key">${esc(o.id)}</span>
                <span>${esc(o.text)}</span>
              </button>
              <button class="strike-btn" onclick="toggleSimStrike('${q.id}','${o.id}')" title="Cross out distractor">Strike</button>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  if (q.type === "fib") {
    return `
      <div style="background:var(--bg-elevated);border:1px solid var(--hairline-strong);padding:1.25rem;max-width:440px;">
        <label style="display:block;font-family:var(--font-mono);font-size:0.75rem;text-transform:uppercase;color:var(--ink-muted);margin-bottom:0.5rem;">
          QUANTITATIVE NUMERICAL ENTRY (${esc(q.unit)}):
        </label>
        <div style="display:flex;align-items:center;gap:0.65rem;">
          <input type="text" class="arch-input" style="font-family:var(--font-mono);font-size:1rem;font-weight:700;" value="${esc(ans ?? '')}" oninput="state.simAnswers['${q.id}']=this.value" placeholder="Enter calculated value..." />
          <span style="font-family:var(--font-mono);font-size:0.82rem;white-space:nowrap;">${esc(q.unit)}</span>
        </div>
        ${rev ? `<div style="font-family:var(--font-mono);font-size:0.8rem;color:var(--accent-verdigris);font-weight:700;margin-top:0.55rem;">Accepted NCARB Value: ${esc(q.correctAnswer)} (±${esc(q.tolerance)})</div>` : ''}
      </div>
    `;
  }

  if (q.type === "hotspot") {
    const pin = ans && typeof ans.x === "number" ? ans : null;
    const z = q.targetZone;
    return `
      <div>
        <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-secondary);margin-bottom:0.5rem;">
          <span>CLICK DIRECTLY ON THE ARCHITECTURAL CAD DETAIL BELOW TO PLACE TARGET PIN:</span>
          <span>${pin ? `PIN PLACED AT (${pin.x}, ${pin.y})` : 'NO PIN PLACED YET'}</span>
        </div>
        <div style="border:2px solid var(--ink-primary);background:#fcfaf5;cursor:crosshair;max-width:680px;" onclick="placeHotspotPin(event,'${q.id}')">
          ${q.diagramType === "site-grading-hotspot" ? buildCadSiteGradingSvg(pin, rev, z) : buildCadWallSectionSvg(pin, rev, z)}
        </div>
      </div>
    `;
  }

  if (q.type === "drag") {
    const cur = ans && typeof ans === "object" ? ans : {};
    return `
      <div style="display:flex;flex-direction:column;gap:0.65rem;">
        ${q.targets.map(t => `
          <div style="background:var(--bg-elevated);border:1px solid var(--hairline-strong);padding:0.85rem 1rem;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.75rem;">
            <span style="font-size:0.88rem;font-weight:500;flex:1;">${esc(t.label)}</span>
            <select class="arch-select" style="width:auto;min-width:250px;font-family:var(--font-mono);font-size:0.78rem;" onchange="setDragMatch('${q.id}','${t.id}',this.value)">
              <option value="">— Assign Matching Token —</option>
              ${q.tokens.map(tok => `<option value="${esc(tok)}" ${cur[t.id] === tok ? 'selected' : ''}>${esc(tok)}</option>`).join("")}
            </select>
          </div>
        `).join("")}
      </div>
    `;
  }
  return "";
}

function buildCadSiteGradingSvg(pin, rev, z) {
  return `
    <svg viewBox="0 0 100 70" style="width:100%;height:auto;display:block;">
      <defs>
        <pattern id="hatch-bldg" width="3" height="3" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="3" stroke="#64748b" stroke-width="0.35" />
        </pattern>
      </defs>
      <!-- Property Boundary & Setback Dash -->
      <rect x="3" y="3" width="94" height="64" fill="none" stroke="#1e293b" stroke-width="0.5" stroke-dasharray="3,1.5" />
      <!-- Topographic Contours -->
      <path d="M 4 11 Q 52 27 96 9" fill="none" stroke="#854d0e" stroke-width="0.45" stroke-dasharray="2,1" />
      <text x="6" y="9.5" font-size="2.6" fill="#854d0e" font-family="monospace">EL. 102'-0"</text>
      <path d="M 4 21 Q 54 37 96 19" fill="none" stroke="#854d0e" stroke-width="0.55" />
      <text x="6" y="19.5" font-size="2.6" fill="#854d0e" font-family="monospace">EL. 100'-0"</text>
      <path d="M 4 34 Q 55 51 96 32" fill="none" stroke="#b45309" stroke-width="0.85" />
      <text x="6" y="32.5" font-size="2.7" font-weight="bold" fill="#b45309" font-family="monospace">EL. 95'-0" SWALE AXIS</text>
      <path d="M 4 51 Q 50 61 96 49" fill="none" stroke="#854d0e" stroke-width="0.55" />
      <text x="6" y="49.5" font-size="2.6" fill="#854d0e" font-family="monospace">EL. 90'-0"</text>

      <!-- Existing Garage -->
      <rect x="18" y="14" width="25" height="14" fill="url(#hatch-bldg)" stroke="#0f172a" stroke-width="0.8" />
      <rect x="20" y="16" width="21" height="10" fill="#f8fafc" fill-opacity="0.88" />
      <text x="21.5" y="21" font-size="2.4" font-weight="bold" fill="#0f172a" font-family="monospace">EXISTING GARAGE</text>
      <text x="21.5" y="24.2" font-size="2.1" fill="#334155" font-family="monospace">FF EL. 102'-6"</text>

      <!-- Proposed House Addition -->
      <rect x="44" y="42" width="27" height="16" fill="#e2e8f0" stroke="#0f172a" stroke-width="0.95" />
      <text x="46" y="49.5" font-size="2.5" font-weight="bold" fill="#0f172a" font-family="monospace">PROPOSED ADDITION</text>
      <text x="46" y="53" font-size="2.2" fill="#1e40af" font-family="monospace">FF EL. 90'-0" (PROTECT)</text>

      <!-- North Arrow & Graphic Scale -->
      <g transform="translate(90, 58)">
        <circle cx="0" cy="0" r="3.5" fill="none" stroke="#0f172a" stroke-width="0.5" />
        <polygon points="0,-3.5 -1.4,1.5 0,0.4 1.4,1.5" fill="#0f172a" />
        <text x="-1.1" y="-4.3" font-size="2.4" font-weight="bold" font-family="monospace">N</text>
      </g>

      ${rev ? `<rect x="${z.xMin}" y="${z.yMin}" width="${z.xMax - z.xMin}" height="${z.yMax - z.yMin}" fill="rgba(22,163,74,0.22)" stroke="#15803d" stroke-width="0.9" stroke-dasharray="1.5,1" />` : ''}
      ${pin ? `
        <circle cx="${pin.x}" cy="${pin.y}" r="2.6" fill="#dc2626" stroke="#fff" stroke-width="0.6" />
        <line x1="${pin.x - 4}" y1="${pin.y}" x2="${pin.x + 4}" y2="${pin.y}" stroke="#dc2626" stroke-width="0.45" />
        <line x1="${pin.x}" y1="${pin.y - 4}" x2="${pin.x}" y2="${pin.y + 4}" stroke="#dc2626" stroke-width="0.45" />
      ` : ''}
    </svg>
  `;
}

function buildCadWallSectionSvg(pin, rev, z) {
  return `
    <svg viewBox="0 0 100 70" style="width:100%;height:auto;display:block;">
      <defs>
        <pattern id="brick-hatch" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#7c2d12" stroke-width="0.5" />
        </pattern>
      </defs>
      <text x="6" y="7" font-size="2.6" font-weight="bold" fill="#1e40af" font-family="monospace">EXTERIOR (-10°F WINTER · CZ 6)</text>
      <text x="58" y="7" font-size="2.6" font-weight="bold" fill="#b45309" font-family="monospace">INTERIOR (+70°F · 40% RH)</text>

      <!-- 1. Brick Veneer -->
      <rect x="10" y="12" width="12" height="50" fill="#c2593f" stroke="#431407" stroke-width="0.7" />
      <rect x="10" y="12" width="12" height="50" fill="url(#brick-hatch)" />
      <text x="11" y="66" font-size="2.1" font-family="monospace" fill="#0f172a">1.Brick</text>

      <!-- 2. 2" Air Cavity & Weep -->
      <rect x="22" y="12" width="9" height="50" fill="#e0f2fe" stroke="#0284c7" stroke-width="0.5" />
      <text x="22.3" y="66" font-size="2.1" font-family="monospace" fill="#0369a1">2.Cavity</text>

      <!-- 3. Continuous Mineral Wool -->
      <rect x="31" y="12" width="12" height="50" fill="#fef08a" stroke="#ca8a04" stroke-width="0.6" />
      <path d="M 31 16 L 43 22 L 31 28 L 43 34 L 31 40 L 43 46 L 31 52 L 43 58" fill="none" stroke="#a16207" stroke-width="0.45" />
      <text x="31.5" y="66" font-size="2.1" font-family="monospace" fill="#854d0e">3.MinWool</text>

      <!-- 4. Exterior Sheathing + Air/Water Barrier -->
      <rect x="43" y="12" width="5" height="50" fill="#94a3b8" stroke="#334155" stroke-width="0.6" />
      <text x="43" y="10.5" font-size="2" font-family="monospace" fill="#334155">4.Sheath</text>

      <!-- 5. 6" Cold-Formed Metal Stud + Batt -->
      <rect x="48" y="12" width="22" height="50" fill="#f8fafc" stroke="#334155" stroke-width="0.7" />
      <line x1="48" y1="12" x2="70" y2="62" stroke="#cbd5e1" stroke-width="0.5" />
      <line x1="70" y1="12" x2="48" y2="62" stroke="#cbd5e1" stroke-width="0.5" />
      <text x="52" y="38" font-size="2.4" font-weight="bold" font-family="monospace" fill="#334155">5. 6" STUD</text>

      <!-- 6. Warm-Side Plane for Vapor Retarder -->
      <rect x="70" y="12" width="6" height="50" fill="#fed7aa" stroke="#ea580c" stroke-width="0.8" />
      <text x="68" y="10.5" font-size="2.2" font-weight="bold" font-family="monospace" fill="#c2410c">6.WARM FACE</text>

      <!-- 7. Interior 5/8" Type X Gypsum Board -->
      <rect x="76" y="12" width="7" height="50" fill="#e2e8f0" stroke="#475569" stroke-width="0.7" />
      <text x="75.5" y="66" font-size="2.1" font-family="monospace" fill="#1e293b">7.GypBd</text>

      ${rev ? `<rect x="${z.xMin}" y="${z.yMin}" width="${z.xMax - z.xMin}" height="${z.yMax - z.yMin}" fill="rgba(22,163,74,0.25)" stroke="#15803d" stroke-width="0.9" />` : ''}
      ${pin ? `<circle cx="${pin.x}" cy="${pin.y}" r="2.6" fill="#dc2626" stroke="#fff" stroke-width="0.6" />` : ''}
    </svg>
  `;
}

/* ==========================================================================
   TAB 03: AXP HOURS TRACKER & AI WORK-TASK RECOMMENDER
   ========================================================================== */
function renderAxpTab(totalAxp) {
  return `
    <div class="sheet-grid-12">
      <!-- Left: Smart Work Task to AXP Competency Matcher -->
      <div class="col-6 arch-sheet">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">AXP-AI</span>
            <h3 class="sheet-title">Work-Task to AXP Category Recommender</h3>
          </div>
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-terracotta);font-weight:700;">96 NCARB Competencies</span>
        </div>
        <div class="sheet-body" style="display:flex;flex-direction:column;gap:1rem;">
          <p style="margin:0;font-size:0.86rem;color:var(--ink-secondary);">
            Enter a task you performed at work (or click a studio preset below) to receive an instant NCARB AXP Experience Area classification, matched competency, and ARE 5.0 study synergy.
          </p>

          <div style="display:flex;flex-wrap:wrap;gap:0.45rem;">
            <button class="btn-arch" style="font-size:0.75rem;padding:0.35rem 0.65rem;" onclick="runSampleTask('Reviewed contractor submittal log, concrete cylinder break reports, and curtain wall shop drawings; issued ASI #4')">Preset: Submittals &amp; ASI</button>
            <button class="btn-arch" style="font-size:0.75rem;padding:0.35rem 0.65rem;" onclick="runSampleTask('Calculated municipal zoning FAR, front/side setbacks, and IBC Chapter 5 allowable area')">Preset: Zoning FAR &amp; IBC</button>
            <button class="btn-arch" style="font-size:0.75rem;padding:0.35rem 0.65rem;" onclick="runSampleTask('Prepared firm Q4 staff utilization rate analysis, net multiplier, and AIA B101 fee proposal')">Preset: Utilization &amp; Fee</button>
            <button class="btn-arch" style="font-size:0.75rem;padding:0.35rem 0.65rem;" onclick="runSampleTask('Detailed exterior masonry cavity wall section, through-wall flashing, and CSI 3-Part specs')">Preset: Wall Section &amp; Specs</button>
          </div>

          <textarea id="axp-task-input" rows="3" class="arch-textarea" placeholder="Describe what you worked on this week (e.g., 'Attended OAC site observation walk, reviewed Pay App G702, and drafted punch list')..."></textarea>

          <div style="display:grid;grid-template-columns:2fr 1fr;gap:0.75rem;">
            <div>
              <label style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted);">PROJECT / FIRM</label>
              <input id="axp-proj-input" type="text" class="arch-input" value="Midwest Civic Library Renovation" style="margin-top:0.25rem;" />
            </div>
            <div>
              <label style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted);">HOURS LOGGED</label>
              <input id="axp-hrs-input" type="number" step="0.5" class="arch-input" value="8.0" style="margin-top:0.25rem;font-family:var(--font-mono);" />
            </div>
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:0.6rem;">
            <button class="btn-arch cobalt" onclick="analyzeAxpTaskInput()">1. Recommend AXP Area</button>
            <button class="btn-arch primary" onclick="recordAxpWorkLog()">2. Log Hours to AXP Ledger</button>
            <button class="btn-arch" onclick="exportAxpCsv()">⬇ Export MyNCARB CSV</button>
          </div>

          ${state.axpSuggestion ? `
            <div style="background:var(--bg-elevated);border-left:4px solid var(--accent-verdigris);padding:1rem;font-size:0.84rem;display:flex;flex-direction:column;gap:0.35rem;">
              <div style="font-family:var(--font-mono);font-weight:700;color:var(--accent-verdigris);">
                ✓ RECOMMENDED AREA: ${esc(state.axpSuggestion.primary.code)} — ${esc(state.axpSuggestion.primary.name)} (${esc(state.axpSuggestion.confidence)})
              </div>
              <div><strong>Matched NCARB Competency:</strong> ${esc(state.axpSuggestion.primary.competency)}</div>
              <div style="color:var(--ink-muted);font-family:var(--font-mono);font-size:0.76rem;">
                Secondary Candidate Area: ${esc(state.axpSuggestion.secondary.code)} (${esc(state.axpSuggestion.secondary.name)})
              </div>
              <div style="color:var(--accent-cobalt);font-family:var(--font-mono);font-size:0.76rem;padding-top:0.25rem;">
                💡 ${esc(state.axpSuggestion.synergy)}
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Right: 6 AXP Experience Areas Progress Matrix -->
      <div class="col-6 arch-sheet">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">AXP-3740</span>
            <h3 class="sheet-title">Six NCARB AXP Experience Areas (${totalAxp.toLocaleString()} / 3,740h)</h3>
          </div>
          <a href="${GOOGLE_SHEET_URL}" target="_blank" rel="noopener" class="btn-arch verdigris" style="padding:0.35rem 0.75rem;font-size:0.75rem;">Open Synced Sheet ↗</a>
        </div>
        <div class="sheet-body" style="display:flex;flex-direction:column;gap:0.85rem;">
          ${db.axpData.areas.map(a => {
            const pct = Math.min(100, ((a.totalLogged / a.requiredHours) * 100)).toFixed(1);
            return `
              <div style="border:1px solid var(--hairline);padding:0.8rem 1rem;background:var(--bg-canvas);">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.84rem;margin-bottom:0.4rem;">
                  <span><strong style="font-family:var(--font-mono);background:var(--ink-primary);color:var(--bg-surface);padding:0.1rem 0.45rem;margin-right:0.5rem;">${a.code}</strong> <strong>${esc(a.name)}</strong></span>
                  <span style="font-family:var(--font-mono);font-size:0.78rem;"><strong>${a.totalLogged}</strong> / ${a.requiredHours} hrs (${pct}%)</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" style="width:${pct}%;background:var(--accent-cobalt)"></div>
                </div>
                <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted);margin-top:0.35rem;">
                  <span>Setting A: ${a.approvedSettingA}h · Setting O: ${a.approvedSettingO}h</span>
                  <span>Remaining: ${Math.max(0, a.requiredHours - a.totalLogged)}h</span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Bottom Full-Width AXP Work Log Ledger -->
      <div class="col-12 arch-sheet">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">LEDGER</span>
            <h3 class="sheet-title">Recorded AXP Work Experience Entries (Synced with Google Sheet)</h3>
          </div>
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted)">NCARB Six-Month Reporting Rule Enforced (100% Credit ≤ 8 Months)</span>
        </div>
        <div class="sheet-body" style="overflow-x:auto;">
          <table class="arch-table">
            <thead>
              <tr>
                <th>Entry ID</th><th>Date</th><th>Project / Setting</th><th>Work Task Description</th><th>AXP Area</th><th>Hours</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${db.axpData.workLogs.map(l => `
                <tr>
                  <td style="font-family:var(--font-mono);font-weight:700;">${esc(l.id)}</td>
                  <td style="font-family:var(--font-mono);">${esc(l.date)}</td>
                  <td><strong>${esc(l.project)}</strong><br/><span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted)">${esc(l.setting)}</span></td>
                  <td>${esc(l.description)}<br/><span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-cobalt)">Competency: ${esc(l.competency)}</span></td>
                  <td><span class="div-code-tag">${esc(l.area)}</span></td>
                  <td style="font-family:var(--font-mono);font-weight:700;">${l.hours}h</td>
                  <td><span class="status-tag status-pass">${esc(l.status)}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   TAB 04: INTERACTIVE VISUAL CONCEPT ATLAS (AMBER BOOK STYLE) & AI COACH
   ========================================================================== */
function renderAtlasTab() {
  // Financial Simulator Calculations
  const rev = Number(state.finRevenue);
  const dl = Number(state.finDirectLabor);
  const oh = Number(state.finOverhead);
  const netMult = (rev / dl).toFixed(2);
  const ohRate = (oh / dl).toFixed(2);
  const breakEven = (1 + oh / dl).toFixed(2);
  const profit = rev - dl - oh;
  const profitPct = ((profit / rev) * 100).toFixed(1);

  // Zoning Envelope Calculations
  const lotArea = state.zoningLotW * state.zoningLotD;
  const maxGfa = lotArea * state.zoningFar;
  const buildW = Math.max(10, state.zoningLotW - 2 * state.zoningSetbackS);
  const buildD = Math.max(10, state.zoningLotD - 2 * state.zoningSetbackF);
  const maxFootprint = buildW * buildD;
  const minStories = Math.ceil(maxGfa / maxFootprint);

  const card = db.flashcards[state.fcIdx % db.flashcards.length];

  return `
    <div class="sheet-grid-12">
      <!-- Simulator 1: PcM Firm Financial Health Interactive Lab -->
      <div class="col-6 arch-sheet">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">ATLAS-01 · PcM</span>
            <h3 class="sheet-title">Interactive Firm Financial Ratio Lab</h3>
          </div>
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-verdigris)">Target Multiplier: 3.00x</span>
        </div>
        <div class="sheet-body" style="display:flex;flex-direction:column;gap:1rem;">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;background:var(--bg-elevated);padding:0.9rem;border:1px solid var(--hairline);text-align:center;font-family:var(--font-mono);">
            <div>
              <div style="font-size:0.75rem;color:var(--ink-muted)">NET MULTIPLIER</div>
              <div style="font-size:1.45rem;font-weight:700;color:${Number(netMult) >= Number(breakEven) ? 'var(--accent-verdigris)' : 'var(--accent-crimson)'}">${netMult}x</div>
              <div style="font-size:0.75rem;">NOR ÷ Direct Labor</div>
            </div>
            <div>
              <div style="font-size:0.75rem;color:var(--ink-muted)">BREAK-EVEN RATE</div>
              <div style="font-size:1.45rem;font-weight:700;color:var(--accent-cobalt)">${breakEven}x</div>
              <div style="font-size:0.75rem;">1 + (${ohRate} OH Rate)</div>
            </div>
            <div>
              <div style="font-size:0.75rem;color:var(--ink-muted)">NET PROFIT MARGIN</div>
              <div style="font-size:1.45rem;font-weight:700;color:${profit >= 0 ? 'var(--accent-verdigris)' : 'var(--accent-crimson)'}">${profitPct}%</div>
              <div style="font-size:0.75rem;">$${(profit / 1000).toFixed(0)}k Net</div>
            </div>
          </div>

          <div style="display:flex;flex-direction:column;gap:0.65rem;font-family:var(--font-mono);font-size:0.78rem;">
            <label>Net Operating Revenue (NOR): <strong>$${(rev / 1000000).toFixed(2)}M</strong>
              <input type="range" min="2000000" max="6500000" step="100000" value="${rev}" style="width:100%" oninput="state.finRevenue=Number(this.value);renderApp()" />
            </label>
            <label>Direct (Billable) Labor Cost: <strong>$${(dl / 1000000).toFixed(2)}M</strong>
              <input type="range" min="800000" max="2500000" step="50000" value="${dl}" style="width:100%" oninput="state.finDirectLabor=Number(this.value);renderApp()" />
            </label>
            <label>Total Indirect Overhead Cost: <strong>$${(oh / 1000000).toFixed(2)}M</strong>
              <input type="range" min="1000000" max="3500000" step="50000" value="${oh}" style="width:100%" oninput="state.finOverhead=Number(this.value);renderApp()" />
            </label>
          </div>
        </div>
      </div>

      <!-- Simulator 2: PA / PPP Interactive Zoning FAR & Setback Massing Calculator -->
      <div class="col-6 arch-sheet">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">ATLAS-02 · PA / PPP</span>
            <h3 class="sheet-title">Interactive Zoning FAR &amp; Setback Envelope Lab</h3>
          </div>
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-terracotta)">FAR × Total Lot Area</span>
        </div>
        <div class="sheet-body" style="display:flex;flex-direction:column;gap:1rem;">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.6rem;background:var(--bg-elevated);padding:0.85rem;border:1px solid var(--hairline);text-align:center;font-family:var(--font-mono);font-size:0.78rem;">
            <div><div style="color:var(--ink-muted)">Total Lot</div><div style="font-size:1.1rem;font-weight:700;">${lotArea.toLocaleString()} SF</div></div>
            <div><div style="color:var(--ink-muted)">Max GFA (FAR)</div><div style="font-size:1.1rem;font-weight:700;color:var(--accent-cobalt)">${maxGfa.toLocaleString()} SF</div></div>
            <div><div style="color:var(--ink-muted)">Max Footprint</div><div style="font-size:1.1rem;font-weight:700;">${maxFootprint.toLocaleString()} SF</div></div>
            <div><div style="color:var(--ink-muted)">Min Stories</div><div style="font-size:1.1rem;font-weight:700;color:var(--accent-terracotta)">${minStories} Floors</div></div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;font-family:var(--font-mono);font-size:0.76rem;">
            <label>Lot Width (${state.zoningLotW}'):
              <input type="range" min="60" max="200" step="10" value="${state.zoningLotW}" style="width:100%" oninput="state.zoningLotW=Number(this.value);renderApp()" />
            </label>
            <label>Lot Depth (${state.zoningLotD}'):
              <input type="range" min="100" max="250" step="10" value="${state.zoningLotD}" style="width:100%" oninput="state.zoningLotD=Number(this.value);renderApp()" />
            </label>
            <label>Max FAR (${state.zoningFar.toFixed(1)}):
              <input type="range" min="0.5" max="5.0" step="0.5" value="${state.zoningFar}" style="width:100%" oninput="state.zoningFar=Number(this.value);renderApp()" />
            </label>
            <label>Front/Rear Setback (${state.zoningSetbackF}'):
              <input type="range" min="5" max="30" step="5" value="${state.zoningSetbackF}" style="width:100%" oninput="state.zoningSetbackF=Number(this.value);renderApp()" />
            </label>
          </div>
          <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-secondary);">
            <strong>ARE Exam Trap Reminder:</strong> Setbacks reduce the <em>Buildable Footprint</em> (${buildW}' × ${buildD}' = ${maxFootprint.toLocaleString()} SF), NEVER the Lot Area used for FAR (${lotArea.toLocaleString()} SF × ${state.zoningFar} = ${maxGfa.toLocaleString()} SF).
          </div>
        </div>
      </div>

      <!-- Simulator 3: Interactive Climate Zone Vapor Retarder & Dew-Point Diagram -->
      <div class="col-6 arch-sheet">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">ATLAS-03 · PPD / PDD</span>
            <h3 class="sheet-title">Hygrothermal Vapor Drive &amp; Dew-Point Switcher</h3>
          </div>
          <div style="display:flex;gap:0.35rem;">
            <button class="btn-arch ${state.climateMode === 'cold' ? 'primary' : ''}" style="padding:0.3rem 0.65rem;font-size:0.75rem;" onclick="state.climateMode='cold';renderApp()">CZ 6 Chicago (Cold)</button>
            <button class="btn-arch ${state.climateMode === 'humid' ? 'primary' : ''}" style="padding:0.3rem 0.65rem;font-size:0.75rem;" onclick="state.climateMode='humid';renderApp()">CZ 2 Houston (Hot-Humid)</button>
          </div>
        </div>
        <div class="sheet-body">
          <svg viewBox="0 0 420 165" style="width:100%;height:auto;display:block;border:1px solid var(--hairline);background:var(--bg-canvas);">
            <rect x="20" y="25" width="90" height="115" fill="${state.climateMode === 'cold' ? '#dbeafe' : '#ffedd5'}" />
            <text x="65" y="45" text-anchor="middle" font-family="monospace" font-size="10" font-weight="bold" fill="#1e293b">EXTERIOR</text>
            <text x="65" y="62" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="${state.climateMode === 'cold' ? '#1d4ed8' : '#c2410c'}">${state.climateMode === 'cold' ? '-10°F Dry' : '+95°F Humid'}</text>

            <!-- Wall Assembly Core -->
            <rect x="110" y="25" width="45" height="115" fill="#b45309" fill-opacity="0.25" stroke="#78350f" />
            <text x="132" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="#1e293b">Cladding</text>

            <!-- Exterior Vapor Retarder Position (Hot-Humid) -->
            <rect x="155" y="25" width="14" height="115" fill="${state.climateMode === 'humid' ? '#16a34a' : '#e2e8f0'}" />
            <rect x="169" y="25" width="95" height="115" fill="#fef08a" stroke="#ca8a04" />
            <text x="216" y="80" text-anchor="middle" font-family="monospace" font-size="10" font-weight="bold" fill="#854d0e">THERMAL INSULATION</text>

            <!-- Interior Vapor Retarder Position (Cold Climate) -->
            <rect x="264" y="25" width="14" height="115" fill="${state.climateMode === 'cold' ? '#16a34a' : '#e2e8f0'}" />
            <rect x="278" y="25" width="32" height="115" fill="#cbd5e1" stroke="#475569" />
            <text x="294" y="85" text-anchor="middle" font-family="monospace" font-size="9" fill="#1e293b">Gyp</text>

            <rect x="310" y="25" width="90" height="115" fill="${state.climateMode === 'cold' ? '#ffedd5' : '#dbeafe'}" />
            <text x="355" y="45" text-anchor="middle" font-family="monospace" font-size="10" font-weight="bold" fill="#1e293b">INTERIOR</text>
            <text x="355" y="62" text-anchor="middle" font-family="monospace" font-size="11" font-weight="bold" fill="#0f172a">+70°F Conditioned</text>

            <!-- Vapor Drive Arrow -->
            <text x="210" y="154" text-anchor="middle" font-family="monospace" font-size="10" font-weight="bold" fill="#15803d">
              ${state.climateMode === 'cold'
                ? '← VAPOR DRIVE (INSIDE TO OUTSIDE) · GREEN LAYER = INTERIOR VAPOR RETARDER'
                : '→ VAPOR DRIVE (OUTSIDE TO INSIDE) · GREEN LAYER = EXTERIOR VAPOR RETARDER'}
            </text>
          </svg>
        </div>
      </div>

      <!-- Simulator 4: Spaced-Repetition Flashcards & AI Tutor -->
      <div class="col-6 arch-sheet">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">FLASH-${(state.fcIdx % db.flashcards.length) + 1}/${db.flashcards.length}</span>
            <h3 class="sheet-title">Active-Recall Spaced Repetition Deck</h3>
          </div>
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted)">Click card to flip</span>
        </div>
        <div class="sheet-body" style="display:flex;flex-direction:column;gap:0.9rem;">
          <div class="flashcard-stage" onclick="state.fcFlipped=!state.fcFlipped;renderApp()">
            <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.75rem;">
              <span class="div-code-tag">${esc(card.division)} · ${esc(card.category)}</span>
              <span style="color:var(--accent-cobalt);font-weight:700;">${state.fcFlipped ? 'ANSWER SIDE (CLICK TO FLIP)' : 'PROMPT SIDE (CLICK TO FLIP)'}</span>
            </div>
            <div style="font-family:var(--font-display);font-size:1.45rem;line-height:1.35;margin:1rem 0;">
              ${esc(state.fcFlipped ? card.back : card.front)}
            </div>
            <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted);">↻ Click anywhere on card surface to toggle rationale</div>
          </div>

          <div style="display:flex;justify-content:space-between;">
            <button class="btn-arch" onclick="state.fcIdx=(state.fcIdx-1+db.flashcards.length)%db.flashcards.length;state.fcFlipped=false;renderApp()">← Previous Card</button>
            <button class="btn-arch cobalt" onclick="state.fcFlipped=!state.fcFlipped;renderApp()">Flip Card ↻</button>
            <button class="btn-arch primary" onclick="state.fcIdx=(state.fcIdx+1)%db.flashcards.length;state.fcFlipped=false;renderApp()">Next Card →</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   TAB 05: GOOGLE DRIVE PDF LIBRARY (13 INDEXED STUDY DOCUMENTS)
   ========================================================================== */
function renderLibraryTab() {
  const list = state.resFilter === "ALL"
    ? db.driveResources
    : db.driveResources.filter(r => r.divisions.includes(state.resFilter));

  return `
    <div class="arch-sheet" style="margin-top:1.25rem;padding:1rem 1.35rem;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;">
      <div>
        <h3 style="margin:0;font-family:var(--font-display);font-size:1.5rem;font-weight:400;">Connected Google Drive 'ARE Study' Monograph Library (${db.driveResources.length} PDFs)</h3>
        <p style="margin:0.2rem 0 0;font-size:0.84rem;color:var(--ink-secondary);">Every PDF below has been indexed from your Google Drive folder with direct study syntheses and one-click Drive viewer links.</p>
      </div>
      <div style="display:flex;gap:0.6rem;align-items:center;">
        <select class="arch-select" style="width:auto;" onchange="state.resFilter=this.value;renderApp()">
          <option value="ALL" ${state.resFilter === 'ALL' ? 'selected' : ''}>All 6 Divisions (${db.driveResources.length} PDFs)</option>
          ${db.divisions.map(d => `<option value="${d.code}" ${state.resFilter === d.code ? 'selected' : ''}>${d.code} — ${esc(d.name)}</option>`).join("")}
        </select>
        <a href="${DRIVE_FOLDER_URL}" target="_blank" rel="noopener" class="btn-arch cobalt">Open 'ARE Study' Drive Folder ↗</a>
      </div>
    </div>

    <div class="divisions-matrix">
      ${list.map(r => `
        <article class="division-plate">
          <div class="division-plate-top">
            <div class="division-badge-row">
              <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-terracotta);font-weight:700;">${esc(r.category.toUpperCase())}</span>
              <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted);">${esc(r.size)}</span>
            </div>
            <h4 class="division-name" style="font-size:1.25rem;">${esc(r.title)}</h4>
            <p class="division-desc">${esc(r.summary)}</p>
          </div>
          <div style="padding:0.9rem 1.25rem;background:var(--bg-elevated);border-bottom:1px solid var(--hairline);font-family:var(--font-mono);font-size:0.75rem;line-height:1.55;color:var(--ink-secondary);flex:1;">
            ${esc(r.excerpt)}
          </div>
          <div class="division-plate-foot" style="flex-direction:row;align-items:center;justify-content:space-between;">
            <div style="display:flex;gap:0.3rem;flex-wrap:wrap;">
              ${r.divisions.map(d => `<span class="div-code-tag" style="font-size:0.72rem;padding:0.1rem 0.4rem;">${esc(d)}</span>`).join("")}
            </div>
            <a href="${esc(r.driveUrl)}" target="_blank" rel="noopener" class="btn-arch primary" style="padding:0.4rem 0.8rem;font-size:0.75rem;">Open PDF in Drive ↗</a>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

/* ==========================================================================
   TAB 06: NATIONAL PASS/FAIL STATS & MIDWEST/CENTRAL BOARD NEWS
   ========================================================================== */
function renderStatsTab() {
  const st = db.midwestJurisdictions.find(j => j.code === state.midwestState) || db.midwestJurisdictions[0];

  return `
    <div class="sheet-grid-12">
      <!-- Left: National Pass Rates Matrix -->
      <div class="col-7 arch-sheet">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">NCARB-BTN</span>
            <h3 class="sheet-title">National ARE 5.0 Pass/Fail Statistics by Division</h3>
          </div>
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--ink-muted)">NCARB by the Numbers (2023–2026)</span>
        </div>
        <div class="sheet-body" style="overflow-x:auto;">
          <table class="arch-table">
            <thead>
              <tr>
                <th>Division</th><th>2023</th><th>2024</th><th>2025/26 Nat'l</th><th>1st Attempt</th><th>Midwest Avg</th>
              </tr>
            </thead>
            <tbody>
              ${db.divisions.map(d => `
                <tr>
                  <td><span class="div-code-tag" style="margin-right:0.4rem;">${d.code}</span> <strong>${esc(d.name)}</strong></td>
                  <td style="font-family:var(--font-mono);">${d.passRates['2023']}%</td>
                  <td style="font-family:var(--font-mono);">${d.passRates['2024']}%</td>
                  <td style="font-family:var(--font-mono);font-weight:700;color:var(--accent-cobalt);">${d.passRates['2025']}%</td>
                  <td style="font-family:var(--font-mono);font-weight:700;color:var(--accent-verdigris);">${d.passRates.firstAttempt}%</td>
                  <td style="font-family:var(--font-mono);font-weight:700;">${d.passRates.midwestAvg}%</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right: Midwest / Central State Board & PSI Test Center Tracker -->
      <div class="col-5 arch-sheet">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">MIDWEST-PSI</span>
            <h3 class="sheet-title">Regional Board &amp; PSI Test Centers</h3>
          </div>
          <select class="arch-select" style="width:auto;" onchange="state.midwestState=this.value;renderApp()">
            ${db.midwestJurisdictions.map(j => `<option value="${j.code}" ${j.code === state.midwestState ? 'selected' : ''}>${esc(j.state)}</option>`).join("")}
          </select>
        </div>
        <div class="sheet-body" style="display:flex;flex-direction:column;gap:0.9rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="font-size:1rem;">${esc(st.state)}</strong>
            <span class="status-tag status-pass">State Pass Rate: ${st.passRate}%</span>
          </div>
          <p style="margin:0;font-size:0.86rem;color:var(--ink-secondary);line-height:1.55;">${esc(st.rules)}</p>
          <div style="background:var(--bg-elevated);padding:0.85rem;border:1px solid var(--hairline);font-family:var(--font-mono);font-size:0.76rem;">
            <strong>Active PSI Test Centers:</strong><br/>
            ${esc(st.psiCenters.join(" · "))}
          </div>
          <div style="background:var(--accent-brass-soft);color:var(--accent-brass);padding:0.75rem 0.9rem;font-family:var(--font-mono);font-size:0.76rem;font-weight:600;">
            📍 Regional Bulletin: ${esc(st.alert)}
          </div>
        </div>
      </div>

      <!-- Weekly NCARB News Feed -->
      <div class="col-12 arch-sheet">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">BULLETIN</span>
            <h3 class="sheet-title">Weekly NCARB Examination &amp; Licensure News</h3>
          </div>
        </div>
        <div class="sheet-body">
          <div class="divisions-matrix">
            ${db.newsFeed.map(n => `
              <div style="border:1px solid var(--hairline-strong);padding:1.1rem;background:var(--bg-canvas);display:flex;flex-direction:column;gap:0.45rem;">
                <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:0.75rem;">
                  <span style="color:var(--accent-terracotta);font-weight:700;">${esc(n.tag)}</span>
                  <span style="color:var(--ink-muted)">${esc(n.date)}</span>
                </div>
                <h4 style="margin:0;font-family:var(--font-display);font-size:1.25rem;font-weight:400;">${esc(n.title)}</h4>
                <p style="margin:0;font-size:0.84rem;color:var(--ink-secondary);line-height:1.55;">${esc(n.summary)}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   INTERACTIVE HANDLERS & MODALS
   ========================================================================== */
window.switchTab = function(tab) {
  state.tab = tab;
  renderApp();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.launchDivisionSim = function(code) {
  state.simDivision = code;
  state.simLegacy = "ALL";
  state.simType = "ALL";
  state.simItems = db.questions.filter(q => q.division === code);
  state.simIdx = 0;
  state.simReport = null;
  state.tab = "simulator";
  renderApp();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.applySimFilters = function() {
  state.simDivision = document.getElementById("sim-flt-div").value;
  state.simLegacy = document.getElementById("sim-flt-leg").value;
  state.simType = document.getElementById("sim-flt-type").value;
  let pool = [...db.questions];
  if (state.simDivision !== "ALL") pool = pool.filter(q => q.division === state.simDivision);
  if (state.simLegacy !== "ALL") pool = pool.filter(q => q.legacyExam === state.simLegacy);
  if (state.simType !== "ALL") pool = pool.filter(q => q.type === state.simType);
  state.simItems = pool.length ? pool : [...db.questions];
  state.simIdx = 0;
  state.simReport = null;
  renderApp();
};

window.selectSimOption = function(qid, oid, type) {
  if (type === "mc") state.simAnswers[qid] = [oid];
  else {
    const s = new Set(Array.isArray(state.simAnswers[qid]) ? state.simAnswers[qid] : []);
    if (s.has(oid)) s.delete(oid); else s.add(oid);
    state.simAnswers[qid] = Array.from(s);
  }
  renderApp();
};

window.toggleSimStrike = function(qid, oid) {
  const s = new Set(state.simStrikes[qid] || []);
  if (s.has(oid)) s.delete(oid); else s.add(oid);
  state.simStrikes[qid] = Array.from(s);
  renderApp();
};

window.placeHotspotPin = function(e, qid) {
  const svg = e.currentTarget.querySelector("svg");
  const r = svg.getBoundingClientRect();
  const x = Number((((e.clientX - r.left) / r.width) * 100).toFixed(1));
  const y = Number((((e.clientY - r.top) / r.height) * 70).toFixed(1));
  state.simAnswers[qid] = { x, y };
  renderApp();
};

window.setDragMatch = function(qid, tid, val) {
  state.simAnswers[qid] = { ...(state.simAnswers[qid] || {}), [tid]: val };
  renderApp();
};

window.toggleFlag = function(qid) {
  state.simFlags[qid] = !state.simFlags[qid];
  renderApp();
};

window.revealCurrentItem = function(qid) {
  state.simRevealed[qid] = true;
  renderApp();
};

window.stepSimItem = function(dir) {
  const n = state.simIdx + dir;
  if (n >= 0 && n < state.simItems.length) {
    state.simIdx = n;
    state.simCaseTab = 0;
    renderApp();
  }
};

window.scoreExamSession = function() {
  let corr = 0;
  state.simItems.forEach(q => {
    state.simRevealed[q.id] = true;
    if (evaluateItem(q, state.simAnswers[q.id])) corr++;
  });
  const total = state.simItems.length || 1;
  const accuracy = Number(((corr / total) * 100).toFixed(1));
  const scaledScore = Math.min(800, Math.max(100, Math.round(220 + (accuracy / 100) * 500)));
  state.simReport = { total, correct: corr, accuracy, scaledScore, passed: scaledScore >= 550 };
  renderApp();
};

window.runSampleTask = function(txt) {
  state.axpSuggestion = classifyWorkTask(txt);
  renderApp();
  const el = document.getElementById("axp-task-input");
  if (el) el.value = txt;
};

window.analyzeAxpTaskInput = function() {
  const txt = document.getElementById("axp-task-input")?.value || "";
  state.axpSuggestion = classifyWorkTask(txt);
  renderApp();
  const el = document.getElementById("axp-task-input");
  if (el) el.value = txt;
};

window.recordAxpWorkLog = function() {
  const txt = document.getElementById("axp-task-input")?.value?.trim() || "Architectural project task";
  const proj = document.getElementById("axp-proj-input")?.value || "Studio Project";
  const hrs = Number(document.getElementById("axp-hrs-input")?.value || 8);
  const sug = classifyWorkTask(txt);

  db.axpData.workLogs.unshift({
    id: `AXP-${100 + db.axpData.workLogs.length + 1}`,
    date: "2026-11-06",
    project: proj,
    setting: "Setting A",
    description: txt,
    area: sug.primary.code,
    competency: sug.primary.competency,
    hours: hrs,
    credit: "100% (<1 yr)",
    status: "Approved"
  });

  const area = db.axpData.areas.find(a => a.code === sug.primary.code);
  if (area) {
    area.approvedSettingA = Number((area.approvedSettingA + hrs).toFixed(1));
    area.totalLogged = Number((area.totalLogged + hrs).toFixed(1));
  }
  saveAxpState();
  renderApp();
};

window.exportAxpCsv = function() {
  const rows = [["Entry_ID", "Date", "Project", "Setting", "Description", "AXP_Area", "Hours", "Status"]];
  db.axpData.workLogs.forEach(l => rows.push([l.id, l.date, `"${l.project}"`, l.setting, `"${l.description}"`, l.area, l.hours, l.status]));
  const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "MyNCARB_AXP_Experience_Ledger.csv";
  a.click();
};

window.openCalculatorModal = function() {
  const m = document.getElementById("modal-root");
  m.innerHTML = `
    <div class="arch-modal-backdrop" onclick="document.getElementById('modal-root').innerHTML=''">
      <div class="arch-modal-window" onclick="event.stopPropagation()">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">CALC</span>
            <h3 class="sheet-title">NCARB / PSI Scientific &amp; Ratio Calculator</h3>
          </div>
          <button class="btn-arch" onclick="document.getElementById('modal-root').innerHTML=''">Close ✕</button>
        </div>
        <div class="sheet-body" style="display:flex;flex-direction:column;gap:0.9rem;">
          <input id="calc-expr" type="text" class="arch-input" style="font-family:var(--font-mono);font-size:1.1rem;" placeholder="e.g. 4200000 / 1400000" oninput="try{document.getElementById('calc-res').textContent='= '+Function('return ('+this.value.replace(/[^0-9+\\-*/().]/g,'')+')')()}catch{}" />
          <div id="calc-res" style="padding:0.85rem;background:var(--bg-psi-chrome);color:#fff;font-family:var(--font-mono);font-size:1.25rem;font-weight:700;">= 0</div>
          <div style="font-family:var(--font-mono);font-size:0.76rem;color:var(--ink-secondary);line-height:1.6;">
            • <strong>Net Multiplier</strong> = Net Operating Revenue ÷ Direct Labor<br/>
            • <strong>Overhead Rate</strong> = Total Indirect Expenses ÷ Direct Labor<br/>
            • <strong>Break-Even Multiplier</strong> = 1.0 + Overhead Rate<br/>
            • <strong>Max Gross Floor Area (GFA)</strong> = FAR × Total Lot Area<br/>
            • <strong>Sabine Reverberation Time</strong>: RT60 = 0.049 × V ÷ A
          </div>
        </div>
      </div>
    </div>
  `;
};

window.openWhiteboardModal = function() {
  const m = document.getElementById("modal-root");
  m.innerHTML = `
    <div class="arch-modal-backdrop" onclick="document.getElementById('modal-root').innerHTML=''">
      <div class="arch-modal-window" onclick="event.stopPropagation()">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">SCRATCHPAD</span>
            <h3 class="sheet-title">PSI Digital Whiteboard &amp; Calculation Pad</h3>
          </div>
          <button class="btn-arch" onclick="document.getElementById('modal-root').innerHTML=''">Close ✕</button>
        </div>
        <div class="sheet-body">
          <textarea rows="8" class="arch-textarea" style="font-family:var(--font-mono);font-size:0.82rem;" placeholder="Use this digital scratchpad for CPM critical path float calculations, G702 retainage math, or zoning setback checks..."></textarea>
        </div>
      </div>
    </div>
  `;
};

window.openReferenceModal = function() {
  const m = document.getElementById("modal-root");
  m.innerHTML = `
    <div class="arch-modal-backdrop" onclick="document.getElementById('modal-root').innerHTML=''">
      <div class="arch-modal-window" onclick="event.stopPropagation()">
        <div class="sheet-header">
          <div class="sheet-title-group">
            <span class="sheet-code">REF</span>
            <h3 class="sheet-title">AIA Contract Documents &amp; IBC Quick Reference</h3>
          </div>
          <button class="btn-arch" onclick="document.getElementById('modal-root').innerHTML=''">Close ✕</button>
        </div>
        <div class="sheet-body" style="font-family:var(--font-mono);font-size:0.78rem;line-height:1.65;">
          <div><strong>AIA B101:</strong> Owner–Architect Agreement (Article 5: Owner furnishes survey &amp; geotech)</div>
          <div><strong>AIA A201:</strong> General Conditions of the Contract for Construction (§ 3.12 Shop Drawings)</div>
          <div><strong>AIA C401:</strong> Architect–Consultant Agreement (Structural, MEP, Civil)</div>
          <div><strong>AIA G701:</strong> Change Order (Requires Owner + Architect + Contractor signatures)</div>
          <div><strong>AIA G710:</strong> Architect's Supplemental Instructions (Minor clarification, NO cost/time change; Architect signs alone)</div>
          <div><strong>AIA G714:</strong> Construction Change Directive (Owner + Architect sign when cost/time is disputed)</div>
        </div>
      </div>
    </div>
  `;
};

// Boot
if (window.__ATELIER_DB__) {
  initData(window.__ATELIER_DB__);
} else {
  fetch("data/portal_db.json")
    .then(r => r.json())
    .then(d => initData(d))
    .catch(() => {});
}
