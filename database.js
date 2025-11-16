const { MongoClient } = require("mongodb");

// Use the secret from GitHub Actions or environment variable
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function saveMessage(text) {
  try {
    await client.connect();

    // Access (or create) database and collection
    const db = client.db("kinddropDB");
    const messages = db.collection("messages");

    // Insert a message
    const result = await messages.insertOne({ text });
    console.log("Saved message with ID:", result.insertedId);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

// Example test
saveMessage("Hello from kinddrop-web!");
