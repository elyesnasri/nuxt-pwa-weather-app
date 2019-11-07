<template>
  <v-layout column justify-center align-center>
    <v-flex xs12>
      <v-col cols="12">
        <v-form @submit.prevent="getCityInput">
          <v-autocomplete
            :search-input.sync="search"
            v-model="city"
            @change="getChanged(city)"
            label="City"
            :items="recentCitys"
            filled
            rounded
            clearable
            open-on-clear
          ></v-autocomplete>
        </v-form>
      </v-col>

      <Weather :data="weatherData" />
    </v-flex>
  </v-layout>
</template>

<script>
import Weather from '~/components/Weather.vue'
import axios from 'axios'

export default {
  components: {
    Weather
  },
  data() {
    return {
      city: '',
      search: '',
      selectedCity: '',
      appId: 'd944d4eb280d335ab5214b3dfae879c5',
      weatherData: {
        city: '',
        currentTemp: '',
        minTemp: '',
        maxTemp: '',
        pressure: '',
        humidity: '',
        wind: '',
        overcast: '',
        icon: '',
        sunrise: '',
        sunset: '',
        date: ''
      },
      dayTime: '',
      recentCitys: []
    }
  },
  methods: {
    getCityInput() {
      console.log('search input: ' + this.search)

      if (this.search) {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${this.search}&units=metric&APPID=${this.appId}`
        this.getWeather(url)
      }
    },
    getChanged(city) {
      console.log('changed city: ' + city)
      this.search = city
      this.getCityInput()
    },
    getWeather(url) {
      axios
        .get(url)
        .then((response) => {
          this.weatherData.city = response.data.name
          this.weatherData.currentTemp = Math.round(
            response.data.main.temp
          ).toString()
          this.weatherData.minTemp = Math.round(
            response.data.main.temp_min
          ).toString()
          this.weatherData.maxTemp = Math.round(
            response.data.main.temp_max
          ).toString()
          this.weatherData.pressure = response.data.main.pressure
          this.weatherData.humidity = response.data.main.humidity + '%'
          this.weatherData.wind = response.data.wind.speed + 'm/s'
          this.weatherData.overcast = response.data.weather[0].description
          this.weatherData.icon =
            'images/' + response.data.weather[0].icon.slice(0, 2) + '.svg'
          this.weatherData.sunrise = new Date(response.data.sys.sunrise * 1000)
            .toLocaleTimeString('en-DE')
            .slice(0, 4)
          this.weatherData.sunset = new Date(response.data.sys.sunset * 1000)
            .toLocaleTimeString('en-DE')
            .slice(0, 4)
          this.weatherData.date = this.getDate(response.data.dt * 1000)

          //caching citys
          if (!this.recentCitys.includes(this.weatherData.city))
            this.recentCitys.push(this.weatherData.city)

          this.$localForage.setItem('recentCitys', this.recentCitys)
        })
        .catch((error) => {
          console.log(error)
          // this.$router.push('history')
        })
    },
    getDate(dateServer) {
      let date = new Date(dateServer)

      return date
        .toLocaleDateString('de-DE')
        .concat(' ', date.toLocaleTimeString('de-DE'))
    },
    getUpdateTime() {
      let actTime = new Date()
    },
    getGeoLocation() {
      console.log('getLocation...')

      if (navigator.geolocation) {
        console.log('getCurrentPosition')

        navigator.geolocation.getCurrentPosition(this.getCoords, this.geoError)
      }
    },
    getCoords(position) {
      const lat = position.coords.latitude
      const long = position.coords.longitude

      let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${long}&APPID=${this.appId}`
      this.getWeather(url)
    },
    geoError() {
      console.log(
        'Enable to get Coordinates. You can use your history to get weather data.'
      )
    },
    async populateAutocompleteFromCache() {
      let recentCitys = await this.$localForage.getItem('recentCitys')

      for (let city in recentCitys) {
        this.recentCitys.push(recentCitys[city])
      }
    }
  },
  mounted() {
    this.populateAutocompleteFromCache()
    this.getGeoLocation()
  }
}
</script>