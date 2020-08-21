<template>
  <div :class="['card-container', card.anim]" :style="{height: height + 'px', width: width + 'px', fontSize: width * 0.1 + 'px'}">
    <div class="half-top" @click="topClick">
      {{ card.lookedAt }}
    </div>
    <div class="half-bot" @click="botClick" />

    <div
      v-if="!card.noCard"
      :class="['face', 'card', card.isBlack ? 'black' : 'red', (card.player && card.player.isMe && card.lookingAt) || shown ? 'lookingAt' : 'hide']"
      :content="`${card.lookingAt || shown ? card.colorSymbol : ''}`"
    >
      <span v-if="(card.player && card.player.isMe && card.lookingAt) || shown">
        {{ card }}
      </span>
    </div>

    <div
      :class="['back', (card.player && card.player.isMe && card.lookingAt) || shown ? 'lookingAt' : 'hide']"
    >
      <span>
        ∮
      </span>
    </div>

    <div v-if="card.noCard" class="noCard">
      No Card
    </div>
  </div>
</template>

<script>
import { Card } from '../class/card'

export default {
  name: 'Card',
  props: {
    card: { type: Card, default: () => new Card('', '', true) },
    shown: { type: Boolean, default: false }
    // anim: { type: String, default: null }
  },
  computed: {
    height () {
      return this.$store.state.cardDimensions.height
    },
    width () {
      return this.$store.state.cardDimensions.width
    }
  },
  methods: {
    topClick () {
      this.$emit('top-click', this.card)
    },
    botClick () {
      this.$emit('bot-click', this.card)
    }
  }
}
</script>

<style>
.card-container {
  margin: .2em;
  padding: .2em;
  position: relative;
  user-select: none;
}

.half-top,
.half-bot {
  left: 0;
  right: 0;
  height: 50%;
  z-index: 100;
  position: absolute;
  cursor: pointer;
}

.half-top {
  top: 0;
}

.half-bot {
  bottom: 0;
}

.face,
.back {
  background-color: white;
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: .5em;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  transition: .5s;
}

.back span {
  font-size: 5em;
  letter-spacing: -.1em;
}

.face {
  transform: rotateY(180deg);
}

.face.lookingAt {
  transform: rotateY(0deg);
}

.back.lookingAt {
  transform: rotateY(180deg);
}

.card span {
  font-size: 5em;
  letter-spacing: -.1em;
}

.card.black {
  color: black
}

.card.red {
  color: red
}

.card::before,
.card::after {
  white-space: pre;
  line-height: 18px;
  font-size: 20px;
  text-align: center;
  position: absolute;
  content: attr(content);
}

.card::before {
  top: .2em;
  left: .2em;
}

.card::after {
  transform: rotate(180deg);
  bottom: .2em;
  right: .2em;
}

.noCard {
  border-radius: .3em;
}

.slide-bot {
  transition: .2s;
  transform: translateY(5em);
  opacity: 0;
}

.slide-top {
  transition: .2s;
  transform: translateY(-5em);
  opacity: 0;
}

.slide-right {
  transition: .2s;
  transform: translateX(5em);
  opacity: 0;
}

.slide-left {
  transition: .2s;
  transform: translateX(-5em);
  opacity: 0;
}
</style>
