import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Rainbow Loyalty Programme — Scratch-card referral experience
   Route: /referral  |  noindex (server-side + meta)
───────────────────────────────────────────────────────────────────────────── */

const COLORS = ['#7F77DD','#1D9E75','#D85A30','#D4537E','#378ADD','#EF9F27','#639922'];
const RES    = 240;
const BRUSH  = 14;
const THRESHOLD = 0.55;

interface Particle {
  x:number; y:number; vx:number; vy:number;
  size:number; color:string; rot:number; vr:number;
  gravity:number; life:number; maxLife:number; fade:boolean;
}
interface Engine {
  resize():void;
  spawnFall(n:number):void;
  spawnBurst(x:number,y:number,n:number):void;
  ensureRunning():void;
  burstAt(container:HTMLElement, target:HTMLElement, n:number):void;
  destroy():void;
}

function makeEngine(canvas: HTMLCanvasElement): Engine {
  const ctx = canvas.getContext('2d')!;
  let particles: Particle[] = [];
  let running = false;
  let raf = 0;

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    canvas.width  = Math.max(1, Math.round(r.width));
    canvas.height = Math.max(1, Math.round(r.height));
  };

  const spawnFall = (n: number) => {
    const {width:w} = canvas;
    for (let i=0;i<n;i++) particles.push({
      x:Math.random()*w, y:-20-Math.random()*200,
      vx:(Math.random()-.5)*2, vy:Math.random()*2+2,
      size:Math.random()*6+4, color:COLORS[Math.floor(Math.random()*COLORS.length)],
      rot:Math.random()*Math.PI, vr:(Math.random()-.5)*.25,
      gravity:.03, life:0, maxLife:320, fade:false,
    });
  };

  const spawnBurst = (x:number, y:number, n:number) => {
    for (let i=0;i<n;i++) {
      const a=Math.random()*Math.PI*2, s=Math.random()*4+2;
      particles.push({
        x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s-2,
        size:Math.random()*5+3, color:COLORS[Math.floor(Math.random()*COLORS.length)],
        rot:Math.random()*Math.PI, vr:(Math.random()-.5)*.3,
        gravity:.12, life:0, maxLife:55, fade:true,
      });
    }
  };

  const ensureRunning = () => {
    if (running) return;
    running = true;
    const loop = () => {
      const {width:w, height:h} = canvas;
      ctx.clearRect(0,0,w,h);
      particles = particles.filter(p=>p.life<p.maxLife);
      let alive = false;
      for (const p of particles) {
        p.vy+=p.gravity; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.life++;
        if (p.y<h+30 && p.life<p.maxLife) alive=true;
        ctx.save();
        ctx.globalAlpha = p.fade ? Math.max(0,1-p.life/p.maxLife) : 1;
        ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*.6);
        ctx.restore();
      }
      if (alive) { raf=requestAnimationFrame(loop); }
      else { running=false; ctx.clearRect(0,0,w,h); }
    };
    raf = requestAnimationFrame(loop);
  };

  const burstAt = (containerEl:HTMLElement, targetEl:HTMLElement, n:number) => {
    resize();
    const c=containerEl.getBoundingClientRect(), t=targetEl.getBoundingClientRect();
    spawnBurst((t.left+t.width/2)-c.left, (t.top+t.height/2)-c.top, n);
    ensureRunning();
  };

  const destroy = () => { cancelAnimationFrame(raf); running=false; particles=[]; };

  return { resize, spawnFall, spawnBurst, ensureRunning, burstAt, destroy };
}

