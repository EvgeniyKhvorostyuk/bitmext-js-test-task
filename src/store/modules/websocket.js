import Vue from 'vue'

export default {
  state: {
    isConnected: false,
    subscriptions: [],
    instrument: {},
    tradeBin1m: {}
  },
  getters: {
    connectedToSocket (state) {
      return state.isConnected
    },
    getSubscriptions (state) {
      return state.subscriptions
    },
    getUpdatedInstrument (state) {
      return state.instrument
    },
    getTradeBin1m (state) {
      return state.tradeBin1m
    }
  },
  mutations: {
    SOCKET_ONOPEN (state, event) {
      Vue.prototype.$socket = event.currentTarget
      state.isConnected = true
    },
    SOCKET_ONMESSAGE (state, event) {
      if (event.success && event.subscribe !== undefined) {
        state.subscriptions.push(event.subscribe)
      } else if (event.success && event.unsubscribe !== undefined) {
        let sIndex = state.subscriptions.indexOf(event.unsubscribe)
        if (sIndex !== -1) state.subscriptions.splice(sIndex, 1)
      }
      console.log(event)
    },
    SOCKET_ONCLOSE (state, event) {
      state.isConnected = false
    },
    SET_INSTRUMENT (state, update) {
      state.instrument = Object.assign({}, update)
    },
    SET_TRADE (state, trade) {
      state[trade.table] = Object.assign({}, trade.data)
    }
  },
  actions: {
    sendMessage: function (context, message) {
      Vue.prototype.$socket.sendObj(message)
    },
    subscribe: function (context, table) {
      let message = { op: 'subscribe', args: [] }
      message.args.push(table)
      context.dispatch('sendMessage', message)
    },
    unsubscribe: function (context, table) {
      if (table.length === 0) return

      let message = { op: 'unsubscribe', args: [] }
      let subscribed = false

      for (let i in context.state.subscriptions) {
        if (context.state.subscriptions[i] === table) {
          subscribed = true
          break
        }
      }

      if (!subscribed) return
      message.args.push(table)
      context.dispatch('sendMessage', message)
    },

    partial (context, m) {
      //
    },
    update (context, m) {
      if (context.state.subscriptions.includes(m.table)) {
        switch (m.table) {
          case 'instrument':
            if (m.data[0].lastPrice !== undefined) {
              context.commit('SET_INSTRUMENT', m.data[0])
            }
            break
        }
      }
    },
    insert (context, m) {
      let table = `${m.table}:${m.data[0].symbol}`
      if (context.state.subscriptions.includes(table)) {
        console.log(m)
        context.commit('SET_TRADE', { table: m.table, data: m.data[0] })
      }
    },
    delete (context, m) {
      //
    }
  }
}
