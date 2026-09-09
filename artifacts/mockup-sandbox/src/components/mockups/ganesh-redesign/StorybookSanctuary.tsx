import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, BookOpen, Check, ChevronDown, CircleHelp, Copy, Feather, Heart, Leaf, Menu, Pause, Play, Sparkles, Star, Sun, Volume2, X } from "lucide-react";

export function StorybookSanctuary() {
  const [language, setLanguage] = useState<"English" | "मराठी" | "हिन्दी">("English");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [wishName, setWishName] = useState("");
  const [wishMade, setWishMade] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const facts = [
    ["Big ears", "Bappa reminds us to listen with patience."],
    ["Tiny mouse", "Mushak shows that even the smallest helper matters."],
    ["Sweet modak", "A little treat shared with love tastes sweetest."],
    ["Clay friend", "An eco-friendly clay idol can return gently to water."],
  ];
  const faqs = [
    ["How do I explain Ganesh Chaturthi to a 2-year-old?", "Keep it simple and sensory: “We're welcoming a special clay friend named Bappa who loves modaks and big hugs.” Focus on feelings and fun rather than mythology or history."],
    ["What can a toddler do during the puja?", "Toddlers can help place flowers, gently ring a small bell, clap during the aarti, or simply sit close and watch — participation, not perfection, is what matters."],
    ["Is it safe to do idol immersion with young children present?", "Yes, especially with a small eco-friendly clay idol immersed gently at home in a bucket or tub. It is calm, safe, and meaningful."],
    ["My child is scared of loud dhol-tasha sounds — what can I do?", "Introduce the sound gradually, keep a comforting distance at community celebrations, and let your child cover their ears if they need to. There is no rush."],
  ];
  const storyText = "Once upon a time, Parvati made a little boy out of soft clay to guard her door. He stood proudly at his mother's side. When Shiva arrived, the little boy protected his promise. Shiva felt sorry, and lovingly gave him the face of a baby elephant. The gods blessed him with wisdom and kindness, and everyone called him Ganesha.";
  const progress = useMemo(() => Math.min(100, Math.max(6, revealed.length * 18 + (wishMade ? 25 : 0))), [revealed, wishMade]);

  const copySpeech = async () => {
    await navigator.clipboard?.writeText("Ganpati Bappa Morya! I love Bappa because he teaches us to be kind and brave. Happy Ganesh Chaturthi!");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="sanctuary">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Noto+Sans+Devanagari:wght@400;600&display=swap');
        :root { --ink:#352b2a; --terracotta:#bd4d38; --marigold:#e6a83c; --rose:#f3d8cd; --cream:#fff9ee; --sage:#687966; --wine:#6b3034; }
        * { box-sizing:border-box; }
        .sanctuary { min-height:100dvh; background:var(--cream); color:var(--ink); font-family:"DM Sans",sans-serif; overflow-x:hidden; }
        .sanctuary:before { content:""; position:fixed; inset:0; pointer-events:none; opacity:.13; z-index:3; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.23'/%3E%3C/svg%3E"); mix-blend-mode:multiply; }
        .wrap { width:min(1160px,calc(100% - 40px)); margin:auto; }
        .eyebrow { color:var(--terracotta); text-transform:uppercase; letter-spacing:.16em; font-size:11px; font-weight:700; }
        .serif { font-family:"Fraunces",serif; }
        .topline { background:var(--wine); color:#ffe9ce; font-size:12px; padding:9px 0; text-align:center; letter-spacing:.04em; }
        .nav { height:76px; display:flex; align-items:center; justify-content:space-between; position:relative; z-index:5; }
        .brand { display:flex; align-items:center; gap:11px; color:var(--wine); font-weight:700; letter-spacing:-.02em; }
        .brand-mark { width:38px; height:38px; border-radius:50% 50% 45% 45%; background:var(--terracotta); display:grid; place-items:center; color:#ffe9ce; transform:rotate(-7deg); }
        .navlinks { display:flex; gap:27px; align-items:center; font-size:13px; color:#6d5b50; }
        .navlinks a { color:inherit; text-decoration:none; }
        .navlinks a:hover { color:var(--terracotta); }
        .menu { display:none; border:0; background:none; color:var(--wine); }
        .hero { position:relative; min-height:660px; background:radial-gradient(circle at 80% 18%,#f9dd9b 0 8%,transparent 9%), linear-gradient(110deg,#f7e3c2 0 54%,#eec5aa 54%); overflow:hidden; }
        .hero:after { content:""; position:absolute; inset:auto -5% -125px -5%; height:220px; background:var(--cream); border-radius:50% 50% 0 0 / 35% 35% 0 0; }
        .hero-copy { position:relative; z-index:2; padding-top:83px; max-width:615px; }
        h1 { font:600 clamp(46px,7vw,86px)/.98 "Fraunces",serif; letter-spacing:-.065em; color:var(--wine); margin:18px 0 22px; }
        .hero-copy p { max-width:500px; color:#71554b; font-size:17px; line-height:1.65; }
        .hero-actions { display:flex; gap:12px; margin-top:31px; align-items:center; }
        .button { border:0; border-radius:999px; background:var(--terracotta); color:#fff9ee; padding:13px 19px; font-weight:700; cursor:pointer; display:inline-flex; gap:8px; align-items:center; transition:transform .2s,background .2s; }
        .button:hover { transform:translateY(-2px); background:var(--wine); }
        .button.ghost { background:transparent; color:var(--wine); border:1px solid #c99a81; }
        .hero-art { position:absolute; z-index:1; right:4%; top:65px; width:min(440px,45vw); aspect-ratio:1; border-radius:47% 53% 50% 45%; background:#f5cc82; border:1px solid #d9a96d; box-shadow:22px 24px 0 #d67c5f; transform:rotate(4deg); display:grid; place-items:center; }
        .bappa { width:66%; aspect-ratio:.84; background:var(--terracotta); border-radius:48% 48% 43% 43%; position:relative; transform:rotate(-4deg); box-shadow:inset -19px -15px 0 rgba(117,39,35,.16); }
        .bappa:before,.bappa:after { content:""; position:absolute; width:88px; height:155px; top:88px; background:var(--terracotta); border-radius:50% 50% 20% 70%; z-index:-1; }
        .bappa:before { left:-63px; transform:rotate(28deg); } .bappa:after { right:-63px; transform:scaleX(-1) rotate(28deg); }
        .eye { position:absolute; top:126px; width:13px; height:19px; background:#402b29; border-radius:50%; } .eye.left { left:55px; } .eye.right { right:55px; }
        .trunk { position:absolute; top:125px; left:50%; width:51px; height:125px; background:#c45b40; border-radius:40% 50% 55% 55%; transform:translateX(-50%) rotate(2deg); }
        .trunk:after { content:""; position:absolute; width:26px; height:26px; border-left:3px solid #853b35; border-bottom:3px solid #853b35; border-radius:50%; bottom:10px; left:15px; }
        .tilak { position:absolute; top:82px; left:50%; width:18px; height:31px; border-radius:50%; background:#f4c75e; transform:translateX(-50%); }
        .sun-doodle { position:absolute; right:13%; top:35px; color:#ce7b4c; }
        .leaf-doodle { position:absolute; left:7%; bottom:150px; color:var(--sage); transform:rotate(-20deg); }
        .progress { position:fixed; top:0; left:0; height:4px; background:var(--marigold); z-index:12; transition:width .3s; }
        .chapter-bar { position:sticky; top:0; z-index:8; background:rgba(255,249,238,.93); backdrop-filter:blur(12px); border-bottom:1px solid #ecd8bd; }
        .chapter-inner { min-height:69px; display:flex; align-items:center; gap:26px; overflow:auto; }
        .chapter-inner a { flex:none; color:#805d4e; text-decoration:none; font-size:12px; letter-spacing:.03em; }
        .chapter-inner a:first-child { color:var(--terracotta); font-weight:700; }
        .section { padding:105px 0; border-bottom:1px solid #ead8c0; }
        .section.tinted { background:#f5e5d0; }
        .section-head { display:flex; justify-content:space-between; gap:30px; align-items:end; margin-bottom:35px; }
        h2 { font:600 clamp(34px,5vw,58px)/1.04 "Fraunces",serif; letter-spacing:-.05em; color:var(--wine); max-width:650px; margin:10px 0 0; }
        h3 { font:600 24px/1.15 "Fraunces",serif; color:var(--wine); margin:0 0 12px; }
        .lead { max-width:620px; font-size:18px; line-height:1.7; color:#70594f; }
        .timeline { display:grid; grid-template-columns:1fr 1fr 1fr; gap:0; margin-top:45px; border-top:1px solid #cfad91; }
        .timeline div { padding:22px 20px 5px 0; border-right:1px solid #cfad91; min-height:150px; } .timeline div:not(:first-child){padding-left:20px}.timeline div:last-child{border:0}
        .timeline strong { display:block; color:var(--terracotta); font-size:12px; letter-spacing:.1em; text-transform:uppercase; margin-bottom:12px; }
        .story { display:grid; grid-template-columns:.8fr 1.2fr; gap:70px; align-items:center; }
        .story-art { background:var(--sage); min-height:390px; border-radius:47% 53% 43% 57%; position:relative; overflow:hidden; padding:35px; color:#f9e3bf; }
        .story-art:before { content:"“"; position:absolute; font:200px/1 "Fraunces",serif; top:10px; left:28px; opacity:.25; }
        .story-art .caption { position:absolute; bottom:30px; left:35px; max-width:210px; font:600 27px/1.1 "Fraunces",serif; }
        .story-copy p { line-height:1.8; color:#6d564b; font-size:16px; }
        .read-aloud { display:flex; align-items:center; gap:10px; background:#f7e7c7; border:1px solid #dfbe94; color:var(--wine); border-radius:12px; padding:13px 16px; font-size:13px; margin-top:24px; }
        .facts { display:grid; grid-template-columns:repeat(4,1fr); gap:13px; }
        .fact { min-height:190px; padding:22px; background:#fff8ed; border:1px solid #e4c6a9; border-radius:18px; transition:transform .25s; cursor:pointer; }
        .fact:hover { transform:translateY(-6px) rotate(-1deg); } .fact .number { color:var(--terracotta); font:700 28px "Fraunces",serif; }
        .fact p { color:#70594f; font-size:14px; line-height:1.5; }
        .reveal { border:0; background:none; color:var(--terracotta); font-size:12px; font-weight:700; cursor:pointer; padding:0; }
        .activity-grid { display:grid; grid-template-columns:1.1fr .9fr; gap:20px; }
        .activity { background:var(--wine); color:#ffe8c5; padding:31px; min-height:260px; border-radius:24px 8px 24px 8px; } .activity.alt{background:#e2b75b;color:#53312e}.activity p{line-height:1.6;font-size:14px;max-width:410px}
        .activity small { display:block; margin-top:30px; text-transform:uppercase; letter-spacing:.12em; font-weight:700; opacity:.75; }
        .tool { display:grid; grid-template-columns:1fr 1fr; gap:36px; align-items:center; }
        .speech { background:#fff8ed; border-left:4px solid var(--terracotta); padding:25px; line-height:1.8; color:#6b554a; position:relative; }
        .speech button { position:absolute; top:17px; right:17px; border:0; background:#f2dfc4; border-radius:50%; width:34px; height:34px; color:var(--terracotta); cursor:pointer; display:grid; place-items:center; }
        .wish { background:var(--terracotta); min-height:310px; border-radius:50% 20% 50% 20%; padding:40px; color:#ffe9c7; display:flex; flex-direction:column; justify-content:center; position:relative; overflow:hidden; }
        .wish:after { content:"ॐ"; position:absolute; right:32px; top:16px; font:95px "Noto Sans Devanagari"; opacity:.15; }
        .wish input { border:0; background:rgba(255,255,255,.15); border-bottom:1px solid #f9dbad; padding:12px 0; color:#fff8ed; outline:0; margin:15px 0; font:600 20px "Fraunces",serif; }
        .wish input::placeholder { color:#f8d8af; }
        .lang { display:flex; gap:8px; margin:20px 0; flex-wrap:wrap; }
        .lang button { border:1px solid #d8b499; border-radius:999px; background:transparent; color:var(--wine); padding:9px 14px; cursor:pointer; font-size:12px; } .lang button.active{background:var(--wine);color:#fff3df}
        .faq-list { max-width:760px; } .faq { border-top:1px solid #d8baa0; } .faq button { width:100%; padding:20px 0; border:0; background:none; display:flex; justify-content:space-between; text-align:left; color:var(--wine); font:600 19px "Fraunces",serif; cursor:pointer; } .faq p{margin:0 0 20px;color:#6d584c;line-height:1.7;max-width:650px}
        footer { background:var(--wine); color:#f4d7b6; padding:70px 0; } footer h2{color:#ffe5bb;font-size:40px} footer p{max-width:440px;line-height:1.7}.footer-row{display:flex;justify-content:space-between;gap:30px;align-items:end}
        @media(max-width:760px){.wrap{width:min(100% - 28px,560px)}.navlinks{display:none}.menu{display:block}.hero{min-height:760px}.hero-copy{padding-top:45px}.hero-art{width:83vw;right:-11%;top:405px}.hero:after{bottom:-80px}.chapter-inner{gap:20px}.section{padding:72px 0}.section-head{display:block}.timeline,.story,.tool,.activity-grid{grid-template-columns:1fr}.timeline div{border-right:0;border-bottom:1px solid #cfad91;padding:20px 0!important}.story-art{min-height:250px}.facts{grid-template-columns:1fr 1fr}.footer-row{display:block}}
        @media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;transition:none!important}}
      `}</style>
      <div className="progress" style={{ width: `${progress}%` }} />
      <div className="topline">A little festival book from Rainbow International Pre-School, Thane · 2026</div>
      <header className="wrap nav">
        <div className="brand"><span className="brand-mark"><Sparkles size={18}/></span><span>Rainbow<br/><small>International Pre-School</small></span></div>
        <nav className="navlinks" aria-label="Primary navigation"><a href="#story">The story</a><a href="#play">Play together</a><a href="#parents">For parents</a><button className="button" onClick={() => document.getElementById("wish")?.scrollIntoView({ behavior:"smooth" })}>Make a wish <ArrowRight size={15}/></button></nav>
        <button className="menu" aria-label="Open navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      </header>
      {menuOpen && <div className="wrap" style={{paddingBottom:16,display:"flex",gap:18}}><a href="#story">The story</a><a href="#play">Play together</a><a href="#parents">For parents</a></div>}
      <main>
        <section className="hero"><div className="wrap hero-copy"><div className="eyebrow">A gentle guide for little explorers</div><h1>Ganesh Chaturthi 2026 for kids.</h1><p>Stories, songs, tiny speeches and hands-on wonder for celebrating with your toddler or preschooler — from Rainbow Preschools, Thane.</p><div className="hero-actions"><a className="button" href="#story">Open the story <BookOpen size={16}/></a><a className="button ghost" href="#chapters">See the chapters <ArrowDown size={15}/></a></div><div style={{marginTop:32,color:"#815e50",fontSize:13}}>14–25 September 2026 <span style={{margin:"0 10px"}}>·</span> Ten special days, one warm welcome</div></div><Sun className="sun-doodle" size={44}/><Leaf className="leaf-doodle" size={52}/><div className="hero-art" aria-label="Illustrated Ganpati Bappa"><div className="bappa"><i className="eye left"/><i className="eye right"/><i className="tilak"/><i className="trunk"/></div></div></section>
        <nav id="chapters" className="chapter-bar" aria-label="Chapters"><div className="wrap chapter-inner"><a href="#welcome">01 Welcome</a><a href="#story">02 Bedtime story</a><a href="#facts">03 Little facts</a><a href="#play">04 Play together</a><a href="#parents">05 Parent notes</a><a href="#wish">06 Make a wish</a></div></nav>
        <section id="welcome" className="section"><div className="wrap"><div className="section-head"><div><div className="eyebrow">Chapter one · begin softly</div><h2>Let's make it magical.</h2></div><Heart color="#bd4d38" size={29}/></div><p className="lead">Ganesh Chaturthi is the ten-day festival when we welcome home a special friend — Ganpati Bappa, the elephant-headed friend who loves modaks, listens with his big ears, and helps us feel brave when things feel hard.</p><div className="timeline"><div><strong>14 September</strong><span>Bappa arrives home with flowers, songs and his very first modak.</span></div><div><strong>15–24 September</strong><span>Families sing together, light a lamp and share a sweet hello each evening.</span></div><div><strong>25 September · Visarjan</strong><span>A loving goodbye, a wave and a promise that Bappa will return next year.</span></div></div></div></section>
        <section id="story" className="section tinted"><div className="wrap story"><div className="story-art"><Feather size={31}/><div className="caption">Read this aloud together. Perfect for bedtime.</div></div><div className="story-copy"><div className="eyebrow">Chapter two · a story for little ones</div><h2>How Ganpati Bappa was born.</h2><p>{storyText}</p><div className="read-aloud"><Volume2 size={17}/><span>Keep it short, warm and unhurried. Follow your child's questions.</span></div></div></div></section>
        <section id="facts" className="section"><div className="wrap"><div className="section-head"><div><div className="eyebrow">Chapter three · tap to discover</div><h2>Little things Bappa teaches us.</h2></div><Star color="#e6a83c" size={30}/></div><div className="facts">{facts.map(([title,body],i)=><article className="fact" key={title} onClick={()=>setRevealed(revealed.includes(i)?revealed.filter(n=>n!==i):[...revealed,i])}><div className="number">0{i+1}</div><h3>{title}</h3>{revealed.includes(i)?<p>{body}</p>:<button className="reveal">{i===0?"Turn the page":"Discover this thought"} <ArrowRight size={12}/></button>}</article>)}</div></div></section>
        <section id="play" className="section tinted"><div className="wrap"><div className="eyebrow">Chapter four · little hands, big wonder</div><h2>Play, make, notice.</h2><p className="lead">Try one tiny activity at a time. There is no perfect craft — only a shared moment.</p><div className="activity-grid"><article className="activity"><Leaf size={27}/><h3 style={{color:"#ffe8c5",marginTop:22}}>Clay Bappa, gentle goodbye</h3><p>Shape a small clay friend together. Talk about how natural clay can return safely to water. Let your child press flowers or grains into the soft surface.</p><small>Age 3+ · 20 minutes</small></article><article className="activity alt"><Sparkles size={27}/><h3 style={{color:"#53312e",marginTop:22}}>Big ears listening game</h3><p>Take turns making a quiet sound — a bell, a clap, a whisper. Can your little explorer listen and guess? Bappa's big ears remind us to listen with patience.</p><small>Age 2+ · 5 minutes</small></article></div></div></section>
        <section id="parents" className="section"><div className="wrap"><div className="tool"><div><div className="eyebrow">Chapter five · words to carry</div><h2>For little speakers.</h2><div className="lang" role="tablist">{(["English","मराठी","हिन्दी"] as const).map(lang=><button className={language===lang?"active":""} onClick={()=>setLanguage(lang)} key={lang}>{lang}</button>)}</div><div className="speech"><button aria-label="Copy speech" onClick={copySpeech}>{copied?<Check size={16}/>:<Copy size={16}/>}</button>{language==="English"&&"Ganpati Bappa Morya! I love Bappa because he teaches us to be kind and brave. Happy Ganesh Chaturthi!"}{language==="मराठी"&&"गणपती बाप्पा मोरया! बाप्पा आपल्याला दयाळू आणि धाडसी व्हायला शिकवतो. गणेश चतुर्थीच्या हार्दिक शुभेच्छा!"}{language==="हिन्दी"&&"गणपति बप्पा मोरया! बप्पा हमें दयालु और बहादुर बनना सिखाते हैं। गणेश चतुर्थी की शुभकामनाएँ!"}</div><p style={{fontSize:12,color:"#876e60",marginTop:13}}>{copied?"Copied to your clipboard.":"Choose a language, then copy a little line for show-and-tell."}</p></div><div><div className="eyebrow">A parent's quiet checklist</div><h3 style={{fontSize:30}}>Comfort before perfection.</h3><p className="lead" style={{fontSize:16}}>A child can place flowers, gently ring a bell, clap during aarti, or simply sit close and watch. Participation, not perfection, matters at this age.</p><p style={{color:"#6d584c",lineHeight:1.7,fontSize:14}}><Leaf size={15} style={{verticalAlign:"middle",marginRight:8}}/>Choose a small eco-friendly clay idol and a calm home immersion in a bucket or tub.</p></div></div></div></section>
        <section id="wish" className="section tinted"><div className="wrap"><div className="section-head"><div><div className="eyebrow">Chapter six · make something to keep</div><h2>A wish card for Bappa.</h2></div><Sparkles color="#bd4d38" size={30}/></div><div className="wish"><div className="eyebrow" style={{color:"#f9d49e"}}>Dear Ganpati Bappa</div><h3 style={{color:"#fff3dc",fontSize:34,marginTop:12}}>{wishMade ? `A wish from ${wishName || "our little explorer"}` : "Write a little name below."}</h3>{!wishMade&&<input value={wishName} onChange={e=>setWishName(e.target.value)} placeholder="Your child's name" aria-label="Child's name"/>}{wishMade&&<p style={{maxWidth:440,lineHeight:1.7}}>May your days be full of kind hands, curious questions and the courage to try again.</p>}<button className="button" style={{alignSelf:"start",background:"#f5d494",color:"#653334"}} onClick={()=>setWishMade(!wishMade)}>{wishMade?"Make another card":"Create our wish card"} <ArrowRight size={15}/></button></div></div></section>
        <section className="section"><div className="wrap"><div className="eyebrow">A gentle corner for grown-ups</div><h2>Parents ask. We answer.</h2><div className="faq-list" style={{marginTop:30}}>{faqs.map(([q,a],i)=><div className="faq" key={q}><button onClick={()=>setOpenFaq(openFaq===i?null:i)} aria-expanded={openFaq===i}><span>{q}</span>{openFaq===i?<ChevronDown size={18}/>:<ArrowRight size={18}/>}</button>{openFaq===i&&<p>{a}</p>}</div>)}</div></div></section>
      </main>
      <footer><div className="wrap footer-row"><div><div className="brand" style={{color:"#ffe7c5"}}><span className="brand-mark" style={{background:"#e6a83c",color:"#6b3034"}}><Sparkles size={18}/></span><span>Rainbow<br/><small>International Pre-School</small></span></div><h2 style={{marginTop:40}}>Grow, learn,<br/>celebrate together.</h2></div><div><p>For our tiniest learners, this is a season of colours, music, sweet treats and cuddly stories that plant the first seeds of culture, curiosity and joy.</p><a className="button" href="#welcome" style={{background:"#f5d494",color:"#653334"}}>Back to the beginning <ArrowDown size={15} style={{transform:"rotate(180deg)"}}/></a></div></div></footer>
    </div>
  );
}