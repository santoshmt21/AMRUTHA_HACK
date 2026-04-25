import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dob: {
      type: String,
    },
    age: {
      type: Number,
    },
    sex: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    allergies: {
      type: String,
    },
    bloodPressure: {
      type: String,
    },
    heartRate: {
      type: Number,
    },
    bloodSugar: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'profile',
  }
);

export default mongoose.models.Profile || mongoose.model('Profile', profileSchema);
