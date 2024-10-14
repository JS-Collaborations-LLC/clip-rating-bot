const mongoose = require('mongoose');

async function migrateClips() {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('clips');

    const result = await collection.updateMany(
      { interactionId: { $exists: false } },
      [
        { $set: {
            interactionId: { $toString: "$_id" },
            messageId: { $toString: "$_id" }
          }
        }
      ]
    );

    console.log(`Migration complete. ${result.modifiedCount} documents updated.`);
  } catch (error) {
    console.error('Error during database migration:', error);
    throw error;
  }
}

module.exports = { migrateClips };

