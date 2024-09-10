const moment = require('moment');

const getTime = {
    currDate: function () {
        return moment(new Date()).format('YYYY-MM-DD');
    },
    currTime: function () {
        return moment(new Date()).format('HH:mm:ss');
    },
    current: function () {
        return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    },
    currentUnix: function () {
        const strDate = new Date();

        return Math.floor(strDate.getTime() / 1000);
    },
    startDateUnix: function () {
        const strDate = new Date(`${this.currDate()} 00:00:00`);

        return Math.floor(strDate.getTime() / 1000);
    },
    endDate: function () {
        return moment(new Date()).format('YYYY-MM-DD 23:59:59');
    },
    endDateUnix: function () {
        const strDate = new Date(`${this.currDate()} 23:59:59`);

        return Math.floor(strDate.getTime() / 1000);
    },
    currentM: function () {
        return moment(new Date()).format('YYYY-MM-DD HH:mm');
    },
    date: function (date: Date) {
        return moment(date).format('YYYY-MM-DD');
    },
    time: function (date: Date) {
        return moment(date).format('HH:mm:ss');
    },
    timeHm: function (date: Date) {
        return moment(date).format('HH:mm');
    },
    Unix2String: function (value: any) {
        return moment.unix(value).format('YYYY-MM-DD HH:mm:ss');
    },
    Unix2StringFormat: function (value: any) {
        return moment.unix(value).format('HH:mm:ss DD/MM/YYYY');
    },
    format: function (
        date: Date,
        type = { time: 'HH:mm:ss', date: 'DD/MM/YYYY' },
    ) {
        const isValidDate = moment(date, true).isValid();

        return isValidDate
            ? moment(date).format(`${type.time} ${type.date}`)
            : date;
    },
    formatDate: function (date: Date) {
        return moment(date).format('DD/MM/YYYY');
    },
    formatTime: function (date: Date) {
        return moment(date).format('HH:mm:ss');
    },

    String2Unit: function (value: any) {
        const date = new Date(value);
        return Math.floor(date.getTime() / 1000);
    },
    calculateTime: function (totalSeconds: number) {
        const day = 86400;
        const hour = 3600;
        const minute = 60;

        const daysOut = Math.floor(totalSeconds / day);
        const hoursOut = Math.floor((totalSeconds - daysOut * day) / hour);
        const minutesOut = Math.floor(
            (totalSeconds - daysOut * day - hoursOut * hour) / minute,
        );
        const secondsOut =
            totalSeconds -
            daysOut * day -
            hoursOut * hour -
            minutesOut * minute;

        const dayString = daysOut ? `${daysOut} ngày` : '';
        const hourString = hoursOut ? `${hoursOut} giờ` : '';
        const minuteString = minutesOut ? `${minutesOut} phút` : '';
        const secondString = secondsOut ? `${secondsOut} giây` : '';

        return `${dayString} ${hourString} ${minuteString} ${secondString}`;
    },
};

export default getTime;
