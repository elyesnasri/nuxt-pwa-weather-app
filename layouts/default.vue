<template>
  <v-app light class="app" :class="dayTime">
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      dayTime: 'night',
      isDark: false
    }
  },
  beforeMount() {
    let date = new Date()
    let h = date.getHours()

    if (h > 6 && h < 20) {
      this.dayTime = 'day'
      this.$vuetify.theme.dark = false
    } else {
      this.dayTime = 'night'
      this.$vuetify.theme.dark = true
    }
  }
}
</script>

<style>
.app {
  height: 100vh;
  width: 100vw;
}

.day {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url('../static/weather_day.svg') !important;
  background-repeat: no-repeat !important;
  background-position: center bottom !important;
}

.night {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url('../static/weather_night.svg') !important;
  background-repeat: no-repeat !important;
  background-position: center bottom !important;
}
</style>