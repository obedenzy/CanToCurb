import { 
  users, type User, type InsertUser,
  addresses, type Address, type InsertAddress,
  properties, type Property, type InsertProperty,
  subscriptions, type Subscription, type InsertSubscription,
  contacts, type Contact, type InsertContact,
  plans, type Plan
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const [createdUser] = await db.insert(users).values(user).returning();
    return createdUser;
  }
  
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        stripeCustomerId: customerId,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return updatedUser;
  }
  
  async updateStripeSubscriptionId(userId: number, subscriptionId: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return updatedUser;
  }
  
  async updateUserStripeInfo(userId: number, { customerId, subscriptionId }: { customerId: string, subscriptionId: string }): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return updatedUser;
  }
  
  async getAddressByUserId(userId: number): Promise<Address | undefined> {
    const [address] = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, userId));
    
    return address;
  }
  
  async createAddress(address: InsertAddress): Promise<Address> {
    const [createdAddress] = await db
      .insert(addresses)
      .values(address)
      .returning();
    
    return createdAddress;
  }
  
  async getPropertyByAddressId(addressId: number): Promise<Property | undefined> {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.addressId, addressId));
    
    return property;
  }
  
  async createProperty(property: InsertProperty): Promise<Property> {
    const [createdProperty] = await db
      .insert(properties)
      .values(property)
      .returning();
    
    return createdProperty;
  }
  
  async getSubscriptionByUserId(userId: number): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    
    return subscription;
  }
  
  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [createdSubscription] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();
    
    return createdSubscription;
  }
  
  async createContact(contact: InsertContact): Promise<Contact> {
    const [createdContact] = await db
      .insert(contacts)
      .values({
        ...contact,
        createdAt: new Date()
      })
      .returning();
    
    return createdContact;
  }
  
  async getAllPlans(): Promise<Plan[]> {
    return db.select().from(plans);
  }
  
  async getPlanById(id: number): Promise<Plan | undefined> {
    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, id));
    
    return plan;
  }
}

// Function to initialize default plans if none exist
export async function initializePlans() {
  const existingPlans = await db.select().from(plans);
  
  if (existingPlans.length === 0) {
    const plansData = [
      {
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
    
    await db.insert(plans).values(plansData);
    console.log("Initial plans created in database");
  }
}