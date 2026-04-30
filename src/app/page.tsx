"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONSTANTS ───
const BRAND = { red: "#c41e1e", redLight: "#fef2f2", redDark: "#991b1b" };
const SUBJECT = { bio: "#16a34a", physics: "#2563eb", chemistry: "#d97706" };
const NEET_DATE = new Date("2026-05-04T09:30:00+05:30");

// ─── SVG ICONS ───
const Icons = {
  microscope: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:24,height:24}}>
      <circle cx="12" cy="7" r="3"/><line x1="12" y1="10" x2="12" y2="18"/><line x1="8" y1="22" x2="16" y2="22"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="7" y1="18" x2="17" y2="18"/>
    </svg>
  ),
  dna: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{width:24,height:24}}>
      <path d="M4 2c0 5 4 7 8 7s8 2 8 7"/><path d="M20 2c0 5-4 7-8 7s-8 2-8 7"/><line x1="6" y1="6" x2="18" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="6" y1="18" x2="18" y2="18"/>
    </svg>
  ),
  flask: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:24,height:24}}>
      <path d="M9 3h6v6l5 8H4l5-8V3z"/><line x1="9" y1="3" x2="15" y2="3"/>
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{width:24,height:24}}>
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{width:24,height:24}}>
      <path d="M12 2a5 5 0 00-4.8 3.6A4 4 0 004 9.5a4 4 0 001.2 7A3.5 3.5 0 008 22h8a3.5 3.5 0 002.8-5.5A4 4 0 0020 9.5a4 4 0 00-3.2-3.9A5 5 0 0012 2z"/><path d="M12 2v20"/>
    </svg>
  ),
  headphones: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:24,height:24}}>
      <path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5z"/><path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z"/>
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:24,height:24}}>
      <path d="M6 9H3V5h3"/><path d="M18 9h3V5h-3"/><path d="M6 5h12v7a6 6 0 01-12 0V5z"/><line x1="12" y1="17" x2="12" y2="20"/><line x1="8" y1="22" x2="16" y2="22"/>
    </svg>
  ),
  robot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:24,height:24}}>
      <rect x="4" y="8" width="16" height="12" rx="2"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="14" r="1.5"/><line x1="12" y1="4" x2="12" y2="8"/><circle cx="12" cy="3" r="1"/>
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:24,height:24}}>
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{width:14,height:14}}>
      <path d="M8 5v14l11-7z"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{width:24,height:24}}>
      <circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{width:16,height:16}}>
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/>
    </svg>
  ),
};

// ─── SCROLL REVEAL HOOK ───
const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

