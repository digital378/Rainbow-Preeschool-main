import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";
import { CTASection } from "@/components/cta-section";
import { BlogInternalLinks } from "@/components/blog-internal-links";
import { ChevronDown, Phone, Search, GraduationCap, Shield, DollarSign, Clock, Bus, BookOpen, Users, Heart } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
  relatedLink?: { text: string; url: string };
}

interface FAQCategory {
  title: string;
  icon: typeof GraduationCap;
  color: string;
  faqs: FAQ[];
}

const faqCategories: FAQCategory[] = [
  {
    title: "Admissions & Registration",
    icon: GraduationCap,
    color: "text-red-600 bg-red-50 border-red-200",
    faqs: [
      {
        question: "What is the admission process at Rainbow Preschool?",
        answer: "Admissions are open year-round. The process involves: 1) Select your preferred programme and centre, 2) Schedule a campus visit, 3) Fill out the admission form, 4) Submit required documents (birth certificate, photos, Aadhaar, address proof, immunisation records), 5) Complete enrollment. Call 82915 68972 or visit any of our 6 centres to start.",
        relatedLink: { text: "View Admission Guide", url: "/preschool-admissions" },
      },
      {
        question: "What age groups do you accept?",
        answer: "We accept children from 1.5 to 6 years of age. Our programmes are: Playgroup (1.5-2.5 years), Nursery (2.5-4 years), and Kindergarten / Jr. KG / Sr. KG (4-6 years). We also offer Happy Times extended care for ages 2-10.",
      },
      {
        question: "What documents are required for admission?",
        answer: "You'll need: child's birth certificate, 4-6 passport-sized photographs, Aadhaar card (child and both parents), address proof, and immunisation/vaccination record. Some centres may request a medical fitness certificate and blood group card.",
        relatedLink: { text: "Step-by-Step Admission Guide", url: "/blog/nursery-school-admission-thane-2026" },
      },
      {
        question: "Is there a waiting list? How early should I apply?",
        answer: "Popular batches (especially morning sessions) can fill up quickly. We recommend starting your search 3-6 months before your planned enrollment date. Rolling admissions are available year-round based on seat availability.",
      },
      {
        question: "Can my child join mid-year?",
        answer: "Yes, we accept mid-year admissions at all centres subject to seat availability. Your child will receive extra support during the settling-in period to help them catch up with their peers.",
      },
    ],
  },
  {
    title: "Fees & Payments",
    icon: DollarSign,
    color: "text-green-600 bg-green-50 border-green-200",
    faqs: [
      {
        question: "What is the fee structure?",
        answer: "Fees vary by programme (Playgroup, Nursery, Kindergarten) and centre location. For the latest fee structure, please contact us at 82915 68972 or visit your preferred centre. We also offer early-bird discounts and sibling concessions.",
        relatedLink: { text: "Contact for Fee Details", url: "/contact" },
      },
      {
        question: "Are instalment payment options available?",
        answer: "Yes, we offer flexible payment options including monthly, quarterly, and annual payment plans. Speak with the centre head at your preferred location to discuss the option that works best for your family.",
      },
      {
        question: "What do the fees include?",
        answer: "Fees typically include tuition, learning materials, activity supplies, events and celebrations, and use of all facilities. Some items like uniforms, field trips, and transport may be charged separately. We keep additional costs minimal.",
      },
      {
        question: "Is there a registration fee? Is it refundable?",
        answer: "There is a nominal registration fee (usually ₹500-1,000) which is adjusted against the admission fee upon enrollment. Registration fees are generally non-refundable.",
      },
    ],
  },
  {
    title: "Safety & Security",
    icon: Shield,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    faqs: [
      {
        question: "What safety measures are in place?",
        answer: "Every Rainbow Preschool centre has: 24/7 CCTV surveillance, controlled entry/exit points, verified pickup systems (only authorized persons can collect your child), 100% female teaching staff, first-aid trained staff, fire safety equipment, and child-proofed facilities with rounded furniture edges and covered electrical outlets.",
      },
      {
        question: "How is the pickup/drop-off process managed?",
        answer: "We follow a strict verified pickup protocol. Only persons listed on your child's authorized pickup form can collect them. Staff verify identity at pickup. Any changes to the pickup person must be communicated in advance by the parent.",
      },
      {
        question: "What happens in case of a medical emergency?",
        answer: "All staff are trained in basic first aid. Every centre has a well-stocked first-aid kit. For emergencies, we immediately contact parents and, if necessary, take the child to the nearest hospital. We keep emergency contact details and medical information on file for every child.",
      },
      {
        question: "Are all staff background-verified?",
        answer: "Yes, every staff member undergoes rigorous background verification before joining. Our 100% female teaching staff are ECE and Montessori certified, providing an additional layer of comfort for parents.",
      },
    ],
  },
  {
    title: "Curriculum & Learning",
    icon: BookOpen,
    color: "text-purple-600 bg-purple-50 border-purple-200",
    faqs: [
      {
        question: "What curriculum does Rainbow Preschool follow?",
        answer: "We follow a play-based, activity-driven curriculum that covers all five developmental domains: cognitive, social, emotional, physical, and language development. Activities include literacy, numeracy, science awareness, creative arts, music, yoga, dance, and physical education. Our teachers are ECE and Montessori certified.",
        relatedLink: { text: "Learn About Our Programmes", url: "/programmes" },
      },
      {
        question: "Is it play-based or academic? Will my child learn to read and write?",
        answer: "Our approach is primarily play-based because research shows this is how young children learn best. However, academic skills like letter recognition, phonics, counting, and pre-writing are woven into play activities. By Kindergarten, most children can read simple words, write their name, and do basic maths.",
        relatedLink: { text: "Play-Based Learning Benefits", url: "/blog/how-play-based-learning-shapes-young-minds" },
      },
      {
        question: "How do you assess children's progress?",
        answer: "We use continuous observation and documentation rather than formal tests. Teachers track developmental milestones across all domains. Parents receive regular progress updates and detailed reports during parent-teacher meetings (held at least quarterly).",
      },
      {
        question: "What languages are used for instruction?",
        answer: "Primary instruction is in English. Hindi is introduced through songs, stories, and conversation. We believe in building a strong foundation in both languages while respecting the multilingual nature of Indian families.",
      },
    ],
  },
  {
    title: "Daily Routine & Timings",
    icon: Clock,
    color: "text-amber-600 bg-amber-50 border-amber-200",
    faqs: [
      {
        question: "What are the school timings?",
        answer: "All centres operate Monday to Saturday, 8:00 AM to 6:00 PM. Both half-day and full-day options are available. Morning and afternoon batches can be discussed based on availability at your preferred centre.",
      },
      {
        question: "What does a typical day look like?",
        answer: "A typical day includes: Welcome circle (songs, attendance), free play / learning station time, structured activity (literacy, numeracy, or theme-based), outdoor play, snack time, creative arts or music, story time, and goodbye circle. The schedule is adjusted for each age group.",
      },
      {
        question: "What should my child bring to school?",
        answer: "Children should bring: a labelled water bottle, a healthy snack/tiffin, a change of clothes (especially for younger children), and any comfort items for the first few weeks if needed. All belongings should be labelled with the child's name.",
      },
      {
        question: "What is the policy for holidays and closures?",
        answer: "We follow a structured academic calendar with breaks for major festivals and public holidays. The annual calendar is shared with parents at the beginning of the year. We also close during some Sundays and second Saturdays.",
      },
    ],
  },
  {
    title: "Transport",
    icon: Bus,
    color: "text-teal-600 bg-teal-50 border-teal-200",
    faqs: [
      {
        question: "Does Rainbow Preschool offer transport?",
        answer: "Some centres offer CCTV-enabled transport with trained female attendants. Transport availability and routes vary by centre. Contact your preferred centre to check if transport is available for your area.",
      },
      {
        question: "Is the transport safe?",
        answer: "Where available, our transport vehicles are equipped with CCTV cameras, GPS tracking, and trained attendants. The driver and attendant are both verified staff members. Vehicles are regularly maintained and inspected.",
      },
    ],
  },
  {
    title: "Settling In & Adjustment",
    icon: Heart,
    color: "text-rose-600 bg-rose-50 border-rose-200",
    faqs: [
      {
        question: "How do you help new children adjust?",
        answer: "We follow a gradual settling-in process. For the first few days, sessions may be shorter and parents can stay nearby. Teachers give extra attention and comfort to new children. Most children fully adjust within 2-4 weeks. We communicate regularly with parents during this period.",
        relatedLink: { text: "Tips for First Day", url: "/blog/preparing-your-child-for-first-day-preschool" },
      },
      {
        question: "My child has separation anxiety. What should I do?",
        answer: "Separation anxiety is completely normal, especially for children starting preschool for the first time. Our teachers are trained to handle it with patience and warmth. Tips: keep goodbyes brief, maintain a positive attitude, stay consistent with attendance, and trust the process. Most children stop crying within minutes of parents leaving.",
      },
      {
        question: "Can parents stay during the first few days?",
        answer: "Yes, during the initial settling-in period, parents are welcome to stay at the centre (though not in the classroom) for the first few days. This is gradually reduced as the child becomes more comfortable.",
      },
      {
        question: "How will I know how my child is doing?",
        answer: "We provide daily updates on your child's activities and wellbeing. During the first week, teachers may call or message you to reassure you. Regular parent-teacher meetings give you detailed insights into your child's progress.",
      },
    ],
  },
  {
    title: "Centres & Locations",
    icon: Users,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    faqs: [
      {
        question: "How many centres does Rainbow Preschool have in Thane?",
        answer: "We operate 6 centres across Thane: Manpada (Ghodbunder Road), Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, and Kasarvadavali (Ghodbunder Road). All centres maintain the same high standards of quality.",
        relatedLink: { text: "Find a Centre Near You", url: "/preschool-near-me" },
      },
      {
        question: "Are all centres the same quality?",
        answer: "Yes, all 6 centres follow the same curriculum, safety standards, teacher qualifications, and operational protocols. While facilities may differ slightly in layout, the quality of education and care is consistent across all locations.",
      },
      {
        question: "Can I visit a centre before enrolling?",
        answer: "Absolutely! We encourage all parents to visit and experience our centres firsthand. You can schedule a visit by calling 82915 68972 or visiting any centre during operating hours (Monday-Saturday, 8 AM-6 PM).",
      },
    ],
  },
];

