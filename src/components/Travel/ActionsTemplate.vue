<template>
  <div>
    <b-button v-if="isWPManager || isAdmin" variant="success" class="actionbutton" @click="edit(data)" title="Edit Travel">
      <font-awesome-icon far icon="edit" class="icon"></font-awesome-icon>
    </b-button>
    <b-button variant="success" class="actionbutton" @click="report(data)" title="Add/Edit Trip Report">
      <font-awesome-icon far icon="upload" class="icon"></font-awesome-icon>
    </b-button>
    <b-button v-if="isWPManager || isAdmin || isPM" variant="warning" class="actionbutton" @click="postpone(data)" title="Postpone Travel">
      <font-awesome-icon far icon="hand-paper" class="icon"></font-awesome-icon>
    </b-button>
    <b-button v-if="isWPManager || isAdmin || isPM" variant="danger" class="actionbutton" @click="cancel(data)" title="Cancel Travel">
      <font-awesome-icon far icon="plane-slash" class="icon"></font-awesome-icon>
    </b-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: {}
    }
  },
  methods: {
    edit: function(data) {
      this.$router.push({ name: "Edit Travel", params: { back: "Travel Tracker", TripId: data.Id } })
    },
    report: function(data) {
      this.$router.push({ name: "Trip Report", params: { back: "Travel Tracker", TripId: data.Id, IndexNumber: data.IndexNumber } })
    },
    postpone: async function(data) {
      console.log(`Postpone Data: ${JSON.stringify(data)}`)
      // post the data to the list and then reload the data
      // const response = await Travel.dispatch("postponeTravel", data)
      this.$router.push({ name: "Travel", params: { mode: "refreshtracker" } })
    },
    cancel: async function(data) {
      console.log(`Cancel Data: ${JSON.stringify(data)}`)
      // post the data to the list and then reload the data
      // const response = await Travel.dispatch("cancelTravel", data)
      this.$router.push({ name: "Travel", params: { mode: "refreshtracker" } })
    }
  },
  computed: {
    isPM() {
      return this.$store.state.users.currentUser.isPM
    },
    isAdmin() {
      return this.$store.state.users.currentUser.isAdmin
    },
    isWPManager() {
      return this.$store.state.users.currentUser.isWPManager
    },
    isSubcontractor() {
      return this.$store.state.users.currentUser.isSubcontractor
    },
    isAFRL() {
      return this.$store.state.users.currentUser.isAFRL
    }
  }
}
</script>

<style lang="scss">
.actionbutton {
  margin: 2px;
}
</style>
