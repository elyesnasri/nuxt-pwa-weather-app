<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <Weather />
    </v-flex>
  </v-layout>
</template>

<script>
import Weather from '~/components/Weather.vue'
export default {
  components: {
    Weather
  }
}
</script>
