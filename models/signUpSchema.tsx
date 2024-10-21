import mongoose, { Document } from 'mongoose';

interface ISignUp extends Document {
	username: string;
	email: string;
	password: string;
	confirmPassword?: string;
	createdAt: Date;
}

const signUpSchema = new mongoose.Schema<ISignUp>({
    username: {
		type: String,
		required: [true, 'Username is required'],
		unique: true,
		trim: true,
		minlength: [3, 'Username must be at least 3 characters long'],
		maxlength: [20, 'Username cannot exceed 20 characters'],
		match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
		validate: {
		  validator: function(this: ISignUp, value: string) {
			return value.toLowerCase() !== 'admin';
		  },
		  message: 'The username "admin" is not allowed'
		}
	  },
	  email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
		trim: true,
		lowercase: true,
		match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address']
	  },
	  password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: [8, 'Password must be at least 8 characters long'],
		match: [
		  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
		  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
		]
	  },
	  confirmPassword: {
		type: String,
		required: [true, 'Confirm password is required'],
		validate: {
		  validator: function(this: ISignUp, value: string) {
			return this.password === value;
		  },
		  message: 'Passwords do not match'
		}
	  },
	  createdAt: {
		type: Date,
		default: Date.now
	  }
});

// Remove the confirmPassword field before saving
signUpSchema.pre<ISignUp>('save', function(next) {
	this.confirmPassword = undefined;
	next();
  });

const SignUp = mongoose.models.SignUp || mongoose.model<ISignUp>('SignUp', signUpSchema);

export default SignUp;
