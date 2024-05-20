<template>
  <tr>
    <td>{{ priceDisplay }} | {{ totalErp }}</td>
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
});

const price = computed(() => props.entry[0]);
const priceDisplay = computed(() => {
  return Number(price.value).toFixed(2);
})

const quantity = computed(() => props.entry[1]);
const quantityDisplay = computed(() => {
  return Number(quantity.value).toFixed(5);
})

const total = computed(() => (price.value * quantity.value));
const totalDisplay = computed(() => {
  return Number(total.value).toFixed(5);
})

</script>
