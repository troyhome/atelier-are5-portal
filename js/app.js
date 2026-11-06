/* ==========================================================================
   ATELIER ARE 5.0 — PURPOSE-DRIVEN ENGINE + MYNCARB SYNC
   ========================================================================== */

const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1bLGH_YofHmm9wYqN4Vzu7RJ3PuEuocV_lL7DidNsJwQ/edit";
const DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1byu3GdNMRKkKVPfkb-XYmMLPF1pIOxr3";
const MYNCARB_EXP_URL = "https://my.ncarb.org/apps/experience";

let db = window.__ATELIER_DB__ || null;

const CAD_PLATES = {
  PcM: {
    title: "PRACTICE FINANCIAL MULTIPLIER SYSTEM",
    scale: "RATIO 3.00x",
    dims: ["2.1m", "140mm", "35mm"],
    labels: [
      "NET OPERATING REVENUE (NOR ÷ DL = 3.00x)",
      "DIRECT BILLABLE LABOR ($1.40M BASE)",
      "INDIRECT OVERHEAD (1.50x OVERHEAD RATE)",
      "BREAK-EVEN MULTIPLIER (1 + OH = 2.50x)",
      "NET PROFIT TARGET (+16.7% MARGIN)"
    ]
  },
  PjM: {
    title: "CRITICAL PATH & AIA CONTRACT SYSTEM",
    scale: "AIA B101 / A201",
    dims: ["2.1m", "140mm", "35mm"],
    labels: [
      "AIA B101 OWNER-ARCHITECT AGREEMENT",
      "AIA C401 STRUCTURAL / MEP CONSULTANTS",
      "CRITICAL PATH (ZERO FLOAT = 0 DAYS)",
      "AIA G714 CONSTRUCTION CHANGE DIRECTIVE",
      "AIA G701 CHANGE ORDER (3 SIGNATURES)"
    ]
  },
  PA: {
    title: "SITE GRADING & ZONING FAR ENVELOPE",
    scale: "1\" = 20'-0\"",
    dims: ["2.1m", "140mm", "35mm"],
    labels: [
      "MAX GFA = FAR × TOTAL LOT AREA",
      "PROPERTY LINE & 10'-0\" FRONT SETBACK",
      "DIVERSION SWALE (MIN 2.0% DRAINAGE)",
      "SOUTH HORIZONTAL LOUVER OVERHANG",
      "PHASE I ESA (ASTM E1527) SITE BOUNDARY"
    ]
  },
  PPD: {
    title: "LONG-SPAN STEEL & HVAC SYSTEM",
    scale: "1/2\" = 1'-0\"",
    dims: ["2.1m", "140mm", "35mm"],
    labels: [
      "WIDE-FLANGE STEEL GIRDER (E = 29,000 KSI)",
      "MOMENT OF INERTIA (I) DEFLECTION CONTROL",
      "DEDICATED OUTDOOR AIR SYSTEM (DOAS)",
      "ACOUSTICAL ABSORPTION PLENUM BAFFLE",
      "2-HOUR FIRE BARRIER SHAFT ENCLOSURE"
    ]
  },
  PDD: {
    title: "HIGH-RISE FACADE SYSTEM",
    scale: "1m",
    dims: ["2.1m", "140mm", "35mm"],
    labels: [
      "PRECAST CONCRETE PANEL",
      "INSULATION",
      "TRIPLE GLAZING",
      "ALUMINUM FRAMING",
      "ANCHOR"
    ]
  },
  CE: {
    title: "EXTERIOR MASONRY FLASHING & WEEP DETAIL",
    scale: "3\" = 1'-0\"",
    dims: ["2.1m", "140mm", "35mm"],
    labels: [
      "FACE BRICK VENEER & MORTAR JOINT",
      "2\" CLEAR DRAINAGE AIR CAVITY",
      "STAINLESS THROUGH-WALL FLASHING & DRIP",
      "WEEP HOLES @ 24\" O.C. ABOVE STEEL LINTEL",
      "INTERIOR WARM-SIDE VAPOR RETARDER"
    ]
  }
};

const state = {
  theme: localStorage.getItem("atelier_theme_v4") || "light",
  tab: "overview",
  activeDiv: "PDD", // Default to PDD where user has 488.25 hours + High-Rise Facade System plate
  examPool: [],
  examIdx: 0,
  examLegacy: "ALL",
  examAnswers: {},
  examRevealed: {},
  examStrikes: {},
  examCaseTab: 0,
  axpTaskInput: "Reviewed contractor submittal log, curtain wall shop drawings, and issued ASI #4",
  axpProject: "Indiana Civic Renovation",
  axpHours: 8.0,
  axpSuggestion: null,
  midwestState: "IN"
};

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initPortal() {
  if (!db) return;
  try {
    const savedAreas = localStorage.getItem("atelier_myncarb_areas_v4");
    const savedLogs = localStorage.getItem("atelier_myncarb_logs_v4");
    if (savedAreas) db.axpData.areas = JSON.parse(savedAreas);
    if (savedLogs) db.axpData.workLogs = JSON.parse(savedLogs);
  } catch (e) {}
  document.documentElement.setAttribute("data-theme", state.theme);
  filterExamPool();
  render();
}

function saveAxpToStorage() {
  try {
    localStorage.setItem("atelier_myncarb_areas_v4", JSON.stringify(db.axpData.areas));
    localStorage.setItem("atelier_myncarb_logs_v4", JSON.stringify(db.axpData.workLogs));
  } catch (e) {}
}

window.toggleTheme = function() {
  state.theme = state.theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", state.theme);
  localStorage.setItem("atelier_theme_v4", state.theme);
  render();
};

function filterExamPool() {
  let pool = db.questions.filter(q => q.division === state.activeDiv);
  if (state.examLegacy !== "ALL") {
    pool = db.questions.filter(q => q.legacyExam === state.examLegacy);
  }
  state.examPool = pool.length ? pool : [...db.questions];
  state.examIdx = 0;
}

window.selectDivision = function(code) {
  state.activeDiv = code;
  filterExamPool();
  render();
};

window.switchTopTab = function(tab) {
  state.tab = tab;
  render();
};

/* ==========================================================================
   MASTER RENDER
   ========================================================================== */
