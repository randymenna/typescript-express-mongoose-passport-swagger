import { User } from '../../../api/user/user.model'

export const digestAuthLogin = async (username: string, password: string, done: Function) => {
    try {
        const user = await User.findOne({username});
        if (!user) {
            return done(null, false, {message: 'Incorrect username.'});
        }
        // @ts-ignore
        done(null, user, user.password);
    }
    catch (err) {
        return done(err);
    }
}

export const validateCallback = (params: any, done: Function) => {
    // validate nonces as necessary
    done(null, true)
}
