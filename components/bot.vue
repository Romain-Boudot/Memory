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
        this.$store.subscribe((mutation, state) => {
          if (mutation.type === 'advanceInState' && this.turn === this.myTurn && this.state === STATES.HAVE_TO_DRAW) {
            this.lookAtCards()
            resolveAfterOneSecond()
              .then(this.stackCardsICanStack.bind(this))
              .then(this.drawCard.bind(this))
              .then(this.stackCard.bind(this))
          }
        })
      }
    })
  },
  methods: {
    lookAtCards () {
      const unknownCards = this.player.hand.filter(c => !c.lookedAt)
      while (this.player.lookAtCount > 0 && unknownCards.length > 0) {
        this.$store.dispatch('lookAt', unknownCards.shift())
      }
    },
    stackCardsICanStack () {
      const { stack } = this.$store.state
      if (stack.length > 0) {
        const cards = this.player.hand.filter(c => c.lookedAt && c.number === stack.slice(-1)[0].number)
        cards.forEach((card) => {
          this.$store.dispatch('sendToStack', card)
        })
      }
      this.lookAtCards()
      return resolveAfterOneSecond()
    },
    drawCard () {
      this.$store.dispatch('draw', this.player)
      this.stackCardsICanStack()
      return resolveAfterOneSecond()
    },
    stackCard () {
      const sortedCards = this.player.hand.filter(c => c.lookedAt).sort((a, b) => a.getPoint() - b.getPoint())
      this.$store.dispatch('sendToStack', sortedCards.pop())
      this.stackCardsICanStack()
      return resolveAfterOneSecond()
    }
  }
}
</script>

<style>
.hidden {
  display: none;
}
</style>
