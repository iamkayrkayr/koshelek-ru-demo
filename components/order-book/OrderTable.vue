<template>
  <v-table
      density="compact"
  >
    <thead>
    <tr>
      <th>
        Price
      </th>
      <th class="text-end">
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
        :total-erp="totalErp(row)"
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

const minTotal = computed(() => {
  return Math.min(...(props.rows.map(rowTotal)));
});
const maxTotal = computed(() => {
  return Math.max(...(props.rows.map(rowTotal)));
});

function totalErp(row) {
  const range = (maxTotal.value - minTotal.value);
  if (range === 0) {
    return 0;
  }
  return (rowTotal(row) - minTotal.value) / range;
}

function rowTotal(row) {
  return row[0] * row[1];
}

</script>
