import * as jwt from 'jsonwebtoken'

export const generateToken = (user: any) => {
    const data = {
        _id: user._id,
        name: user.name,
        email: user.email
    };
    const signature = process.env.JWT_SECRET;
    const expiration = process.env.JWT_EXPIRATION;

    return jwt.sign({data,}, signature, {expiresIn: expiration});
}
