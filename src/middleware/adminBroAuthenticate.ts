import { Users } from 'src/api/models';

export const adminBroAuthenticate = async (email: string, password: string) => {
    const user: any = await Users.findOne({email});
    if (user) {
        const matched = (password === user.password);
        if (matched) {
            return user;
        }
        return false;
    }
    return false;
};
