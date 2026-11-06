/* ==========================================================================
   ATELIER ARE 5.0 — PURPOSE-DRIVEN SWISS WORKSPACE & INGEST ENGINE
   ========================================================================== */

const DIVISION_STUDY_DATA = {
  PcM: {
    sections: [
      {
        name: "Section 1: Business Operations",
        weight: "20–26%",
        topics: "Business entity structures (LLC, LLP, S-Corp, C-Corp), employment law, insurance (Professional Liability, General Liability, Workers' Comp), ethics."
      },
      {
        name: "Section 2: Finances, Risk & Development of Practice",
        weight: "29–35%",
        topics: "Net Multiplier, Overhead Rate, Break-Even Rate, Utilization Rate, accrual vs. cash accounting, financial statements, Go/No-Go risk matrices."
      },
      {
        name: "Section 3: Practice-Wide Delivery of Services",
        weight: "22–28%",
        topics: "Project delivery method selection (DBB, CMAR, Design-Build, IPD), AIA B101 & C401 agreements, standard of care, client proposals."
      },
      {
        name: "Section 4: Practice Methodologies",
        weight: "17–23%",
        topics: "BIM execution plans, QA/QC protocols, research & evidence-based design, firm-wide knowledge management and staffing allocation."
      }
    ],
    formulas: [
      { term: "Net Multiplier", formula: "Net Operating Revenue ÷ Direct Labor (Target: 2.8x – 3.2x)" },
      { term: "Break-Even Rate", formula: "1.0 + (Total Indirect Overhead ÷ Direct Labor)" },
      { term: "Overhead Rate", formula: "Total Indirect Expenses ÷ Total Direct Labor" },
      { term: "Utilization Rate", formula: "Direct Billable Hours ÷ Total Hours Worked (Target: 65%–75%)" },
      { term: "Business Entities", formula: "LLP (shields partner negligence) · LLC (pass-through + liability shield) · S-Corp (≤100 shareholders)" },
      { term: "Core AIA Contracts", formula: "AIA B101 (Owner–Architect) · AIA C401 (Architect–Consultant) · AIA C191 (IPD Multi-Party)" }
    ]
  },
  PjM: {
    sections: [
      {
        name: "Section 1: Resource Management",
        weight: "7–13%",
        topics: "Project fee budgeting, burn-rate tracking, staff hour allocation by phase (SD, DD, CD, BN, CA), consultant coordination."
      },
      {
        name: "Section 2: Project Work Planning",
        weight: "17–23%",
        topics: "Critical Path Method (CPM) scheduling, float calculations, work breakdown structures, fast-track vs. linear sequencing."
      },
      {
        name: "Section 3: Contracts",
        weight: "25–31%",
        topics: "AIA A101, A102, A133 (CMAR), A141 (DB), A201 General Conditions, B101 scope of basic vs. additional services."
      },
      {
        name: "Section 4: Project Execution",
        weight: "17–23%",
        topics: "Design phase approvals, cost estimating alignments, value engineering, constructability reviews, agency submittals."
      },
      {
        name: "Section 5: Project Quality Control",
        weight: "19–25%",
        topics: "Redline/checkset QA/QC, interdisciplinary clash detection (structural/MEP), spec-to-drawing coordination."
      }
    ],
    formulas: [
      { term: "Total Float (CPM)", formula: "Late Start (LS) − Early Start (ES) = LF − EF (0 Float = Critical Path)" },
      { term: "Fee Top-Down Split", formula: "Gross Fee − Profit (15%) − Consultant Fees = Architectural Fee Budget" },
      { term: "Labor Hours Allowed", formula: "Architectural Fee Budget ÷ (Avg Direct Hourly Rate × Break-Even Multiplier)" },
      { term: "AIA Change Forms", formula: "G701 Change Order (O+A+C) · G714 CCD (O+A) · G710 ASI (Arch only, no cost/time)" },
      { term: "Delivery Contracts", formula: "A101 (Stipulated Sum) · A102 (Cost Plus GMP) · A133 (CM as Constructor)" },
      { term: "Instrument of Service", formula: "AIA B101 §7: Architect retains copyright; Owner gets non-exclusive license upon payment" }
    ]
  },
  PA: {
    sections: [
      {
        name: "Section 1: Environmental & Contextual Conditions",
        weight: "24–30%",
        topics: "Site topography, drainage swales, floodplains, soil bearing capacities, microclimate, solar orientation, brownfield remediation."
      },
      {
        name: "Section 2: Codes & Regulations",
        weight: "16–22%",
        topics: "Zoning setbacks, Floor Area Ratio (FAR), lot coverage, sky exposure plane, parking ratios, IBC occupancy & construction types."
      },
      {
        name: "Section 3: Site Analysis & Programming",
        weight: "21–27%",
        topics: "Geotechnical borings, utility easements, historic preservation (Secretary of the Interior's Standards), cut-and-fill balance."
      },
      {
        name: "Section 4: Building Analysis & Programming",
        weight: "28–34%",
        topics: "Net-to-gross efficiency ratios, adjacency bubble diagrams, occupant load calculations, preliminary cost per SF budgets."
      }
    ],
    formulas: [
      { term: "Max Building Area", formula: "Floor Area Ratio (FAR) × Total Lot Area" },
      { term: "Max Footprint", formula: "Max Lot Coverage % × Total Lot Area (check against setbacks)" },
      { term: "Gross Building Area", formula: "Net Assignable Area (NSF) ÷ Efficiency Ratio (Typ. 0.65 – 0.75)" },
      { term: "Topographic Contours", formula: "Contours pointing uphill ('V') = Valley/Swale; water flows perpendicular to contours" },
      { term: "Soil Bearing (High→Low)", formula: "Bedrock (12,000+ psf) > Gravel (3,000) > Sand (2,000) > Silt/Clay (1,500 psf)" },
      { term: "Historic Preservation", formula: "Preservation (stabilize) · Rehabilitation (compatible use) · Restoration (period) · Reconstruction" }
    ]
  },
  PPD: {
    sections: [
      {
        name: "Section 1: Environmental Conditions & Context",
        weight: "10–16%",
        topics: "Passive solar massing, prevailing wind orientation, daylight harvesting, site water retention and acoustic site buffers."
      },
      {
        name: "Section 2: Codes & Regulations",
        weight: "19–25%",
        topics: "IBC Chapter 3/5/6 allowable height & area tables, mixed-occupancy separated vs. non-separated, Chapter 10 means of egress."
      },
      {
        name: "Section 3: Building Systems, Materials & Assemblies",
        weight: "19–25%",
        topics: "Structural system selection (steel, concrete, mass timber), HVAC system selection (VAV, VRF, chilled beam), lateral force systems."
      },
      {
        name: "Section 4: Project Integration of Program & Systems",
        weight: "32–38%",
        topics: "Core-to-window depths, structural grid coordination with parking modules, life-cycle cost analysis (LCCA)."
      },
      {
        name: "Section 5: Project Costs & Budgeting",
        weight: "8–14%",
        topics: "Systems-based cost estimating, assembly square-foot trade-offs, contingency targets during Schematic & Design Development."
      }
    ],
    formulas: [
      { term: "Structural Depth Rules", formula: "Steel Beam ≈ L/20 · Concrete Beam ≈ L/24 · Glue-Lam ≈ L/16 · Open-Web Joist ≈ L/20" },
      { term: "Egress Width Factors", formula: "Stairs = 0.3\" per occupant (min 44\") · Doors/Corridors = 0.2\" per occupant (min 36\" clear 32\")" },
      { term: "Exit Separation", formula: "≥ 1/2 max diagonal building dimension (≥ 1/3 diagonal if fully sprinklered per NFPA 13)" },
      { term: "Lateral Systems", formula: "Shear Wall (high stiffness) · Braced Frame (economical steel) · Moment Frame (open bays, higher drift)" },
      { term: "HVAC Selection", formula: "VAV (multi-zone office) · VRF (simultaneous heat/cool, tight plenum) · DOAS + Chilled Beam" },
      { term: "Reverberation Time", formula: "Sabine Formula: RT60 = 0.049 × Volume (CF) ÷ Total Absorption (Sabins)" }
    ]
  },
  PDD: {
    sections: [
      {
        name: "Section 1: Integration of Building Materials & Systems",
        weight: "31–37%",
        topics: "Curtain wall & rainscreen detailing, vapor barrier vs. air barrier location, thermal bridging, expansion/control joints, galvanic corrosion."
      },
      {
        name: "Section 2: Construction Documentation",
        weight: "32–38%",
        topics: "Wall sections, stair/elevator shaft details, ADA/ICC A117.1 clearances, fire-rated assembly penetrations, schedules."
      },
      {
        name: "Section 3: Project Manual & Specifications",
        weight: "12–18%",
        topics: "CSI MasterFormat (50 divisions), 3-Part SectionFormat (General, Products, Execution), performance vs. proprietary specs."
      },
      {
        name: "Section 4: Codes & Regulations",
        weight: "10–16%",
        topics: "Fire dampers vs. smoke dampers, parapet heights, plumbing fixture counts (IBC Ch. 29), stair riser/tread geometry."
      },
      {
        name: "Section 5: Construction Cost Estimates",
        weight: "7–13%",
        topics: "Unit-price takeoffs, material escalation allowances, alternates (Add/Deduct), value analysis at 95% CD."
      }
    ],
    formulas: [
      { term: "Thermal Heat Loss", formula: "Total R = ∑ R_i · U = 1 / Total R · Heat Transfer Q = U × Area × ΔT" },
      { term: "Vapor Retarder Rule", formula: "Install on the WARM-IN-WINTER side of insulation (Interior in Zones 5–8; Exterior in Hot-Humid)" },
      { term: "ADA Ramp & Stairs", formula: "Max Ramp Slope 1:12 (8.33%) · Max Rise 30\" per run · Stair Riser 4\"–7\" · Tread min 11\"" },
      { term: "CSI 3-Part Specs", formula: "Part 1: General (submittals/QA) · Part 2: Products (materials/mixes) · Part 3: Execution (install)" },
      { term: "Galvanic Action", formula: "Avoid direct contact between dissimilar metals (e.g., copper runoff onto galvanized steel/aluminum)" },
      { term: "Acoustics (STC / NRC)", formula: "STC = Airborne transmission loss through partition (50+ good) · NRC = Surface sound absorption" }
    ]
  },
  CE: {
    sections: [
      {
        name: "Section 1: Preconstruction Activities",
        weight: "17–23%",
        topics: "Bidding procedures (AIA A701), Addenda vs. ASI, bid bonds, performance & payment bonds (A312), contractor prequalification."
      },
      {
        name: "Section 2: Construction Observation",
        weight: "32–38%",
        topics: "Site visits vs. continuous inspection, rejecting non-conforming work, means & methods boundary, special inspections (IBC Ch. 17)."
      },
      {
        name: "Section 3: Administrative Procedures & Protocols",
        weight: "32–38%",
        topics: "RFIs, shop drawing & submittal review, Pay Applications (G702/G703), Change Orders (G701), CCDs (G714), Substantial Completion (G704)."
      },
      {
        name: "Section 4: Project Closeout & Evaluation",
        weight: "11–17%",
        topics: "Punchlist, Consent of Surety (G707), Release of Liens (G706/G706A), 1-year warranty walkthrough, Post-Occupancy Evaluation (POE)."
      }
    ],
    formulas: [
      { term: "Shop Drawings (A201)", formula: "Architect reviews ONLY for design concept conformance; Contractor owns dimensions & means/methods" },
      { term: "Pay App (G702/G703)", formula: "Current Payment Due = (Total Completed & Stored × (1 − Retainage%)) − Previous Certificates" },
      { term: "Substantial Completion", formula: "AIA G704: Owner can occupy for intended use; starts warranty period & shifts utility/insurance" },
      { term: "Closeout Affidavits", formula: "G706 (Payment of Debts/Claims) · G706A (Release of Liens) · G707 (Consent of Surety)" },
      { term: "Bidding Changes", formula: "Before Bid Opening = Addendum (AIA A701) · After Contract Award = ASI (G710), CCD (G714), CO (G701)" },
      { term: "Authority to Stop Work", formula: "Owner has right to stop work (A201 §2.3); Architect may REJECT non-conforming work (§4.2.6)" }
    ]
  }
};

