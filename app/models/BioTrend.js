import mongoose from 'mongoose';

const bioTrendSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    bioAge: {
      type: Number,
      required: true,
    },
    chronologicalAge: {
      type: Number,
    },
    ageDifference: {
      type: Number,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'BIOTREND',
  }
);

export default mongoose.models.BioTrend || mongoose.model('BioTrend', bioTrendSchema);