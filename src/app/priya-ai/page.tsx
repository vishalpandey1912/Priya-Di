"use client";
import { useState, useRef, useEffect } from "react";

const BRAND = { red: "#c41e1e", redLight: "#fef2f2" };

export default function PriyaAIPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Namaste! Main Priya AI hoon. NEET Biology se related koi bhi question pucho. Main Priya Ma'am ki methodology se answer doongi. Hindi ya English, jo aapko comfortable lage." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/priya-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.reply || "Sorry, kuch error aa gaya. Please try again." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Connection error. Please check your internet and try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{fontFamily:"'Karla',sans-serif",minHeight:"100vh",background:"#fafaf9",display:"flex",flexDirection:"column"}}>
      

      {/* HEADER */}
      <header style={{background:"rgba(250,250,249,0.92)",backdropFilter:"blur(12px)",borderBottom:"1px solid #e5e5e4",padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <a href="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
            <div style={{width:32,height:32,background:BRAND.red,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:16,fontFamily:"'Cormorant Garamond',serif"}}>D</span>
            </div>
          </a>
          <div style={{width:1,height:24,background:"#e5e5e4"}}/>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:"#111"}}>Priya AI</div>
            <div style={{fontSize:11,color:"#16a34a",fontWeight:500}}>Online</div>
          </div>
        </div>
        <a href="https://t.me/ProfPriyaPandeybot" target="_blank" rel="noopener noreferrer"
          style={{padding:"6px 16px",background:"#fff",border:"1px solid #e5e5e4",borderRadius:8,fontSize:12,fontWeight:600,color:"#374151",textDecoration:"none"}}>
          Open in Telegram
        </a>
      </header>

      {/* CHAT AREA */}
      <div style={{flex:1,overflowY:"auto",padding:"24px 24px 100px",maxWidth:720,width:"100%",margin:"0 auto"}}>
        {/* INFO BANNER */}
        <div style={{background:"#fff",border:"1px solid #e5e5e4",borderRadius:12,padding:16,marginBottom:24,textAlign:"center"}}>
          <div style={{fontSize:13,color:"#6b7280",lineHeight:1.6}}>
            Priya AI is trained on Priya Ma'am's NEET Biology methodology. Ask any question from NCERT Class 11 and 12 Biology. Answers in Hindi and English.
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:12,flexWrap:"wrap"}}>
            {["Cell Biology","Genetics","Human Physiology","Plant Physiology","Ecology","Biotechnology"].map(t=>(
              <span key={t} style={{padding:"4px 10px",background:"#f0fdf4",borderRadius:99,fontSize:11,fontWeight:600,color:"#16a34a"}}>{t}</span>
            ))}
          </div>
        </div>

        {/* MESSAGES */}
        {messages.map((msg, i) => (
          <div key={i} style={{display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start",marginBottom:12}}>
            <div style={{
              maxWidth:"80%",
              padding:"12px 16px",
              borderRadius:msg.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
              background:msg.role==="user"?BRAND.red:"#fff",
              color:msg.role==="user"?"#fff":"#111",
              fontSize:14,
              lineHeight:1.6,
              border:msg.role==="user"?"none":"1px solid #e5e5e4",
              boxShadow:msg.role==="user"?"none":"0 1px 3px rgba(0,0,0,0.04)"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",justifyContent:"flex-start",marginBottom:12}}>
            <div style={{padding:"12px 16px",borderRadius:"16px 16px 16px 4px",background:"#fff",border:"1px solid #e5e5e4",fontSize:14,color:"#9ca3af"}}>
              Typing...
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* INPUT BAR */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(250,250,249,0.95)",backdropFilter:"blur(12px)",borderTop:"1px solid #e5e5e4",padding:"12px 24px"}}>
        <div style={{maxWidth:720,margin:"0 auto",display:"flex",gap:8}}>
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&sendMessage()}
            placeholder="Ask any NEET Biology question..."
            style={{flex:1,padding:"12px 16px",border:"1.5px solid #e5e5e4",borderRadius:10,fontSize:14,outline:"none",fontFamily:"'Karla',sans-serif",background:"#fff"}}
          />
          <button onClick={sendMessage} disabled={loading||!input.trim()}
            style={{padding:"12px 24px",background:BRAND.red,color:"#fff",border:"none",borderRadius:10,fontWeight:600,fontSize:14,cursor:"pointer",opacity:loading||!input.trim()?0.5:1}}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
