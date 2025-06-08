const mongoose = require('mongoose');

const PlatformSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
  followers: {
    type: Number,
    required: true,
  },
  engagementRate: {
    type: Number,
    required: true,
  },
  pastCollaborations: [
    {
      type: String,
    },
  ],
});

const InfluencerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    languages: [
      {
        type: String,
      },
    ],
    profileImage: {
      type: String,
    },
    rating: {
      type: Number,
    },
    categories: [
      {
        type: String,
      },
    ],
    platforms: [PlatformSchema],
  },
  { timestamps: true }
);

const Influencer = mongoose.model('Influencer', InfluencerSchema);

module.exports = { Influencer };
