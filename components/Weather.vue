<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12" align="center">
        <h2>{{data.city}}</h2>
      </v-col>
      <v-col align="center">{{data.overcast}}</v-col>
      <v-col align="center" cols="12" class="currentTemp">{{data.currentTemp}}°</v-col>
      <v-col cols="12">
        <span>Date: {{data.date}}</span>
        <hr />
        <span>
          Sunrise:
          {{data.sunrise}}
        </span>
        <span>
          Sunset:
          {{data.sunset}}
        </span>
      </v-col>
      <v-row>
        <v-col>
          <span>Max: {{data.maxTemp}}°</span>
        </v-col>
        <v-col>
          <span>Min: {{data.minTemp}}°</span>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          humidity:
          {{data.humidity}}
        </v-col>
        <v-col>
          Pressure:
          {{data.pressure}}
        </v-col>
        <v-col>
          Wind:
          {{data.wind}}
        </v-col>
      </v-row>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Weather',
  data() {
    return {
      snackbar: false
    }
  },
  props: {
    data: {
      type: Object,
      required: true
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