const allFAQs = faqCategories.flatMap(cat => cat.faqs);

function FAQSchema() {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": allFAQs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    script.id = "faq-hub-schema";
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById("faq-hub-schema");
      if (el) el.remove();
    };
  }, []);
  return null;
}

function FAQItem({ faq, isOpen, onToggle, id }: { faq: FAQ; isOpen: boolean; onToggle: () => void; id: string }) {
  const panelId = `faq-panel-${id}`;
  const buttonId = `faq-btn-${id}`;
  return (
    <div className="border-b last:border-b-0">
      <button
        id={buttonId}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-start justify-between gap-4 py-4 text-left hover:bg-gray-50/50 transition-colors"
        data-testid={`faq-toggle-${id}`}
      >
        <span className="text-sm sm:text-base font-medium text-gray-900 leading-snug">{faq.question}</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-4 pr-8">
          <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
          {faq.relatedLink && (
            <Link href={faq.relatedLink.url} className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium mt-2" data-testid={`faq-link-${id}`}>
              {faq.relatedLink.text} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function FAQs() {
  const [openFAQs, setOpenFAQs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFAQ = (key: string) => {
    setOpenFAQs(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredCategories = searchQuery.trim()
    ? faqCategories.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(
          faq =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(cat => cat.faqs.length > 0)
    : faqCategories;

  return (
    <article className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <SEO
        title="FAQs | Rainbow Preschool International Thane"
        description="Get answers to all your questions about Rainbow Preschool — admissions, fees, safety, curriculum, timings, transport, and more. Complete FAQ for Thane parents."
        keywords="rainbow preschool faq, preschool questions thane, preschool admission faq, preschool fees thane, preschool safety questions, preschool curriculum questions"
        canonical="https://www.rainbowpreschools.com/faqs"
      />
      <FAQSchema />

      <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-sm font-semibold rounded-full mb-4" data-testid="faq-badge">
            {allFAQs.length} Questions Answered
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Rainbow Preschool International. Can't find your answer? Call us at 82915 68972.
          </p>
        </div>

        <div className="relative mb-8">
          <label htmlFor="faq-search" className="sr-only">Search frequently asked questions</label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            id="faq-search"
            type="text"
            placeholder="Search questions... (e.g., fees, safety, timings)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 text-sm"
            data-testid="faq-search-input"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {faqCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.title}
                href={`#faq-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${cat.color} hover:shadow-sm transition-shadow`}
                data-testid={`faq-jump-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Icon className="w-3 h-3" />
                {cat.title}
              </a>
            );
          })}
        </div>

        <div className="space-y-8">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Card key={cat.title} className="border shadow-sm overflow-hidden" id={`faq-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className={`px-5 py-3 border-b flex items-center gap-2 ${cat.color.split(" ").slice(1).join(" ")}`}>
                  <Icon className={`w-4 h-4 ${cat.color.split(" ")[0]}`} />
                  <h2 className={`text-sm font-semibold ${cat.color.split(" ")[0]}`}>{cat.title}</h2>
                  <span className="text-xs text-muted-foreground ml-auto">{cat.faqs.length} questions</span>
                </div>
                <CardContent className="px-5 py-0">
                  {cat.faqs.map((faq, i) => {
                    const key = `${cat.title}-${i}`;
                    return (
                      <FAQItem
                        key={key}
                        faq={faq}
                        isOpen={openFAQs.has(key)}
                        onToggle={() => toggleFAQ(key)}
                        id={key.replace(/\s+/g, "-").toLowerCase()}
                      />
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No questions match your search.</p>
            <Button variant="outline" onClick={() => setSearchQuery("")} data-testid="faq-clear-search">
              Clear Search
            </Button>
          </div>
        )}

        <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Still Have Questions?</h3>
          <p className="text-muted-foreground text-sm mb-4">
            We're happy to help! Reach out to us and we'll answer any questions you have about our programmes, centres, or admissions.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact">
              <Button className="bg-red-600 hover:bg-red-700 text-white gap-2" data-testid="faq-cta-contact">
                <Phone className="w-4 h-4" />
                Call 82915 68972
              </Button>
            </Link>
            <Link href="/preschool-admissions">
              <Button variant="outline" className="gap-2" data-testid="faq-cta-admissions">
                <GraduationCap className="w-4 h-4" />
                View Admissions
              </Button>
            </Link>
          </div>
        </div>

        <BlogInternalLinks currentSlug="faqs" />
      </section>

      <CTASection />
    </article>
  );
}
