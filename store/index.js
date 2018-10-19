import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const createStore = () => {
  return new Vuex.Store({
    state: {
      imageCDN: 'http://pdyplk1dz.bkt.clouddn.com/',
      currentCharacter: {},
      currentHouse: {},
      products: [],
      currentProduct: [],
      houses: [],
      user: null,
      authUser: null,
      characters: []
    },
    getters,
    actions,
    mutations
  })
}

export default createStore
