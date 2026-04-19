require("dotenv").config();
const app = require("./src/app");
const { connectDatabase, isMongoReady } = require("./src/config/database");
const { initializeMemoryStore } = require("./src/data/memoryStore");
const seedDatabase = require("./src/data/seedDatabase");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await initializeMemoryStore();
  await connectDatabase();

  if (isMongoReady() && process.env.SEED_DATABASE !== "false") {
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`Backend listening on http://127.0.0.1:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
