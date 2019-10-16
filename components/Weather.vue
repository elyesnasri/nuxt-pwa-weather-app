<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12">
        <v-form @submit.prevent="updateCity">
          <v-text-field v-model="city" label="City" filled></v-text-field>
        </v-form>
      </v-col>
      <v-col cols="12" align="center">
        <h2>{{city}}</h2>
      </v-col>
      <v-col align="center">{{overcast}}</v-col>
      <v-col align="center" cols="12" class="currentTemp">{{currentTemp}}°</v-col>
      <v-col cols="12">
        <span>{{date}}</span>
        <hr />
        <span>
          Sunrise:
          {{sunrise}}
        </span>
        <span>
          Sunset:
          {{sunset}}
        </span>
      </v-col>
      <v-row>
        <v-col>
          <span>Max: {{maxTemp}}°</span>
        </v-col>
        <v-col>
          <span>Min: {{minTemp}}°</span>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          humidity:
          {{humidity}}
        </v-col>
        <v-col>
          Pressure:
          {{pressure}}
        </v-col>
        <v-col>
          Wind:
          {{wind}}
        </v-col>
      </v-row>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Weather',
  data() {
    return {
      city: '',
      date: '',
      currentTemp: '',
      minTemp: '',
      maxTemp: '',
      sunrise: '',
      sunset: '',
      pressure: '',
      humidity: '',
      wind: '',
      overcast: '',
      icon: '',
      citys: [],
      isDisabled: false,
      snackbar: false,
      text: '',
      appId: 'd944d4eb280d335ab5214b3dfae879c5'
    }
  },
  methods: {
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
    getWeather(url) {
      let cacheData

      this.date = this.getDate()
      axios
        .get(url)
        .then((response) => {
          this.currentTemp = Math.round(response.data.main.temp).toString()
          this.minTemp = Math.round(response.data.main.temp_min).toString()
          this.maxTemp = Math.round(response.data.main.temp_max).toString()
          this.pressure = response.data.main.pressure
          this.humidity = response.data.main.humidity + '%'
          this.wind = response.data.wind.speed + 'm/s'
          this.overcast = response.data.weather[0].description
          this.icon =
            'images/' + response.data.weather[0].icon.slice(0, 2) + '.svg'
          this.sunrise = new Date(response.data.sys.sunrise * 1000)
            .toLocaleTimeString('en-GB')
            .slice(0, 4)
          this.sunset = new Date(response.data.sys.sunset * 1000)
            .toLocaleTimeString('en-GB')
            .slice(0, 4)
          let wd = {
            currentTemp: this.currentTemp,
            minTemp: this.minTemp,
            maxTemp: this.maxTemp,
            pressure: this.pressure,
            humidity: this.humidity,
            wind: this.wind,
            overcast: this.overcast,
            icon: this.icon,
            sunrise: this.sunrise,
            sunset: this.sunset
          }

          // cache data weather data for a selected city
          this.city = response.data.name
          cacheData = 'wdata' + this.city
          // this.$offlineStorage.set(cacheData, wd)

          //save the histoy of all selected citys
          // let cacheCitys = this.$offlineStorage.get('cacheCitys')
          if (cacheCitys !== null) {
            if (!cacheCitys.includes(this.city)) {
              cacheCitys.push(this.city)
            }
          } else {
            cacheCitys = []
            cacheCitys.push(this.city)
          }
          // this.$offlineStorage.set('cacheCitys', cacheCitys)
          // this.$offlineStorage.set('selectedCity', this.city)
        })
        .catch((error) => {
          if (cacheData === undefined) {
            // cacheData = 'wdata' + this.$offlineStorage.get('selectedCity')
            console.log('getting cache data for ' + cacheData)
          }
          this.getWeatherOffline(cacheData)
          // console.log(error);
        })
    },
    getWeatherOffline(cacheData) {
      // let wdStorage = this.$offlineStorage.get(cacheData)
      console.log('Getting data from cache for city:' + cacheData)
      let wdStorage = ''
      if (wdStorage) {
        this.currentTemp = wdStorage.currentTemp
        this.minTemp = wdStorage.minTemp
        this.maxTemp = wdStorage.maxTemp
        this.pressure = wdStorage.pressure
        this.humidity = wdStorage.humidity
        this.wind = wdStorage.wind
        this.overcast = wdStorage.overcast
        this.icon = wdStorage.icon
        this.sunrise = wdStorage.sunrise
        this.sunset = wdStorage.sunset
      } else {
        this.text = 'City not found! Please try again :)'
        this.snackbar = true
      }
    },
    updateCity() {
      let url = `http://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&APPID=${this.appId}`
      this.getWeather(url)
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

      let url = `http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${long}&APPID=${this.appId}`

      this.getWeather(url)
    },
    geoError() {
      this.text =
        'Enable your broswer to get your location or just search any city'
      this.snackbar = true
      this.updateCity('Regensburg')
    }
  },
  beforeMount() {
    // let selectedCity = this.$offlineStorage.get('selectedCity')
    let selectedCity = 'Regensburg'
    if (selectedCity !== null) {
      this.city = selectedCity
      this.updateCity()
    } else {
      console.log('getting geo location')
      this.getGeoLocation()
    }
  }
}
</script>

<style scoped>
.currentTemp {
  font-size: 120px;
  margin: 80px 0 80px 0;
}
</style>
