<template>
  <div class="pt-8">
    <h1
        class="mb-4"
    >Настройки</h1>

    <div>
      <h2 class="mb-4">
        Валютная пара
      </h2>
      <v-row>
        <v-col cols="12" md="4">
          <v-select
              :model-value="orderBookStore.selectedSymbolInfo"
              :items="symbolOptions"
              variant="solo-filled"
              :loading="orderBookStore.isBusyChangingSymbol"
              :disabled="orderBookStore.isBusyChangingSymbol"
              @update:modelValue="onSymbolChange"
          ></v-select>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>

import {useOrderBookStore} from "~/stores/order-book.js";

const orderBookStore = useOrderBookStore();

const symbolOptions = orderBookStore.symbolOptions;

function onSymbolChange(newSymbol) {
  orderBookStore.updateSymbol(newSymbol);
}

</script>
