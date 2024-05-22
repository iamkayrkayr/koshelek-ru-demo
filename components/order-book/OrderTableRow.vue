<template>
  <tr
      :style="{
            backgroundImage: makeRowBackgroundImage(),
    }"
  >
    <td
        v-if="isColumnVisible('price')"
    >{{ priceDisplay }}
    </td>
    <td
        v-if="isColumnVisible('quantity')"
        class="text-end"
    >{{ quantityDisplay }}
    </td>
    <td
        v-if="isColumnVisible('total')"
        class="text-end"
    >{{ totalDisplay }}
    </td>
  </tr>
</template>

<script setup>

const props = defineProps({
  entry: {
    type: Array,
    required: true,
  },
  quantityErp: {
    type: Number,
    required: true,
  },
  theme: {
    validator(value) {
      return ['ask', 'bid'].includes(value)
    },
  },
  columns: {
    type: Array,
    default: undefined,
  },
  symbolInfo: {
    type: Object,
    required: true,
  },
});

function isColumnVisible(column) {
  return (!props.columns) || (props.columns.includes(column));
}

const pricePrecision = computed(() => props.symbolInfo.pricePrecision);

const price = computed(() => props.entry[0]);
const priceDisplay = computed(() => {
  return Number(price.value).toFixed(pricePrecision.value);
});

const quantity = computed(() => props.entry[1]);
const quantityDisplay = computed(() => {
  return Number(quantity.value).toFixed(5);
});

const total = computed(() => (price.value * quantity.value));
const totalDisplay = computed(() => {
  return Number(total.value).toFixed(5);
});

function makeRowBackgroundImage() {
  const percentage = Math.pow(props.quantityErp, .25) * 100;
  switch (props.theme) {
    case 'ask':
      return `linear-gradient(90deg, #F4433620 ${percentage}%, transparent ${percentage}%)`;
    case 'bid':
      return `linear-gradient(90deg, transparent ${100 - percentage}%, #4CAF5020 ${100 - percentage}%)`;
  }
}

</script>
