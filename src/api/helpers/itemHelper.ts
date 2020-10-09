import { Item } from '../item/item.model';

export const filterItemsForApp = async (app: string) => {
    let results = await Item.find();
    let filteredItems: any[] = [];
    if (results) {
        // @ts-ignore
        results = results.toJSON();
        // @ts-ignore
        filteredItems = results.filter(u => u.apps.indexOf(app) !== -1);
    }
    return filteredItems;
};

export const createItem = async (email: string, password: string, name: string, isSuperItem: boolean) => {
    const item = {
        email,
        password,
        name,
        isSuperItem,
    };

    try {
        const newItem = new Item(item);
        return await newItem.save();
    }
    catch (error) {
        console.error(error);
        return null;
    }
};

export const itemRecordAddItemToApp = async (app: string, role: string, item: any) => {
    const email = item.email;
    const apps = item.apps.slice(0);
    const roles = item.roles.slice(0);

    const idx = apps.indexOf(app);
    if (idx !== -1) {
        roles[idx] = role;
    } else {
        apps.push(app);
        roles.push(role);
    }
    await Item.update({email}, {apps, roles});
};

export const itemRecordRemoveItemFromApp = async (app: string, item: any) => {
    const email = item.email;
    const index = item.apps.indexOf(app);
    if (index !== -1) {
        const apps = item.apps.slice(0);
        const roles = item.roles.slice(0);
        apps.splice(index, 1);
        roles.splice(index, 1);
        await Item.update({email}, {apps, roles});
    }
};
