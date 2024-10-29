import mongoose, { Document, Model } from 'mongoose';

interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  topic: string;
  message: string;
  createdAt: Date;
  error: string;
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
  }
});

const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema);

export default Contact;
