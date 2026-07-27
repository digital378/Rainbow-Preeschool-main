import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Rainbow Loyalty Programme — Scratch-card referral experience
   Route: /referral  |  noindex (server-side + meta)
───────────────────────────────────────────────────────────────────────────── */

const COLORS = ['#7F77DD','#1D9E75','#D85A30','#D4537E','#378ADD','#EF9F27','#639922'];
const RES = 220;
const BRUSH = 11;
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
  @keyframes rlp-floaty      { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-8px) } }
  @keyframes rlp-floatySlow  { 0%,100%{ transform:translateY(0) rotate(0deg) } 50%{ transform:translateY(-10px) rotate(6deg) } }
  @keyframes rlp-twinkle     { 0%,100%{ opacity:.5;transform:scale(.85) } 50%{ opacity:1;transform:scale(1.15) } }
  @keyframes rlp-popIn       { 0%{ opacity:0;transform:scale(.6) translateY(14px) } 70%{ transform:scale(1.06) translateY(-2px) } 100%{ opacity:1;transform:scale(1) translateY(0) } }
  @keyframes rlp-slideUp     { from{ opacity:0;transform:translateY(24px) } to{ opacity:1;transform:translateY(0) } }
  @keyframes rlp-wiggle      { 0%,100%{ transform:rotate(-6deg) } 50%{ transform:rotate(6deg) } }
  @keyframes rlp-pulseRing   { 0%,100%{ box-shadow:0 0 0 6px rgba(127,119,221,.28),0 0 0 6px rgba(127,119,221,.28) } 50%{ box-shadow:0 0 0 6px rgba(127,119,221,.28),0 0 0 14px rgba(127,119,221,.08) } }
  @keyframes rlp-shimmer     { 0%{ left:-60% } 100%{ left:130% } }
  @keyframes rlp-glowPulse   { 0%,100%{ box-shadow:0 0 0 0 rgba(93,202,165,.5) } 50%{ box-shadow:0 0 0 8px rgba(93,202,165,0) } }
  @keyframes rlp-rotateSlow  { from{ transform:rotate(0deg) } to{ transform:rotate(360deg) } }
  @keyframes rlp-stampIn     { 0%{ transform:scale(0) rotate(-15deg);opacity:0 } 60%{ transform:scale(1.15) rotate(6deg);opacity:1 } 100%{ transform:scale(1) rotate(0deg);opacity:1 } }
  @keyframes rlp-teddyBetween { 0%,8%{ transform:translateX(-81px) rotate(-10deg) } 42%,58%{ transform:translateX(81px) rotate(10deg) } 92%,100%{ transform:translateX(-81px) rotate(-10deg) } }
  @keyframes rlp-playPulse   { 0%,100%{ box-shadow:0 0 0 0 rgba(255,255,255,.6) } 50%{ box-shadow:0 0 0 10px rgba(255,255,255,0) } }

  .rlp-root { width:100%; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
  .rlp-sunburst { position:absolute;top:50%;left:50%;width:240px;height:240px;margin:-120px 0 0 -120px;background:conic-gradient(from 0deg,rgba(255,215,140,.4) 0deg 12deg,transparent 12deg 30deg);border-radius:50%;animation:rlp-rotateSlow 14s linear infinite;z-index:0;pointer-events:none; }
  .rlp-shine { position:relative;overflow:hidden; }
  .rlp-shine::after { content:'';position:absolute;top:0;left:-60%;width:35%;height:100%;background:linear-gradient(120deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.55) 50%,rgba(255,255,255,0) 100%);transform:skewX(-20deg);animation:rlp-shimmer 2.6s ease-in-out infinite;pointer-events:none; }
  .rlp-form-btn { transition:transform .2s ease,box-shadow .2s ease;cursor:pointer; }
  .rlp-form-btn:hover { transform:scale(1.08) rotate(-1deg);box-shadow:0 10px 22px rgba(68,68,65,.4); }
  .rlp-form-btn:active { transform:scale(.93); }
  .rlp-vbtn { transition:transform .2s ease,box-shadow .2s ease;cursor:pointer; }
  .rlp-vbtn:hover { transform:translateY(-5px) scale(1.07); }
  .rlp-vbtn:active { transform:scale(.92) translateY(0); }
  .rlp-vbtn[data-school="preschool"]:hover { box-shadow:0 12px 22px rgba(237,147,177,.5); }
  .rlp-vbtn[data-school="international"]:hover { box-shadow:0 12px 22px rgba(175,169,236,.5); }
  .rlp-benefit { transition:transform .15s ease;cursor:default; }
  .rlp-benefit:active { transform:scale(.96); }
  .rlp-dodge { cursor:default; }
