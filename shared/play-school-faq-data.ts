/**
 * Canonical FAQ content for the /play-school-near-me page.
 *
 * Used by:
 *  - server/ssr-pages.ts  → FAQPage JSON-LD injected into raw HTML (Google sees it without JS)
 *  - client/src/pages/play-school-near-me.tsx → UI accordion + client-side JSON-LD
 *
 * Edit questions/answers here; both SSR schema and client page update automatically.
 */

export interface PlaySchoolFAQ {
  question: string;
  answer: string;
}

export const playSchoolFAQs: PlaySchoolFAQ[] = [
  {
    question: "How do I find the best play school near me in Thane?",
    answer: "Rainbow Preschool International has 6 centres across Thane — in Manpada, Kalwa, Anand Nagar, Dhokali, Kasarvadavali, and Hariniwas. Each centre follows a play-based early learning approach for children aged 1.5 to 2.5 years. You can call 82915 68972 to find the nearest play school to your home and schedule a free campus tour."
  },
  {
    question: "What age is right for a child to start play school?",
    answer: "Most child development experts recommend starting play school between 1.5 and 2.5 years. At this age, toddlers are naturally curious, developing language rapidly, and ready for structured social interaction. Rainbow Preschool's playgroup programme is specifically designed for this critical developmental window."
  },
  {
    question: "What is the difference between a play school and a daycare?",
    answer: "A play school focuses on structured early learning through play-based activities, social development, and school readiness. A daycare primarily provides childcare while parents are at work. At Rainbow Preschool, our play school programme includes a curriculum designed by early childhood experts that nurtures cognitive, social, emotional, and physical development."
  },
  {
    question: "What activities are included in a play school programme?",
    answer: "A quality play school programme includes circle time, rhymes and songs, art and craft, sensory play, story time, outdoor activities, music and movement, building blocks, and structured free play. At Rainbow Preschool, we also include nature exploration, role play, and early literacy and numeracy readiness activities."
  },
  {
    question: "Are play schools near me in Thane safe for toddlers?",
    answer: "At Rainbow Preschool, safety is our highest priority. All 6 centres have CCTV-enabled classrooms and campuses, 100% female teaching staff, child-proofed furniture, daily sanitisation of toys and surfaces, and secure entry/exit systems. We maintain small batch sizes of 10-12 children for individual attention and close supervision."
  },
  {
    question: "What are the timings for play school?",
    answer: "Rainbow Preschool offers two batch options for our play school programme: Morning Batch from 8:30 AM to 11:30 AM, and Afternoon Batch from 12:30 PM to 3:30 PM. This gives parents flexibility to choose a schedule that suits their routine."
  },
  {
    question: "How much does play school cost in Thane?",
    answer: "Play school fees in Thane vary depending on the programme and centre location. Rainbow Preschool offers competitive and transparent pricing with no hidden charges. Contact us at 82915 68972 or fill out the enquiry form on this page for detailed fee information and current admission offers."
  },
  {
    question: "Why is Rainbow Preschool considered a top playschool in Mumbai region?",
    answer: "Rainbow Preschool International has been awarded by India Today, ScooNews Global Edu Awards, the Economic Times, and the National School Awards. With 18+ years of experience, 100,000+ happy alumni, 6 centres across Thane, and a proven play-based curriculum, Rainbow is consistently recognised as one of the best preschools in the Mumbai Metropolitan Region."
  },
  {
    question: "Can I visit the play school before enrolling my child?",
    answer: "Absolutely! We encourage all parents to visit our centres before making a decision. You can schedule a free campus visit at any of our 6 Thane centres by calling 82915 68972 or submitting an enquiry on this page. During the visit, you'll meet our teachers, see the classrooms, and understand our daily routine."
  },
  {
    question: "What should I look for when choosing a play school near me?",
    answer: "When searching for a play school near you, evaluate these key factors: safety and hygiene standards, curriculum approach (play-based is recommended), teacher qualifications and batch size, location convenience, reputation and awards, and parent communication practices. Rainbow Preschool scores highly on all these parameters with its 18+ year track record."
  },
  {
    question: "Which Rainbow Preschool is nearest to Ghodbunder Road?",
    answer: "Families on Ghodbunder Road have two Rainbow centres to choose from: the Kasarvadavali centre at Rosa Gardenia, behind Hypercity Mall — ideal for upper Ghodbunder Road, Brahmand and Hiranandani Meadows residents — and the Manpada centre at Aggarwal Arcade near Khewra Circle, which serves Manpada, Edenwoods and Hiranandani Estate families. Call 82915 68972 to confirm which is closer to your home."
  },
  {
    question: "Is there a play school near Majiwada in Thane?",
    answer: "Yes. Rainbow Preschool's Anand Nagar centre is located at Kris Commercial Plaza, directly opposite Tropical Lagoon at Majiwada Junction, Thane West. It is the nearest Rainbow play school for families in Anand Nagar, Majiwada, Vasant Vihar, and Kapurbawdi. Visit /preschool-in-anand-nagar-thane or call 98337 81550 for details."
  },
  {
    question: "How do I find a preschool near me in Thane West?",
    answer: "Rainbow Preschool runs 6 centres across Thane West: Manpada (Ghodbunder Road), Hariniwas Circle (Naupada/Panchpakadi), Anand Nagar (Majiwada), Dhokali (Kolshet Road), and Kasarvadavali (upper Ghodbunder Road). For Eastern Thane, our Kalwa centre serves Manisha Nagar and surrounding areas. Share your locality with our team at 82915 68972 and we will direct you to the nearest centre within minutes."
  },
  {
    question: "Which is the nearest play school to Hariniwas Circle or Panchpakadi?",
    answer: "Rainbow Preschool's Hariniwas centre, located at M.V. Apartments on Bhakti Mandir Road, opposite Thanawala Garage, is the closest Rainbow play school to Hariniwas Circle and Panchpakadi. It also serves Naupada, Charai, and Khopat families. Contact 91365 78589 to book a visit or enquire about admissions."
  },
  {
    question: "Is there a Rainbow play school near Kolshet Road or Dhokali Naka?",
    answer: "Yes. Rainbow Preschool's Dhokali centre is located directly on Kolshet Road at Dhokali Naka, opposite Aban Park Society. It is the nearest Rainbow play school for families in Dhokali, Kolshet Road, Vandana Nagar, and Balkum. Call 93212 38375 or visit /preschool-in-dhokali-thane for more information."
  },
  {
    question: "What is the difference between a 'play school near me' and a 'preschool near me'?",
    answer: "Both phrases describe the same type of early learning setting. Parents searching for a 'play school near me' or a 'preschool near me' are looking for a structured, safe environment where young children aged 1.5 to 5.5 years learn through play. At Rainbow Preschool in Thane, our Playgroup (1.5–2.5 yrs), Nursery (2.5–3.5 yrs), and Kindergarten (3.5–5.5 yrs) programmes form a complete preschool — making us your neighbourhood play school and preschool, all in one."
  },
  {
    question: "Which is the nearest preschool to me in Thane West?",
    answer: "The nearest Rainbow Preschool to you depends on your locality. Ghodbunder Road families choose Manpada (near Khewra Circle) or Kasarvadavali (behind Hypercity Mall). Central Thane families visit Hariniwas in Naupada. Majiwada families use Anand Nagar (opposite Tropical Lagoon). Kolshet Road residents use Dhokali. Eastern Thane families use Kalwa. Call 82915 68972 — our team will direct you to the nearest centre in minutes."
  },
  {
    question: "Is Rainbow the best preschool near me in Thane?",
    answer: "Rainbow Preschool International has been recognised by India Today, ScooNews Global Edu Awards, and the Economic Times as one of India's top preschools. With 18+ years of experience, a 4.9-star Google rating from 487+ parent reviews, 1,00,000+ alumni, and 6 Thane West centres, Rainbow is consistently rated the best preschool near you in Thane. Visit any centre for a free campus tour."
  },
  {
    question: "What should I look for in a preschool near me?",
    answer: "When choosing a preschool near you, evaluate: safety (CCTV-enabled classrooms, 100% female teaching staff, daily hygiene routines), curriculum approach (play-based rather than rote learning), teacher qualifications and class size (10–12 children per batch at Rainbow), location convenience, and transparent parent communication. Rainbow Preschool scores strongly on all these criteria with its 18+ year track record in Thane."
  },
  {
    question: "How quickly can my child start at a preschool near me in Thane?",
    answer: "Rainbow Preschool accepts admissions year-round on a rolling basis, subject to seat availability at the centre nearest your home. Once you submit an enquiry, our admissions team responds within 24 hours to schedule a free campus visit. Most children can begin within 1–2 weeks of completing the admission paperwork."
  },
];

/**
 * Pre-flattened list of { question, answer } pairs.
 * Used by server/ssr-pages.ts to build the FAQPage JSON-LD schema at module load.
 */
export const PLAY_SCHOOL_FAQ_SCHEMA_ITEMS: Array<{ question: string; answer: string }> =
  playSchoolFAQs.map(faq => ({
    question: faq.question,
    answer: faq.answer,
  }));
