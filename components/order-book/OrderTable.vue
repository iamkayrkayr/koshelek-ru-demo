<template>
  <v-table
      v-resize="onScreenResize"
      density="compact"
      fixed-header
      ref="tableEl"
      :height="tableHeight"
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
        v-for="(row, index) in rows"
        :key="`${row[0]}-${row[1]}-${index}`"
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

const tableEl = ref(null);
const tableHeight = ref(100);

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

function onScreenResize(...args) {
  const appLayoutHeight = window.document.body.scrollHeight;
  const viewportHeight = window.innerHeight;

  const tableWrapBoundRect = tableEl.value.$el.getBoundingClientRect();
  const mainElBoundRec = tableEl.value.$el.closest('#main').getBoundingClientRect();

  const mainSectionHeight = mainElBoundRec.height;
  const tableOffsetFromTheTopOfMain = (tableWrapBoundRect.y - mainElBoundRec.y);
  const safetyThreshold = 16;
  const scrollDecrement = Math.max(0, appLayoutHeight - viewportHeight);

  const calculatedHeight = mainSectionHeight - tableOffsetFromTheTopOfMain - safetyThreshold - scrollDecrement;
  if (calculatedHeight < 192) {
    // too little of a height: use full page scroll
    tableHeight.value = undefined;
  } else {
    tableHeight.value = calculatedHeight;
  }

}

</script>
