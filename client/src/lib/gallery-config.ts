export type GalleryCategoryId =
  | "all"
  | "classrooms"
  | "activities"
  | "events"
  | "happy-times"
  | "infrastructure"
  | "centres";

export interface GalleryCategory {
  id: GalleryCategoryId;
  label: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: Exclude<GalleryCategoryId, "all">;
}

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  { id: "all",            label: "All" },
  { id: "classrooms",    label: "Classrooms" },
  { id: "activities",    label: "Activities" },
  { id: "events",        label: "Events & Celebrations" },
  { id: "happy-times",   label: "Happy Times" },
  { id: "infrastructure",label: "Infrastructure" },
  { id: "centres",       label: "Centres in Thane" },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  // ── CLASSROOMS ──────────────────────────────────────────────────────
  {
    id: "cls-01",
    src: "/images/gallery/rainbow-preschool-classroom-learning-01.webp",
    alt: "Children engaged in classroom learning at Rainbow Preschool International Thane",
    caption: "Play-based learning in action",
    category: "classrooms",
  },
  {
    id: "cls-02",
    src: "/images/gallery/rainbow-preschool-classroom-learning-02.webp",
    alt: "Bright and welcoming classroom at Rainbow Preschool International Thane",
    caption: "Our bright, child-friendly classrooms",
    category: "classrooms",
  },
  {
    id: "cls-03",
    src: "/images/gallery/rainbow-preschool-classroom-learning-03.webp",
    alt: "Children engaged in structured classroom activity at Rainbow Preschool Thane",
    caption: "Structured classroom activities",
    category: "classrooms",
  },
  {
    id: "cls-04",
    src: "/images/gallery/rainbow-preschool-classroom-learning-04.webp",
    alt: "Kindergarten children in a structured learning session at Rainbow Preschool Thane",
    caption: "Kindergarten learning environment",
    category: "classrooms",
  },
  {
    id: "cls-05",
    src: "/images/gallery/rainbow-preschool-classroom-activity-01.webp",
    alt: "Creative classroom activity at Rainbow Preschool International Thane",
    caption: "Creative hands-on activities",
    category: "classrooms",
  },
  {
    id: "cls-06",
    src: "/images/gallery/rainbow-preschool-classroom-activity-02.webp",
    alt: "Children learning through activities at Rainbow Preschool Thane",
    caption: "Learning through doing",
    category: "classrooms",
  },
  {
    id: "cls-07",
    src: "/images/gallery/rainbow-preschool-classroom-activity-03.webp",
    alt: "Teacher guiding young children in classroom at Rainbow Preschool Thane",
    caption: "Expert teachers, personal attention",
    category: "classrooms",
  },
  {
    id: "cls-08",
    src: "/images/gallery/rainbow-preschool-classroom-activity-04.webp",
    alt: "Group learning session at Rainbow Preschool International Thane",
    caption: "Collaborative group learning",
    category: "classrooms",
  },

  // ── ACTIVITIES ──────────────────────────────────────────────────────
  {
    id: "act-01",
    src: "/images/gallery/rainbow-preschool-activity-book-character-day.webp",
    alt: "Book Character Day activity at Rainbow Preschool International Thane",
    caption: "Book Character Day — love of reading",
    category: "activities",
  },
  {
    id: "act-02",
    src: "/images/gallery/rainbow-preschool-childrens-day-activity.webp",
    alt: "Children's Day celebration activity at Rainbow Preschool Thane",
    caption: "Children's Day — a day of joy",
    category: "activities",
  },
  {
    id: "act-03",
    src: "/images/gallery/rainbow-preschool-fathers-day-celebration-activity.webp",
    alt: "Father's Day celebration activity at Rainbow Preschool International Thane",
    caption: "Father's Day — celebrating family bonds",
    category: "activities",
  },
  {
    id: "act-04",
    src: "/images/gallery/rainbow-preschool-make-your-own-sandwich-activity.webp",
    alt: "Make Your Own Sandwich activity for preschool children at Rainbow Thane",
    caption: "Make Your Own Sandwich — life skills fun",
    category: "activities",
  },
  {
    id: "act-05",
    src: "/images/gallery/rainbow-preschool-play-date-with-mothers-activity.webp",
    alt: "Play Date With Mothers activity at Rainbow Preschool Thane",
    caption: "Play Date With Mothers — bonding moments",
    category: "activities",
  },
  {
    id: "act-06",
    src: "/images/gallery/rainbow-preschool-sleep-time-setup-activity.webp",
    alt: "Sleep Time Setup for preschool children at Rainbow Preschool International Thane",
    caption: "Rest time — healthy routines from day one",
    category: "activities",
  },
  {
    id: "act-07",
    src: "/images/gallery/rainbow-preschool-splashy-fun-day-activity.webp",
    alt: "Splashy Fun Day water activity at Rainbow Preschool Thane",
    caption: "Splashy Fun Day — summer splash",
    category: "activities",
  },
  {
    id: "act-08",
    src: "/images/gallery/rainbow-preschool-tom-jerry-show-activity.webp",
    alt: "Tom & Jerry Show themed activity at Rainbow Preschool International Thane",
    caption: "Tom & Jerry Show — imagination in action",
    category: "activities",
  },
  {
    id: "act-09",
    src: "/images/gallery/rainbow-preschool-under-the-sea-activity.webp",
    alt: "Under the Sea themed activity for preschool children at Rainbow Thane",
    caption: "Under the Sea — exploring the ocean world",
    category: "activities",
  },

  // ── EVENTS & CELEBRATIONS ───────────────────────────────────────────
  {
    id: "evt-01",
    src: "/images/gallery/rainbow-preschool-annual-celebration-event-01.webp",
    alt: "Annual celebration event at Rainbow Preschool International Thane",
    caption: "Annual celebration day",
    category: "events",
  },
  {
    id: "evt-02",
    src: "/images/gallery/rainbow-preschool-annual-celebration-event-02.webp",
    alt: "Festive celebration with children at Rainbow Preschool Thane",
    caption: "Festive celebrations with joy",
    category: "events",
  },
  {
    id: "evt-03",
    src: "/images/gallery/rainbow-preschool-annual-celebration-event-03.webp",
    alt: "Cultural event performance by preschool children at Rainbow Thane",
    caption: "Cultural performances by little stars",
    category: "events",
  },
  {
    id: "evt-04",
    src: "/images/gallery/rainbow-preschool-diwali-celebration-event.webp",
    alt: "Diwali celebration at Rainbow Preschool International Thane",
    caption: "Diwali — festival of lights and learning",
    category: "events",
  },
  {
    id: "evt-05",
    src: "/images/gallery/rainbow-preschool-eid-celebration-event.webp",
    alt: "Eid celebration at Rainbow Preschool Thane — inclusive festive environment",
    caption: "Eid Mubarak — celebrating together",
    category: "events",
  },
  {
    id: "evt-06",
    src: "/images/gallery/rainbow-preschool-field-trip-fire-station-event.webp",
    alt: "Field trip to fire station by Rainbow Preschool children in Thane",
    caption: "Field trip to the fire station",
    category: "events",
  },
  {
    id: "evt-07",
    src: "/images/gallery/rainbow-preschool-ganesh-chaturthi-celebration.webp",
    alt: "Ganesh Chaturthi celebration at Rainbow Preschool International Thane",
    caption: "Ganesh Chaturthi — cultural celebrations",
    category: "events",
  },
  {
    id: "evt-08",
    src: "/images/gallery/rainbow-preschool-sports-day-event-01.webp",
    alt: "Sports Day event at Rainbow Preschool Thane — active play and competition",
    caption: "Sports Day — fitness and team spirit",
    category: "events",
  },
  {
    id: "evt-09",
    src: "/images/gallery/rainbow-preschool-sports-day-event-02.webp",
    alt: "Children competing in Sports Day at Rainbow Preschool International Thane",
    caption: "Sports Day — little champions",
    category: "events",
  },

  // ── HAPPY TIMES ─────────────────────────────────────────────────────
  {
    id: "hap-01",
    src: "/images/gallery/rainbow-preschool-happy-times-01.webp",
    alt: "Children enjoying the Happy Times daycare programme at Rainbow Preschool Thane",
    caption: "Happy Times — after-hours care & fun",
    category: "happy-times",
  },
  {
    id: "hap-02",
    src: "/images/gallery/rainbow-preschool-happy-times-02.webp",
    alt: "Children having fun during Happy Times session at Rainbow Preschool Thane",
    caption: "Fun-filled Happy Times sessions",
    category: "happy-times",
  },
  {
    id: "hap-03",
    src: "/images/gallery/rainbow-preschool-happy-times-03.webp",
    alt: "Happy Times programme activities at Rainbow Preschool International Thane",
    caption: "Activities that make kids smile",
    category: "happy-times",
  },
  {
    id: "hap-04",
    src: "/images/gallery/rainbow-preschool-happy-times-04.webp",
    alt: "Children enjoying afternoon activities in Happy Times at Rainbow Preschool",
    caption: "Afternoons full of joy and learning",
    category: "happy-times",
  },

  // ── INFRASTRUCTURE ──────────────────────────────────────────────────
  {
    id: "inf-01",
    src: "/images/gallery/rainbow-preschool-activity-room-01.webp",
    alt: "Activity room at Rainbow Preschool International Thane — well-equipped for children",
    caption: "Dedicated activity rooms",
    category: "infrastructure",
  },
  {
    id: "inf-02",
    src: "/images/gallery/rainbow-preschool-activity-room-02.webp",
    alt: "Spacious activity room at Rainbow Preschool Thane for hands-on learning",
    caption: "Spacious activity areas",
    category: "infrastructure",
  },
  {
    id: "inf-03",
    src: "/images/gallery/rainbow-preschool-activity-room-03.webp",
    alt: "Colourful activity room designed for preschool children at Rainbow Thane",
    caption: "Colourful, stimulating spaces",
    category: "infrastructure",
  },
  {
    id: "inf-04",
    src: "/images/gallery/rainbow-preschool-admin-office.webp",
    alt: "Admin office at Rainbow Preschool International Thane — professional and welcoming",
    caption: "Professional admin support",
    category: "infrastructure",
  },
  {
    id: "inf-05",
    src: "/images/gallery/rainbow-preschool-computer-lab.webp",
    alt: "Computer lab for young learners at Rainbow Preschool Thane — early digital literacy",
    caption: "Computer lab — early digital literacy",
    category: "infrastructure",
  },
  {
    id: "inf-06",
    src: "/images/gallery/rainbow-preschool-corridor.webp",
    alt: "Safe and bright corridor at Rainbow Preschool International Thane",
    caption: "Safe, bright corridors",
    category: "infrastructure",
  },
  {
    id: "inf-07",
    src: "/images/gallery/rainbow-preschool-entrance-area.webp",
    alt: "Welcoming entrance area at Rainbow Preschool Thane — safe drop-off zone",
    caption: "Safe and welcoming entrance",
    category: "infrastructure",
  },
  {
    id: "inf-08",
    src: "/images/gallery/rainbow-preschool-library-01.webp",
    alt: "Children's library at Rainbow Preschool International Thane — fostering a love of reading",
    caption: "Our library — a love of reading",
    category: "infrastructure",
  },
  {
    id: "inf-09",
    src: "/images/gallery/rainbow-preschool-library-02.webp",
    alt: "Well-stocked library for preschool children at Rainbow Preschool Thane",
    caption: "Well-stocked children's library",
    category: "infrastructure",
  },
  {
    id: "inf-10",
    src: "/images/gallery/rainbow-preschool-outdoor-premises-01.webp",
    alt: "Outdoor play premises at Rainbow Preschool Thane — safe open spaces",
    caption: "Safe outdoor play spaces",
    category: "infrastructure",
  },
  {
    id: "inf-11",
    src: "/images/gallery/rainbow-preschool-outdoor-premises-02.webp",
    alt: "Outdoor premises for children at Rainbow Preschool International Thane",
    caption: "Outdoor exploration areas",
    category: "infrastructure",
  },
  {
    id: "inf-12",
    src: "/images/gallery/rainbow-preschool-outdoor-premises-03.webp",
    alt: "Open outdoor grounds at Rainbow Preschool Thane for physical development",
    caption: "Open grounds for physical development",
    category: "infrastructure",
  },
  {
    id: "inf-13",
    src: "/images/gallery/rainbow-preschool-outdoor-premises-04.webp",
    alt: "Outdoor activity area at Rainbow Preschool Thane — fresh air and play",
    caption: "Fresh air and outdoor play",
    category: "infrastructure",
  },
  {
    id: "inf-14",
    src: "/images/gallery/rainbow-preschool-school-essentials.webp",
    alt: "School essentials and learning materials at Rainbow Preschool International Thane",
    caption: "Quality learning materials",
    category: "infrastructure",
  },

  // ── CENTRES IN THANE ────────────────────────────────────────────────
  {
    id: "cen-01",
    src: "/images/gallery/rainbow-preschool-manpada-centre-thane.webp",
    alt: "Rainbow Preschool Manpada centre in Thane — Aggarwal Centre",
    caption: "Manpada Centre (Aggarwal)",
    category: "centres",
  },
  {
    id: "cen-02",
    src: "/images/gallery/rainbow-preschool-anand-nagar-centre-thane.webp",
    alt: "Rainbow Preschool Anand Nagar centre in Thane",
    caption: "Anand Nagar Centre",
    category: "centres",
  },
  {
    id: "cen-03",
    src: "/images/gallery/rainbow-preschool-dhokali-centre-thane.webp",
    alt: "Rainbow Preschool Dhokali centre in Thane",
    caption: "Dhokali Centre",
    category: "centres",
  },
  {
    id: "cen-04",
    src: "/images/gallery/rainbow-preschool-hariniwas-centre-thane.webp",
    alt: "Rainbow Preschool Hariniwas centre in Thane",
    caption: "Hariniwas Centre",
    category: "centres",
  },
  {
    id: "cen-05",
    src: "/images/gallery/rainbow-preschool-kalwa-centre-thane.webp",
    alt: "Rainbow Preschool Kalwa centre in Thane",
    caption: "Kalwa Centre",
    category: "centres",
  },
  {
    id: "cen-06",
    src: "/images/gallery/rainbow-preschool-kasarvadavali-centre-thane.webp",
    alt: "Rainbow Preschool Kasarvadavali centre in Thane",
    caption: "Kasarvadavali Centre",
    category: "centres",
  },
];

export const GALLERY_CTA = {
  heading: "Want your child to experience this environment?",
  subtext: "Join 10,000+ happy Rainbow Preschool families across Thane.",
  primaryBtn: { label: "Book a Visit", href: "/contact" },
  secondaryBtn: { label: "Enquire Now", href: "/contact" },
};

export const GALLERY_SEO_CONTENT = `Rainbow Preschools in Thane offers a safe, engaging, and nurturing environment for children across Playgroup, Nursery, and Kindergarten programmes. Explore our classrooms, activities, events, and facilities through our gallery — 18+ years of joyful early childhood education across 6 centres in Manpada, Hariniwas, Anand Nagar, Dhokali, Kalwa, and Kasarvadavali.`;
