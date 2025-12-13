export interface NodeData {
  id: string;
  group: 'CORE' | 'DIMENSION' | 'TOOL' | 'STATE' | 'CONCEPT';
  label: string;
  val?: number;
  color?: string;
  desc?: string;
  parent?: string;
  tagline?: string;
  strengths?: string[];
  combinations?: string[];
  toolsList?: string[];
}

export interface LinkData {
  source: string;
  target: string;
}

export const GRAPH_DATA: { nodes: NodeData[]; links: LinkData[] } = {
  nodes: [
    // --- CORE ---
    {
      id: "NEXUS",
      group: "CORE",
      val: 50,
      label: "NEXUS",
      tagline: "Norvan's Dimensional Brain",
      strengths: [
        "🔵 NorX (Insight)",
        "🟣 NorY (Architecture)",
        "🟠 NorZ (Expression)",
        "🟢 NorW (Knowledge)",
        "🔵 NorV (Execution)"
      ]
    },

    // --- DIMENSIONS (The Pentagon) ---
    {
      id: "NorX",
      group: "DIMENSION",
      label: "NorX",
      color: "#007FFF",
      tagline: "Seeing what's invisible.",
      desc: "NorX reveals the problems you feel but can't find. Blind spots. Hidden leaks. Patterns beneath the surface. Most businesses solve symptoms; NorX finds the cause.",
      toolsList: ["NorScan", "NorSense", "NorAudit", "NorData"]
    },
    {
      id: "NorY",
      group: "DIMENSION",
      label: "NorY",
      color: "#7F4FC9",
      tagline: "The blueprint of intelligence.",
      desc: "NorY designs how everything connects. When chaos exists despite hard work, structure is missing. Before you build, you need a map.",
      toolsList: ["NorMap", "NorFlow", "NorCore", "NorFrame"]
    },
    {
      id: "NorZ",
      group: "DIMENSION",
      label: "NorZ",
      color: "#F28500",
      tagline: "Your voice across all channels.",
      desc: "NorZ aligns what you intend with what the world perceives. Brand, content, campaigns — intelligence that speaks with one voice.",
      toolsList: ["NorBrand", "NorCast", "NorWave", "NorGen"]
    },
    {
      id: "NorW",
      group: "DIMENSION",
      label: "NorW",
      color: "#009E60",
      tagline: "People and AI growing together.",
      desc: "NorW captures what's in people's heads and makes it permanent. Training, SOPs, coaching — knowledge that doesn't decay.",
      toolsList: ["NorTrain", "NorCoach", "NorDNA", "NorGuide"]
    },
    {
      id: "NorV",
      group: "DIMENSION",
      label: "NorV",
      color: "#66D3FA",
      tagline: "Intelligence in action.",
      desc: "NorV turns plans into running systems. Bots, automation, dashboards — the engines that replace manual effort with speed.",
      toolsList: ["NorBot", "NorChat", "NorCRM", "NorVoice", "NorWeb", "NorDOSC", "NorOne", "NorERP"]
    },

    // --- NorX TOOLS ---
    {
      id: "NorData",
      group: "TOOL",
      parent: "NorX",
      label: "NorData",
      tagline: "Data finally speaking truth",
      strengths: ["Scattered → Structured", "12 Months → 12 Mins", "Pattern Recognition"]
    },
    {
      id: "NorScan",
      group: "TOOL",
      parent: "NorX",
      label: "NorScan",
      tagline: "MRI for operations",
      strengths: ["$30k+ Leaks Found", "Friction Mapped", "Instant Diagnosis"]
    },
    {
      id: "NorSense",
      group: "TOOL",
      parent: "NorX",
      label: "NorSense",
      tagline: "Sixth sense for business",
      strengths: ["Future Predicted", "Noise → Signal", "Trend Detection"]
    },
    {
      id: "NorAudit",
      group: "TOOL",
      parent: "NorX",
      label: "NorAudit",
      tagline: "Health in one score",
      strengths: ["1 Score → Truth", "5 Dimensions Scanned", "90-Day Roadmap"]
    },

    // --- NorY TOOLS ---
    {
      id: "NorMap",
      group: "TOOL",
      parent: "NorY",
      label: "NorMap",
      tagline: "Business drawn correctly",
      strengths: ["Chaos → Clean Flow", "40+ Hours Unlocked", "Teams Aligned"]
    },
    {
      id: "NorFlow",
      group: "TOOL",
      parent: "NorY",
      label: "NorFlow",
      tagline: "Automation without friction",
      strengths: ["Manual → Auto", "Weeks → Hours", "80% Work Removed"]
    },
    {
      id: "NorCore",
      group: "TOOL",
      parent: "NorY",
      label: "NorCore",
      tagline: "The execution brain",
      strengths: ["Logic → Precision", "Zero Error Loops", "Adaptive Rules"]
    },
    {
      id: "NorFrame",
      group: "TOOL",
      parent: "NorY",
      label: "NorFrame",
      tagline: "Templates that think",
      strengths: ["Blank → Proven", "10X Faster Design", "Zero Errors"]
    },

    // --- NorZ TOOLS ---
    {
      id: "NorBrand",
      group: "TOOL",
      parent: "NorZ",
      label: "NorBrand",
      tagline: "Identity unmistakably clear",
      strengths: ["Confusion → Clarity", "3X Perception Lift", "Unified Tone"]
    },
    {
      id: "NorCast",
      group: "TOOL",
      parent: "NorZ",
      label: "NorCast",
      tagline: "Campaigns running themselves",
      strengths: ["30 Days → 1 Afternoon", "2-5X Engagement", "Auto-Execution"]
    },
    {
      id: "NorWave",
      group: "TOOL",
      parent: "NorZ",
      label: "NorWave",
      tagline: "Launch power on command",
      strengths: ["Dead → Revived", "10X Momentum", "Predictable Surges"]
    },
    {
      id: "NorGen",
      group: "TOOL",
      parent: "NorZ",
      label: "NorGen",
      tagline: "Content at machine speed",
      strengths: ["30 Posts in 30 Mins", "Perfect Voice Match", "Infinite Output"]
    },

    // --- NorW TOOLS ---
    {
      id: "NorTrain",
      group: "TOOL",
      parent: "NorW",
      label: "NorTrain",
      tagline: "Training automated",
      strengths: ["4 Months → 4 Weeks", "Auto-SOPs", "Zero Repeat Teaching"]
    },
    {
      id: "NorCoach",
      group: "TOOL",
      parent: "NorW",
      label: "NorCoach",
      tagline: "AI coaching for all",
      strengths: ["Personal Guidance", "Gaps Closed Fast", "24/7 Answers"]
    },
    {
      id: "NorDNA",
      group: "TOOL",
      parent: "NorW",
      label: "NorDNA",
      tagline: "People in their element",
      strengths: ["Hidden Strengths", "Wrong → Right Role", "2-4X Performance"]
    },
    {
      id: "NorGuide",
      group: "TOOL",
      parent: "NorW",
      label: "NorGuide",
      tagline: "Knowledge teaching itself",
      strengths: ["Chaos → Modules", "Instant Answers", "Memory Saved"]
    },

    // --- NorV TOOLS ---
    {
      id: "NorBot",
      group: "TOOL",
      parent: "NorV",
      label: "NorBot",
      tagline: "150 staff in one brain",
      strengths: ["1000 Concurrent Chats", "Zero Fatigue", "99.9% Response"]
    },
    {
      id: "NorChat",
      group: "TOOL",
      parent: "NorV",
      label: "NorChat",
      tagline: "Every channel, one brain",
      strengths: ["Web + WhatsApp", "Instant Replies", "No Missed Leads"]
    },
    {
      id: "NorCRM",
      group: "TOOL",
      parent: "NorV",
      label: "NorCRM",
      tagline: "Relationships, automated.",
      desc: "Knows who needs attention, what they need, when to act."
    },
    {
      id: "NorVoice",
      group: "TOOL",
      parent: "NorV",
      label: "NorVoice",
      tagline: "Business speaking everywhere",
      strengths: ["Instant Voice AI", "90% Call Load Gone", "Natural Talk"]
    },
    {
      id: "NorWeb",
      group: "TOOL",
      parent: "NorV",
      label: "NorWeb",
      tagline: "Website that works",
      strengths: ["Auto-Optimizing", "Auto-Conversion", "Lead Capture"]
    },
    {
      id: "NorDOSC",
      group: "TOOL",
      parent: "NorV",
      label: "NorDOSC",
      tagline: "Docs writing themselves",
      strengths: ["30 Pages → Mins", "Zero Formatting", "Contracts Auto-Gen"]
    },
    {
      id: "NorOne",
      group: "TOOL",
      parent: "NorV",
      label: "NorOne",
      tagline: "One command center",
      strengths: ["All Systems Unified", "360° Visibility", "Zero Switching"]
    },
    {
      id: "NorERP",
      group: "TOOL",
      parent: "NorV",
      label: "NorERP",
      tagline: "Operations digitized",
      strengths: ["Inventory Synced", "Multi-Branch Control", "2-5X Efficiency"]
    },

    // --- STATES & CONCEPTS ---
    {
      id: "NorBlind",
      group: "STATE",
      parent: "NorScan",
      label: "NorBlind",
      tagline: "Guessing everything",
      strengths: ["Decisions w/o Truth", "High Risk", "Invisible Loss"]
    },
    {
      id: "NorStuck",
      group: "STATE",
      parent: "NorMap",
      label: "NorStuck",
      tagline: "Movement w/o progress",
      strengths: ["Spinning Wheels", "Zero Growth", "Burnout"]
    },
    {
      id: "NorLeak",
      group: "STATE",
      parent: "NorAudit",
      label: "NorLeak",
      tagline: "Revenue disappearing",
      strengths: ["Invisible Drainage", "Slow Bleed", "Profit Loss"]
    },
    {
      id: "Noah's Arc",
      group: "CONCEPT",
      parent: "NEXUS",
      label: "Noah's Arc",
      tagline: "The coming flood",
      strengths: ["Intelligence Rising", "Survival Strategy", "Future Proof"]
    },
    {
      id: "Electricity",
      group: "CONCEPT",
      parent: "NEXUS",
      label: "Electricity",
      tagline: "Power, not product",
      strengths: ["Outcomes Only", "Hidden Complexity", "Instant Value"]
    },
  ],
  links: [
    // Core Links (NEXUS to Dimensions)
    { source: "NEXUS", target: "NorX" },
    { source: "NEXUS", target: "NorY" },
    { source: "NEXUS", target: "NorZ" },
    { source: "NEXUS", target: "NorW" },
    { source: "NEXUS", target: "NorV" },

    // Ring Links (Pentagon - Closed Loop)
    { source: "NorX", target: "NorY" },
    { source: "NorY", target: "NorZ" },
    { source: "NorZ", target: "NorW" },
    { source: "NorW", target: "NorV" },
    { source: "NorV", target: "NorX" },

    // NorX Tool Orbits
    { source: "NorX", target: "NorData" },
    { source: "NorX", target: "NorScan" },
    { source: "NorX", target: "NorSense" },
    { source: "NorX", target: "NorAudit" },

    // NorY Tool Orbits
    { source: "NorY", target: "NorMap" },
    { source: "NorY", target: "NorFlow" },
    { source: "NorY", target: "NorCore" },
    { source: "NorY", target: "NorFrame" },

    // NorZ Tool Orbits
    { source: "NorZ", target: "NorBrand" },
    { source: "NorZ", target: "NorCast" },
    { source: "NorZ", target: "NorWave" },
    { source: "NorZ", target: "NorGen" },

    // NorW Tool Orbits
    { source: "NorW", target: "NorTrain" },
    { source: "NorW", target: "NorCoach" },
    { source: "NorW", target: "NorDNA" },
    { source: "NorW", target: "NorGuide" },

    // NorV Tool Orbits
    { source: "NorV", target: "NorBot" },
    { source: "NorV", target: "NorChat" },
    { source: "NorV", target: "NorCRM" },
    { source: "NorV", target: "NorVoice" },
    { source: "NorV", target: "NorWeb" },
    { source: "NorV", target: "NorDOSC" },
    { source: "NorV", target: "NorOne" },
    { source: "NorV", target: "NorERP" },

    // Concept Links
    { source: "Electricity", target: "NEXUS" },
    { source: "Noah's Arc", target: "NorV" },

    // State Links (connecting to relevant dimensions)
    { source: "NorBlind", target: "NorX" },
    { source: "NorStuck", target: "NorY" },
    { source: "NorLeak", target: "NorV" },
  ]
};
