import { User, Address, Property, Plan, Subscription } from "@shared/schema";

export type SignupFormData = {
  // Step 1: Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  smsNotifications: boolean;
  isBusinessAccount: boolean;
  username: string;
  password: string;
  
  // Step 2: Service Address
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  sameBillingAddress: boolean;
  
  // Step 3: Property Information
  trashDay: string;
  recycleDay?: string;
  alternatingRecycle: boolean;
  trashCanCount: number;
  recycleCanCount: number;
  
  // Step 4: Payment Information
  planId: number;
  isMonthlyBilling: boolean;
  promoCode?: string;
  termsAgreement: boolean;
};

export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  serviceCities?: string;
  propertyCount?: string;
  message?: string;
  smsConsent: boolean;
};

export type LoginFormData = {
  username: string;
  password: string;
};

export type UserWithSubscription = User & {
  subscription?: Subscription;
  plan?: Plan;
  serviceAddress?: Address;
  property?: Property;
};

export type PricingPlan = {
  id: number;
  name: string;
  description: string;
  priceMonthly: number;
  priceQuarterly: number | null;
  features: string[];
  maxCans: number;
  isPopular: boolean;
  maxDaysPerWeek: number;
};
