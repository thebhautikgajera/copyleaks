import mongoose, { Document, Model } from 'mongoose';

interface IRegister extends Document {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  createdAt: Date;
}

const registerSchema = new mongoose.Schema<IRegister>({
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
  }
});

const Register: Model<IRegister> = mongoose.models.Register || mongoose.model<IRegister>('Register', registerSchema);

export default Register;
