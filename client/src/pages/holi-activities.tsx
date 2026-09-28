import { useState } from "react";
import { Link } from "wouter";
import { SEO } from "@/components/seo";
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
import { HOLI_COPY, HOLI_HELPFUL_LINKS, HOLI_IMAGES, HOLI_QUOTES, HOLI_RELATED_ARTICLES, HOLI_SAFETY_TIPS, HOLI_SCHOOL_COPY, HOLI_SCHOOL_HOME, HOLI_SCHOOL_LINKS, HOLI_SLOGANS_EN, HOLI_SLOGANS_HI, HOLI_SOCIAL_IDEAS, HOLI_TOC } from "@shared/holi-activities-content";

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
      <SEO
        title="Holi Activities for Kids | Rainbow Preschool Thane"
        description="Complete guide to Holi activities for kids: history, speeches, essays, images & safe celebration tips. Free resources from Rainbow Preschool, Thane."
        keywords="holi activities for kids, holi speech in english, holi essay in english, happy holi images download, holi celebration in school, holi activities for preschoolers, holi speech in hindi, holi essay in hindi, holi speech in marathi, holi 2026, safe holi tips, holi slogans, holi quotes, festival of colors activities, holi craft ideas for kids, rainbow preschool thane"
        canonical="https://www.rainbowpreschools.com/holi-activities-for-kids"
        ogType="article"
        ogImage="https://www.rainbowpreschools.com/images/holi/holi-img-1.webp"
        noIndex={false}
      />
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
                {HOLI_COPY.heroDescriptionBeforeLink}<Link href="/about" className="text-primary underline hover:text-primary/80">Rainbow Preschool International</Link>{HOLI_COPY.heroDescriptionAfterLink}
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
                        {HOLI_TOC.map((item) => (
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
                    <p>{HOLI_COPY.history[0]}</p>
                    
                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">The Story of Prahlad and Holika</h3>
                    <p>{HOLI_COPY.history[1]}</p>
                    <p>{HOLI_COPY.history[2]}</p>
                    <ul className="space-y-2 mt-3">
                      <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>{HOLI_COPY.history[3]}</span></li>
                      <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>{HOLI_COPY.history[4]}</span></li>
                    </ul>
                    <p className="mt-4">This event symbolizes:</p>
                    <ul className="space-y-2 mt-2">
                      <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>{HOLI_COPY.history[5]}</span></li>
                      <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>{HOLI_COPY.history[6]}</span></li>
                      <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" /><span>{HOLI_COPY.history[7]}</span></li>
                    </ul>
                    <p className="mt-4">{HOLI_COPY.history[8]}</p>
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
                      <p className="mb-2">{HOLI_COPY.activitiesDescription}</p>
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
                        {HOLI_COPY.englishSpeech.map((paragraph, index) => <p key={paragraph} className={index === 0 ? "italic font-medium text-foreground" : index === HOLI_COPY.englishSpeech.length - 1 ? "font-medium text-foreground" : undefined}>{paragraph}</p>)}
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
                      {HOLI_COPY.hindiSpeech.map((paragraph, index) => <p key={paragraph} className={index === 0 ? "italic font-medium text-foreground" : index === HOLI_COPY.hindiSpeech.length - 1 ? "font-medium text-foreground" : undefined}>{paragraph}</p>)}
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
                      {HOLI_COPY.marathiSpeech.map((paragraph, index) => <p key={paragraph} className={index === 0 ? "italic font-medium text-foreground" : index === HOLI_COPY.marathiSpeech.length - 1 ? "font-medium text-foreground" : undefined}>{paragraph}</p>)}
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
                        {HOLI_COPY.englishEssay.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
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
                      {HOLI_COPY.hindiEssay.map((paragraph, index) => <p key={paragraph} className={index === HOLI_COPY.hindiEssay.length - 1 ? "font-medium text-foreground" : undefined}>{paragraph}</p>)}
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
                      {HOLI_COPY.marathiEssay.map((paragraph, index) => <p key={paragraph} className={index === HOLI_COPY.marathiEssay.length - 1 ? "font-medium text-foreground" : undefined}>{paragraph}</p>)}
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
                        {HOLI_SLOGANS_EN.map((slogan, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-md border text-sm text-muted-foreground">
                            "{slogan}"
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Holi Slogans in Hindi</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {HOLI_SLOGANS_HI.map((slogan, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-md border text-sm text-muted-foreground">
                            "{slogan}"
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Inspirational Holi Quotes</h3>
                      <div className="space-y-3">
                        {HOLI_QUOTES.map((quote, i) => (
                          <blockquote key={i} className="border-l-4 border-primary pl-4 py-2 text-muted-foreground italic">
                            "{quote}"
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
                    {HOLI_COPY.imageIntro}
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {HOLI_IMAGES.map((image, index) => (
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
                    {HOLI_SOCIAL_IDEAS.map((idea) => (
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
                    <p>{HOLI_COPY.safetyIntro}</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {HOLI_SAFETY_TIPS.map((tip, i) => (
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
                    {HOLI_HELPFUL_LINKS.map((link, i) => (
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
                    {HOLI_COPY.faq.map((faq, index) => (
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
                        {HOLI_RELATED_ARTICLES.map((link, i) => (
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
              <Link href="/play-school-near-me" className="flex flex-col items-center gap-1.5 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-center" data-testid="link-holi-best-preschool">
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
              Looking ahead to primary and secondary education? {HOLI_SCHOOL_COPY.beforeLink} <a href={HOLI_SCHOOL_HOME.url} target="_blank" rel="noopener" className="text-blue-600 font-medium hover:underline">{HOLI_SCHOOL_HOME.label}</a>{HOLI_SCHOOL_COPY.afterLink}
            </p>
            <div className="flex flex-wrap gap-2">
              {HOLI_SCHOOL_LINKS.map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noopener" className="text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1 font-medium hover:bg-blue-200 transition-colors" data-testid={link.testId}>{link.label}</a>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
}