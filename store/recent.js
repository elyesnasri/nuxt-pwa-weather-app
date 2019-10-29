export const state = () => ({
  citys: ['Reensburg', 'Paris', 'Cham']
})

export const mutations = {
  update(state, city) {
    state.citys.push(city)
  }
}
