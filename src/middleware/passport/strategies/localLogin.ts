import { User } from '../../../api/user/user.model';

/**
 * @swagger
 *  components:
 *    schemas:
 *      LocalLoginRequestBody:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *          password:
 *            type: string
 *        example:
 *           email: barney@bedrock.com
 *           password: secretPasswod
 */

export const localLogin = async (email: string, password: string, done: Function) => {
    try {
        const user = await User.findOne({email});
        if (!user) {
            return done(null, false, {message: 'Incorrect username.'});
        }
        // @ts-ignore
        const storedPassword = await user.password;
        if (!(storedPassword === password)) {
            return done(null, false, {message: 'Incorrect password.'});
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
};
