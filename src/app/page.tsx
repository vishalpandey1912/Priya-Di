import { useState, useEffect } from "react";

// ─── CONSTANTS ───
const BRAND = { red: "#c41e1e", redLight: "#fef2f2", redDark: "#991b1b" };
const SUBJECT = { bio: "#16a34a", physics: "#2563eb", chemistry: "#d97706" };
const NEET_DATE = new Date("2026-05-04T09:30:00+05:30");

// ─── SVG ICONS ───
const Icons = {
  microscope: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="7" r="3"/><line x1="12" y1="10" x2="12" y2="18"/><line x1="8" y1="22" x2="16" y2="22"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="7" y1="18" x2="17" y2="18"/>
    </svg>
  ),
  dna: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <path d="M4 2c0 5 4 7 8 7s8 2 8 7"/><path d="M20 2c0 5-4 7-8 7s-8 2-8 7"/><line x1="6" y1="6" x2="18" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="6" y1="18" x2="18" y2="18"/>
    </svg>
  ),
  flask: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M9 3h6v6l5 8H4l5-8V3z"/><line x1="9" y1="3" x2="15" y2="3"/>
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <path d="M12 2a5 5 0 00-4.8 3.6A4 4 0 004 9.5a4 4 0 001.2 7A3.5 3.5 0 008 22h8a3.5 3.5 0 002.8-5.5A4 4 0 0020 9.5a4 4 0 00-3.2-3.9A5 5 0 0012 2z"/><path d="M12 2v20"/>
    </svg>
  ),
  headphones: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5z"/><path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z"/>
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M6 9H3V5h3"/><path d="M18 9h3V5h-3"/><path d="M6 5h12v7a6 6 0 01-12 0V5z"/><line x1="12" y1="17" x2="12" y2="20"/><line x1="8" y1="22" x2="16" y2="22"/>
    </svg>
  ),
  robot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="4" y="8" width="16" height="12" rx="2"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="14" r="1.5"/><line x1="12" y1="4" x2="12" y2="8"/><circle cx="12" cy="3" r="1"/>
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-6 h-6">
      <circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    </svg>
  ),
};

// ─── SVG AVATAR GENERATOR ───
const StudentAvatar = ({ seed, size = 32 }) => {
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
      const diff = Math.max(0, NEET_DATE - new Date());
      setTime({ d: Math.floor(diff/86400000), h: Math.floor((diff%86400000)/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
    };
    tick(); const i = setInterval(tick, 1000); return () => clearInterval(i);
  }, []);
  return (
    <div style={{display:"flex",gap:8}}>
      {[["d",time.d,"DAYS"],["h",time.h,"HRS"],["m",time.m,"MIN"],["s",time.s,"SEC"]].map(([k,v,l])=>(
        <div key={k} style={{textAlign:"center"}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:28,fontWeight:700,color:"#111",lineHeight:1}}>{String(v).padStart(2,"0")}</div>
          <div style={{fontSize:9,fontWeight:600,color:"#999",letterSpacing:1.5,marginTop:2}}>{l}</div>
        </div>
      ))}
    </div>
  );
};

// ─── BIOLOGY DECORATIONS ───
const BioDeco = () => (
  <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
    <svg viewBox="0 0 120 60" style={{position:"absolute",top:"8%",right:"5%",width:100,opacity:0.07}}>
      <ellipse cx="60" cy="30" rx="55" ry="25" fill="none" stroke="#16a34a" strokeWidth="2"/>
      <path d="M15 30 Q30 15 45 30 Q60 45 75 30 Q90 15 105 30" fill="none" stroke="#16a34a" strokeWidth="1.5"/>
    </svg>
    <svg viewBox="0 0 40 200" style={{position:"absolute",top:"20%",left:"3%",width:30,opacity:0.06}}>
      <path d="M5 0 Q20 25 35 50 Q20 75 5 100 Q20 125 35 150 Q20 175 5 200" fill="none" stroke={BRAND.red} strokeWidth="2"/>
      <path d="M35 0 Q20 25 5 50 Q20 75 35 100 Q20 125 5 150 Q20 175 35 200" fill="none" stroke={BRAND.red} strokeWidth="2"/>
    </svg>
  </div>
);

