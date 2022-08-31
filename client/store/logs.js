module.exports = {
    state: {
        logsList: [],
        deleteLog: [],
        deleteLogByDate: [],
    },
    getters: {
        getLogsList(state) {
            return state.logsList;
        },
        getDeleteLogByDate(state) {
            return state.deleteLogByDate;
        },
        getDeleteLog(state) {
            return state.deleteLog;
        },
    },
    actions: {
        async fetchLogsList({ commit }, data_rec) {
            try {
                const response = await this.$axios.get(`fetchLogsList/${data_rec.cron_id}`, data_rec.params)
                commit('setLogsList', response.data)
            } catch (ex) {
                commit('setLogsList', ex.response.data)
            }

        },
        async deleteLog({ commit }, data_rec) {
            try {
                const { data } = await this.$axios.get(`deleteLog/${data_rec.id}`)
                commit('setDeleteLog', data)
            } catch (ex) {
                commit('setDeleteLog', ex.response.data)
            }

        },
        async deleteLogByDate({ commit }, data_rec) {
            try {
                const { data } = await this.$axios.get(`deleteLogByDate/${data_rec.cron_id}`, data_rec.params)
                commit('setDeleteLogByDate', data)
            } catch (ex) {
                commit('setDeleteLogByDate', ex.response.data)
            }

        },
    },
    mutations: {
        setLogsList(state, data) {
            //console.log(data);
            state.logsList = data
        },
        setDeleteLog(state, data) {
            //console.log(data);
            state.deleteLog = data
        },
        setDeleteLogByDate(state, data) {
            //console.log(data);
            state.deleteLogByDate = data
        },
    },
}