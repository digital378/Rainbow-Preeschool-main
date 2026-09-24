/**
 * Canonical metadata shared by the visitor blog renderer and bot SSR.
 *
 * Titles/descriptions intentionally retain their current bot-SSR values;
 * h1 retains the existing visitor-facing heading for each seeded post.
 */
export interface BlogMetadata {
  title: string;
  description: string;
  h1: string;
}

export const BLOG_METADATA: Record<string, BlogMetadata> = {
  "what-to-ask-during-a-tour-of-a-preschool-in-thane": {
    title: "Questions to Ask When Visiting a Preschool | Checklist",
    description: "Essential 25+ questions to ask when visiting a preschool. Expert checklist covering safety, curriculum, teacher ratios & more for parents.",
    h1: "What To Ask During A Tour Of A Preschool In Thane: Complete Parent's Guide 2025",
  },
  "understanding-the-importance-of-preschool-in-early-childhood-development": {
    title: "Importance of Preschool in Child Development",
    description: "Discover science-backed insights on why quality preschool education matters for your child's cognitive, social, and emotional development.",
    h1: "Understanding the Importance of Preschool in Early Childhood Development: Science-Backed Insights",
  },
  "how-play-based-learning-shapes-young-minds": {
    title: "Play-Based Learning | Benefits & Activities",
    description: "Learn how play-based learning nurtures cognitive, social, and emotional development in young children. Science-backed insights and practical activities.",
    h1: "How Play-Based Learning Shapes Young Minds: The Science, Benefits & Activities",
  },
  "preparing-your-child-for-first-day-preschool": {
    title: "Preparing Your Child for First Day at Preschool | Expert Tips",
    description: "Expert tips to prepare your child for their first day at preschool — manage separation anxiety, what to pack, and build school excitement.",
    h1: "Preparing Your Child for Their First Day at Preschool",
  },
  "role-of-parents-early-education": {
    title: "Role of Parents in Early Childhood Education | Rainbow Preschool",
    description: "Learn the crucial role parents play in early education. Practical strategies to support your child's learning at home — for Indian families.",
    h1: "The Role of Parents in Early Education",
  },
  "creating-safe-nurturing-learning-environment": {
    title: "Safe Learning Environment for Children | Rainbow Preschool",
    description: "Discover how a safe, nurturing environment accelerates child development — and how Rainbow Preschool Thane builds secure, stimulating classrooms.",
    h1: "Creating a Safe and Nurturing Learning Environment",
  },
  "republic-day-2026": {
    title: "Republic Day 2026 | History, Parade & Quotes",
    description: "Celebrate India's 77th Republic Day 2026 with complete information on history, significance, parade highlights, speeches, and wishes.",
    h1: "Republic Day 2026 in India: History, Parade, Speeches, Quotes & How Preschoolers Can Celebrate",
  },
  "signs-of-good-preschool-thane": {
    title: "10 Signs of a Good Preschool | Every Parent's Checklist",
    description: "How to identify a great preschool. 10 research-backed signs every parent should look for — from teacher quality to safety, curriculum, and environment.",
    h1: "10 Signs of a Good Preschool — What Every Parent Should Look For",
  },
  "preschool-vs-daycare-difference": {
    title: "Preschool vs Daycare: Key Differences | Guide for Parents",
    description: "Preschool vs daycare — what's the difference? Compare curriculum, timing, cost, goals, and outcomes to find the right option for your child.",
    h1: "Preschool vs Daycare: What's the Difference and What's Right for Your Child?",
  },
  "what-age-start-play-school": {
    title: "What Age to Start Play School in India | Expert Guide",
    description: "When should a child start play school? Learn ideal age, readiness signs, and the benefits of starting early or later, with tips for Indian parents.",
    h1: "What Age Should a Child Start Play School? Expert Guide for Indian Parents",
  },
  "benefits-play-school-2-year-olds": {
    title: "Benefits of Play School for 2 Year Olds | Is Your Toddler Ready?",
    description: "Discover 12 research-backed benefits of play school for 2 year olds. Learn what toddlers gain from early education and how to know if your child is ready.",
    h1: "Benefits of Play School for 2 Year Olds — Is Your Toddler Ready?",
  },
  "nursery-school-admission-thane-2026": {
    title: "Nursery School Admission in Thane 2026-27 | Complete Guide",
    description: "Step-by-step guide to nursery school admission in Thane for 2026-27. Age criteria, documents, timelines, fees, and tips to secure admission.",
    h1: "Nursery School Admission Process in Thane — Step-by-Step Guide 2026-27",
  },
  "what-children-learn-nursery-school": {
    title: "What Children Learn in Nursery School | Monthly Guide",
    description: "Month-by-month guide to what children learn in nursery school — language, maths, social skills, and creativity across the developmental journey.",
    h1: "What Children Learn in Nursery School — Month-by-Month Development Guide",
  },
  "50-fun-learning-activities-preschoolers": {
    title: "50 Fun Learning Activities for Preschoolers at Home",
    description: "50 easy, fun learning activities for preschoolers at home using household items. Covers language, maths, science, art, and motor skills. Ages 2-6.",
    h1: "50 Fun Learning Activities for Preschoolers at Home",
  },
  "best-childrens-books-indian-preschoolers": {
    title: "Best Children's Books for Indian Preschoolers | Age-Wise List",
    description: "Curated list of best children's books for Indian preschoolers aged 1.5-6. Age-wise recommendations, reading tips, and Indian authors.",
    h1: "Best Children's Books for Indian Preschoolers — Age-Wise Reading List",
  },
  "screen-time-guidelines-preschoolers-india": {
    title: "Screen Time Guidelines for Indian Preschoolers (2026)",
    description: "How much screen time is healthy for preschoolers in India? 2026 expert guide for Thane parents — AAP rules, practical strategies, family media plan.",
    h1: "Screen Time Guidelines for Indian Preschoolers (2026 Parent Guide)",
  },
  "healthy-tiffin-box-ideas-preschoolers": {
    title: "50 Healthy Tiffin Box Ideas for Preschoolers (Indian)",
    description: "50 healthy, easy tiffin box ideas for preschoolers — perfect for Indian parents in Thane. Veg, balanced, kid-approved snacks for play school & nursery.",
    h1: "50 Healthy Tiffin Box Ideas for Preschoolers Indian Parents Will Love",
  },
  "toilet-training-toddlers-indian-parents-guide": {
    title: "Toilet Training Toddlers: Practical Guide for Parents",
    description: "Toilet training your toddler in India? Calm, step-by-step guide for parents — when to start, signs of readiness, accidents, and joint family tips.",
    h1: "Toilet Training Toddlers: A Calm, Practical Guide for Indian Parents",
  },
  "picky-eater-toddler-solutions": {
    title: "Picky Eater Toddler? 12 Gentle Solutions That Actually Work",
    description: "Picky eater toddler driving you crazy? 12 gentle, paediatrician-aligned solutions for Indian parents — meal ideas, food rules, and what to avoid.",
    h1: "Picky Eater Toddler? 12 Gentle Solutions That Actually Work",
  },
  "toddler-tantrum-management-emotional-regulation": {
    title: "Toddler Tantrum Management: Building Emotional Regulation",
    description: "Toddler tantrums leaving you exhausted? Learn calm, research-backed ways to manage tantrums and help your child build lifelong emotional regulation.",
    h1: "Toddler Tantrum Management: Helping Your Child Build Emotional Regulation",
  },
  "first-day-preschool-packing-checklist": {
    title: "First Day of Preschool Packing Checklist (Printable)",
    description: "Complete first-day-of-preschool packing checklist for Thane parents. Bag essentials, labels, lunch tips, and a free printable to download.",
    h1: "First Day of Preschool Packing Checklist (Free Printable for Thane Parents)",
  },
  "stem-activities-preschoolers-home": {
    title: "15 Easy STEM Activities for Preschoolers You Can Do at Home",
    description: "15 simple, low-cost STEM activities for preschoolers using everyday Indian household items. Build science, math, and curiosity in 20 minutes a day.",
    h1: "15 Easy STEM Activities for Preschoolers You Can Do at Home",
  },
  "yoga-mindfulness-preschoolers-daily-routines": {
    title: "Yoga & Mindfulness for Preschoolers: Calmer Mornings",
    description: "Yoga and mindfulness routines for preschoolers — calmer mornings, better focus, and sleep. Simple poses and breathing for Indian families.",
    h1: "Yoga & Mindfulness for Preschoolers: Simple Routines for Calmer Mornings",
  },
  "preparing-preschooler-new-sibling": {
    title: "Preparing Your Preschooler for a New Sibling: A Gentle Roadmap",
    description: "Welcoming a new baby? Gentle roadmap to prepare your preschooler for a new sibling — managing jealousy, bonding, and rebuilding routines.",
    h1: "Preparing Your Preschooler for a New Sibling: A Gentle Roadmap",
  },
  "toddler-speech-development-milestones-when-to-worry": {
    title: "Toddler Speech Milestones: What's Normal & When to Worry",
    description: "Toddler speech development guide — normal milestones month by month, late talker signs, when to consult a paediatrician. For Indian parents.",
    h1: "Toddler Speech Development Milestones: What's Normal and When to Worry",
  },
  "navratri-dussehra-2026-for-kids": {
    title: "Navratri & Dussehra for Little Ones | Rainbow Preschool International",
    description: "A gentle, giggly Navratri and Dussehra guide for Rainbow Preschool families, with stories, colours, crafts, rhymes and a quiz for little ones aged 1.5 to 5.5 years.",
    h1: "Navratri & Dussehra for Little Ones | Rainbow Preschool International",
  },
  "ganesh-chaturthi-for-kids": {
    title: "Ganesh Chaturthi 2026 for Kids | Rainbow Preschools",
    description: "Make Ganesh Chaturthi 2026 magical for your toddler! Simple stories, rhymes, crafts, speeches and playful activities for little ones from Rainbow Preschools, Thane.",
    h1: "Ganesh Chaturthi 2026 for Kids | Rainbow Preschools",
  },
  "janmashtami-for-kids": {
    title: "Janmashtami 2026 for Kids | Rainbow Preschools",
    description: "Make Janmashtami 2026 joyful for your little one! Simple stories, speeches, crafts, rhymes & festive images for preschoolers. By Rainbow Preschools, Thane.",
    h1: "Janmashtami 2026 for Kids | Rainbow Preschools",
  },
  "raksha-bandhan-2026-for-kids": {
    title: "Raksha Bandhan 2026 for Kids: Stories, Essays, Speeches, Slogans & More",
    description: "Everything parents and little ones need for Raksha Bandhan 2026 — age-appropriate stories, simple essays in English/Hindi/Marathi, slogans, quotes, DIY craft activities, a kids' quiz & FAQs. From Rainbow Preschool International, Thane.",
    h1: "Raksha Bandhan 2026 for Kids: Stories, Essays, Speeches, Slogans & More",
  },
  "independence-day-for-kids": {
    title: "Independence Day for Kids 2026 — Activities, Speeches, Stories & Free Downloads",
    description: "Celebrate India's 80th Independence Day with your little one! Fun activities, easy speeches, stories, a quiz, and free patriotic image downloads — all made for preschool kids.",
    h1: "Independence Day for Kids 2026 — Activities, Speeches, Stories & Free Downloads",
  },
};

export function getBlogMetadata(slug: string): BlogMetadata | undefined {
  return BLOG_METADATA[slug];
}