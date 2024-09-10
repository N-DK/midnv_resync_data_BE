const getTableName = (
    tableDefault: string,
    deviceId = 1,
    time = Date.now(),
) => {
    const newDate = new Date(time);
    const currentMonth = newDate.getMonth() + 1;

    const tableNumber = Math.ceil(deviceId / 1000);

    return `${tableDefault}_${tableNumber}_${
        currentMonth == 12 ? 1 : currentMonth
    }_${
        currentMonth == 12 ? newDate.getFullYear() + 1 : newDate.getFullYear()
    }`;
};

export default getTableName;
