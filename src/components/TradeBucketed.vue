<template>
  <v-card>
    <v-card-title><span class="title font-weight-light">Trade Bucketed</span></v-card-title>
    <v-card-text align-center justify-center>
      <transition name="fade">
        <v-data-table :items="trade" :headers="headers" :rows-per-page-items="[12]" class="elevation-1">
          <template v-if="!loading" v-slot:items="props">
            <td class="text-xs-left">{{ dateFormat(props.item.timestamp) }}</td>
            <td class="text-xs-left">{{ props.item.open  }}</td>
            <td class="text-xs-left">{{ props.item.high  }}</td>
            <td class="text-xs-left">{{ props.item.low  }}</td>
            <td class="text-xs-left">{{ props.item.close  }}</td>
            <td class="text-xs-left">{{ props.item.volume  }}</td>
          </template>
        </v-data-table>
      </transition>
    </v-card-text>
  </v-card>
</template>

<script>
import api from '@/api'
import { formatDate } from '@/utils/formatDate'

export default {
  name: 'trade-bucketed',
  props: {
    instrument: {
      required: true,
      type: String
    }
  },
  created () {
    this.symbol = this.instrument
    this.fetch()
  },
  data () {
    return {
      loading: true,
      symbol: '',
      trade: [],
      headers: [
        { text: 'Время свечи', sortable: false },
        { text: 'Цена открытия', sortable: false },
        { text: 'Максимальная цена свечи', sortable: false },
        { text: 'Минимальная цена свечи', sortable: false },
        { text: 'Цена закрытия свечи', sortable: false },
        { text: 'Объем сделок', sortable: false }
      ]
    }
  },
  methods: {
    fetch () {
      if (this.symbol.length === 0) return

      let filters = {
        binSize: { value: '1m' },
        partial: { value: false },
        count: { value: 100 },
        reverse: { value: true },
        symbol: { value: this.symbol }
      }

      api.getTradeBucketed(filters).then(response => {
        this.trade = Object.assign([], response.data)
        this.loading = false
        this.$store.dispatch('subscribe', `tradeBin${filters.binSize.value}:${this.symbol}`)
      }).catch(error => {
        console.log(error)
      })
    },
    dateFormat (val) {
      return formatDate(val)
    }
  },
  computed: {
    tradeBin1m: function () {
      return this.$store.getters.getTradeBin1m
    }
  },
  watch: {
    instrument (value) {
      this.loading = true
      this.symbol = value
      this.fetch()
    },
    tradeBin1m (newTrade) {
      this.trade.splice(0, 0, newTrade)
    }
  }
}
</script>
