import Vue from "vue";
import Vuex from "vuex";
import cronStore from "./cron";
import logsStore from "./logs";
Vue.use(Vuex)
export default () => {
    return new Vuex.Store({
        state: () => ({
            counter: 0
        }),
        mutations: {
            increment(state) {
                state.counter++
            }
        },
        modules: {
            cronStore,
            logsStore
        }
    })
}