const { pool } = require("./db");

class DatabaseStorage {
  // User Methods
  async getUser(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async getUserByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async createUser(userData) {
    const {
      id,
      email,
      password,
      firstName,
      lastName,
      role,
      stripeCustomerId,
      stripeSubscriptionId,
    } = userData;
    const result = await pool.query(
      "INSERT INTO users (id, email, password, firstName, lastName, role, stripeCustomerId, stripeSubscriptionId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        id,
        email,
        password,
        firstName,
        lastName,
        role,
        stripeCustomerId,
        stripeSubscriptionId,
      ]
    );
    return result.rows[0];
  }

  async updateStripeCustomerId(userId, customerId) {
    const result = await pool.query(
      "UPDATE users SET stripeCustomerId = $1 WHERE id = $2 RETURNING *",
      [customerId, userId]
    );
    return result.rows[0];
  }

  async updateStripeSubscriptionId(userId, subscriptionId) {
    const result = await pool.query(
      "UPDATE users SET stripeSubscriptionId = $1 WHERE id = $2 RETURNING *",
      [subscriptionId, userId]
    );
    return result.rows[0];
  }

  // Address Methods
  async createAddress(addressData) {
    const { userId, street, city, state, zip, latitude, longitude, id } =
      addressData;
    const result = await pool.query(
      "INSERT INTO addresses (id, userId, street, city, state, zip, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [id, userId, street, city, state, zip, latitude, longitude]
    );
    return result.rows[0];
  }

