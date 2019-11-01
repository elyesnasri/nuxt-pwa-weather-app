<template>
  <v-container>
    <!-- <p v-if="isOnline">Status: online</p>
    <p v-if="isOffline">Status: offline</p>-->
    <v-list flat>
      <v-list-item-group>
        <v-list-item v-for="(city, i) in recentCitys" :key="i">
          <!-- <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>-->
          <v-list-item-content>
            <v-list-item-title>
              <v-btn text block large>
                <span @click="cacheSelectedCity(city)">{{city}}</span>
              </v-btn>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    items: [],
    arrayCity: []
  }),
  props: {
    recentCitys: {
      type: Array,
      required: true
    }
  },
  methods: {
    cacheSelectedCity(city) {
      console.log('clicked citys is: ' + city)

      // this.$router.push('/')
      this.$router.push({ name: 'index', params: { selectedCity: city } })
    }
  }
}
</script>