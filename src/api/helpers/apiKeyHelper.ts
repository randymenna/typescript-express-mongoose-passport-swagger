import { ApiKey } from '../apiKey/apiKey.model';

export const createApiKey = async (key: string, email: string ) => {
    const apiKey = {
        key,
        email,
    };
    try {
        const newApiKey = new ApiKey(apiKey);
        return await newApiKey.save();
    } catch (error) {
        console.error(error);
        return null;
    }
};
