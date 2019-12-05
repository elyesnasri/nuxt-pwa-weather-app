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
  methods: {
    setLightTheme() {
      this.dayTime = 'day'
      this.$vuetify.theme.dark = false
    },
    setDarkTheme() {
      this.dayTime = 'night'
      this.$vuetify.theme.dark = true
    },
    setThemeByTime() {
      let date = new Date()
      let h = date.getHours()

      if (h > 6 && h < 17) {
        this.setLightTheme()
      } else {
        this.setDarkTheme()
      }
    }
  },
  mounted() {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      this.setDarkTheme()
    } else if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      this.setLightTheme()
    } else {
      this.setThemeByTime()
    }
  }
}
</script>

<style>
@font-face {
  font-family: 'materialdesignicons';
  src: url(https://cdn.jsdelivr.net/npm/@mdi/font@latest/fonts/materialdesignicons-webfont.woff2?v=4.6.95);
  font-display: swap;
}
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
