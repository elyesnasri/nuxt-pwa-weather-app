export const state = () => ({
  citys: ['Reensburg', 'Paris', 'Cham']
})

export const mutations = {
  update(state, city) {
    if (!state.citys.indexOf(city) === -1) {
      state.citys.push(city)
    }
  }
}
