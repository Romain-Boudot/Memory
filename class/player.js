export class Player {
  static TYPES = {
    BOT: 'BOT',
    LOCAL_PLAYER: 'LOCAL_PLAYER',
    ONLINE_PLAYER: 'ONLINE_PLAYER'
  }

  name
  hand
  type
  noPlayer
  lookAtCount
  isMe

  get handLength () {
    return this.hand.length
  }

  constructor (name, type, me = false, noPlayer = false) {
    this.name = name
    this.type = type || Player.TYPES.BOT
    this.hand = []
    this.noPlayer = noPlayer
    this.isMe = me
    this.lookAtCount = 2
  }

  canLookAt () {
    return this.lookAtCount > 0
  }

  get (index) {
    return this.hand[index]
  }
}
