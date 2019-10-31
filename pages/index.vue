<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <v-col cols="12">
        <v-form @submit.prevent="getCityInput">
          <v-text-field v-model="city" label="City" filled></v-text-field>
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
      }
    }
  },
  methods: {
    // first load get the geo location and update the weather
    // get the value of the search field
    getCityInput() {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&APPID=${this.appId}`

      this.getWeather(url)

      if (this.weatherData.city) {
        //commit city to the store
        // cache store citys in indexedDB
      }
    },
    getWeather(url) {
      this.weatherData.date = this.getDate()
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
            .toLocaleTimeString('en-GB')
            .slice(0, 4)
          this.weatherData.sunset = new Date(response.data.sys.sunset * 1000)
            .toLocaleTimeString('en-GB')
            .slice(0, 4)

          //populate store from cache
          this.$store.commit('recent/update', this.weatherData.city)

          let citysArray = this.$store.state.recent.citys
          this.$localForage.setItem('recentCitys', citysArray)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    getDate() {
      let date = new Date()
      let weekDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ]

      let tt = weekDays[date.getDay()]
      let mm = date.getMonth() + 1
      return tt + ', ' + mm
    },
    getGeoLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.getCityName,
          this.geoError
        )
      }
    },
    getCityName(position) {
      const lat = position.coords.latitude
      const long = position.coords.longitude

      let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${long}&APPID=${this.appId}`

      this.getWeather(url)
    },
    geoError() {
      this.text =
        'Enable your broswer to get your location or just search any city'
      this.snackbar = true
      this.updateCity('Regensburg')
    },
    async populateStoreFromCache() {
      let recentCitys = await this.$localForage.getItem('recentCitys')

      for (let city in recentCitys) {
        this.$store.commit('recent/update', recentCitys[city])
      }
    }
  },
  beforeMount() {
    this.getGeoLocation()
    this.populateStoreFromCache()
  }
}
</script>