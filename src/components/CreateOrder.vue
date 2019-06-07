<template>
  <v-card>
    <v-card-title><span class="title font-weight-light">Make Order</span></v-card-title>
    <v-card-text align-center justify-center>
      <v-form>
        <v-text-field
          v-model="orderQty"
          :rules="orderQtyRules"
          label="Oбъем ордера"
          required
        ></v-text-field>

        <v-btn color="success" @click="submit('Buy')">Купить</v-btn>
        <v-btn color="primary" @click="submit('Sell')">Продать</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import api from '@/api'

export default {
  name: 'create-order',
  props: {
    instrument: {
      required: true,
      type: String
    }
  },
  created () {
    this.setDefaults()
    this.symbol = this.instrument
  },
  data () {
    return {
      loading: false,
      ordType: '',
      symbol: '',
      orderQty: 0,
      orderQtyRules: [
        v => !!v || 'Oбъем ордера - обязательное поле',
        v => parseInt(v) !== 0 || 'Oбъем ордера должен быть больше 0'
      ]
    }
  },
  methods: {
    submit (side) {
      if (this.laoding) return

      this.loading = true

      let data = {
        ordType: this.ordType,
        symbol: this.symbol,
        orderQty: this.orderQty,
        side: side
      }

      api.makeOrder(data).then(response => {
        this.loading = false
        this.$emit('created')
      }).catch(error => {
        this.loading = false
        console.error(error.response.data.error.message)
      })
    },
    setDefaults () {
      this.ordType = 'Market'
      this.symbol = ''
      this.orderQty = 1
    }
  },
  watch: {
    instrument (value) {
      this.setDefaults()
      this.symbol = value
    }
  }
}
</script>
