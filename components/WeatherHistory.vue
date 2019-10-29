<template>
  <v-container>
    <!-- <p v-if="isOnline">Status: online</p>
    <p v-if="isOffline">Status: offline</p>-->
    <v-list flat>
      <v-list-item-group>
        <v-list-item v-for="(item, i) in items" :key="i">
          <!-- <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>-->
          <v-list-item-content>
            <v-list-item-title>
              <v-btn text block large>
                <span @click="cacheSelectedCity(item)">{{item}}</span>
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
  props: {},
  computed: {},
  methods: {
    cacheSelectedCity(city) {
      //   this.$offlineStorage.set('selectedCity', city)
      this.$router.push('/')
    }
  },
  created() {
    let cacheCitys = ['Regensburg', 'München', 'Paris']
    console.log(this.$store.state.recent.citys)

    this.items = Array.from(this.$store.state.recent.citys)
  }
}
</script>