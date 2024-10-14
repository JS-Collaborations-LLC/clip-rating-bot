const mongoose = require('mongoose');
require('dotenv').config();
const { migrateClips } = require('./dbMigration');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    
    // Run migration after successful connection
    await migrateClips();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Schema definitions
const ClipSchema = new mongoose.Schema({
  url: { type: String, required: true },
  description: { type: String, required: true },
  submittedBy: { type: String, required: true }, // Discord user ID
  submittedAt: { type: Date, default: Date.now },
  interactionId: { type: String, required: true, unique: true },
  messageId: { type: String, required: true, unique: true },
  ratings: [{
    rating: { type: Number, required: true, min: 1, max: 5 },
    ratedBy: { type: String, required: true }, // Discord user ID
    ratedAt: { type: Date, default: Date.now }
  }]
});

// Add indexes for faster lookups
ClipSchema.index({ interactionId: 1 });
ClipSchema.index({ messageId: 1 });

// Model creation
const Clip = mongoose.model('Clip', ClipSchema);

// Database operations
const db = {
  // Store a new clip
  storeClip: async (url, description, submittedBy, interactionId, messageId) => {
    try {
      const newClip = new Clip({ url, description, submittedBy, interactionId, messageId });
      return await newClip.save();
    } catch (error) {
      console.error('Error storing clip:', error);
      throw error;
    }
  },

  // Add a rating to a clip
  addRating: async (clipId, rating, ratedBy) => {
    try {
      return await Clip.findByIdAndUpdate(
        clipId,
        { $push: { ratings: { rating, ratedBy } } },
        { new: true }
      );
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  },

  // Get all clips
  getAllClips: async () => {
    try {
      return await Clip.find();
    } catch (error) {
      console.error('Error getting all clips:', error);
      throw error;
    }
  },

  // Get a specific clip by ID
  getClipById: async (clipId) => {
    try {
      return await Clip.findById(clipId);
    } catch (error) {
      console.error('Error getting clip by ID:', error);
      throw error;
    }
  },

  // Get clips submitted by a specific user
  getClipsByUser: async (userId) => {
    try {
      return await Clip.find({ submittedBy: userId });
    } catch (error) {
      console.error('Error getting clips by user:', error);
      throw error;
    }
  },

  // Get average rating for a clip
  getAverageRating: async (clipId) => {
    try {
      const clip = await Clip.findById(clipId);
      if (!clip || clip.ratings.length === 0) return 0;
      const sum = clip.ratings.reduce((acc, r) => acc + r.rating, 0);
      return sum / clip.ratings.length;
    } catch (error) {
      console.error('Error getting average rating:', error);
      throw error;
    }
  },

  // Get all ratings for a clip
  getRatingsForClip: async (clipId) => {
    try {
      const clip = await Clip.findById(clipId);
      return clip ? clip.ratings : [];
    } catch (error) {
      console.error('Error getting ratings for clip:', error);
      throw error;
    }
  },

  // Get clips sorted by average rating
  getClipsSortedByRating: async () => {
    try {
      return await Clip.aggregate([
        { $addFields: { avgRating: { $avg: "$ratings.rating" } } },
        { $sort: { avgRating: -1 } }
      ]);
    } catch (error) {
      console.error('Error getting clips sorted by rating:', error);
      throw error;
    }
  },

  getClipByInteractionId: async (interactionId) => {
    try {
      return await Clip.findOne({ interactionId });
    } catch (error) {
      console.error('Error getting clip by interaction ID:', error);
      throw error;
    }
  },

  getClipByMessageId: async (messageId) => {
    try {
      return await Clip.findOne({ messageId });
    } catch (error) {
      console.error('Error getting clip by message ID:', error);
      throw error;
    }
  }
};

module.exports = { connectDB, db };