function render() {
  if (!db) return;
  const root = document.getElementById("app-root");
  const focusDiv = db.divisions.find(d => d.code === state.activeDiv) || db.divisions[0];
  const totalApproved = Number(db.axpData.areas.reduce((s, a) => s + Number(a.totalLogged || 0), 0).toFixed(2));
  const totalReq = 3740;
  const totalRem = Number((totalReq - totalApproved).toFixed(2));

  root.innerHTML = `
    <div class="atelier-frame">
      <!-- ROW 1: SLIM MASTHEAD (NO BLOAT ABOVE TABS) -->
      <header class="masthead-row">
        <div class="masthead-icon-cell" aria-hidden="true">☰</div>
        <div class="masthead-brand-cell">
          <h1 class="masthead-brand-title">ATELIER ARE 5.0</h1>
          <div class="masthead-status-strip">
            <span>AXP TOTAL: <strong>${totalApproved.toLocaleString()} / 3,740 HRS</strong> (${totalRem.toLocaleString()} REM)</span>
            <span>JURISDICTION: <strong>INDIANA</strong></span>
          </div>
        </div>
        <div class="masthead-utils">
          <button class="util-cell-btn" onclick="openMyNcarbSyncModal()" title="Sign in to MyNCARB or update synced AXP hours">
            <span class="sync-dot"></span> MYNCARB SYNC
          </button>
          <a href="${GOOGLE_SHEET_URL}" target="_blank" rel="noopener" class="util-cell-btn" title="Open Synced Google Sheet">
            SHEET ↗
          </a>
          <button class="util-cell-btn" onclick="toggleTheme()" title="Toggle Warm Vellum / Dark Mode">
            ${state.theme === 'light' ? '☾' : '☀'}
          </button>
        </div>
      </header>

      <!-- ROW 2: SUBNAV BAR -->
      <div class="subnav-row">
        <div class="subnav-empty-cell"></div>
        <div class="subnav-division-hdr">DIVISION</div>
        <div class="subnav-spacer">
          ${focusDiv.code} — ${esc(focusDiv.name)} · ${focusDiv.totalItems} Items (${focusDiv.testDurationDisplay}) · Nat'l Pass: ${focusDiv.passRates['2025']}%
        </div>
        <nav class="subnav-tabs" aria-label="Workspace Views">
          <button id="tab-overview" class="subnav-tab-btn ${state.tab === 'overview' ? 'active' : ''}" onclick="switchTopTab('overview')">OVERVIEW</button>
          <button id="tab-exam" class="subnav-tab-btn ${state.tab === 'exam' ? 'active' : ''}" onclick="switchTopTab('exam')">PRACTICE EXAM</button>
          <button id="tab-axp" class="subnav-tab-btn ${state.tab === 'axp' ? 'active' : ''}" onclick="switchTopTab('axp')">AXP HOURS</button>
          <button id="tab-archive" class="subnav-tab-btn ${state.tab === 'archive' ? 'active' : ''}" onclick="switchTopTab('archive')">ARCHIVE</button>
        </nav>
      </div>

      <!-- ROW 3: LEFT 6-DIVISION SPINE + ACTIVE VIEW -->
      <div class="workspace-row">
        <aside class="division-spine" aria-label="Six ARE 5.0 Divisions">
          ${db.divisions.map(d => {
            const isAct = state.activeDiv === d.code;
            const axpArea = db.axpData.areas.find(a => a.code === d.code) || { totalLogged: 0, requiredHours: d.axpRequiredHours };
            return `
              <button class="spine-row ${isAct ? 'active' : ''}" onclick="selectDivision('${d.code}')">
                <div class="spine-num">${d.number}</div>
                <div class="spine-content">
                  <div class="spine-code">${d.code}</div>
                  <div class="spine-title">${esc(d.name)}</div>
                  <div class="spine-axp-mini">AXP: ${axpArea.totalLogged} / ${axpArea.requiredHours}h</div>
                </div>
              </button>
            `;
          }).join("")}
          <div class="spine-footer">
            <span>⠿ INDIANA PLA</span>
            <span>550 CUT</span>
          </div>
        </aside>

        <main>
          ${state.tab === "overview" ? renderCalmOverview(focusDiv, totalApproved, totalRem) : ""}
          ${state.tab === "exam" ? renderCalmExam(focusDiv) : ""}
          ${state.tab === "axp" ? renderCalmAxp(totalApproved, totalRem) : ""}
          ${state.tab === "archive" ? renderCalmArchive(focusDiv) : ""}
        </main>
      </div>
    </div>
  `;
}

/* ==========================================================================
   VIEW 1: CALM 3-PANE OVERVIEW (EXACT MATCH TO ATTACHED AESTHETIC + REAL AXP)
   ========================================================================== */
