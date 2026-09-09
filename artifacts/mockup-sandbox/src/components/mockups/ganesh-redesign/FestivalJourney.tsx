import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Copy,
  Download,
  Feather,
  Flower2,
  Gift,
  Headphones,
  Heart,
  Home,
  Languages,
  Leaf,
  MapPin,
  Menu,
  Music2,
  Palette,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import "./festival-journey.css";

type Chapter = { id: string; index: string; title: string; detail: string; color: string };

const chapters: Chapter[] = [
  { id: "welcome", index: "01", title: "Welcome Bappa", detail: "Start with wonder", color: "saffron" },
  { id: "story", index: "02", title: "A story to keep", detail: "Read aloud together", color: "indigo" },
  { id: "make", index: "03", title: "Make & move", detail: "Small hands, happy hearts", color: "turmeric" },
  { id: "speak", index: "04", title: "Find your words", detail: "Speeches and rhymes", color: "coral" },
  { id: "play", index: "05", title: "Play and discover", detail: "Quiz, facts, symbols", color: "leaf" },
  { id: "care", index: "06", title: "Celebrate gently", detail: "Safety and goodbyes", color: "plum" },
];

const facts = [
  ["Big ears", "Listen carefully to every little voice."],
  ["Round tummy", "A reminder to receive life with joy."],
  ["Little mouse", "Even the smallest helper has a place."],
  ["Modak", "A sweet reward for patience and kindness."],
];

const quiz = [
  { question: "What do families welcome into their homes?", answer: "A clay friend named Ganpati Bappa." },
  { question: "Which small animal travels with Ganesha?", answer: "Mushak, the little mouse." },
  { question: "What is a gentle choice for immersion?", answer: "A small eco-friendly clay idol immersed at home." },
];

const faqs = [
  ["How do I explain Ganesh Chaturthi to a 2-year-old?", "Keep it simple and sensory: “We're welcoming a special clay friend named Bappa who loves modaks and big hugs.” Focus on feelings and fun rather than mythology or history."],
  ["What can a toddler do during the puja?", "Toddlers can help place flowers, gently ring a small bell, clap during the aarti, or simply sit close and watch. Participation, not perfection, is what matters."],
  ["My child is scared of loud dhol-tasha sounds. What can I do?", "Introduce the sound gradually at home, keep a comforting distance at community celebrations, and let your child cover their ears if they need to. There is no rush."],
  ["Why do some families celebrate for ten days?", "Tradition holds that Bappa stays with us for a set number of days — commonly one and a half, five, seven, or ten — depending on the family."],
];

const speech = {
  English: "Hello everyone. Ganesh Chaturthi is a happy festival. We welcome Ganpati Bappa with flowers, songs and love. Bappa teaches us to be kind, listen well and help one another. Ganpati Bappa Morya!",
  Marathi: "नमस्कार! गणेश चतुर्थी हा आनंदाचा सण आहे. आपण बाप्पाचे प्रेमाने स्वागत करतो. बाप्पा आपल्याला चांगले ऐकायला, मदत करायला आणि दयाळू व्हायला शिकवतो. गणपती बाप्पा मोरया!",
  Hindi: "नमस्ते! गणेश चतुर्थी खुशियों का त्योहार है। हम बप्पा का फूलों और प्यार से स्वागत करते हैं। बप्पा हमें दयालु बनना और एक-दूसरे की मदद करना सिखाते हैं। गणपति बप्पा मोरया!",
};

