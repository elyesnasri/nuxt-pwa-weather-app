<template>
  <div>
    <WeatherHistory :recentCitys="bigcitys" />
  </div>
</template>

<script>
import WeatherHistory from '~/components/WeatherHistory'

export default {
  components: {
    WeatherHistory
  },
  data() {
    return {
      bigcitys: []
    }
  },
  methods: {
    async getCitysFromCache() {
      this.bigcitys = await this.$localForage.getItem('recentCitys')
    }
  },
  beforeMount() {
    this.getCitysFromCache()
  }
}
</script>