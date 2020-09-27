import * as jwt from 'jsonwebtoken';
import { User } from '../../../api/user/user.model';

export const bearerToken = async (token: string, done: Function) => {
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({email: decoded.data.email});
        if (!user) {
            return done(null, false, {message: 'invalid id'});
        }
        return done(null, user, {scope: 'all'});
    }
    catch (err) {
        return done(err);
    }
}


