import { ApiKey } from '../apiKey/apiKey.model';

export const createApiKey = async (key: string, email: string ) => {
    const apiKey = {
        key,
        email,
    };
    const newApiKey = new ApiKey(apiKey);
    return await newApiKey.save();
};
