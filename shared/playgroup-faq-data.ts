/** The same ten FAQ questions and answer segments serve the visitor and bot pages. */
export interface PlaygroupFAQ {
  question: string;
  answerSegments: readonly { text: string; href?: string }[];
}

export const PLAYGROUP_FAQS: PlaygroupFAQ[] = [
  {
    question: "Where can I find a good playgroup near me in Thane?",
    answerSegments: [
      { text: "Rainbow Preschool International has 6 playgroup centres across Thane: Manpada, Hariniwas (Panchpakhadi), Anand Nagar, Dhokali, Kalwa and Kasarvadavali. They offer a play-based curriculum for children aged 1.5 to 2.5 years. You can " },
      { text: "find your nearest centre", href: "/play-school-near-me" },
      { text: " and ask our team about arranging a visit." },
    ],
  },
  {
    question: "What is the playgroup admission process at Rainbow Preschool Thane?",
    answerSegments: [
      { text: "Start with an enquiry, then visit a centre to meet the team and learn about the playgroup. Registration, the required documents and the admission fee are covered during the " },
      { text: "admission process", href: "/preschool-admissions" },
      { text: ". If you have questions about the current fee, call us for current fee details before you register." },
    ],
  },
  {
    question: "What is the right age for playgroup in Thane?",
    answerSegments: [
      { text: "Playgroup is for children aged 1.5 to 2.5 years, counted as of 1 June of the academic year. It is a gentle first step into routine, friendships and learning through play. Children practise sharing, taking turns and exploring with others before moving on to the " },
      { text: "nursery programme", href: "/nursery" },
      { text: "." },
    ],
  },
  {
    question: "Is the playgroup safe for my toddler?",
    answerSegments: [
      { text: "Our 6 Thane centres have CCTV-monitored classrooms and 100% female teaching staff with ECCE training. Toys, surfaces and classrooms are sanitised multiple times daily. Our playgroup follows a 30:2 student–teacher ratio, so children receive individual attention during their daily activities in a caring setting." },
    ],
  },
  {
    question: "What will my child learn in playgroup?",
    answerSegments: [
      { text: "Our play-based curriculum nurtures social interaction, sensory exploration, language and motor skills. Through planned activities such as circle time, music, stories and outdoor play, toddlers learn to share, take turns and build confidence. The curriculum is aligned with NEP 2020 and prepares children for the next stage, " },
      { text: "nursery", href: "/nursery" },
      { text: "." },
    ],
  },
  {
    question: "How is playgroup different from informal childcare?",
    answerSegments: [
      { text: "Our playgroup offers a planned, play-based curriculum aligned with NEP 2020 for children aged 1.5 to 2.5 years. ECCE-trained female teachers guide activities that support social interaction, sensory exploration and motor skills. Families also receive daily parent updates and monthly progress reports about their child's time at playgroup." },
    ],
  },
  {
    question: "What does a typical day at Rainbow Playgroup look like?",
    answerSegments: [
      { text: "The morning batch is 8:30 to 11:30 AM and the afternoon batch is 12:30 to 3:30 PM, Monday to Friday. Both follow a gentle routine with a welcome circle, free play, rhymes, snack time, learning activities, outdoor play and stories before goodbye. Activities support learning through play." },
    ],
  },
  {
    question: "How does playgroup prepare my child for nursery school?",
    answerSegments: [
      { text: "Playgroup helps toddlers get used to a gentle routine and spending time with other children. Through play, they practise language, motor skills, sharing and taking turns. These everyday experiences build confidence and provide a foundation for " },
      { text: "nursery school", href: "/nursery" },
      { text: ", the next stage of early learning for older children." },
    ],
  },
  {
    question: "Do parents need to stay during playgroup sessions?",
    answerSegments: [
      { text: "Please ask the team at your preferred centre about its arrangements for parents during playgroup sessions. You can use the enquiry form on this page or call " },
      { text: "82915 68972", href: "tel:+918291568972" },
      { text: ". Our playgroup is designed as a gentle first step into learning, routine and friendships for young children." },
    ],
  },
  {
    question: "How can I enquire about playgroup admission in Thane?",
    answerSegments: [
      { text: "Call " },
      { text: "82915 68972", href: "tel:+918291568972" },
      { text: " or use the enquiry form on this page to ask about playgroup admission. Let us know which of our 6 Thane centres is convenient for your family: Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa or Kasarvadavali. For fees, call us for current fee details." },
    ],
  },
];