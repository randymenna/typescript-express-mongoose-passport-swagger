export const isAdmin = (req: any, res: any, next: any) => {
    if (!req.user || !req.user.isSuperUser) {
        res.send(401);
    } else {
        next();
    }
};
