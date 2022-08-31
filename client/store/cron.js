module.exports = {
    state: {
        cronList: [],
        cronStateToggle: {},
        cronExpressionUpdate: {},
        cronAdd: {},
        cronDelete: {},
    },
    getters: {
        getCronList(state) {
            return state.cronList;
        },
        getEditCronExpression(state) {
            return state.cronExpressionUpdate;
        },
        getToggleCron(state) {
            return state.cronStateToggle;
        },
        getAddCron(state) {
            return state.cronAdd;
        },
        getDeleteCron(state) {
            return state.cronDelete;
        },
    },
    actions: {
        async fetchCronList({ commit }, data_rec) {
            try {
                const response = await this.$axios.get('fetchCronJobList', data_rec.params)
                commit('setCronList', response.data)
            }
            catch (ex) {
                commit('setCronList', ex.response.data)
            }

        },
        async editCronExpression({ commit }, data) {
            try {
                const response = await this.$axios.post(`updateCronJobExpression/${data.id}`, data.payload)
                commit('setEditCronExpression', response.data)
            }
            catch (ex) {
                commit('setEditCronExpression', ex.response.data)
            }

        },
        async toggleCron({ commit }, data) {
            try {
                const response = await this.$axios.get(`toggleCronState/${data.id}`)
                commit('setToggleCron', response.data)
            }
            catch (ex) {
                commit('setToggleCron', ex.response.data)
            }
        },
        async addCron({ commit }, data) {
            try {
                const response = await this.$axios.post('createCronJob', data.payload)
                commit('setAddCron', response.data)
            }
            catch (ex) {
                commit('setAddCron', ex.response.data)
            }
        },
        async delCron({ commit }, data) {
            try {
                const response = await this.$axios.get(`deleteCronJob/${data.id}`)
                commit('setDeleteCron', response.data)
            }
            catch (ex) {
                commit('setDeleteCron', ex.response.data)
            }
        }
    },
    mutations: {
        setCronList(state, data) {
            //console.log(data);
            state.cronList = data
        },
        setToggleCron(state, data) {
            //console.log(data);
            state.cronStateToggle = data
        },
        setEditCronExpression(state, data) {
            //console.log(data);
            state.cronExpressionUpdate = data
        },
        setAddCron(state, data) {
            //console.log(data);
            state.cronAdd = data
        },
        setDeleteCron(state, data) {
            //console.log(data);
            state.cronDelete = data
        },
    },
}