<template>
  <v-container>
    <p v-if="isOnline">Status: online</p>
    <p v-if="isOffline">Status: offline</p>
    <v-list flat>
      <v-list-item-group>
        <v-list-item v-for="(item, i) in items" :key="i">
          <!-- <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>-->
          <v-list-item-content>
            <v-list-item-title>
              <v-btn text block large>
                <span @click="cacheSelectedCity(item.title)">{{item.title}}</span>
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
  methods: {
    cacheSelectedCity(city) {
      //   this.$offlineStorage.set('selectedCity', city)
      this.$router.push('/')
    }
  },
  beforeMount() {
    // let cacheCitys = this.$offlineStorage.get('cacheCitys')
    let cacheCitys = ['Regensburg', 'München', 'Paris']

    for (let i = 0; i < cacheCitys.length; i++) {
      var obj = {
        title: cacheCitys[i]
      }
      this.items.push(obj)
    }
  }
}
</script>