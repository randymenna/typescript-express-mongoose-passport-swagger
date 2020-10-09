import passportCustom from 'passport-custom';
import { ApiKey } from '../../../../api/auth/apiKey/apiKey.model';
import { User } from '../../../../api/user/user.model';

const CustomStrategy = passportCustom.Strategy;

const API_FIELD = 'apikey';
const API_HEADER = 'apikey';

export const apiKeyInHeaderBodyQueryStrategy = new CustomStrategy(
    async (req, done) => {
        try {
            const apiKey = req.body[API_FIELD]
                || req.query[API_FIELD]
                || req.headers[API_HEADER];

            if (!apiKey) {
                // @ts-ignore
                return done(null, false, {message: 'missing api key.'});
            }

            const validKey = await ApiKey.findOne({key: apiKey});
            if (!validKey) {
                // @ts-ignore
                return done(null, false, {message: 'invalid api key.'});
            }
            // @ts-ignore
            const user = await User.findOne({email: validKey.email});
            if (!user) {
                // @ts-ignore
                return done(null, false, {message: 'invalid username.'});
            }
            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
    }
);