  async getAddressByUserId(userId) {
    const result = await pool.query(
      "SELECT * FROM addresses WHERE userId = $1",
      [userId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Property Methods
  async createProperty(propertyData) {
    const { id, addressId, propertyType, specialInstructions } = propertyData;
    const result = await pool.query(
      "INSERT INTO properties (id, addressId, propertyType, specialInstructions) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, addressId, propertyType, specialInstructions]
    );
    return result.rows[0];
  }

  async getPropertyByAddressId(addressId) {
    const result = await pool.query(
      "SELECT * FROM properties WHERE addressId = $1",
      [addressId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Plan Methods
  async getAllPlans() {
    const result = await pool.query("SELECT * FROM plans");
    return result.rows;
  }

  async getPlanById(planId) {
    const result = await pool.query("SELECT * FROM plans WHERE id = $1", [
      planId,
    ]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Subscription Methods
  async createSubscription(subscriptionData) {
    const { id, userId, planId, status, createdAt, nextBillingDate } =
      subscriptionData;
    const result = await pool.query(
      "INSERT INTO subscriptions (id, userId, planId, status, createdAt, nextBillingDate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id, userId, planId, status, createdAt, nextBillingDate]
    );
    return result.rows[0];
  }

  async getSubscriptionByUserId(userId) {
    const result = await pool.query(
      "SELECT * FROM subscriptions WHERE userId = $1 ORDER BY createdAt DESC LIMIT 1",
      [userId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Contact Methods
  async createContact(contactData) {
    const { id, name, email, phone, message, createdAt } = contactData;
    const result = await pool.query(
      "INSERT INTO contacts (id, name, email, phone, message, createdAt) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id, name, email, phone, message, createdAt]
    );
    return result.rows[0];
  }

  // Service Record Methods
  async createServiceRecord(recordData) {
    const {
      id,
      userId,
      propertyId,
      assignedStaffId,
      scheduledDate,
      serviceType,
      status,
      notes,
    } = recordData;
    const result = await pool.query(
      "INSERT INTO serviceRecords (id, userId, propertyId, assignedStaffId, scheduledDate, serviceType, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        id,
        userId,
        propertyId,
        assignedStaffId,
        scheduledDate,
        serviceType,
        status,
        notes,
      ]
    );
    return result.rows[0];
  }

  async getAllServiceRecords(filters = {}) {
    let query = "SELECT * FROM serviceRecords";
    const values = [];
    let whereClauses = [];

    if (filters.userId) {
      whereClauses.push(`userId = $${values.length + 1}`);
      values.push(filters.userId);
    }
    if (filters.propertyId) {
      whereClauses.push(`propertyId = $${values.length + 1}`);
      values.push(filters.propertyId);
    }
    if (filters.status) {
      whereClauses.push(`status = $${values.length + 1}`);
      values.push(filters.status);
    }
    if (filters.serviceType) {
      whereClauses.push(`serviceType = $${values.length + 1}`);
      values.push(filters.serviceType);
    }
    if (filters.startDate) {
      whereClauses.push(`scheduledDate >= $${values.length + 1}`);
      values.push(filters.startDate);
    }
    if (filters.endDate) {
      whereClauses.push(`scheduledDate <= $${values.length + 1}`);
      values.push(filters.endDate);
    }
    if (filters.assignedStaffId) {
      whereClauses.push(`assignedStaffId = $${values.length + 1}`);
      values.push(filters.assignedStaffId);
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  async getServiceRecordById(id) {
    const result = await pool.query(
      "SELECT * FROM serviceRecords WHERE id = $1",
      [id]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  async updateServiceRecord(id, updates) {
    const updateKeys = Object.keys(updates);
    const setClauses = updateKeys.map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(updates);
    values.push(id);

    const query = `UPDATE serviceRecords SET ${setClauses.join(
      ", "
    )} WHERE id = $${values.length} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async getUnassignedServiceRecords() {
    const result = await pool.query(
      "SELECT * FROM serviceRecords WHERE assignedStaffId IS NULL ORDER BY scheduledDate ASC"
    );
    return result.rows;
  }

  async getStaffMembers() {
    const result = await pool.query("SELECT * FROM users WHERE role = 'staff'");
    return result.rows;
  }
}
async function initializePlans() {
  const result = await pool.query("SELECT * FROM plans");
  const existingPlans = result.rows;
  console.log("Existing plans count: " + existingPlans.length);
  if (existingPlans.length === 0) {
    const plansData = [
      {
        name: "Starter",
        description: "Perfect for single-family homes",
        monthlyPrice: 3900,
        quarterlyPrice: 10530,
        maxCans: 2,
        stripePriceIdMonthly: "price_starter_monthly",
        stripePriceIdQuarterly: "price_starter_quarterly",
        features: [
          "Up to 2 trash/recycle cans",
          "Can-To-Curb® service",
          "Weekly service",
          "Email notifications",
        ],
      },
      {
        name: "Premium",
        description: "Ideal for larger homes",
        monthlyPrice: 5900,
        quarterlyPrice: 15930,
        maxCans: 4,
        stripePriceIdMonthly: "price_premium_monthly",
        stripePriceIdQuarterly: "price_premium_quarterly",
        isPopular: true,
        features: [
          "Up to 4 trash/recycle cans",
          "Can-To-Curb® service",
          "Weekly service",
          "Email & SMS notifications",
          "Separate trash & recycle days",
          "Priority support",
        ],
      },
      {
        name: "Business",
        description: "Perfect for small businesses",
        monthlyPrice: 7900,
        quarterlyPrice: 21330,
        maxCans: 6,
        stripePriceIdMonthly: "price_business_monthly",
        stripePriceIdQuarterly: "price_business_quarterly",
        features: [
          "Up to 6 trash/recycle cans",
          "Can-To-Curb® service",
          "Twice-weekly service",
          "Email & SMS notifications",
          "Separate trash & recycle days",
          "24/7 priority support",
          "Dedicated account manager",
        ],
      },
      {
        name: "Enterprise",
        description: "Custom solutions for large organizations",
        monthlyPrice: null,
        quarterlyPrice: null,
        maxCans: null,
        stripePriceIdMonthly: null,
        stripePriceIdQuarterly: null,
        features: [
          "Unlimited trash/recycle cans",
          "Can-To-Curb® service",
          "Custom service frequency",
          "Custom notifications",
          "Multiple locations support",
          "24/7 priority support",
          "Dedicated account team",
          "Custom reporting",
        ],
      },
    ];
    const insertPromises = plansData.map((plan) =>
      pool.query(
        "INSERT INTO plans (name, description, monthlyPrice, quarterlyPrice, maxCans, stripePriceIdMonthly, stripePriceIdQuarterly, isPopular, features) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          plan.name,
          plan.description,
          plan.monthlyPrice,
          plan.quarterlyPrice,
          plan.maxCans,
          plan.stripePriceIdMonthly,
          plan.stripePriceIdQuarterly,
          plan.isPopular || false,
          JSON.stringify(plan.features),
        ]
      )
    );
    await Promise.all(insertPromises);
    console.log("Initial plans created in database");
    }
  }

  module.exports = { DatabaseStorage, initializePlans };