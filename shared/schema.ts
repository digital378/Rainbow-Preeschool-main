import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, serial, real, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parentName: text("parent_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  childName: text("child_name").notNull(),
  childAge: text("child_age").notNull(),
  programme: text("programme").notNull(),
  branch: text("branch").notNull(),
  message: text("message"),
  leadSource: text("lead_source"),
  leadMedium: text("lead_medium"),
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});

export const insertContactSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactSubmissions.$inferSelect;

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").defaultNow(),
  isPublished: boolean("is_published").default(true),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  publishedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Users table (for admin)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Programme types for frontend
export const programmes = [
  {
    id: "playgroup",
    name: "Playgroup",
    ageRange: "1.5 - 2.5 years",
    description: "Learning introduced with fun activities like puppet shows, play, and colours",
    icon: "baby",
    image: "/images/optimized/playgroup-child-toy-car.webp",
  },
  {
    id: "nursery",
    name: "Nursery",
    ageRange: "2.5 - 3.5 years",
    description: "Curriculum in sync with children's mental and physical development - group reading, writing, puppet shows, dancing, yoga and more",
    icon: "book-open",
    image: "/images/optimized/nursery-girl-drawing.webp",
  },
  {
    id: "kindergarten",
    name: "Kindergarten",
    ageRange: "3.5 - 5 years",
    description: "Exciting learning experience adding sophisticated skills in different subjects: English, Math, EVS, GK, Art & Craft",
    icon: "graduation-cap",
    image: "/images/optimized/kindergarten-kids-colorful-mats.webp",
  },
  {
    id: "kids-activity-club",
    name: "Kids Activity Club",
    ageRange: "2 - 10 years",
    description: "Developing talents with 20+ activities like brain gym, aerobics and drama",
    icon: "palette",
    image: "/images/optimized/creative-art-activity-preschool.webp",
  },
  {
    id: "summer-camp",
    name: "Summer Camp",
    ageRange: "2 - 10 years",
    description: "Special programmes for perfect holiday planning - nurturing creativity and spending fun time with friends and hobbies",
    icon: "sun",
    image: "/images/optimized/happy-girls-ball-pit-playgroup.webp",
  },
  {
    id: "happy-times",
    name: "Happy Times",
    ageRange: "2 - 10 years",
    description: "Safe and nurturing environment for extended care with engaging activities",
    icon: "heart",
    image: "/images/optimized/happy-times-daycare-kids.webp",
  },
] as const;

export type Programme = typeof programmes[number];

// Centre information
export const branches = [
  {
    id: "aggarwal",
    name: "Aggarwal Centre (Manpada)",
    address: "Aggarwal Arcade, Near Khewra Circle, Manpada, Thane (W)",
    landline: "022-47762019",
    calling: "93218 39367",
    whatsapp: "88281 95788",
    mapUrl: "https://maps.app.goo.gl/jenJNhoqsExdWH5DA",
  },
  {
    id: "hariniwas",
    name: "Hariniwas Centre",
    address: "M.V.Apartments, Bhakti Mandir Road, Opp. Thanawala Garage, Hariniwas Circle, Panchpakadi, Thane (W)",
    calling: "91365 78589",
    whatsapp: "91365 78589",
    mapUrl: "https://maps.app.goo.gl/KrcVoEu8xSHEzEPd9",
  },
  {
    id: "anand-nagar",
    name: "Anand Nagar Centre",
    address: "Kris Commercial Plaza, 1st Floor, Opp. Tropical Lagoon, Anand Nagar, Thane (W)",
    calling: "98337 81550",
    whatsapp: "98337 81550",
    secondCalling: "91524 89789",
    mapUrl: "https://maps.app.goo.gl/oFnzPGooMos4qACV9",
  },
  {
    id: "dhokali",
    name: "Dhokali Centre",
    address: "Kolshet Road, Dhokali Naka, Opp. Aban Park Society, Thane (W)",
    calling: "93212 38375",
    whatsapp: "91673 99247",
    mapUrl: "https://maps.app.goo.gl/WAp5VMqUs6UhUK4c8",
  },
  {
    id: "kalwa",
    name: "Kalwa Centre",
    address: "Harsh Prasad Co-op Hsg, Soc, Near Sayba Hall, Manisha Nagar, Gate No.1, Kalwa",
    calling: "74003 27905",
    whatsapp: "74003 27905",
    mapUrl: "https://maps.app.goo.gl/HoW2W9r1v6Jzi397A",
  },
  {
    id: "kasarvadavali",
    name: "Kasarvadavali Centre",
    address: "Rosa Gardenia, Next to Parijat Gardens, Kasarvadavali, Behind Hypercity Mall, Thane (W)",
    landline: "022-40062128",
    calling: "87798 00068",
    whatsapp: "87798 00068",
    mapUrl: "https://maps.app.goo.gl/kE2EyU3YUuf9ZDuNA",
  },
] as const;

export type Branch = typeof branches[number];

// Testimonials. `name` must stay as the generic "A Rainbow Parent"
// label per the org-only attribution rule.
export const testimonials = [
  {
    id: "1",
    name: "A Rainbow Parent",
    locality: "Manpada",
    rating: 5,
    text: "My son has successfully completed his preschool years. I am very happy and satisfied with the way Rainbow has shaped him and his overall growth. The method of teaching is very creative. He learnt many concepts in playful manner.",
  },
  {
    id: "2",
    name: "A Rainbow Parent",
    locality: "Kalwa",
    rating: 5,
    text: "We have been associated with Rainbow preschool from the playgroup and our experience has been amazing. The teachers and the staff are so caring and efficient. My son enjoys the activities that go along with the academics.",
  },
  {
    id: "3",
    name: "A Rainbow Parent",
    locality: "Ghodbunder Road",
    rating: 5,
    text: "We highly recommend Rainbow preschool in Thane as it has perfect combination of Quality education, professional teachers, supporting staff & requisite infrastructure. My Daughter has seen lot of development & progress.",
  },
  {
    id: "4",
    name: "A Rainbow Parent",
    locality: "Anand Nagar",
    rating: 5,
    text: "I Would like to thank our School Management from the bottom of my heart for taking up so much initiative. Individual Attention for the student taken care from teachers and most importantly my daughter and son love the school most.",
  },
] as const;

export type Testimonial = typeof testimonials[number];

// GSC keyword tracking snapshots
export const gscSnapshots = pgTable(
  "gsc_snapshots",
  {
    id: serial("id").primaryKey(),
    snapshotDate: text("snapshot_date").notNull(),
    keyword: text("keyword").notNull(),
    clicks: integer("clicks").notNull().default(0),
    impressions: integer("impressions").notNull().default(0),
    ctr: real("ctr").notNull().default(0),
    position: real("position").notNull().default(0),
    page: text("page"),
    notes: text("notes"),
  },
  (table) => ({
    // Speeds up the periodic retention prune (DELETE … WHERE keyword LIKE …
    // AND snapshot_date < cutoff) and the existing range-replace on
    // (__daily__:*, __site_total__) writes performed every 6 hours.
    keywordDateIdx: index("gsc_snapshots_keyword_date_idx").on(
      table.keyword,
      table.snapshotDate,
    ),
  }),
);

export const insertGscSnapshotSchema = createInsertSchema(gscSnapshots).omit({ id: true });
export type InsertGscSnapshot = z.infer<typeof insertGscSnapshotSchema>;
export type GscSnapshot = typeof gscSnapshots.$inferSelect;
