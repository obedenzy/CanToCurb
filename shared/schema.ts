import { pgTable, text, serial, integer, boolean, timestamp, json, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  smsNotifications: boolean("sms_notifications").default(false),
  isBusinessAccount: boolean("is_business_account").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  address1: text("address1").notNull(),
  address2: text("address2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  country: text("country").notNull().default("US"),
  isServiceAddress: boolean("is_service_address").default(false),
  isBillingAddress: boolean("is_billing_address").default(false),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  addressId: integer("address_id").notNull().references(() => addresses.id),
  trashDay: text("trash_day").notNull(),
  recycleDay: text("recycle_day"),
  alternatingRecycle: boolean("alternating_recycle").default(false),
  trashCanCount: integer("trash_can_count").notNull().default(1),
  recycleCanCount: integer("recycle_can_count").notNull().default(1),
  additionalInfo: text("additional_info"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  priceMonthly: integer("price_monthly").notNull(),
  priceQuarterly: integer("price_quarterly"),
  maxCans: integer("max_cans").notNull(),
  maxDaysPerWeek: integer("max_days_per_week").notNull().default(1),
  features: json("features"),
  stripePriceId: text("stripe_price_id"),
  stripeQuarterlyPriceId: text("stripe_quarterly_price_id"),
  isPopular: boolean("is_popular").default(false),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  planId: integer("plan_id").notNull().references(() => plans.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  isMonthlyBilling: boolean("is_monthly_billing").default(true),
  promoCode: text("promo_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  interest: text("interest"),
  serviceCities: text("service_cities"),
  propertyCount: text("property_count"),
  message: text("message"),
  smsConsent: boolean("sms_consent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  stripeCustomerId: true, 
  stripeSubscriptionId: true 
});

export const insertAddressSchema = createInsertSchema(addresses).omit({ 
  id: true 
});

export const insertPropertySchema = createInsertSchema(properties).omit({ 
  id: true, 
  createdAt: true 
});

export const insertPlanSchema = createInsertSchema(plans).omit({ 
  id: true 
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ 
  id: true, 
  createdAt: true 
});

export const insertContactSchema = createInsertSchema(contacts).omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = z.infer<typeof insertAddressSchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Plan = typeof plans.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

// Signup form schema for multi-step form
export const signupContactSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  smsNotifications: z.boolean().optional(),
  isBusinessAccount: z.boolean().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupAddressSchema = z.object({
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code is required"),
  country: z.string().min(2, "Country is required"),
  sameBillingAddress: z.boolean(),
});

export const signupPropertySchema = z.object({
  trashDay: z.string().min(1, "Trash day is required"),
  recycleDay: z.string().optional(),
  alternatingRecycle: z.boolean().optional(),
  trashCanCount: z.number().min(1, "At least 1 trash can is required"),
  recycleCanCount: z.number().min(0, "Number of recycling cans is required"),
});

export const signupPaymentSchema = z.object({
  planId: z.number(),
  isMonthlyBilling: z.boolean().optional(),
  promoCode: z.string().optional(),
  termsAgreement: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  }),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  interest: z.string().min(1, "Please select an interest"),
  serviceCities: z.string().optional(),
  propertyCount: z.string().optional(),
  message: z.string().optional(),
  smsConsent: z.boolean().optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
