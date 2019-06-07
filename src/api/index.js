import axios from 'axios'
import { addQueryParams } from './addQueryParams'
const crypto = require('crypto')

export default {
  call (method, resource, data) {
    const apiKey = process.env.VUE_APP_API_KEY
    const apiSecret = process.env.VUE_APP_API_SECRET
    let expires = Math.round(new Date().getTime() / 1000) + 60
    let stringData = data ? JSON.stringify(data) : ''
    let signature = crypto.createHmac('sha256', apiSecret).update(method + resource + expires + stringData).digest('hex')
    let headers = {
      'content-type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'api-expires': expires,
      'api-key': apiKey,
      'api-signature': signature
    }

    return axios({
      method: method,
      url: resource,
      headers: headers,
      data: data
    })
  },

  getActiveInstruments () {
    return this.call('GET', addQueryParams('/api/v1/instrument/active'))
  },
  getTradeBucketed (filters) {
    return this.call('GET', addQueryParams('/api/v1/trade/bucketed', filters))
  },
  getOrders (filters) {
    return this.call('GET', addQueryParams('/api/v1/order', filters))
  },
  makeOrder (data) {
    return this.call('POST', '/api/v1/order', data)
  },

  getWebsocketHelp () {
    return this.call('GET', '/api/v1/schema/websocketHelp')
  }
}
