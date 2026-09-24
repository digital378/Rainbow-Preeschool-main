export const testimonialsSEO = {
  title: "Parent Testimonials | Rainbow Preschool International Thane",
  description: "Parents across Thane trust Rainbow Preschool for safe, play-based early learning across 6 centres.",
  h1: "What Parents Say About Rainbow Preschool",
  intro: "Real stories from real families. Hear from parents across our 6 centres in Thane about their experience with Rainbow Preschool International.",
};

export interface Testimonial {
  id: number;
  /** Must stay as "A Rainbow Parent" per the org-only attribution rule. */
  name: string;
  centre: string;
  programme: string;
  rating: number;
  text: string;
  childAge?: string;
}

export const testimonials: Testimonial[] = [
  { id: 1, name: "A Rainbow Parent", centre: "Manpada", programme: "Nursery", rating: 5, text: "My daughter's transformation at Rainbow Preschool has been remarkable. She was extremely shy when she started, and within 3 months she was confidently participating in group activities and making friends. The teachers are patient, loving, and truly understand children. Best decision we made as parents.", childAge: "3 years" },
  { id: 2, name: "A Rainbow Parent", centre: "Hariniwas", programme: "Playgroup", rating: 5, text: "We were nervous about sending our 1.5-year-old to playgroup, but Rainbow's settling-in process was so gentle. The small batch size means our son gets individual attention, and the daily updates keep us connected. He now runs to school every morning!", childAge: "2 years" },
  { id: 3, name: "A Rainbow Parent", centre: "Dhokali", programme: "Kindergarten", rating: 5, text: "Both my children went through Rainbow, and I can confidently say this is the best preschool in Thane. The play-based curriculum actually works — my son could read simple words before starting Class 1. The teachers made learning so enjoyable that he didn't even realise he was studying.", childAge: "5 years" },
  { id: 4, name: "A Rainbow Parent", centre: "Anand Nagar", programme: "Nursery", rating: 5, text: "What sets Rainbow apart is their 100% female staff and the genuine warmth they show. As a father, safety was my top concern, and the CCTV monitoring, verified pickup system, and secure premises give me complete peace of mind. My daughter loves her teachers.", childAge: "3.5 years" },
  { id: 5, name: "A Rainbow Parent", centre: "Kalwa", programme: "Playgroup", rating: 5, text: "Being a working mother, I needed a preschool I could trust completely. Rainbow's Happy Times extended care programme has been a lifesaver. My son gets quality education during the day and engaging activities in the evening. The teachers are like family.", childAge: "2.5 years" },
  { id: 6, name: "A Rainbow Parent", centre: "Kasarvadavali", programme: "Kindergarten", rating: 5, text: "We compared over 10 preschools before choosing Rainbow, and we're so glad we did. The curriculum is well-structured, the facilities are excellent, and the teachers are genuinely passionate about children. Our daughter's confidence, vocabulary, and social skills have grown tremendously.", childAge: "4.5 years" },
  { id: 7, name: "A Rainbow Parent", centre: "Manpada", programme: "Nursery", rating: 4, text: "Rainbow Preschool's Manpada centre is conveniently located and well-maintained. My son has learned so much in just 6 months — colours, numbers, alphabets, and most importantly, how to share and make friends. The annual day celebration was thoroughly enjoyable.", childAge: "3 years" },
  { id: 8, name: "A Rainbow Parent", centre: "Dhokali", programme: "Playgroup", rating: 5, text: "As a paediatrician, I was particular about the developmental approach. Rainbow's play-based curriculum aligns perfectly with what research says about early childhood learning. My daughter is thriving — her language development has been remarkable since she started.", childAge: "2 years" },
  { id: 9, name: "A Rainbow Parent", centre: "Hariniwas", programme: "Kindergarten", rating: 5, text: "Three years at Rainbow and we couldn't be happier. The transition from Playgroup to Nursery to KG was seamless. Our son is completely ready for primary school — academically, socially, and emotionally. Thank you, Rainbow team, for giving him such a strong foundation.", childAge: "5.5 years" },
  { id: 10, name: "A Rainbow Parent", centre: "Anand Nagar", programme: "Nursery", rating: 5, text: "What I appreciate most about Rainbow is how they handle every child as an individual. My daughter has food allergies, and the staff have been incredibly accommodating and careful. Communication with parents is excellent — I always feel informed and involved.", childAge: "3 years" },
  { id: 11, name: "A Rainbow Parent", centre: "Kasarvadavali", programme: "Playgroup", rating: 5, text: "We moved to Thane recently and were worried about finding a good preschool. Rainbow's Kasarvadavali centre exceeded our expectations. The teachers welcomed our son with so much warmth, and he adjusted within just one week. The facilities are top-notch.", childAge: "2 years" },
  { id: 12, name: "A Rainbow Parent", centre: "Kalwa", programme: "Nursery", rating: 5, text: "I'm a teacher myself, so I know what quality education looks like. Rainbow Preschool Kalwa delivers it consistently. The activities are thoughtfully planned, the classrooms are engaging, and the teachers create a genuinely loving atmosphere. Highly recommended to all parents in East Thane.", childAge: "3.5 years" },
];