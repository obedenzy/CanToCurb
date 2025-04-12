import { 
  users, type User, type InsertUser,
  addresses, type Address, type InsertAddress,
  properties, type Property, type InsertProperty,
  subscriptions, type Subscription, type InsertSubscription,
  contacts, type Contact, type InsertContact,
  plans, type Plan,
  serviceRecords, type ServiceRecord, type InsertServiceRecord
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  updateStripeSubscriptionId(userId: number, subscriptionId: string): Promise<User>;
  updateUserStripeInfo(userId: number, { customerId, subscriptionId }: { customerId: string, subscriptionId: string }): Promise<User>;
  
  // Address operations
  getAddressByUserId(userId: number): Promise<Address | undefined>;
  createAddress(address: InsertAddress): Promise<Address>;
  
  // Property operations
  getPropertyByAddressId(addressId: number): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  
  // Subscription operations
  getSubscriptionByUserId(userId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  
  // Contact operations
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Plan operations
  getAllPlans(): Promise<Plan[]>;
  getPlanById(id: number): Promise<Plan | undefined>;
  
  // Service Record operations
  createServiceRecord(serviceRecord: InsertServiceRecord): Promise<ServiceRecord>;
  getServiceRecordById(id: number): Promise<ServiceRecord | undefined>;
  getAllServiceRecords(filters?: {
    userId?: number;
    propertyId?: number;
    status?: string;
    serviceType?: string;
    startDate?: Date;
    endDate?: Date;
    assignedStaffId?: number;
  }): Promise<ServiceRecord[]>;
  updateServiceRecord(id: number, updates: Partial<Omit<InsertServiceRecord, 'id'>>): Promise<ServiceRecord>;
  getUnassignedServiceRecords(): Promise<ServiceRecord[]>;
  
  // Staff operations
  getStaffMembers(): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private addresses: Map<number, Address>;
  private properties: Map<number, Property>;
  private subscriptions: Map<number, Subscription>;
  private contacts: Map<number, Contact>;
  private plans: Map<number, Plan>;
  
  private userId: number;
  private addressId: number;
  private propertyId: number;
  private subscriptionId: number;
  private contactId: number;
  private planId: number;

  constructor() {
    this.users = new Map();
    this.addresses = new Map();
    this.properties = new Map();
    this.subscriptions = new Map();
    this.contacts = new Map();
    this.plans = new Map();
    
    this.userId = 1;
    this.addressId = 1;
    this.propertyId = 1;
    this.subscriptionId = 1;
    this.contactId = 1;
    this.planId = 1;
    
    // Initialize with sample plans
    this.initializePlans();
  }
  
  private initializePlans() {
    const plans: Plan[] = [
      {
        id: this.planId++,
        name: "Starter",
        description: "Perfect for single-family homes",
        monthlyPrice: 3900, // $39.00
        quarterlyPrice: 10530, // $105.30 (10% discount)
        maxCans: 2,
        stripePriceIdMonthly: "price_starter_monthly",
        stripePriceIdQuarterly: "price_starter_quarterly",
        features: [
          "Up to 2 trash/recycle cans",
          "Can-To-Curb® service",
          "Weekly service",
          "Email notifications"
        ]
      },
      {
        id: this.planId++,
        name: "Premium",
        description: "For homes with additional needs",
        monthlyPrice: 5400, // $54.00
        quarterlyPrice: 14580, // $145.80 (10% discount)
        maxCans: 4,
        stripePriceIdMonthly: "price_premium_monthly",
        stripePriceIdQuarterly: "price_premium_quarterly",
        features: [
          "Up to 4 trash/recycle cans",
          "Can-To-Curb® service",
          "Twice weekly service",
          "SMS & email notifications",
          "Photo verification",
          "Multi-user access"
        ]
      },
      {
        id: this.planId++,
        name: "Business",
        description: "For vacation rentals and small businesses",
        monthlyPrice: 6500, // $65.00
        quarterlyPrice: 17550, // $175.50 (10% discount)
        maxCans: 6,
        stripePriceIdMonthly: "price_business_monthly",
        stripePriceIdQuarterly: "price_business_quarterly",
        features: [
          "Up to 6 trash/recycle cans",
          "Can-To-Curb® service",
          "Multiple weekly pickups",
          "Priority service",
          "Dedicated account manager",
          "Can cleaning included"
        ]
      },
      {
        id: this.planId++,
        name: "Enterprise",
        description: "For property managers & HOAs",
        monthlyPrice: 0, // Custom pricing
        quarterlyPrice: 0, // Custom pricing
        maxCans: 999, // Unlimited
        stripePriceIdMonthly: null,
        stripePriceIdQuarterly: null,
        features: [
          "Custom number of cans",
          "Can-To-Curb® service",
          "Custom billing",
          "API integration",
          "24/7 priority support",
          "Volume discounts"
        ]
      }
    ];
    
    plans.forEach(plan => this.plans.set(plan.id, plan));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(), 
      updatedAt: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);
    
    const updatedUser = {
      ...user,
      stripeCustomerId: customerId,
      updatedAt: new Date()
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateStripeSubscriptionId(userId: number, subscriptionId: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);
    
    const updatedUser = {
      ...user,
      stripeSubscriptionId: subscriptionId,
      updatedAt: new Date()
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserStripeInfo(userId: number, { customerId, subscriptionId }: { customerId: string, subscriptionId: string }): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);
    
    const updatedUser = {
      ...user,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      updatedAt: new Date()
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Address operations
  async getAddressByUserId(userId: number): Promise<Address | undefined> {
    return Array.from(this.addresses.values()).find(
      (address) => address.userId === userId,
    );
  }
  
  async createAddress(insertAddress: InsertAddress): Promise<Address> {
    const id = this.addressId++;
    const address: Address = { ...insertAddress, id };
    this.addresses.set(id, address);
    return address;
  }
  
  // Property operations
  async getPropertyByAddressId(addressId: number): Promise<Property | undefined> {
    return Array.from(this.properties.values()).find(
      (property) => property.addressId === addressId,
    );
  }
  
  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyId++;
    const property: Property = { ...insertProperty, id };
    this.properties.set(id, property);
    return property;
  }
  
  // Subscription operations
  async getSubscriptionByUserId(userId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      (subscription) => subscription.userId === userId,
    );
  }
  
  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.subscriptionId++;
    const subscription: Subscription = { ...insertSubscription, id };
    this.subscriptions.set(id, subscription);
    return subscription;
  }
  
  // Contact operations
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactId++;
    const contact: Contact = { ...insertContact, id, createdAt: new Date() };
    this.contacts.set(id, contact);
    return contact;
  }
  
  // Plan operations
  async getAllPlans(): Promise<Plan[]> {
    return Array.from(this.plans.values());
  }
  
  async getPlanById(id: number): Promise<Plan | undefined> {
    return this.plans.get(id);
  }
}

// Use Database storage instead of MemStorage
import { DatabaseStorage, initializePlans } from "./database-storage";
export const storage = new DatabaseStorage();

// Initialize database with plans
initializePlans().catch(err => {
  console.error("Failed to initialize plans:", err);
});
