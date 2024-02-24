export class WeatherDTO {
    temperature: number

    humidity: number

    windSpeed: number

    constructor(data: any) {
        this.temperature = data.main.temp
        this.humidity = data.main.humidity
        this.windSpeed = data.wind.speed
    }
}
