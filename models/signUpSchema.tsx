import mongoose from 'mongoose';

const signUpSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Username is required'],
		unique: true,
		trim: true,
		minlength: [3, 'Username must be at least 3 characters long'],
		maxlength: [20, 'Username cannot exceed 20 characters'],
		validate: {
			validator: function(v: string) {
				return /^[a-zA-Z0-9_]+$/.test(v);
			},
			message: props => `${props.value} is not a valid username. Use only letters, numbers, and underscores.`
		}
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
		required: [true, 'Password is required'],
		minlength: [8, 'Password must be at least 8 characters long'],
		validate: {
			validator: function(v: string) {
				return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
			},
			message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
		}
	},
	confirmPassword: {
		type: String,
		required: [true, 'Confirm password is required'],
		validate: {
			validator: function(this: mongoose.Document & { password: string }, el: string) {
				return el === this.password;
			},
			message: 'Passwords do not match'
		}
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

signUpSchema.pre('save', function(this: mongoose.Document & { confirmPassword?: string }, next) {
	if (this.isModified('password')) {
		this.confirmPassword = undefined;
	}
	next();
});

const SignUp = mongoose.models.SignUp || mongoose.model('SignUp', signUpSchema);

export default SignUp;
