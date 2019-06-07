<template>
  <v-layout row wrap class="dashboard">
    <v-flex md3>
      <v-card>
        <v-card-title><span class="title font-weight-light">Instruments</span></v-card-title>
        <v-card-text align-center justify-center>
          <transition name="fade">
            <v-data-table :items="instruments" :headers="iHeaders" :rows-per-page-items="[12]" class="elevation-1">
              <template v-if="!loading" v-slot:items="props">
                <tr class="instrument-item" @click="toggleInstrument(props.item.symbol)">
                  <td class="text-xs-left">{{ props.item.symbol }}</td>
                  <td class="text-xs-left">{{ props.item.lastPrice  }}</td>
                </tr>
              </template>
            </v-data-table>
          </transition>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex md7>
      <trade-bucketed :instrument="toggledInstrument"/>
    </v-flex>
    <v-flex md2>
      <transition name="fade">
        <create-order v-if="toggledInstrument.length > 0" :instrument="toggledInstrument" @created="init()"/>
      </transition>
    </v-flex>
    <v-layout align-start class="bottom mt-4">
      <v-card>
        <v-card-title><span class="title font-weight-light">Orders</span></v-card-title>
        <v-card-text align-center justify-center>
          <transition name="fade">
            <v-data-table :items="orders" :headers="headers" :rows-per-page-items="[12]" class="elevation-1">
              <template v-if="!loading" v-slot:items="props">
                <td>{{ props.item.orderID }}</td>
                <td class="text-xs-left">{{ props.item.symbol }}</td>
                <td class="text-xs-left">{{ props.item.orderQty  }}</td>
                <td class="text-xs-left">{{ dateFormat(props.item.timestamp) }}</td>
                <td class="text-xs-left">{{ props.item.side }}</td>
                <td class="text-xs-left">{{ props.item.price }}</td>
                <td class="text-xs-left">{{ props.item.ordStatus }}</td>
              </template>
            </v-data-table>
          </transition>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-layout>
</template>

<script>
import api from '@/api'
import TradeBucketed from '@/components/TradeBucketed'
import CreateOrder from '@/components/CreateOrder'
import { formatDate } from '@/utils/formatDate'

export default {
  name: 'dashboard',
  components: {
    TradeBucketed,
    CreateOrder
  },
  created () {
    this.init()
  },
  data () {
    return {
      loading: true,
      orders: [],
      instruments: [],
      headers: [
        { text: 'ID', sortable: false },
        { text: 'Валютная пара', sortable: false },
        { text: 'Объем', sortable: false },
        { text: 'Дата создания', sortable: false },
        { text: 'Тип', sortable: false },
        { text: 'Цена', sortable: false },
        { text: 'Состояние', sortable: false }
      ],
      iHeaders: [
        { text: 'Валютная пара', sortable: false },
        { text: 'Последняя цена', sortable: false }
      ],
      toggledInstrument: ''
    }
  },
  methods: {
    init () {
      this.closeInstruments()
      api.getActiveInstruments().then(iResponse => {
        this.instruments = Object.assign([], iResponse.data)

        let orderFilters = {
          count: { value: 100 },
          reverse: { value: true }
        }
        api.getOrders(orderFilters).then(oResponse => {
          this.orders = Object.assign([], oResponse.data)
          this.loading = false
        }).catch(e => {
          console.error(e.response)
        })
      }).catch(error => {
        console.error(error.response)
      })
    },
    updateIntsruments (data) {
      let symbol = data.symbol
      let instrument = null
      let iN = 0

      for (let i in this.instruments) {
        if (symbol === this.instruments[i].symbol) {
          instrument = this.instruments[i]
          iN = i
          break
        }
      }

      if (instrument !== null) {
        console.log(`${symbol}: ${this.instruments[iN].lastPrice} -> ${instrument.lastPrice}`)
        this.$set(this.instruments[iN], 'lastPrice', instrument.lastPrice)
      }
    },

    dateFormat (val) {
      return formatDate(val)
    },
    toggleInstrument (symbol) {
      this.$store.dispatch('unsubscribe', `tradeBin1m:${this.toggledInstrument}`)
      this.toggledInstrument = symbol
    },
    closeInstruments () {
      this.$store.dispatch('unsubscribe', `tradeBin1m:${this.toggledInstrument}`)
      this.toggledInstrument = ''
    }
  },
  computed: {
    connectedToSocket: function () {
      return this.$store.getters.connectedToSocket
    },
    instrument: function () {
      return this.$store.getters.getUpdatedInstrument
    }
  },
  watch: {
    connectedToSocket (connected) {
      if (connected) {
        this.$store.dispatch('subscribe', 'instrument')
      }
    },
    instrument (updated) {
      this.updateIntsruments(updated)
    }
  }
}
</script>

<style scoped lang="scss">
  .dashboard {

    tr.instrument-item {
      cursor: pointer;
    }
  }
</style>
