export const getGeoJSON = (poly: any) => {
    const geoJSON = {
        type: 'Polygon',
        // @ts-ignore
        coordinates: []
    };
    const paths = poly.getPaths().getArray();

    for (const path of paths) {
        const pathArray = [];
        const points = path.getArray();
        let firstPoint: any = false;

        for (const point of points) {
            if (firstPoint === false) {
                firstPoint = point;
            }
            pathArray.push([point.lng(), point.lat()]);
        }

        if (typeof firstPoint !== 'boolean') {
            pathArray.push([firstPoint.lng(), firstPoint.lat()]);
        }

        geoJSON.coordinates.push(pathArray);
    }
    return geoJSON;
};
