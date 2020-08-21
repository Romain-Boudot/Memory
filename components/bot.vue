<template>
  <div class="hidden" />
</template>

<script>
import { Player } from '../class/player'
import { STATES } from '../class/types'

function resolveAfterOneSecond () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

export default {
  name: 'Bot',
  props: {
    player: { type: Player, default: () => new Player('', Player.TYPES.BOT, false, true) }
  },
  data () {
    return { }
  },
  computed: {
    state () {
      return this.$store.state.state
    },
    turn () {
      return this.$store.state.turn
    },
    myTurn () {
      return this.$store.state.players.findIndex(player => player.name === this.player.name)
    },
    opponent () {
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
    this.$store.subscribeAction((action, state) => {
      if (action.type === 'initGame') {
        console.debug('game inited')
        this.$store.subscribe((mutation, state) => {
          if (mutation.type === 'advanceInState' && this.turn === this.myTurn && this.state === STATES.HAVE_TO_DRAW) {
            const unknownCards = this.player.hand.filter(c => !c.lookedAt)
            console.debug('unknownCards', unknownCards, this.player.lookAtCount, unknownCards.length)
            while (this.player.lookAtCount > 0 && unknownCards.length > 0) {
              console.debug('look at', unknownCards.slice(0, 1))
              this.$store.dispatch('lookAt', unknownCards.shift())
            }
            resolveAfterOneSecond()
              .then(() => {
                const { stack } = this.$store.state
                if (stack.length > 0) {
                  const cards = this.player.hand.filter(c => c.lookedAt && c.number === stack.slice(-1)[0].number)
                  cards.forEach((card) => {
                    this.$store.commit('sendToStack', card)
                  })
                }
                return resolveAfterOneSecond()
              })
              .then(() => {
                this.$store.dispatch('draw', this.player)
                return resolveAfterOneSecond()
              })
              .then(() => {
                // stack
                return resolveAfterOneSecond()
              })
          }
        })
      }
    })
  }
}
</script>

<style>
.hidden {
  display: none;
}
</style>
