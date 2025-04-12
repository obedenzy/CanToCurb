import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  signupContactSchema, 
  signupAddressSchema, 
  signupPropertySchema, 
  signupPaymentSchema,
  contactFormSchema,
  loginSchema
} from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: Missing STRIPE_SECRET_KEY environment variable. Using test mode.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51NeGXqAReEvF1fXDvvHRjrB1wFcxLHSOSqwTWMYadPs77A1kZEyYlGbIlYLgjBLsC6BnzWSA3hhDqkgAaJ9nHT8200K08I2F5g', {
  apiVersion: '2023-10-16',
});

// Helper to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "very-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication routes
  app.post("/api/auth/login", (req, res, next) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message });
        }
        
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          
          // Remove password from response
          const { password, ...userWithoutPassword } = user;
          return res.json({ user: userWithoutPassword });
        });
      })(req, res, next);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user as any;
    res.json({ user: userWithoutPassword });
  });

  // User signup - step 1: Contact Information
  app.post("/api/signup/contact-info", async (req, res) => {
    try {
      const contactInfo = signupContactSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(contactInfo.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(contactInfo.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Store in session for later use
      req.session.signupData = {
        ...req.session.signupData,
        contactInfo,
      };
      
      res.json({ message: "Contact information saved", step: 1 });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User signup - step 2: Service Address
  app.post("/api/signup/service-address", (req, res) => {
    try {
      const serviceAddress = signupAddressSchema.parse(req.body);
      
      // Check if we have contact info from step 1
      if (!req.session.signupData?.contactInfo) {
        return res.status(400).json({ message: "Please complete contact information first" });
      }
      
      // Store in session for later use
      req.session.signupData = {
        ...req.session.signupData,
        serviceAddress,
      };
      
      res.json({ message: "Service address saved", step: 2 });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User signup - step 3: Property Information
  app.post("/api/signup/property-info", (req, res) => {
    try {
      const propertyInfo = signupPropertySchema.parse(req.body);
      
      // Check if we have service address from step 2
      if (!req.session.signupData?.serviceAddress) {
        return res.status(400).json({ message: "Please complete service address first" });
      }
      
      // Store in session for later use
      req.session.signupData = {
        ...req.session.signupData,
        propertyInfo,
      };
      
      res.json({ message: "Property information saved", step: 3 });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User signup - step 4: Payment and complete signup
  app.post("/api/signup/complete", async (req, res) => {
    try {
      const paymentInfo = signupPaymentSchema.parse(req.body);
      
      // Check if we have all previous steps
      if (!req.session.signupData?.contactInfo || !req.session.signupData?.serviceAddress || !req.session.signupData?.propertyInfo) {
        return res.status(400).json({ message: "Please complete all previous steps first" });
      }
      
      const { contactInfo, serviceAddress, propertyInfo } = req.session.signupData;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(contactInfo.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...contactInfo,
        password: hashedPassword,
      });
      
      // Create service address
      const address = await storage.createAddress({
        userId: user.id,
        address1: serviceAddress.address1,
        address2: serviceAddress.address2,
        city: serviceAddress.city,
        state: serviceAddress.state,
        zip: serviceAddress.zip,
        country: serviceAddress.country,
        isServiceAddress: true,
        isBillingAddress: serviceAddress.sameBillingAddress,
      });
      
      // If billing address is different, create it
      if (!serviceAddress.sameBillingAddress && req.body.billingAddress) {
        await storage.createAddress({
          userId: user.id,
          ...req.body.billingAddress,
          isServiceAddress: false,
          isBillingAddress: true,
        });
      }
      
      // Create property
      await storage.createProperty({
        userId: user.id,
        addressId: address.id,
        ...propertyInfo,
      });
      
      // Get selected plan
      const plan = await storage.getPlan(paymentInfo.planId);
      if (!plan) {
        return res.status(400).json({ message: "Selected plan not found" });
      }
      
      // Create subscription (free trial initially)
      const startDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 15); // 15-day trial
      
      await storage.createSubscription({
        userId: user.id,
        planId: paymentInfo.planId,
        startDate,
        endDate: null,
        isActive: true,
        isMonthlyBilling: !paymentInfo.isMonthlyBilling,
        promoCode: paymentInfo.promoCode,
      });
      
      // Clear signup session data
      delete req.session.signupData;
      
      // Log the user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after signup" });
        }
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        res.status(201).json({ 
          message: "Account created successfully", 
          user: userWithoutPassword,
          trialEndDate
        });
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Plans
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getPlans();
      res.json({ plans });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = contactFormSchema.parse(req.body);
      await storage.createContact(contactData);
      res.status(201).json({ message: "Contact message sent successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User dashboard data
  app.get("/api/dashboard", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const addresses = await storage.getAddresses(user.id);
      const properties = await storage.getProperties(user.id);
      const subscriptions = await storage.getSubscriptions(user.id);
      
      const activeSubscription = await storage.getActiveSubscription(user.id);
      let plan = null;
      if (activeSubscription) {
        plan = await storage.getPlan(activeSubscription.planId);
      }
      
      res.json({
        addresses,
        properties,
        subscriptions,
        activeSubscription,
        plan,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment intent for subscription
  app.post("/api/create-subscription", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const { planId, isMonthlyBilling } = req.body;
      
      const plan = await storage.getPlan(planId);
      if (!plan) {
        return res.status(400).json({ message: "Selected plan not found" });
      }
      
      // Get or create customer
      let customerId = user.stripeCustomerId;
      
      if (!customerId) {
        // Create a new customer
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          metadata: {
            userId: user.id.toString(),
          },
        });
        
        customerId = customer.id;
        await storage.updateStripeCustomerId(user.id, customerId);
      }
      
      // Get price ID based on billing frequency
      const priceId = isMonthlyBilling ? plan.stripePriceId : plan.stripeQuarterlyPriceId;
      
      if (!priceId) {
        return res.status(400).json({ message: "This plan requires custom pricing. Please contact sales." });
      }
      
      // Create a subscription with a trial period
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days: 15, // 15-day free trial
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
      
      // Update user with subscription ID
      await storage.updateStripeSubscriptionId(user.id, subscription.id);
      
      // Create a record in our database
      const startDate = new Date();
      await storage.createSubscription({
        userId: user.id,
        planId,
        startDate,
        endDate: null,
        isActive: true,
        isMonthlyBilling: !isMonthlyBilling,
        promoCode: req.body.promoCode,
      });
      
      res.json({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Stripe webhook (for subscription events)
  app.post("/api/stripe-webhook", async (req, res) => {
    let event;
    
    try {
      // Verify webhook signature
      const signature = req.headers["stripe-signature"] as string;
      
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.warn("Warning: STRIPE_WEBHOOK_SECRET not set. Skipping signature verification.");
        event = req.body;
      } else {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      }
      
      // Handle the event
      switch (event.type) {
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object;
          console.log(`Subscription ${subscription.id} was ${event.type.split(".")[2]}`);
          // Update subscription status
          break;
        
        case "invoice.payment_succeeded":
          const invoice = event.data.object;
          console.log(`Invoice ${invoice.id} payment succeeded`);
          // Handle successful payment
          break;
          
        case "invoice.payment_failed":
          const failedInvoice = event.data.object;
          console.log(`Invoice ${failedInvoice.id} payment failed`);
          // Handle failed payment
          break;
          
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      
      res.json({ received: true });
    } catch (error: any) {
      console.error(`Webhook error: ${error.message}`);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
