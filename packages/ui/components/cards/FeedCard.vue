<template>
  <nuxt-link v-if="detailsPath.params.id" :to="localeRoute(detailsPath)">
    <div class="card-container" :class="dataFeedStatus.key">
      <div class="title">
        <SvgIcon class="img" :name="img.name" />
        <p class="name title">{{ name.toUpperCase() }}</p>
        <InfoTooltip
          v-if="dataFeedStatus.key !== 'operational'"
          :show-icon="false"
          :value="$t(`chart.${dataFeedStatus.key}`)"
        >
          <WarningStatus
            v-if="dataFeedStatus.key !== 'operational'"
            :color="dataFeedStatus.color"
          />
        </InfoTooltip>
      </div>
      <p class="value">{{ label }} {{ formatedValue }}</p>
      <p class="timestamp">
        {{ formattedTimestamp }}
      </p>
    </div>
  </nuxt-link>
</template>

<script>
import { formatNumber } from '@/utils/formatNumber'
import { calculateTimeAgo } from '@/utils/calculateTimeAgo'
import { getDataFeedStatus } from '@/utils/getDataFeedStatus'

export default {
  name: 'FeedCard',
  props: {
    detailsPath: {
      type: Object,
      required: true,
    },
    decimals: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    img: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      required: true,
    },
    lastResultTimestamp: {
      type: String,
      required: true,
    },
    timeToUpdate: {
      type: Number,
      required: true,
    },
    network: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  computed: {
    formatedValue() {
      const lastResult = parseFloat(this.value) / 10 ** this.decimals
      const hasMeaningfullZeros =
        `${lastResult.toFixed(3)}`.split('.')[1] === '000'
      const adjustedDecimals =
        lastResult < 1 || this.decimals < 3 || hasMeaningfullZeros
          ? this.decimals
          : 3
      const formatedLastResult = lastResult.toFixed(adjustedDecimals)
      return formatNumber(formatedLastResult)
    },
    dataFeedStatus() {
      return getDataFeedStatus(this.timeToUpdate, this.lastResultTimestamp)
    },
    formattedTimestamp() {
      return calculateTimeAgo(this.lastResultTimestamp, this.$i18n.locale)
    },
  },
}
</script>

<style lang="scss" scoped>
.nuxt-link-exact-active {
  color: var(--value-color);
}
.nuxt-link-active {
  color: var(--value-color);
}
a {
  color: var(--value-color);
}
.card-container {
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-template-rows: max-content max-content;
  align-content: center;
  justify-items: flex-start;
  width: 100%;
  height: max-content;
  background: var(--card-background);
  box-shadow: var(--card-box-shadow);
  border-radius: 4px;
  font-weight: bold;
  row-gap: 8px;
  padding: 8px 16px;
  cursor: pointer;

  &.operational {
    border: var(--card-border);
  }
  &.delay {
    border: var(--delay-status-border);
  }
  &.error {
    border: var(--error-status-border);
  }
  .title {
    grid-row: 1 / span 2;
    justify-content: center;
    align-items: center;
    display: flex;
    grid-column-gap: 8px;
    .img {
      display: flex;
      justify-content: center;
      align-self: center;
    }
  }
  .timestamp {
    color: var(--value-color);
    font-size: var(--text-size-small);
    font-style: italic;
    justify-self: flex-end;
    font-weight: normal;
  }
  .name {
    color: var(--name-color);
    font-size: 18px;
    display: flex;
    align-items: center;
  }
  .value {
    color: var(--value-color);
    font-size: 18px;
    justify-self: flex-end;
  }
}
@media (max-width: 300px) {
  .card-container {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
</style>
