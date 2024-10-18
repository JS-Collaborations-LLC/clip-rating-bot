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
  interactionId: { type: String, required: true, unique: true },
  messageId: { type: String, required: true },
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
  storeClip: async (url, description, submittedBy, interactionId, messageId) => {
    try {
      const newClip = new Clip({ 
        url, 
        description, 
        submittedBy,
        submittedAt: new Date(),  
        interactionId, 
        messageId 
      });
      return await newClip.save();
    } catch (error) {
      console.error('Error storing clip:', error);
      throw error;
    }
  },

  // Add a rating to a clip
  addRating: async (messageId, rating, ratedBy) => {
    try {
      const clip = await Clip.findOne({messageId: messageId});  
      if (!clip) {
        throw new Error('Clip not found');
      }

      const existingRatingIndex = clip.ratings.findIndex(r => r.ratedBy === ratedBy);

      if (existingRatingIndex !== -1) {
        // Update existing rating
        clip.ratings[existingRatingIndex].rating = rating;
        clip.ratings[existingRatingIndex].ratedAt = new Date();
      } else {
        // Add new rating
        clip.ratings.push({ rating, ratedBy, ratedAt: new Date() });
      }

      return await clip.save();
    } catch (error) {
      console.error('Error adding/updating rating:', error);
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
  getClipById: async (mongoID) => {
    try {
      return await Clip.findById(mongoID);
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
  getAverageRating: async (messageId) => {
    try {
      const clip = await Clip.findOne({messageId: messageId});
      if (!clip || clip.ratings.length === 0) return 0;
      const sum = clip.ratings.reduce((acc, r) => acc + r.rating, 0);
      return sum / clip.ratings.length;
    } catch (error) {
      console.error('Error getting average rating:', error);
      throw error;
    }
  },

  // Get all ratings for a clip
  getRatingsForClip: async (messageId) => {
    try {
      const clip = await Clip.findOne({messageId: messageId});
      return clip ? clip.ratings : [];
    } catch (error) {
      console.error('Error getting ratings for clip:', error);
      throw error;
    }
  },

  // Get clips sorted by average rating
  getClipsSortedByRating: async () => {
    return await Clip.aggregate([
      { $unwind: "$ratings" },
      { $group: { _id: "$_id", avgRating: { $avg: "$ratings.rating" }, clip: { $first: "$$ROOT" } } },
      { $sort: { avgRating: -1 } }
    ]);
  },

  // Get clip by message ID
  getClipByMessageId: async (messageId) => {
    try {
      return await Clip.findOne({ messageId: messageId });
    } catch (error) {
      console.error('Error getting clip by message ID:', error);
      throw error;
    }
  },

  // Get clip by interaction ID
  getClipByInteractionId: async (interactionId) => {
    try {
      return await Clip.findOne({ interactionId: interactionId });
    } catch (error) {
      console.error('Error getting clip by interaction ID:', error);
      throw error;
    }
  },

  updateRating: async (messageId, rating, ratedBy) => {
    try {
      const result = await Clip.findOneAndUpdate(
        { messageId: messageId, 'ratings.ratedBy': ratedBy },
        { 
          $set: { 
            'ratings.$.rating': rating,
            'ratings.$.ratedAt': new Date()
          }
        },
        { new: true }
      );

      if (!result) {
        throw new Error('Clip not found or user has not rated this clip yet');
      }

      return result;
    } catch (error) {
      console.error('Error updating rating:', error);
      throw error;
    }
  },

  removeRating: async (messageId, ratedBy) => {
    try {
      const result = await Clip.findOneAndUpdate(
        { messageId: messageId },
        { $pull: { ratings: { ratedBy: ratedBy } } },
        { new: true }
      );

      if (!result) {
        throw new Error('Clip not found or user has not rated this clip');
      }

      return result;
    } catch (error) {
      console.error('Error removing rating:', error);
      throw error;
    }
  },

  removeClip: async (messageId) => {
    try {
      const result = await Clip.findOneAndDelete({messageId: messageId});

      if (!result) {
        throw new Error('Clip not found');
      }

      return result;
    } catch (error) {
      console.error('Error removing clip:', error);
      throw error;
    }
  }
};

module.exports = { connectDB, db };
