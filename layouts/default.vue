<template>
  <v-app class="app" :class="dayTime">
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      dayTime: 'night'
    }
  },
  beforeMount() {
    let date = new Date()
    let h = date.getHours()

    if (h > 6 && h < 20) {
      this.dayTime = 'day'
    } else {
      this.dayTime = 'night'
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
  /* background: #4caf50 !important; */
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url('../static/weather_day.svg') !important;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.night {
  /* background: #bb0000 !important; */
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url('../static/weather_night.svg') !important;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>