<template>
  <div class="pt-10">
    <v-progress-circular
      indeterminate
      color="blue"
      v-if="loading"
      style="display: block; margin-left: auto; margin-right: auto"
    ></v-progress-circular>
    <div v-else>
      <header class="text-center">
        <h5>Cron List</h5>
        <v-row class="justify-end">
          <v-btn @click="dialogAddActivate = true">Add Cron</v-btn>
        </v-row>
      </header>
      <div style="padding: 40px 0">
        <v-simple-table v-if="results.length > 0">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center">ID</th>
                <th class="text-center">Cron Name</th>
                <th class="text-center">API url</th>
                <th class="text-center">Request Method</th>
                <th class="text-center">Activation Toggle</th>
                <th class="text-center">Cron Expression</th>
                <th class="text-center"></th>
                <th class="text-center">Actions</th>
                <th class="text-center"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in results" :key="item.id">
                <td class="text-center">{{ item.id }}</td>
                <td class="text-center">{{ item.cron_job_name }}</td>
                <td class="text-center">{{ item.api_url }}</td>
                <td class="text-center">{{ item.req_method }}</td>
                <td
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <v-switch
                    @click="clickToToggle(item.id)"
                    v-model="item.is_active"
                    color="blue"
                  >
                  </v-switch>
                </td>
                <td class="text-center">{{ item.cron_expression }}</td>
                <td class="text-center">
                  <font-awesome-icon
                    style="color: #2196F3"
                    @click="viewLogs(item.id)"
                    :icon="['fa', 'eye']"
                  />
                </td>
                <td class="text-center">
                  <font-awesome-icon
                    @click="openEditDialog(item)"
                    :icon="['fa', 'edit']"
                  />
                </td>
                <td class="text-center">
                  <font-awesome-icon
                    @click="openDeleteDialog(item)"
                    style="color: red"
                    :icon="['fa', 'trash']"
                  />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-dialog v-model="dialogActivate" width="500">
          <v-card>
            <v-card-title class="subheadline blue" primary-title>
              Update Cron Expression
            </v-card-title>

            <v-card-text>
              <v-col cols="12">
                <v-text-field
                  label="Cron Name"
                  type="text"
                  v-model="updatePayload.cronNameUpdate"
                  required
                ></v-text-field>
                <v-text-field
                  label="API url"
                  type="text"
                  :rules="urlRules"
                  v-model="updatePayload.apiUrlUpdate"
                  required
                ></v-text-field>
                <v-select
                  label="Request Method"
                  filled
                  :items="methods"
                  v-model="updatePayload.reqMethodUpdate"
                  required
                ></v-select>
                <v-text-field
                  style="margin-bottom:30px"
                  label="Request Payload"
                  type="text"
                  messages="Please insert the payload in form of an Object like { name: 'Abc' }"
                  v-model="updatePayload.reqPayloadUpdate"
                  required
                  v-if="
                    updatePayload.reqMethodUpdate == 'POST' ||
                    updatePayload.reqMethodUpdate == 'PUT'
                  "
                ></v-text-field>
                
                <span class="visually-hidden"></span>
                <v-text-field
                  label="Cron Expression"
                  type="text"
                  v-model="updatePayload.cronExpressionUpdate"
                  :rules="expressionRules"
                  required
                ></v-text-field>
              </v-col>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="danger" text @click="dialogActivate = false">
                Close
              </v-btn>
              <v-btn color="primary" text @click="updateCron()"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogAddActivate" width="500">
          <v-card>
            <v-card-title class="subheadline blue" primary-title>
              Add Cron Job
            </v-card-title>

            <v-card-text>
              <v-col cols="12">
                <v-text-field
                  label="Cron Name"
                  type="text"
                  v-model="addPayload.cronName"
                  required
                ></v-text-field>
                <v-text-field
                  label="API url"
                  type="text"
                  v-model="addPayload.apiUrl"
                  :rules="urlRules"
                  required
                ></v-text-field>
                <v-select
                  label="Request Method"
                  filled
                  :items="methods"
                  v-model="addPayload.reqMethod"
                  required
                ></v-select>
                <v-text-field
                  style="margin-bottom:30px"
                  label="Request Payload"
                  type="text"
                  messages="Please insert the payload in form of an Object like { name: 'Abc' }"
                  v-model="addPayload.reqPayload"
                  required
                  v-if="
                    addPayload.reqMethod == 'POST' ||
                    addPayload.reqMethod == 'PUT'
                  "
                ></v-text-field>
                <v-text-field
                  label="Cron Expression"
                  type="text"
                  v-model="addPayload.cronAddExpression"
                  :rules="expressionRules"
                  required
                ></v-text-field>
                <v-switch
                  label="Active"
                  type="boolean"
                  v-model="addPayload.isActive"
                  required
                ></v-switch>
              </v-col>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="danger" text @click="dialogAddActivate = false">
                Close
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="addCron()"
                v-if="
                  addPayload.reqMethod == 'POST' ||
                  addPayload.reqMethod == 'PUT'
                "
                :disabled="
                  !(
                    addPayload.cronName &&
                    addPayload.apiUrl &&
                    addPayload.reqMethod &&
                    addPayload.reqPayload &&
                    addPayload.cronAddExpression &&
                    addPayload.isActive
                  )
                "
              >
                Save
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="addCron()"
                v-else
                :disabled="
                  !(
                    addPayload.cronName &&
                    addPayload.apiUrl &&
                    addPayload.reqMethod &&
                    addPayload.cronAddExpression &&
                    addPayload.isActive
                  )
                "
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDeleteActivate" width="300">
          <v-card>
            <v-card-title class="subheadline blue" primary-title>
              Delete Cron
            </v-card-title>

            <v-card-text style="padding-top: 12px">
              Do you want to delete the cron?
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="danger" text @click="dialogDeleteActivate = false">
                Close
              </v-btn>
              <v-btn color="primary" text @click="deleteCron()"> Delete </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <p v-if="results.length == 0" style="text-align: center">
          No data found
        </p>
        <div
          v-if="results.length > 0"
          style="float: right; margin: 20px 0; display: flex"
        >
          <v-btn
            :class="!cursors.hasPreviousPage ? 'disableBtn' : 'abled'"
            @click="fetchCronList(1)"
            >First</v-btn
          >

          <v-btn
            :class="!cursors.hasPreviousPage ? 'disableBtn' : 'abled'"
            @click="fetchCronList(cursors.startCursor)"
            >Prev</v-btn
          >

          <v-btn
            :class="!cursors.hasNextPage ? 'disableBtn' : 'abled'"
            @click="fetchCronList(cursors.endCursor)"
            >Next</v-btn
          >

          <v-btn
            :class="!cursors.hasNextPage ? 'disableBtn' : 'abled'"
            @click="fetchCronList(cursors.totalPages)"
            >Last</v-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      cronExpression: "",
      activeId: 0,
      dialogActivate: false,
      dialogAddActivate: false,
      dialogDeleteActivate: false,
      methods: ["GET", "POST", "PUT", "DELETE"],
      loading: false,
      urlRules:[value => {
          const pattern = new RegExp(/^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/)
          return pattern.test(value) || 'Invalid URL'
        },],
      expressionRules:[value => {
          const pattern = new RegExp(/^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/)
          return pattern.test(value) || 'Invalid Expression'
        },],
      cursors: {},
      results: [
        {
          id: 0,
          cron_job_name: "",
          api_url: "",
          req_method: "",
          req_payload: "",
          is_active: "",
          cron_expression: "",
        },
      ],
      noData: false,
      params: {},
      addPayload: {
        cronName: null,
        apiUrl: null,
        reqMethod: null,
        reqPayload: null,
        cronAddExpression: null,
        isActive: null,
      },
      updatePayload: {
        cronNameUpdate: null,
        apiUrlUpdate: null,
        reqMethodUpdate: null,
        reqPayloadUpdate: null,
        cronExpressionUpdate: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      cron_list: "getCronList",
      editCronExpression: "getEditCronExpression",
      toggleCron: "getToggleCron",
      cronAdd: "getAddCron",
    }),
  },
  async created() {
    try {
      const page = 1;
      await this.fetchCronList(page);
    } catch (ex) {
      console.log(ex);
    }
  },
  watch: {
    cron_list() {
      try {
        if (this.cron_list.status.success) {
          this.noData = false;
          this.results = this.cron_list.data.results;
          this.cursors = this.cron_list.data.cursors;
        } else {
          this.noData = true;
          this.results = [];
        }
      } catch (ex) {
        console.log(ex);
      }
    },
  },
  methods: {
    async deleteCron() {
      try {
        await this.$store.dispatch("delCron", { id: this.activeId });
        await this.$store.dispatch("fetchCronList", this.params);
        this.dialogDeleteActivate = false;
        this.enableLoading();
      } catch (e) {
        console.log(e);
      }
    },
    async fetchCronList(page) {
      try {
        const params = {
          params: {
            page: page,
          },
        };
        await this.$store.dispatch("fetchCronList", { params });
      } catch (ex) {
        console.log(ex);
      }
    },
    async clickToToggle(id) {
      try {
        await this.$store.dispatch("toggleCron", { id });
        await this.$store.dispatch("fetchCronList", this.params);
        this.enableLoading();
      } catch (e) {
        console.log(e);
      }
    },
    openDeleteDialog(item) {
      this.activeId = item.id;
      this.dialogDeleteActivate = true;
    },
    openEditDialog(item) {
      try {
        this.activeId = item.id;
        this.dialogActivate = true;
        this.updatePayload = {
          cronNameUpdate: item.cron_job_name ? item.cron_job_name : null,
          apiUrlUpdate: item.api_url ? item.api_url : null,
          reqMethodUpdate: item.req_method ? item.req_method : null,
          reqPayloadUpdate: item.req_payload ? item.req_payload : null,
          cronExpressionUpdate: item.cron_expression
            ? item.cron_expression
            : null,
        };
      } catch (ex) {
        console.log(ex);
      }
    },
    async updateCron() {
      try {
        let payload = {};
        if (this.updatePayload.cronExpressionUpdate) {
          payload.cron_expression = this.updatePayload.cronExpressionUpdate;
        }
        if (this.updatePayload.cronNameUpdate) {
          payload.cron_job_name = this.updatePayload.cronNameUpdate;
        }
        if (this.updatePayload.reqMethodUpdate) {
          payload.req_method = this.updatePayload.reqMethodUpdate;
        }
        if (this.updatePayload.apiUrlUpdate) {
          payload.api_url = this.updatePayload.apiUrlUpdate;
        }
        if (
          this.updatePayload.reqPayloadUpdate &&
          (this.updatePayload.reqMethodUpdate == "POST" ||
            this.updatePayload.reqMethodUpdate == "PUT")
        ) {
          payload.req_payload = this.updatePayload.reqPayloadUpdate;
        } else {
          payload.req_payload = null;
        }
        await this.$store.dispatch("editCronExpression", {
          id: this.activeId,
          payload: payload,
        });

        await this.$store.dispatch("fetchCronList", this.params);
        this.dialogActivate = false;
        this.updatePayload.cronExpressionUpdate = null;
        this.updatePayload.cronNameUpdate = null;
        this.updatePayload.reqMethodUpdate = null;
        this.updatePayload.reqPayloadUpdate = null;
        this.updatePayload.apiUrlUpdate = null;
        this.enableLoading();
      } catch (ex) {
        console.log(ex);
      }
    },
    async addCron() {
      try {
        await this.$store.dispatch("addCron", {
          payload: {
            cron_job_name: this.addPayload.cronName
              ? this.addPayload.cronName
              : null,
            api_url: this.addPayload.apiUrl ? this.addPayload.apiUrl : null,
            req_method: this.addPayload.reqMethod
              ? this.addPayload.reqMethod
              : null,
            req_payload:
              this.addPayload.reqMethod == "POST" ||
              this.addPayload.reqMethod == "PUT"
                ? this.addPayload.reqPayload
                : null,
            cron_expression: this.addPayload.cronAddExpression
              ? this.addPayload.cronAddExpression
              : null,
            is_active: this.addPayload.isActive
              ? this.addPayload.isActive
              : null,
          },
        });
        await this.$store.dispatch("fetchCronList", 1);

        this.dialogAddActivate = false;

        this.addPayload.cronName = null;
        this.addPayload.apiUrl = null;
        this.addPayload.reqMethod = null;
        this.addPayload.reqPayload = null;
        this.addPayload.cronAddExpression = null;
        this.addPayload.isActive = null;
        this.enableLoading();
      } catch (ex) {
        console.log(ex);
      }
    },
    viewLogs(id) {
      //console.log(id);
      this.$router.push({ path: `/logs/${id}` });
    },
    enableLoading() {
      try {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 3000);
      } catch (ex) {
        console.log(ex);
      }
    },
  },
};
</script>

<style scoped>
.v-btn {
  margin-left: 5px !important;
}
.disableBtn {
  cursor: not-allowed;
  pointer-events: none;
  text-decoration: none;
  color: rgb(71, 71, 71);
  background-color: rgb(17, 17, 17);
}
.abled {
  cursor: pointer;
  pointer-events: auto;
  text-decoration: none;
  color: rgb(255, 255, 255);
  background-color: rgb(17, 17, 17);
}

</style>
 