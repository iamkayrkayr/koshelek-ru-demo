<template>
  <tr
      :style="{
            backgroundImage: makeRowBackgroundImage(),
    }"
  >
    <td>{{ priceDisplay }}</td>
    <td class="text-end">{{ quantityDisplay }}</td>
    <td class="text-end">{{ totalDisplay }}</td>
  </tr>
</template>

<script setup>

const props = defineProps({
  entry: {
    type: Array,
    required: true,
  },
  totalErp: {
    type: Number,
    required: true,
  },
  theme: {
    validator(value) {
      return ['ask', 'bid'].includes(value)
    },
  },
});

const price = computed(() => props.entry[0]);
const priceDisplay = computed(() => {
  return Number(price.value).toFixed(2);
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
  const percentage = props.totalErp * 100;
  switch (props.theme) {
    case 'ask':
      return `linear-gradient(90deg, #F4433620 ${percentage}%, transparent ${percentage}%)`;
    case 'bid':
      return `linear-gradient(90deg, transparent ${100 - percentage}%, #4CAF5020 ${100 - percentage}%)`;
  }
}

</script>