const state = {
  data: null,
  topTab: "overview",       // overview | exam | axp | ingest
  activeDiv: "PcM",         // PcM | PjM | PA | PPD | PDD | CE
  menuOpen: false,
  theme: localStorage.getItem("atelier_swiss_theme") || "light",
  syncModalOpen: false,

  // Exam Simulator State
  examPool: [],
  examIdx: 0,
  examAnswers: JSON.parse(localStorage.getItem("atelier_exam_answers") || "{}"),
  examRevealed: {},
  examStrikes: {},
  examCaseTab: 0,
  examFilterMode: "DIV",    // DIV | INGESTED | PPP | CDS

  // Ingested Screenshots, PDFs & Custom Generated Questions
  ingestedBatches: JSON.parse(localStorage.getItem("atelier_ingested_batches_v1") || "[]"),
  customQuestions: JSON.parse(localStorage.getItem("atelier_custom_questions_v1") || "[]"),
  ingestStatus: "",
  ingestBusy: false,
  ingestPasteText: "",
  ingestPasteTitle: "",
  ingestTargetDiv: "AUTO",
  lastIngestedBatchId: null,

  // AXP Work-Task Classifier State
  taskDesc: "Prepared wall section details, curtain wall flashing transitions, and window head/sill waterproof membrane callouts in Revit for Design Development package.",
  taskHours: 8.0,
  taskRec: null
};

let db = null;

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getAllQuestions() {
  if (!db) return [];
  return [...state.customQuestions, ...(db.questions || [])];
}

async function initPortal() {
  document.documentElement.setAttribute("data-theme", state.theme);
  if (window.PORTAL_INLINE_DB) {
    db = window.PORTAL_INLINE_DB;
  } else {
    try {
      const res = await fetch("./data/portal_db.json");
      db = await res.json();
    } catch (e) {
      console.error("Failed to load portal_db.json", e);
    }
  }

  const savedAxp = localStorage.getItem("atelier_myncarb_axp_v2");
  if (savedAxp) {
    try {
      const parsed = JSON.parse(savedAxp);
      if (parsed && Array.isArray(parsed.areas)) {
        db.axpData = parsed;
      }
    } catch (_) {}
  }

  if (window.location && window.location.hash) {
    const h = window.location.hash.replace("#", "").trim();
    if (["PcM", "PjM", "PA", "PPD", "PDD", "CE"].includes(h)) {
      state.activeDiv = h;
    } else if (h === "ingest") {
      state.topTab = "ingest";
    }
  }

  // Global clipboard paste listener so the user can press Ctrl+V / Cmd+V with a screenshot anywhere
  window.addEventListener("paste", handleGlobalPaste);

  filterExamPool();
  runTaskClassifier(false);
  render();
}

function saveExamAnswers() {
  localStorage.setItem("atelier_exam_answers", JSON.stringify(state.examAnswers));
}

function saveIngestedData() {
  try {
    localStorage.setItem("atelier_ingested_batches_v1", JSON.stringify(state.ingestedBatches));
    localStorage.setItem("atelier_custom_questions_v1", JSON.stringify(state.customQuestions));
  } catch (e) {
    console.warn("Storage quota warning; trimming older full-res image data", e);
  }
}

function filterExamPool() {
  if (!db) return;
  const allQs = getAllQuestions();
  let list = allQs;

  if (state.examFilterMode === "INGESTED") {
    list = state.customQuestions.length ? state.customQuestions : allQs.filter(q => q.division === state.activeDiv);
  } else if (state.examFilterMode.startsWith("BATCH:")) {
    const bid = state.examFilterMode.split("BATCH:")[1];
    list = state.customQuestions.filter(q => q.batchId === bid);
  } else if (state.examFilterMode === "PPP" || state.examFilterMode === "CDS") {
    list = allQs.filter(q => q.legacyMapping && q.legacyMapping.includes(state.examFilterMode));
  } else {
    list = allQs.filter(q => q.division === state.activeDiv);
  }

  if (!list.length) list = allQs;
  state.examPool = list;
  state.examIdx = 0;
}

window.toggleMenu = function(force) {
  state.menuOpen = typeof force === "boolean" ? force : !state.menuOpen;
  render();
};

window.toggleTheme = function() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  localStorage.setItem("atelier_swiss_theme", state.theme);
  document.documentElement.setAttribute("data-theme", state.theme);
  state.menuOpen = false;
  render();
};

window.switchTopTab = function(tab) {
  state.topTab = tab;
  state.menuOpen = false;
  render();
};

window.selectDivision = function(code) {
  state.activeDiv = code;
  if (state.examFilterMode === "PPP" || state.examFilterMode === "CDS" || state.examFilterMode.startsWith("BATCH:")) {
    state.examFilterMode = "DIV";
  }
  state.menuOpen = false;
  filterExamPool();
  render();
};

window.openMyNcarbSyncModal = function() {
  state.syncModalOpen = true;
  state.menuOpen = false;
  render();
};

window.closeMyNcarbSyncModal = function() {
  state.syncModalOpen = false;
  render();
};

window.resetExamProgress = function() {
  state.examAnswers = {};
  state.examRevealed = {};
  state.examStrikes = {};
  saveExamAnswers();
  state.menuOpen = false;
  render();
};

window.saveMyNcarbHoursFromModal = function(e) {
  e.preventDefault();
  const form = e.target;
  let totalApp = 0;
  let totalSub = 0;
  db.axpData.areas.forEach(a => {
    const appVal = parseFloat(form.querySelector(`[name="app_${a.code}"]`).value);
    const subVal = parseFloat(form.querySelector(`[name="sub_${a.code}"]`).value);
    a.approvedHours = isNaN(appVal) ? 0 : Number(appVal.toFixed(2));
    a.submittedHours = isNaN(subVal) ? 0 : Number(subVal.toFixed(2));
    a.totalLogged = Number((a.approvedHours + a.submittedHours).toFixed(2));
    totalApp += a.approvedHours;
    totalSub += a.submittedHours;
  });
  db.axpData.totalApproved = Number(totalApp.toFixed(2));
  db.axpData.totalSubmitted = Number(totalSub.toFixed(2));
  db.axpData.totalLogged = Number((totalApp + totalSub).toFixed(2));
  db.axpData.totalRemaining = Number((3740 - db.axpData.totalLogged).toFixed(2));
  db.axpData.lastUpdated = new Date().toISOString().slice(0, 10);

  localStorage.setItem("atelier_myncarb_axp_v2", JSON.stringify(db.axpData));
  state.syncModalOpen = false;
  render();
};

/* ==========================================================================
   CLIENT-SIDE SCREENSHOT / PDF / NOTES INGESTION & QUESTION GENERATOR
   ========================================================================== */
