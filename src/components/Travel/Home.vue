<template>
  <b-container fluid class="contentHeight"></b-container>
</template>

<script>
export default {
  name: 'Home',
  props: {
    mode: {
      type: String,
      default: 'default'
    }
  },
  errorCaptured(err, vm, info) {
    const notification = {
      type: 'danger',
      title: 'Error in traveltracker.vue ' + err,
      message: info,
      push: false
    }
    this.$store.dispatch('notification/add', notification, { root: true })
  },
  mounted: function() {
    this.$store.dispatch('support/addActivity', '<div class="bg-info">TRAVEL HOME MOUNTED: ' + this.mode + '</div>')
    // Get Travel. This will make sure that the latest travel items are available.
    if (this.mode == 'refreshtracker') {
      this.$router.push({ name: 'Travel Tracker' })
    }
    if (this.mode == 'refreshcalendar') {
      this.$router.push({ name: 'Travel Calendar' })
    }
    if (this.mode == 'new') {
      this.$router.push({ name: 'New Travel', params: { back: 'Travel Tracker' } })
    }
  },
  beforeDestroy() {
    this.$store.dispatch('support/setLegendItems', [])
  }
}
</script>

<style lang="scss">
.modal-body {
  padding: 0.5rem !important;
}

.sorted {
  color: #04ee04 !important;
}

.full {
  width: 100%;
}

#FilterModal .modal-dialog {
  margin: 1.75rem 0 auto !important;
}

#ShowFilters {
  height: 40px;
}

.tableHeight {
  height: calc(100vh - 130px);
}

#ulFields {
  list-style-type: none;
  background-color: white;
  color: black !important;
  width: 100%;
  margin-bottom: 10px;
  font-size: 16px !important;
  padding: 10px;
}

#ulFields li {
  list-style-type: none;
  margin-bottom: 5px !important;
}

.filterform {
  height: 22px !important;
  border: 1px solid black !important;
  border-radius: 4px !important;
  font-size: 1rem;
}

.e-time {
  display: none !important;
}

.e-label {
  font-size: 16px !important;
}

.detailtable td {
  font-size: 13px;
  padding: 4px;
  width: 800px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#EditTable {
  font-size: 0.75rem !important;
}

.table td,
.table th {
  padding: 0.15rem !important;
}

.e-pager {
  height: 60px;
}

.e-toolbar {
  min-height: 39px; /* There is a 1px top border so height will be 40px. Used in calculating #data rows */
}

input.e-input {
  height: 20px !important;
}

.e-input-group.e-control-wrapper .e-input-group-icon,
.e-input-group .e-input-group-icon {
  min-height: 20px !important;
}

.e-icon-grightarrow,
.e-icon-gdownarrow {
  color: black !important;
}
</style>
