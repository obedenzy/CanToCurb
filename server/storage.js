
const { DatabaseStorage, initializePlans } = require("./database-storage");

// Use Database storage
const storage = new DatabaseStorage();

// Initialize database with plans
initializePlans().catch(err => {
  console.error("Failed to initialize plans:", err);
});

module.exports = { storage };
