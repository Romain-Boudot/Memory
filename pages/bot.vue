<template>
  <div class="board-container">
    <mem-bot :player="bot" />
    <div v-if="!!bot" class="bothand">
      <mem-card
        v-for="card in bot.hand"
        :key="card.id"
        :card="card"
        :shown="false"
      />
    </div>
    <div class="board">
      <div class="deck">
        <mem-card v-if="deck.length > 1" />
        <mem-card v-if="deck.length <= 1" :shown="true" />
        <mem-card
          v-if="deck.length > 0"
          :card="deck.slice(-1)[0]"
          @top-click="draw"
          @bot-click="draw"
        />
      </div>
      {{ state }}
      <div class="stack">
        <mem-card
          :shown="true"
          :card="stack.slice(-1)[0]"
          @top-click="drawFromStack"
          @bot-click="drawFromStack"
        />
      </div>
    </div>
    <div v-if="!!player" class="playerhand">
      <div class="vue-conter">
        {{ player.lookAtCount }}
      </div>
      <mem-card
        v-for="card in player.hand"
        :key="card.id"
        :card="card"
        @top-click="sendToStack"
        @bot-click="lookAt"
      />
    </div>
  </div>
</template>

<script>
import { Player } from '../class/player'

export default {
  data () {
    return { }
  },

  computed: {
    state () {
      return this.$store.state.state + ' ' + this.$store.state.turn
    },
    bot () {
      return this.$store.state.players.find(player => player.type === Player.TYPES.BOT)
    },
    player () {
      return this.$store.state.players.find(player => player.isMe)
    },
    deck () {
      return this.$store.state.deck
    },
    stack () {
      return this.$store.state.stack
    }
  },

  mounted () {
    this.$store.dispatch('initGame', [
      { name: 'moi', type: Player.TYPES.LOCAL_PLAYER, me: true },
      { name: 'bot', type: Player.TYPES.BOT, me: false }
    ])
    this.setCardDimensions()
    document.body.onresize = this.setCardDimensions.bind(this)
  },

  methods: {
    setCardDimensions () {
      this.$store.commit('set', ['cardDimensions', {
        width: Math.min(document.body.scrollWidth, 650) * 0.2,
        height: Math.min(document.body.scrollWidth, 650) * 0.2 * 1.52
      }])
    },

    draw () {
      this.$store.dispatch('draw')
    },

    drawFromStack () {
      this.$store.dispatch('drawFromStack')
    },

    sendToStack (card) {
      this.$store.dispatch('sendToStack', card)
    },

    lookAt (card) {
      this.$store.dispatch('lookAt', card)
    }
  }
}
</script>

<style>
.board-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  height: 100vh;
}

.board {
  flex: 2 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: stretch;
}

.deck,
.stack {
  display: flex;
  align-items: center;
  justify-content: center;
}

.bothand,
.playerhand {
  padding: 1em;
  position: relative;
  flex: 1 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  overflow: auto;
}

.vue-conter {
  position: absolute;
  bottom: .05em;
  left: 1em;
}

.deck {
  position: relative;
}

.deck>*:first-child {
  position: absolute;
  z-index: -1;
}

</style>
