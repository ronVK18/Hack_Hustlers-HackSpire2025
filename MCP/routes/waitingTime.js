import express, { Router } from 'express';
import { isHoliday, predictWeather } from '../utils/functions.js';
import axios from 'axios';
const router = Router();

router.post('/', async (req, res) => {
    const data={
        "current_queue_length": 15,
        "staff_count": 3,
        "historical_throughput": 4.2,
        "is_holiday": isHoliday(),
        "weather_condition": predictWeather()
    }
    const response=await axios.post('https://queue-3-vvk0.onrender.com/predict', {
        "current_queue_length": 15,
        "staff_count": 3,
        "historical_throughput": 4.2,
        "is_holiday": isHoliday().isHoliday,
        "weather_condition": predictWeather()
    } )
    return res.status(200).json({
        data: response.data
    });
})
export const WaitingTimeRouter = router;