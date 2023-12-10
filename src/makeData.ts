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
    // Create a pool of possible values for `d`
    const dPool = range(100);
    const citiesWeather = cities.map((city) => {
        const cityName = city

        // Randomly select and remove `lens` values for `d` from the pool
        const weatherData: dayWeather[] = range(lens).map(() => {
            const index = Math.floor(Math.random() * dPool.length);
            const d = dPool.splice(index, 1)[0];
            return newWeatherForCity(d);
        });
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
    


 
