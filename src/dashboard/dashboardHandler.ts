// tslint:disable-next-line:no-var-requires
import { PageHandler } from 'admin-bro';
import { Devices, Items, Locations, Users } from '../api/models';

export const dashBoardHandler = async (request: any, response: any, context: PageHandler) => {
    const users = await Users.countDocuments();
    const items = await Items.countDocuments();
    const devices = await Devices.countDocuments();
    const locations = await Locations.countDocuments();
    return {
        users,
        items,
        devices,
        locations,
    };
};
