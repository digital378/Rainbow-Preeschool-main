/** The same ten nursery FAQ answers serve the visitor and crawler pages. */
export interface NurseryFAQ {
  question: string;
  answerSegments: readonly { text: string; href?: string }[];
}

export const NURSERY_FAQS: readonly NurseryFAQ[] = [
  {
    question: "Where can I find a good nursery school near me in Thane?",
    answerSegments: [
      { text: "Rainbow Preschool International has 6 nursery centres across Thane: Manpada, Hariniwas (Panchpakhadi), Anand Nagar, Dhokali, Kalwa and Kasarvadavali. They offer a play-based curriculum for children aged 2.5 to 3.5 years. You can " },
      { text: "find your nearest centre", href: "/play-school-near-me" },
      { text: " and ask our team about arranging a visit." },
    ],
  },
  {
    question: "What is the nursery school admission process at Rainbow Preschool Thane?",
    answerSegments: [
      { text: "The five steps are enquiry, a free centre visit, a relaxed parent–child interaction, submitting documents and the admission fee, then 2–3 short orientation sessions before term. Enquire using the form or call 82915 68972; the admissions team will call within 24 hours. Read more about the " },
      { text: "admission process", href: "/preschool-admissions" },
      { text: "." },
    ],
  },
  {
    question: "What is the right age for nursery school in Thane?",
    answerSegments: [
      { text: "Nursery is for children aged 2.5 to 3.5 years, counted as of 1 June of the academic year. For 2027-28, your child should be 2.5–3.5 years old on 1 June 2027. The programme introduces phonics, number recognition and creative activities as children grow in confidence, independence and friendships. See " },
      { text: "admission details", href: "/preschool-admissions" },
      { text: "." },
    ],
  },
  {
    question: "How is nursery different from playgroup?",
    answerSegments: [
      { text: "Playgroup gives younger children a first experience of routine, friendships and learning through play. Nursery, for ages 2.5 to 3.5, builds on the social and sensory skills they gained there and introduces a little more structure through phonics, number recognition and creative activities. Learn about our " },
      { text: "playgroup", href: "/playgroup" },
      { text: " programme." },
    ],
  },
  {
    question: "What will my child learn in nursery class?",
    answerSegments: [
      { text: "The nursery curriculum introduces pre-reading and pre-writing through phonics, number recognition and creative activities. Children explore letter recognition, numbers 1–20, early writing, art, motor skills, social skills and stories through play. The aim is to help children grow in confidence and independence and enjoy learning as they prepare for " },
      { text: "Kindergarten", href: "/kindergarten" },
      { text: "." },
    ],
  },
  {
    question: "What does a typical day at Rainbow Nursery look like?",
    answerSegments: [
      { text: "The morning batch runs from 8:30 to 11:30 AM and the afternoon batch from 12:30 to 3:30 PM, Monday to Friday. Both follow the same routine, with circle time, phonics and language, number activities, snack time, art and craft, outdoor play, then story time and music. Find " },
      { text: "your nearest centre", href: "/play-school-near-me" },
      { text: " to ask about the batches." },
    ],
  },
  {
    question: "Is the nursery environment safe for my child?",
    answerSegments: [
      { text: "CCTV-monitored classrooms are in place at all 6 Rainbow centres. Teaching staff are 100% female and have ECCE training, and classrooms are sanitised multiple times daily. The student–teacher ratio is 30:2. These confirmed measures support a cared-for learning environment while children take part in their daily nursery activities. Details are available for all " },
      { text: "6 centres", href: "/play-school-near-me" },
      { text: "." },
    ],
  },
  {
    question: "How does nursery prepare my child for kindergarten?",
    answerSegments: [
      { text: "Nursery introduces phonics, number recognition and creative activities through play, while children build confidence, independence and friendships. Our goal is for children to enjoy learning and be ready for " },
      { text: "Kindergarten", href: "/kindergarten" },
      { text: ". The programme is for children aged 2.5 to 3.5 years, counted as of 1 June of the academic year." },
    ],
  },
  {
    question: "Do you provide regular updates on my child's progress?",
    answerSegments: [
      { text: "Yes. Nursery families receive daily parent updates and monthly progress reports. These keep parents informed about their child's time at the centre and progress through the programme. For questions about updates or your preferred centre, contact the admissions team using the enquiry form or call " },
      { text: "82915 68972", href: "tel:8291568972" },
      { text: "." },
    ],
  },
  {
    question: "How can I enquire about nursery admission in Thane?",
    answerSegments: [
      { text: "Use the enquiry form on this page or call " },
      { text: "82915 68972", href: "tel:8291568972" },
      { text: ". The admissions team will call you within 24 hours. You can then arrange a free centre visit, followed by a relaxed parent–child interaction, documents and the admission fee, and 2–3 short orientation sessions before term. For fees, call us for current fee details." },
    ],
  },
];

export const NURSERY_VISITOR_FAQS = NURSERY_FAQS.map((faq) => ({
  question: faq.question,
  answer: faq.answerSegments.map(({ text }) => text).join(""),
}));