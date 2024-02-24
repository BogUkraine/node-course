import axios from 'axios'
import { config } from '../configs/load-config'
import { WeatherDTO } from '../dto/weather.dto'

export const getWeatherByCity = async (city: String): Promise<WeatherDTO> => {
    const data = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
            q: city,
            appid: config.WEATHER_API_KEY,
        },
    })

    return new WeatherDTO(data)
}
