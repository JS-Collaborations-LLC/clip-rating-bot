const mongoose = require('mongoose');
require('dotenv').config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
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
  ratings: [{
    rating: { type: Number, required: true, min: 1, max: 5 },
    ratedBy: { type: String, required: true }, // Discord user ID
    ratedAt: { type: Date, default: Date.now }
  }]
});

// Model creation
const Clip = mongoose.model('Clip', ClipSchema);

// Database operations
const db = {
  // Store a new clip
  storeClip: async (url, description, submittedBy) => {
    const newClip = new Clip({ url, description, submittedBy });
    return await newClip.save();
  },

  // Add a rating to a clip
  addRating: async (clipId, rating, ratedBy) => {
    return await Clip.findByIdAndUpdate(
      clipId,
      { $push: { ratings: { rating, ratedBy } } },
      { new: true }
    );
  },

  // Get all clips
  getAllClips: async () => {
    return await Clip.find();
  },

  // Get a specific clip by ID
  getClipById: async (clipId) => {
    return await Clip.findById(clipId);
  },

  // Get clips submitted by a specific user
  getClipsByUser: async (userId) => {
    return await Clip.find({ submittedBy: userId });
  },

  // Get average rating for a clip
  getAverageRating: async (clipId) => {
    const clip = await Clip.findById(clipId);
    if (!clip || clip.ratings.length === 0) return 0;
    const sum = clip.ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / clip.ratings.length;
  },

  // Get all ratings for a clip
  getRatingsForClip: async (clipId) => {
    const clip = await Clip.findById(clipId);
    return clip ? clip.ratings : [];
  },

  // Get clips sorted by average rating
  getClipsSortedByRating: async () => {
    return await Clip.aggregate([
      { $unwind: "$ratings" },
      { $group: { _id: "$_id", avgRating: { $avg: "$ratings.rating" }, clip: { $first: "$$ROOT" } } },
      { $sort: { avgRating: -1 } }
    ]);
  }
};

module.exports = { connectDB, db };
