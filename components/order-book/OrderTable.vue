<template>
  <v-table
      density="compact"
  >
    <thead>
    <tr>
      <th class="w-25">
        Price
      </th>
      <th class="w-25 text-end">
        Quantity
      </th>
      <th class="text-end">
        Total
      </th>
    </tr>
    </thead>
    <tbody>
    <OrderTableRow
        v-for="row in rows"
        :key="row[0]"
        :entry="row"
        :quantity-erp="quantityErp(row)"
        :theme="theme"
    />
    </tbody>
  </v-table>
</template>

<script setup>

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  theme: {
    validator(value) {
      return ['ask', 'bid'].includes(value)
    },
  },
});

const minQuantity = computed(() => {
  return Math.min(...(props.rows.map(rowQuantity)));
});
const maxQuantity = computed(() => {
  return Math.max(...(props.rows.map(rowQuantity)));
});

function quantityErp(row) {
  const range = (maxQuantity.value - minQuantity.value);
  if (range === 0) {
    return 0;
  }
  return (rowQuantity(row) - minQuantity.value) / range;
}

function rowTotal(row) {
  return row[0] * row[1];
}

function rowQuantity(row) {
  return row[1];
}

</script>
