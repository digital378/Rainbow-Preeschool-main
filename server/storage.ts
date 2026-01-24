import { type User, type InsertUser, type Contact, type InsertContact, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private blogPosts: Map<string, BlogPost>;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.blogPosts = new Map();
    
    this.seedBlogPosts();
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

    defaultPosts.forEach(post => {
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
      id,
      publishedAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }
}

export const storage = new MemStorage();
