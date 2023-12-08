import { faker } from '@faker-js/faker'
import moment from 'moment'
import './index.css'

export type dayWeather = {
    day: string
    temp: number
    windSpeed: number
    humidity: number
    // subRows?: City[]
}

export type City = {
    name: string
    weather: dayWeather[]
}

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newWeatherForCity = (d : number): dayWeather => {
    const currentDate = moment()
    return {
        day: currentDate.add(d, 'days').format('D-MMM'),
        temp: faker.number.int(30),
        windSpeed: faker.number.int(20),
        humidity: faker.number.int(100),
    }
}

export function makeRandomData(cities: string[], lens: number): City[] {
    const citiesWeather = cities.map((city) => {
        const cityName = city
        const weatherData: dayWeather[] = range(lens).map(() => newWeatherForCity(Math.floor(Math.random() * 100) + 1))
        return {
            name: cityName,
            weather: weatherData,
        }
    })
    return citiesWeather
}

export function makeData(cities: string[], lens: number): City[] {
    const citiesWeather = cities.map((city) => {
        const cityName = city;
        const weatherData: dayWeather[] = range(lens).map((d) => newWeatherForCity(d));
        return {
            name: cityName,
            weather: weatherData,
        };
    });
    return citiesWeather;
}
    


 
