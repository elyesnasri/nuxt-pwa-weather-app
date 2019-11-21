<template>
  <v-app light class="app" :class="dayTime">
    <v-content>
      <nuxt />
      <v-btn fixed dark fab top left @click="changeTheme()">
        <v-icon>mdi-brightness-6</v-icon>
      </v-btn>
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
  methods: {
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      if (this.dayTime === 'day') {
        this.dayTime = 'night'
      } else {
        this.dayTime = 'day'
      }
    }
  },
  mounted() {
    let date = new Date()
    let h = date.getHours()

    if (h > 6 && h < 17) {
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
  background: #67a4c7 !important;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url('../static/landscape_day.svg') !important;
  background-repeat: no-repeat !important;
  background-position: center bottom !important;
}

.night {
  background: #12142a !important;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url('../static/landscape_night.svg') !important;
  background-repeat: no-repeat !important;
  background-position: center bottom !important;
}
</style>
