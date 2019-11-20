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
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${this.search}&units=metric&APPID=${this.appId}`
        this.getWeather(url)
      }
    },
    getChanged(city) {
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

          // this.overlay = false //TODO: check if required
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
    notify() {
      let that = this
      if ('Notification' in window) {
        Notification.requestPermission().then(function(result) {
          that.textSnackbar = 'Nofication suppoerted: ' + result
          that.snackbar = true

          console.log(result)
          if (result === 'granted') {
            that.textSnackbar = 'Nofication accepted'
            that.snackbar = true

            var options = {
              body: 'you will get the last weather updates',
              vibrate: [200, 100, 200]
            }
            var notification = new Notification(
              'Progressive Weather says: ',
              options
            )
          }
        })
      } else {
        that.textSnackbar = 'Notfication not supported'
        that.snackbar = true
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
    async getCoords(position) {
      let lat = position.coords.latitude
      let long = position.coords.longitude
      let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${long}&APPID=${this.appId}`

      this.recentCoords.lat = lat
      this.recentCoords.long = long
      this.$localForage.setItem('recentCoords', this.recentCoords)
      this.getWeather(url)
    },
    geoError() {
      console.log("Can't get geo Coordinates!")
    },
    async populateAutocompleteFromCache() {
      let recentCitys = await this.$localForage.getItem('recentCitys')

      for (let city in recentCitys) {
        this.recentCitys.push(recentCitys[city])
      }
    },
    async getCityName(url) {
      let cityName
      await axios
        .get(url)
        .then((response) => {
          console.log(response)

          cityName = response.data.name
        })
        .catch((err) => {
          console.log(err)
        })
      console.log('cityName:' + cityName)

      return cityName
    }
  },
  async mounted() {
    this.populateAutocompleteFromCache()

    if ($nuxt.isOffline) {
      console.log('Offline')

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
      console.log('Online')

      this.getGeoLocation()
    }
    this.overlay = true

    //PBS
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync'
    })
    if (status.state === 'granted') {
      // PBS can be used.
      console.log('PBS can be used')
      this.textSnackbar = 'PBS can be used'
      this.snackbar = true
      // registering for PBS
      const registration = await navigator.serviceWorker.ready
      if ('periodicSync' in registration) {
        try {
          registration.periodicSync.register('weather-sync', {
            // An interval of one hour.
            minInterval: 60 * 60 * 1000
          })
          console.log('weather-sync is registered')
        } catch (error) {
          // PBS cannot be used.
          console.log('PBS cannot be registered')
        }
      }
    } else {
      // PBS cannot be used.
      console.log('PBS cannot be used')
      this.textSnackbar = 'PBS cannot be used'
      this.snackbar = true
    }
  }
}
</script>