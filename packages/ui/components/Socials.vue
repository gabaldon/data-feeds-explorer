<template>
  <div class="links">
    <a
      v-for="social in socials"
      :key="social.svgName"
      class="link"
      :href="social.url"
      target="_blank"
    >
      <SvgIcon :name="social.svgName" />
    </a>
  </div>
</template>

<script>
import { urls } from '../constants'

export default {
  data() {
    return {
      socials: ['github', 'telegram', 'discord', 'twitter', 'reddit'].map(
        (socialName) => ({ svgName: socialName, url: urls[socialName] })
      ),
    }
  },
}
</script>

<style lang="scss" scoped>
.links {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 24px;
  .link {
    margin-right: 24px;
    &:last-of-type {
      margin-right: 0;
    }
  }
}
@media (max-width: 1200px) {
  .links {
    margin: 0 24px;
  }
}
</style>
