import { model, Schema } from 'mongoose';

const ApiKeySchema: Schema = new Schema({
		key: {
			type: String,
			required: true,
			index: true,
		},
		email: {
			type: String,
			required: true,
		}
	},
	{
		timestamps: true,
	},
);

export const ApiKey = model('ApiKey', ApiKeySchema);
