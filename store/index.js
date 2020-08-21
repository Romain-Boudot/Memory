import { Card } from '../class/card'
import { Player } from '../class/player'
import { STATES, NUMBERS } from '../class/types'

export const state = () => ({
  cardDimensions: {
    width: 0,
    height: 0
  },
  deck: [],
  stack: [],
  players: [],
  drawnCard: null,
  turn: 0,
  state: STATES.HAVE_TO_DRAW
})

function findPlayerIndex (state, player) {
  return state.players.findIndex(p => p.name === player.name)
}

function findMe (state) {
  return state.players.find(p => p.isMe)
}

function checkForQueenLookAtStatus (card) {
  if (card.number === NUMBERS.QUEEN && !card.used) {
    card.used = true
    card.player.lookAtCount += 1
  }
}

export const mutations = {
  pushToStack (state, card) {
    state.stack.push(card)
  },
  removeTopDeckCard (state) {
    state.deck.pop()
  },
  giveCardToPlayer (state, [card, player]) {
    card.player = player
    player.hand.push(card)
  },
  takeCardFromPlayer (state, [card, player]) {
    const index = card.player.hand.findIndex(c => c.id === (isNaN(card) ? card.id : card))
    card.player.hand.splice(index, 1)
    card.player = null
  },
  advanceInState (state) {
    switch (state.state) {
      case STATES.HAVE_TO_DRAW:
        state.state = STATES.HAVE_TO_STACK
        break
      case STATES.HAVE_TO_STACK:
        state.state = STATES.HAVE_TO_DRAW
        state.turn = (state.turn + 1) % state.players.length
        break
    }
  },
  checkForQueenLookAtStatus (state, card) {
    checkForQueenLookAtStatus(card)
  },
  set (state, [attr, value]) {
    state[attr] = value
  },
  lookAt (state, [card, bypassLookAtCount]) {
    card.lookAt(bypassLookAtCount)
    checkForQueenLookAtStatus(card)
  },
  hide (state, card) {
    card.hide()
  },
  anim (state, [card, anim]) {
    card.anim = anim
  },
  setDeck (state, deck) {
    state.deck = deck
  }
}

export const actions = {
  lookAt ({ state, commit }, card) {
    commit('lookAt', [card])
    setTimeout(() => {
      commit('hide', card)
    }, 5000)
  },

  draw ({ state, commit }, p) {
    const player = p || findMe(state)
    if (state.deck.length > 0 && state.turn === findPlayerIndex(state, player) && state.state === STATES.HAVE_TO_DRAW) {
      commit('anim', [state.deck.slice(-1)[0], 'slide-bot'])
      setTimeout(() => {
        commit('anim', [state.deck.slice(-1)[0], ''])
        const card = state.deck.slice(-1)[0]
        commit('removeTopDeckCard')
        commit('giveCardToPlayer', [card, player])
        commit('lookAt', [card, true])
        commit('set', ['drawnCard', card])
        commit('advanceInState')
      }, 200)
    }
  },

  drawFromStack ({ state, commit }, p) {
    const player = p || findMe(state)
    if (state.stack.length > 0 && state.turn === findPlayerIndex(state, player) && state.state === STATES.HAVE_TO_DRAW) {
      commit('anim', [state.stack.slice(-1)[0], 'slide-bot'])
      setTimeout(() => {
        commit('anim', [state.stack.slice(-1)[0], ''])
        const card = state.stack.slice(-1)[0]
        commit('removeTopStackCard')
        commit('giveCardToPlayer', [card, player])
        commit('lookAt', [card, true])
        commit('set', ['drawnCard', card])
        commit('advanceInState')
      }, 200)
    }
  },

  sendToStack ({ state, commit }, card) {
    const lastStackCard = state.stack.slice(-1)[0]
    if (lastStackCard && lastStackCard.number === card.number && state.stack.length > 0) {
      commit('checkForQueenLookAtStatus', card)
      commit('takeCardFromPlayer', [card, card.player])
      commit('pushToStack', card)
    } else if (state.turn === findPlayerIndex(state, card.player) && state.state === STATES.HAVE_TO_STACK) {
      commit('checkForQueenLookAtStatus', card)
      commit('hide', state.drawnCard)
      commit('set', ['drawnCard', null])
      commit('takeCardFromPlayer', [card, card.player])
      commit('pushToStack', card)
      commit('advanceInState')
    } else {
      for (let i = 0; i < 2; i++) {
        if (state.deck.length > 0) {
          const newCard = state.deck.slice(-1)[0]
          commit('removeTopDeckCard')
          commit('giveCardToPlayer', [newCard, card.player])
        }
      }
    }
  },

  initGame ({ state, commit }, players) {
    const nbOfCardsPerPlayer = 5
    commit('set', ['deck', Card.getFullShuffledDeck()])
    commit('set', ['players', players.map(player => new Player(player.name, player.type, player.me))])

    for (let i = 0; i < nbOfCardsPerPlayer * players.length; i++) {
      const card = state.deck.slice(-1)[0]
      commit('removeTopDeckCard')
      commit('giveCardToPlayer', [card, state.players[i % players.length]])
    }
  }
}
