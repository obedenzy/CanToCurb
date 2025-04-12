import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import bcrypt from "bcrypt";
import { insertUserSchema, insertAddressSchema, insertPropertySchema, insertContactSchema } from "@shared/schema";
import { ZodError } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY. Stripe functionality will be limited.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session management
  const SessionStore = MemoryStore(session);
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key-for-development',
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  // Set up passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  // Helper for error handling
  const handleError = (res: Response, error: any) => {
    console.error('API Error:', error);
    
    if (error instanceof ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    return res.status(500).json({ 
      message: error.message || 'Internal server error' 
    });
  };

  // Auth routes
  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || 'Authentication failed' });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Remove sensitive info before sending back
        const safeUser = { ...user };
        delete safeUser.password;
        
        return res.json({ message: 'Logged in successfully', user: safeUser });
      });
    })(req, res, next);
  });
  
  app.post('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });
  
  // Check auth status
  app.get('/api/auth-status', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ authenticated: false });
    }
    
    // Remove sensitive info before sending back
    const safeUser = { ...req.user };
    delete (safeUser as any).password;
    
    res.json({ 
      authenticated: true, 
      user: safeUser
    });
  });
  
  // User registration route
  app.post('/api/register', async (req, res) => {
    try {
      const userInput = insertUserSchema.parse(req.body);
      
      // Check if email is already registered
      const existingUser = await storage.getUserByEmail(userInput.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userInput.password, 10);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...userInput,
        password: hashedPassword
      });
      
      // Log the user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Authentication error" });
        }
        
        // Remove sensitive info before sending back
        const safeUser = { ...user };
        delete safeUser.password;
        
        return res.status(201).json({ 
          message: "Registration successful", 
          user: safeUser 
        });
      });
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Address registration route
  app.post('/api/address', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const addressInput = insertAddressSchema.parse(req.body);
      const address = await storage.createAddress({
        ...addressInput,
        userId: (req.user as any).id
      });
      
      res.status(201).json({ 
        message: "Address saved successfully", 
        address 
      });
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Property registration route
  app.post('/api/property', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const propertyInput = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty({
        ...propertyInput,
        userId: (req.user as any).id
      });
      
      res.status(201).json({ 
        message: "Property saved successfully", 
        property 
      });
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Get plans
  app.get('/api/plans', async (req, res) => {
    try {
      const plans = await storage.getAllPlans();
      res.json(plans);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Get user information
  app.get('/api/user', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const user = await storage.getUser((req.user as any).id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive info before sending back
      const safeUser = { ...user };
      delete safeUser.password;
      
      // Get associated data
      const address = await storage.getAddressByUserId(user.id);
      let property = null;
      if (address) {
        property = await storage.getPropertyByAddressId(address.id);
      }
      const subscription = await storage.getSubscriptionByUserId(user.id);
      
      res.json({
        user: safeUser,
        address,
        property,
        subscription
      });
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const contactInput = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactInput);
      
      res.status(201).json({ 
        message: "Contact form submitted successfully", 
        contactId: contact.id 
      });
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Stripe integration
  if (stripe) {
    // Create subscription intent
    app.post('/api/create-subscription', async (req, res) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      try {
        const { planId, paymentMethod, billingCycle } = req.body;
        
        if (!planId || !paymentMethod || !billingCycle) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        
        const user = await storage.getUser((req.user as any).id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        const plan = await storage.getPlanById(Number(planId));
        if (!plan) {
          return res.status(404).json({ message: "Plan not found" });
        }
        
        // Determine which Stripe price ID to use
        const stripePriceId = billingCycle === 'quarterly' 
          ? plan.stripePriceIdQuarterly 
          : plan.stripePriceIdMonthly;
          
        if (!stripePriceId) {
          return res.status(400).json({ message: "Custom pricing plan requires contacting sales" });
        }
        
        // Create or retrieve Stripe customer
        let customerId = user.stripeCustomerId;
        
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            phone: user.phone,
            payment_method: paymentMethod,
            invoice_settings: {
              default_payment_method: paymentMethod,
            },
          });
          
          customerId = customer.id;
          await storage.updateStripeCustomerId(user.id, customerId);
        } else {
          // Update payment method if customer exists
          await stripe.paymentMethods.attach(paymentMethod, {
            customer: customerId,
          });
          
          await stripe.customers.update(customerId, {
            invoice_settings: {
              default_payment_method: paymentMethod,
            },
          });
        }
        
        // Create subscription
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: stripePriceId }],
          payment_behavior: 'default_incomplete',
          payment_settings: {
            payment_method_types: ['card'],
            save_default_payment_method: 'on_subscription',
          },
          expand: ['latest_invoice.payment_intent'],
        });
        
        // Update user with subscription ID
        await storage.updateStripeSubscriptionId(user.id, subscription.id);
        
        // Store subscription in our database
        await storage.createSubscription({
          userId: user.id,
          planId: String(plan.id),
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null
        });
        
        // Return client secret for the payment intent
        const invoice = subscription.latest_invoice as any;
        const clientSecret = invoice?.payment_intent?.client_secret;
        
        res.json({
          subscriptionId: subscription.id,
          clientSecret,
        });
      } catch (error) {
        handleError(res, error);
      }
    });
    
    // Alternative one-time payment if needed
    app.post('/api/create-payment-intent', async (req, res) => {
      try {
        const { amount } = req.body;
        
        if (!amount) {
          return res.status(400).json({ message: "Amount is required" });
        }
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
        });
        
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error) {
        handleError(res, error);
      }
    });
  }

  // ADMIN API ROUTES
  
  // Middleware to check for admin or staff privileges
  const requireAdminOrStaff = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = req.user as any;
    if (user.role !== "admin" && user.role !== "staff") {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }
    
    next();
  };
  
  // Admin dashboard - get all service records with optional filters
  app.get("/api/admin/service-records", requireAdminOrStaff, async (req, res) => {
    try {
      const { 
        userId, 
        propertyId, 
        status, 
        serviceType, 
        startDate, 
        endDate, 
        assignedStaffId 
      } = req.query;
      
      const filters: any = {};
      
      if (userId) filters.userId = Number(userId);
      if (propertyId) filters.propertyId = Number(propertyId);
      if (status) filters.status = status as string;
      if (serviceType) filters.serviceType = serviceType as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      if (assignedStaffId) filters.assignedStaffId = Number(assignedStaffId);
      
      const records = await storage.getAllServiceRecords(filters);
      res.json(records);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Admin dashboard - get a specific service record
  app.get("/api/admin/service-records/:id", requireAdminOrStaff, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const record = await storage.getServiceRecordById(id);
      
      if (!record) {
        return res.status(404).json({ message: "Service record not found" });
      }
      
      res.json(record);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Admin dashboard - update a service record
  app.patch("/api/admin/service-records/:id", requireAdminOrStaff, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = req.body;
      
      const updatedRecord = await storage.updateServiceRecord(id, updates);
      res.json(updatedRecord);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Admin dashboard - get unassigned service records
  app.get("/api/admin/unassigned-service-records", requireAdminOrStaff, async (req, res) => {
    try {
      const unassignedRecords = await storage.getUnassignedServiceRecords();
      res.json(unassignedRecords);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Admin dashboard - get all staff members
  app.get("/api/admin/staff", requireAdminOrStaff, async (req, res) => {
    try {
      const staffMembers = await storage.getStaffMembers();
      res.json(staffMembers);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Create service record
  app.post("/api/service-records", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = req.user as any;
      const serviceRecord = await storage.createServiceRecord({
        ...req.body,
        userId: user.id
      });
      
      res.status(201).json(serviceRecord);
    } catch (error) {
      handleError(res, error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