// ─── ANIMATED COUNTER ───
const AnimatedCounter = ({ end, suffix = "", duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const { ref, visible } = useScrollReveal(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.max(1, Math.floor(end / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ─── SVG AVATAR GENERATOR ───
const StudentAvatar = ({ seed, size = 32 }: { seed: number; size?: number }) => {
  const colors = ["#c41e1e","#2563eb","#16a34a","#d97706","#7c3aed","#ec4899","#0891b2"];
  const hairColors = ["#1a1a1a","#3d2314","#6b4423","#1a1a2e","#4a2511"];
  const skinTones = ["#f5d0a9","#e8b88a","#c68642","#8d5524","#fde2c4"];
  const bg = colors[seed % colors.length];
  const hair = hairColors[(seed * 3) % hairColors.length];
  const skin = skinTones[(seed * 7) % skinTones.length];
  const isFemale = seed % 2 === 0;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{borderRadius:"50%",flexShrink:0}}>
      <rect width="40" height="40" fill={bg} rx="20"/>
      <circle cx="20" cy="18" r="8" fill={skin}/>
      {isFemale ? <path d="M12 14c0-6 4-9 8-9s8 3 8 9c0 1-1 2-2 2h-1c0-4-2-6-5-6s-5 2-5 6h-1c-1 0-2-1-2-2z" fill={hair}/> : <path d="M12 15c0-5 3-8 8-8s8 3 8 8H12z" fill={hair}/>}
      <circle cx="17" cy="17" r="1" fill="#1a1a1a"/><circle cx="23" cy="17" r="1" fill="#1a1a1a"/>
      <path d={isFemale ? "M18 21a2 2 0 004 0" : "M17 21h6"} fill="none" stroke="#1a1a1a" strokeWidth="0.8" strokeLinecap="round"/>
      <rect x="10" y="28" width="20" height="12" rx="4" fill={bg} opacity="0.8"/>
    </svg>
  );
};

// ─── NEET COUNTDOWN ───
const Countdown = () => {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, NEET_DATE.getTime() - Date.now());
      setTime({ d: Math.floor(diff/86400000), h: Math.floor((diff%86400000)/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
    };
    tick(); const i = setInterval(tick, 1000); return () => clearInterval(i);
  }, []);
  return (
    <div style={{display:"flex",gap:8}}>
      {[["d",time.d,"DAYS"],["h",time.h,"HRS"],["m",time.m,"MIN"],["s",time.s,"SEC"]].map(([k,v,l])=>(
        <div key={k as string} style={{textAlign:"center"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:28,fontWeight:700,color:"#111",lineHeight:1}}>{String(v).padStart(2,"0")}</div>
          <div style={{fontSize:9,fontWeight:600,color:"#999",letterSpacing:1.5,marginTop:2}}>{l as string}</div>
        </div>
      ))}
    </div>
  );
};

// ─── FLOATING PARTICLES ───
const FloatingParticles = () => {
  const particles = [
    { shape:"cell", x:"8%", y:"15%", size:60, delay:0, dur:18 },
    { shape:"helix", x:"85%", y:"25%", size:50, delay:2, dur:22 },
    { shape:"cell", x:"92%", y:"65%", size:40, delay:4, dur:20 },
    { shape:"helix", x:"5%", y:"75%", size:45, delay:6, dur:16 },
    { shape:"cell", x:"50%", y:"10%", size:35, delay:8, dur:24 },
    { shape:"helix", x:"70%", y:"80%", size:55, delay:1, dur:19 },
    { shape:"cell", x:"25%", y:"85%", size:30, delay:3, dur:21 },
    { shape:"helix", x:"40%", y:"45%", size:28, delay:5, dur:17 },
  ];
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position:"absolute", left:p.x, top:p.y, width:p.size, height:p.size, opacity:0.04,
          animation:`floatParticle ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
        }}>
          {p.shape === "cell" ? (
            <svg viewBox="0 0 60 60" fill="none" stroke="#16a34a" strokeWidth="1.5">
              <ellipse cx="30" cy="30" rx="25" ry="20"/>
              <ellipse cx="30" cy="30" rx="8" ry="6" fill="none" stroke="#16a34a"/>
              <circle cx="26" cy="28" r="2" fill="#16a34a" opacity="0.3"/>
            </svg>
          ) : (
            <svg viewBox="0 0 40 80" fill="none" stroke="#c41e1e" strokeWidth="1.2">
              <path d="M5 0 Q20 10 35 20 Q20 30 5 40 Q20 50 35 60 Q20 70 5 80"/>
              <path d="M35 0 Q20 10 5 20 Q20 30 35 40 Q20 50 5 60 Q20 70 35 80"/>
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── DNA HELIX INTERACTIVE ───
const basePairs = [
  { left:"A", right:"T", bonds:2, fact:"Adenine pairs with Thymine via 2 hydrogen bonds" },
  { left:"G", right:"C", bonds:3, fact:"Guanine pairs with Cytosine via 3 hydrogen bonds" },
  { left:"T", right:"A", bonds:2, fact:"Chargaff's rule: [A] = [T], [G] = [C]" },
  { left:"C", right:"G", bonds:3, fact:"DNA pitch: 3.4 nm per turn (10 bp). Distance between bp: 0.34 nm" },
  { left:"A", right:"T", bonds:2, fact:"DNA diameter: 2 nm (20 Angstroms). Right handed helix (B form)" },
];

const DNAHelix = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div style={{maxWidth:340,margin:"0 auto"}}>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {basePairs.map((bp, i) => (
          <div key={i} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,cursor:"pointer",padding:"6px 0",borderRadius:8,background:hovered===i?"#fef2f2":"transparent",transition:"all 0.3s cubic-bezier(.4,0,.2,1)",transform:hovered===i?"scale(1.04)":"scale(1)"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:18,color:bp.left==="A"||bp.left==="T"?BRAND.red:SUBJECT.bio,width:28,textAlign:"right"}}>{bp.left}</span>
            <div style={{display:"flex",gap:2,width:60,justifyContent:"center"}}>{Array(bp.bonds).fill(0).map((_,j)=>(
              <div key={j} style={{height:2,flex:1,background:hovered===i?BRAND.red:"#d1d5db",borderRadius:1,transition:"all 0.3s"}}/>
            ))}</div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:18,color:bp.right==="A"||bp.right==="T"?BRAND.red:SUBJECT.bio,width:28,textAlign:"left"}}>{bp.right}</span>
          </div>
        ))}
      </div>
      <div style={{marginTop:12,padding:"10px 14px",background:hovered!==null?"#fef2f2":"#f9fafb",borderRadius:8,fontSize:12,color:"#4b5563",textAlign:"center",border:"1px solid #e5e7eb",transition:"all 0.3s",minHeight:40}}>
        {hovered!==null ? basePairs[hovered].fact : "Hover or tap a base pair to see NCERT facts"}
      </div>
    </div>
  );
};

// ─── 15 INTERACTIVE BIOLOGY EXAMPLES ───
const bioExamples = [
  { id:"cell", title:"Animal Cell", chapter:"Ch 8", color:"#7c3aed", items:[
    { label:"Nucleus", detail:"Double membrane, contains chromatin. Controls gene expression." },
    { label:"Mitochondria", detail:"30 to 32 ATP per glucose. Own 70S ribosomes and circular DNA." },
    { label:"Golgi", detail:"Cis face (forming), trans face (maturing). Glycosylation happens here." },
  ]},
  { id:"dna", title:"DNA Structure", chapter:"Ch 6", color:"#c41e1e", items:[
    { label:"B-form helix", detail:"Right handed. 2nm diameter. 3.4nm pitch. 10bp per turn." },
    { label:"Base pairing", detail:"A=T (2 H-bonds), G=C (3 H-bonds). Chargaff's rule: [A]=[T], [G]=[C]." },
    { label:"Antiparallel", detail:"One strand runs 5' to 3', the other 3' to 5'. Held by H-bonds." },
  ]},
  { id:"mitosis", title:"Mitosis", chapter:"Ch 10", color:"#2563eb", items:[
    { label:"Prophase", detail:"Chromatin condenses. Centrioles move to poles. Nuclear envelope begins to break." },
    { label:"Metaphase", detail:"Chromosomes align at metaphase plate. Spindle fibres attach at kinetochore." },
    { label:"Anaphase", detail:"Centromeres split. Sister chromatids pulled to opposite poles by spindle shortening." },
  ]},
  { id:"photosynthesis", title:"Photosynthesis", chapter:"Ch 13", color:"#16a34a", items:[
    { label:"Light reaction", detail:"Thylakoid membrane. PS II (P680) and PS I (P700). Water split, O2 released, NADPH formed." },
    { label:"Calvin cycle", detail:"Stroma. CO2 fixed by RuBisCO. 3 turns = 1 G3P. Requires 18 ATP and 12 NADPH per glucose." },
    { label:"C4 pathway", detail:"Kranz anatomy. PEP carboxylase fixes CO2 first. No photorespiration. Maize, sugarcane." },
  ]},
  { id:"heart", title:"Human Heart", chapter:"Ch 18", color:"#ef4444", items:[
    { label:"4 Chambers", detail:"RA, RV, LA, LV. Left ventricle has thickest wall (pumps to systemic circulation)." },
    { label:"SA Node", detail:"Pacemaker. 72 impulses per minute. Located in right atrium wall." },
    { label:"Double circulation", detail:"Pulmonary (RV to lungs to LA) + Systemic (LV to body to RA). Prevents O2/deO2 mixing." },
  ]},
  { id:"neuron", title:"Neuron", chapter:"Ch 21", color:"#0891b2", items:[
    { label:"Myelin sheath", detail:"Schwann cells (PNS) or oligodendrocytes (CNS). Nodes of Ranvier enable saltatory conduction." },
    { label:"Synapse", detail:"Neurotransmitters from synaptic vesicles. Ca2+ dependent exocytosis. Acetylcholine at NMJ." },
    { label:"Resting potential", detail:"About negative 70mV. Na+/K+ ATPase pumps 3 Na+ out, 2 K+ in." },
  ]},
  { id:"flower", title:"Flower Anatomy", chapter:"Ch 5", color:"#ec4899", items:[
    { label:"Androecium", detail:"Male. Stamen = filament + anther. Anther has microsporangia. Pollen grains form here." },
    { label:"Gynoecium", detail:"Female. Pistil = stigma + style + ovary. Ovules inside ovary contain embryo sac." },
    { label:"Pollination", detail:"Self (autogamy) vs Cross (xenogamy). Devices: dioecy, self-incompatibility, protandry." },
  ]},
  { id:"digestion", title:"Digestive System", chapter:"Ch 16", color:"#d97706", items:[
    { label:"Stomach", detail:"HCl (pH 1.5 to 2), pepsinogen activated to pepsin. Mucus lining prevents autodigestion." },
    { label:"Small intestine", detail:"Duodenum: bile + pancreatic juice. Jejunum + Ileum: villi and microvilli for absorption." },
    { label:"Liver", detail:"Largest gland. Produces bile (stored in gallbladder). Detoxification, glycogen storage, urea synthesis." },
  ]},
  { id:"eye", title:"Human Eye", chapter:"Ch 21", color:"#6b7280", items:[
    { label:"Retina", detail:"Rods (dim light, rhodopsin) and Cones (colour, iodopsin). Fovea has only cones, highest acuity." },
    { label:"Lens", detail:"Biconvex, transparent, held by suspensory ligaments. Ciliary muscles change curvature (accommodation)." },
    { label:"Blind spot", detail:"Where optic nerve exits. No photoreceptors. Brain fills in the gap from the other eye." },
  ]},
  { id:"krebs", title:"Krebs Cycle", chapter:"Ch 14", color:"#7c3aed", items:[
    { label:"Acetyl CoA entry", detail:"Pyruvate decarboxylated in matrix. Acetyl CoA (2C) + Oxaloacetate (4C) = Citrate (6C)." },
    { label:"Products per turn", detail:"3 NADH, 1 FADH2, 1 GTP, 2 CO2. Two turns per glucose (2 pyruvate)." },
    { label:"Regulation", detail:"Isocitrate dehydrogenase is rate limiting. Inhibited by ATP, NADH. Activated by ADP." },
  ]},
  // ─── 5 NEW TOPICS ───
  { id:"nephron", title:"Nephron Structure", chapter:"Ch 19", color:"#8b5cf6", items:[
    { label:"Bowman's Capsule", detail:"Surrounds glomerulus (capillary tuft). Ultrafiltration: water, ions, glucose, urea pass through. Proteins, cells retained." },
    { label:"Loop of Henle", detail:"Descending limb: permeable to water (concentrates filtrate). Ascending limb: impermeable to water, actively pumps NaCl (countercurrent multiplier)." },
    { label:"DCT and Collecting Duct", detail:"DCT: selective reabsorption under aldosterone. Collecting duct: ADH controls water reabsorption. Final urine concentration adjusted here." },
  ]},
  { id:"respiratory", title:"Respiratory System", chapter:"Ch 17", color:"#10b981", items:[
    { label:"Alveoli", detail:"300 million per lung. Thin walled (0.2 micrometer), surrounded by capillaries. O2 diffuses in, CO2 out by partial pressure gradient." },
    { label:"Gas transport", detail:"O2: 97% bound to Hb as oxyhaemoglobin, 3% dissolved. CO2: 70% as bicarbonate (HCO3-), 23% as carbaminohaemoglobin, 7% dissolved." },
    { label:"Respiratory volumes", detail:"Tidal volume: 500 mL. Vital capacity: 3.5 to 4.5 L. Residual volume: 1.2 L. Total lung capacity = VC + RV." },
  ]},
  { id:"synapse", title:"Synapse Detail", chapter:"Ch 21", color:"#06b6d4", items:[
    { label:"Chemical synapse", detail:"Presynaptic terminal has vesicles with neurotransmitters. Action potential triggers Ca2+ influx, vesicles fuse with membrane (exocytosis)." },
    { label:"Neurotransmitters", detail:"Acetylcholine (NMJ, parasympathetic), Noradrenaline (sympathetic), Dopamine, Serotonin, GABA (inhibitory), Glutamate (excitatory in CNS)." },
    { label:"Synaptic cleft", detail:"20 to 40 nm gap. Neurotransmitter binds post-synaptic receptors. Signal terminated by enzymatic degradation or reuptake." },
  ]},
  { id:"mendelian", title:"Mendelian Genetics", chapter:"Ch 5 (XII)", color:"#f43f5e", items:[
    { label:"Monohybrid cross", detail:"Tt x Tt gives 1 TT : 2 Tt : 1 tt genotypic ratio. Phenotypic ratio 3:1. Law of Segregation: alleles separate in gamete formation." },
    { label:"Dihybrid cross", detail:"TtRr x TtRr gives 9:3:3:1 phenotypic ratio. Law of Independent Assortment: genes on different chromosomes sort independently." },
    { label:"Incomplete dominance", detail:"Snapdragon: RR (red) x rr (white) = Rr (pink). 1:2:1 phenotypic ratio in F2. Neither allele is fully dominant." },
  ]},
  { id:"ecosystem", title:"Ecosystem Energy Flow", chapter:"Ch 14 (XII)", color:"#84cc16", items:[
    { label:"Energy flow", detail:"Unidirectional: Sun to producers to consumers. Only 10% energy transfers per trophic level (Lindeman's 10% law)." },
    { label:"Food web", detail:"Interconnected food chains. Removal of one species affects entire web. Trophic levels: producers, primary consumers, secondary, tertiary." },
    { label:"Nutrient cycling", detail:"Biogeochemical cycles (C, N, P). Carbon cycle: photosynthesis fixes CO2, respiration releases it. Nitrogen fixation by Rhizobium, Azotobacter." },
  ]},
];

const InteractiveBioShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const ex = bioExamples[activeTab];
  return (
    <div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:24}}>
        {bioExamples.map((b, i) => (
          <button key={b.id} onClick={() => { setActiveTab(i); setActiveItem(null); }}
            style={{padding:"6px 14px",borderRadius:99,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'Karla',sans-serif",background:activeTab===i?b.color:"#f3f4f6",color:activeTab===i?"#fff":"#6b7280",transition:"all 0.2s cubic-bezier(.4,0,.2,1)",transform:activeTab===i?"scale(1.05)":"scale(1)"}}>
            {b.title}
          </button>
        ))}
      </div>
      <div style={{background:"#fff",borderRadius:16,border:`2px solid ${ex.color}22`,overflow:"hidden",transition:"border-color 0.3s"}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${ex.color}15`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"#111"}}>{ex.title}</span>
            <span style={{marginLeft:10,fontSize:11,fontWeight:600,color:ex.color,background:`${ex.color}11`,padding:"2px 8px",borderRadius:99}}>{ex.chapter}</span>
          </div>
          <span style={{fontSize:11,color:"#9ca3af",fontWeight:500}}>Tap to explore</span>
        </div>
        <div style={{padding:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {ex.items.map((item, i) => (
              <div key={i} onClick={() => setActiveItem(activeItem === i ? null : i)}
                style={{padding:"12px 16px",borderRadius:10,cursor:"pointer",border:activeItem===i?`1.5px solid ${ex.color}`:"1.5px solid #e5e7eb",background:activeItem===i?`${ex.color}08`:"#fafaf9",transition:"all 0.25s cubic-bezier(.4,0,.2,1)",transform:activeItem===i?"translateX(4px)":"translateX(0)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:600,fontSize:14,color:activeItem===i?ex.color:"#374151"}}>{item.label}</span>
                  <span style={{fontSize:18,color:"#9ca3af",lineHeight:1,transform:activeItem===i?"rotate(45deg)":"none",transition:"transform 0.2s"}}>+</span>
                </div>
                {activeItem === i && <div style={{marginTop:8,fontSize:13,lineHeight:1.6,color:"#4b5563",animation:"slideDown 0.25s ease"}}>{item.detail}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── QUIZ WIDGET ───
const quizQs = [
  { q:"How many ATP molecules are produced per glucose molecule in aerobic respiration (modern revised count)?", opts:["38 ATP","30 to 32 ATP","36 ATP","40 ATP"], correct:1, explain:"The older textbook figure of 38 ATP has been revised. Modern estimates account for the actual cost of transporting NADH across the mitochondrial membrane." },
  { q:"Which enzyme unwinds DNA during replication?", opts:["DNA Polymerase","Topoisomerase","Helicase","Primase"], correct:2, explain:"Helicase breaks hydrogen bonds between base pairs to separate the two strands. Topoisomerase relieves the tension ahead of the fork." },
  { q:"Chargaff's rule states that in DNA:", opts:["A + T = G + C always","A = G and T = C","A = T and G = C","A + G = T + C"], correct:2, explain:"Erwin Chargaff discovered that the amount of adenine equals thymine, and guanine equals cytosine, in any DNA sample." },
];

const QuizWidget = () => {
  const [qi,setQi]=useState(0);
  const [sel,setSel]=useState<number|null>(null);
  const [xp,setXp]=useState(0);
  const [show,setShow]=useState(false);
  const [done,setDone]=useState(false);
  const handle=(idx:number)=>{if(sel!==null)return;setSel(idx);setShow(true);if(idx===quizQs[qi].correct)setXp(xp+10)};
  const next=()=>{if(qi<quizQs.length-1){setQi(qi+1);setSel(null);setShow(false)}else setDone(true)};
  if(done)return(
    <div style={{textAlign:"center",padding:40}}>
      <div style={{fontSize:48,fontFamily:"'Cormorant Garamond',serif",color:BRAND.red,animation:"scaleIn 0.4s cubic-bezier(.4,0,.2,1)"}}>{xp} XP</div>
      <div style={{color:"#6b7280",fontSize:14,marginTop:8}}>Quiz complete.</div>
      <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:16}}>
        <button onClick={()=>{setQi(0);setSel(null);setShow(false);setDone(false);setXp(0)}} style={{padding:"8px 20px",background:BRAND.red,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:14}}>Retry</button>
        <a href="/signup" style={{padding:"8px 20px",background:"#fff",color:BRAND.red,border:`1.5px solid ${BRAND.red}`,borderRadius:8,fontWeight:600,fontSize:14,textDecoration:"none"}}>Sign Up for More</a>
      </div>
    </div>
  );
  const q=quizQs[qi];
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
        <span style={{fontSize:12,fontWeight:600,color:"#9ca3af"}}>Q{qi+1} of {quizQs.length}</span>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:BRAND.red}}>{xp} XP</span>
      </div>
      <div style={{fontSize:15,fontWeight:600,color:"#111",lineHeight:1.5,marginBottom:16}}>{q.q}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {q.opts.map((opt,i)=>{
          let bg="#fff",border="#e5e7eb",col="#374151";
          if(sel!==null){if(i===q.correct){bg="#f0fdf4";border="#16a34a";col="#15803d"}else if(i===sel){bg="#fef2f2";border=BRAND.red;col=BRAND.red}}
          return(<button key={i} onClick={()=>handle(i)} style={{padding:"10px 14px",border:`1.5px solid ${border}`,borderRadius:10,background:bg,color:col,textAlign:"left",cursor:sel!==null?"default":"pointer",fontSize:14,fontWeight:500,transition:"all 0.2s cubic-bezier(.4,0,.2,1)"}}>{opt}</button>)
        })}
      </div>
      {show&&<div style={{marginTop:12,padding:12,background:"#f9fafb",borderRadius:8,fontSize:13,color:"#4b5563",lineHeight:1.5,border:"1px solid #e5e7eb",animation:"slideDown 0.25s ease"}}>{q.explain}</div>}
      {sel!==null&&<button onClick={next} style={{marginTop:16,padding:"10px 24px",background:BRAND.red,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:14,width:"100%",transition:"all 0.2s",boxShadow:`0 4px 12px ${BRAND.red}33`}}>{qi<quizQs.length-1?"Next":"See Score"}</button>}
    </div>
  );
};

// ─── DATA ───
const leaders = [
  {name:"Riya S.",xp:2840,seed:2},{name:"Arjun M.",xp:2610,seed:5},{name:"Ananya K.",xp:2450,seed:8},
  {name:"Vikram P.",xp:2280,seed:11},{name:"Sneha R.",xp:2100,seed:14},{name:"Karthik D.",xp:1940,seed:17},{name:"Prachi T.",xp:1820,seed:20},
];
const episodes = [
  {title:"Cell: The Unit of Life",plays:"12.4K",duration:"18 min",topic:"Cell Biology"},
  {title:"Biomolecules Simplified",plays:"9.8K",duration:"22 min",topic:"Biochemistry"},
  {title:"Morphology of Flowering Plants",plays:"8.2K",duration:"25 min",topic:"Botany"},
  {title:"Human Reproduction Decoded",plays:"15.1K",duration:"20 min",topic:"Zoology"},
  {title:"Molecular Basis of Inheritance",plays:"11.3K",duration:"28 min",topic:"Genetics"},
  {title:"Principles of Inheritance",plays:"10.7K",duration:"24 min",topic:"Genetics"},
];
const features = [
  {icon:"brain",title:"Active Recall",desc:"Spaced repetition quizzes after every chapter. No passive reading."},
  {icon:"headphones",title:"Audio Lessons",desc:"Priya Ma'am explains in Hindi. Listen while commuting, walking, resting."},
  {icon:"target",title:"NCERT Accurate",desc:"Mapped to NCERT line by line. 22 RTI queries filed for textbook errors. Zero guesswork."},
  {icon:"trophy",title:"XP & Leaderboard",desc:"Earn XP per quiz. Compete on the board. Consistency wins."},
  {icon:"robot",title:"Priya AI",desc:"24/7 AI tutor trained on Priya Ma'am's methodology. Ask anything, anytime."},
  {icon:"bolt",title:"NEET Focused",desc:"Every question, every episode, every feature built for one exam: NEET."},
];

// ─── SCROLL REVEAL WRAPPER ───
const Reveal = ({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: string }) => {
  const { ref, visible } = useScrollReveal(0.1);
  const transforms: Record<string,string> = {
    up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)", scale: "scale(0.95)",
  };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : transforms[direction] || transforms.up,
      transition: `all 0.7s cubic-bezier(.4,0,.2,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
};

// ─── MAIN COMPONENT ───
export default function DesiEducatorsHome() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{fontFamily:"'Karla',sans-serif",color:"#111",background:"#fafaf9",minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{overflow-x:hidden}
        @keyframes floatParticle{0%{transform:translateY(0) rotate(0deg)}100%{transform:translateY(-30px) rotate(8deg)}}
        @keyframes slideDown{from{opacity:0;max-height:0;margin-top:0}to{opacity:1;max-height:200px;margin-top:8px}}
        @keyframes scaleIn{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(196,30,30,0.15)}50%{box-shadow:0 0 40px rgba(196,30,30,0.3)}}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
        .feature-card{transition:all 0.3s cubic-bezier(.4,0,.2,1)}
        .feature-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.1)}
        .hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
        .hero-img-wrap{width:380px;height:460px}
        .hero-title{font-size:64px}
        .subject-strip{display:flex;justify-content:center;gap:40px}
        .features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .bio-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:60px;align-items:start}
        .bio-sticky{position:sticky;top:100px}
        .dna-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
        .quiz-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start}
        .episodes-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .research-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:40px}
        .section-h2{font-size:40px}
        .section-h2-lg{font-size:44px}
        .section-h2-m{font-size:36px}
        .priya-ai-buttons{display:flex;gap:12px;justify-content:center}
        .ncert-stats{display:inline-flex;gap:24px;padding:16px 28px}
        .episode-card{transition:all 0.3s cubic-bezier(.4,0,.2,1)}
        .episode-card:hover{transform:translateY(-2px);border-color:#c41e1e!important;box-shadow:0 8px 24px rgba(196,30,30,0.08)!important}
        .cta-btn{transition:all 0.3s cubic-bezier(.4,0,.2,1)}
        .cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(196,30,30,0.35)!important}
        @media(max-width:768px){
          .hero-grid{grid-template-columns:1fr;gap:24px;padding:32px 16px 24px!important}
          .hero-img-wrap{width:100%;height:320px;margin:0 auto}
          .hero-title{font-size:36px}
          .subject-strip{gap:16px;flex-wrap:wrap;padding:16px!important}
          .features-grid{grid-template-columns:1fr;gap:12px}
          .bio-grid{grid-template-columns:1fr;gap:24px}
          .bio-sticky{position:static}
          .dna-grid{grid-template-columns:1fr;gap:24px}
          .quiz-grid{grid-template-columns:1fr;gap:24px}
          .episodes-grid{grid-template-columns:1fr;gap:12px}
          .research-grid{grid-template-columns:1fr;gap:12px}
          .section-h2{font-size:28px}
          .section-h2-lg{font-size:30px}
          .section-h2-m{font-size:26px}
          .priya-ai-buttons{flex-direction:column;align-items:center}
          .ncert-stats{flex-direction:row;gap:16px;padding:12px 16px}
        }
      `}</style>


      {/* HERO */}
      <section style={{position:"relative",overflow:"hidden",background:"#fafaf9"}}>
        <FloatingParticles />
        <div className="hero-grid" style={{maxWidth:1200,margin:"0 auto",padding:"60px 24px 40px",position:"relative",zIndex:1}}>
          <Reveal>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",background:"#f0fdf4",borderRadius:99,marginBottom:20}}>
              <div style={{width:6,height:6,borderRadius:3,background:SUBJECT.bio,animation:"glowPulse 2s infinite"}}/>
              <span style={{fontSize:12,fontWeight:600,color:SUBJECT.bio}}>NEET 2026 Prep Live</span>
            </div>
            <h1 className="hero-title" style={{fontFamily:"'Cormorant Garamond',serif",lineHeight:1.05,marginBottom:24}}>Recall. Retain. <span style={{color:BRAND.red}}>Rank.</span></h1>
            <p style={{fontSize:17,lineHeight:1.7,color:"#6b7280",maxWidth:440,marginBottom:28}}>Biology with Priya Ma'am. 3,700+ NEET MCQs, NCERT accurate audio lessons, and an AI tutor that never sleeps. Built for NEET 2026.</p>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
              <div style={{display:"flex"}}>{[1,3,5,7,9].map((s,i)=>(<div key={s} style={{marginLeft:i===0?0:-8,border:"2px solid #fff",borderRadius:99}}><StudentAvatar seed={s} size={28}/></div>))}</div>
              <span style={{fontSize:13,color:"#9ca3af"}}><strong style={{color:"#374151"}}>24,000+</strong> engagements on Priya AI</span>
            </div>
            <div style={{marginBottom:28}}>
              <div style={{fontSize:11,fontWeight:600,color:"#9ca3af",letterSpacing:1.5,marginBottom:8}}>NEET 2026 COUNTDOWN</div>
              <Countdown />
            </div>
            <div style={{display:"flex",gap:12}}>
              <a href="/neet" className="cta-btn" style={{padding:"14px 28px",background:BRAND.red,color:"#fff",border:"none",borderRadius:10,fontWeight:600,fontSize:15,cursor:"pointer",boxShadow:`0 4px 14px ${BRAND.red}33`,textDecoration:"none",display:"inline-block"}}>Try a Free Quiz</a>
              <a href="/episodes" style={{padding:"14px 28px",background:"#fff",color:"#374151",border:"1.5px solid #d1d5db",borderRadius:10,fontWeight:600,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",gap:8,textDecoration:"none",transition:"all 0.2s"}}>
                <span style={{color:BRAND.red}}>{Icons.play}</span> Listen Free
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div style={{display:"flex",justifyContent:"center"}}>
              <div className="hero-img-wrap" style={{position:"relative",background:"#f0f0ee",borderRadius:24,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.08)",animation:"breathe 6s ease-in-out infinite"}}>
                <img src="/priya.png" alt="Priya Pandey" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} />
                <div style={{position:"absolute",bottom:20,left:20,right:20,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(12px)",borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:8,height:8,borderRadius:4,background:"#fbbf24"}}/>
                  <div>
                    <div style={{color:"#fff",fontWeight:600,fontSize:13}}>Priya Pandey</div>
                    <div style={{color:"rgba(255,255,255,0.7)",fontSize:11}}>MSc Gold Medalist | Biology Educator</div>
                  </div>
                </div>
                <div style={{position:"absolute",top:16,right:16,background:"rgba(22,163,74,0.9)",borderRadius:8,padding:"6px 10px",fontSize:10,fontWeight:700,color:"#fff",fontFamily:"'JetBrains Mono',monospace"}}>38 ATP → 30-32 ATP</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SCROLLING TICKER */}
      <div style={{background:"#111",padding:"10px 0",overflow:"hidden",whiteSpace:"nowrap"}}>
        <div style={{display:"inline-flex",animation:"marquee 30s linear infinite"}}>
          {[...Array(2)].map((_, rep) => (
            <div key={rep} style={{display:"inline-flex",gap:40,paddingRight:40}}>
              {["NCERT Aligned","Active Recall","Spaced Repetition","22 RTI Filed","30-32 ATP (Corrected)","AI Tutor","130+ Quizzes","3,700+ MCQs","Audio Lessons","XP System","Free to Start"].map(t=>(
                <span key={t+rep} style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.5)",letterSpacing:2,textTransform:"uppercase"}}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SUBJECT STRIP */}
      <div style={{background:"#fff",borderTop:"1px solid #e5e5e4",borderBottom:"1px solid #e5e5e4"}}>
        <div className="subject-strip" style={{maxWidth:1200,margin:"0 auto",padding:"20px 24px"}}>
          {[{label:"Biology",color:SUBJECT.bio,icon:"dna",count:"32 chapters · Class 11 + 12"},{label:"Physics",color:SUBJECT.physics,icon:"bolt",count:"Coming soon"},{label:"Chemistry",color:SUBJECT.chemistry,icon:"flask",count:"Coming soon"}].map(s=>(
            <div key={s.label} style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{color:s.color}}>{Icons[s.icon as keyof typeof Icons]}</div>
              <div><div style={{fontWeight:600,fontSize:14,color:s.color}}>{s.label}</div><div style={{fontSize:11,color:"#9ca3af"}}>{s.count}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS BAR */}
      <Reveal>
        <section style={{maxWidth:1000,margin:"40px auto",padding:"0 24px"}}>
          <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e5e4",padding:"28px 40px",display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:20}}>
            {[
              {num:130,suffix:"+",label:"Quizzes",color:BRAND.red},
              {num:3700,suffix:"+",label:"MCQs",color:SUBJECT.bio},
              {num:22,suffix:"",label:"RTI Filed",color:SUBJECT.physics},
              {num:24000,suffix:"+",label:"Engagements",color:"#7c3aed"},
            ].map(s=>(
              <div key={s.label} style={{textAlign:"center",flex:1,minWidth:100}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:28,fontWeight:700,color:s.color}}><AnimatedCounter end={s.num} suffix={s.suffix}/></div>
                <div style={{fontSize:11,color:"#9ca3af",fontWeight:600,letterSpacing:1,marginTop:4}}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* FEATURES */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"60px 24px 80px"}}>
        <Reveal>
          <div style={{textAlign:"center",marginBottom:48}}>
            <h2 className="section-h2" style={{fontFamily:"'Cormorant Garamond',serif",marginBottom:12}}>How it <span style={{color:BRAND.red}}>works</span></h2>
            <p style={{color:"#9ca3af",fontSize:15,maxWidth:480,margin:"0 auto"}}>Every feature is designed for one outcome: your NEET rank.</p>
          </div>
        </Reveal>
        <div className="features-grid">
          {features.map((f,i)=>(
            <Reveal key={i} delay={i * 0.08}>
              <div className="feature-card" style={{background:"#fff",borderRadius:16,padding:28,border:"1px solid #e5e5e4",cursor:"default",height:"100%"}}>
                <div style={{width:44,height:44,borderRadius:12,background:BRAND.redLight,display:"flex",alignItems:"center",justifyContent:"center",color:BRAND.red,marginBottom:16}}>{Icons[f.icon as keyof typeof Icons]}</div>
                <h3 style={{fontWeight:700,fontSize:16,marginBottom:8}}>{f.title}</h3>
                <p style={{fontSize:13,lineHeight:1.6,color:"#6b7280"}}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 15 INTERACTIVE BIOLOGY EXAMPLES */}
      <section id="chapters" style={{background:"#fff",padding:"80px 24px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div className="bio-grid">
            <Reveal>
              <div className="bio-sticky">
                <div style={{fontSize:11,fontWeight:700,color:SUBJECT.bio,letterSpacing:1.5,marginBottom:12}}>INTERACTIVE BIOLOGY</div>
                <h2 className="section-h2-m" style={{fontFamily:"'Cormorant Garamond',serif",marginBottom:16}}>15 topics. Tap to explore.</h2>
                <p style={{color:"#6b7280",fontSize:15,lineHeight:1.7,marginBottom:20}}>Every diagram on Desi Educators is interactive. No static images. Tap any topic, then tap each concept to reveal NCERT accurate details with exam relevant depth.</p>
                <div style={{padding:14,background:"#f0fdf4",borderRadius:10,border:"1px solid #dcfce7"}}>
                  <div style={{fontSize:12,fontWeight:600,color:SUBJECT.bio,marginBottom:4}}>From Cell to Ecosystem</div>
                  <div style={{fontSize:12,color:"#6b7280",lineHeight:1.5}}>Animal Cell, DNA, Mitosis, Photosynthesis, Heart, Neuron, Flower, Digestion, Eye, Krebs, Nephron, Respiratory, Synapse, Mendelian Genetics, Ecosystem</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <InteractiveBioShowcase />
            </Reveal>
          </div>
        </div>
      </section>

      {/* DNA HELIX */}
      <section style={{padding:"80px 24px",background:"#fafaf9"}}>
        <div className="dna-grid" style={{maxWidth:1200,margin:"0 auto"}}>
          <Reveal direction="left">
            <DNAHelix />
          </Reveal>
          <Reveal delay={0.1} direction="right">
            <div>
              <div style={{fontSize:11,fontWeight:700,color:BRAND.red,letterSpacing:1.5,marginBottom:12}}>CHARGAFF'S RULES</div>
              <h2 className="section-h2-m" style={{fontFamily:"'Cormorant Garamond',serif",marginBottom:16}}>Hover the base pairs</h2>
              <p style={{color:"#6b7280",fontSize:15,lineHeight:1.7}}>A pairs with T (2 hydrogen bonds). G pairs with C (3 hydrogen bonds). The ratio [A+G]/[T+C] always equals 1. DNA is 2nm wide with a pitch of 3.4nm per complete turn.</p>
              <div style={{marginTop:20,padding:12,background:"#fff",borderRadius:10,border:`1.5px solid ${BRAND.red}22`,display:"inline-flex",alignItems:"center",gap:8}}>
                <span style={{color:BRAND.red}}>{Icons.check}</span>
                <span style={{fontSize:13,fontWeight:600,color:"#374151"}}>NCERT Chapter 6 verified</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* QUIZ */}
      <section id="quizzes" style={{padding:"80px 24px",background:"#fff"}}>
        <div className="quiz-grid" style={{maxWidth:1200,margin:"0 auto"}}>
          <Reveal>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:BRAND.red,letterSpacing:1.5,marginBottom:12}}>ACTIVE RECALL</div>
              <h2 className="section-h2-m" style={{fontFamily:"'Cormorant Garamond',serif",marginBottom:16}}>Test yourself <span style={{color:BRAND.red}}>now</span></h2>
              <p style={{color:"#6b7280",fontSize:15,lineHeight:1.7,marginBottom:24}}>3 quick questions. Earn 10 XP per correct answer. Build long term memory by retrieving, not rereading.</p>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                {[["130+","Quizzes"],["3,700+","MCQs"],["10","XP each"]].map(([n,l])=>(<div key={l} style={{textAlign:"center"}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:700,color:BRAND.red}}>{n}</div><div style={{fontSize:10,color:"#9ca3af",fontWeight:600}}>{l}</div></div>))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{background:"#fff",borderRadius:20,padding:28,border:"1px solid #e5e5e4",boxShadow:"0 4px 20px rgba(0,0,0,0.04)"}}><QuizWidget /></div>
          </Reveal>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section style={{padding:"80px 24px",background:"#fafaf9"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <Reveal>
            <div style={{textAlign:"center",marginBottom:32}}>
              <div style={{color:BRAND.red,marginBottom:8,display:"flex",justifyContent:"center"}}>{Icons.trophy}</div>
              <h2 className="section-h2-m" style={{fontFamily:"'Cormorant Garamond',serif"}}>Leaderboard</h2>
              <p style={{color:"#9ca3af",fontSize:14,marginTop:8}}>Top performers this week</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e5e4",overflow:"hidden"}}>
              {leaders.map((l,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",padding:"14px 20px",borderBottom:i<leaders.length-1?"1px solid #f3f4f6":"none",gap:12,transition:"all 0.2s",cursor:"default"}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#fef2f2"}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#fff"}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:14,color:i<3?BRAND.red:"#9ca3af",width:24}}>#{i+1}</span>
                  <StudentAvatar seed={l.seed} size={28}/>
                  <span style={{flex:1,fontWeight:600,fontSize:14}}>{l.name}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:14,color:SUBJECT.bio}}>{l.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* EPISODES */}
      <section id="podcast" style={{padding:"80px 24px",background:"#fff"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <Reveal>
            <div style={{textAlign:"center",marginBottom:40}}>
              <div style={{color:BRAND.red,marginBottom:8,display:"flex",justifyContent:"center"}}>{Icons.headphones}</div>
              <h2 className="section-h2-m" style={{fontFamily:"'Cormorant Garamond',serif"}}>Summit Neuro Podcast</h2>
              <p style={{color:"#9ca3af",fontSize:14,marginTop:8}}>Audio lessons by Priya Ma'am. Learn Biology by listening.</p>
            </div>
          </Reveal>
          <div className="episodes-grid">
            {episodes.map((ep,i)=>(
              <Reveal key={i} delay={i * 0.06}>
                <a href="/episodes" className="episode-card" style={{background:"#fafaf9",borderRadius:14,padding:20,border:"1px solid #e5e5e4",cursor:"pointer",textDecoration:"none",color:"inherit",display:"block"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                    <span style={{fontSize:10,fontWeight:600,color:SUBJECT.bio,background:"#f0fdf4",padding:"2px 8px",borderRadius:99}}>{ep.topic}</span>
                    <span style={{fontSize:11,color:"#9ca3af"}}>{ep.duration}</span>
                  </div>
                  <h4 style={{fontWeight:700,fontSize:15,marginBottom:8,lineHeight:1.4}}>{ep.title}</h4>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:28,height:28,borderRadius:14,background:BRAND.red,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{Icons.play}</div>
                    <span style={{fontSize:12,color:"#9ca3af"}}>{ep.plays} plays</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SUMMIT NEURO EDUCATIONAL RESEARCH */}
      <section id="research" style={{padding:"80px 24px",background:"#fafaf9"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <Reveal>
            <div style={{textAlign:"center",marginBottom:48}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",background:"#fff",borderRadius:99,marginBottom:20,border:"1px solid #e5e5e4"}}>
                <div style={{color:BRAND.red}}>{Icons.globe}</div>
                <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>Summit Neuro Educational Research</span>
              </div>
              <h2 className="section-h2" style={{fontFamily:"'Cormorant Garamond',serif",marginBottom:16}}>Backed by <span style={{color:BRAND.red}}>real science.</span></h2>
              <p style={{color:"#6b7280",fontSize:16,lineHeight:1.7,maxWidth:600,margin:"0 auto"}}>Our methodology draws on established European and American pedagogy, published research, and world class science education practice. Not invented. Proven.</p>
            </div>
          </Reveal>
          <div className="research-grid">
            {[
              { title:"Active Recall", source:"Roediger & Karpicke (2006)", detail:"Testing effect: retrieving information from memory strengthens retention more than restudying. Published in Psychological Science.", color:"#7c3aed" },
              { title:"Spaced Repetition", source:"Ebbinghaus (1885), Cepeda et al. (2006)", detail:"Distributing practice over time produces better long term retention than massing. Meta analysis of 254 studies confirms the spacing effect.", color:SUBJECT.bio },
              { title:"Dual Coding", source:"Paivio (1971), Mayer (2009)", detail:"Combining verbal and visual information creates two memory traces. Multimedia learning principles applied across all our interactive diagrams.", color:SUBJECT.physics },
            ].map((r,i)=>(
              <Reveal key={i} delay={i * 0.1}>
                <div style={{background:"#fff",borderRadius:16,padding:24,border:"1px solid #e5e5e4",height:"100%"}}>
                  <div style={{width:36,height:4,borderRadius:2,background:r.color,marginBottom:16}}/>
                  <h3 style={{fontWeight:700,fontSize:16,marginBottom:4}}>{r.title}</h3>
                  <div style={{fontSize:11,fontWeight:600,color:r.color,marginBottom:10}}>{r.source}</div>
                  <p style={{fontSize:13,lineHeight:1.6,color:"#6b7280"}}>{r.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div style={{background:"#fff",borderRadius:14,border:"1px solid #e5e5e4",padding:"24px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20}}>
              {[
                {label:"White Paper",value:"Published on SSRN, Academia.edu, Zenodo"},
                {label:"Methodology",value:"European & American pedagogy frameworks"},
                {label:"RTI Queries Filed",value:"22"},
              ].map((c,i)=>(
                <div key={i} style={{textAlign:"center",flex:1,minWidth:160}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#111",marginBottom:2}}>{c.value}</div>
                  <div style={{fontSize:11,color:"#9ca3af",fontWeight:500}}>{c.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRIYA AI */}
      <section id="priya-ai" style={{background:"#111",padding:"80px 24px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:0.03,backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
        <Reveal>
          <div style={{maxWidth:700,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",background:"rgba(196,30,30,0.15)",borderRadius:99,marginBottom:20}}>
              <div style={{color:BRAND.red}}>{Icons.robot}</div>
              <span style={{fontSize:12,fontWeight:600,color:BRAND.red}}>AI Tutor</span>
            </div>
            <h2 className="section-h2-lg" style={{fontFamily:"'Cormorant Garamond',serif",color:"#fff",marginBottom:16}}>Meet <span style={{color:BRAND.red}}>Priya AI</span></h2>
            <p style={{color:"#9ca3af",fontSize:16,lineHeight:1.7,marginBottom:32,maxWidth:520,margin:"0 auto 32px"}}>Trained on Priya Ma'am's teaching methodology. Ask any NEET Biology question. Get answers in Hindi. Available 24/7 on Telegram.</p>
            <div className="priya-ai-buttons">
              <a href="/priya-ai" className="cta-btn" style={{padding:"14px 28px",background:BRAND.red,color:"#fff",border:"none",borderRadius:10,fontWeight:600,fontSize:15,cursor:"pointer",boxShadow:`0 4px 20px ${BRAND.red}44`,textDecoration:"none",display:"inline-block"}}>Try Priya AI Free</a>
              <a href="https://t.me/ProfPriyaPandeybot" target="_blank" rel="noopener noreferrer" style={{padding:"14px 28px",background:"transparent",color:"#fff",border:"1.5px solid #333",borderRadius:10,fontWeight:600,fontSize:15,cursor:"pointer",textDecoration:"none",display:"inline-block",transition:"all 0.2s"}}>Open on Telegram</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* NCERT */}
      <section style={{padding:"80px 24px",background:"#fafaf9"}}>
        <div style={{maxWidth:800,margin:"0 auto",textAlign:"center"}}>
          <Reveal>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",background:"#f0fdf4",borderRadius:99,marginBottom:20}}>
              <span style={{color:SUBJECT.bio}}>{Icons.check}</span>
              <span style={{fontSize:12,fontWeight:600,color:SUBJECT.bio}}>NCERT Verified</span>
            </div>
            <h2 className="section-h2-m" style={{fontFamily:"'Cormorant Garamond',serif",marginBottom:16}}>We found errors in NCERT. <span style={{color:BRAND.red}}>We filed RTI.</span></h2>
            <p style={{color:"#6b7280",fontSize:15,lineHeight:1.7,maxWidth:600,margin:"0 auto 28px"}}>The NCERT Biology textbook stated aerobic respiration yields 38 ATP. Modern biochemistry (Berg et al., Lehninger) puts the actual figure at 30 to 32 ATP. We filed 22 RTI queries to NCERT. Result: NCERT has confirmed they will correct this in the next reprint. We won.</p>
            <div className="ncert-stats" style={{background:"#fff",borderRadius:14,border:"1px solid #e5e5e4"}}>
              {[{num:"6+",label:"Errors found"},{num:"22",label:"RTI queries filed"},{num:"1",label:"NCERT correction won"}].map(s=>(
                <div key={s.label} style={{textAlign:"center"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:BRAND.red}}>{s.num}</div>
                  <div style={{fontSize:11,color:"#9ca3af",fontWeight:500}}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:"80px 24px",background:"#fff"}}>
        <Reveal direction="scale">
          <div style={{maxWidth:600,margin:"0 auto",textAlign:"center"}}>
            <h2 className="section-h2-lg" style={{fontFamily:"'Cormorant Garamond',serif",marginBottom:16}}>Your NEET rank starts <span style={{color:BRAND.red}}>here.</span></h2>
            <p style={{color:"#6b7280",fontSize:16,lineHeight:1.7,marginBottom:32}}>Free to start. No credit card. NEET 2026 cohort: 3,700+ MCQs, gamified quizzes, AI tutor.</p>
            <a href="/neet" className="cta-btn" style={{padding:"16px 40px",background:BRAND.red,color:"#fff",border:"none",borderRadius:12,fontWeight:700,fontSize:17,cursor:"pointer",boxShadow:`0 6px 24px ${BRAND.red}33`,textDecoration:"none",display:"inline-block",animation:"glowPulse 3s ease-in-out infinite"}}>Try a Free Quiz</a>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
