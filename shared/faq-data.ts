/**
 * Canonical FAQ content for Rainbow Preschool International.
 *
 * Used by:
 *  - server/ssr-pages.ts  → FAQPage JSON-LD injected into raw HTML (Google sees it without JS)
 *  - client/src/pages/faqs.tsx → UI rendering (icon / colour metadata added client-side)
 *
 * Edit questions/answers here; both SSR schema and client page update automatically.
 */

export interface SharedFAQ {
  question: string;
  answer: string;
  relatedLink?: { text: string; url: string };
}

export interface SharedFAQCategory {
  title: string;
  faqs: SharedFAQ[];
}

export const FAQ_CATEGORIES: SharedFAQCategory[] = [
  {
    title: "Admissions & Registration",
    faqs: [
      {
        question: "What is the admission process at Rainbow Preschool?",
        answer: "Admissions are open year-round. The process involves: 1) Select your preferred programme and centre, 2) Schedule a campus visit, 3) Fill out the admission form, 4) Submit required documents (birth certificate, photos, Aadhaar, address proof, immunisation records), 5) Complete enrollment. Call 82915 68972 or visit any of our 6 centres to start.",
        relatedLink: { text: "View Admission Guide", url: "/preschool-admissions" },
      },
      {
        question: "What age groups do you accept?",
        answer: "We accept children from 1.5 to 6 years of age. Our programmes are: Playgroup (1.5-2.5 years), Nursery (2.5–3.5 years), and Kindergarten / Jr. KG / Sr. KG (3.5–5.5 years). We also offer Happy Times extended care for ages 2-10.",
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
    faqs: [
      {
        question: "How many centres does Rainbow Preschool have in Thane?",
        answer: "We operate 6 centres across Thane: Manpada (Ghodbunder Road), Hariniwas (Naupada), Anand Nagar (Majiwada), Dhokali (Kolshet Road), Kalwa, and Kasarvadavali (Ghodbunder Road). All centres maintain the same high standards of quality.",
        relatedLink: { text: "Find a Centre Near You", url: "/play-school-near-me" },
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

/**
 * Pre-flattened list of { question, answer } pairs across all categories.
 * Used by server/ssr-pages.ts to build the FAQPage JSON-LD schema at module load.
 */
export const FAQ_SCHEMA_ITEMS: Array<{ question: string; answer: string }> =
  FAQ_CATEGORIES.flatMap(cat => cat.faqs.map(f => ({ question: f.question, answer: f.answer })));
