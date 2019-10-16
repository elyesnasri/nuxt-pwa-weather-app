<template>
  <v-app dark>
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
