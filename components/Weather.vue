<template>
  <div>
    <v-container>
      <v-row no-gutters>
        <v-col cols="12" align="center" class="mb-4">
          <h2>{{data.city}}</h2>
        </v-col>
        <v-col align="center" cols="12" class="my-12">
          <span class="display-4 ml-8">{{data.currentTemp}}</span>
        </v-col>
        <v-col align="center" cols="12" class="mt-4">{{data.overcast}}</v-col>
        <v-col align="center" cols="12" class="mb-8">
          <span>{{data.maxTemp}} / {{data.minTemp}}</span>
        </v-col>
        <v-col align="center" cols="12">
          <v-chip class="font-weight-thin" outlined>updated: {{data.date}}</v-chip>
        </v-col>
      </v-row>
    </v-container>
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
