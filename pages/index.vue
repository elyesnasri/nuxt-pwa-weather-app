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
      <v-col cols="12" align="center">
        <v-btn text icon @click="notify">
          <v-icon>mdi-bell</v-icon>
        </v-btn>
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
      recentCitys: [],
      coords: {
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
      this.overlay = true
      axios
        .get(url)
        .then((response) => {
          this.weatherData.city = response.data.name
          this.weatherData.currentTemp =
            Math.round(response.data.main.temp).toString() + '°'
          this.weatherData.minTemp =
            Math.round(response.data.main.temp_min).toString() + '°'
          this.weatherData.maxTemp =
            Math.round(response.data.main.temp_max).toString() + '°'
          this.weatherData.overcast = response.data.weather[0].description
          this.weatherData.date = this.getDate(response.data.dt * 1000)

          //caching citys
          if (!this.recentCitys.includes(this.weatherData.city))
            this.recentCitys.push(this.weatherData.city)

          this.$localForage.setItem('recentCitys', this.recentCitys)

          this.overlay = false
        })
        .catch((error) => {
          this.textSnackbar = "Couldn't get data :("
          this.snackbar = true
          this.overlay = false
        })
    },
    notify() {
      if ('Notification' in window) {
        Notification.requestPermission().then(function(result) {
          console.log(result)
          if (result === 'granted') {
            var options = {
              body: 'Do you like my body?',
              vibrate: [200, 100, 200]
            }
            var notification = new Notification(
              'Progressive Weather says: ',
              options
            )
          }
        })
      }
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
      this.coords.lat = position.coords.latitude
      this.coords.long = position.coords.longitude

      //cache last geo position
      if (this.coords.lat && this.coords.long) {
        this.$localForage.setItem('recentCoords', this.coords)
      } else {
        this.recentCoords = this.$localForage.getItem('recentCoords')
      }

      console.log('lat: ' + this.coords.lat)
      console.log('long: ' + this.coords.long)

      let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${this.coords.lat}&lon=${this.coords.long}&APPID=${this.appId}`
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
    this.overlay = true
  }
}
</script>