import { User } from '../user/user.model';

export const filterUsersForApp = async (app: string) => {
    let results = await User.find();
    let filteredUsers: any[] = [];
    if (results) {
        // @ts-ignore
        results = results.toJSON();
        // @ts-ignore
        filteredUsers = results.filter(u => u.apps.indexOf(app) !== -1);
    }
    return filteredUsers;
};

export const createUser = async (email: string, password: string, name: string, isSuperUser: boolean) => {
    const user = {
        email,
        password,
        name,
        isSuperUser,
    };

    try {
        const newUser = new User(user);
        return await newUser.save();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const userRecordAddUserToApp = async (app: string, role: string, user: any) => {
    const email = user.email;
    const apps = user.apps.slice(0);
    const roles = user.roles.slice(0);

    const idx = apps.indexOf(app);
    if (idx !== -1) {
        roles[idx] = role;
    } else {
        apps.push(app);
        roles.push(role);
    }
    await User.update({email}, {apps, roles});
};

export const userRecordRemoveUserFromApp = async (app: string, user: any) => {
    const email = user.email;
    const index = user.apps.indexOf(app);
    if (index !== -1) {
        const apps = user.apps.slice(0);
        const roles = user.roles.slice(0);
        apps.splice(index, 1);
        roles.splice(index, 1);
        await User.update({email}, {apps, roles});
    }
};
