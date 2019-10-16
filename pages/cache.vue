<template>
  <div>
    <h1>Cache</h1>
    <pre>{{ $data }}</pre>
    <nuxt-link to="/about">About page</nuxt-link>
  </div>
</template>

<script>
import axios from 'axios'

let cachedData = null
export default {
  async asynData() {
    if (cachedData) return cachedData
    let { data } = await axios.get('https://api.myjson.com/bins/18pdl3')
    cachedData = data
    return data
  }
}
</script>