function renderCalmOverview(focusDiv, totalApproved, totalRem) {
  const plate = CAD_PLATES[focusDiv.code] || CAD_PLATES.PDD;

  return `
    <div class="overview-grid">
      <!-- LEFT PANE: DIVISION PROFICIENCY HATCHED RADAR -->
      <section class="pane-left-radar">
        <div class="pane-heading">
          <span>DIVISION PROFICIENCY</span>
          <span style="font-family:var(--font-mono);font-size:0.74rem;color:var(--ink-muted);font-weight:500;">CLICK ANY AXIS TO SELECT</span>
        </div>

        <div style="margin:auto 0;padding:0.25rem 0;">
          ${buildHatchedRadarSvg()}
        </div>

        <div style="border-top:var(--rule);padding-top:0.8rem;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.75rem;">
          <div style="font-family:var(--font-mono);font-size:0.76rem;">
            <strong>${focusDiv.code} READINESS:</strong> ${focusDiv.readinessScaledScore} / 800 SCALED
          </div>
          <button class="swiss-btn terracotta" onclick="switchTopTab('exam')">
            PRACTICE ${focusDiv.code} EXAM (${db.questions.filter(q => q.division === focusDiv.code).length} Qs) →
          </button>
        </div>
      </section>

      <!-- RIGHT STACK: TOP ORTHOGRAPHIC CAD PLATE + BOTTOM AXP STATUS -->
      <div class="pane-right-stack">
        <!-- TOP-RIGHT PANE: HIGH-PRECISION ORTHOGRAPHIC CAD PLATE -->
        <section class="pane-top-cad">
          <div class="pane-heading">
            <span>${esc(plate.title)}</span>
            <span style="font-family:var(--font-mono);font-size:0.74rem;color:var(--ink-muted);">${focusDiv.code} PLATE</span>
          </div>

          <div style="margin:0.2rem 0;">
            ${buildFacadeCadSvg(plate)}
          </div>
        </section>

        <!-- BOTTOM-RIGHT PANE: CURRENT AXP STATUS (USER'S ACTUAL MYNCARB HOURS) -->
        <section class="pane-bottom-axp">
          <div>
            <div class="pane-heading">
              <span>CURRENT AXP STATUS (MYNCARB)</span>
              <span style="font-family:var(--font-sans);font-size:0.9rem;font-weight:500;text-transform:none;">3,740 hours required</span>
            </div>

            <table class="axp-clean-table">
              <tbody>
                ${db.axpData.areas.map((a, idx) => {
                  const pct = Math.min(100, ((a.totalLogged / a.requiredHours) * 100)).toFixed(1);
                  const barWidth = Math.max(2, Math.round((a.totalLogged / a.requiredHours) * 100));
                  const color = idx === 4 || idx === 0 ? "var(--terracotta)" : "var(--cobalt)";
                  return `
                    <tr>
                      <td class="lbl">${esc(a.code)}</td>
                      <td class="bar-cell">
                        <div style="width:100%;height:12px;background:var(--vellum-tab);">
                          <div style="width:${barWidth}%;height:100%;background:${color};"></div>
                        </div>
                      </td>
                      <td class="pct-cell">${pct}%</td>
                      <td class="hrs-cell"><strong>${a.totalLogged}</strong> / ${a.requiredHours}</td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>

          <div class="axp-summary-footer">
            <div>
              <h2 class="axp-serif-callout">
                AXP PROGRESS:<br/>
                ${totalApproved.toLocaleString()} / 3,740 HOURS<br/>
                APPROVED
              </h2>
              <div style="font-size:0.75rem;color:var(--ink-muted);margin-top:0.25rem;display:flex;gap:0.75rem;align-items:center;">
                <span>${totalRem.toLocaleString()} hrs remaining · 0 submitted</span>
                <button class="swiss-btn" style="padding:0.22rem 0.6rem;font-size:0.75rem;" onclick="openMyNcarbSyncModal()">SYNC / EDIT HOURS</button>
              </div>
            </div>

            <!-- Compact Remaining Breakdown (Right side of AXP Footer) -->
            <div style="border-left:var(--rule);padding-left:0.85rem;font-family:var(--font-mono);font-size:0.72rem;">
              ${db.axpData.areas.map(a => {
                const rem = Number((a.requiredHours - a.totalLogged).toFixed(2));
                return `
                  <div style="display:flex;justify-content:space-between;padding:0.14rem 0;border-bottom:var(--rule-subtle);">
                    <span><strong>${a.code}</strong> Rem:</span>
                    <span>${rem.toLocaleString()} hrs</span>
                  </div>
                `;
              }).join("")}
              <div style="display:flex;justify-content:space-between;padding-top:0.2rem;color:var(--ink-muted);font-size:0.68rem;">
                <span>INDIANA PLA</span><span>NO EXTRA REQ</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

function buildHatchedRadarSvg() {
  const divs = db.divisions;
  const cx = 220, cy = 182, maxR = 132;
  const angles = divs.map((_, i) => (-Math.PI / 2) + (i * 2 * Math.PI / divs.length));

  const pt = (angle, ratio) => [
    cx + ratio * maxR * Math.cos(angle),
    cy + ratio * maxR * Math.sin(angle)
  ];

  const outerPts = angles.map(a => pt(a, 1).map(n => n.toFixed(1)).join(",")).join(" ");
  const midPts = angles.map(a => pt(a, 0.6875).map(n => n.toFixed(1)).join(",")).join(" ");

  let sectorHatch = "";
  for (let s = 1; s <= 16; s++) {
    const r = s / 16;
    const ringPts = angles.map(a => pt(a, r).map(n => n.toFixed(1)).join(",")).join(" ");
    sectorHatch += `<polygon points="${ringPts}" fill="none" stroke="var(--ink)" stroke-width="0.35" stroke-opacity="0.35" />`;
  }

  const spokesSvg = divs.map((d, i) => {
    const [x, y] = pt(angles[i], 1);
    const lx = cx + (maxR + 30) * Math.cos(angles[i]);
    const ly = cy + (maxR + 25) * Math.sin(angles[i]);
    const pct = Math.round((d.readinessScaledScore / 800) * 100);
    return `
      <line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="var(--ink)" stroke-width="1.15" />
      <g style="cursor:pointer" onclick="selectDivision('${d.code}')">
        <text x="${lx.toFixed(1)}" y="${(ly - 5).toFixed(1)}" text-anchor="middle" font-family="var(--font-sans)" font-size="13.5" font-weight="600" fill="var(--ink)">${d.code}</text>
        <text x="${lx.toFixed(1)}" y="${(ly + 10).toFixed(1)}" text-anchor="middle" font-family="var(--font-sans)" font-size="12.5" font-weight="500" fill="var(--ink)">${pct}%</text>
      </g>
    `;
  }).join("");

  const polyPts = divs.map((d, i) => {
    const ratio = Math.max(0.25, Math.min(0.95, d.readinessScaledScore / 800));
    return pt(angles[i], ratio).map(n => n.toFixed(1)).join(",");
  }).join(" ");

  return `
    <svg viewBox="0 0 440 364" style="width:100%;max-height:385px;height:auto;display:block;margin:0 auto;">
      ${sectorHatch}
      <polygon points="${outerPts}" fill="none" stroke="var(--ink)" stroke-width="1.4" />
      <polygon points="${midPts}" fill="none" stroke="var(--ink)" stroke-width="0.85" stroke-dasharray="4,3" />
      ${spokesSvg}
      <polygon points="${polyPts}" fill="rgba(41, 72, 184, 0.1)" stroke="var(--cobalt)" stroke-width="2.4" />
    </svg>
  `;
}

function buildFacadeCadSvg(plate) {
  return `
    <svg viewBox="0 0 490 205" style="width:100%;max-height:215px;height:auto;display:block;">
      <defs>
        <pattern id="cad-concrete" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.6" fill="var(--ink)" />
          <circle cx="6" cy="5" r="0.5" fill="var(--ink)" />
          <path d="M 4 1 L 5 2 L 3.5 2.5 Z" fill="none" stroke="var(--ink)" stroke-width="0.35" />
        </pattern>
      </defs>

      <!-- Top Architectural Dimension String -->
      <line x1="78" y1="22" x2="232" y2="22" stroke="var(--ink)" stroke-width="0.85" />
      <line x1="84" y1="16" x2="84" y2="30" stroke="var(--ink)" stroke-width="0.85" />
      <line x1="80" y1="26" x2="88" y2="18" stroke="var(--ink)" stroke-width="1" />
      <line x1="142" y1="16" x2="142" y2="30" stroke="var(--ink)" stroke-width="0.85" />
      <line x1="138" y1="26" x2="146" y2="18" stroke="var(--ink)" stroke-width="1" />
      <line x1="188" y1="16" x2="188" y2="30" stroke="var(--ink)" stroke-width="0.85" />
      <line x1="184" y1="26" x2="192" y2="18" stroke="var(--ink)" stroke-width="1" />
      <line x1="226" y1="16" x2="226" y2="30" stroke="var(--ink)" stroke-width="0.85" />
      <line x1="222" y1="26" x2="230" y2="18" stroke="var(--ink)" stroke-width="1" />

      <text x="113" y="13" text-anchor="middle" font-family="var(--font-condensed)" font-size="11" font-weight="600" fill="var(--ink)">${esc(plate.dims[0])}</text>
      <text x="165" y="13" text-anchor="middle" font-family="var(--font-condensed)" font-size="11" font-weight="600" fill="var(--ink)">${esc(plate.dims[1])}</text>
      <text x="209" y="13" text-anchor="middle" font-family="var(--font-condensed)" font-size="11" font-weight="600" fill="var(--ink)">${esc(plate.dims[2])}</text>

      <!-- Left Vertical Dimension -->
      <line x1="64" y1="34" x2="64" y2="185" stroke="var(--ink)" stroke-width="0.85" />
      <line x1="60" y1="38" x2="68" y2="30" stroke="var(--ink)" stroke-width="1" />
      <line x1="60" y1="189" x2="68" y2="181" stroke="var(--ink)" stroke-width="1" />
      <text x="54" y="110" text-anchor="middle" transform="rotate(-90 54 110)" font-family="var(--font-condensed)" font-size="11.5" font-weight="600" fill="var(--ink)">2.1m</text>

      <!-- Wall Layers -->
      <rect x="84" y="34" width="58" height="151" fill="url(#cad-concrete)" stroke="var(--ink)" stroke-width="1.2" />
      <rect x="142" y="34" width="46" height="151" fill="var(--vellum-hover)" stroke="var(--ink)" stroke-width="1" />
      <path d="M 142 34 L 188 59 L 142 84 L 188 109 L 142 134 L 188 159 L 142 185" fill="none" stroke="var(--ink)" stroke-width="0.65" />
      <path d="M 188 34 L 142 59 L 188 84 L 142 109 L 188 134 L 142 159 L 188 185" fill="none" stroke="var(--ink)" stroke-width="0.65" />
      <rect x="188" y="34" width="18" height="151" fill="var(--vellum-light)" stroke="var(--ink)" stroke-width="0.85" />
      <rect x="206" y="34" width="20" height="151" fill="rgba(41,72,184,0.12)" stroke="var(--ink)" stroke-width="1.15" />

      <rect x="102" y="132" width="104" height="8" fill="var(--vellum-tab)" stroke="var(--ink)" stroke-width="1.1" />
      <rect x="196" y="122" width="32" height="26" fill="none" stroke="var(--ink)" stroke-width="1.4" />

      <!-- 5 Callout Leaders -->
      <circle cx="128" cy="54" r="2" fill="var(--ink)" />
      <line x1="128" y1="54" x2="250" y2="54" stroke="var(--ink)" stroke-width="0.85" />
      <text x="256" y="57" font-family="var(--font-condensed)" font-size="11.5" font-weight="600" letter-spacing="0.02em" fill="var(--ink)">${esc(plate.labels[0])}</text>

      <circle cx="165" cy="78" r="2" fill="var(--ink)" />
      <line x1="165" y1="78" x2="250" y2="78" stroke="var(--ink)" stroke-width="0.85" />
      <text x="256" y="81" font-family="var(--font-condensed)" font-size="11.5" font-weight="600" letter-spacing="0.02em" fill="var(--ink)">${esc(plate.labels[1])}</text>

      <circle cx="216" cy="102" r="2" fill="var(--ink)" />
      <line x1="216" y1="102" x2="250" y2="102" stroke="var(--ink)" stroke-width="0.85" />
      <text x="256" y="105" font-family="var(--font-condensed)" font-size="11.5" font-weight="600" letter-spacing="0.02em" fill="var(--ink)">${esc(plate.labels[2])}</text>

      <circle cx="226" cy="126" r="2" fill="var(--ink)" />
      <line x1="226" y1="126" x2="250" y2="126" stroke="var(--ink)" stroke-width="0.85" />
      <text x="256" y="129" font-family="var(--font-condensed)" font-size="11.5" font-weight="600" letter-spacing="0.02em" fill="var(--ink)">${esc(plate.labels[3])}</text>

      <circle cx="148" cy="136" r="2" fill="var(--ink)" />
      <line x1="148" y1="136" x2="250" y2="150" stroke="var(--ink)" stroke-width="0.85" />
      <text x="256" y="153" font-family="var(--font-condensed)" font-size="11.5" font-weight="600" letter-spacing="0.02em" fill="var(--ink)">${esc(plate.labels[4])}</text>

      <!-- Bottom-Right Scale Titleblock (Fits comfortably inside 256..475) -->
      <text x="256" y="179" font-family="var(--font-condensed)" font-size="11.5" font-weight="700" fill="var(--ink)">${esc(plate.title)}</text>
      <line x1="256" y1="183" x2="475" y2="183" stroke="var(--ink)" stroke-width="1.1" />
      <text x="256" y="196" font-family="var(--font-condensed)" font-size="11" font-weight="600" fill="var(--ink)">SCALE</text>
      <text x="475" y="196" text-anchor="end" font-family="var(--font-condensed)" font-size="11" font-weight="600" fill="var(--ink)">${esc(plate.scale)}</text>
    </svg>
  `;
}

/* ==========================================================================
   VIEW 2: CALM PRACTICE EXAM SIMULATOR
   ========================================================================== */
function renderCalmExam(focusDiv) {
  const q = state.examPool[state.examIdx % state.examPool.length] || db.questions[0];
  const cs = q.caseStudyId ? db.caseStudies.find(c => c.id === q.caseStudyId) : null;
  const ans = state.examAnswers[q.id];
  const rev = Boolean(state.examRevealed[q.id]);
  const struck = new Set(state.examStrikes[q.id] || []);

  return `
    <div class="exam-split">
      <section class="exam-left-pane">
        <div>
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.75rem;border-bottom:var(--rule);padding-bottom:0.75rem;margin-bottom:1.15rem;">
            <div style="font-family:var(--font-condensed);font-size:1.1rem;font-weight:700;letter-spacing:0.03em;">
              ${esc(q.division)} PRACTICE EXAM · ITEM ${state.examIdx + 1} OF ${state.examPool.length}
            </div>
            <select class="swiss-select" style="width:auto;padding:0.25rem 0.6rem;font-family:var(--font-mono);font-size:0.74rem;" onchange="state.examLegacy=this.value;filterExamPool();render()">
              <option value="ALL" ${state.examLegacy === 'ALL' ? 'selected' : ''}>${focusDiv.code} Division Items (${db.questions.filter(x => x.division === focusDiv.code).length})</option>
              <option value="PPP" ${state.examLegacy === 'PPP' ? 'selected' : ''}>Legacy ARE 4.0 PPP Mock Exam</option>
              <option value="CDS" ${state.examLegacy === 'CDS' ? 'selected' : ''}>Legacy ARE 4.0 CDS Mock Exam</option>
            </select>
          </div>

          <div style="font-family:var(--font-mono);font-size:0.74rem;color:var(--ink-muted);margin-bottom:0.55rem;">
            ${esc(q.section)} · Objective ${esc(q.objective)} · Source: ${esc(q.source)}
          </div>

          <div style="font-size:1.02rem;font-weight:500;line-height:1.6;margin-bottom:1.25rem;">
            ${esc(q.stem)}
          </div>

          ${renderExamInputControl(q, ans, rev, struck)}

          ${rev ? `
            <div style="margin-top:1.1rem;padding:1rem;background:var(--vellum-light);border:var(--rule);border-left:4px solid var(--verdigris);font-size:0.86rem;line-height:1.55;">
              <div style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;color:var(--verdigris);margin-bottom:0.3rem;">
                NCARB EXPLANATION &amp; CODE CITATION
              </div>
              <div>${esc(q.explanation)}</div>
              <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-muted);margin-top:0.4rem;">
                Reference: ${esc(q.reference)}
              </div>
            </div>
          ` : ""}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;border-top:var(--rule);padding-top:0.9rem;">
          <button class="swiss-btn" onclick="state.examIdx=(state.examIdx-1+state.examPool.length)%state.examPool.length;render()">← PREVIOUS</button>
          <div style="display:flex;gap:0.55rem;">
            <button class="swiss-btn cobalt" onclick="state.examRevealed['${q.id}']=true;render()">CHECK ANSWER</button>
            <button class="swiss-btn terracotta" onclick="state.examIdx=(state.examIdx+1)%state.examPool.length;render()">NEXT ITEM →</button>
          </div>
        </div>
      </section>

      <aside class="exam-right-pane">
        ${cs ? `
          <div class="pane-heading">
            <span>CASE STUDY EXHIBIT · ${esc(cs.title)}</span>
          </div>
          <p style="margin:0;font-size:0.82rem;color:var(--ink-muted);">${esc(cs.scenario)}</p>
          <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">
            ${cs.resources.map((r, i) => `
              <button class="swiss-btn ${state.examCaseTab === i ? 'terracotta' : ''}" style="font-size:0.74rem;padding:0.3rem 0.65rem;" onclick="state.examCaseTab=${i};render()">
                ${esc(r.title)}
              </button>
            `).join("")}
          </div>
          <div style="border:var(--rule);background:var(--vellum);padding:1rem;font-family:var(--font-mono);font-size:0.76rem;line-height:1.6;white-space:pre-wrap;">${esc((cs.resources[state.examCaseTab] || cs.resources[0]).content)}</div>
        ` : `
          <div class="pane-heading">
            <span>QUICK FORMULA &amp; CODE REFERENCE</span>
            <span>${focusDiv.code}</span>
          </div>
          <div style="border:var(--rule);background:var(--vellum);padding:1rem;font-family:var(--font-mono);font-size:0.76rem;line-height:1.65;">
            <div><strong>Net Multiplier</strong> = Net Operating Revenue ÷ Direct Labor</div>
            <div><strong>Break-Even Rate</strong> = 1.0 + (Indirect Overhead ÷ Direct Labor)</div>
            <div><strong>Max GFA (Zoning)</strong> = FAR × Total Lot Area</div>
            <div><strong>AIA G710 (ASI)</strong> = Minor change, NO cost/time impact</div>
            <div><strong>AIA G714 (CCD)</strong> = Owner + Architect sign when cost disputed</div>
            <div><strong>AIA G701 (CO)</strong> = Owner + Architect + Contractor sign</div>
          </div>

          <div class="pane-heading" style="margin-top:0.4rem;">
            <span>ITEM NAVIGATOR (${state.examPool.length} ITEMS)</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">
            ${state.examPool.map((it, idx) => {
              const isCur = idx === state.examIdx;
              const hasA = state.examAnswers[it.id] !== undefined;
              return `<button class="swiss-btn ${isCur ? 'terracotta' : ''}" style="width:32px;height:30px;padding:0;justify-content:center;font-family:var(--font-mono);font-size:0.74rem;${hasA && !isCur ? 'background:var(--vellum-tab);' : ''}" onclick="state.examIdx=${idx};render()">${idx + 1}</button>`;
            }).join("")}
          </div>
        `}
      </aside>
    </div>
  `;
}