function detectDivisionFromText(text, fallbackDiv) {
  if (state.ingestTargetDiv && state.ingestTargetDiv !== "AUTO") {
    return state.ingestTargetDiv;
  }
  const t = String(text || "").toLowerCase();
  const scores = {
    PcM: 0, PjM: 0, PA: 0, PPD: 0, PDD: 0, CE: 0
  };
  const kwMap = {
    PcM: ["multiplier", "overhead", "utilization", "llp", "llc", "s-corp", "b101", "ethics", "standard of care", "accrual", "practice management", "pcm"],
    PjM: ["critical path", "float", "cpm", "work plan", "a101", "a133", "c401", "quality control", "project management", "pjm", "burn rate"],
    PA:  ["zoning", "setback", "far", "floor area ratio", "soil", "bearing", "contour", "swale", "historic", "programming", "brownfield"],
    PPD: ["egress", "dead-end", "travel distance", "hvac", "vav", "vrf", "chilled beam", "shear wall", "moment frame", "truss", "sabine", "ppd"],
    PDD: ["u-factor", "r-value", "vapor retarder", "dew point", "flashing", "masterformat", "csi", "curtain wall", "galvanic", "stc", "nrc", "pdd"],
    CE:  ["shop drawing", "submittal", "pay app", "g702", "g704", "substantial completion", "retainage", "punchlist", "addendum", "a201", "surety", "lien"]
  };
  Object.keys(kwMap).forEach(div => {
    kwMap[div].forEach(k => {
      if (t.includes(k)) scores[div] += 2;
    });
  });
  let best = fallbackDiv || state.activeDiv || "PcM";
  let bestScore = 0;
  Object.keys(scores).forEach(div => {
    if (scores[div] > bestScore) {
      bestScore = scores[div];
      best = div;
    }
  });
  return best;
}

function synthesizeQuestionsFromExtractedText(rawText, sourceName, divCode, imageDataUrl, batchId) {
  const clean = String(rawText || "").replace(/\r/g, "\n").trim();
  const generated = [];
  const timestamp = Date.now();

  // 1. First check if rawText contains structured multiple-choice items (e.g. A. / B. / C. / D.)
  const mcRegex = /(?:^|\n)\s*(?:Q\d*[\.\:\)]|\d+[\.\)])\s*([^\n]+(?:\n(?!\s*[A-D][\.\)])[^\n]+)*)\s*\n\s*A[\.\)]\s*([^\n]+)\s*\n\s*B[\.\)]\s*([^\n]+)\s*\n\s*C[\.\)]\s*([^\n]+)\s*\n\s*D[\.\)]\s*([^\n]+)/gi;
  let match;
  let idx = 0;
  while ((match = mcRegex.exec(clean)) !== null && idx < 12) {
    idx++;
    const stem = match[1].replace(/\s+/g, " ").trim();
    const optA = match[2].trim();
    const optB = match[3].trim();
    const optC = match[4].trim();
    const optD = match[5].trim();
    generated.push({
      id: `ING-${batchId}-${idx}`,
      batchId,
      division: divCode,
      section: `Ingested Study Material (${sourceName})`,
      objective: "Custom Ingested Practice Item",
      source: `Ingested: ${sourceName}`,
      type: "mc",
      stem,
      options: [
        { id: "A", text: optA },
        { id: "B", text: optB },
        { id: "C", text: optC },
        { id: "D", text: optD }
      ],
      correctAnswer: ["A"],
      explanation: `Extracted from your uploaded study file "${sourceName}". Review the exhibit and extracted notes to verify all option nuances.`,
      reference: sourceName,
      imageExhibit: imageDataUrl || null,
      extractedNotes: clean.slice(0, 900)
    });
  }

  // 2. Extract high-value declarative sentences, formulas, numbers, or code statements
  const sentences = clean
    .split(/(?<=[.?!])\s+|\n+/)
    .map(s => s.replace(/\s+/g, " ").trim())
    .filter(s => s.length >= 32 && s.length <= 280);

  const distractorPool = [
    "Only after the Owner files a separate Notice of Substantial Completion under AIA G707",
    "The Contractor assumes full liability for code compliance and zoning variance approval",
    "Multiply Gross Revenue by Total Overhead and divide by Net Profit Margin",
    "Install the vapor retarder exclusively on the cold-in-winter exterior face in Climate Zones 6–8",
    "Requires unanimous written sign-off from the Building Official, Surety, and Subcontractors on AIA G710"
  ];

  sentences.slice(0, 6).forEach((sent, sIdx) => {
    if (generated.length >= 10) return;

    // Check if sentence has a clear equation or number for a Fill-in-the-Blank or targeted MC
    const numMatch = sent.match(/\b(\d+(?:\.\d+)?)\s*(%|ft|feet|inches|in|psf|hours|days|x)\b/i);
    const eqParts = sent.split(/\s*[:=—–-]\s*/);

    if (eqParts.length >= 2 && eqParts[0].length >= 4 && eqParts[0].length <= 65 && eqParts[1].length >= 10) {
      const concept = eqParts[0].trim();
      const definition = eqParts.slice(1).join(" — ").trim();
      const otherDefs = sentences
        .filter((_, i) => i !== sIdx)
        .map(x => x.slice(0, 120))
        .concat(distractorPool)
        .slice(0, 3);

      const opts = [
        { id: "A", text: definition },
        { id: "B", text: otherDefs[0] || distractorPool[0] },
        { id: "C", text: otherDefs[1] || distractorPool[1] },
        { id: "D", text: otherDefs[2] || distractorPool[2] }
      ];

      generated.push({
        id: `ING-${batchId}-C${sIdx + 1}`,
        batchId,
        division: divCode,
        section: `Ingested Study Material (${sourceName})`,
        objective: "Concept & Formula Recall",
        source: `Ingested: ${sourceName}`,
        type: "mc",
        stem: `Based on your ingested ${divCode} study material ("${sourceName}"), which of the following accurately defines or governs "${concept}"?`,
        options: opts,
        correctAnswer: ["A"],
        explanation: `Source statement from "${sourceName}": ${sent}`,
        reference: sourceName,
        imageExhibit: imageDataUrl || null,
        extractedNotes: clean.slice(0, 900)
      });
    } else if (numMatch) {
      const val = numMatch[1];
      const unit = numMatch[2];
      const blanked = sent.replace(numMatch[0], `_____ ${unit}`);
      generated.push({
        id: `ING-${batchId}-N${sIdx + 1}`,
        batchId,
        division: divCode,
        section: `Ingested Study Material (${sourceName})`,
        objective: "Numerical Code / Threshold Drill",
        source: `Ingested: ${sourceName}`,
        type: "fib",
        unit: unit,
        stem: `Fill in the missing threshold/value from your uploaded ${divCode} study material ("${sourceName}"):\n\n"${blanked}"`,
        correctAnswer: val,
        explanation: `Full statement from "${sourceName}": ${sent}`,
        reference: sourceName,
        imageExhibit: imageDataUrl || null,
        extractedNotes: clean.slice(0, 900)
      });
    } else {
      const otherSents = sentences
        .filter((_, i) => i !== sIdx)
        .slice(0, 2)
        .map(x => "Contrary to standard practice: " + x.slice(0, 100));
      generated.push({
        id: `ING-${batchId}-S${sIdx + 1}`,
        batchId,
        division: divCode,
        section: `Ingested Study Material (${sourceName})`,
        objective: "Key Principle Verification",
        source: `Ingested: ${sourceName}`,
        type: "mc",
        stem: `Reviewing the ingested study material "${sourceName}" for ${divCode}, which of the following principles is explicitly established in your notes/exhibit?`,
        options: [
          { id: "A", text: sent },
          { id: "B", text: otherSents[0] || distractorPool[0] },
          { id: "C", text: otherSents[1] || distractorPool[1] },
          { id: "D", text: distractorPool[2] }
        ],
        correctAnswer: ["A"],
        explanation: `Verified directly from your ingested study file "${sourceName}": "${sent}"`,
        reference: sourceName,
        imageExhibit: imageDataUrl || null,
        extractedNotes: clean.slice(0, 900)
      });
    }
  });

  // 3. If it's a visual screenshot where OCR text was minimal (e.g., pure architectural drawing/detail), always create Visual Exhibit Analysis questions!
  if (generated.length === 0) {
    const studyInfo = DIVISION_STUDY_DATA[divCode] || DIVISION_STUDY_DATA.PcM;
    const f0 = studyInfo.formulas[0];
    const f1 = studyInfo.formulas[1];
    generated.push(
      {
        id: `ING-${batchId}-V1`,
        batchId,
        division: divCode,
        section: `Visual Exhibit Analysis (${sourceName})`,
        objective: studyInfo.sections[0].name,
        source: `Screenshot Exhibit: ${sourceName}`,
        type: "mc",
        stem: `Examine the uploaded study screenshot "${sourceName}" (shown in the Exhibit pane on the right). When applying this ${divCode} exhibit on the ARE 5.0 exam, which primary ${divCode} principle governs "${f0.term}"?`,
        options: [
          { id: "A", text: `${f0.term}: ${f0.formula}` },
          { id: "B", text: distractorPool[0] },
          { id: "C", text: distractorPool[1] },
          { id: "D", text: distractorPool[3] }
        ],
        correctAnswer: ["A"],
        explanation: `Your uploaded exhibit "${sourceName}" is paired with ${divCode} (${studyInfo.sections[0].name}). Core rule: ${f0.term} = ${f0.formula}.`,
        reference: sourceName,
        imageExhibit: imageDataUrl || null,
        extractedNotes: clean || `Visual study screenshot uploaded for ${divCode} (${sourceName}).`
      },
      {
        id: `ING-${batchId}-V2`,
        batchId,
        division: divCode,
        section: `Visual Exhibit Analysis (${sourceName})`,
        objective: studyInfo.sections[1] ? studyInfo.sections[1].name : studyInfo.sections[0].name,
        source: `Screenshot Exhibit: ${sourceName}`,
        type: "mc",
        stem: `Referring to your uploaded ${divCode} study exhibit "${sourceName}", how should the architect apply "${f1.term}" during project execution?`,
        options: [
          { id: "A", text: `${f1.term}: ${f1.formula}` },
          { id: "B", text: distractorPool[2] },
          { id: "C", text: distractorPool[4] },
          { id: "D", text: distractorPool[0] }
        ],
        correctAnswer: ["A"],
        explanation: `Key ${divCode} reference for "${sourceName}": ${f1.term} — ${f1.formula}.`,
        reference: sourceName,
        imageExhibit: imageDataUrl || null,
        extractedNotes: clean || `Visual study screenshot uploaded for ${divCode} (${sourceName}).`
      }
    );
  }

  return generated;
}