export function FestivalJourney() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState("welcome");
  const [revealedFacts, setRevealedFacts] = useState<number[]>([]);
  const [revealedQuiz, setRevealedQuiz] = useState<number[]>([]);
  const [language, setLanguage] = useState<keyof typeof speech>("English");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [wishName, setWishName] = useState("");
  const [wishMade, setWishMade] = useState(false);

  const countdown = useMemo(() => {
    const target = new Date("2026-09-14T09:00:00+05:30").getTime();
    const days = Math.max(0, Math.ceil((target - Date.now()) / 86400000));
    return days;
  }, []);

  const jump = (id: string) => {
    setActiveChapter(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const copySpeech = async () => {
    await navigator.clipboard?.writeText(speech[language]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="fj-shell">
      <div className="fj-progress" aria-hidden="true"><span /></div>
      <header className="fj-topbar">
        <a className="fj-brand" href="#welcome" onClick={() => jump("welcome")} aria-label="Rainbow International Pre-School home">
          <span className="fj-brand-mark"><span /><span /><span /></span>
          <span><b>RAINBOW</b><small>INTERNATIONAL PRE-SCHOOL</small></span>
        </a>
        <div className="fj-top-meta"><span>Parent guide</span><i>·</i><span>Thane, Maharashtra</span></div>
        <button className="fj-menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Open chapter menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </header>

      {menuOpen && <div className="fj-mobile-menu">{chapters.map(c => <button key={c.id} onClick={() => jump(c.id)}><span>{c.index}</span>{c.title}<ArrowRight size={16} /></button>)}</div>}

      <section className="fj-hero" id="welcome">
        <div className="fj-hero-copy">
          <div className="fj-kicker"><Sparkles size={15} /> A festival trail for little explorers</div>
          <h1>Ganesh Chaturthi<br /><em>with your little one.</em></h1>
          <p className="fj-lede">A gentle, joyful guide to stories, small rituals, making, music and meaning — from Rainbow International Pre-School, Thane.</p>
          <div className="fj-date-card">
            <div className="fj-date-icon"><Flower2 size={22} /></div>
            <div><span>Ganesh Chaturthi 2026</span><strong>14 — 25 September</strong></div>
            <div className="fj-days"><b>{countdown}</b><small>days to go</small></div>
          </div>
          <div className="fj-hero-actions"><button className="fj-primary" onClick={() => jump("story")}>Begin the journey <ArrowDown size={17} /></button><a href="#chapters" className="fj-text-link">See all chapters <ArrowRight size={15} /></a></div>
        </div>
        <div className="fj-hero-art">
          <div className="fj-orbit orbit-one" /><div className="fj-orbit orbit-two" />
          <img src="/__mockup/images/ganesh-journey-hero.png" alt="A tactile illustration of a clay Ganesha with marigolds" />
          <div className="fj-art-note"><Star size={14} fill="currentColor" /> made for curious hearts</div>
        </div>
        <div className="fj-scroll-cue"><span>Scroll to wander</span><ArrowDown size={16} /></div>
      </section>

      <section className="fj-chapters" id="chapters">
        <div className="fj-wide-label"><span>THE TRAIL</span><i>Six little chapters, one big feeling</i></div>
        <div className="fj-chapter-grid">{chapters.map((chapter) => <button className={`fj-chapter ${chapter.color} ${activeChapter === chapter.id ? "current" : ""}`} key={chapter.id} onClick={() => jump(chapter.id)}><span className="fj-chapter-no">{chapter.index}</span><span className="fj-chapter-title">{chapter.title}</span><span className="fj-chapter-detail">{chapter.detail}</span><ArrowRight size={17} /></button>)}</div>
      </section>

      <section className="fj-section fj-intro" id="story">
        <div className="fj-section-marker"><span>02</span><i /></div>
        <div className="fj-section-content"><p className="fj-eyebrow">A note for grown-ups</p><h2>Wonder first.<br /><em>Worksheets later.</em></h2><p className="fj-large-copy">Ganesh Chaturthi is a season of colours, music, sweet treats and cuddly stories. For our tiniest learners, that is already enough. Use this guide as an invitation — not a checklist.</p><p>Choose one tiny moment: placing a flower, listening to a story, shaping a pretend modak or waving goodbye. Culture grows through warm repetition, shared attention and the feeling that there is room for every child.</p><div className="fj-pullquote"><span>“</span><p>We welcome Bappa with open hands, open ears and a brave little heart.</p><small>— Rainbow classroom thought</small></div></div>
        <aside className="fj-side-note"><BookOpen size={19} /><b>Read time</b><span>4 gentle minutes</span><hr /><Headphones size={19} /><b>Best together</b><span>At bedtime or story circle</span></aside>
      </section>

      <section className="fj-section fj-story" id="make">
        <div className="fj-section-marker"><span>03</span><i /></div>
        <div className="fj-section-content"><p className="fj-eyebrow">Story circle</p><h2>How Bappa got<br /><em>his elephant face.</em></h2><p>Once upon a time, Parvati made a little boy from soft clay and asked him to guard her door. He stood tall and did his job carefully. When Shiva learned that the boy was Parvati’s beloved son, he felt sorry and wanted to make things right.</p><p>With a baby elephant’s head and blessings from the gods, the little boy opened his eyes again. Everyone loved him so much that he was given a new name — Ganesha — and remembered first before starting anything new.</p><button className="fj-outline" onClick={() => jump("play")}><Play size={15} /> Read the next little story</button></div>
        <div className="fj-story-card"><div className="fj-story-card-top"><span>READ ALOUD</span><span>02:30</span></div><div className="fj-story-illustration"><div className="fj-moon" /><div className="fj-sun" /><div className="fj-story-figure">G</div><div className="fj-hill" /></div><p>“Stand here,” she said gently. “You are helping me.”</p><small>Pause here and ask: <i>What helps you feel brave?</i></small></div>
      </section>

      <section className="fj-facts" id="play">
        <div className="fj-facts-intro"><p className="fj-eyebrow">Tap to discover</p><h2>Four things Bappa<br />helps us remember.</h2><p>There is no wrong answer. Turn over a card, then tell your own story about it.</p></div>
        <div className="fj-facts-grid">{facts.map(([title, text], i) => <button className={`fj-fact ${revealedFacts.includes(i) ? "flipped" : ""}`} key={title} onClick={() => setRevealedFacts(r => r.includes(i) ? r.filter(x => x !== i) : [...r, i])} aria-label={`Reveal fact about ${title}`}><span className="fj-fact-front"><b>0{i + 1}</b><strong>{title}</strong><small>tap to turn</small></span><span className="fj-fact-back"><Check size={18} /><strong>{title}</strong><small>{text}</small></span></button>)}</div>
      </section>

      <section className="fj-section fj-making" id="speak">
        <div className="fj-section-marker"><span>04</span><i /></div>
        <div className="fj-section-content"><p className="fj-eyebrow">Make, move, repeat</p><h2>Little rituals<br /><em>count.</em></h2><div className="fj-activity-list"><div><span><Palette size={18} /></span><p><b>Shape a clay friend</b><small>Use natural clay or dough. Let small hands feel, press and make.</small></p></div><div><span><Music2 size={18} /></span><p><b>Find your festival beat</b><small>Clap softly, hum aarti or dance with a scarf. Loud is never required.</small></p></div><div><span><Leaf size={18} /></span><p><b>Say a gentle goodbye</b><small>Choose a small clay idol and immerse it safely at home in a tub.</small></p></div></div></div>
        <aside className="fj-age-card"><span className="fj-age-top">GROWING WITH BAPPA</span><h3>Choose your<br />own pace.</h3><div className="fj-age-row"><b>2–3</b><span>Flowers, claps, one-line stories</span></div><div className="fj-age-row"><b>3–4</b><span>Simple crafts, pretend modaks</span></div><div className="fj-age-row"><b>4–6</b><span>Speeches, quiz, helping hands</span></div></aside>
      </section>

      <section className="fj-speech" id="care">
        <div className="fj-speech-head"><div><p className="fj-eyebrow">Find your words</p><h2>A tiny speech<br /><em>for a big day.</em></h2></div><Languages size={29} /></div>
        <div className="fj-language-tabs">{(Object.keys(speech) as Array<keyof typeof speech>).map(lang => <button className={language === lang ? "selected" : ""} onClick={() => setLanguage(lang)} key={lang}>{lang}</button>)}</div>
        <div className="fj-speech-card"><p className={language !== "English" ? "fj-devanagari" : ""}>{speech[language]}</p><button onClick={copySpeech} className={copied ? "copied" : ""}>{copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy words</>}</button></div>
        <div className="fj-rhyme"><Music2 size={18} /><span>Try this rhyme:</span><b>“Big ears listen, little feet play — Bappa brings kindness every day.”</b></div>
      </section>

      <section className="fj-quiz-section">
        <div className="fj-quiz-heading"><CircleHelp size={27} /><div><p className="fj-eyebrow">Play together</p><h2>What did<br /><em>you notice?</em></h2></div></div>
        <div className="fj-quiz-list">{quiz.map((item, i) => <div className="fj-quiz-row" key={item.question}><span>0{i + 1}</span><div><b>{item.question}</b>{revealedQuiz.includes(i) && <p><Check size={15} /> {item.answer}</p>}</div><button onClick={() => setRevealedQuiz(r => r.includes(i) ? r.filter(x => x !== i) : [...r, i])}>{revealedQuiz.includes(i) ? <RotateCcw size={17} /> : <ArrowRight size={17} />}</button></div>)}</div>
      </section>

      <section className="fj-wish">
        <div className="fj-wish-copy"><p className="fj-eyebrow">Make a keepsake</p><h2>A little wish<br /><em>to carry home.</em></h2><p>Write your child’s name and make a festival card to save or share with someone you love.</p><label htmlFor="wish-name">Your little explorer’s name</label><input id="wish-name" value={wishName} onChange={e => { setWishName(e.target.value); setWishMade(false); }} placeholder="Type a name" /><button className="fj-primary" onClick={() => setWishMade(true)} disabled={!wishName.trim()}>{wishMade ? <><Check size={17} /> Card ready</> : <><Gift size={17} /> Make our card</>}</button></div>
        <div className={`fj-card-preview ${wishMade ? "made" : ""}`}><div className="fj-card-sun"><Sparkles size={20} /></div><span>GANPATI BAPPA MORYA</span><h3>{wishMade && wishName ? `${wishName}'s` : "A little one's"}<br /><em>festival wish</em></h3><div className="fj-card-line" /><p>May your days be full of<br />kindness, colour and courage.</p><Flower2 size={25} /><small>Rainbow International Pre-School</small><button className="fj-download" aria-label="Download wish card"><Download size={15} /></button></div>
      </section>

      <section className="fj-faq"><div className="fj-faq-head"><p className="fj-eyebrow">For curious grown-ups</p><h2>Parents ask.<br /><em>We listen.</em></h2><ShieldCheck size={34} /></div><div className="fj-faq-list">{faqs.map(([q, a], i) => <div className={`fj-faq-item ${openFaq === i ? "open" : ""}`} key={q}><button onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}><span>{q}</span><ChevronDown size={18} /></button>{openFaq === i && <p>{a}</p>}</div>)}</div></section>

      <footer className="fj-footer"><div className="fj-footer-mark"><span className="fj-brand-mark"><span /><span /><span /></span><b>RAINBOW</b></div><p>Let's grow, learn and celebrate together.</p><div><a href="#welcome" onClick={() => jump("welcome")}>Back to the beginning <ArrowRight size={15} /></a><span>© Rainbow International Pre-School, Thane</span></div></footer>
    </main>
  );
}