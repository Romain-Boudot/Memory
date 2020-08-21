<template>
  <div class="container">
    <div class="title">
      Memory
    </div>
    <el-button class="btn" @click="navTo('/bot')">
      1 Joueur / 1 BOT
    </el-button>
    <el-button class="btn" disabled="">
      Multijoueur
    </el-button>
    <el-button class="btn" disabled="">
      Multijoueur en ligne
    </el-button>
  </div>
</template>

<script>
export default {
  data () {
    return { }
  },
  methods: {
    navTo (link) {
      this.$router.push(link)
    }
  }
}
</script>

<style>
.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  max-width: 100vw;
  width: 45em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 1em;
}

.btn {
  margin: 1em 0 0 !important;
  min-width: 15em;
}
</style>