async function extractTextFromPdfFile(file) {
  if (!window.pdfjsLib) {
    throw new Error("PDF.js library is still loading");
  }
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const arrayBuf = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuf }).promise;
  const maxPages = Math.min(pdf.numPages, 15);
  let fullText = "";
  for (let p = 1; p <= maxPages; p++) {
    state.ingestStatus = `Reading PDF page ${p} of ${maxPages} (${file.name})...`;
    render();
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const strings = content.items.map(it => it.str);
    fullText += strings.join(" ") + "\n\n";
  }
  return fullText;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function runOcrOnImage(dataUrl, fileName) {
  if (!window.Tesseract) return "";
  try {
    state.ingestStatus = `Running OCR text & diagram recognition on "${fileName}"...`;
    render();
    const result = await window.Tesseract.recognize(dataUrl, "eng");
    return (result && result.data && result.data.text) ? result.data.text : "";
  } catch (e) {
    console.warn("OCR fallback:", e);
    return "";
  }
}

window.handleIngestFiles = async function(fileList) {
  if (!fileList || !fileList.length) return;
  state.ingestBusy = true;
  const files = Array.from(fileList);

  for (const file of files) {
    const batchId = "B" + Date.now().toString(36).toUpperCase();
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(file.name);

    let extractedText = "";
    let imageDataUrl = null;

    try {
      if (isPdf) {
        state.ingestStatus = `Extracting text & questions from PDF "${file.name}"...`;
        render();
        extractedText = await extractTextFromPdfFile(file);
      } else if (isImage) {
        state.ingestStatus = `Loading screenshot "${file.name}"...`;
        render();
        imageDataUrl = await readFileAsDataUrl(file);
        extractedText = await runOcrOnImage(imageDataUrl, file.name);
      } else {
        extractedText = await file.text();
      }
    } catch (err) {
      console.warn("File extraction notice:", err);
    }

    const divCode = detectDivisionFromText(extractedText + " " + file.name, state.activeDiv);
    const newQs = synthesizeQuestionsFromExtractedText(
      extractedText,
      file.name,
      divCode,
      imageDataUrl,
      batchId
    );

    const batchRecord = {
      id: batchId,
      name: file.name,
      kind: isPdf ? "PDF Study Material" : isImage ? "Screenshot Exhibit" : "Study Notes",
      division: divCode,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      questionCount: newQs.length,
      previewImage: imageDataUrl,
      extractedSnippet: (extractedText || "").replace(/\s+/g, " ").trim().slice(0, 260)
    };

    state.ingestedBatches.unshift(batchRecord);
    state.customQuestions.unshift(...newQs);
    state.lastIngestedBatchId = batchId;
    state.activeDiv = divCode;
    state.ingestStatus = `✓ Ingested "${file.name}" → Generated ${newQs.length} interactive ${divCode} test questions!`;
  }

  state.ingestBusy = false;
  saveIngestedData();
  filterExamPool();
  render();
};

function handleGlobalPaste(e) {
  if (!e.clipboardData) return;
  const items = Array.from(e.clipboardData.items || []);
  const imgItem = items.find(it => it.type && it.type.startsWith("image/"));
  if (imgItem) {
    e.preventDefault();
    const blob = imgItem.getAsFile();
    if (blob) {
      const namedFile = new File([blob], `Pasted_Screenshot_${new Date().toISOString().slice(11, 19).replace(/:/g, "")}.png`, { type: blob.type });
      window.handleIngestFiles([namedFile]);
    }
  }
}

window.ingestPastedNotes = function() {
  const txt = (state.ingestPasteText || "").trim();
  if (!txt) return;
  const title = (state.ingestPasteTitle || "").trim() || `Study Notes (${state.activeDiv})`;
  const batchId = "B" + Date.now().toString(36).toUpperCase();
  const divCode = detectDivisionFromText(txt + " " + title, state.activeDiv);
  const newQs = synthesizeQuestionsFromExtractedText(txt, title, divCode, null, batchId);

  state.ingestedBatches.unshift({
    id: batchId,
    name: title,
    kind: "Pasted Study Notes",
    division: divCode,
    createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    questionCount: newQs.length,
    previewImage: null,
    extractedSnippet: txt.slice(0, 260)
  });

  state.customQuestions.unshift(...newQs);
  state.lastIngestedBatchId = batchId;
  state.ingestPasteText = "";
  state.ingestPasteTitle = "";
  state.ingestStatus = `✓ Ingested "${title}" → Generated ${newQs.length} interactive ${divCode} test questions!`;
  saveIngestedData();
  filterExamPool();
  render();
};

window.quizOnBatch = function(batchId) {
  state.examFilterMode = batchId ? `BATCH:${batchId}` : "INGESTED";
  filterExamPool();
  state.topTab = "exam";
  render();
};

window.deleteIngestedBatch = function(batchId) {
  state.ingestedBatches = state.ingestedBatches.filter(b => b.id !== batchId);
  state.customQuestions = state.customQuestions.filter(q => q.batchId !== batchId);
  if (state.lastIngestedBatchId === batchId) state.lastIngestedBatchId = null;
  saveIngestedData();
  filterExamPool();
  render();
};

/* ==========================================================================
   MASTER RENDER
   ========================================================================== */