// ─── DNA HELIX INTERACTIVE ───
const basePairs = [
  { left:"A", right:"T", bonds:2, fact:"Adenine pairs with Thymine via 2 hydrogen bonds" },
  { left:"G", right:"C", bonds:3, fact:"Guanine pairs with Cytosine via 3 hydrogen bonds" },
  { left:"T", right:"A", bonds:2, fact:"Chargaff's rule: [A] = [T], [G] = [C]" },
  { left:"C", right:"G", bonds:3, fact:"DNA pitch: 3.4 nm per turn (10 bp). Distance between bp: 0.34 nm" },
  { left:"A", right:"T", bonds:2, fact:"DNA diameter: 2 nm (20 Angstroms). Right handed helix (B form)" },
];

const DNAHelix = () => {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{maxWidth:340,margin:"0 auto"}}>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {basePairs.map((bp, i) => (
          <div key={i} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,cursor:"pointer",padding:"6px 0",borderRadius:8,background:hovered===i?"#fef2f2":"transparent",transition:"all 0.2s"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:18,color:bp.left==="A"||bp.left==="T"?BRAND.red:SUBJECT.bio,width:28,textAlign:"right"}}>{bp.left}</span>
            <div style={{display:"flex",gap:2,width:60,justifyContent:"center"}}>{Array(bp.bonds).fill(0).map((_,j)=>(<div key={j} style={{height:2,flex:1,background:"#d1d5db",borderRadius:1}}/>))}</div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:18,color:bp.right==="A"||bp.right==="T"?BRAND.red:SUBJECT.bio,width:28,textAlign:"left"}}>{bp.right}</span>
          </div>
        ))}
      </div>
      {hovered!==null && <div style={{marginTop:12,padding:"10px 14px",background:"#f9fafb",borderRadius:8,fontSize:12,color:"#4b5563",textAlign:"center",border:"1px solid #e5e7eb"}}>{basePairs[hovered].fact}</div>}
    </div>
  );
};

// ─── 10 INTERACTIVE BIOLOGY EXAMPLES ───
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
];

const InteractiveBioShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeItem, setActiveItem] = useState(null);
  const ex = bioExamples[activeTab];
  return (
    <div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:24}}>
        {bioExamples.map((b, i) => (
          <button key={b.id} onClick={() => { setActiveTab(i); setActiveItem(null); }}
            style={{padding:"6px 14px",borderRadius:99,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:activeTab===i?b.color:"#f3f4f6",color:activeTab===i?"#fff":"#6b7280",transition:"all 0.15s"}}>
            {b.title}
          </button>
        ))}
      </div>
      <div style={{background:"#fff",borderRadius:16,border:`2px solid ${ex.color}22`,overflow:"hidden"}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${ex.color}15`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <span style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#111"}}>{ex.title}</span>
            <span style={{marginLeft:10,fontSize:11,fontWeight:600,color:ex.color,background:`${ex.color}11`,padding:"2px 8px",borderRadius:99}}>{ex.chapter}</span>
          </div>
          <span style={{fontSize:11,color:"#9ca3af",fontWeight:500}}>Tap to explore</span>
        </div>
        <div style={{padding:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {ex.items.map((item, i) => (
              <div key={i} onClick={() => setActiveItem(activeItem === i ? null : i)}
                style={{padding:"12px 16px",borderRadius:10,cursor:"pointer",border:activeItem===i?`1.5px solid ${ex.color}`:"1.5px solid #e5e7eb",background:activeItem===i?`${ex.color}08`:"#fafaf9",transition:"all 0.15s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:600,fontSize:14,color:activeItem===i?ex.color:"#374151"}}>{item.label}</span>
                  <span style={{fontSize:18,color:"#9ca3af",lineHeight:1,transform:activeItem===i?"rotate(45deg)":"none",transition:"transform 0.15s"}}>+</span>
                </div>
                {activeItem === i && <div style={{marginTop:8,fontSize:13,lineHeight:1.6,color:"#4b5563"}}>{item.detail}</div>}
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
  const [qi,setQi]=useState(0),[sel,setSel]=useState(null),[xp,setXp]=useState(0),[show,setShow]=useState(false),[done,setDone]=useState(false);
  const handle=(idx)=>{if(sel!==null)return;setSel(idx);setShow(true);if(idx===quizQs[qi].correct)setXp(xp+10)};
  const next=()=>{if(qi<quizQs.length-1){setQi(qi+1);setSel(null);setShow(false)}else setDone(true)};
  if(done)return(<div style={{textAlign:"center",padding:40}}><div style={{fontSize:48,fontFamily:"'DM Serif Display',serif",color:BRAND.red}}>{xp} XP</div><div style={{color:"#6b7280",fontSize:14,marginTop:8}}>Quiz complete.</div><button onClick={()=>{setQi(0);setSel(null);setShow(false);setDone(false);setXp(0)}} style={{marginTop:16,padding:"8px 20px",background:BRAND.red,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:14}}>Retry</button></div>);
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
          return(<button key={i} onClick={()=>handle(i)} style={{padding:"10px 14px",border:`1.5px solid ${border}`,borderRadius:10,background:bg,color:col,textAlign:"left",cursor:sel!==null?"default":"pointer",fontSize:14,fontWeight:500,transition:"all 0.15s"}}>{opt}</button>)
        })}
      </div>
      {show&&<div style={{marginTop:12,padding:12,background:"#f9fafb",borderRadius:8,fontSize:13,color:"#4b5563",lineHeight:1.5,border:"1px solid #e5e7eb"}}>{q.explain}</div>}
      {sel!==null&&<button onClick={next} style={{marginTop:16,padding:"10px 24px",background:BRAND.red,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:14,width:"100%"}}>{qi<quizQs.length-1?"Next":"See Score"}</button>}
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

// ─── MAIN COMPONENT ───
export default function DesiEducatorsHome() {
  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",color:"#111",background:"#fafaf9",minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@500;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{overflow-x:hidden}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .fade-up{animation:fadeUp .6s ease both}.fade-up-2{animation-delay:.2s}
        .feature-card:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,0.08)}
      `}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(250,250,249,0.92)",backdropFilter:"blur(12px)",borderBottom:"1px solid #e5e5e4"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:32,height:32,background:BRAND.red,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:16,fontFamily:"'DM Serif Display',serif"}}>D</span>
            </div>
            <span style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"#111"}}>Desi Educators</span>
          </div>
          <div style={{display:"flex",gap:28,alignItems:"center"}}>
            {["Chapters","Quizzes","Podcast","Research","Priya AI"].map(item=>(
              <a key={item} href={`#${item.toLowerCase().replace(' ','-')}`}
                style={{fontSize:14,fontWeight:500,color:"#6b7280",textDecoration:"none",transition:"color 0.15s"}}
                onMouseEnter={e=>e.target.style.color=BRAND.red} onMouseLeave={e=>e.target.style.color="#6b7280"}>
                {item}
              </a>
            ))}
            <button style={{padding:"8px 20px",background:BRAND.red,color:"#fff",border:"none",borderRadius:8,fontWeight:600,fontSize:13,cursor:"pointer"}}>Start Free</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{position:"relative",overflow:"hidden",background:"#fafaf9"}}>
        <BioDeco />
        <div style={{maxWidth:1200,margin:"0 auto",padding:"60px 24px 40px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center",position:"relative",zIndex:1}}>
          <div className="fade-up">
            <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",background:"#f0fdf4",borderRadius:99,marginBottom:20}}>
              <div style={{width:6,height:6,borderRadius:3,background:SUBJECT.bio,animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:12,fontWeight:600,color:SUBJECT.bio}}>NEET 2026 Prep Live</span>
            </div>
            <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:64,lineHeight:1.05,marginBottom:24}}>Recall. Retain. <span style={{color:BRAND.red}}>Rank.</span></h1>
            <p style={{fontSize:17,lineHeight:1.7,color:"#6b7280",maxWidth:440,marginBottom:28}}>Biology with Priya Ma'am. NCERT accurate audio lessons, active recall quizzes, and an AI tutor that never sleeps. Built for NEET.</p>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
              <div style={{display:"flex"}}>{[1,3,5,7,9].map((s,i)=>(<div key={s} style={{marginLeft:i===0?0:-8,border:"2px solid #fff",borderRadius:99}}><StudentAvatar seed={s} size={28}/></div>))}</div>
              <span style={{fontSize:13,color:"#9ca3af"}}><strong style={{color:"#374151"}}>2,400+</strong> students already learning</span>
            </div>
            <div style={{marginBottom:28}}>
              <div style={{fontSize:11,fontWeight:600,color:"#9ca3af",letterSpacing:1.5,marginBottom:8}}>NEET 2026 COUNTDOWN</div>
              <Countdown />
            </div>
            <div style={{display:"flex",gap:12}}>
              <button style={{padding:"14px 28px",background:BRAND.red,color:"#fff",border:"none",borderRadius:10,fontWeight:600,fontSize:15,cursor:"pointer",boxShadow:`0 4px 14px ${BRAND.red}33`}}>Start Learning Free</button>
              <button style={{padding:"14px 28px",background:"#fff",color:"#374151",border:"1.5px solid #d1d5db",borderRadius:10,fontWeight:600,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:BRAND.red}}>{Icons.play}</span> Watch Demo
              </button>
            </div>
          </div>
          <div className="fade-up fade-up-2" style={{display:"flex",justifyContent:"center"}}>
            <div style={{position:"relative",width:380,height:460,background:"#111",borderRadius:24,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
              <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#1a1a1a,#2d2d2d)",flexDirection:"column",gap:12}}>
                <div style={{fontSize:80,opacity:0.2,color:"#fff",fontFamily:"'DM Serif Display',serif"}}>P</div>
                <div style={{fontSize:11,color:"#666",letterSpacing:1}}>priya.png</div>
              </div>
              <div style={{position:"absolute",bottom:20,left:20,right:20,background:"rgba(255,255,255,0.15)",backdropFilter:"blur(12px)",borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:8,height:8,borderRadius:4,background:"#fbbf24"}}/>
                <div>
                  <div style={{color:"#fff",fontWeight:600,fontSize:13}}>Priya Pandey</div>
                  <div style={{color:"rgba(255,255,255,0.7)",fontSize:11}}>MSc Gold Medalist | Biology Educator</div>
                </div>
              </div>
              <div style={{position:"absolute",top:16,right:16,background:"rgba(22,163,74,0.9)",borderRadius:8,padding:"6px 10px",fontSize:10,fontWeight:700,color:"#fff",fontFamily:"'JetBrains Mono',monospace"}}>38 ATP → 30-32 ATP</div>
            </div>
          </div>
        </div>
      </section>

      {/* SUBJECT STRIP */}
      <div style={{background:"#fff",borderTop:"1px solid #e5e5e4",borderBottom:"1px solid #e5e5e4"}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"20px 24px",display:"flex",justifyContent:"center",gap:40}}>
          {[{label:"Biology",color:SUBJECT.bio,icon:"dna",count:"16 chapters"},{label:"Physics",color:SUBJECT.physics,icon:"bolt",count:"Coming soon"},{label:"Chemistry",color:SUBJECT.chemistry,icon:"flask",count:"Coming soon"}].map(s=>(
            <div key={s.label} style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{color:s.color}}>{Icons[s.icon]}</div>
              <div><div style={{fontWeight:600,fontSize:14,color:s.color}}>{s.label}</div><div style={{fontSize:11,color:"#9ca3af"}}>{s.count}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"80px 24px"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:40,marginBottom:12}}>How it <span style={{color:BRAND.red}}>works</span></h2>
          <p style={{color:"#9ca3af",fontSize:15,maxWidth:480,margin:"0 auto"}}>Every feature is designed for one outcome: your NEET rank.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {features.map((f,i)=>(
            <div key={i} className="feature-card" style={{background:"#fff",borderRadius:16,padding:28,border:"1px solid #e5e5e4",cursor:"default",transition:"all 0.2s"}}>
              <div style={{width:44,height:44,borderRadius:12,background:BRAND.redLight,display:"flex",alignItems:"center",justifyContent:"center",color:BRAND.red,marginBottom:16}}>{Icons[f.icon]}</div>
              <h3 style={{fontWeight:700,fontSize:16,marginBottom:8}}>{f.title}</h3>
              <p style={{fontSize:13,lineHeight:1.6,color:"#6b7280"}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10 INTERACTIVE BIOLOGY EXAMPLES */}
      <section id="chapters" style={{background:"#fff",padding:"80px 24px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:60,alignItems:"start"}}>
            <div style={{position:"sticky",top:100}}>
              <div style={{fontSize:11,fontWeight:700,color:SUBJECT.bio,letterSpacing:1.5,marginBottom:12}}>INTERACTIVE BIOLOGY</div>
              <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:36,marginBottom:16}}>10 topics. Tap to explore.</h2>
              <p style={{color:"#6b7280",fontSize:15,lineHeight:1.7,marginBottom:20}}>Every diagram on Desi Educators is interactive. No static images. Tap any topic, then tap each concept to reveal NCERT accurate details with exam relevant depth.</p>
              <div style={{padding:14,background:"#f0fdf4",borderRadius:10,border:"1px solid #dcfce7"}}>
                <div style={{fontSize:12,fontWeight:600,color:SUBJECT.bio,marginBottom:4}}>From Cell to Krebs Cycle</div>
                <div style={{fontSize:12,color:"#6b7280",lineHeight:1.5}}>Animal Cell, DNA Structure, Mitosis, Photosynthesis, Human Heart, Neuron, Flower Anatomy, Digestive System, Human Eye, Krebs Cycle</div>
              </div>
            </div>
            <InteractiveBioShowcase />
          </div>
        </div>
      </section>

      {/* DNA HELIX */}
      <section style={{padding:"80px 24px",background:"#fafaf9"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
          <DNAHelix />
          <div>
            <div style={{fontSize:11,fontWeight:700,color:BRAND.red,letterSpacing:1.5,marginBottom:12}}>CHARGAFF'S RULES</div>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:36,marginBottom:16}}>Hover the base pairs</h2>
            <p style={{color:"#6b7280",fontSize:15,lineHeight:1.7}}>A pairs with T (2 hydrogen bonds). G pairs with C (3 hydrogen bonds). The ratio [A+G]/[T+C] always equals 1. DNA is 2nm wide with a pitch of 3.4nm per complete turn.</p>
            <div style={{marginTop:20,padding:12,background:"#fff",borderRadius:10,border:`1.5px solid ${BRAND.red}22`,display:"inline-flex",alignItems:"center",gap:8}}>
              <span style={{color:BRAND.red}}>{Icons.check}</span>
              <span style={{fontSize:13,fontWeight:600,color:"#374151"}}>NCERT Chapter 6 verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUIZ */}
      <section id="quizzes" style={{padding:"80px 24px",background:"#fff"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"start"}}>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:BRAND.red,letterSpacing:1.5,marginBottom:12}}>ACTIVE RECALL</div>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:36,marginBottom:16}}>Test yourself <span style={{color:BRAND.red}}>now</span></h2>
            <p style={{color:"#6b7280",fontSize:15,lineHeight:1.7,marginBottom:24}}>3 quick questions. Earn 10 XP per correct answer. Build long term memory by retrieving, not rereading.</p>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              {[["30","MCQs"],["3","Quizzes"],["10","XP each"]].map(([n,l])=>(<div key={l} style={{textAlign:"center"}}><div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:700,color:BRAND.red}}>{n}</div><div style={{fontSize:10,color:"#9ca3af",fontWeight:600}}>{l}</div></div>))}
            </div>
          </div>
          <div style={{background:"#fff",borderRadius:20,padding:28,border:"1px solid #e5e5e4",boxShadow:"0 4px 20px rgba(0,0,0,0.04)"}}><QuizWidget /></div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section style={{padding:"80px 24px",background:"#fafaf9"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{color:BRAND.red,marginBottom:8,display:"flex",justifyContent:"center"}}>{Icons.trophy}</div>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:36}}>Leaderboard</h2>
            <p style={{color:"#9ca3af",fontSize:14,marginTop:8}}>Top performers this week</p>
          </div>
          <div style={{background:"#fff",borderRadius:16,border:"1px solid #e5e5e4",overflow:"hidden"}}>
            {leaders.map((l,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",padding:"14px 20px",borderBottom:i<leaders.length-1?"1px solid #f3f4f6":"none",gap:12}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:14,color:i<3?BRAND.red:"#9ca3af",width:24}}>#{i+1}</span>
                <StudentAvatar seed={l.seed} size={28}/>
                <span style={{flex:1,fontWeight:600,fontSize:14}}>{l.name}</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:14,color:SUBJECT.bio}}>{l.xp.toLocaleString()} XP</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EPISODES */}
      <section id="podcast" style={{padding:"80px 24px",background:"#fff"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <div style={{color:BRAND.red,marginBottom:8,display:"flex",justifyContent:"center"}}>{Icons.headphones}</div>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:36}}>Summit Neuro Podcast</h2>
            <p style={{color:"#9ca3af",fontSize:14,marginTop:8}}>Audio lessons by Priya Ma'am. Learn Biology by listening.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {episodes.map((ep,i)=>(
              <div key={i} style={{background:"#fafaf9",borderRadius:14,padding:20,border:"1px solid #e5e5e4",cursor:"pointer",transition:"all 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=BRAND.red;e.currentTarget.style.boxShadow=`0 4px 16px ${BRAND.red}11`}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="#e5e5e4";e.currentTarget.style.boxShadow="none"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                  <span style={{fontSize:10,fontWeight:600,color:SUBJECT.bio,background:"#f0fdf4",padding:"2px 8px",borderRadius:99}}>{ep.topic}</span>
                  <span style={{fontSize:11,color:"#9ca3af"}}>{ep.duration}</span>
                </div>
                <h4 style={{fontWeight:700,fontSize:15,marginBottom:8,lineHeight:1.4}}>{ep.title}</h4>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:28,height:28,borderRadius:14,background:BRAND.red,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{Icons.play}</div>
                  <span style={{fontSize:12,color:"#9ca3af"}}>{ep.plays} plays</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUMMIT NEURO EDUCATIONAL RESEARCH */}
      <section id="research" style={{padding:"80px 24px",background:"#fafaf9"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",background:"#fff",borderRadius:99,marginBottom:20,border:"1px solid #e5e5e4"}}>
              <div style={{color:BRAND.red}}>{Icons.globe}</div>
              <span style={{fontSize:12,fontWeight:600,color:"#374151"}}>Summit Neuro Educational Research</span>
            </div>
            <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:40,marginBottom:16}}>Backed by <span style={{color:BRAND.red}}>real science.</span></h2>
            <p style={{color:"#6b7280",fontSize:16,lineHeight:1.7,maxWidth:600,margin:"0 auto"}}>Our methodology draws on established European and American pedagogy, published research, and world class science education practice. Not invented. Proven.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,marginBottom:40}}>
            {[
              { title:"Active Recall", source:"Roediger & Karpicke (2006)", detail:"Testing effect: retrieving information from memory strengthens retention more than restudying. Published in Psychological Science.", color:"#7c3aed" },
              { title:"Spaced Repetition", source:"Ebbinghaus (1885), Cepeda et al. (2006)", detail:"Distributing practice over time produces better long term retention than massing. Meta analysis of 254 studies confirms the spacing effect.", color:SUBJECT.bio },
              { title:"Dual Coding", source:"Paivio (1971), Mayer (2009)", detail:"Combining verbal and visual information creates two memory traces. Multimedia learning principles applied across all our interactive diagrams.", color:SUBJECT.physics },
            ].map((r,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:16,padding:24,border:"1px solid #e5e5e4"}}>
                <div style={{width:36,height:4,borderRadius:2,background:r.color,marginBottom:16}}/>
                <h3 style={{fontWeight:700,fontSize:16,marginBottom:4}}>{r.title}</h3>
                <div style={{fontSize:11,fontWeight:600,color:r.color,marginBottom:10}}>{r.source}</div>
                <p style={{fontSize:13,lineHeight:1.6,color:"#6b7280"}}>{r.detail}</p>
              </div>
            ))}
          </div>
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
        </div>
      </section>

      {/* PRIYA AI */}
      <section id="priya-ai" style={{background:"#111",padding:"80px 24px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,opacity:0.03,backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",background:"rgba(196,30,30,0.15)",borderRadius:99,marginBottom:20}}>
            <div style={{color:BRAND.red}}>{Icons.robot}</div>
            <span style={{fontSize:12,fontWeight:600,color:BRAND.red}}>AI Tutor</span>
          </div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:44,color:"#fff",marginBottom:16}}>Meet <span style={{color:BRAND.red}}>Priya AI</span></h2>
          <p style={{color:"#9ca3af",fontSize:16,lineHeight:1.7,marginBottom:32,maxWidth:520,margin:"0 auto 32px"}}>Trained on Priya Ma'am's teaching methodology. Ask any NEET Biology question. Get answers in Hindi. Available 24/7 on Telegram.</p>
          <div style={{display:"flex",gap:12,justifyContent:"center"}}>
            <button style={{padding:"14px 28px",background:BRAND.red,color:"#fff",border:"none",borderRadius:10,fontWeight:600,fontSize:15,cursor:"pointer",boxShadow:`0 4px 20px ${BRAND.red}44`}}>Try Priya AI Free</button>
            <button style={{padding:"14px 28px",background:"transparent",color:"#fff",border:"1.5px solid #333",borderRadius:10,fontWeight:600,fontSize:15,cursor:"pointer"}}>View on Telegram</button>
          </div>
        </div>
      </section>

      {/* NCERT */}
      <section style={{padding:"80px 24px",background:"#fafaf9"}}>
        <div style={{maxWidth:800,margin:"0 auto",textAlign:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",background:"#f0fdf4",borderRadius:99,marginBottom:20}}>
            <span style={{color:SUBJECT.bio}}>{Icons.check}</span>
            <span style={{fontSize:12,fontWeight:600,color:SUBJECT.bio}}>NCERT Verified</span>
          </div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:36,marginBottom:16}}>We found errors in NCERT. <span style={{color:BRAND.red}}>We filed RTI.</span></h2>
          <p style={{color:"#6b7280",fontSize:15,lineHeight:1.7,maxWidth:600,margin:"0 auto 28px"}}>The NCERT Biology textbook states aerobic respiration yields 38 ATP. Modern biochemistry (Berg et al., Lehninger) puts the actual figure at 30 to 32 ATP. We filed 22 RTI queries to NCERT. Response awaited.</p>
          <div style={{display:"inline-flex",gap:24,padding:"16px 28px",background:"#fff",borderRadius:14,border:"1px solid #e5e5e4"}}>
            {[{num:"6+",label:"Errors found"},{num:"22",label:"RTI queries filed"},{num:"0",label:"False claims"}].map(s=>(
              <div key={s.label} style={{textAlign:"center"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:BRAND.red}}>{s.num}</div>
                <div style={{fontSize:11,color:"#9ca3af",fontWeight:500}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:"80px 24px",background:"#fff"}}>
        <div style={{maxWidth:600,margin:"0 auto",textAlign:"center"}}>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:44,marginBottom:16}}>Your NEET rank starts <span style={{color:BRAND.red}}>here.</span></h2>
          <p style={{color:"#6b7280",fontSize:16,lineHeight:1.7,marginBottom:32}}>Free to start. No credit card. Join 2,400+ students preparing with Priya Ma'am.</p>
          <button style={{padding:"16px 40px",background:BRAND.red,color:"#fff",border:"none",borderRadius:12,fontWeight:700,fontSize:17,cursor:"pointer",boxShadow:`0 6px 24px ${BRAND.red}33`}}>Start Learning Free</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#111",padding:"40px 24px",borderTop:"1px solid #222"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <div style={{width:24,height:24,background:BRAND.red,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"#fff",fontWeight:700,fontSize:12,fontFamily:"'DM Serif Display',serif"}}>D</span></div>
              <span style={{fontFamily:"'DM Serif Display',serif",fontSize:16,color:"#fff"}}>Desi Educators</span>
            </div>
            <p style={{fontSize:12,color:"#6b7280"}}>Biology with Priya Ma'am. Built for NEET. A Summit Neuro Educational Research initiative.</p>
          </div>
          <div style={{display:"flex",gap:24}}>{["Privacy","Terms","Research","Contact"].map(l=>(<a key={l} href="#" style={{fontSize:13,color:"#6b7280",textDecoration:"none"}}>{l}</a>))}</div>
        </div>
      </footer>
    </div>
  );
}
