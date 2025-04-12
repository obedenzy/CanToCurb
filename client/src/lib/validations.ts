import { z } from "zod";

// Contact Information (Step 1)
export const contactInfoSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  smsNotifications: z.boolean().default(false),
  isBusinessAccount: z.boolean().default(false),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Service Address (Step 2)
export const serviceAddressSchema = z.object({
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code is required"),
  country: z.string().min(2, "Country is required"),
  sameBillingAddress: z.boolean().default(true),
});

// Property Information (Step 3)
export const propertyInfoSchema = z.object({
  trashDay: z.string().min(1, "Trash day is required"),
  recycleDay: z.string().optional(),
  alternatingRecycle: z.boolean().default(false),
  trashCanCount: z.number().min(1, "At least 1 trash can is required"),
  recycleCanCount: z.number().min(0, "Number of recycling cans is required"),
});

// Payment Information (Step 4)
export const paymentInfoSchema = z.object({
  planId: z.number().min(1, "Please select a plan"),
  isMonthlyBilling: z.boolean().default(true),
  promoCode: z.string().optional(),
  termsAgreement: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  }),
});

// Contact Form
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  interest: z.string().min(1, "Please select an interest"),
  serviceCities: z.string().optional(),
  propertyCount: z.string().optional(),
  message: z.string().optional(),
  smsConsent: z.boolean().default(false),
});

// Login Form
export const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
