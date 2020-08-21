import Vue from 'vue'
import card from '../components/card.vue'
import bot from '../components/bot.vue'

Vue.component(`mem-${card.name.toLowerCase()}`, card)
Vue.component(`mem-${bot.name.toLowerCase()}`, bot)
