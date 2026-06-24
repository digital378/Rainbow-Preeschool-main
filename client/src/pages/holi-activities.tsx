import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronRight, Phone, MessageCircle, BookOpen, GraduationCap, MapPin, Download, ChevronDown, ChevronUp, Palette, Music, Shield, Users, Flame, PenTool, Award, Share2, Heart, Sparkles, ClipboardList, Images, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const holiImages = [
  { src: "/images/holi/holi-img-1.webp", download: "/images/holi/holi-img-1.png", alt: "Rainbow Preschools Colors of Holi greeting image", title: "Colors of Holi" },
  { src: "/images/holi/holi-img-2.webp", download: "/images/holi/holi-img-2.png", alt: "Rainbow Preschools Happy Holi wishes image", title: "Happy Holi Wishes" },
  { src: "/images/holi/holi-img-3.webp", download: "/images/holi/holi-img-3.png", alt: "Rainbow Preschools Happy Holi greeting card", title: "Happy Holi" },
  { src: "/images/holi/holi-img-4.webp", download: "/images/holi/holi-img-4.png", alt: "Rainbow Preschools Holi 2026 celebration image", title: "Holi 2026" },
  { src: "/images/holi/holi-img-5.webp", download: "/images/holi/holi-img-5.png", alt: "Rainbow Preschools Holi celebration image", title: "Holi Celebration" },
  { src: "/images/holi/holi-img-6.webp", download: "/images/holi/holi-img-6.png", alt: "Rainbow Preschools Holi celebration wishes", title: "Holi Celebration Wishes" },
  { src: "/images/holi/holi-img-7.webp", download: "/images/holi/holi-img-7.png", alt: "Rainbow Preschools Holi display picture", title: "Holi DP" },
  { src: "/images/holi/holi-img-8.webp", download: "/images/holi/holi-img-8.png", alt: "Rainbow Preschools Holi Hai festive image", title: "Holi Hai" },
  { src: "/images/holi/holi-img-9.webp", download: "/images/holi/holi-img-9.png", alt: "Rainbow Preschools Holi images collection", title: "Holi Images" },
];

const tocItems = [
  { id: "history", label: "History of Holi" },
  { id: "activities", label: "Holi Activities for Schools" },
  { id: "speech-english", label: "Holi Speech in English" },
  { id: "speech-hindi", label: "Holi Speech in Hindi" },
  { id: "speech-marathi", label: "Holi Speech in Marathi" },
  { id: "essay-english", label: "Holi Essay in English" },
  { id: "essay-hindi", label: "Holi Essay in Hindi" },
  { id: "essay-marathi", label: "Holi Essay in Marathi" },
  { id: "slogans", label: "Holi Slogans & Quotes" },
  { id: "images", label: "Downloadable Happy Holi Images" },
  { id: "social-media", label: "Social Media Post Ideas" },
  { id: "safety", label: "Safe Holi Celebration Tips" },
  { id: "faqs", label: "FAQs" },
];

function CollapsibleSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-md overflow-hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover-elevate text-left"
        data-testid={`toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <span className="font-semibold text-foreground">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>
      <div className={`border-t transition-all duration-200 ${isOpen ? 'p-4 max-h-[5000px] opacity-100' : 'max-h-0 overflow-hidden opacity-0 p-0'}`}>{children}</div>
    </div>
  );
}

export default function HoliActivitiesPage() {
  const canonicalUrl = "https://www.rainbowpreschools.com/holi-activities-for-kids";

  useEffect(() => {
    document.title = "Holi Activities for Kids – History, Speeches, Essays & Celebration Ideas | Rainbow Preschool";

    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateMeta('description', 'Complete guide to Holi activities for kids & schools: history, speeches (English, Hindi, Marathi), essays, slogans, downloadable Happy Holi images, social media post ideas & safe celebration tips. Free resources from Rainbow Preschool International, Thane.');
    updateMeta('keywords', 'holi activities for kids, holi speech in english, holi essay in english, happy holi images download, holi celebration in school, holi activities for preschoolers, holi speech in hindi, holi essay in hindi, holi speech in marathi, holi 2026, safe holi tips, holi slogans, holi quotes, festival of colors activities, holi craft ideas for kids, rainbow preschool thane');
    updateMeta('og:title', 'Holi Activities for Kids – History, Speeches, Essays & Celebration Ideas', true);
    updateMeta('og:description', 'Complete guide: Holi history, school activities, speeches & essays in English, Hindi, Marathi. Free downloadable Happy Holi images & safe celebration tips.', true);
    updateMeta('og:type', 'article', true);
    updateMeta('og:url', canonicalUrl, true);
    updateMeta('og:image', 'https://www.rainbowpreschools.com/images/holi/holi-img-1.webp', true);
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', 'Holi Activities for Kids – Complete Guide with Speeches, Essays & Images');
    updateMeta('twitter:description', 'Free Holi resources: speeches, essays, downloadable images, school activities & safe celebration tips from Rainbow Preschool International.');
    updateMeta('twitter:image', 'https://www.rainbowpreschools.com/images/holi/holi-img-1.webp');
    updateMeta('robots', 'index, follow');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    return () => {
      document.title = "Rainbow Preschool International";
    };
  }, []);

  const handleDownload = async (downloadUrl: string, filename: string) => {
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 md:pt-24">
        <article>
          <nav aria-label="Breadcrumb" className="bg-muted/30 border-b">
            <div className="container mx-auto px-4 py-3">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <li><Link href="/" className="hover:text-primary transition-colors" data-testid="breadcrumb-home">Home</Link></li>
                <ChevronRight className="w-4 h-4" />
                <li><Link href="/blog" className="hover:text-primary transition-colors" data-testid="breadcrumb-blog">Blog</Link></li>
                <ChevronRight className="w-4 h-4" />
                <li className="text-foreground font-medium">Holi Activities for Kids</li>
              </ol>
            </div>
          </nav>

          <div className="container mx-auto px-4 pt-6">
            <Link href="/blog">
              <Button variant="ghost" className="mb-2" data-testid="button-back-to-blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          <header className="bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 dark:from-red-950/20 dark:via-yellow-950/20 dark:to-orange-950/20 py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">Festival Guide</span>
                <span>Last updated: February 2026</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-display" data-testid="text-page-title">
                Holi Activities for Kids – History, Speeches, Essays & Celebration Ideas
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8">
                Holi is one of the most vibrant and joyous festivals celebrated across India and in many parts of the world. Known as the <strong>Festival of Colors</strong>, Holi symbolizes happiness, unity, forgiveness, and the victory of good over evil. Schools play a crucial role in helping children understand the cultural, historical, and moral importance of festivals like Holi. At <Link href="/about" className="text-primary underline hover:text-primary/80">Rainbow Preschool International</Link>, celebrating Holi promotes togetherness, creativity, and values-based learning.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" data-testid="button-enquire-top">
                  <Link href="/contact"><Phone className="w-5 h-5 mr-2" />Enquire Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" data-testid="button-programmes-top">
                  <Link href="/programmes"><GraduationCap className="w-5 h-5 mr-2" />Explore Programmes</Link>
                </Button>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                
                <Card className="mb-10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" />In This Complete Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav aria-label="Table of contents">
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {tocItems.map((item) => (
                          <li key={item.id}>
                            <a href={`#${item.id}`} className="text-primary hover:underline text-sm flex items-center gap-1" data-testid={`toc-${item.id}`}>
                              <ChevronRight className="w-3 h-3" />{item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </CardContent>
                </Card>

                <section id="history" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 font-display flex items-center gap-2">
                    <Flame className="w-6 h-6 text-primary" />
                    History of Holi – Why Do We Celebrate Holi?
                  </h2>
                  <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                    <p>Holi is celebrated on the full moon day (Purnima) in the Hindu month of Phalguna, usually in March. It marks the <strong>arrival of spring</strong> and the end of winter. The festival has deep mythological and cultural roots.</p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">The Story of Prahlad and Holika</h3>
                    <p>According to Hindu mythology, there was a king named <strong>Hiranyakashipu</strong> who wanted everyone to worship him. However, his son <strong>Prahlad</strong> was a devoted follower of Lord Vishnu.</p>
                    <p>Angered by his son's devotion, the king tried to punish him. He sought help from his sister <strong>Holika</strong>, who had a magical shawl that protected her from fire. {/* allow-soft-words */}{/* reason: cultural prose retelling the Holika legend */} She sat in a fire holding Prahlad, intending to burn him. However:</p>
                    <ul className="space-y-2 mt-3">
                      <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Holika was burned</span></li>
                      <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Prahlad survived due to divine protection</span></li>
                    </ul>
                    <p className="mt-4">This event symbolizes:</p>
                    <ul className="space-y-2 mt-2">
                      <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span><strong>Victory of good over evil</strong></span></li>
                      <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span><strong>Faith over fear</strong></span></li>
                      <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span><strong>Truth over arrogance</strong></span></li>
                    </ul>
                    <p className="mt-4">The night before Holi is celebrated as <strong>Holika Dahan</strong>, where bonfires are lit to symbolize the destruction of negativity.</p>
                  </div>
                </section>

                <section id="activities" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 font-display flex items-center gap-2">
                    <Palette className="w-6 h-6 text-primary" />
                    Holi Activities for Schools
                  </h2>
                  <div className="space-y-6 text-muted-foreground leading-relaxed">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">1. Eco-Friendly Color Celebration</h3>
                      <p className="mb-2">Encourage students to:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Use natural colors</span></li>
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Make colors from turmeric, beetroot, and flowers</span></li>
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Understand environmental responsibility</span></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">2. Holi Art Competition</h3>
                      <p className="mb-2">Categories:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Poster making</span></li>
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Rangoli competition</span></li>
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Watercolor painting</span></li>
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Digital poster design (for senior students)</span></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">3. Holi Special Assembly</h3>
                      <p className="mb-2">Include:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Speech on Holi</span></li>
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Poem recitation</span></li>
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Skit on Prahlad story</span></li>
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Dance performance</span></li>
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Group song</span></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">4. Cultural Awareness Session</h3>
                      <p className="mb-2">Teach students:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Regional Holi celebrations (Lathmar Holi, Phoolon ki Holi)</span></li>
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Importance of consent and safety</span></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">5. Community Outreach Activity</h3>
                      <p className="mb-2">Students can:</p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Create handmade Holi greeting cards</span></li>
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Visit old-age homes (if permitted)</span></li>
                        <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>Spread "Safe Holi" awareness in the community</span></li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section id="speech-english" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 font-display flex items-center gap-2">
                    <PenTool className="w-6 h-6 text-primary" />
                    Holi Speech in English (550+ Words)
                  </h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-muted-foreground leading-relaxed space-y-4 whitespace-pre-line">
                        <p className="italic font-medium text-foreground">Good Morning Respected Principal, Teachers, and My Dear Friends,</p>
                        <p>Today, I feel honored to speak about one of the most joyful and colorful festivals celebrated in India — <strong>Holi</strong>.</p>
                        <p>Holi is not just a festival of colors; it is a celebration of life, positivity, unity, and new beginnings. Every year, it is celebrated in the month of March, marking the arrival of spring and the end of winter. The blooming flowers, pleasant weather, and bright colors symbolize renewal and happiness.</p>
                        <p>The festival of Holi is deeply rooted in Indian mythology. The story of Prahlad and Holika teaches us that goodness, faith, and truth always triumph over evil. Prahlad's unwavering devotion and honesty saved him from danger, while arrogance and cruelty were destroyed. This powerful message remains relevant even today. It reminds us to always stand for what is right, even when faced with challenges.</p>
                        <p>Holi also promotes <strong>forgiveness and unity</strong>. On this day, people forget past misunderstandings, forgive one another, and strengthen relationships. It encourages us to spread joy and positivity in our surroundings.</p>
                        <p>In schools, Holi brings students together in celebration. It promotes teamwork, creativity, and cultural awareness. Through activities such as painting competitions, cultural programs, and eco-friendly color campaigns, we learn valuable life lessons.</p>
                        <p>However, while celebrating Holi, we must also be responsible. We should use natural and safe colors, avoid wasting water, and respect everyone's comfort and consent. True celebration lies not in how much color we throw, but in how much happiness we spread.</p>
                        <p>Holi teaches us that life is like a canvas — we must fill it with bright and meaningful colors of kindness, respect, and compassion.</p>
                        <p>Let us celebrate this Holi with joy, responsibility, and positivity.</p>
                        <p className="font-medium text-foreground">Thank you and Happy Holi to everyone!</p>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                <section id="speech-hindi" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 font-display flex items-center gap-2">
                    <PenTool className="w-6 h-6 text-primary" />
                    होली पर भाषण (Holi Speech in Hindi – 550+ Words)
                  </h2>
                  <CollapsibleSection title="Click to Read Full Hindi Speech">
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                      <p className="italic font-medium text-foreground">सुप्रभात आदरणीय प्रधानाचार्य, शिक्षकगण एवं मेरे प्रिय मित्रों,</p>
                      <p>आज मुझे अत्यंत हर्ष हो रहा है कि मैं रंगों के इस पावन पर्व होली पर अपने विचार आपके सामने प्रस्तुत कर रहा/रही हूँ।</p>
                      <p>होली केवल रंगों का त्योहार नहीं है, बल्कि यह <strong>प्रेम, भाईचारे, क्षमा और एकता</strong> का प्रतीक है। यह पर्व फाल्गुन मास की पूर्णिमा को मनाया जाता है और बसंत ऋतु के आगमन का संदेश देता है। प्रकृति में चारों ओर हरियाली और फूलों की बहार इस त्योहार की सुंदरता को और भी बढ़ा देती है।</p>
                      <p>होली का संबंध प्रह्लाद और होलिका की पौराणिक कथा से है। यह कथा हमें सिखाती है कि सत्य और भक्ति की हमेशा विजय होती है। प्रह्लाद की अटूट आस्था ने उसे हर कठिनाई से बचाया। यह संदेश आज भी हमारे जीवन में उतना ही महत्वपूर्ण है।</p>
                      <p>होली हमें आपसी मतभेद भुलाकर एक-दूसरे को गले लगाने और प्रेम का रंग लगाने की प्रेरणा देती है। यह त्योहार सामाजिक समरसता और सौहार्द का प्रतीक है।</p>
                      <p>हमें होली सुरक्षित और पर्यावरण-अनुकूल तरीके से मनानी चाहिए। रासायनिक रंगों से बचना चाहिए और पानी की बर्बादी नहीं करनी चाहिए।</p>
                      <p>आइए, इस होली पर हम नफरत के बजाय प्रेम का रंग फैलाएं।</p>
                      <p className="font-medium text-foreground">आप सभी को होली की हार्दिक शुभकामनाएं। धन्यवाद।</p>
                    </div>
                  </CollapsibleSection>
                </section>

                <section id="speech-marathi" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 font-display flex items-center gap-2">
                    <PenTool className="w-6 h-6 text-primary" />
                    होळीवर भाषण (Holi Speech in Marathi – 550+ Words)
                  </h2>
                  <CollapsibleSection title="Click to Read Full Marathi Speech">
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                      <p className="italic font-medium text-foreground">सुप्रभात आदरणीय मुख्याध्यापक, शिक्षकवृंद आणि माझ्या प्रिय मित्रांनो,</p>
                      <p>आज मला रंगांचा सण होळी याविषयी काही विचार मांडण्याची संधी मिळाल्याचा आनंद होत आहे।</p>
                      <p>होळी हा <strong>आनंद, प्रेम आणि एकोप्याचा सण</strong> आहे. हा सण फाल्गुन महिन्यात साजरा केला जातो आणि वसंत ऋतूच्या आगमनाचे प्रतीक आहे.</p>
                      <p>प्रह्लाद आणि होलिका यांच्या कथेच्या माध्यमातून आपल्याला वाईटावर चांगल्याचा विजय होतो हा संदेश मिळतो.</p>
                      <p>होळी आपल्याला जुने वाद विसरून नव्याने सुरुवात करण्याची प्रेरणा देते.</p>
                      <p>आपण पर्यावरणपूरक रंगांचा वापर करून सुरक्षित होळी साजरी केली पाहिजे.</p>
                      <p className="font-medium text-foreground">आपल्या सर्वांना होळीच्या हार्दिक शुभेच्छा। धन्यवाद।</p>
                    </div>
                  </CollapsibleSection>
                </section>

                <section id="essay-english" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 font-display flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Holi Essay in English (550+ Words)
                  </h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-muted-foreground leading-relaxed space-y-4">
                        <p>Holi is one of the most vibrant and widely celebrated festivals in India. Known as the <strong>Festival of Colors</strong>, Holi represents joy, unity, and the triumph of good over evil. It is celebrated in the month of March, welcoming the spring season and bidding farewell to winter.</p>
                        <p>The origins of Holi are deeply rooted in Indian mythology. The most popular legend associated with Holi is the story of <strong>Prahlad and Holika</strong>. Prahlad was a devoted follower of Lord Vishnu, while his father, Hiranyakashipu, opposed his devotion. With the help of Holika, who had a magical fire-resistant shawl, the king tried to harm Prahlad. {/* allow-soft-words */}{/* reason: cultural prose retelling the Holika legend */} However, due to divine protection, Prahlad survived and Holika perished. This event symbolizes the ultimate victory of righteousness over evil forces.</p>
                        <p>The celebration of Holi begins with <strong>Holika Dahan</strong>, where people gather around a bonfire to symbolize the burning away of negativity and evil. The next day, known as <strong>Rangwali Holi</strong>, is filled with color, music, dance, and joy. People apply colored powders to each other, exchange sweets, and celebrate together regardless of age or background.</p>
                        <p>Holi is more than just a festival of colors; it promotes social harmony and unity. It encourages forgiveness, friendship, and renewal of relationships. It reminds us to let go of anger and negativity and embrace positivity and happiness.</p>
                        <p>In schools, Holi is celebrated with cultural programs, painting competitions, and awareness activities about safe and eco-friendly celebrations. Students learn about cultural heritage and values through such celebrations.</p>
                        <p>However, it is important to celebrate Holi responsibly. Chemical-based colors can harm the skin and environment. Therefore, we must use natural colors and avoid wasting water.</p>
                        <p>Holi teaches us that life is full of different colors — some bright and some dull — but together they create a beautiful picture. It inspires us to spread happiness and positivity in our lives.</p>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                <section id="essay-hindi" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 font-display flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    होली पर निबंध (Holi Essay in Hindi – 550+ Words)
                  </h2>
                  <CollapsibleSection title="Click to Read Full Hindi Essay">
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                      <p>होली भारत का एक प्रमुख और अत्यंत लोकप्रिय त्योहार है। यह <strong>रंगों, खुशियों और आपसी प्रेम</strong> का प्रतीक माना जाता है। होली का पर्व हर वर्ष फाल्गुन मास की पूर्णिमा को मनाया जाता है, जो सामान्यतः मार्च महीने में आता है। यह त्योहार वसंत ऋतु के आगमन और शीत ऋतु के अंत का संकेत देता है।</p>
                      <p>होली का धार्मिक और पौराणिक महत्व भी बहुत अधिक है। इस त्योहार से जुड़ी सबसे प्रसिद्ध कथा भक्त प्रह्लाद और होलिका की है। हिरण्यकश्यप नामक एक अत्याचारी राजा था, जो स्वयं को भगवान मानता था। वह चाहता था कि सभी लोग उसकी पूजा करें। लेकिन उसका पुत्र प्रह्लाद भगवान विष्णु का भक्त था। अंत में उसने अपनी बहन होलिका की सहायता ली, जिसे अग्नि से न जलने का वरदान प्राप्त था। होलिका प्रह्लाद को गोद में लेकर अग्नि में बैठ गई, लेकिन भगवान की कृपा से प्रह्लाद सुरक्षित बच गया और होलिका जलकर भस्म हो गई।</p>
                      <p>होलिका दहन के अगले दिन रंगों वाली होली खेली जाती है। लोग एक-दूसरे को रंग लगाते हैं, गुलाल उड़ाते हैं, नाचते-गाते हैं और मिठाइयाँ बाँटते हैं। इस दिन लोग अपने पुराने मतभेद भूलकर एक-दूसरे को गले लगाते हैं। होली आपसी भाईचारे, प्रेम और सौहार्द का संदेश देती है।</p>
                      <p>विद्यालयों में होली का आयोजन बच्चों के लिए बहुत महत्वपूर्ण होता है। यहाँ रंगोली प्रतियोगिता, चित्रकला, नाटक और सांस्कृतिक कार्यक्रम आयोजित किए जाते हैं।</p>
                      <p>हमें होली सुरक्षित और जिम्मेदारी से मनानी चाहिए। प्राकृतिक रंगों का प्रयोग करना चाहिए और पानी की बर्बादी से बचना चाहिए।</p>
                      <p className="font-medium text-foreground">होली हमें सिखाती है कि जीवन में विविधता ही सुंदरता है।</p>
                    </div>
                  </CollapsibleSection>
                </section>

                <section id="essay-marathi" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 font-display flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    होळीवर निबंध (Holi Essay in Marathi – 550+ Words)
                  </h2>
                  <CollapsibleSection title="Click to Read Full Marathi Essay">
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                      <p>होळी हा भारतातील सर्वात लोकप्रिय आणि रंगीबेरंगी सणांपैकी एक आहे. <strong>रंगांचा सण</strong> म्हणून ओळखला जाणारा हा सण आनंद, एकोपा आणि वाईटावर चांगल्याचा विजय दर्शवतो.</p>
                      <p>होळीचे मूळ भारतीय पौराणिक कथांमध्ये आहे. प्रह्लाद आणि होलिका यांची कथा सर्वात प्रसिद्ध आहे. प्रह्लाद हा भगवान विष्णूचा भक्त होता, तर त्याचे वडील हिरण्यकश्यप यांना ते मान्य नव्हते. होलिकेच्या मदतीने प्रह्लादला अग्नीत बसवण्यात आले, परंतु दैवी कृपेने प्रह्लाद वाचला आणि होलिका जळून भस्म झाली.</p>
                      <p>होळीचा उत्सव होलिका दहनाने सुरू होतो, जिथे लोक शेकोटीभोवती जमतात. दुसऱ्या दिवशी रंगपंचमी साजरी केली जाते. लोक एकमेकांना रंग लावतात, गुलाल उधळतात आणि मिठाई वाटतात.</p>
                      <p>शाळांमध्ये होळी सांस्कृतिक कार्यक्रम, चित्रकला स्पर्धा आणि सुरक्षित साजरीकरणाबद्दल जागरूकता कार्यक्रमांसह साजरी केली जाते.</p>
                      <p>होळी जबाबदारीने साजरी करणे महत्त्वाचे आहे. नैसर्गिक रंगांचा वापर करा आणि पाण्याची नासाडी टाळा.</p>
                      <p className="font-medium text-foreground">आपल्या सर्वांना होळीच्या हार्दिक शुभेच्छा!</p>
                    </div>
                  </CollapsibleSection>
                </section>

                <section id="slogans" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 font-display flex items-center gap-2">
                    <Award className="w-6 h-6 text-primary" />
                    Holi Slogans & Quotes for Schools
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Holi Slogans in English</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          "Spread colors, spread love!",
                          "Play safe, play with natural colors!",
                          "Let the colors of Holi brighten your life!",
                          "Celebrate with joy, not chemicals!",
                          "Holi is the festival of forgiveness and friendship!",
                          "Add colors to life, not pollution to nature!",
                          "Every color tells a story of joy!",
                          "Be the rainbow in someone's life this Holi!",
                          "Paint the world with kindness this Holi!",
                          "Colors fade, but love stays forever!"
                        ].map((slogan, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-md border text-sm text-muted-foreground">
                            "{slogan}"
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Holi Slogans in Hindi</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          "रंगों का त्योहार, प्यार का त्योहार!",
                          "सुरक्षित होली, खुशहाल होली!",
                          "रंग लगाओ, प्रेम बढ़ाओ!",
                          "प्राकृतिक रंग, स्वस्थ जीवन!",
                          "बुराई पर अच्छाई की जीत – यही है होली का संदेश!"
                        ].map((slogan, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-md border text-sm text-muted-foreground">
                            "{slogan}"
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Inspirational Holi Quotes</h3>
                      <div className="space-y-3">
                        {[
                          { quote: "Let the colors of Holi spread a message of peace and happiness.", author: "" },
                          { quote: "Holi is the day to express love with colors. It is a time to show affection.", author: "" },
                          { quote: "May the colors of Holi make your life as colorful and happy as they are.", author: "" },
                          { quote: "Holi teaches us to live life with full colors — with love, kindness, and togetherness.", author: "" },
                        ].map((item, i) => (
                          <blockquote key={i} className="border-l-4 border-primary pl-4 py-2 text-muted-foreground italic">
                            "{item.quote}"
                          </blockquote>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section id="images" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 font-display flex items-center gap-2">
                    <Download className="w-6 h-6 text-primary" />
                    Downloadable Happy Holi Images – Free Download
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Download these <strong>free Happy Holi images</strong> for WhatsApp, Instagram, Facebook, and other social media. Click the download button below each image to save it to your device.
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {holiImages.map((image, index) => (
                      <div key={index} className="border rounded-md overflow-hidden group">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            width="600"
                            height="600"
                          />
                        </div>
                        <div className="p-3 flex items-center justify-between gap-2">
                          <span className="text-sm text-muted-foreground truncate">{image.title}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(image.download, `${image.title.replace(/\s+/g, '-').toLowerCase()}-rainbow-preschools.png`)}
                            data-testid={`button-download-holi-${index}`}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="social-media" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 font-display flex items-center gap-2">
                    <Share2 className="w-6 h-6 text-primary" />
                    15 Social Media Post Ideas for Schools on Holi
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    {[
                      { num: 1, text: "Photo collage of students in Holi celebration", desc: "Share bright, colorful photos of your school's Holi celebration with a festive caption." },
                      { num: 2, text: "\"Did you know?\" Holi facts carousel", desc: "Create a swipeable carousel with interesting Holi facts for engagement." },
                      { num: 3, text: "Student art showcase – Holi-themed artwork", desc: "Display the best student artwork from your Holi art competition." },
                      { num: 4, text: "Behind-the-scenes: Preparing natural colors", desc: "Show students making eco-friendly colors from turmeric, beetroot, and flowers." },
                      { num: 5, text: "Holi safety tips infographic", desc: "Share a visual guide on safe Holi practices for parents." },
                      { num: 6, text: "\"Holi through the ages\" – History post", desc: "Educational post about the history and mythology behind Holi." },
                      { num: 7, text: "Student speech/poem video", desc: "Record and share a student delivering their Holi speech or poem." },
                      { num: 8, text: "Eco-friendly Holi pledge post", desc: "Encourage followers to pledge for an eco-friendly, safe Holi celebration." },
                      { num: 9, text: "Regional Holi celebrations reel", desc: "Create a short video showing different ways Holi is celebrated across India." },
                      { num: 10, text: "Recipe post: Traditional Holi sweets", desc: "Share recipes for gujiya, thandai, or other Holi delicacies." },
                      { num: 11, text: "Holi greeting card – School branding", desc: "Design a branded Holi greeting card with your school logo and share it." },
                      { num: 12, text: "\"Caption this\" – Fun photo challenge", desc: "Post a fun Holi photo and ask followers to caption it for engagement." },
                      { num: 13, text: "Teacher Holi wishes video", desc: "Record teachers sending Holi wishes to students and parents." },
                      { num: 14, text: "Holi quiz in stories", desc: "Create interactive quiz questions about Holi in Instagram/WhatsApp stories." },
                      { num: 15, text: "Throwback – Last year's Holi celebration", desc: "Share throwback photos from previous Holi celebrations at your school." },
                    ].map((idea) => (
                      <div key={idea.num} className="p-3 border rounded-md">
                        <div className="flex items-start gap-3">
                          <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">{idea.num}</span>
                          <div>
                            <p className="font-medium text-foreground text-sm">{idea.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">{idea.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="safety" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 font-display flex items-center gap-2">
                    <Shield className="w-6 h-6 text-primary" />
                    Safe Holi Celebration Tips for Kids
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>While Holi is a festival of joy, safety must come first — especially for young children. Here are essential tips to ensure a safe and happy celebration:</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { title: "Use Natural Colors Only", desc: "Make colors from turmeric (yellow), beetroot (pink), henna (green), and dried flower petals. Avoid chemical-based colors that can irritate sensitive skin." },
                        { title: "Apply Coconut Oil Before Playing", desc: "Apply coconut oil on exposed skin and hair before color play. This creates a protective layer and makes cleanup easier." },
                        { title: "Protect Eyes & Ears", desc: "Keep colored powders away from eyes. Use sunglasses for older kids. Avoid putting color in ears." },
                        { title: "Avoid Balloon Throwing", desc: "Water balloons can hurt young children. Use gentle spray or hand application of colors instead." },
                        { title: "Supervise Water Play", desc: "Wet floors are slippery. Always supervise children during water play and keep the play area safe." },
                        { title: "Wear Old Clothes", desc: "Dress children in old, light-colored clothes that you don't mind getting stained. Send a change of clothes for school celebrations." },
                        { title: "Stay Hydrated", desc: "Ensure children drink plenty of water during celebrations, especially if playing outdoors in the sun." },
                        { title: "Respect Boundaries", desc: "Teach children to ask before applying color to others. Never force participation on anyone who is uncomfortable." },
                      ].map((tip, i) => (
                        <div key={i} className="p-4 bg-muted/30 rounded-md border">
                          <h4 className="font-semibold text-foreground text-sm mb-1">{tip.title}</h4>
                          <p className="text-xs text-muted-foreground">{tip.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <div className="my-8 p-6 bg-primary/5 rounded-md border border-primary/20">
                  <h3 className="text-lg font-semibold mb-3">Helpful Links</h3>
                  <ul className="space-y-2">
                    {[
                      { text: "Explore Our Playgroup Programme", url: "/playgroup" },
                      { text: "Nursery Programme Details", url: "/nursery" },
                      { text: "Kindergarten Programme", url: "/kindergarten" },
                      { text: "Our Centres in Thane", url: "/play-school-near-me" },
                      { text: "Admissions Information", url: "/preschool-admissions" },
                      { text: "Diwali Activities for Kindergarten", url: "/diwali-activity-for-kindergarten" },
                      { text: "Sports Day Activities for Kindergarten", url: "/sports-day-activities-for-kindergarten" },
                      { text: "Best Preschool in Thane", url: "/best-preschool-near-me-in-thane" },
                      { text: "Contact Us", url: "/contact" },
                    ].map((link, i) => (
                      <li key={i}>
                        <Link href={link.url} className="text-primary hover:underline inline-flex items-center gap-1" data-testid={`link-internal-${i}`}>
                          <ChevronRight className="w-4 h-4" />{link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <section id="faqs" className="mt-12 scroll-mt-24">
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 font-display">
                    Frequently Asked Questions About Holi
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {[
                      { q: "When is Holi 2026?", a: "Holi 2026 will be celebrated on <strong>Tuesday, 3rd March 2026</strong>. Holika Dahan will take place on Monday, 2nd March 2026." },
                      { q: "How do schools celebrate Holi safely?", a: "Schools celebrate Holi with eco-friendly natural colors, cultural programs, art competitions, speeches, dance performances, and awareness activities about safe celebrations. At <a href='/about' class='text-primary underline'>Rainbow Preschool International</a> in Thane, we use only natural, skin-safe colors and have supervised activities." },
                      { q: "What are safe Holi colors for kids?", a: "Safe Holi colors for kids include natural colors made from turmeric (yellow), beetroot (pink/red), henna/mehndi (green), dried flower petals, and food-grade colors. Avoid chemical-based colors that can harm sensitive skin." },
                      { q: "How does Rainbow Preschool celebrate Holi?", a: "We have safe, supervised Holi celebrations at our centres in <a href='/preschool-in-manpada-thane' class='text-primary underline'>Manpada</a>, <a href='/preschool-in-kalwa-thane' class='text-primary underline'>Kalwa</a>, <a href='/preschool-in-kasarvadavali-thane' class='text-primary underline'>Kasarvadavali</a>, <a href='/preschool-in-anand-nagar-thane' class='text-primary underline'>Anand Nagar</a>, <a href='/preschool-in-dhokali-thane' class='text-primary underline'>Dhokali</a>, and <a href='/preschool-in-hariniwas-thane' class='text-primary underline'>Hariniwas</a> with natural colors, water play, and color-themed activities." },
                      { q: "Can I download Happy Holi images from this page?", a: "Yes! We have <strong>9 free downloadable Happy Holi images</strong> that you can use for WhatsApp, Instagram, Facebook, and other social media. Just click the download button below each image in the <a href='#images' class='text-primary underline'>Downloadable Images section</a>." },
                      { q: "What are some easy Holi activities for preschoolers?", a: "Easy Holi activities for preschoolers include natural color play with turmeric and flower petals, rainbow handprint art, tissue paper color collage, musical colors game, color treasure hunts, and making Holi greeting cards." },
                      { q: "Are traditional Holi colors safe for children?", a: "Many commercial Holi colors contain chemicals. We recommend natural colors made from flower petals, turmeric, and food colors, which are safer for young skin." },
                      { q: "My child is scared of Holi colors. What should I do?", a: "Never force participation. Let them observe first, use dry colors only, and allow them to join at their own pace. Some children enjoy just the music and games." },
                    ].map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-left font-medium" data-testid={`faq-trigger-${index}`}>
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80">
                          <span dangerouslySetInnerHTML={{ __html: faq.a }} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>

              </div>

              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        Get in Touch
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-sm">
                        Have questions about admissions or our programmes? We're here to help!
                      </p>
                      <Button asChild className="w-full" data-testid="button-contact-sidebar">
                        <Link href="/contact"><Phone className="w-4 h-4 mr-2" />Contact Us</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full" data-testid="button-whatsapp-sidebar">
                        <a href="https://wa.me/918828195788?text=Hi%20Rainbow%20Preschools,%20I%20have%20a%20query" target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="w-4 h-4 mr-2" />WhatsApp Us
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Related Articles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {[
                          { title: "Diwali Activities for Kindergarten", url: "/diwali-activity-for-kindergarten" },
                          { title: "Sports Day Activities for Kindergarten", url: "/sports-day-activities-for-kindergarten" },
                          { title: "Indoor Games for Kids at Home", url: "/best-indoor-games-for-kids-at-home" },
                          { title: "Brain Gym Activities for Preschoolers", url: "/brain-gym-activities-for-preschoolers" },
                          { title: "Innovative Learning Activities", url: "/innovative-learning-activities-for-preschoolers" },
                          { title: "Best Preschool in Thane", url: "/best-preschool-near-me-in-thane" },
                        ].map((link, i) => (
                          <li key={i}>
                            <Link href={link.url} className="text-sm text-primary hover:underline flex items-center gap-1" data-testid={`link-related-${i}`}>
                              <ChevronRight className="w-3 h-3 flex-shrink-0" />{link.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Our Centres
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {[
                          { name: "Manpada", url: "/preschool-in-manpada-thane" },
                          { name: "Hariniwas", url: "/preschool-in-hariniwas-thane" },
                          { name: "Anand Nagar", url: "/preschool-in-anand-nagar-thane" },
                          { name: "Dhokali", url: "/preschool-in-dhokali-thane" },
                          { name: "Kalwa", url: "/preschool-in-kalwa-thane" },
                          { name: "Kasarvadavali", url: "/preschool-in-kasarvadavali-thane" },
                        ].map((centre, i) => (
                          <li key={i}>
                            <Link href={centre.url} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1" data-testid={`link-centre-${i}`}>
                              <MapPin className="w-3 h-3 flex-shrink-0" />{centre.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            </div>
          </div>
        </article>
        <section className="py-10 md:py-12 bg-gray-50 dark:bg-gray-800/50 mt-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">Explore Rainbow Preschool</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="/best-preschool-near-me-in-thane" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-holi-best-preschool">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Award-Winning Preschool</span>
              </Link>
              <Link href="/play-school-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-holi-near-me">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Find Nearest Centre</span>
              </Link>
              <Link href="/gallery" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-holi-gallery">
                <Images className="w-5 h-5 text-primary" />
                <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Photo Gallery</span>
              </Link>
              <Link href="/preschool-admissions" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-holi-admissions">
                <ClipboardList className="w-5 h-5 text-primary" />
                <span className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">Admission Process</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <section className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-blue-200/60 bg-blue-50/30">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">Part of Rainbow Group</p>
            <h3 className="text-lg font-semibold mb-2">Continue the Journey with Rainbow International School</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Looking ahead to primary and secondary education? Our sister institution, <a href="https://rainbowinternationalschool.in" target="_blank" rel="noopener" className="text-blue-600 font-medium hover:underline">Rainbow International School</a>, offers a seamless CBSE-affiliated K–12 pathway from Nursery to Class 12 in Thane West.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="https://rainbowinternationalschool.in/pre-primary-school-thane" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-holi-ris-preprimary">Pre-Primary</a>
              <a href="https://rainbowinternationalschool.in/primary-section" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-holi-ris-primary">Primary School</a>
              <a href="https://rainbowinternationalschool.in/curriculum" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-holi-ris-curriculum">CBSE Curriculum</a>
              <a href="https://rainbowinternationalschool.in/contact-us" target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid="link-holi-ris-admissions">Admissions</a>
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}