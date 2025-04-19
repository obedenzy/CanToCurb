CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    role TEXT NOT NULL,
    stripeCustomerId TEXT,
    stripeSubscriptionId TEXT
);

CREATE TABLE plans (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    monthlyPrice INTEGER NOT NULL,
    quarterlyPrice INTEGER NOT NULL,
    maxCans INTEGER NOT NULL,
    stripePriceIdMonthly TEXT NOT NULL,
    stripePriceIdQuarterly TEXT NOT NULL,
    isPopular BOOLEAN DEFAULT FALSE,
    features JSONB
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY,
    userId UUID NOT NULL REFERENCES users(id),
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL
);

CREATE TABLE properties (
    id UUID PRIMARY KEY,
    addressId UUID NOT NULL REFERENCES addresses(id),
    propertyType TEXT NOT NULL,
    specialInstructions TEXT
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    userId UUID NOT NULL REFERENCES users(id),
    planId UUID NOT NULL REFERENCES plans(id),
    status TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    nextBillingDate TIMESTAMP NOT NULL
);

CREATE TABLE contacts (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL
);

CREATE TABLE serviceRecords (
    id UUID PRIMARY KEY,
    userId UUID NOT NULL REFERENCES users(id),
    propertyId UUID NOT NULL REFERENCES properties(id),
    assignedStaffId UUID REFERENCES users(id),
    scheduledDate TIMESTAMP NOT NULL,
    serviceType TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT
);