/* ── Scoped CSS ─────────────────────────────────────────────────────────── */
const STYLES = `
  @keyframes rlp-floaty     { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-9px) } }
  @keyframes rlp-floatySlow { 0%,100%{ transform:translateY(0) rotate(0deg) } 50%{ transform:translateY(-11px) rotate(5deg) } }
  @keyframes rlp-twinkle    { 0%,100%{ opacity:.35;transform:scale(.82) } 50%{ opacity:1;transform:scale(1.18) } }
  @keyframes rlp-popIn      { 0%{ opacity:0;transform:scale(.55) translateY(16px) } 70%{ transform:scale(1.07) translateY(-2px) } 100%{ opacity:1;transform:scale(1) translateY(0) } }
  @keyframes rlp-slideUp    { from{ opacity:0;transform:translateY(26px) } to{ opacity:1;transform:translateY(0) } }
  @keyframes rlp-wiggle     { 0%,100%{ transform:rotate(-7deg) } 50%{ transform:rotate(7deg) } }
  @keyframes rlp-shimmer    { 0%{ left:-60% } 100%{ left:130% } }
  @keyframes rlp-glowPulse  { 0%,100%{ box-shadow:0 0 0 0 rgba(93,202,165,.45) } 50%{ box-shadow:0 0 0 9px rgba(93,202,165,0) } }
  @keyframes rlp-rotateSlow { from{ transform:rotate(0deg) } to{ transform:rotate(360deg) } }
  @keyframes rlp-stampIn    { 0%{ transform:scale(0) rotate(-15deg);opacity:0 } 60%{ transform:scale(1.14) rotate(5deg);opacity:1 } 100%{ transform:scale(1) rotate(0deg);opacity:1 } }
  @keyframes rlp-breathe    { 0%,100%{ transform:scale(1) } 50%{ transform:scale(1.035) } }
  @keyframes rlp-bob        { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-5px) } }
  @keyframes rlp-hintFade   { 0%{ opacity:1 } 100%{ opacity:0;pointer-events:none } }
  @keyframes rlp-ringPulse  { 0%,100%{ opacity:.6 } 50%{ opacity:1 } }
  @keyframes rlp-orbit      { from{ transform:rotate(0deg) translateX(115px) } to{ transform:rotate(360deg) translateX(115px) } }

  .rlp-root { width:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }

  /* shimmer sweep */
  .rlp-shine { position:relative;overflow:hidden; }
  .rlp-shine::after { content:'';position:absolute;top:0;left:-60%;width:35%;height:100%;
    background:linear-gradient(120deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.6) 50%,rgba(255,255,255,0) 100%);
    transform:skewX(-20deg);animation:rlp-shimmer 2.8s ease-in-out infinite;pointer-events:none; }

  /* sunburst behind offer card */
  .rlp-sunburst { position:absolute;top:50%;left:50%;width:260px;height:260px;margin:-130px 0 0 -130px;
    background:conic-gradient(from 0deg,rgba(255,215,140,.3) 0deg 10deg,transparent 10deg 30deg);
    border-radius:50%;animation:rlp-rotateSlow 16s linear infinite;z-index:0;pointer-events:none; }

  /* button states */
  .rlp-refer-btn { transition:transform .2s ease,box-shadow .2s ease;cursor:pointer; }
  .rlp-refer-btn:hover { transform:translateY(-4px) scale(1.05);box-shadow:0 14px 28px rgba(127,119,221,.4); }
  .rlp-refer-btn:active { transform:scale(.94); }
  .rlp-vbtn { transition:transform .2s ease,box-shadow .2s ease;cursor:pointer; }
  .rlp-vbtn:hover { transform:translateY(-5px) scale(1.06); }
  .rlp-vbtn:active { transform:scale(.93) translateY(0); }
  .rlp-vbtn[data-school="preschool"]:hover  { box-shadow:0 12px 24px rgba(237,147,177,.45); }
  .rlp-vbtn[data-school="international"]:hover { box-shadow:0 12px 24px rgba(175,169,236,.45); }
  .rlp-benefit { transition:transform .18s ease,box-shadow .18s ease;cursor:default; }
  .rlp-benefit:hover { transform:translateY(-3px);box-shadow:0 8px 20px rgba(0,0,0,.1); }
  .rlp-dodge { cursor:default; }
`;

