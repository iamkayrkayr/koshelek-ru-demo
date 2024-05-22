<template>
  <v-table
      density="compact"
  >
    <thead>
    <tr>
      <th
          v-if="isColumnVisible('price')"
          class="w-25"
      >
        Price
      </th>
      <th
          v-if="isColumnVisible('quantity')"
          class="w-25 text-end"
      >
        Quantity
      </th>
      <th
          v-if="isColumnVisible('total')"
          class="text-end"
      >
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
        :columns="visibleColumns"
    />
    </tbody>
  </v-table>
</template>

<script setup>

import {useDisplay} from "vuetify";

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

const {
  smAndUp,
} = useDisplay();

const visibleColumns = computed(() => {
  return [
    'price',
    smAndUp.value ? 'quantity' : undefined,
    'total',
  ].filter(e => !!e);
});

function isColumnVisible(column) {
  return visibleColumns.value.includes(column);
}

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

function rowQuantity(row) {
  return row[1];
}

</script>