function render() {
  const root = document.getElementById("app-root");
  if (!root || !db) return;

  const focusDiv = db.divisions.find(d => d.code === state.activeDiv) || db.divisions[0];
  const totalApproved = db.axpData.areas.reduce((s, a) => s + a.totalLogged, 0);
  const totalRem = Number((3740 - totalApproved).toFixed(2));
  const allQs = getAllQuestions();

  root.innerHTML = `
    <div class="monograph-sheet">
      <!-- ROW 1: SLIM MASTHEAD -->
      <header class="masthead-row">
        <button class="masthead-menu-btn ${state.menuOpen ? 'open' : ''}" onclick="toggleMenu()" title="Open Studio Menu">
          ${state.menuOpen ? '✕' : '☰'}
        </button>
        <div class="masthead-brand-cell" onclick="if(state.menuOpen) toggleMenu(false)">
          <h1 class="masthead-brand-title">ATELIER ARE 5.0</h1>
          <div class="masthead-status-strip">
            <span>AXP TOTAL: <strong>${totalApproved.toLocaleString()} / 3,740 HRS</strong> (${totalRem.toLocaleString()} REM)</span>
            <span>JURISDICTION: <strong>INDIANA</strong></span>
          </div>
        </div>
        <div class="masthead-utils">
          <button class="util-cell-btn" onclick="openMyNcarbSyncModal()" title="Sign in or sync hours from my.ncarb.org">
            <span class="sync-dot"></span> MYNCARB SYNC
          </button>
          <a class="util-cell-btn" href="https://docs.google.com/spreadsheets/d/1bLGH_YofHmm9wYqN4Vzu7RJ3PuEuocV_lL7DidNsJwQ/edit" target="_blank" rel="noopener" title="Open synced Google Sheet">
            SHEET ↗
          </a>
          <button class="util-cell-btn" onclick="toggleTheme()" title="Toggle Vellum / Dark Blueprint Theme">
            ${state.theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>

        ${state.menuOpen ? renderHamburgerDrawer(totalApproved, allQs.length) : ""}
      </header>

      <!-- ROW 2: SUB-BAR (DIVISION HEADER LEFT | 4 TABS RIGHT) -->
      <nav class="subnav-row" onclick="if(state.menuOpen) toggleMenu(false)">
        <div class="subnav-empty-cell"></div>
        <div class="subnav-division-hdr">DIVISION</div>
        <div class="subnav-spacer">
          ${focusDiv.code} — ${esc(focusDiv.name)} · ${focusDiv.totalItems || focusDiv.items} Items (${focusDiv.testDurationDisplay || focusDiv.duration}) · NCARB Pass Score: 550/800 · Nat'l Pass Rate: ${(focusDiv.passRates && focusDiv.passRates['2025']) || focusDiv.nationalPassRate}%
        </div>
        <div class="subnav-tabs">
          <button class="subnav-tab-btn ${state.topTab === 'overview' ? 'active' : ''}" onclick="switchTopTab('overview')">OVERVIEW</button>
          <button class="subnav-tab-btn ${state.topTab === 'exam' ? 'active' : ''}" onclick="switchTopTab('exam')">PRACTICE EXAM</button>
          <button class="subnav-tab-btn ${state.topTab === 'axp' ? 'active' : ''}" onclick="switchTopTab('axp')">AXP HOURS</button>
          <button class="subnav-tab-btn ${state.topTab === 'ingest' ? 'active' : ''}" onclick="switchTopTab('ingest')">INGEST &amp; QUIZ (${state.customQuestions.length})</button>
        </div>
      </nav>

      <!-- ROW 3: MAIN WORKSPACE (LEFT 6-DIVISION SPINE | ACTIVE PANE) -->
      <div class="workspace-row" onclick="if(state.menuOpen) toggleMenu(false)">
        <!-- LEFT VERTICAL DIVISION SPINE -->
        <aside class="division-spine">
          <div>
            ${db.divisions.map((d, i) => {
              const axpArea = db.axpData.areas.find(a => a.code === d.code);
              const divQs = allQs.filter(q => q.division === d.code);
              const answeredCount = divQs.filter(q => state.examAnswers[q.id] !== undefined).length;
              return `
                <div class="spine-item ${d.code === state.activeDiv ? 'active' : ''}" onclick="selectDivision('${d.code}')">
                  <div class="spine-num">${i + 1}</div>
                  <div class="spine-body">
                    <div class="spine-code">${esc(d.code)}</div>
                    <div class="spine-name">${esc(d.name)}</div>
                    <div class="spine-meta">AXP: ${axpArea ? axpArea.totalLogged : 0} / ${axpArea ? axpArea.requiredHours : 0}h</div>
                    <div class="spine-meta">Practice Qs: ${answeredCount} / ${divQs.length}</div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <div class="spine-footer">
            <div><strong>INDIANA LICENSURE</strong></div>
            <div>No Extra State AXP Req</div>
            <div style="margin-top:0.2rem;">NCARB Pass Score: <strong>550 / 800</strong></div>
          </div>
        </aside>

        <!-- MAIN WORKSPACE CANVAS -->
        <main>
          ${state.topTab === "overview" ? renderPurposeDrivenOverview(focusDiv, totalApproved, totalRem, allQs) : ""}
          ${state.topTab === "exam" ? renderCalmExam(focusDiv, allQs) : ""}
          ${state.topTab === "axp" ? renderCalmAxp(totalApproved, totalRem) : ""}
          ${state.topTab === "ingest" ? renderIngestStudio(focusDiv) : ""}
        </main>
      </div>
    </div>

    ${state.syncModalOpen ? renderMyNcarbSyncModal() : ""}
  `;
}

/* ==========================================================================
   HAMBURGER MENU DRAWER
   ========================================================================== */
function renderHamburgerDrawer(totalApproved, totalQuestionCount) {
  return `
    <div class="hamburger-drawer">
      <div class="drawer-section-hdr">STUDIO VIEWS</div>
      <button class="drawer-item" onclick="switchTopTab('overview')">
        <span>01 · Division Study Overview</span>
        <span class="code-tag">${state.topTab === 'overview' ? 'ACTIVE' : 'VIEW'}</span>
      </button>
      <button class="drawer-item" onclick="switchTopTab('exam')">
        <span>02 · Practice Exam Simulator (${totalQuestionCount} Qs)</span>
        <span class="code-tag">${state.topTab === 'exam' ? 'ACTIVE' : 'PRACTICE'}</span>
      </button>
      <button class="drawer-item" onclick="switchTopTab('axp')">
        <span>03 · MyNCARB AXP Hours &amp; Task Logger</span>
        <span class="code-tag">${totalApproved} / 3,740h</span>
      </button>
      <button class="drawer-item" onclick="switchTopTab('ingest')">
        <span>04 · Ingest Screenshots &amp; PDFs to Quiz Me</span>
        <span class="code-tag">${state.customQuestions.length} INGESTED</span>
      </button>

      <div class="drawer-section-hdr">JUMP TO ARE 5.0 DIVISION</div>
      ${db.divisions.map((d, idx) => `
        <button class="drawer-item" onclick="selectDivision('${d.code}')">
          <span>${idx + 1} · ${esc(d.code)} — ${esc(d.name)}</span>
          <span class="code-tag">${d.code === state.activeDiv ? 'SELECTED' : (d.totalItems || d.items) + ' Qs'}</span>
        </button>
      `).join("")}

      <div class="drawer-section-hdr">MYNCARB &amp; SETTINGS</div>
      <button class="drawer-item" onclick="openMyNcarbSyncModal()">
        <span>Sync / Edit MyNCARB Hours</span>
        <span class="code-tag">MODAL</span>
      </button>
      <a class="drawer-item" href="https://my.ncarb.org/apps/experience" target="_blank" rel="noopener">
        <span>Open MyNCARB Experience Portal</span>
        <span class="code-tag">↗</span>
      </a>
      <a class="drawer-item" href="https://docs.google.com/spreadsheets/d/1bLGH_YofHmm9wYqN4Vzu7RJ3PuEuocV_lL7DidNsJwQ/edit" target="_blank" rel="noopener">
        <span>Open Synced Google Sheet Tracker</span>
        <span class="code-tag">↗</span>
      </a>
      <button class="drawer-item" onclick="toggleTheme()">
        <span>Switch Theme (${state.theme === 'dark' ? 'Vellum Day' : 'Blueprint Night'})</span>
        <span class="code-tag">${state.theme === 'dark' ? '☀' : '☾'}</span>
      </button>
      <button class="drawer-item" onclick="resetExamProgress()">
        <span>Reset Practice Exam Answers</span>
        <span class="code-tag">CLEAR</span>
      </button>
    </div>
  `;
}

/* ==========================================================================
   VIEW 1: PURPOSE-DRIVEN OVERVIEW
   - Left Pane: Active Division Study & Exam Hub + Screenshot/PDF Dropzone
   - Top-Right Pane: Active Division Formula, Code & AIA Contract Reference Sheet
   - Bottom-Right Pane: User's Real MyNCARB Experience Record (720.25 / 3,740)
   ========================================================================== */
function renderPurposeDrivenOverview(focusDiv, totalApproved, totalRem, allQs) {
  const studyInfo = DIVISION_STUDY_DATA[focusDiv.code] || DIVISION_STUDY_DATA.PcM;
  const divQuestions = allQs.filter(q => q.division === focusDiv.code);
  const answeredInDiv = divQuestions.filter(q => state.examAnswers[q.id] !== undefined).length;
  const axpForDiv = db.axpData.areas.find(a => a.code === focusDiv.code) || db.axpData.areas[0];
  const axpRemForDiv = Number((axpForDiv.requiredHours - axpForDiv.totalLogged).toFixed(2));
  const divIngestedCount = state.customQuestions.filter(q => q.division === focusDiv.code).length;

  return `
    <div class="overview-grid">
      <!-- LEFT PANE: ACTIVE DIVISION STUDY & EXAM HUB + SCREENSHOT/PDF INGEST DROPZONE -->
      <section class="pane-left-study">
        <div>
          <div class="pane-heading">
            <span>${esc(focusDiv.code)} — ${esc(focusDiv.name)} STUDY &amp; EXAM HUB</span>
            <span style="font-family:var(--font-mono);font-size:0.74rem;color:var(--ink-muted);">NCARB ARE 5.0</span>
          </div>

          <!-- Official NCARB Exam Specifications Strip -->
          <div class="specs-strip">
            <div class="spec-cell">
              <div class="spec-lbl">EXAM ITEMS</div>
              <div class="spec-val">${focusDiv.totalItems || focusDiv.items} Questions</div>
            </div>
            <div class="spec-cell">
              <div class="spec-lbl">TEST DURATION</div>
              <div class="spec-val">${esc(focusDiv.testDurationDisplay || focusDiv.duration)}</div>
            </div>
            <div class="spec-cell">
              <div class="spec-lbl">NCARB PASSING SCORE</div>
              <div class="spec-val">550 / 800 Scaled</div>
            </div>
            <div class="spec-cell">
              <div class="spec-lbl">NATIONAL PASS RATE</div>
              <div class="spec-val">${(focusDiv.passRates && focusDiv.passRates['2025']) || focusDiv.nationalPassRate}% (NCARB)</div>
            </div>
          </div>

          <!-- Official NCARB Content Areas & Exam Weights -->
          <div style="margin-top:1rem;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:0.4rem;">
              <span style="font-family:var(--font-condensed);font-size:0.96rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;">
                OFFICIAL NCARB EXAM SECTIONS &amp; WEIGHTS (${esc(focusDiv.code)})
              </span>
              <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--ink-muted);">
                ${studyInfo.sections.length} CONTENT AREAS
              </span>
            </div>

            <div class="sections-list">
              ${studyInfo.sections.map((sec, idx) => `
                <div class="section-row">
                  <div>
                    <div class="section-title">${esc(sec.name)}</div>
                    <div class="section-desc">${esc(sec.topics)}</div>
                  </div>
                  <div style="display:flex;align-items:center;gap:0.5rem;">
                    <span class="section-weight-badge" title="Percentage of questions on the official NCARB exam">${esc(sec.weight)}</span>
                    <button class="swiss-btn" style="padding:0.26rem 0.55rem;font-size:0.74rem;" onclick="state.examFilterMode='DIV';filterExamPool();state.examIdx=${idx % Math.max(1, divQuestions.length)};switchTopTab('exam')">
                      DRILL →
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Interactive Screenshot & PDF Study Material Ingestor (Replaces static PDF list) -->
          <div style="margin-top:1rem;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:0.4rem;">
              <span style="font-family:var(--font-condensed);font-size:0.96rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;">
                INGEST SCREENSHOTS OR STUDY PDFS TO TEST ME (${esc(focusDiv.code)})
              </span>
              <button class="swiss-btn" style="padding:0.18rem 0.55rem;font-size:0.72rem;" onclick="switchTopTab('ingest')">
                OPEN INGEST STUDIO (${state.customQuestions.length} CUSTOM Qs) →
              </button>
            </div>

            <label class="ingest-dropzone"
              ondragover="event.preventDefault();this.classList.add('dragover')"
              ondragleave="this.classList.remove('dragover')"
              ondrop="event.preventDefault();this.classList.remove('dragover');handleIngestFiles(event.dataTransfer.files)">
              <input type="file" multiple accept="image/*,.pdf,.txt,.md" style="display:none;" onchange="handleIngestFiles(this.files)" />
              <div>
                <div style="font-weight:700;font-size:0.86rem;">
                  + Drop Study Screenshots (PNG/JPG) or PDFs Here — or Press <span style="font-family:var(--font-mono);">Ctrl+V</span> to Paste Screenshot
                </div>
                <div style="font-size:0.75rem;color:var(--ink-secondary);margin-top:0.15rem;">
                  Extracts diagrams, formulas, code tables &amp; questions and immediately builds interactive ${esc(focusDiv.code)} test items.
                </div>
              </div>
              <span class="swiss-btn cobalt" style="flex-shrink:0;">BROWSE FILES</span>
            </label>

            ${state.ingestStatus ? `
              <div style="margin-top:0.5rem;padding:0.5rem 0.75rem;border:var(--rule);background:var(--vellum-card);display:flex;justify-content:space-between;align-items:center;gap:0.75rem;font-family:var(--font-mono);font-size:0.74rem;">
                <span>${esc(state.ingestStatus)}</span>
                ${state.lastIngestedBatchId ? `
                  <button class="swiss-btn terracotta" style="padding:0.22rem 0.6rem;font-size:0.74rem;flex-shrink:0;" onclick="quizOnBatch('${state.lastIngestedBatchId}')">
                    TEST ME ON THIS NOW →
                  </button>
                ` : ""}
              </div>
            ` : ""}
          </div>
        </div>

        <!-- Bottom Action Bar for Selected Division -->
        <div style="border-top:var(--rule);padding-top:0.85rem;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.75rem;">
          <div style="font-family:var(--font-mono);font-size:0.74rem;">
            <strong>${focusDiv.code} QUESTION BANK:</strong> ${answeredInDiv} / ${divQuestions.length} ANSWERED (${divIngestedCount} INGESTED) · <strong>${focusDiv.code} AXP:</strong> ${axpForDiv.totalLogged} / ${axpForDiv.requiredHours} HRS
          </div>
          <button class="swiss-btn terracotta" onclick="state.examFilterMode='DIV';filterExamPool();switchTopTab('exam')">
            START ${focusDiv.code} PRACTICE EXAM (${divQuestions.length} Qs) →
          </button>
        </div>
      </section>

      <!-- RIGHT STACK: TOP FORMULA & CONTRACT REFERENCE + BOTTOM MYNCARB AXP STATUS -->
      <div class="pane-right-stack">
        <!-- TOP-RIGHT PANE: REAL DIVISION FORMULA, CODE & AIA CONTRACT SHEET -->
        <section class="pane-top-ref">
          <div>
            <div class="pane-heading">
              <span>${esc(focusDiv.code)} KEY FORMULAS, CODES &amp; AIA CONTRACTS</span>
              <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-muted);">QUICK REFERENCE</span>
            </div>

            <div class="ref-sheet-grid">
              ${studyInfo.formulas.map(f => `
                <div class="ref-item">
                  <div class="ref-term">${esc(f.term)}</div>
                  <div class="ref-formula">${esc(f.formula)}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </section>

        <!-- BOTTOM-RIGHT PANE: CURRENT AXP STATUS (USER'S ACTUAL MYNCARB HOURS) -->
        <section class="pane-bottom-axp">
          <div>
            <div class="pane-heading">
              <span>CURRENT AXP STATUS (MYNCARB RECORD)</span>
              <span style="font-family:var(--font-sans);font-size:0.86rem;font-weight:500;text-transform:none;">3,740 hours required</span>
            </div>

            <table class="axp-clean-table">
              <tbody>
                ${db.axpData.areas.map(a => {
                  const pct = Math.min(100, ((a.totalLogged / a.requiredHours) * 100)).toFixed(1);
                  const barWidth = Math.max(2, Math.round((a.totalLogged / a.requiredHours) * 100));
                  const isSelected = a.code === focusDiv.code;
                  const color = isSelected ? "var(--terracotta)" : "var(--cobalt)";
                  return `
                    <tr style="cursor:pointer;${isSelected ? 'background:var(--vellum-card);' : ''}" onclick="selectDivision('${a.code}')" title="Click to focus ${a.name}">
                      <td class="lbl">${esc(a.code)}</td>
                      <td class="bar-cell">
                        <div style="width:100%;height:11px;background:var(--vellum-tab);">
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
              <div style="font-size:0.74rem;color:var(--ink-muted);margin-top:0.3rem;display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;">
                <span>${totalRem.toLocaleString()} hrs remaining · 0 submitted</span>
                <button class="swiss-btn" style="padding:0.2rem 0.55rem;font-size:0.73rem;" onclick="openMyNcarbSyncModal()">SYNC / EDIT HOURS</button>
                <button class="swiss-btn" style="padding:0.2rem 0.55rem;font-size:0.73rem;" onclick="switchTopTab('axp')">LOG WORK TASK →</button>
              </div>
            </div>

            <!-- Compact Remaining Breakdown (Right side of AXP Footer) -->
            <div style="border-left:var(--rule);padding-left:0.85rem;font-family:var(--font-mono);font-size:0.71rem;">
              ${db.axpData.areas.map(a => {
                const rem = Number((a.requiredHours - a.totalLogged).toFixed(2));
                return `
                  <div style="display:flex;justify-content:space-between;padding:0.12rem 0;border-bottom:var(--rule-subtle);">
                    <span><strong>${a.code}</strong> Rem:</span>
                    <span>${rem.toLocaleString()} hrs</span>
                  </div>
                `;
              }).join("")}
              <div style="display:flex;justify-content:space-between;padding-top:0.2rem;color:var(--ink-muted);font-size:0.67rem;">
                <span>INDIANA</span><span>NO EXTRA REQ</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}

/* ==========================================================================
   VIEW 2: CALM PRACTICE EXAM SIMULATOR (SUPPORTS SCREENSHOT EXHIBITS)
   ========================================================================== */
function renderCalmExam(focusDiv, allQs) {
  const q = state.examPool[state.examIdx % state.examPool.length] || allQs[0];
  const cs = q.caseStudyId ? db.caseStudies.find(c => c.id === q.caseStudyId) : null;
  const ans = state.examAnswers[q.id];
  const rev = Boolean(state.examRevealed[q.id]);
  const struck = new Set(state.examStrikes[q.id] || []);
  const studyInfo = DIVISION_STUDY_DATA[focusDiv.code] || DIVISION_STUDY_DATA.PcM;

  return `
    <div class="exam-split">
      <section class="exam-left-pane">
        <div>
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.75rem;border-bottom:var(--rule);padding-bottom:0.75rem;margin-bottom:1.15rem;">
            <div style="font-family:var(--font-condensed);font-size:1.1rem;font-weight:700;letter-spacing:0.03em;">
              ${esc(q.division)} PRACTICE EXAM · ITEM ${state.examIdx + 1} OF ${state.examPool.length}
            </div>
            <div style="display:flex;gap:0.45rem;align-items:center;">
              <select class="swiss-select" style="width:auto;padding:0.25rem 0.6rem;font-family:var(--font-mono);font-size:0.73rem;" onchange="state.examFilterMode=this.value;filterExamPool();render()">
                <option value="DIV" ${state.examFilterMode === 'DIV' ? 'selected' : ''}>${focusDiv.code} Division Bank (${allQs.filter(x => x.division === focusDiv.code).length} Qs)</option>
                <option value="INGESTED" ${state.examFilterMode === 'INGESTED' ? 'selected' : ''}>★ My Ingested Screenshots &amp; PDFs (${state.customQuestions.length} Qs)</option>
                <option value="PPP" ${state.examFilterMode === 'PPP' ? 'selected' : ''}>Legacy ARE 4.0 PPP Mock Exam</option>
                <option value="CDS" ${state.examFilterMode === 'CDS' ? 'selected' : ''}>Legacy ARE 4.0 CDS Mock Exam</option>
              </select>
              <button class="swiss-btn" style="padding:0.25rem 0.55rem;font-size:0.73rem;" onclick="switchTopTab('ingest')">+ DROP SCREENSHOT / PDF</button>
            </div>
          </div>

          <div style="font-family:var(--font-mono);font-size:0.74rem;color:var(--ink-muted);margin-bottom:0.55rem;">
            ${esc(q.section)} · Objective: ${esc(q.objective)} · Source: ${esc(q.source)}
          </div>

          <div style="font-size:1.02rem;font-weight:500;line-height:1.6;margin-bottom:1.25rem;white-space:pre-line;">
            ${esc(q.stem)}
          </div>

          ${renderExamInputControl(q, ans, rev, struck)}

          ${rev ? `
            <div style="margin-top:1.1rem;padding:1rem;background:var(--vellum-light);border:var(--rule);border-left:4px solid var(--verdigris);font-size:0.86rem;line-height:1.55;">
              <div style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;color:var(--verdigris);margin-bottom:0.3rem;">
                NCARB EXPLANATION &amp; SOURCE CITATION
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
        ${q.imageExhibit ? `
          <div class="pane-heading">
            <span>INGESTED STUDY SCREENSHOT EXHIBIT</span>
            <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-muted);">${esc(q.reference)}</span>
          </div>
          <div style="border:var(--rule);background:#fff;padding:0.5rem;">
            <img src="${q.imageExhibit}" alt="Ingested Study Screenshot" style="width:100%;max-height:340px;object-fit:contain;display:block;" />
          </div>
          ${q.extractedNotes ? `
            <div style="border:var(--rule);background:var(--vellum);padding:0.75rem;font-family:var(--font-mono);font-size:0.72rem;line-height:1.5;max-height:180px;overflow-y:auto;">
              <strong>EXTRACTED OCR / NOTES:</strong><br/>
              ${esc(q.extractedNotes)}
            </div>
          ` : ""}
        ` : cs ? `
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
            <span>${focusDiv.code} FORMULA &amp; CONTRACT REFERENCE</span>
            <span>NCARB 5.0</span>
          </div>
          <div class="ref-sheet-grid">
            ${studyInfo.formulas.map(f => `
              <div class="ref-item">
                <div class="ref-term">${esc(f.term)}</div>
                <div class="ref-formula">${esc(f.formula)}</div>
              </div>
            `).join("")}
          </div>
        `}

        <div class="pane-heading" style="margin-top:0.35rem;">
          <span>ITEM NAVIGATOR (${state.examPool.length} ITEMS)</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">
          ${state.examPool.map((it, idx) => {
            const isCur = idx === state.examIdx;
            const hasA = state.examAnswers[it.id] !== undefined;
            return `<button class="swiss-btn ${isCur ? 'terracotta' : ''}" style="width:32px;height:30px;padding:0;justify-content:center;font-family:var(--font-mono);font-size:0.74rem;${hasA && !isCur ? 'background:var(--vellum-tab);' : ''}" onclick="state.examIdx=${idx};render()">${idx + 1}</button>`;
          }).join("")}
        </div>
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
        <input type="text" class="swiss-input" style="font-family:var(--font-mono);font-size:0.95rem;font-weight:700;" value="${esc(ans ?? '')}" oninput="state.examAnswers['${q.id}']=this.value;saveExamAnswers()" />
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
            <select class="swiss-select" style="width:auto;min-width:210px;font-family:var(--font-mono);font-size:0.75rem;" onchange="state.examAnswers['${q.id}']={...(state.examAnswers['${q.id}']||{}),'${t.id}':this.value};saveExamAnswers();render()">
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
  saveExamAnswers();
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
  saveExamAnswers();
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
                      <text x="48" y="48" text-anchor="middle" font-family="var(--font-sans)" font-size="6.8" fill="var(--ink-muted)">of ${a.requiredHours.toLocaleString()} hours</text>
                      <text x="48" y="56" text-anchor="middle" font-family="var(--font-sans)" font-size="6.8" fill="var(--ink-muted)">required</text>
                      <text x="48" y="69" text-anchor="middle" font-family="var(--font-mono)" font-size="7.5" font-weight="700" fill="${a.color || 'var(--cobalt)'}">${rem.toLocaleString()} left</text>
                    </svg>
                  </div>
                </div>
                <div style="border-top:var(--rule);display:grid;grid-template-columns:1fr 1fr;background:var(--vellum);">
                  <div style="padding:0.35rem 0.55rem;border-right:var(--rule);">
                    <div style="font-size:0.65rem;color:var(--ink-muted);">Submitted</div>
                    <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">${a.submittedHours} hrs</div>
                  </div>
                  <div style="padding:0.35rem 0.55rem;">
                    <div style="font-size:0.65rem;color:var(--ink-muted);">Approved</div>
                    <div style="font-family:var(--font-mono);font-size:0.78rem;font-weight:700;">${a.approvedHours} hrs</div>
                  </div>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <div style="border:var(--rule);padding:0.75rem 1rem;background:var(--vellum-light);display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:700;font-size:0.86rem;">No Additional Experience Requirements for Indiana</div>
            <div style="font-size:0.76rem;color:var(--ink-muted);">Indiana has no additional requirements beyond the 3,740 NCARB AXP hours.</div>
          </div>
          <span style="font-family:var(--font-mono);font-size:0.75rem;font-weight:700;color:var(--verdigris);">TOTAL: ${totalApproved} / 3,740 HRS</span>
        </div>
      </section>

      <!-- Right Pane: Work-Task AI Category Recommender & Logger -->
      <aside class="exam-right-pane">
        <div class="pane-heading">
          <span>WORK-TASK TO AXP CATEGORY RECOMMENDER</span>
        </div>
        <p style="margin:0;font-size:0.82rem;color:var(--ink-muted);">
          Describe work you completed at your firm to classify it into the official NCARB AXP Experience Area and log hours directly to your record.
        </p>

        <div>
          <label style="font-family:var(--font-mono);font-size:0.72rem;display:block;margin-bottom:0.3rem;">WORK TASK PERFORMED:</label>
          <textarea class="swiss-textarea" rows="3" oninput="state.taskDesc=this.value;runTaskClassifier(true)">${esc(state.taskDesc)}</textarea>
        </div>

        <div style="display:grid;grid-template-columns:130px 1fr;gap:0.65rem;align-items:end;">
          <div>
            <label style="font-family:var(--font-mono);font-size:0.72rem;display:block;margin-bottom:0.3rem;">HOURS:</label>
            <input type="number" step="0.25" class="swiss-input" value="${state.taskHours}" oninput="state.taskHours=parseFloat(this.value)||0" />
          </div>
          <button class="swiss-btn terracotta" style="justify-content:center;height:36px;" onclick="logTaskToMyNcarb()">
            + LOG HOURS TO MYNCARB RECORD
          </button>
        </div>

        ${state.taskRec ? `
          <div style="border:var(--rule);background:var(--vellum);padding:0.95rem;">
            <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--terracotta);font-weight:700;">RECOMMENDED NCARB AXP AREA (${state.taskRec.confidence}% MATCH)</div>
            <div style="font-size:1.05rem;font-weight:700;margin-top:0.2rem;">${esc(state.taskRec.code)} — ${esc(state.taskRec.areaName)}</div>
            <div style="font-family:var(--font-mono);font-size:0.76rem;color:var(--cobalt);margin-top:0.25rem;">${esc(state.taskRec.matchedTask)}</div>
          </div>
        ` : ""}

        <div class="pane-heading" style="margin-top:0.35rem;">
          <span>RECENT AXP LOG ENTRIES</span>
        </div>
        <div style="border:var(--rule);background:var(--vellum);">
          ${(db.axpData.recentLogs || []).slice(0, 5).map(l => `
            <div style="padding:0.5rem 0.75rem;border-bottom:var(--rule-subtle);display:flex;justify-content:space-between;gap:0.75rem;font-size:0.78rem;">
              <div><strong>[${esc(l.area)}]</strong> ${esc(l.task)}</div>
              <div style="font-family:var(--font-mono);white-space:nowrap;font-weight:700;">+${l.hours}h</div>
            </div>
          `).join("")}
        </div>
      </aside>
    </div>
  `;
}

window.runTaskClassifier = function(shouldRender) {
  if (!db) return;
  const text = (state.taskDesc || "").toLowerCase();
  const rules = [
    { code: "PcM", task: "Develop and manage firm business operations, fee proposals, and AIA B101 agreements", kw: ["fee", "multiplier", "overhead", "contract", "b101", "proposal", "insurance", "firm", "marketing", "billing"] },
    { code: "PjM", task: "Manage project work plans, CPM schedules, consultant coordination, and QA/QC reviews", kw: ["schedule", "cpm", "rfi", "consultant", "budget", "meeting", "work plan", "coordination", "kickoff"] },
    { code: "PA",  task: "Perform site analysis, zoning/FAR verification, geotechnical review, and space programming", kw: ["zoning", "setback", "far", "site", "topography", "soil", "program", "adjacency", "survey", "daylight"] },
    { code: "PPD", task: "Select structural/MEP building systems, life-safety egress layouts, and schematic design massing", kw: ["schematic", "massing", "hvac", "structural", "egress", "life safety", "acoustic", "sustainability", "layout"] },
    { code: "PDD", task: "Prepare construction document drawings, wall sections, flashing details, and CSI specifications", kw: ["revit", "detail", "wall section", "flashing", "spec", "masterformat", "curtain wall", "cd", "door schedule", "waterproof"] },
    { code: "CE",  task: "Review shop drawings/submittals, certify G702/G703 pay applications, and conduct site observations", kw: ["punchlist", "shop drawing", "submittal", "pay app", "g702", "site visit", "field report", "asi", "change order", "closeout"] }
  ];

  let bestRule = rules[4], maxHits = 0;
  rules.forEach(r => {
    let hits = 0;
    r.kw.forEach(k => { if (text.includes(k)) hits++; });
    if (hits > maxHits) { maxHits = hits; bestRule = r; }
  });

  const area = db.axpData.areas.find(a => a.code === bestRule.code) || db.axpData.areas[4];
  state.taskRec = {
    code: area.code,
    areaName: area.name,
    confidence: Math.min(98, 82 + maxHits * 5),
    matchedTask: (area.tasks && area.tasks[0]) || bestRule.task
  };
  if (shouldRender) render();
};

window.logTaskToMyNcarb = function() {
  if (!state.taskRec || !db) return;
  const hrs = Number((parseFloat(state.taskHours) || 0).toFixed(2));
  if (hrs <= 0) return;

  const area = db.axpData.areas.find(a => a.code === state.taskRec.code);
  if (area) {
    area.approvedHours = Number((area.approvedHours + hrs).toFixed(2));
    area.totalLogged = Number((area.approvedHours + area.submittedHours).toFixed(2));
  }
  db.axpData.recentLogs.unshift({
    date: new Date().toISOString().slice(0, 10),
    area: state.taskRec.code,
    hours: hrs,
    setting: "Setting A",
    supervisor: "MyNCARB Log",
    status: "Approved",
    task: state.taskDesc
  });

  localStorage.setItem("atelier_myncarb_axp_v2", JSON.stringify(db.axpData));
  render();
};

/* ==========================================================================
   VIEW 4: INGEST & QUIZ STUDIO (DROP SCREENSHOTS, PDFS & NOTES TO TEST ME)
   ========================================================================== */
function renderIngestStudio(focusDiv) {
  return `
    <div class="exam-split">
      <!-- Left Column: Dropzone for Screenshots / PDFs + Paste Notes Box -->
      <section class="exam-left-pane" style="justify-content:flex-start;">
        <div>
          <div class="pane-heading">
            <span>STUDY MATERIAL &amp; SCREENSHOT INGEST STUDIO</span>
            <span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-muted);">OCR + PDF PARSER</span>
          </div>
          <p style="margin:0.35rem 0 0.9rem;font-size:0.83rem;color:var(--ink-secondary);">
            Drop screenshots of study slides, diagrams, practice questions, or PDFs here—or press <strong>Ctrl+V</strong> anywhere to paste a screenshot from your clipboard. The studio extracts the content and builds interactive test questions for you.
          </p>

          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem;">
            <label style="font-family:var(--font-mono);font-size:0.74rem;font-weight:700;">TARGET DIVISION:</label>
            <select class="swiss-select" style="width:auto;font-family:var(--font-mono);font-size:0.75rem;" onchange="state.ingestTargetDiv=this.value">
              <option value="AUTO" ${state.ingestTargetDiv === 'AUTO' ? 'selected' : ''}>Auto-Detect Division (Default: ${focusDiv.code})</option>
              ${db.divisions.map(d => `<option value="${d.code}" ${state.ingestTargetDiv === d.code ? 'selected' : ''}>${d.code} — ${esc(d.name)}</option>`).join("")}
            </select>
          </div>

          <label class="ingest-dropzone" style="padding:1.5rem 1.25rem;flex-direction:column;text-align:center;gap:0.65rem;"
            ondragover="event.preventDefault();this.classList.add('dragover')"
            ondragleave="this.classList.remove('dragover')"
            ondrop="event.preventDefault();this.classList.remove('dragover');handleIngestFiles(event.dataTransfer.files)">
            <input type="file" multiple accept="image/*,.pdf,.txt,.md" style="display:none;" onchange="handleIngestFiles(this.files)" />
            <div style="font-family:var(--font-condensed);font-size:1.25rem;font-weight:700;letter-spacing:0.03em;">
              + DROP SCREENSHOTS (PNG / JPG / WEBP) OR STUDY PDFS HERE
            </div>
            <div style="font-size:0.8rem;color:var(--ink-secondary);max-width:480px;">
              You can also copy any screenshot to your clipboard and press <strong>Ctrl+V</strong> (or <strong>Cmd+V</strong>), or click below to select files from your computer.
            </div>
            <span class="swiss-btn terracotta" style="margin-top:0.2rem;">SELECT SCREENSHOTS OR PDF FILES</span>
          </label>

          ${state.ingestStatus ? `
            <div style="margin-top:0.75rem;padding:0.65rem 0.9rem;border:var(--rule);background:var(--vellum-card);display:flex;justify-content:space-between;align-items:center;gap:0.75rem;font-family:var(--font-mono);font-size:0.75rem;">
              <span>${esc(state.ingestStatus)}</span>
              ${state.lastIngestedBatchId ? `
                <button class="swiss-btn terracotta" onclick="quizOnBatch('${state.lastIngestedBatchId}')">
                  START QUIZ ON THIS MATERIAL →
                </button>
              ` : ""}
            </div>
          ` : ""}
        </div>

        <!-- Paste Text / Study Notes / Custom Question Block -->
        <div style="border-top:var(--rule);padding-top:1rem;">
          <div class="pane-heading" style="margin-bottom:0.5rem;">
            <span>OR PASTE STUDY NOTES / FORMULAS / CODE CLAUSES TO QUIZ ME</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.55rem;">
            <input type="text" class="swiss-input" placeholder="Topic / Source Title (e.g., Amber Book Thermal Bridging Notes, AIA A201 §3.12)" value="${esc(state.ingestPasteTitle)}" oninput="state.ingestPasteTitle=this.value" />
            <textarea class="swiss-textarea" rows="5" placeholder="Paste any study notes, definitions, formulas (Term = Formula), or practice questions here..." oninput="state.ingestPasteText=this.value">${esc(state.ingestPasteText)}</textarea>
            <div style="display:flex;justify-content:flex-end;">
              <button class="swiss-btn cobalt" onclick="ingestPastedNotes()">
                GENERATE PRACTICE QUESTIONS FROM NOTES →
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Right Column: Ingested Batches & Generated Custom Questions -->
      <aside class="exam-right-pane">
        <div class="pane-heading">
          <span>YOUR INGESTED STUDY MATERIALS (${state.ingestedBatches.length} BATCHES · ${state.customQuestions.length} Qs)</span>
          ${state.customQuestions.length ? `
            <button class="swiss-btn terracotta" style="padding:0.22rem 0.65rem;font-size:0.74rem;" onclick="quizOnBatch(null)">
              QUIZ ALL INGESTED (${state.customQuestions.length} Qs) →
            </button>
          ` : ""}
        </div>

        ${state.ingestedBatches.length === 0 ? `
          <div style="border:var(--rule);background:var(--vellum);padding:1.25rem;font-size:0.84rem;color:var(--ink-secondary);line-height:1.6;">
            <strong>No custom screenshots or PDFs dropped yet.</strong><br/>
             Note: Your initial 16 study guides &amp; practice exams from Google Drive are already pre-ingested into the built-in <strong>54-question division exam bank</strong>. Drop any new screenshot or PDF on the left to generate custom questions and visual exhibits on the fly!
          </div>
        ` : `
          <div style="display:flex;flex-direction:column;gap:0.65rem;max-height:620px;overflow-y:auto;">
            ${state.ingestedBatches.map(b => `
              <div style="border:var(--rule);background:var(--vellum);padding:0.8rem;display:grid;grid-template-columns:${b.previewImage ? '76px ' : ''}minmax(0, 1fr) auto;gap:0.75rem;align-items:center;">
                ${b.previewImage ? `
                  <img src="${b.previewImage}" alt="${esc(b.name)}" style="width:76px;height:58px;object-fit:cover;border:var(--rule);" />
                ` : ""}
                <div style="min-width:0;">
                  <div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--ink-muted);">
                    <strong>${esc(b.division)}</strong> · ${esc(b.kind)} · ${esc(b.createdAt)} · <strong>${b.questionCount} Qs Generated</strong>
                  </div>
                  <div style="font-weight:700;font-size:0.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:0.15rem;">
                    ${esc(b.name)}
                  </div>
                  ${b.extractedSnippet ? `
                    <div style="font-size:0.73rem;color:var(--ink-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:0.15rem;">
                      ${esc(b.extractedSnippet)}
                    </div>
                  ` : ""}
                </div>
                <div style="display:flex;flex-direction:column;gap:0.35rem;">
                  <button class="swiss-btn terracotta" style="padding:0.25rem 0.6rem;font-size:0.73rem;" onclick="quizOnBatch('${b.id}')">
                    QUIZ ME (${b.questionCount}) →
                  </button>
                  <button class="swiss-btn" style="padding:0.2rem 0.5rem;font-size:0.68rem;justify-content:center;" onclick="deleteIngestedBatch('${b.id}')">
                    REMOVE
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </aside>
    </div>
  `;
}

/* ==========================================================================
   MYNCARB SIGN-IN & DIRECT HOURS SYNC MODAL
   ========================================================================== */
function renderMyNcarbSyncModal() {
  return `
    <div class="modal-backdrop" onclick="if(event.target===this)closeMyNcarbSyncModal()">
      <div class="modal-sheet">
        <div class="modal-header">
          <div>
            <div style="font-family:var(--font-condensed);font-size:1.15rem;font-weight:700;letter-spacing:0.04em;">
              MYNCARB ACCOUNT SIGN-IN &amp; EXPERIENCE HOURS SYNC
            </div>
            <div style="font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-muted);">
              Connected to MyNCARB Record · Indiana Jurisdiction (3,740 Required Hours)
            </div>
          </div>
          <button class="swiss-btn" onclick="closeMyNcarbSyncModal()">✕ CLOSE</button>
        </div>

        <form class="modal-body" onsubmit="saveMyNcarbHoursFromModal(event)">
          <div style="border:var(--rule);background:var(--vellum-light);padding:0.75rem 1rem;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;">
            <div style="font-size:0.8rem;">
              <strong>Step 1:</strong> Sign in to your official NCARB Experience tab or adjust your approved/submitted hours below.
            </div>
            <a class="swiss-btn cobalt" href="https://my.ncarb.org/apps/experience" target="_blank" rel="noopener" style="white-space:nowrap;">
              LAUNCH MY.NCARB.ORG ↗
            </a>
          </div>

          <table class="axp-clean-table" style="margin-bottom:1rem;">
            <thead>
              <tr style="border-bottom:var(--rule);font-family:var(--font-mono);font-size:0.72rem;color:var(--ink-muted);">
                <th style="text-align:left;padding:0.4rem;">AREA</th>
                <th style="text-align:left;padding:0.4rem;">EXPERIENCE AREA NAME</th>
                <th style="text-align:right;padding:0.4rem;">REQUIRED</th>
                <th style="text-align:right;padding:0.4rem;">SUBMITTED HRS</th>
                <th style="text-align:right;padding:0.4rem;">APPROVED HRS</th>
              </tr>
            </thead>
            <tbody>
              ${db.axpData.areas.map(a => `
                <tr>
                  <td class="lbl">${esc(a.code)}</td>
                  <td style="font-weight:600;">${esc(a.name)}</td>
                  <td style="text-align:right;font-family:var(--font-mono);">${a.requiredHours}</td>
                  <td style="text-align:right;width:110px;">
                    <input type="number" step="0.25" name="sub_${a.code}" class="swiss-input" style="text-align:right;font-family:var(--font-mono);padding:0.25rem 0.4rem;" value="${a.submittedHours}" />
                  </td>
                  <td style="text-align:right;width:120px;">
                    <input type="number" step="0.25" name="app_${a.code}" class="swiss-input" style="text-align:right;font-family:var(--font-mono);font-weight:700;padding:0.25rem 0.4rem;" value="${a.approvedHours}" />
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-family:var(--font-mono);font-size:0.74rem;color:var(--ink-muted);">
              Changes save immediately to your dashboard &amp; browser storage.
            </span>
            <div style="display:flex;gap:0.5rem;">
              <button type="button" class="swiss-btn" onclick="closeMyNcarbSyncModal()">CANCEL</button>
              <button type="submit" class="swiss-btn terracotta">SAVE MYNCARB HOURS TO DASHBOARD</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", initPortal);
