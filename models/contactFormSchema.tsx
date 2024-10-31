import mongoose, { Document, Model } from 'mongoose';

interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  topic: string;
  message: string;
  createdAt: Date;
  error: string;
  isRead: boolean;
  isStarred: boolean;
  lastReadAt: Date;
  lastStarredAt: Date;
}

const contactSchema = new mongoose.Schema<IContact>({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    trim: true
  },
  topic: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  error: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  isStarred: {
    type: Boolean,
    default: false,
    index: true
  },
  lastReadAt: {
    type: Date,
    default: null
  },
  lastStarredAt: {
    type: Date,
    default: null
  }
});

// Add indexes for better query performance
contactSchema.index({ isRead: 1, lastReadAt: 1 });
contactSchema.index({ isStarred: 1, lastStarredAt: 1 });

const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema);

export default Contact;
