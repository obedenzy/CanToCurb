import {
  users,
  addresses,
  properties,
  plans,
  subscriptions,
  contacts,
  type User,
  type InsertUser,
  type Address,
  type InsertAddress,
  type Property,
  type InsertProperty,
  type Plan,
  type InsertPlan,
  type Subscription,
  type InsertSubscription,
  type Contact,
  type InsertContact,
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  updateStripeSubscriptionId(userId: number, subscriptionId: string): Promise<User>;
  updateUserStripeInfo(userId: number, { customerId, subscriptionId }: { customerId: string; subscriptionId: string }): Promise<User>;
  
  // Addresses
  getAddresses(userId: number): Promise<Address[]>;
  getServiceAddress(userId: number): Promise<Address | undefined>;
  getBillingAddress(userId: number): Promise<Address | undefined>;
  createAddress(address: InsertAddress): Promise<Address>;
  
  // Properties
  getProperties(userId: number): Promise<Property[]>;
  getProperty(id: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  
  // Plans
  getPlans(): Promise<Plan[]>;
  getPlan(id: number): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  
  // Subscriptions
  getSubscriptions(userId: number): Promise<Subscription[]>;
  getActiveSubscription(userId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  cancelSubscription(id: number): Promise<Subscription>;
  
  // Contacts
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Seed default plans
  seedDefaultPlans(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private addresses: Map<number, Address>;
  private properties: Map<number, Property>;
  private plans: Map<number, Plan>;
  private subscriptions: Map<number, Subscription>;
  private contacts: Map<number, Contact>;
  
  private userIdCounter: number;
  private addressIdCounter: number;
  private propertyIdCounter: number;
  private planIdCounter: number;
  private subscriptionIdCounter: number;
  private contactIdCounter: number;

  constructor() {
    this.users = new Map();
    this.addresses = new Map();
    this.properties = new Map();
    this.plans = new Map();
    this.subscriptions = new Map();
    this.contacts = new Map();
    
    this.userIdCounter = 1;
    this.addressIdCounter = 1;
    this.propertyIdCounter = 1;
    this.planIdCounter = 1;
    this.subscriptionIdCounter = 1;
    this.contactIdCounter = 1;
    
    // Seed default plans
    this.seedDefaultPlans();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt, stripeCustomerId: null, stripeSubscriptionId: null };
    this.users.set(id, user);
    return user;
  }
  
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const updatedUser = { ...user, stripeCustomerId: customerId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateStripeSubscriptionId(userId: number, subscriptionId: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const updatedUser = { ...user, stripeSubscriptionId: subscriptionId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserStripeInfo(userId: number, { customerId, subscriptionId }: { customerId: string; subscriptionId: string }): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const updatedUser = { ...user, stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Addresses
  async getAddresses(userId: number): Promise<Address[]> {
    return Array.from(this.addresses.values()).filter(
      (address) => address.userId === userId,
    );
  }
  
  async getServiceAddress(userId: number): Promise<Address | undefined> {
    return Array.from(this.addresses.values()).find(
      (address) => address.userId === userId && address.isServiceAddress,
    );
  }
  
  async getBillingAddress(userId: number): Promise<Address | undefined> {
    return Array.from(this.addresses.values()).find(
      (address) => address.userId === userId && address.isBillingAddress,
    );
  }
  
  async createAddress(insertAddress: InsertAddress): Promise<Address> {
    const id = this.addressIdCounter++;
    const address: Address = { ...insertAddress, id };
    this.addresses.set(id, address);
    return address;
  }
  
  // Properties
  async getProperties(userId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.userId === userId,
    );
  }
  
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }
  
  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyIdCounter++;
    const createdAt = new Date();
    const property: Property = { ...insertProperty, id, createdAt };
    this.properties.set(id, property);
    return property;
  }
  
  // Plans
  async getPlans(): Promise<Plan[]> {
    return Array.from(this.plans.values());
  }
  
  async getPlan(id: number): Promise<Plan | undefined> {
    return this.plans.get(id);
  }
  
  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const id = this.planIdCounter++;
    const plan: Plan = { ...insertPlan, id };
    this.plans.set(id, plan);
    return plan;
  }
  
  // Subscriptions
  async getSubscriptions(userId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      (subscription) => subscription.userId === userId,
    );
  }
  
  async getActiveSubscription(userId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      (subscription) => subscription.userId === userId && subscription.isActive,
    );
  }
  
  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.subscriptionIdCounter++;
    const createdAt = new Date();
    const subscription: Subscription = { ...insertSubscription, id, createdAt };
    this.subscriptions.set(id, subscription);
    return subscription;
  }
  
  async cancelSubscription(id: number): Promise<Subscription> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) {
      throw new Error(`Subscription with ID ${id} not found`);
    }
    
    const updatedSubscription = { ...subscription, isActive: false, endDate: new Date() };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
  
  // Contacts
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactIdCounter++;
    const createdAt = new Date();
    const contact: Contact = { ...insertContact, id, createdAt };
    this.contacts.set(id, contact);
    return contact;
  }
  
  // Seed default plans
  async seedDefaultPlans(): Promise<void> {
    // Only add if no plans exist
    if (this.plans.size === 0) {
      // Starter Plan
      await this.createPlan({
        name: "Starter",
        description: "For residential homes with standard trash service.",
        priceMonthly: 3900, // $39.00
        priceQuarterly: 10530, // $105.30 (10% discount)
        maxCans: 2,
        maxDaysPerWeek: 1,
        features: ["Up to 2 cans", "Can-To-Curb® service", "1 day a week", "SMS notifications", "Photo history"],
        stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || "price_starter",
        stripeQuarterlyPriceId: process.env.STRIPE_STARTER_QUARTERLY_PRICE_ID || "price_starter_quarterly",
        isPopular: true,
      });
      
      // Premium Plan
      await this.createPlan({
        name: "Premium",
        description: "For homes with multiple bins or additional needs.",
        priceMonthly: 5400, // $54.00
        priceQuarterly: 14580, // $145.80 (10% discount)
        maxCans: 4,
        maxDaysPerWeek: 2,
        features: ["Up to 4 cans", "Can-To-Curb® service", "Up to 2 days a week", "SMS notifications", "Photo history", "Multi-user access"],
        stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID || "price_premium",
        stripeQuarterlyPriceId: process.env.STRIPE_PREMIUM_QUARTERLY_PRICE_ID || "price_premium_quarterly",
        isPopular: false,
      });
      
      // Business Plan
      await this.createPlan({
        name: "Business",
        description: "For multi-family or small business locations.",
        priceMonthly: 6500, // $65.00
        priceQuarterly: 17550, // $175.50 (10% discount)
        maxCans: 6,
        maxDaysPerWeek: 3,
        features: ["Up to 6 cans", "Can-To-Curb® service", "Up to 3 days a week", "All alerts", "Advanced reporting", "Multi-user access", "Dedicated account manager"],
        stripePriceId: process.env.STRIPE_BUSINESS_PRICE_ID || "price_business",
        stripeQuarterlyPriceId: process.env.STRIPE_BUSINESS_QUARTERLY_PRICE_ID || "price_business_quarterly",
        isPopular: false,
      });
      
      // Enterprise Plan
      await this.createPlan({
        name: "Enterprise",
        description: "For large properties or multiple locations.",
        priceMonthly: 9900, // Placeholder price, actually "Custom pricing"
        priceQuarterly: null, // Custom pricing
        maxCans: 100, // Effectively unlimited
        maxDaysPerWeek: 7, // Custom scheduling
        features: ["Custom can count", "Can-To-Curb® service", "Custom scheduling", "Client billing", "Custom reporting", "Multi-user access", "API integration"],
        stripePriceId: null, // Custom pricing
        stripeQuarterlyPriceId: null, // Custom pricing
        isPopular: false,
      });
    }
  }
}

export const storage = new MemStorage();
