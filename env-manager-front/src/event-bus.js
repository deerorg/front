import Vue from 'vue'
export const EventBus = new Vue()
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function() {
      return EventBus
    }
  }
})
