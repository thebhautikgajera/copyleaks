import mongoose, { Document, Model } from 'mongoose';

interface IAdminRegister extends Document {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
  loginAttempts: number;
  lockUntil: Date;
  incrementLoginAttempts(): Promise<void>;
}

const adminRegisterSchema = new mongoose.Schema<IAdminRegister>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm password is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
});

adminRegisterSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  // Increment login attempts
  this.loginAttempts += 1;
  
  // Lock account if more than 5 attempts
  if (this.loginAttempts >= 5) {
    // Lock for 1 hour
    this.lockUntil = new Date(Date.now() + 3600000);
  }
  
  await this.save();
};

const AdminRegister: Model<IAdminRegister> = mongoose.models.AdminRegister || mongoose.model<IAdminRegister>('AdminRegister', adminRegisterSchema);

export default AdminRegister;
