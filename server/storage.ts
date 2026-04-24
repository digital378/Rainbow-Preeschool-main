import { type User, type InsertUser, type Contact, type InsertContact, type BlogPost, type InsertBlogPost, type GscSnapshot, type InsertGscSnapshot } from "@shared/schema";
import { randomUUID } from "crypto";
import { seoRecoveryBlogPosts } from "./seed-blog-posts";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  markContactRead(id: string): Promise<void>;
  
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;

  getGscSnapshots(): Promise<GscSnapshot[]>;
  addGscSnapshot(snapshot: InsertGscSnapshot): Promise<GscSnapshot>;
  deleteGscSnapshot(id: number): Promise<void>;
  replaceGscSnapshotsInRange(
    keywordPrefix: string,
    startDate: string,
    endDate: string,
    rows: InsertGscSnapshot[],
  ): Promise<{ deleted: number; inserted: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private blogPosts: Map<string, BlogPost>;
  private gscSnapshots: Map<number, GscSnapshot>;
  private gscSnapshotCounter: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.blogPosts = new Map();
    this.gscSnapshots = new Map();
    this.gscSnapshotCounter = 0;
    
    this.seedBlogPosts();
    this.seedGscSnapshots();
  }

  private seedBlogPosts() {
    const defaultPosts: BlogPost[] = [
      {
        id: randomUUID(),
        title: "What To Ask During A Tour Of A Preschool In Thane",
        slug: "what-to-ask-during-a-tour-of-a-preschool-in-thane",
        excerpt: "Visiting preschools honestly feels a bit like house-hunting. You step in, look around for a few seconds, and something inside you instantly says either 'hmm' or 'yes!'",
        content: "When visiting a preschool, it's important to ask the right questions. Look for signs of a nurturing environment, qualified teachers, and age-appropriate curriculum.",
        imageUrl: "/images/optimized/DSC00011.webp",
        publishedAt: new Date("2025-11-15"),
        isPublished: true,
      },
      {
        id: randomUUID(),
        title: "Understanding the Importance of Preschool in Early Childhood Development",
        slug: "understanding-the-importance-of-preschool-in-early-childhood-development",
        excerpt: "The first few years of a child's life are filled with wonder moments, lots of Whys and Hows, and endless curiosity to discover new things.",
        content: "Early childhood education sets the foundation for lifelong learning. Quality preschool programs help children develop social, emotional, and cognitive skills.",
        imageUrl: "/images/optimized/children-learning-colorful-toys-preschool.webp",
        publishedAt: new Date("2025-10-20"),
        isPublished: true,
      },
      {
        id: randomUUID(),
        title: "How Play-Based Learning Shapes Young Minds",
        slug: "how-play-based-learning-shapes-young-minds",
        excerpt: "Play is not just fun for children—it's essential for their cognitive, social, and emotional development.",
        content: "At Rainbow Preschool, we believe in the power of play-based learning. Through carefully designed activities, children develop problem-solving skills and creativity.",
        imageUrl: "/images/optimized/kids-playing-ball-pit-rainbow-preschool.webp",
        publishedAt: new Date("2025-09-10"),
        isPublished: true,
      },
    ];

    // Append SEO-recovery evergreen posts (Apr–May 2026)
    const allPosts = [...defaultPosts, ...seoRecoveryBlogPosts];
    allPosts.forEach(post => {
      this.blogPosts.set(post.id, post);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      email: insertContact.email ?? null,
      message: insertContact.message ?? null,
      leadSource: insertContact.leadSource ?? null,
      leadMedium: insertContact.leadMedium ?? null,
      id,
      createdAt: new Date(),
      isRead: false,
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async markContactRead(id: string): Promise<void> {
    const contact = this.contacts.get(id);
    if (contact) {
      contact.isRead = true;
      this.contacts.set(id, contact);
    }
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.isPublished)
      .sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug && post.isPublished,
    );
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      imageUrl: insertPost.imageUrl ?? null,
      isPublished: insertPost.isPublished ?? true,
      id,
      publishedAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }

  private seedGscSnapshots() {
    const seed: Omit<GscSnapshot, "id">[] = [
      // Feb 4, 2026 — peak traffic period
      { snapshotDate: "2026-02-04", keyword: "rainbow preschool", clicks: 65, impressions: 4800, ctr: 0.0135, position: 5.48, page: "/", notes: "3-month aggregate Feb period" },
      { snapshotDate: "2026-02-04", keyword: "rainbow preschool thane", clicks: 48, impressions: 3800, ctr: 0.0126, position: 4.44, page: "/", notes: null },
      { snapshotDate: "2026-02-04", keyword: "best preschool in thane", clicks: 13, impressions: 1800, ctr: 0.0072, position: 13.64, page: "/best-preschool-near-me-in-thane", notes: null },
      { snapshotDate: "2026-02-04", keyword: "preschool near me", clicks: 8, impressions: 2800, ctr: 0.0029, position: 21.08, page: "/best-preschool-near-me-in-thane", notes: null },
      { snapshotDate: "2026-02-04", keyword: "pre kg age", clicks: 19, impressions: 1200, ctr: 0.0158, position: 2.69, page: "/pre-kg-age-guide", notes: null },
      { snapshotDate: "2026-02-04", keyword: "holi activities for kids", clicks: 184, impressions: 56013, ctr: 0.0033, position: 4.2, page: "/holi-activities-for-kids", notes: "High-impression informational" },
      { snapshotDate: "2026-02-04", keyword: "national symbols of india for kids", clicks: 104, impressions: 95118, ctr: 0.0011, position: 5.1, page: "/national-symbols-of-india-for-kids", notes: null },
      // Mar 14, 2026 — impressions cliff begins (redirect issue active)
      { snapshotDate: "2026-03-14", keyword: "rainbow preschool", clicks: 12, impressions: 2200, ctr: 0.0055, position: 6.0, page: "/", notes: "Impressions cliff — redirects sending bots to /blog" },
      { snapshotDate: "2026-03-14", keyword: "rainbow preschool thane", clicks: 9, impressions: 1000, ctr: 0.009, position: 5.2, page: "/", notes: null },
      { snapshotDate: "2026-03-14", keyword: "best preschool in thane", clicks: 5, impressions: 800, ctr: 0.006, position: 14.8, page: "/best-preschool-near-me-in-thane", notes: null },
      { snapshotDate: "2026-03-14", keyword: "preschool near me", clicks: 3, impressions: 1100, ctr: 0.0027, position: 22.0, page: "/best-preschool-near-me-in-thane", notes: null },
      { snapshotDate: "2026-03-14", keyword: "pre kg age", clicks: 6, impressions: 450, ctr: 0.0133, position: 3.0, page: "/pre-kg-age-guide", notes: null },
      { snapshotDate: "2026-03-14", keyword: "holi activities for kids", clicks: 8, impressions: 1200, ctr: 0.0067, position: 4.5, page: "/holi-activities-for-kids", notes: "Deindexing — server was 301-ing to /blog" },
      { snapshotDate: "2026-03-14", keyword: "national symbols of india for kids", clicks: 4, impressions: 600, ctr: 0.0067, position: 5.8, page: "/national-symbols-of-india-for-kids", notes: null },
      // Apr 16, 2026 — current (24h snapshot data)
      { snapshotDate: "2026-04-16", keyword: "rainbow preschool", clicks: 8, impressions: 426, ctr: 0.019, position: 7.44, page: "/", notes: "24h snapshot Apr 16" },
      { snapshotDate: "2026-04-16", keyword: "rainbow preschool kasarvadavali", clicks: 1, impressions: 20, ctr: 0.05, position: 1.25, page: "/preschool-in-kasarvadavali-thane", notes: "24h" },
      { snapshotDate: "2026-04-16", keyword: "best preschool in thane", clicks: 1, impressions: 40, ctr: 0.025, position: 16.17, page: "/best-preschool-near-me-in-thane", notes: "24h" },
      { snapshotDate: "2026-04-16", keyword: "pre kg age", clicks: 1, impressions: 112, ctr: 0.009, position: 2.54, page: "/pre-kg-age-guide", notes: "24h — holding strong" },
      { snapshotDate: "2026-04-16", keyword: "pre school thane", clicks: 1, impressions: 30, ctr: 0.033, position: 3.6, page: "/", notes: "24h" },
      { snapshotDate: "2026-04-16", keyword: "preschool near me", clicks: 0, impressions: 100, ctr: 0, position: 23.0, page: "/best-preschool-near-me-in-thane", notes: "24h — redirect fix applied Apr 17" },
    ];

    seed.forEach(entry => {
      const id = ++this.gscSnapshotCounter;
      this.gscSnapshots.set(id, { ...entry, id });
    });
  }

  async getGscSnapshots(): Promise<GscSnapshot[]> {
    return Array.from(this.gscSnapshots.values()).sort((a, b) =>
      a.snapshotDate.localeCompare(b.snapshotDate) || a.keyword.localeCompare(b.keyword)
    );
  }

  async addGscSnapshot(snapshot: InsertGscSnapshot): Promise<GscSnapshot> {
    const id = ++this.gscSnapshotCounter;
    const entry: GscSnapshot = {
      ...snapshot,
      id,
      clicks: snapshot.clicks ?? 0,
      impressions: snapshot.impressions ?? 0,
      ctr: snapshot.ctr ?? 0,
      position: snapshot.position ?? 0,
      page: snapshot.page ?? null,
      notes: snapshot.notes ?? null,
    };
    this.gscSnapshots.set(id, entry);
    return entry;
  }

  async deleteGscSnapshot(id: number): Promise<void> {
    this.gscSnapshots.delete(id);
  }

  async replaceGscSnapshotsInRange(
    keywordPrefix: string,
    startDate: string,
    endDate: string,
    rows: InsertGscSnapshot[],
  ): Promise<{ deleted: number; inserted: number }> {
    let deleted = 0;
    const entries = Array.from(this.gscSnapshots.entries());
    for (const [id, snap] of entries) {
      if (
        snap.keyword.startsWith(keywordPrefix) &&
        snap.snapshotDate >= startDate &&
        snap.snapshotDate <= endDate
      ) {
        this.gscSnapshots.delete(id);
        deleted++;
      }
    }
    let inserted = 0;
    for (const row of rows) {
      const id = ++this.gscSnapshotCounter;
      this.gscSnapshots.set(id, {
        ...row,
        id,
        clicks: row.clicks ?? 0,
        impressions: row.impressions ?? 0,
        ctr: row.ctr ?? 0,
        position: row.position ?? 0,
        page: row.page ?? null,
        notes: row.notes ?? null,
      });
      inserted++;
    }
    return { deleted, inserted };
  }
}

export const storage = new MemStorage();