`;

export default function ReferralPage() {
  const [screen,     setScreen]     = useState<'scratch'|'reveal'>('scratch');
  const [videoModal, setVideoModal] = useState<null|'preschool'|'international'>(null);
  const [badgeDelta, setBadgeDelta] = useState({x:0,y:0});

  const scratchRef  = useRef<HTMLCanvasElement>(null);
  const fx1Ref      = useRef<HTMLCanvasElement>(null);
  const fxRef       = useRef<HTMLCanvasElement>(null);
  const screen1Ref  = useRef<HTMLDivElement>(null);
  const screen2Ref  = useRef<HTMLDivElement>(null);
  const referBtnRef = useRef<HTMLAnchorElement>(null);
  const teddyRef    = useRef<HTMLSpanElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const eng1        = useRef<Engine|null>(null);
  const eng2        = useRef<Engine|null>(null);
  const revealed    = useRef(false);
  const scratching  = useRef(false);
  const lastPos     = useRef<{x:number;y:number}|null>(null);

  /* ── Load tabler icons from CDN ─────────────────────────────────────── */
  useEffect(() => {
    const id = 'tabler-icons-css';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/dist/tabler-icons.min.css';
    document.head.appendChild(link);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  /* ── Add noindex meta tag ───────────────────────────────────────────── */
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
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
    const g = ctx.createLinearGradient(0,0,RES,RES);
    g.addColorStop(0,'#F0997B'); g.addColorStop(.25,'#FAC775');
    g.addColorStop(.5,'#97C459'); g.addColorStop(.75,'#85B7EB'); g.addColorStop(1,'#AFA9EC');
    ctx.fillStyle=g; ctx.fillRect(0,0,RES,RES);
    for (let i=0;i<220;i++) {
      ctx.strokeStyle=`rgba(255,255,255,${Math.random()*.12})`;
      ctx.beginPath(); ctx.moveTo(Math.random()*RES,Math.random()*RES);
      ctx.lineTo(Math.random()*RES,Math.random()*RES); ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle='rgba(38,33,92,0.85)'; ctx.font='600 16px sans-serif'; ctx.textAlign='center';
    ctx.fillText('SCRATCH',RES/2,RES/2-8); ctx.fillText('& WIN!',RES/2,RES/2+16);
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
    e.resize(); e.spawnFall(160); e.ensureRunning();
    return () => { e.destroy(); eng2.current=null; };
  }, [screen]);

  /* ── Scratch card event listeners ───────────────────────────────────── */
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
      if (cleared/total>THRESHOLD) { revealed.current=true; setTimeout(()=>setScreen('reveal'),350); }
    };
    const onDown = (e:MouseEvent|TouchEvent) => {
      scratching.current=true; const p=getPos(e); lastPos.current=p; dot(p.x,p.y); e.preventDefault();
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

  /* ── Resize confetti canvases on window resize ──────────────────────── */
  useEffect(() => {
    const onResize = () => { eng1.current?.resize(); eng2.current?.resize(); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Dodge interaction for decorative icons ─────────────────────────── */
  const dodgeEnter = (e: React.MouseEvent<HTMLElement>) => {
    const el=e.currentTarget;
    const dx=(Math.random()>.5?1:-1)*(18+Math.random()*26);
    const dy=(Math.random()>.5?1:-1)*(18+Math.random()*26);
    el.style.transition='transform .35s ease'; el.style.animationPlayState='paused';
    el.style.transform=`translate(${dx}px,${dy}px)`;
  };
  const dodgeLeave = (e: React.MouseEvent<HTMLElement>) => {
    const el=e.currentTarget;
    el.style.transition='transform .5s ease'; el.style.transform='';
    setTimeout(()=>{ el.style.animationPlayState='running'; }, 500);
  };

  const nudgeBadge = () => {
    const dx=(Math.random()>.5?1:-1)*(30+Math.random()*35);
    const dy=(Math.random()>.5?1:-1)*(20+Math.random()*30);
    setBadgeDelta({x:dx,y:dy});
    setTimeout(()=>setBadgeDelta({x:0,y:0}), 500);
  };
  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const b=badgeRef.current, s=screen1Ref.current;
    if (b&&s) {
      const bR=b.getBoundingClientRect(), cR=s.getBoundingClientRect();
      eng1.current?.resize();
      eng1.current?.spawnBurst(bR.left+bR.width/2-cR.left, bR.top+bR.height/2-cR.top, 40);
      eng1.current?.ensureRunning();
    }
    nudgeBadge();
  };

  const handleRefer = () => {
    const s=screen2Ref.current, b=referBtnRef.current;
    if (s&&b) eng2.current?.burstAt(s,b,30);
  };
  const handleTeddy = () => {
    const s=screen2Ref.current, t=teddyRef.current;
    if (s&&t) eng2.current?.burstAt(s,t,28);
  };
  const openVideo = (school:'preschool'|'international', e:React.MouseEvent) => {
    const s=screen2Ref.current, btn=e.currentTarget as HTMLElement;
    if (s&&btn) eng2.current?.burstAt(s,btn,30);
    setVideoModal(school);
  };

  /* ─────────────────────────────────────────────────────────────────────
     Reusable decorative icon shorthand
  ───────────────────────────────────────────────────────────────────── */
  const D = ({cls,style}:{cls:string;style:React.CSSProperties}) => (
    <i className={`ti ${cls} rlp-dodge`} onMouseEnter={dodgeEnter} onMouseLeave={dodgeLeave} style={style} aria-hidden="true" />
  );

  /* ── RENDER ─────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{STYLES}</style>

      <div className="rlp-root">

        {/* ════════════════════════════════════════════════════════════════
            SCREEN 1 — Scratch card
        ════════════════════════════════════════════════════════════════ */}
        {screen === 'scratch' && (
          <div
            ref={screen1Ref}
            style={{
              position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column',
              justifyContent:'center', padding:'7vw 6vw',
              background:'linear-gradient(160deg,#FEF7E6 0%,#FDEAF2 55%,#F1E7FE 100%)',
              textAlign:'center', overflow:'hidden',
            }}
          >
            {/* confetti canvas */}
            <canvas ref={fx1Ref} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:6}} />

            {/* floating decorations */}
            <D cls="ti-star-filled"    style={{position:'absolute',top:18, left:16,  fontSize:22, color:'#FAC775', animation:'rlp-twinkle 2.4s ease-in-out infinite'}} />
            <D cls="ti-heart-filled"   style={{position:'absolute',top:14, right:24, fontSize:18, color:'#ED93B1', animation:'rlp-floatySlow 3.4s ease-in-out infinite'}} />
            <D cls="ti-sparkles"       style={{position:'absolute',top:70, left:24,  fontSize:16, color:'#85B7EB', animation:'rlp-twinkle 2.2s ease-in-out infinite .8s'}} />
            <D cls="ti-star-filled"    style={{position:'absolute',top:130,right:18, fontSize:16, color:'#97C459', animation:'rlp-twinkle 2.6s ease-in-out infinite .2s'}} />
            <D cls="ti-confetti"       style={{position:'absolute',bottom:20,left:20,fontSize:20, color:'#D85A30', animation:'rlp-floatySlow 4s ease-in-out infinite .3s'}} />
            <D cls="ti-balloon-filled" style={{position:'absolute',bottom:34,right:16,fontSize:26,color:'#AFA9EC', animation:'rlp-floaty 3.8s ease-in-out infinite .6s'}} />

            <div style={{position:'relative',maxWidth:420,margin:'0 auto'}}>

              <div style={{fontSize:'clamp(22px,6vw,28px)',fontWeight:500,color:'#26215C',lineHeight:1.25}}>
                A surprise<br /><span style={{color:'#D4537E'}}>awaits!</span>
              </div>
              <div style={{fontSize:14,color:'#5F5E5A',marginTop:8,marginBottom:22}}>
                Scratch below to get your<br /><span style={{color:'#7F77DD',fontWeight:500}}>exclusive</span> reward
              </div>

              {/* scratch circle */}
              <div style={{position:'relative',width:'clamp(160px,45vw,220px)',height:'clamp(160px,45vw,220px)',margin:'0 auto'}}>
                <div style={{position:'absolute',inset:0,borderRadius:'50%',animation:'rlp-pulseRing 2s ease-in-out infinite'}} />
                <canvas
                  ref={scratchRef} width={RES} height={RES}
                  style={{position:'relative',width:'100%',height:'100%',borderRadius:'50%',touchAction:'none',cursor:'pointer',display:'block'}}
                />
                <i className="ti ti-hand-click" aria-hidden="true"
                  style={{position:'absolute',bottom:-6,right:-6,fontSize:26,color:'#26215C',
                    background:'#fff',borderRadius:'50%',padding:6,zIndex:4,
                    animation:'rlp-wiggle 1.6s ease-in-out infinite'}} />

                {/* rainbow badge — dodges on hover/click */}
                <div
                  ref={badgeRef}
                  onClick={handleBadgeClick}
                  onMouseEnter={nudgeBadge}
                  style={{position:'absolute',top:-14,left:-16,zIndex:4,cursor:'pointer',
                    transition:'transform .35s ease-out',
                    transform:`translate(${badgeDelta.x}px,${badgeDelta.y}px)`}}
                >
                  <div style={{position:'absolute',width:52,height:52,background:'#FDC98B',
                    borderRadius:16,transform:'rotate(18deg)',top:8,left:6,opacity:.9}} />
                  <div style={{position:'relative',width:50,height:50,borderRadius:'50%',
                    background:'linear-gradient(135deg,#7F77DD,#534AB7)',display:'flex',
                    alignItems:'center',justifyContent:'center',
                    boxShadow:'0 6px 14px rgba(83,74,183,.4)',animation:'rlp-floaty 3s ease-in-out infinite'}}>
                    <svg width="26" height="15" viewBox="0 0 40 22" aria-hidden="true">
                      <path d="M2 20 A18 18 0 0 1 38 20" fill="none" stroke="#fff"     strokeWidth="3" strokeLinecap="round" opacity=".95"/>
                      <path d="M7 20 A13 13 0 0 1 33 20" fill="none" stroke="#FAC775" strokeWidth="3" strokeLinecap="round" opacity=".95"/>
                      <path d="M12 20 A8 8 0 0 1 28 20" fill="none" stroke="#97C459" strokeWidth="3" strokeLinecap="round" opacity=".95"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div style={{fontSize:12,color:'#888780',marginTop:16}}>
                Scratch the circle — and try catching the little rainbow badge that's floating!
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            SCREEN 2 — Reveal
        ════════════════════════════════════════════════════════════════ */}
        {screen === 'reveal' && (
          <div
            ref={screen2Ref}
            style={{
              position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column',
              justifyContent:'center', padding:'8vw 6vw',
              background:'linear-gradient(160deg,#FDE2EC 0%,#E4D6FA 45%,#FFE9C4 100%)',
              textAlign:'center', overflow:'hidden',
            }}
          >
            <canvas ref={fxRef} style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:5}} />
            <div style={{position:'absolute',top:-70,left:'50%',transform:'translateX(-50%)',width:300,height:300,
              background:'radial-gradient(circle,rgba(255,255,255,.55) 0%,rgba(255,255,255,0) 70%)',pointerEvents:'none'}} />

            {/* floating decorations */}
            <D cls="ti-balloon-filled" style={{position:'absolute',top:20,  left:12,  fontSize:34,color:'#AFA9EC',animation:'rlp-floaty 3.2s ease-in-out infinite'}} />
            <D cls="ti-balloon-filled" style={{position:'absolute',top:14,  right:14, fontSize:30,color:'#ED93B1',animation:'rlp-floaty 3.6s ease-in-out infinite .5s'}} />
            <D cls="ti-star-filled"    style={{position:'absolute',top:76,  left:30,  fontSize:14,color:'#FAC775',animation:'rlp-twinkle 2.4s ease-in-out infinite'}} />
            <D cls="ti-star-filled"    style={{position:'absolute',top:60,  right:60, fontSize:14,color:'#FAC775',animation:'rlp-twinkle 2.2s ease-in-out infinite .6s'}} />
            <D cls="ti-sparkles"       style={{position:'absolute',top:110, right:24, fontSize:16,color:'#85B7EB',animation:'rlp-twinkle 2.6s ease-in-out infinite .3s'}} />

            <div style={{position:'relative',zIndex:2,maxWidth:440,margin:'0 auto'}}>
              <i className="ti ti-confetti" aria-hidden="true"
                style={{fontSize:30,color:'#712B13',display:'block',marginBottom:4,animation:'rlp-wiggle 1.8s ease-in-out infinite'}} />
              <div style={{fontSize:'clamp(22px,6vw,26px)',fontWeight:500,color:'#26215C',
                animation:'rlp-popIn .5s ease-out forwards'}}>
                Congratulations!
              </div>
              {/* ── Offer card ─────────────────────────────────────────── */}
              <div className="rlp-shine"
                style={{marginTop:16,background:'linear-gradient(145deg,#FFFFFF 0%,#FDEAF7 45%,#F1ECFE 100%)',
                  borderRadius:18,padding:'22px 16px',boxShadow:'0 10px 28px rgba(83,74,183,.2)',
                  border:'2px solid rgba(255,255,255,.7)',position:'relative',overflow:'hidden',
                  animation:'rlp-slideUp .5s ease-out .2s both'}}>
                <div className="rlp-sunburst" />
                <div style={{position:'relative',zIndex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:'#B45309',letterSpacing:'.3px',marginBottom:2,
                    animation:'rlp-stampIn .6s ease-out .3s both'}}>YOU WON!</div>
                  <i className="ti ti-gift" aria-hidden="true"
                    style={{fontSize:24,color:'#534AB7',display:'block',marginBottom:4,animation:'rlp-wiggle 2s ease-in-out infinite'}} />
                  <div style={{fontSize:34,fontWeight:700,
                    background:'linear-gradient(90deg,#D4537E,#7F77DD,#378ADD)',
                    WebkitBackgroundClip:'text',backgroundClip:'text',WebkitTextFillColor:'transparent',
                    animation:'rlp-stampIn .6s ease-out .4s both'}}>FREE</div>
                  <div style={{display:'inline-block',margin:'6px 0 10px',background:'#5DCAA5',color:'#04342C',
                    fontSize:11,fontWeight:600,letterSpacing:'.5px',padding:'4px 14px',borderRadius:20,
                    animation:'rlp-glowPulse 1.8s ease-in-out infinite'}}>EXCLUSIVE</div>
                  <div style={{fontSize:18,fontWeight:500,color:'#26215C',lineHeight:1.3}}>
                    Rainbow Loyalty<br />Programme <span style={{color:'#D4537E'}}>Membership!</span>
                  </div>
                </div>
              </div>

              {/* ── Benefits row ───────────────────────────────────────── */}
              <div style={{marginTop:16,background:'linear-gradient(160deg,#FFFDF8 0%,#FDF3FA 100%)',
                borderRadius:16,padding:'14px 8px',boxShadow:'0 4px 16px rgba(0,0,0,.06)',
                animation:'rlp-slideUp .5s ease-out .38s both'}}>
                <div style={{textAlign:'center',marginBottom:12}}>
                  <span style={{background:'#AFA9EC',color:'#26215C',fontSize:11,fontWeight:500,
                    letterSpacing:'.5px',padding:'4px 14px',borderRadius:20}}>MEMBER BENEFITS</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',gap:4}}>
                  {[
                    {n:1,bg:'#F0997B',fg:'#4A1B0C',label:'Earn loyalty points'},
                    {n:2,bg:'#97C459',fg:'#1B3609',label:'Gift vouchers'},
                    {n:3,bg:'#AFA9EC',fg:'#26215C',label:'Assured goodies'},
                    {n:4,bg:'#85B7EB',fg:'#0C2B4A',label:'Surprise gift on 500 points'},
                  ].map(({n,bg,fg,label},i) => (
                    <div key={n} className="rlp-benefit"
                      style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',
                        flex:1,gap:5,animation:`rlp-popIn .4s ease-out ${1+i*.06}s both`}}>
                      <div style={{width:28,height:28,borderRadius:'50%',background:bg,color:fg,
                        fontSize:13,fontWeight:600,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        {n}
                      </div>
                      <div style={{fontSize:10,fontWeight:500,color:'#26215C',lineHeight:1.15}}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Actions — shown directly (no JOIN NOW gate) ─────────── */}
              <div style={{marginTop:18,animation:'rlp-slideUp .5s ease-out .56s both'}}>
                <div style={{fontSize:12,color:'#5F5E5A',marginBottom:14}}>
                  Contact your nearest Rainbow school office
                </div>

                {/* Refer button */}
                <a
                  ref={referBtnRef}
                  href="https://docs.google.com/forms/d/e/1FAIpQLSe0Q636C3vAiwQyBxXHHGb3PSIlttZbHeRtVQyLWMKCPS8Z1w/viewform"
                  target="_blank" rel="noopener noreferrer"
                  onClick={handleRefer}
                  className="rlp-form-btn rlp-shine"
                  style={{display:'inline-block',
                    background:'linear-gradient(90deg,#7F77DD,#D4537E)',
                    color:'#fff',textDecoration:'none',borderRadius:24,
                    padding:'12px 30px',fontSize:14,fontWeight:600,
                    boxShadow:'0 8px 20px rgba(127,119,221,.35)',
                    position:'relative',overflow:'hidden'}}
                >
                  🎁 Refer a Friend
                </a>

                <div style={{marginTop:14,fontSize:13,fontWeight:600,color:'#26215C',
                  background:'rgba(255,255,255,.6)',padding:'6px 16px',borderRadius:20,
                  animation:'rlp-floaty 2.2s ease-in-out infinite'}}>
                  🤔 Got more questions? <span style={{color:'#D4537E'}}>Take a sneak peek</span> 👀
                </div>

                {/* Video thumbnail cards — teddy lives here, orbits between play circles */}
                <div style={{position:'relative',display:'flex',gap:14,flexWrap:'wrap',
                  justifyContent:'center',marginTop:8,paddingTop:28}}>

                  {/* Teddy — absolute, oscillates between the two play-circle centres */}
                  <span
                    ref={teddyRef}
                    onClick={handleTeddy}
                    title="Click me!"
                    style={{position:'absolute',top:-4,left:'50%',marginLeft:'-18px',
                      fontSize:36,cursor:'pointer',zIndex:10,
                      animation:'rlp-teddyBetween 4s ease-in-out infinite',
                      filter:'drop-shadow(0 3px 8px rgba(0,0,0,.22))',
                      userSelect:'none',transition:'filter .15s ease'}}
                    onMouseEnter={e=>(e.currentTarget.style.filter='drop-shadow(0 3px 8px rgba(0,0,0,.22)) brightness(1.15)')}
                    onMouseLeave={e=>(e.currentTarget.style.filter='drop-shadow(0 3px 8px rgba(0,0,0,.22))')}
                  >🧸</span>

                  {/* Preschool video card */}
                  <button
                    className="rlp-vbtn"
                    data-school="preschool"
                    onClick={(e)=>openVideo('preschool',e)}
                    style={{flex:'0 1 148px',border:'none',borderRadius:16,padding:0,
                      overflow:'hidden',cursor:'pointer',background:'transparent',
                      boxShadow:'0 6px 20px rgba(209,83,126,.28)'}}
                  >
                    <div style={{position:'relative',background:'linear-gradient(135deg,#FDEAF2,#F8A8C5,#F07099)',
                      height:88,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <i className="ti ti-school" aria-hidden="true"
                        style={{position:'absolute',fontSize:50,color:'rgba(153,53,86,.18)'}} />
                      <div style={{width:50,height:50,borderRadius:'50%',
                        background:'rgba(255,255,255,.96)',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        boxShadow:'0 4px 18px rgba(0,0,0,.25)',zIndex:1,
                        animation:'rlp-playPulse 2s ease-in-out infinite'}}>
                        <i className="ti ti-player-play-filled" aria-hidden="true" style={{fontSize:22,color:'#D4537E'}} />
                      </div>
                      <div style={{position:'absolute',top:7,right:8,background:'rgba(212,83,126,.88)',
                        color:'#fff',fontSize:8,fontWeight:700,letterSpacing:'.6px',
                        padding:'2px 7px',borderRadius:10}}>VIDEO</div>
                    </div>
                    <div style={{background:'#fff',padding:'8px 10px',textAlign:'center',
                      borderTop:'1px solid rgba(212,83,126,.12)'}}>
                      <div style={{fontSize:11.5,fontWeight:700,color:'#993556'}}>Rainbow Preschool</div>
                      <div style={{fontSize:10,color:'#B15C7A',marginTop:2,
                        display:'flex',alignItems:'center',justifyContent:'center',gap:3}}>
                        <i className="ti ti-player-play-filled" aria-hidden="true" style={{fontSize:9}} />
                        Tap to watch
                      </div>
                    </div>
                  </button>

                  {/* International video card */}
                  <button
                    className="rlp-vbtn"
                    data-school="international"
                    onClick={(e)=>openVideo('international',e)}
                    style={{flex:'0 1 148px',border:'none',borderRadius:16,padding:0,
                      overflow:'hidden',cursor:'pointer',background:'transparent',
                      boxShadow:'0 6px 20px rgba(127,119,221,.28)'}}
                  >
                    <div style={{position:'relative',background:'linear-gradient(135deg,#EEEDFE,#C8C4F5,#9F98EC)',
                      height:88,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <i className="ti ti-building-community" aria-hidden="true"
                        style={{position:'absolute',fontSize:50,color:'rgba(59,53,147,.18)'}} />
                      <div style={{width:50,height:50,borderRadius:'50%',
                        background:'rgba(255,255,255,.96)',
                        display:'flex',alignItems:'center',justifyContent:'center',
                        boxShadow:'0 4px 18px rgba(0,0,0,.25)',zIndex:1,
                        animation:'rlp-playPulse 2s ease-in-out infinite .4s'}}>
                        <i className="ti ti-player-play-filled" aria-hidden="true" style={{fontSize:22,color:'#7F77DD'}} />
                      </div>
                      <div style={{position:'absolute',top:7,right:8,background:'rgba(127,119,221,.88)',
                        color:'#fff',fontSize:8,fontWeight:700,letterSpacing:'.6px',
                        padding:'2px 7px',borderRadius:10}}>VIDEO</div>
                    </div>
                    <div style={{background:'#fff',padding:'8px 10px',textAlign:'center',
                      borderTop:'1px solid rgba(127,119,221,.12)'}}>
                      <div style={{fontSize:11.5,fontWeight:700,color:'#3B3593'}}>Rainbow International</div>
                      <div style={{fontSize:10,color:'#5951B5',marginTop:2,
                        display:'flex',alignItems:'center',justifyContent:'center',gap:3}}>
                        <i className="ti ti-player-play-filled" aria-hidden="true" style={{fontSize:9}} />
                        Tap to watch
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Welcome line */}
              <div style={{marginTop:14,fontSize:14,fontWeight:500,color:'#534AB7',
                animation:'rlp-slideUp .5s ease-out .74s both'}}>
                Welcome to the Rainbow family!{' '}
                <i className="ti ti-rainbow" aria-hidden="true" style={{fontSize:16,verticalAlign:'-3px'}} />
              </div>
            </div>
          </div>
        )}


        {/* ════════════════════════════════════════════════════════════════
            VIDEO MODAL
        ════════════════════════════════════════════════════════════════ */}
        {videoModal && (
          <div
            onClick={(e)=>{ if (e.target===e.currentTarget) setVideoModal(null); }}
            style={{position:'fixed',inset:0,background:'rgba(20,15,40,.85)',zIndex:9999,
              display:'flex',alignItems:'center',justifyContent:'center',padding:24}}
          >
            <div style={{position:'relative',width:'100%',maxWidth:640}}>
              <button
                onClick={()=>setVideoModal(null)}
                style={{position:'absolute',top:-42,right:0,background:'#fff',border:'none',
                  borderRadius:'50%',width:34,height:34,fontSize:16,cursor:'pointer',
                  boxShadow:'0 4px 10px rgba(0,0,0,.3)'}}
              >✕</button>
              <div style={{position:'relative',width:'100%',paddingTop:'56.25%',
                borderRadius:14,overflow:'hidden',
                boxShadow:'0 12px 40px rgba(0,0,0,.5)',background:'#000'}}>
                <video
                  key={videoModal}
                  src={videoModal==='preschool' ? '/videos/rps-loyalty.mp4' : '/videos/ris-loyalty.mp4'}
                  controls autoPlay playsInline
                  style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:0}}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
