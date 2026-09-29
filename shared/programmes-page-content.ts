/** Page metadata and FAQ copy shared by the visitor and crawler versions. */
export const PROGRAMMES_COPY = {
  title: "Preschool Programmes in Thane: Playgroup to KG | Rainbow",
  description: "Compare our playgroup (1.5–2.5), nursery (2.5–3.5) and Jr./Sr. KG (3.5–5.5) programmes at 6 Rainbow Preschool International centres in Thane, plus daycare.",
  h1: "Preschool Programmes in Thane: Playgroup, Nursery & KG",
  faqHeading: "Which Programme Is Right for My Child?",
  ogImage: "https://www.rainbowpreschools.com/images/og/programmes-share-1200x630.jpg",
  ogImageAlt: "Children at Rainbow Preschool programmes in Thane",
  publishDate: "2026-09-29",
  publishDateDisplay: "September 29, 2026",
} as const;

const BASE_URL = "https://www.rainbowpreschools.com";

export const PROGRAMMES_WEBPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE_URL}/programmes#webpage`,
  url: `${BASE_URL}/programmes`,
  name: PROGRAMMES_COPY.h1,
  description: PROGRAMMES_COPY.description,
  dateModified: PROGRAMMES_COPY.publishDate,
  publisher: { "@id": `${BASE_URL}/#organization` },
} as const;

export const PROGRAMMES_ITEMLIST_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Preschool programmes and daycare at Rainbow Preschool International",
  numberOfItems: 4,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Playgroup", url: `${BASE_URL}/playgroup` },
    { "@type": "ListItem", position: 2, name: "Nursery", url: `${BASE_URL}/nursery` },
    { "@type": "ListItem", position: 3, name: "Kindergarten", url: `${BASE_URL}/kindergarten` },
    { "@type": "ListItem", position: 4, name: "Happy Times", url: `${BASE_URL}/happy-times` },
  ],
} as const;

/** Additional comparison guidance shown in the existing programme list on both versions. */
export const PROGRAMMES_GUIDANCE = [
  "Start with your child's age on 1 June of the academic year. Playgroup is for children aged 1.5–2.5 and introduces a gentle routine through play, music, colours and new friends. Nursery is for ages 2.5–3.5. It builds on playgroup with phonics, numbers, stories, creative play and early pre-writing. These are different stages of the same preschool journey, not interchangeable age labels. If your child is between two classes, our team can guide you through the choice when you enquire or visit a centre.",
  "Kindergarten includes Jr. KG for ages 3.5–4.5 and Sr. KG for ages 4.5–5.5: the two years before Grade 1. Children work on reading, writing, maths, EVS and general knowledge as they grow towards school readiness. Like Playgroup and Nursery, both KG stages have a morning batch from 8:30 to 11:30 AM and an afternoon batch from 12:30 to 3:30 PM, Monday to Friday. Compare the age bands first, then look at what your child will learn during each stage.",
  "Across the preschool programmes, learning is play-based and aligned with NEP 2020. Our teaching staff are 100% female and ECCE-trained, and the student–teacher ratio is 30:2. Classrooms are CCTV-monitored. Rainbow Preschool International has six centres in Thane, so the programme you choose is also a chance to find a centre near your family. The activities and key features listed above show what each age group experiences; the same morning and afternoon batch times apply to Playgroup, Nursery and KG.",
  "Happy Times is daycare rather than a preschool class. It serves children aged 2–8 and runs from 8:30 AM to 7:30 PM for working parents, with one nutritious meal and engaging, supervised activities. It is offered at Aggarwal (Manpada), Anand Nagar and Dhokali, not at all six centres. Supervised play, storytime and art and craft are among the activities shown above. If you need both an age-appropriate preschool class and daycare, check the relevant programme details and the Happy Times page before sending an enquiry or arranging a centre visit.",
] as const;

export const PROGRAMMES_FAQS = [
  {
    question: "Which class should my child join based on age?",
    answerSegments: [
      { text: "Playgroup", href: "/playgroup" },
      { text: " for 1.5–2.5 years, " },
      { text: "Nursery", href: "/nursery" },
      { text: " for 2.5–3.5, " },
      { text: "Jr. KG", href: "/kindergarten" },
      { text: " for 3.5–4.5 and " },
      { text: "Sr. KG", href: "/kindergarten" },
      { text: " for 4.5–5.5. We count age as of 1 June of the academic year. If your child is between two classes, our team will guide you." },
    ],
  },
  {
    question: "What is the difference between playgroup and nursery?",
    answerSegments: [
      { text: "Playgroup (1.5–2.5) is a gentle first routine focused on play, senses and social skills. Nursery (2.5–3.5) adds early phonics, numbers and pre-writing, building on what children learn in playgroup." },
    ],
  },
  {
    question: "What do children learn in Jr. KG and Sr. KG?",
    answerSegments: [
      { text: "Jr. KG and Sr. KG", href: "/kindergarten" },
      { text: " build reading, writing, maths, EVS and general knowledge over two years, so children are confident and ready for Grade 1." },
    ],
  },
  {
    question: "What are the timings for playgroup, nursery and KG?",
    answerSegments: [
      { text: "All three run a morning batch from 8:30 to 11:30 AM and an afternoon batch from 12:30 to 3:30 PM, Monday to Friday." },
    ],
  },
  {
    question: "Do you offer daycare for working parents?",
    answerSegments: [
      { text: "Yes. " },
      { text: "Happy Times", href: "/happy-times" },
      { text: ", our daycare for children aged 2–8, runs from 8:30 AM to 7:30 PM with one nutritious meal, at our Manpada, Anand Nagar and Dhokali centres." },
    ],
  },
  {
    question: "How do I apply for admission?",
    answerSegments: [
      { text: "Send an enquiry, visit a centre, meet our team, then complete registration, documents and the admission fee. See the full process on " },
      { text: "our admissions page", href: "/preschool-admissions" },
      { text: "." },
    ],
  },
] as const;