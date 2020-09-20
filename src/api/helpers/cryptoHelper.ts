import crypto from 'crypto';

export const encrypt = (text: string) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPTION_KEY), process.env.IV);
    let crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

export const decrypt = (text: string) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc',Buffer.from(process.env.ENCRYPTION_KEY), process.env.IV)
    let dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}
