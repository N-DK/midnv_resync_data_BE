import handleCheckStatusDevice from './checkStatusDevice';
import { haversineDistance } from './haversineDistance';

let status: number | null = null;

export const formatData = async (data: { [key: number]: any }) => {
    const dataArray = Object.values(data);
    let distance = 0;
    let totalDistance = 0;

    return dataArray
        .filter((item) => !item.error)
        .map((item, index) => {
            const prevItem = index > 0 ? dataArray[index - 1] : item;
            const nextItem =
                index < dataArray.length - 1 ? dataArray[index + 1] : item;

            const prevDate = new Date(prevItem.tm * 1000)
                .toISOString()
                .split('T')[0];

            const currentDate = new Date(item.tm * 1000)
                .toISOString()
                .split('T')[0];

            if (currentDate !== prevDate) {
                distance = 0;
            }

            const pointDistance = haversineDistance(
                item.mlat,
                item.mlng,
                nextItem.mlat,
                nextItem.mlng,
            );

            if (pointDistance < 1 && item?.tol) {
                distance += item?.tol;
                totalDistance += item?.tol;
            }

            if (!status) {
                status = item.mt;
            }

            status = handleCheckStatusDevice(
                item.sp,
                prevItem.mt,
                status,
                item.mt,
            );

            return {
                idx: item.idx || 0,
                imei: item.id, // Device ID
                license_number: item.dr || null, // License number (if available)
                latitude: item.mlat || 0.0, // Latitude
                longitude: item.mlng || 0.0, // Longitude
                speed: item.sp || 0.0, // Speed
                min_speed: null, // Placeholder for min_speed data
                max_speed: null, // Placeholder for max_speed data
                signal_quality: item.sg || 0, // Signal quality
                rotation: item.cur || 0.0, // Rotation angle
                status: status || 0, // ACC and IO status
                status_device: status || null, // GPS status
                distance: distance || 0, // Distance (if calculated)
                total_distance: totalDistance || 0, // Total traveled distance
                acc: item.s & 1, // ACC status (first bit of "s")
                io: (item.s >> 1) & 1, // IO1 status (second bit of "s")
                syn: item.syn || 0, // Data synchronization status
                time: item.tm || 0, // Timestamp
                is_error_insert: 0, // Default to 0
                is_error_address: 0, // Default to 0
                address: null, // Placeholder for address data
                created_at: Date.now(), // Current timestamp
                updated_at: null, // Default to null
            };
        });
};
