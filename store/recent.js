export const state = () => ({
  citys: []
})

export const mutations = {
  update(state, city) {
    if (!state.citys.includes(city)) {
      state.citys.push(city)
    }
  }
}
