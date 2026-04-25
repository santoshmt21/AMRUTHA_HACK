import mongoose from 'mongoose';

const resourceLibrarySchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    doctorName: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Report date is required'],
    },
    subject: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    driveFileId: {
      type: String,
      required: true,
      trim: true,
    },
    driveLink: {
      type: String,
      required: true,
      trim: true,
    },
    downloadLink: {
      type: String,
      trim: true,
    },
    driveFileName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'RESOURCE_LIBRARY',
  }
);

export default mongoose.models.ResourceLibrary || mongoose.model('ResourceLibrary', resourceLibrarySchema);
