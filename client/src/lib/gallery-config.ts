export type GalleryCategoryId =
  | "all"
  | "classrooms"
  | "activities"
  | "events"
  | "curriculum"
  | "facilities"
  | "safety"
  | "happy-times"
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
  { id: "all", label: "All" },
  { id: "classrooms", label: "Classrooms" },
  { id: "activities", label: "Activities" },
  { id: "events", label: "Events & Celebrations" },
  { id: "curriculum", label: "Learning & Curriculum" },
  { id: "facilities", label: "Facilities" },
  { id: "safety", label: "Safety & Security" },
  { id: "happy-times", label: "Happy Times" },
  { id: "centres", label: "Centres" },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  // ── CLASSROOMS ──────────────────────────────────────────────────────
  {
    id: "cls-01",
    src: "/images/optimized/classroom-kids-playing.webp",
    alt: "Kids engaged in play-based learning inside Rainbow Preschool classroom in Thane",
    caption: "Play-based learning in action",
    category: "classrooms",
  },
  {
    id: "cls-02",
    src: "/images/optimized/classroom-rainbow-preschool.webp",
    alt: "Bright and welcoming classroom at Rainbow Preschool International Thane",
    caption: "Our bright, child-friendly classrooms",
    category: "classrooms",
  },
  {
    id: "cls-03",
    src: "/images/optimized/kids-building-blocks-classroom.webp",
    alt: "Children building with colourful blocks during classroom activity at Rainbow Preschool",
    caption: "Building blocks — early STEM learning",
    category: "classrooms",
  },
  {
    id: "cls-04",
    src: "/images/optimized/kindergarten-classroom-learning.webp",
    alt: "Kindergarten children in a structured learning session at Rainbow Preschool Thane",
    caption: "Kindergarten learning environment",
    category: "classrooms",
  },
  {
    id: "cls-05",
    src: "/images/optimized/nursery-kids-classroom-activity.webp",
    alt: "Nursery children doing classroom activities at Rainbow Preschool International Thane",
    caption: "Nursery classroom activity time",
    category: "classrooms",
  },
  {
    id: "cls-06",
    src: "/images/optimized/play-school-classroom.webp",
    alt: "Colourful preschool classroom designed for early childhood learning in Thane",
    caption: "Designed for curious young minds",
    category: "classrooms",
  },
  {
    id: "cls-07",
    src: "/images/optimized/rainbow-students-classroom.webp",
    alt: "Rainbow Preschool International students in their classroom in Thane",
    caption: "Happy students at Rainbow Preschool",
    category: "classrooms",
  },
  {
    id: "cls-08",
    src: "/images/optimized/teacher-teaching-children-classroom.webp",
    alt: "Teacher guiding young children in classroom at Rainbow Preschool Thane",
    caption: "Expert teachers, personal attention",
    category: "classrooms",
  },
  {
    id: "cls-09",
    src: "/images/optimized/group-learning-kindergarten.webp",
    alt: "Group learning session with kindergarten children at Rainbow Preschool",
    caption: "Collaborative group learning",
    category: "classrooms",
  },
  {
    id: "cls-10",
    src: "/images/optimized/children-learning-rainbow-preschool.webp",
    alt: "Children learning together at Rainbow Preschool International Thane",
    caption: "Learning together, growing together",
    category: "classrooms",
  },

  // ── ACTIVITIES ──────────────────────────────────────────────────────
  {
    id: "act-01",
    src: "/images/optimized/creative-art-activity-preschool.webp",
    alt: "Creative art and craft activity for preschool children at Rainbow Thane",
    caption: "Art & craft — creativity blooms early",
    category: "activities",
  },
  {
    id: "act-02",
    src: "/images/optimized/nursery-girl-drawing.webp",
    alt: "Nursery girl drawing and painting at Rainbow Preschool International Thane",
    caption: "Drawing & painting in nursery",
    category: "activities",
  },
  {
    id: "act-03",
    src: "/images/optimized/nursery-reading-session.webp",
    alt: "Story time and reading session for nursery children at Rainbow Preschool Thane",
    caption: "Story time — the love of reading",
    category: "activities",
  },
  {
    id: "act-04",
    src: "/images/optimized/children-learning-colorful-toys-preschool.webp",
    alt: "Children learning with colourful educational toys at Rainbow Preschool Thane",
    caption: "Learning through colourful toys",
    category: "activities",
  },
  {
    id: "act-05",
    src: "/images/optimized/children-playing-snakes-ladders-game.webp",
    alt: "Preschool children playing snakes and ladders board game at Rainbow Thane",
    caption: "Educational board games — fun & learning",
    category: "activities",
  },
  {
    id: "act-06",
    src: "/images/optimized/toddler-playing-educational-toys.webp",
    alt: "Toddler engaged with educational toys during playgroup at Rainbow Preschool",
    caption: "Toddler exploration with educational toys",
    category: "activities",
  },
  {
    id: "act-07",
    src: "/images/optimized/DSC00010.webp",
    alt: "Classroom activity session at Rainbow Preschool International Thane",
    caption: "Hands-on classroom activities",
    category: "activities",
  },
  {
    id: "act-08",
    src: "/images/optimized/DSC00054.webp",
    alt: "Children engaged in a structured activity at Rainbow Preschool Thane",
    caption: "Structured activity time",
    category: "activities",
  },

  // ── EVENTS & CELEBRATIONS ───────────────────────────────────────────
  {
    id: "evt-01",
    src: "/images/optimized/IMG_9325.webp",
    alt: "Annual celebration event at Rainbow Preschool International Thane",
    caption: "Annual celebration day",
    category: "events",
  },
  {
    id: "evt-02",
    src: "/images/optimized/IMG_9326.webp",
    alt: "Festive celebration with children at Rainbow Preschool Thane",
    caption: "Festive celebrations with joy",
    category: "events",
  },
  {
    id: "evt-03",
    src: "/images/optimized/IMG_9349.webp",
    alt: "Cultural event performance by preschool children at Rainbow Thane",
    caption: "Cultural performances by little stars",
    category: "events",
  },
  {
    id: "evt-04",
    src: "/images/optimized/IMG_9361.webp",
    alt: "School event and celebration at Rainbow Preschool International Thane",
    caption: "Memorable school events",
    category: "events",
  },
  {
    id: "evt-05",
    src: "/images/optimized/IMG_9367.webp",
    alt: "Children participating in a school celebration at Rainbow Preschool Thane",
    caption: "Children celebrating together",
    category: "events",
  },
  {
    id: "evt-06",
    src: "/images/optimized/IMG_9370.webp",
    alt: "Graduation and prize ceremony at Rainbow Preschool International Thane",
    caption: "Prize and achievement ceremonies",
    category: "events",
  },
  {
    id: "evt-07",
    src: "/images/optimized/IMG_9371.webp",
    alt: "Group performance at a Rainbow Preschool event in Thane",
    caption: "Group performances & talent shows",
    category: "events",
  },

  // ── OUTDOOR PLAY ────────────────────────────────────────────────────
  {
    id: "out-01",
    src: "/images/optimized/kids-playing-ball-pit-rainbow-preschool.webp",
    alt: "Kids enjoying the ball pit play area at Rainbow Preschool International Thane",
    caption: "Ball pit — pure joy for little ones",
    category: "activities",
  },
  {
    id: "out-02",
    src: "/images/optimized/happy-girls-ball-pit-playgroup.webp",
    alt: "Happy girls playing in the ball pit during playgroup session at Rainbow Thane",
    caption: "Playtime brings endless smiles",
    category: "activities",
  },
  {
    id: "out-03",
    src: "/images/optimized/kid-playing-rainbow.webp",
    alt: "Child enjoying outdoor play activities at Rainbow Preschool Thane",
    caption: "Outdoor play for healthy development",
    category: "activities",
  },
  {
    id: "out-04",
    src: "/images/optimized/playgroup-child-toy-car.webp",
    alt: "Playgroup child riding a toy car at Rainbow Preschool International Thane",
    caption: "Toy car adventures in playgroup",
    category: "activities",
  },
  {
    id: "out-05",
    src: "/images/optimized/child-stacking-rings-playgroup.webp",
    alt: "Playgroup child stacking colourful rings during play session at Rainbow Preschool",
    caption: "Stacking rings — fine motor skills",
    category: "activities",
  },
  {
    id: "out-06",
    src: "/images/optimized/kindergarten-kids-colorful-mats.webp",
    alt: "Kindergarten children sitting on colourful activity mats at Rainbow Preschool Thane",
    caption: "Colourful mats, active learning",
    category: "activities",
  },

  // ── LEARNING & CURRICULUM ───────────────────────────────────────────
  {
    id: "cur-01",
    src: "/images/optimized/DSC00011.webp",
    alt: "Curriculum-based learning activity for preschool children at Rainbow Thane",
    caption: "Structured curriculum activities",
    category: "curriculum",
  },
  {
    id: "cur-02",
    src: "/images/optimized/DSC00257.webp",
    alt: "Children learning through activity-based curriculum at Rainbow Preschool",
    caption: "Activity-based curriculum in action",
    category: "curriculum",
  },
  {
    id: "cur-03",
    src: "/images/optimized/DSC00259.webp",
    alt: "Teacher-led learning session at Rainbow Preschool International Thane",
    caption: "Teacher-led learning moments",
    category: "curriculum",
  },
  {
    id: "cur-04",
    src: "/images/optimized/DSC00263.webp",
    alt: "Hands-on curriculum activity for young learners at Rainbow Preschool Thane",
    caption: "Hands-on curriculum exploration",
    category: "curriculum",
  },
  {
    id: "cur-05",
    src: "/images/optimized/DSC00271.webp",
    alt: "Children participating in structured learning at Rainbow Preschool Thane",
    caption: "Structured and joyful learning",
    category: "curriculum",
  },
  {
    id: "cur-06",
    src: "/images/optimized/DSC00272.webp",
    alt: "Group curriculum activity at Rainbow Preschool International Thane",
    caption: "Group curriculum activities",
    category: "curriculum",
  },

  // ── FACILITIES ──────────────────────────────────────────────────────
  {
    id: "fac-01",
    src: "/images/optimized/DSC00294.webp",
    alt: "Well-equipped facility at Rainbow Preschool International Thane",
    caption: "Modern, well-equipped facilities",
    category: "facilities",
  },
  {
    id: "fac-02",
    src: "/images/optimized/DSC00311.webp",
    alt: "Safe and clean indoor facility at Rainbow Preschool Thane",
    caption: "Clean and safe indoor spaces",
    category: "facilities",
  },
  {
    id: "fac-03",
    src: "/images/optimized/DSC00343.webp",
    alt: "Colourful and child-friendly facility at Rainbow Preschool Thane",
    caption: "Child-friendly environment throughout",
    category: "facilities",
  },
  {
    id: "fac-04",
    src: "/images/optimized/DSC00465.webp",
    alt: "Learning area and classroom facility at Rainbow Preschool International",
    caption: "Thoughtfully designed learning areas",
    category: "facilities",
  },
  {
    id: "fac-05",
    src: "/images/optimized/DSC00474.webp",
    alt: "Play and learning facility for children at Rainbow Preschool Thane",
    caption: "Play meets learning in every space",
    category: "facilities",
  },

  // ── SAFETY & SECURITY ───────────────────────────────────────────────
  {
    id: "saf-01",
    src: "/images/optimized/DSC00348.webp",
    alt: "Safe and secure environment for preschool children at Rainbow Thane",
    caption: "Safety is our top priority",
    category: "safety",
  },
  {
    id: "saf-02",
    src: "/images/optimized/DSC00353.webp",
    alt: "Child safety measures at Rainbow Preschool International Thane",
    caption: "Secured premises, safe learning",
    category: "safety",
  },
  {
    id: "saf-03",
    src: "/images/optimized/DSC00497.webp",
    alt: "Security and safety infrastructure at Rainbow Preschool Thane",
    caption: "Every child protected, every moment",
    category: "safety",
  },

  // ── HAPPY TIMES ─────────────────────────────────────────────────────
  {
    id: "hap-01",
    src: "/images/optimized/happy-times-daycare-kids.webp",
    alt: "Children enjoying the Happy Times daycare programme at Rainbow Preschool Thane",
    caption: "Happy Times — after-hours care & fun",
    category: "happy-times",
  },
  {
    id: "hap-02",
    src: "/images/optimized/DSC00359.webp",
    alt: "Children having fun during Happy Times session at Rainbow Preschool Thane",
    caption: "Fun-filled Happy Times sessions",
    category: "happy-times",
  },
  {
    id: "hap-03",
    src: "/images/optimized/DSC00392.webp",
    alt: "Happy Times programme activities at Rainbow Preschool International Thane",
    caption: "Activities that make kids smile",
    category: "happy-times",
  },
  {
    id: "hap-04",
    src: "/images/optimized/DSC00424.webp",
    alt: "Children enjoying afternoon activities in Happy Times at Rainbow Preschool",
    caption: "Afternoons full of joy and learning",
    category: "happy-times",
  },

  // ── CENTRES ─────────────────────────────────────────────────────────
  {
    id: "cen-01",
    src: "/images/optimized/IMG_9372.webp",
    alt: "Rainbow Preschool centre in Thane — welcoming environment for children",
    caption: "Our welcoming preschool centres",
    category: "centres",
  },
  {
    id: "cen-02",
    src: "/images/optimized/IMG_9378.webp",
    alt: "One of Rainbow Preschool's six centres across Thane",
    caption: "6 centres across Thane",
    category: "centres",
  },
  {
    id: "cen-03",
    src: "/images/optimized/IMG_9382.webp",
    alt: "Rainbow Preschool International centre with vibrant learning spaces in Thane",
    caption: "Vibrant, cheerful learning spaces",
    category: "centres",
  },
  {
    id: "cen-04",
    src: "/images/optimized/IMG_9385.webp",
    alt: "Centre entrance and reception at Rainbow Preschool Thane",
    caption: "A warm welcome at every centre",
    category: "centres",
  },
  {
    id: "cen-05",
    src: "/images/optimized/IMG_9386.webp",
    alt: "Interior of Rainbow Preschool centre showing child-safe décor in Thane",
    caption: "Child-safe décor & joyful interiors",
    category: "centres",
  },
  {
    id: "cen-06",
    src: "/images/optimized/IMG_9387.webp",
    alt: "Rainbow Preschool centre facility showcasing the school environment in Thane",
    caption: "Spaces that inspire young learners",
    category: "centres",
  },
  {
    id: "cen-07",
    src: "/images/optimized/DSC00458.webp",
    alt: "Rainbow Preschool International centre interior in Thane",
    caption: "Where every child feels at home",
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
