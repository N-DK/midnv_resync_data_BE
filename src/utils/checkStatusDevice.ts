import { FILTER_SPEED } from '../constants/setting.constant';

const handleCheckStatusDevice = (
    speed: number,
    previousStatusDevice: number,
    previousStatus: number | null,
    currentStatus: number,
) => {
    if (currentStatus === 1) return 1;
    if (
        speed > FILTER_SPEED ||
        (previousStatusDevice === 3 && speed > 0) ||
        (previousStatus === 3 && speed > 0)
    )
        return 3;

    return 2;
};

export default handleCheckStatusDevice;
