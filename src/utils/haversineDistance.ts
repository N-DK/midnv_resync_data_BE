export const haversineDistance = (
    lat_: number,
    lon_: number,
    _lat__: number,
    _lon__: number,
) => {
    const toRad = (angle: number) => angle * (Math.PI / 180);

    const R = 6371;
    const dLat = toRad(_lat__ - lat_);
    const dLon = toRad(_lon__ - lon_);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat_)) *
            Math.cos(toRad(_lat__)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
};
