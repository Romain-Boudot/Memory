import { COLORS, NUMBERS } from './types'

export class Card {
  static getFullShuffledDeck () {
    return Object.keys(COLORS)
      .reduce((deck, color) => deck.concat(Object.keys(NUMBERS).map(number => new Card(color, number))), [])
      .sort(() => Math.random() - 0.5)
      .sort(() => Math.random() - 0.5)
  }

  color
  number
  id
  noCard
  player
  lookedAt = false
  lookingAt = false
  used = false
  anim = ''

  get colorSymbol () {
    switch (this.color) {
      case COLORS.CLUB:
        return '♣'
      case COLORS.DIAMOND:
        return '♦'
      case COLORS.HEART:
        return '♥'
      case COLORS.SPADE:
        return '♠'
      default:
        return '∅'
    }
  }

  get isBlack () {
    return this.color === COLORS.CLUB || this.color === COLORS.SPADE
  }

  get isFace () {
    return this.number === NUMBERS.JACK || this.number === NUMBERS.KING || this.number === NUMBERS.QUEEN
  }

  get isAs () {
    return this.number === NUMBERS[1]
  }

  get isInHand () {
    return !!this.player && this.player.isMe
  }

  constructor (color, number, player, noCard = false) {
    this.player = player
    this.color = color
    this.number = number
    this.noCard = noCard
    this.id = btoa(color + number)
  }

  canLookAt () {
    return !this.lookingAt && !this.lookedAt && !(!this.isInHand || !this.player.canLookAt())
  }

  lookAt (bypassLookAtCount = false) {
    if (this.canLookAt() || bypassLookAtCount) {
      if (!bypassLookAtCount) {
        this.player.lookAtCount -= 1
      }
      this.lookedAt = true
      this.lookingAt = true
    }
  }

  hide () {
    this.lookingAt = false
  }

  getPoint () {
    switch (this.number) {
      case NUMBERS[1]:
      case NUMBERS[2]:
      case NUMBERS[3]:
      case NUMBERS[4]:
      case NUMBERS[5]:
      case NUMBERS[6]:
      case NUMBERS[7]:
      case NUMBERS[8]:
      case NUMBERS[9]:
      case NUMBERS[10]:
        return Number.parseInt(this.number, 10)
      case NUMBERS.JACK:
      case NUMBERS.QUEEN:
        return 20
      case NUMBERS.KING:
        return this.color === COLORS.DIAMOND || this.color === COLORS.HEART ? 0 : 50
      default:
        return -1
    }
  }
}