function renderExamInputControl(q, ans, rev, struck) {
  if (q.type === "mc" || q.type === "cata") {
    const sel = new Set(Array.isArray(ans) ? ans : ans ? [ans] : []);
    const corr = new Set(q.correctAnswer || []);
    return `
      <div>
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
            <div class="swiss-opt-row">
              <button class="swiss-opt-btn ${cls} ${isSt ? 'struck' : ''}" onclick="pickExamOption('${q.id}','${o.id}','${q.type}')">
                <strong style="font-family:var(--font-mono);">${esc(o.id)}.</strong>
                <span>${esc(o.text)}</span>
              </button>
              <button class="swiss-btn" style="font-size:0.7rem;padding:0 0.6rem;" onclick="strikeExamOption('${q.id}','${o.id}')">STRIKE</button>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  if (q.type === "fib") {
    return `
      <div style="max-width:360px;border:var(--rule);padding:0.9rem;background:var(--vellum-light);">
        <label style="font-family:var(--font-mono);font-size:0.74rem;display:block;margin-bottom:0.35rem;">ENTER NUMERICAL ANSWER (${esc(q.unit)}):</label>
        <input type="text" class="swiss-input" style="font-family:var(--font-mono);font-size:0.95rem;font-weight:700;" value="${esc(ans ?? '')}" oninput="state.examAnswers['${q.id}']=this.value" />
        ${rev ? `<div style="margin-top:0.4rem;font-family:var(--font-mono);font-size:0.76rem;color:var(--verdigris);font-weight:700;">Accepted Answer: ${esc(q.correctAnswer)}</div>` : ""}
      </div>
    `;
  }

  if (q.type === "hotspot") {
    const pin = ans && typeof ans.x === "number" ? ans : null;
    const z = q.targetZone;
    return `
      <div>
        <div style="font-family:var(--font-mono);font-size:0.74rem;margin-bottom:0.35rem;">CLICK ON THE ARCHITECTURAL DRAWING TO PLACE PIN:</div>
        <div style="border:var(--rule);background:#fff;cursor:crosshair;max-width:520px;" onclick="clickBlueprintPin(event,'${q.id}')">
          <svg viewBox="0 0 100 70" style="width:100%;height:auto;display:block;">
            <rect x="8" y="12" width="84" height="48" fill="#f5f2eb" stroke="#181816" stroke-width="0.6" />
            <rect x="18" y="14" width="24" height="14" fill="#d6d0c4" stroke="#181816" stroke-width="0.8" />
            <text x="20" y="22" font-size="2.6" font-family="monospace">GARAGE 102.5'</text>
            <path d="M 8 34 Q 52 50 92 32" fill="none" stroke="#c85a32" stroke-width="0.9" />
            <rect x="44" y="42" width="26" height="15" fill="#e5e0d5" stroke="#181816" stroke-width="0.9" />
            <text x="46" y="51" font-size="2.6" font-family="monospace">ADDITION 90.0'</text>
            ${rev ? `<rect x="${z.xMin}" y="${z.yMin}" width="${z.xMax - z.xMin}" height="${z.yMax - z.yMin}" fill="rgba(29,107,72,0.25)" stroke="#1d6b48" stroke-width="0.9" />` : ""}
            ${pin ? `<circle cx="${pin.x}" cy="${pin.y}" r="2.6" fill="#c85a32" stroke="#fff" stroke-width="0.6" />` : ""}
          </svg>
        </div>
      </div>
    `;
  }

  if (q.type === "drag") {
    const cur = ans && typeof ans === "object" ? ans : {};
    return `
      <div style="display:flex;flex-direction:column;gap:0.55rem;">
        ${q.targets.map(t => `
          <div style="border:var(--rule);padding:0.7rem;background:var(--vellum-light);display:flex;justify-content:space-between;align-items:center;gap:1rem;">
            <span style="font-size:0.85rem;">${esc(t.label)}</span>
            <select class="swiss-select" style="width:auto;min-width:210px;font-family:var(--font-mono);font-size:0.75rem;" onchange="state.examAnswers['${q.id}']={...(state.examAnswers['${q.id}']||{}),'${t.id}':this.value};render()">
              <option value="">— Match Token —</option>
              ${q.tokens.map(tok => `<option value="${esc(tok)}" ${cur[t.id] === tok ? 'selected' : ''}>${esc(tok)}</option>`).join("")}
            </select>
          </div>
        `).join("")}
      </div>
    `;
  }
  return "";
}

window.pickExamOption = function(qid, oid, type) {
  if (type === "mc") state.examAnswers[qid] = [oid];
  else {
    const s = new Set(Array.isArray(state.examAnswers[qid]) ? state.examAnswers[qid] : []);
    if (s.has(oid)) s.delete(oid); else s.add(oid);
    state.examAnswers[qid] = Array.from(s);
  }
  render();
};

window.strikeExamOption = function(qid, oid) {
  const s = new Set(state.examStrikes[qid] || []);
  if (s.has(oid)) s.delete(oid); else s.add(oid);
  state.examStrikes[qid] = Array.from(s);
  render();
};

window.clickBlueprintPin = function(e, qid) {
  const svg = e.currentTarget.querySelector("svg");
  const r = svg.getBoundingClientRect();
  const x = Number((((e.clientX - r.left) / r.width) * 100).toFixed(1));
  const y = Number((((e.clientY - r.top) / r.height) * 70).toFixed(1));
  state.examAnswers[qid] = { x, y };
  render();
};

/* ==========================================================================
   VIEW 3: AXP HOURS (MYNCARB 6 RINGS + WORK-TASK AI RECOMMENDER)
   ========================================================================== */
function renderCalmAxp(totalApproved, totalRem) {
  return `
    <div class="exam-split">
      <!-- Left Pane: Exact 6 MyNCARB Experience Area Progress Rings -->
      <section class="exam-left-pane" style="justify-content:flex-start;">
        <div class="pane-heading">
          <span>EXPERIENCE AREA PROGRESS (MYNCARB RECORD)</span>
          <button class="swiss-btn" style="padding:0.25rem 0.65rem;font-size:0.75rem;" onclick="openMyNcarbSyncModal()">SYNC / UPDATE MYNCARB ↗</button>
        </div>

        <div class="ncarb-rings-grid">
          ${db.axpData.areas.map(a => {
            const pct = Math.min(100, (a.totalLogged / a.requiredHours) * 100);
            const dash = (pct * 2.26).toFixed(1);
            const rem = Number((a.requiredHours - a.totalLogged).toFixed(2));
            return `
              <div class="ncarb-ring-card">
                <div style="border-top:3px solid ${a.color || 'var(--cobalt)'};padding:0.75rem 0.85rem;">
                  <div style="font-size:0.82rem;font-weight:700;color:var(--cobalt);text-decoration:underline;min-height:34px;">
                    ${esc(a.name)}
                  </div>
                  <div style="padding:0.5rem 0;display:flex;justify-content:center;">
                    <svg viewBox="0 0 96 96" style="width:105px;height:105px;">
                      <circle cx="48" cy="48" r="36" fill="none" stroke="var(--vellum-tab)" stroke-width="7" />
                      <circle cx="48" cy="48" r="36" fill="none" stroke="${a.color || 'var(--cobalt)'}" stroke-width="7" stroke-dasharray="${dash} 226.2" transform="rotate(-90 48 48)" />
                      <text x="48" y="38" text-anchor="middle" font-family="var(--font-sans)" font-size="11" font-weight="700" fill="var(--ink)">${a.totalLogged}</text>
                      <text x="48" y="49" text-anchor="middle" font-family="var(--font-sans)" font-size="8.5" fill="var(--ink-muted)">approved</text>
                      <line x1="28" y1="53" x2="68" y2="53" stroke="var(--rule-subtle)" stroke-width="0.8" />
                      <text x="48" y="63" text-anchor="middle" font-family="var(--font-sans)" font-size="9.5" font-weight="700" fill="var(--ink)">${a.requiredHours.toLocaleString()}</text>
                      <text x="48" y="72" text-anchor="middle" font-family="var(--font-sans)" font-size="8" fill="var(--ink-muted)">required</text>
                    </svg>
                  </div>
                </div>
                <div style="border-top:var(--rule-subtle);padding:0.4rem 0.75rem;text-align:center;font-size:0.75rem;color:var(--ink-muted);">
                  <div><strong>${a.pendingHours || 0}</strong> submitted</div>
                  <div style="border-top:var(--rule-subtle);margin-top:0.25rem;padding-top:0.25rem;">
                    <strong>${rem.toLocaleString()}</strong> remaining
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <div style="border:var(--rule);border-top:3px solid #d97706;padding:0.85rem 1rem;background:var(--vellum-light);display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:700;font-size:0.92rem;">No Additional Experience Requirements for Indiana</div>
            <div style="font-size:0.78rem;color:var(--ink-muted);">Indiana PLA requires the standard 3,740 AXP hours (${totalApproved} approved · ${totalRem} remaining).</div>
          </div>
          <a href="${MYNCARB_EXP_URL}" target="_blank" rel="noopener" class="swiss-btn">OPEN MYNCARB.ORG ↗</a>
        </div>
      </section>

      <!-- Right Pane: Work-Task to AXP Category Recommender -->
      <aside class="exam-right-pane">
        <div class="pane-heading">
          <span>WORK-TASK TO AXP CATEGORY RECOMMENDER</span>
        </div>

        <p style="margin:0;font-size:0.84rem;color:var(--ink-muted);">
          Paste a task from your Deltek Vantagepoint timesheet or studio log to get an instant AXP Experience Area recommendation.
        </p>

        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
          <button class="swiss-btn" style="font-size:0.72rem;padding:0.25rem 0.55rem;" onclick="setAxpPreset('Reviewed contractor submittal log, curtain wall shop drawings, and issued ASI #4')">Submittals &amp; ASI</button>
          <button class="swiss-btn" style="font-size:0.72rem;padding:0.25rem 0.55rem;" onclick="setAxpPreset('Calculated municipal zoning FAR, setbacks, and IBC Chapter 5 allowable area')">Zoning FAR &amp; IBC</button>
          <button class="swiss-btn" style="font-size:0.72rem;padding:0.25rem 0.55rem;" onclick="setAxpPreset('Prepared firm Q4 staff utilization rate, net multiplier, and AIA B101 fee proposal')">Utilization &amp; Fee</button>
        </div>

        <textarea rows="3" class="swiss-textarea" oninput="state.axpTaskInput=this.value">${esc(state.axpTaskInput)}</textarea>

        <div style="display:grid;grid-template-columns:2fr 1fr;gap:0.65rem;">
          <div>
            <label style="font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-muted);">PROJECT</label>
            <input type="text" class="swiss-input" value="${esc(state.axpProject)}" oninput="state.axpProject=this.value" />
          </div>
          <div>
            <label style="font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-muted);">HOURS</label>
            <input type="number" step="0.25" class="swiss-input" value="${state.axpHours}" oninput="state.axpHours=Number(this.value)" />
          </div>
        </div>

        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
          <button class="swiss-btn cobalt" onclick="suggestAxpArea()">SUGGEST CATEGORY</button>
          <button class="swiss-btn terracotta" onclick="logAxpEntry()">+ ADD HOURS</button>
          <button class="swiss-btn" onclick="downloadAxpCsv()">⬇ CSV</button>
        </div>

        ${state.axpSuggestion ? `
          <div style="border:var(--rule);border-left:4px solid var(--terracotta);padding:0.85rem;background:var(--vellum);font-size:0.82rem;">
            <div style="font-family:var(--font-mono);font-weight:700;color:var(--terracotta);">
              RECOMMENDED: ${esc(state.axpSuggestion.code)} — ${esc(state.axpSuggestion.name)}
            </div>
            <div style="margin-top:0.25rem;">${esc(state.axpSuggestion.competency)}</div>
          </div>
        ` : ""}
      </aside>
    </div>
  `;
}

function matchTaskToArea(txt) {
  const t = (txt || "").toLowerCase();
  if (t.includes("submittal") || t.includes("shop") || t.includes("asi") || t.includes("pay") || t.includes("site visit")) {
    return { code: "CE", name: "Construction & Evaluation", competency: "Review contractor submittals, shop drawings, RFIs, and payment applications" };
  }
  if (t.includes("zoning") || t.includes("far") || t.includes("setback") || t.includes("program")) {
    return { code: "PA", name: "Programming & Analysis", competency: "Analyze site zoning constraints, FAR, setbacks, and space programming" };
  }
  if (t.includes("multiplier") || t.includes("utilization") || t.includes("overhead") || t.includes("firm")) {
    return { code: "PcM", name: "Practice Management", competency: "Establish and monitor firm financial metrics (utilization, overhead, net multiplier)" };
  }
  if (t.includes("schedule") || t.includes("b101") || t.includes("consultant")) {
    return { code: "PjM", name: "Project Management", competency: "Manage project work plans, CPM schedules, and AIA Owner/Consultant agreements" };
  }
  if (t.includes("wall") || t.includes("flashing") || t.includes("spec") || t.includes("detail")) {
    return { code: "PDD", name: "Project Development & Documentation", competency: "Prepare construction documents, wall assembly details, and CSI 3-Part specifications" };
  }
  return { code: "PPD", name: "Project Planning & Design", competency: "Perform schematic design alternatives, IBC life-safety egress, and system selection" };
}

window.setAxpPreset = function(txt) {
  state.axpTaskInput = txt;
  state.axpSuggestion = matchTaskToArea(txt);
  render();
};

window.suggestAxpArea = function() {
  state.axpSuggestion = matchTaskToArea(state.axpTaskInput);
  render();
};

window.logAxpEntry = function() {
  const m = matchTaskToArea(state.axpTaskInput);
  state.axpSuggestion = m;
  db.axpData.workLogs.unshift({
    id: `AXP-${100 + db.axpData.workLogs.length + 1}`,
    date: "2026-11-06",
    project: state.axpProject,
    setting: "Setting A",
    description: state.axpTaskInput,
    area: m.code,
    competency: m.competency,
    hours: state.axpHours,
    status: "Approved"
  });
  const area = db.axpData.areas.find(a => a.code === m.code);
  if (area) area.totalLogged = Number((area.totalLogged + state.axpHours).toFixed(2));
  saveAxpToStorage();
  render();
};

window.downloadAxpCsv = function() {
  const rows = [["Area", "Code", "Required_Hours", "Approved_Hours", "Submitted_Hours", "Remaining_Hours"]];
  db.axpData.areas.forEach(a => rows.push([`"${a.name}"`, a.code, a.requiredHours, a.totalLogged, a.pendingHours || 0, Number((a.requiredHours - a.totalLogged).toFixed(2))]));
  const blob = new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "MyNCARB_AXP_Summary.csv";
  a.click();
};

/* ==========================================================================
   MYNCARB SIGN-IN & HOURS SYNC MODAL
   ========================================================================== */
window.openMyNcarbSyncModal = function() {
  const m = document.getElementById("modal-root");
  m.innerHTML = `
    <div class="modal-backdrop" onclick="document.getElementById('modal-root').innerHTML=''">
      <div class="modal-sheet" onclick="event.stopPropagation()">
        <div style="padding:0.9rem 1.25rem;border-bottom:var(--rule);display:flex;justify-content:space-between;align-items:center;background:var(--vellum);">
          <strong style="font-family:var(--font-condensed);font-size:1.1rem;letter-spacing:0.04em;">MYNCARB ACCOUNT SYNC &amp; HOURS UPDATER</strong>
          <button class="swiss-btn" style="padding:0.2rem 0.6rem;" onclick="document.getElementById('modal-root').innerHTML=''">✕</button>
        </div>
        <div style="padding:1.25rem;display:flex;flex-direction:column;gap:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:0.75rem;border:var(--rule);background:var(--vellum);">
            <div style="font-size:0.82rem;">
              <strong>1. Open MyNCARB Experience Portal</strong><br/>
              <span style="color:var(--ink-muted);">Sign in at my.ncarb.org in a new tab, then update any newly approved hours below.</span>
            </div>
            <a href="${MYNCARB_EXP_URL}" target="_blank" rel="noopener" class="swiss-btn cobalt" style="white-space:nowrap;">SIGN IN AT MY.NCARB.ORG ↗</a>
          </div>

          <div style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;">
            2. CURRENT SYNCED MYNCARB HOURS (INDIANA JURISDICTION):
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.65rem;">
            ${db.axpData.areas.map(a => `
              <div style="border:var(--rule);padding:0.55rem 0.75rem;background:var(--vellum);display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <strong style="font-size:0.82rem;">${a.code}</strong>
                  <div style="font-size:0.72rem;color:var(--ink-muted);">Req: ${a.requiredHours}h</div>
                </div>
                <input id="sync-in-${a.code}" type="number" step="0.25" class="swiss-input" style="width:92px;font-family:var(--font-mono);font-weight:700;text-align:right;" value="${a.totalLogged}" />
              </div>
            `).join("")}
          </div>

          <div style="display:flex;justify-content:flex-end;gap:0.6rem;padding-top:0.5rem;border-top:var(--rule);">
            <button class="swiss-btn" onclick="document.getElementById('modal-root').innerHTML=''">CANCEL</button>
            <button class="swiss-btn terracotta" onclick="saveMyNcarbModalHours()">SAVE &amp; UPDATE DASHBOARD</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.saveMyNcarbModalHours = function() {
  db.axpData.areas.forEach(a => {
    const el = document.getElementById(`sync-in-${a.code}`);
    if (el) {
      const val = parseFloat(el.value);
      if (!isNaN(val)) {
        a.totalLogged = val;
        a.approvedSettingA = val;
        a.remainingHours = Number((a.requiredHours - val).toFixed(2));
      }
    }
  });
  saveAxpToStorage();
  document.getElementById("modal-root").innerHTML = "";
  render();
};

/* ==========================================================================
   VIEW 4: CALM STUDY ARCHIVE (13 GOOGLE DRIVE PDFS + NATIONAL/REGIONAL STATS)
   ========================================================================== */
function renderCalmArchive(focusDiv) {
  const reg = db.ncarbNewsAndRegional || {};
  const jurisdictions = reg.midwestJurisdictions || [];
  const st = jurisdictions.find(j => j.code === state.midwestState) || jurisdictions[0] || {};

  return `
    <div class="exam-split">
      <section class="exam-left-pane" style="justify-content:flex-start;">
        <div class="pane-heading">
          <span>GOOGLE DRIVE STUDY ARCHIVE (${db.driveResources.length} PDFS)</span>
          <a href="${DRIVE_FOLDER_URL}" target="_blank" rel="noopener" style="font-family:var(--font-mono);font-size:0.75rem;color:var(--terracotta);">OPEN DRIVE FOLDER ↗</a>
        </div>

        <div style="display:flex;flex-direction:column;gap:0.65rem;">
          ${db.driveResources.map(r => `
            <div style="border-bottom:var(--rule-subtle);padding-bottom:0.65rem;display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;">
              <div>
                <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--terracotta);font-weight:700;">
                  ${esc(r.provider)} · ${esc(r.divisions.join(" · "))} · ${esc(r.size)}
                </div>
                <div style="font-size:0.92rem;font-weight:600;margin-top:0.1rem;">${esc(r.title)}</div>
                <div style="font-size:0.78rem;color:var(--ink-muted);margin-top:0.1rem;">${esc(r.summary)}</div>
              </div>
              <a href="${esc(r.driveUrl)}" target="_blank" rel="noopener" class="swiss-btn" style="font-size:0.74rem;padding:0.3rem 0.7rem;white-space:nowrap;">OPEN PDF ↗</a>
            </div>
          `).join("")}
        </div>
      </section>

      <aside class="exam-right-pane">
        <div class="pane-heading">
          <span>NATIONAL PASS RATES (NCARB BY THE NUMBERS)</span>
        </div>

        <table class="axp-clean-table">
          <tbody>
            ${db.divisions.map(d => `
              <tr>
                <td class="lbl"><strong>${d.code}</strong></td>
                <td class="bar-cell">
                  <div style="height:12px;background:var(--vellum-tab);">
                    <div style="width:${d.passRates['2025']}%;height:100%;background:var(--cobalt);"></div>
                  </div>
                </td>
                <td class="pct-cell">${d.passRates['2025']}%</td>
                <td class="hrs-cell">1st: ${d.passRates.firstAttempt}%</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="pane-heading" style="margin-top:0.75rem;">
          <span>LICENSING BOARD &amp; PSI CENTERS</span>
          <select class="swiss-select" style="width:auto;padding:0.2rem 0.5rem;font-size:0.74rem;" onchange="state.midwestState=this.value;render()">
            ${jurisdictions.map(j => `<option value="${j.code}" ${j.code === state.midwestState ? 'selected' : ''}>${esc(j.code)} — ${esc(j.state.split(' ')[0])}</option>`).join("")}
          </select>
        </div>

        <div style="border:var(--rule);padding:0.95rem;background:var(--vellum);font-size:0.82rem;line-height:1.55;">
          <div><strong>${esc(st.state)}</strong> (Pass Avg: <strong>${st.overallPassRate || 58}%</strong>)</div>
          <p style="margin:0.35rem 0;color:var(--ink-muted);">${esc(st.boardRules)}</p>
          <div style="font-family:var(--font-mono);font-size:0.74rem;">
            <strong>PSI Centers:</strong> ${esc((st.psiCenters || []).join(" · "))}
          </div>
        </div>
      </aside>
    </div>
  `;
}

if (window.__ATELIER_DB__) {
  initPortal();
} else {
  fetch("data/portal_db.json")
    .then(r => r.json())
    .then(d => { db = d; initPortal(); });
}
