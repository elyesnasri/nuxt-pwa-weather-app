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
            aria-label="search city"
            autocomplete="off"
          ></v-autocomplete>
        </v-form>
      </v-col>
      <Weather :data="weatherData" />
      <v-snackbar v-model="snackbar">
        {{ textSnackbar }}
        <v-btn color="pink" texSnackBar @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-flex>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
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
      isDark: false,
      snackbar: false,
      overlay: false,
      textSnackbar: '',
      city: '',
      search: '',
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
      recentCitys: [],
      recentCoords: {
        lat: '',
        long: ''
      }
    }
  },
  watch: {
    overlay(val) {
      val &&
        setTimeout(() => {
          this.overlay = false
        }, 3000)
    }
  },
  methods: {
    getCityInput() {
      if (this.search) {
        console.log('search: ', this.search)

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${this.search}&units=metric&APPID=${this.appId}`
        this.getWeather(url)
      }
    },
    getChanged(city) {
      this.search = city
      this.getCityInput()
    },
    async getWeather(url) {
      axios
        .get(url)
        .then((response) => {
          this.weatherData.city = response.data.name
          console.log('weathercity: ', this.weatherData.city)

          this.weatherData.currentTemp =
            Math.round(response.data.main.temp).toString() + '°'
          this.weatherData.minTemp =
            Math.round(response.data.main.temp_min).toString() + '°'
          this.weatherData.maxTemp =
            Math.round(response.data.main.temp_max).toString() + '°'
          this.weatherData.overcast = response.data.weather[0].description
          this.weatherData.date = this.getDate(response.data.dt * 1000)
          this.overlay = false //TODO: check if required

          //caching citys
          if (
            this.weatherData.city !== '' &&
            !this.recentCitys.includes(this.weatherData.city)
          ) {
            console.log('caching: ', this.weatherData.city)

            this.recentCitys.push(this.weatherData.city)
            this.$localForage.setItem('recentCitys', this.recentCitys)
            console.log('cached: ', this.weatherData.city)
          }
        })
        .catch((error) => {
          if ($nuxt.isOffline) {
            this.textSnackbar =
              'Your are offline! Turn your internet on to get the last data &#128540;' +
              String.fromCodePoint(0x1f605)
            this.snackbar = true
          } else {
            this.textSnackbar =
              "Can't find data " + String.fromCodePoint(0x1f97a)
            this.snackbar = true
          }
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
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.getCoords, this.geoError)
      }
    },
    getCoords(position) {
      let lat = position.coords.latitude
      let long = position.coords.longitude
      let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${long}&APPID=${this.appId}`

      this.recentCoords.lat = lat
      this.recentCoords.long = long
      // check this localforage setitem
      //this.$localForage.setItem('recentCoords', this.recentCoords)
      this.getWeather(url)
    },
    geoError() {
      console.log("Can't get geo Coordinates!")
    },
    async populateAutocompleteFromCache() {
      let recentCitys = await this.$localForage.getItem('recentCitys')

      for (let city in recentCitys) {
        if (city !== '') {
          this.recentCitys.push(recentCitys[city])
        }
      }
    },
    async getCityName(url) {
      let cityName
      await axios
        .get(url)
        .then((response) => {
          cityName = response.data.name
        })
        .catch((err) => {
          console.log(err)
        })
      return cityName
    }
  },
  async mounted() {
    await this.populateAutocompleteFromCache()

    if ($nuxt.isOffline) {
      this.recentCoords = await this.$localForage.getItem('recentCoords')
      if (this.recentCoords) {
        let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${this.recentCoords.lat}&lon=${this.recentCoords.long}&APPID=${this.appId}`
        this.getWeather(url)

        this.textSnackbar =
          'GREAT! Your are getting data from cache ' +
          String.fromCodePoint(0x1f60d)

        this.snackbar = true
      } else {
        this.textSnackbar =
          'Please go online to get some data ' + String.fromCodePoint(0x1f913)
        this.snackbar = true
      }
    } else {
      this.getGeoLocation()
    }
    this.overlay = true

    //PBS
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync'
    })
    if (status.state === 'granted') {
      // registering for PBS
      const registration = await navigator.serviceWorker.ready
      if ('periodicSync' in registration) {
        try {
          registration.periodicSync.register('weather-sync', {
            // Minimum interval at which the sync may fire (one day).
            minInterval: 30 * 60 * 1000
          })
        } catch (error) {
          // PBS cannot be used.
          console.log(err)
        }
      }
    } else {
      // PBS cannot be used.
      console.log('PBS cannot be used')
    }
  }
}
</script>
