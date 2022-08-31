<template>
  <div>
    <template>
      <v-row justify="center">
        <v-dialog
          class="justify-space-around"
          v-model="filterDate"
          persistent
          max-width="650"
        >
          <v-card>
            <v-card-text
              ><v-date-picker
                style="margin-right: 12px"
                v-model="start_date"
                class="mt-4"
                :min="min_date"
                :max="max_date"
                color="blue"
              ></v-date-picker>
              <v-date-picker
                v-model="end_date"
                class="mt-4"
                :min="min_date"
                :max="max_date"
                color="blue"
              ></v-date-picker
            ></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="danger" text @click="filterDate = false">
                Close
              </v-btn>
              <v-btn color="primary" text @click="fetchLogsList(1)">
                Filter
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <template>
      <v-row justify="center">
        <v-dialog
          class="justify-space-around"
          v-model="deleteDate"
          persistent
          max-width="650"
        >
          <v-card>
            <v-card-text
              ><v-date-picker
                style="margin-right: 12px"
                v-model="start_date_del"
                class="mt-4"
                :min="min_date"
                :max="max_date"
                color="blue"
              ></v-date-picker>
              <v-date-picker
                v-model="end_date_del"
                class="mt-4"
                :min="min_date"
                :max="max_date"
                color="blue"
              ></v-date-picker
            ></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="danger" text @click="deleteDate = false">
                Close
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="openDeleteByDateDialog()"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <template>
      <v-dialog v-model="dialogDeleteActivate" width="300">
        <v-card>
          <v-card-title class="subheadline blue" primary-title>
            Delete Log
          </v-card-title>

          <v-card-text style="padding-top: 12px">
            Do you want to delete this log?
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="danger" text @click="dialogDeleteActivate = false">
              Close
            </v-btn>
            <v-btn color="primary" text @click="deleteLog()"> Delete </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <template>
      <v-dialog v-model="dialogDeleteByDateActivate" width="300">
        <v-card>
          <v-card-title class="subheadline blue" primary-title>
            Delete Log
          </v-card-title>

          <v-card-text style="padding-top: 12px">
            Do you want to delete these logs?
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="danger"
              text
              @click="dialogDeleteByDateActivate = false"
            >
              Close
            </v-btn>
            <v-btn color="primary" text @click="deleteLogsByDate()">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <template>
      <div class="pt-10">
        <v-row class="justify-space-between">
          <v-btn class="ma-2" @click="$router.push('/')" dark>
            <v-icon dark left> mdi-arrow-left </v-icon>
            Back
          </v-btn>
          <header class="text-center">
            <h5>Cron Logs</h5>
          </header>
          <div>
            <v-btn class="ma-2" @click="filterDate = true" dark
              >Filter By Date</v-btn
            >
            <v-btn class="ma-2" dark @click="deleteDate = true">
              Delete By Date</v-btn
            >
          </div>
        </v-row>
        <div style="padding: 40px 0">
          <v-simple-table v-if="results.length > 0">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-center">ID</th>
                  <th class="text-center">Cron Name</th>
                  <th class="text-center">Response Status</th>
                  <th class="text-center">Time Taken</th>
                  <th class="text-center">Created At</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in results" :key="item.id">
                  <td class="text-center">{{ item.id }}</td>
                  <td class="text-center">{{ item.cron_job_name }}</td>
                  <td class="text-center">{{ item.response_status }}</td>
                  <td class="text-center">{{ item.time }}</td>
                  <td class="text-center">{{ item.createdAt }}</td>
                  <td class="text-center">
                    <font-awesome-icon
                      style="color: red"
                      :icon="['fa', 'trash']"
                      @click="openDeleteDialog(item.id)"
                    />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
        <div
          v-if="results.length > 0"
          style="float: right; margin: 20px 0; display: flex"
        >
          <v-btn
            :class="!cursors.hasPreviousPage ? 'disableBtn' : 'abled'"
            @click="fetchLogsList(1)"
            >First</v-btn
          >

          <v-btn
            :class="!cursors.hasPreviousPage ? 'disableBtn' : 'abled'"
            @click="fetchLogsList(cursors.startCursor)"
            >Prev</v-btn
          >

          <v-btn
            :class="!cursors.hasNextPage ? 'disableBtn' : 'abled'"
            @click="fetchLogsList(cursors.endCursor)"
            >Next</v-btn
          >

          <v-btn
            :class="!cursors.hasNextPage ? 'disableBtn' : 'abled'"
            @click="fetchLogsList(cursors.totalPages)"
            >Last</v-btn
          >
        </div>
        <p v-if="results.length == 0" style="text-align: center">
          No data found
        </p>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      results: {
        id: 0,
        cron_job_name: "",
        response_status: "",
        time: "",
        createdAt: "",
        cron_id: "",
      },
      filterDate: false,
      item: {},
      cursors: {},
      deleteDate: false,
      dialogDeleteActivate: false,
      dialogDeleteByDateActivate: false,
      start_date_del: new Date("01-02-2022").toISOString().split("T")[0],
      end_date_del: new Date().toISOString().split("T")[0],
      start_date: new Date("01-02-2022").toISOString().split("T")[0],
      end_date: new Date().toISOString().split("T")[0],
      min_date: new Date("01-02-2022").toISOString().split("T")[0],
      max_date: new Date().toISOString().split("T")[0],
      currentPage: 1,
      activeId: null,
    };
  },
  async created() {
    await this.fetchLogsList(this.currentPage);
  },
  computed: {
    ...mapGetters({
      logsList: "getLogsList",
    }),
  },
  methods: {
    async fetchLogsList(page) {
      try {
        this.currentPage = page;
        await this.$store.dispatch("fetchLogsList", {
          cron_id: this.$route.params.id,
          params: {
            params: {
              page: this.currentPage,
              start_date: new Date(this.start_date).toISOString().split("T")[0],
              end_date: new Date(
                new Date(this.end_date).getTime() + 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0],
            },
          },
        });
        if (this.logsList.status.success) {
          this.cursors = this.logsList.data.cursors;
          this.results = this.logsList.data.results.map((logs) => {
            const created = logs.createdAt
              ? new Date(logs.createdAt).toISOString()
              : null;
            return {
              id: logs.id ? logs.id : null,
              cron_job_name: logs.cron_job_name ? logs.cron_job_name : null,
              response_status: logs.response_status
                ? logs.response_status
                : null,
              time: logs.time ? logs.time : null,
              createdAt: created
                ? `${created.split("T")[0]} ${
                    created.split("T")[1].split(".")[0]
                  }`
                : null,
              cron_id: logs.cron_id ? logs.cron_id : null,
            };
          });
        }
        this.filterDate = false;
      } catch (ex) {
        console.log(ex);
      }
    },
    async openDeleteDialog(id) {
      this.activeId = id;
      this.dialogDeleteActivate = true;
    },
    async openDeleteByDateDialog() {
      this.dialogDeleteByDateActivate = true;
    },
    async deleteLogsByDate() {
      try {
        await this.$store.dispatch("deleteLogByDate", {
          params: {
            params: {
              start_date: new Date(this.start_date_del)
                .toISOString()
                .split("T")[0],
              end_date: new Date(
                new Date(this.end_date_del).getTime() + 24 * 60 * 60 * 1000
              )
                .toISOString()
                .split("T")[0],
            },
          },
          cron_id: this.results[0].cron_id,
        });
        this.dialogDeleteByDateActivate = false;
        this.deleteDate = false;
        await this.fetchLogsList(1);
      } catch (ex) {
        console.log(ex);
      }
    },
    async deleteLog() {
      try {
        this.dialogDeleteActivate = false;
        await this.$store.dispatch("deleteLog", {
          id: this.activeId,
        });
        await this.fetchLogsList(this.currentPage);
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
 