export default function ReferralPage() {
  const [screen,     setScreen]     = useState<'scratch'|'reveal'>('scratch');
  const [scratchPct, setScratchPct] = useState(0);
  const [hinting,    setHinting]    = useState(true);
  const [videoModal, setVideoModal] = useState<null|'preschool'|'international'>(null);
  const [badgeDelta, setBadgeDelta] = useState({x:0,y:0});

  const scratchRef = useRef<HTMLCanvasElement>(null);
  const fx1Ref     = useRef<HTMLCanvasElement>(null);
  const fxRef      = useRef<HTMLCanvasElement>(null);
  const screen1Ref = useRef<HTMLDivElement>(null);
  const screen2Ref = useRef<HTMLDivElement>(null);
  const referBtnRef= useRef<HTMLAnchorElement>(null);
  const badgeRef   = useRef<HTMLDivElement>(null);
  const eng1       = useRef<Engine|null>(null);
  const eng2       = useRef<Engine|null>(null);
  const revealed   = useRef(false);
  const scratching = useRef(false);
  const lastPos    = useRef<{x:number;y:number}|null>(null);

  /* ── Load tabler icons ──────────────────────────────────────────────── */
  useEffect(() => {
    const id = 'tabler-icons-css';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id; link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/dist/tabler-icons.min.css';
    document.head.appendChild(link);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  /* ── Noindex meta ───────────────────────────────────────────────────── */
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots'; meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  /* ── Paint scratch canvas ───────────────────────────────────────────── */
  useEffect(() => {
    const canvas = scratchRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0,0,RES,RES);
    ctx.save();
    ctx.beginPath(); ctx.arc(RES/2,RES/2,RES/2,0,Math.PI*2); ctx.clip();

    // layered gradient
    const g = ctx.createLinearGradient(0,0,RES,RES);
    g.addColorStop(0,'#E8A8F0'); g.addColorStop(.2,'#A8C4F0');
    g.addColorStop(.45,'#A8E8C8'); g.addColorStop(.7,'#F0D8A8'); g.addColorStop(1,'#F0A8B8');
    ctx.fillStyle=g; ctx.fillRect(0,0,RES,RES);

    // subtle texture lines
    for (let i=0;i<280;i++) {
      ctx.strokeStyle=`rgba(255,255,255,${Math.random()*.14})`;
      ctx.lineWidth=Math.random()*1.5+.5;
      ctx.beginPath(); ctx.moveTo(Math.random()*RES,Math.random()*RES);
      ctx.lineTo(Math.random()*RES,Math.random()*RES); ctx.stroke();
    }
    // inner glow ring
    const rg = ctx.createRadialGradient(RES/2,RES/2,60,RES/2,RES/2,RES/2);
    rg.addColorStop(0,'rgba(255,255,255,.08)'); rg.addColorStop(1,'rgba(0,0,0,.12)');
    ctx.fillStyle=rg; ctx.fillRect(0,0,RES,RES);

    ctx.restore();
    ctx.fillStyle='rgba(30,25,80,0.78)';
    ctx.font='700 15px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';
    ctx.textAlign='center';
    ctx.fillText('SCRATCH',RES/2,RES/2-9);
    ctx.fillText('& WIN',RES/2,RES/2+14);
  }, []);

  /* ── Confetti engine 1 (scratch screen) ────────────────────────────── */
  useEffect(() => {
    const canvas = fx1Ref.current;
    if (!canvas) return;
    eng1.current = makeEngine(canvas);
    return () => { eng1.current?.destroy(); eng1.current=null; };
  }, []);

  /* ── Confetti engine 2 (reveal screen) ─────────────────────────────── */
  useEffect(() => {
    if (screen !== 'reveal') return;
    const canvas = fxRef.current;
    if (!canvas) return;
    const e = makeEngine(canvas);
    eng2.current = e;
    e.resize(); e.spawnFall(180); e.ensureRunning();
    return () => { e.destroy(); eng2.current=null; };
  }, [screen]);

  /* ── Scratch event listeners ────────────────────────────────────────── */
  useEffect(() => {
    const canvas = scratchRef.current;
    if (!canvas) return;

    const getPos = (e: MouseEvent|TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      const cx='touches' in e ? e.touches[0].clientX : e.clientX;
      const cy='touches' in e ? e.touches[0].clientY : e.clientY;
      return { x:(cx-r.left)*(RES/r.width), y:(cy-r.top)*(RES/r.height) };
    };
    const dot = (x:number,y:number) => {
      const ctx=canvas.getContext('2d')!;
      ctx.globalCompositeOperation='destination-out';
      ctx.beginPath(); ctx.arc(x,y,BRUSH,0,Math.PI*2); ctx.fill();
    };
    const line = (p0:{x:number;y:number}, p1:{x:number;y:number}) => {
      const d=Math.hypot(p1.x-p0.x,p1.y-p0.y), steps=Math.max(1,Math.floor(d/4));
      for (let i=0;i<=steps;i++) { const t=i/steps; dot(p0.x+(p1.x-p0.x)*t, p0.y+(p1.y-p0.y)*t); }
    };
    const check = () => {
      if (revealed.current) return;
      const data=canvas.getContext('2d')!.getImageData(0,0,RES,RES).data;
      let cleared=0, total=0;
      for (let i=3;i<data.length;i+=4*6) { total++; if (data[i]<40) cleared++; }
      const pct=cleared/total;
      setScratchPct(Math.min(1,pct));
      if (pct>THRESHOLD) { revealed.current=true; setTimeout(()=>setScreen('reveal'),380); }
    };
    const onDown = (e:MouseEvent|TouchEvent) => {
      scratching.current=true;
      setHinting(false);
      const p=getPos(e); lastPos.current=p; dot(p.x,p.y); e.preventDefault();
    };
    const onMove = (e:MouseEvent|TouchEvent) => {
      if (!scratching.current||revealed.current) return;
      const p=getPos(e); line(lastPos.current||p,p); lastPos.current=p; check(); e.preventDefault();
    };
    const onUp = () => { scratching.current=false; lastPos.current=null; };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onDown, {passive:false});
    canvas.addEventListener('touchmove',  onMove, {passive:false});
    canvas.addEventListener('touchend',   onUp);
    return () => {
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('touchstart', onDown);
      canvas.removeEventListener('touchmove',  onMove);
      canvas.removeEventListener('touchend',   onUp);
    };
  }, []);

  /* ── Resize confetti on window resize ──────────────────────────────── */
  useEffect(() => {
    const onResize = () => { eng1.current?.resize(); eng2.current?.resize(); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Dodge helpers ──────────────────────────────────────────────────── */
  const dodgeEnter = (e: React.MouseEvent<HTMLElement>) => {
    const el=e.currentTarget;
    const dx=(Math.random()>.5?1:-1)*(18+Math.random()*28);
    const dy=(Math.random()>.5?1:-1)*(18+Math.random()*28);
    el.style.transition='transform .35s ease'; el.style.animationPlayState='paused';
    el.style.transform=`translate(${dx}px,${dy}px)`;
  };
  const dodgeLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el=e.currentTarget;
    el.style.transition='transform .5s ease'; el.style.transform='';
    setTimeout(()=>{ el.style.animationPlayState='running'; }, 500);
  };

  const nudgeBadge = () => {
    const dx=(Math.random()>.5?1:-1)*(32+Math.random()*38);
    const dy=(Math.random()>.5?1:-1)*(22+Math.random()*32);
    setBadgeDelta({x:dx,y:dy});
    setTimeout(()=>setBadgeDelta({x:0,y:0}), 500);
  };
  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const b=badgeRef.current, s=screen1Ref.current;
    if (b&&s) {
      const bR=b.getBoundingClientRect(), cR=s.getBoundingClientRect();
      eng1.current?.resize();
      eng1.current?.spawnBurst(bR.left+bR.width/2-cR.left, bR.top+bR.height/2-cR.top, 48);
      eng1.current?.ensureRunning();
    }
    nudgeBadge();
  };

  const handleRefer = () => {
    const s=screen2Ref.current, b=referBtnRef.current;
    if (s&&b) eng2.current?.burstAt(s,b,35);
  };
  const openVideo = (school:'preschool'|'international', e:React.MouseEvent) => {
    const s=screen2Ref.current, btn=e.currentTarget as HTMLElement;
    if (s&&btn) eng2.current?.burstAt(s,btn,30);
    setVideoModal(school);
  };

  /* ── SVG progress ring ──────────────────────────────────────────────── */
  const RING_R = 126; // radius around the 240px canvas (padded inside wrapper)
  const RING_C = 2 * Math.PI * RING_R;
  const ringOffset = RING_C * (1 - scratchPct);

  /* ── Decorative icon shorthand ──────────────────────────────────────── */
  const D = ({cls,style}:{cls:string;style:React.CSSProperties}) => (
    <i className={`ti ${cls} rlp-dodge`} onMouseEnter={dodgeEnter} onMouseLeave={dodgeLeave}
       style={style} aria-hidden="true" />
  );

  /* ─────────────────────────────────────────────────────────────────────
     BENEFITS config
  ───────────────────────────────────────────────────────────────────── */
  const BENEFITS = [
    {icon:'ti-coin',       bg:'#FFF0E8', accent:'#D85A30', fg:'#5A2210', label:'Earn loyalty points'},
    {icon:'ti-ticket',     bg:'#EEF7E2', accent:'#639922', fg:'#263B0A', label:'Gift vouchers'},
    {icon:'ti-gift',       bg:'#EEF0FE', accent:'#7F77DD', fg:'#26215C', label:'Assured goodies'},
    {icon:'ti-star-filled',bg:'#E8F4FF', accent:'#378ADD', fg:'#0A2B50', label:'Surprise gift on 500 pts'},
    {icon:'ti-confetti',   bg:'#FDE8F2', accent:'#D4537E', fg:'#4B1528', label:'Loyalty party invite'},
  ];

  /* ── RENDER ─────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{STYLES}</style>
      <div className="rlp-root">

        {/* ════════════════ SCREEN 1 — Scratch ════════════════ */}
        {screen === 'scratch' && (
          <div
            ref={screen1Ref}
            style={{
              position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', padding:'6vw 5vw',
              background:'linear-gradient(145deg,#F8F5FF 0%,#FFF2F9 50%,#F2F8FF 100%)',
              overflow:'hidden',
            }}
          >
            {/* confetti canvas */}
            <canvas ref={fx1Ref} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:6}} />

            {/* floating icon decorations — tabler, no emojis */}
            <D cls="ti-star-filled"    style={{position:'absolute',top:22,  left:20,  fontSize:20, color:'#FAC775', animation:'rlp-twinkle 2.4s ease-in-out infinite'}} />
            <D cls="ti-heart-filled"   style={{position:'absolute',top:18,  right:26, fontSize:17, color:'#ED93B1', animation:'rlp-floatySlow 3.6s ease-in-out infinite'}} />
            <D cls="ti-sparkles"       style={{position:'absolute',top:72,  left:28,  fontSize:15, color:'#85B7EB', animation:'rlp-twinkle 2.2s ease-in-out infinite .7s'}} />
            <D cls="ti-star-filled"    style={{position:'absolute',top:120, right:22, fontSize:15, color:'#97C459', animation:'rlp-twinkle 2.7s ease-in-out infinite .2s'}} />
            <D cls="ti-gift"           style={{position:'absolute',bottom:28,left:22, fontSize:22, color:'#D85A30', animation:'rlp-floatySlow 4.2s ease-in-out infinite .4s'}} />
            <D cls="ti-balloon-filled" style={{position:'absolute',bottom:40,right:18,fontSize:28, color:'#AFA9EC', animation:'rlp-floaty 3.8s ease-in-out infinite .6s'}} />
            <D cls="ti-diamond-filled" style={{position:'absolute',top:'50%',left:14, fontSize:14, color:'#F0A8B8', animation:'rlp-twinkle 3s ease-in-out infinite 1s'}} />
            <D cls="ti-diamond-filled" style={{position:'absolute',top:'40%',right:16,fontSize:12, color:'#A8C4F0', animation:'rlp-twinkle 3.2s ease-in-out infinite .5s'}} />

            <div style={{position:'relative',width:'100%',maxWidth:400,textAlign:'center'}}>

              {/* headline */}
              <div style={{marginBottom:6}}>
                <span style={{display:'inline-block',background:'linear-gradient(90deg,#7F77DD,#D4537E)',
                  borderRadius:20,padding:'3px 14px',fontSize:11,fontWeight:600,
                  color:'#fff',letterSpacing:'.6px',marginBottom:12,
                  animation:'rlp-slideUp .4s ease-out both'}}>
                  EXCLUSIVE REWARD
                </span>
              </div>
              <div style={{fontSize:'clamp(22px,6vw,30px)',fontWeight:600,color:'#1E1950',
                lineHeight:1.22,animation:'rlp-slideUp .45s ease-out .1s both'}}>
                A surprise<br />
                <span style={{background:'linear-gradient(90deg,#7F77DD,#D4537E)',
                  WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                  awaits you
                </span>
              </div>
              <div style={{fontSize:13.5,color:'#6B6A8A',marginTop:8,marginBottom:28,
                animation:'rlp-slideUp .45s ease-out .2s both'}}>
                Scratch the circle below to reveal your reward
              </div>

              {/* scratch card with progress ring */}
              <div style={{position:'relative',width:260,height:260,margin:'0 auto',
                display:'flex',alignItems:'center',justifyContent:'center',
                animation:'rlp-slideUp .5s ease-out .25s both'}}>

                {/* SVG progress ring */}
                <svg
                  viewBox="0 0 280 280" width="260" height="260"
                  style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:3}}
                >
                  {/* track */}
                  <circle cx="140" cy="140" r={RING_R} fill="none"
                    stroke="rgba(127,119,221,.15)" strokeWidth="3" />
                  {/* fill */}
                  <circle cx="140" cy="140" r={RING_R} fill="none"
                    stroke="url(#ringGrad)" strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={RING_C}
                    strokeDashoffset={ringOffset}
                    style={{transformOrigin:'center',transform:'rotate(-90deg)',
                      transition:'stroke-dashoffset .1s linear',
                      animation:'rlp-ringPulse 2s ease-in-out infinite'}}
                  />
                  <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="#7F77DD" />
                      <stop offset="100%" stopColor="#D4537E" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* canvas */}
                <canvas
                  ref={scratchRef} width={RES} height={RES}
                  style={{width:220,height:220,borderRadius:'50%',
                    touchAction:'none',cursor:'crosshair',display:'block',zIndex:2,
                    boxShadow:'0 8px 28px rgba(127,119,221,.28), 0 2px 8px rgba(0,0,0,.08)'}}
                />

                {/* animated hint overlay (disappears once scratching starts) */}
                {hinting && (
                  <div style={{position:'absolute',inset:0,borderRadius:'50%',
                    display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                    pointerEvents:'none',zIndex:4,animation:'rlp-breathe 1.8s ease-in-out infinite'}}>
                    <i className="ti ti-hand-move" aria-hidden="true"
                      style={{fontSize:30,color:'rgba(30,25,80,.55)'}} />
                    <span style={{fontSize:10,fontWeight:600,color:'rgba(30,25,80,.45)',
                      letterSpacing:'.5px',marginTop:4}}>SCRATCH</span>
                  </div>
                )}

                {/* wiggle hint icon at bottom-right of circle */}
                <i className="ti ti-hand-click" aria-hidden="true"
                  style={{position:'absolute',bottom:2,right:2,fontSize:24,color:'#26215C',
                    background:'#fff',borderRadius:'50%',padding:6,zIndex:5,
                    boxShadow:'0 4px 10px rgba(0,0,0,.15)',
                    animation:'rlp-wiggle 1.7s ease-in-out infinite'}} />

                {/* rainbow badge — dodges on hover/click */}
                <div
                  ref={badgeRef}
                  onClick={handleBadgeClick}
                  onMouseEnter={nudgeBadge}
                  style={{position:'absolute',top:-12,left:-10,zIndex:5,cursor:'pointer',
                    transition:'transform .35s cubic-bezier(.34,1.56,.64,1)',
                    transform:`translate(${badgeDelta.x}px,${badgeDelta.y}px)`}}
                >
                  {/* shadow blob */}
                  <div style={{position:'absolute',width:52,height:52,background:'#F8C98A',
                    borderRadius:16,transform:'rotate(20deg)',top:8,left:6,opacity:.85}} />
                  <div style={{position:'relative',width:50,height:50,borderRadius:'50%',
                    background:'linear-gradient(135deg,#7F77DD,#534AB7)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    boxShadow:'0 6px 16px rgba(83,74,183,.45)',animation:'rlp-floaty 3.2s ease-in-out infinite'}}>
                    <svg width="26" height="15" viewBox="0 0 40 22" aria-hidden="true">
                      <path d="M2 20 A18 18 0 0 1 38 20" fill="none" stroke="#fff"     strokeWidth="3.5" strokeLinecap="round"/>
                      <path d="M7 20 A13 13 0 0 1 33 20" fill="none" stroke="#FAC775" strokeWidth="3.5" strokeLinecap="round"/>
                      <path d="M12 20 A8 8 0 0 1 28 20" fill="none" stroke="#97C459" strokeWidth="3.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* progress text + hint */}
              <div style={{marginTop:20,animation:'rlp-slideUp .5s ease-out .35s both'}}>
                {scratchPct > 0.05 ? (
                  <div style={{fontSize:12,color:'#7F77DD',fontWeight:600,
                    letterSpacing:'.3px',transition:'opacity .3s ease'}}>
                    {Math.round(scratchPct*100)}% revealed — keep going!
                  </div>
                ) : (
                  <div style={{fontSize:12,color:'#9B9AAC',fontStyle:'italic'}}>
                    Try catching the little rainbow badge too!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ SCREEN 2 — Reveal ════════════════ */}
        {screen === 'reveal' && (
          <div
            ref={screen2Ref}
            style={{
              position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', padding:'7vw 5vw 10vw',
              background:'linear-gradient(145deg,#FDE8F5 0%,#EAE4FF 50%,#E4F1FF 100%)',
              overflow:'hidden',
            }}
          >
            <canvas ref={fxRef} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:5}} />

            {/* floating decorations */}
            <D cls="ti-balloon-filled" style={{position:'absolute',top:18,  left:14,  fontSize:34,color:'#AFA9EC',animation:'rlp-floaty 3.4s ease-in-out infinite'}} />
            <D cls="ti-balloon-filled" style={{position:'absolute',top:12,  right:16, fontSize:30,color:'#ED93B1',animation:'rlp-floaty 3.8s ease-in-out infinite .5s'}} />
            <D cls="ti-star-filled"    style={{position:'absolute',top:80,  left:32,  fontSize:14,color:'#FAC775',animation:'rlp-twinkle 2.5s ease-in-out infinite'}} />
            <D cls="ti-star-filled"    style={{position:'absolute',top:64,  right:64, fontSize:14,color:'#FAC775',animation:'rlp-twinkle 2.3s ease-in-out infinite .6s'}} />
            <D cls="ti-sparkles"       style={{position:'absolute',top:120, right:22, fontSize:16,color:'#85B7EB',animation:'rlp-twinkle 2.7s ease-in-out infinite .3s'}} />
            <D cls="ti-diamond-filled" style={{position:'absolute',bottom:60,left:18, fontSize:14,color:'#D4537E',animation:'rlp-twinkle 3.1s ease-in-out infinite .8s'}} />
            <D cls="ti-diamond-filled" style={{position:'absolute',bottom:40,right:20,fontSize:12,color:'#97C459',animation:'rlp-twinkle 2.9s ease-in-out infinite 1.2s'}} />

            <div style={{position:'relative',zIndex:2,width:'100%',maxWidth:420,textAlign:'center'}}>

              {/* congratulations header */}
              <div style={{animation:'rlp-popIn .5s ease-out both'}}>
                <i className="ti ti-trophy" aria-hidden="true"
                  style={{fontSize:38,color:'#D4A017',display:'block',marginBottom:6,
                    animation:'rlp-wiggle 2s ease-in-out infinite'}} />
                <div style={{fontSize:'clamp(24px,7vw,30px)',fontWeight:700,color:'#1E1950',letterSpacing:'-.3px'}}>
                  Congratulations!
                </div>
                <div style={{fontSize:13.5,color:'#534AB7',marginTop:4,fontWeight:500}}>
                  You've earned something special
                </div>
              </div>

              {/* ── Offer card ───────────────────────────────── */}
              <div className="rlp-shine"
                style={{marginTop:22,background:'linear-gradient(150deg,#FFFFFF 0%,#FDEAF7 45%,#EEF0FE 100%)',
                  borderRadius:22,padding:'26px 20px 22px',
                  boxShadow:'0 12px 32px rgba(83,74,183,.18),0 2px 8px rgba(0,0,0,.06)',
                  border:'2px solid rgba(255,255,255,.75)',
                  position:'relative',overflow:'hidden',
                  animation:'rlp-slideUp .5s ease-out .15s both'}}>
                <div className="rlp-sunburst" />
                <div style={{position:'relative',zIndex:1}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#B45309',letterSpacing:'.5px',marginBottom:6,
                    animation:'rlp-stampIn .6s ease-out .2s both'}}>
                    YOU WON FREE
                  </div>
                  <i className="ti ti-award" aria-hidden="true"
                    style={{fontSize:28,color:'#534AB7',display:'block',marginBottom:6,
                      animation:'rlp-wiggle 2.2s ease-in-out infinite'}} />
                  <div style={{fontSize:44,fontWeight:800,letterSpacing:'-1px',lineHeight:1,
                    background:'linear-gradient(90deg,#D4537E,#7F77DD,#378ADD)',
                    WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent',
                    animation:'rlp-stampIn .6s ease-out .3s both'}}>
                    FREE
                  </div>
                  <div style={{display:'inline-block',margin:'8px 0 12px',background:'#5DCAA5',
                    color:'#04342C',fontSize:10.5,fontWeight:700,letterSpacing:'.7px',
                    padding:'4px 16px',borderRadius:20,
                    animation:'rlp-glowPulse 2s ease-in-out infinite'}}>
                    EXCLUSIVE MEMBERSHIP
                  </div>
                  <div style={{fontSize:18,fontWeight:600,color:'#1E1950',lineHeight:1.3}}>
                    Rainbow Loyalty<br />
                    <span style={{background:'linear-gradient(90deg,#D4537E,#7F77DD)',
                      WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent'}}>
                      Programme
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Benefits grid ──────────────────────────── */}
              <div style={{marginTop:18,animation:'rlp-slideUp .5s ease-out .3s both'}}>
                <div style={{fontSize:11,fontWeight:600,color:'#6B6A8A',letterSpacing:'.5px',
                  marginBottom:12,textTransform:'uppercase'}}>Member Benefits</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                  {BENEFITS.slice(0,4).map(({icon,bg,accent,fg,label},i) => (
                    <div key={i} className="rlp-benefit"
                      style={{background:bg,borderRadius:14,padding:'14px 10px',
                        display:'flex',flexDirection:'column',alignItems:'center',gap:8,
                        boxShadow:'0 2px 10px rgba(0,0,0,.06)',
                        animation:`rlp-popIn .4s ease-out ${.45+i*.07}s both`}}>
                      <div style={{width:38,height:38,borderRadius:12,
                        background:`linear-gradient(135deg,${accent}22,${accent}44)`,
                        display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                        border:`1.5px solid ${accent}33`}}>
                        <i className={`ti ${icon}`} aria-hidden="true"
                          style={{fontSize:18,color:accent}} />
                      </div>
                      <div style={{fontSize:11.5,fontWeight:600,color:fg,lineHeight:1.25,textAlign:'center'}}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
                {/* 5th benefit full-width */}
                <div className="rlp-benefit"
                  style={{background:BENEFITS[4].bg,borderRadius:14,padding:'12px 16px',
                    display:'flex',alignItems:'center',gap:12,
                    boxShadow:'0 2px 10px rgba(0,0,0,.06)',
                    animation:'rlp-popIn .4s ease-out .73s both'}}>
                  <div style={{width:38,height:38,borderRadius:12,flexShrink:0,
                    background:`linear-gradient(135deg,${BENEFITS[4].accent}22,${BENEFITS[4].accent}44)`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    border:`1.5px solid ${BENEFITS[4].accent}33`}}>
                    <i className={`ti ${BENEFITS[4].icon}`} aria-hidden="true"
                      style={{fontSize:18,color:BENEFITS[4].accent}} />
                  </div>
                  <div style={{fontSize:12,fontWeight:600,color:BENEFITS[4].fg,textAlign:'left'}}>
                    {BENEFITS[4].label}
                  </div>
                  <div style={{marginLeft:'auto',fontSize:10,fontWeight:600,color:BENEFITS[4].accent,
                    background:`${BENEFITS[4].accent}18`,padding:'3px 10px',borderRadius:20}}>
                    SPECIAL
                  </div>
                </div>
              </div>

              {/* ── Refer button ──────────────────────────── */}
              <div style={{marginTop:22,animation:'rlp-slideUp .5s ease-out .5s both'}}>
                <a
                  ref={referBtnRef}
                  href="https://docs.google.com/forms/d/e/1FAIpQLSe0Q636C3vAiwQyBxXHHGb3PSIlttZbHeRtVQyLWMKCPS8Z1w/viewform"
                  target="_blank" rel="noopener noreferrer"
                  onClick={handleRefer}
                  className="rlp-refer-btn rlp-shine"
                  style={{display:'inline-flex',alignItems:'center',gap:10,
                    background:'linear-gradient(90deg,#7F77DD,#D4537E)',
                    color:'#fff',textDecoration:'none',borderRadius:50,
                    padding:'14px 36px',fontSize:15,fontWeight:600,
                    boxShadow:'0 10px 24px rgba(127,119,221,.38)',
                    position:'relative',overflow:'hidden',letterSpacing:'.2px'}}
                >
                  <i className="ti ti-user-plus" aria-hidden="true" style={{fontSize:18}} />
                  Refer a Friend
                </a>
                <div style={{fontSize:12,color:'#8A89A6',marginTop:10,
                  display:'flex',alignItems:'center',justifyContent:'center',gap:5}}>
                  <i className="ti ti-school" aria-hidden="true" style={{fontSize:13}} />
                  Contact your nearest Rainbow school office
                </div>
              </div>

              {/* ── Video buttons ─────────────────────────── */}
              <div style={{marginTop:18,display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',
                animation:'rlp-slideUp .5s ease-out .62s both'}}>
                <button
                  className="rlp-vbtn"
                  data-school="preschool"
                  onClick={(e)=>openVideo('preschool',e)}
                  style={{flex:'0 1 170px',background:'linear-gradient(150deg,#FDEAF2,#FBD4E4)',
                    border:'none',borderRadius:16,padding:'16px 12px',
                    display:'flex',flexDirection:'column',alignItems:'center',gap:6}}
                >
                  <div style={{width:40,height:40,borderRadius:12,background:'rgba(209,83,126,.15)',
                    display:'flex',alignItems:'center',justifyContent:'center',marginBottom:2,
                    animation:'rlp-floaty 2.6s ease-in-out infinite'}}>
                    <i className="ti ti-school" aria-hidden="true" style={{fontSize:20,color:'#D4537E'}} />
                  </div>
                  <span style={{fontSize:12.5,fontWeight:700,color:'#993556',lineHeight:1.2}}>Rainbow Preschool</span>
                  <span style={{fontSize:11,color:'#B15C7A',display:'flex',alignItems:'center',gap:4,
                    fontWeight:500}}>
                    <i className="ti ti-player-play-filled" aria-hidden="true" style={{fontSize:11}} />
                    Watch video
                  </span>
                </button>

                <button
                  className="rlp-vbtn"
                  data-school="international"
                  onClick={(e)=>openVideo('international',e)}
                  style={{flex:'0 1 170px',background:'linear-gradient(150deg,#EEEDFE,#DCD8FB)',
                    border:'none',borderRadius:16,padding:'16px 12px',
                    display:'flex',flexDirection:'column',alignItems:'center',gap:6}}
                >
                  <div style={{width:40,height:40,borderRadius:12,background:'rgba(127,119,221,.15)',
                    display:'flex',alignItems:'center',justifyContent:'center',marginBottom:2,
                    animation:'rlp-floaty 2.6s ease-in-out infinite .3s'}}>
                    <i className="ti ti-building-community" aria-hidden="true" style={{fontSize:20,color:'#7F77DD'}} />
                  </div>
                  <span style={{fontSize:12.5,fontWeight:700,color:'#3B3593',lineHeight:1.2}}>Rainbow International</span>
                  <span style={{fontSize:11,color:'#5951B5',display:'flex',alignItems:'center',gap:4,
                    fontWeight:500}}>
                    <i className="ti ti-player-play-filled" aria-hidden="true" style={{fontSize:11}} />
                    Watch video
                  </span>
                </button>
              </div>

              {/* Welcome line */}
              <div style={{marginTop:20,fontSize:13.5,fontWeight:600,
                background:'linear-gradient(90deg,#7F77DD,#D4537E)',
                WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent',
                animation:'rlp-slideUp .5s ease-out .74s both'}}>
                Welcome to the Rainbow family
                <i className="ti ti-rainbow" aria-hidden="true"
                  style={{fontSize:15,marginLeft:5,verticalAlign:'-3px',
                    WebkitTextFillColor:'initial',color:'#7F77DD'}} />
              </div>
            </div>
          </div>
        )}

        {/* ════════════════ VIDEO MODAL ════════════════ */}
        {videoModal && (
          <div
            onClick={(e)=>{ if (e.target===e.currentTarget) setVideoModal(null); }}
            style={{position:'fixed',inset:0,background:'rgba(15,10,35,.88)',zIndex:9999,
              display:'flex',alignItems:'center',justifyContent:'center',padding:24}}
          >
            <div style={{position:'relative',width:'100%',maxWidth:660}}>
              <button
                onClick={()=>setVideoModal(null)}
                style={{position:'absolute',top:-46,right:0,background:'rgba(255,255,255,.15)',
                  border:'1px solid rgba(255,255,255,.25)',borderRadius:'50%',
                  width:36,height:36,fontSize:15,cursor:'pointer',color:'#fff',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  backdropFilter:'blur(6px)',transition:'background .2s ease'}}
                onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,.28)')}
                onMouseLeave={e=>(e.currentTarget.style.background='rgba(255,255,255,.15)')}
              >
                <i className="ti ti-x" aria-hidden="true" style={{fontSize:16}} />
              </button>
              <div style={{fontSize:13,color:'rgba(255,255,255,.7)',textAlign:'center',
                marginBottom:10,fontWeight:500}}>
                {videoModal==='preschool' ? 'Rainbow Preschool' : 'Rainbow International School'}
              </div>
              <div style={{position:'relative',width:'100%',paddingTop:'56.25%',
                borderRadius:16,overflow:'hidden',
                boxShadow:'0 16px 48px rgba(0,0,0,.6)'}}>
                <video
                  key={videoModal}
                  src={videoModal==='preschool' ? '/videos/rps-loyalty.mp4' : '/videos/ris-loyalty.mp4'}
                  controls autoPlay playsInline
                  style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:0,background:'#000'}}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
