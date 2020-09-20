import { model, Schema } from 'mongoose';
import { encrypt, decrypt } from '../helpers/cryptoHelper';

const UserSchema: Schema = new Schema({
		email: {
			type: String,
			required: true,
			index: true,
		},
		password: {
			type: String,
			required: true,
			// set: encrypt,
			// get: decrypt,
		},
		name: {
			type: String,
			required: true,
		},
		isSuperUser: {
			type: Boolean,
			required: false,
		},
	},
	{
		timestamps: true,
	},
);

export const User = model('User', UserSchema);
