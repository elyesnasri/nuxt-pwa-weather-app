<template>
  <v-app dark class="day">
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
      <v-bottom-navigation hide-on-scroll absolute horizontal v-model="bottomNav">
        <v-btn to="/" nuxt>
          <span>Home</span>
          <v-icon>mdi-home</v-icon>
        </v-btn>

        <v-btn to="/history" nuxt value="favorites">
          <span>Recent</span>
          <v-icon>mdi-history</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      bottomNav: 'recent'
    }
  }
}
</script>

<style>
.day {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)),
    url('../static/weather_day.jpg');
  /* background-size: 400px 864px; */
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>