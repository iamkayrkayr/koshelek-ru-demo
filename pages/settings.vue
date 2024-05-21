<template>
  <div class="pt-8">
    <h1
        class="mb-4 text-h5 text-sm-h4"
    >Настройки</h1>

    <v-row>
      <v-col
          cols="12"
          md="6"
      >
        <h2 class="mb-4 text-h6 text-sm-h5">
          Валютная пара
        </h2>

        <v-row>
          <v-col cols="12" md="8">
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
      </v-col>

      <v-col
          cols="12"
          md="6"
      >
        <SymbolChangeLogTable
            :items="orderBookStore.symbolChangeLog.items"
            :items-per-page="orderBookStore.symbolChangeLog.perPage"
            @clear="() => orderBookStore.clearSymbolChangeLog()"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>

import {useOrderBookStore} from "~/stores/order-book.js";
import SymbolChangeLogTable from "~/components/settings/SymbolChangeLogTable.vue";

const orderBookStore = useOrderBookStore();

const symbolOptions = orderBookStore.symbolOptions;

function onSymbolChange(newSymbol) {
  orderBookStore.updateSymbol(newSymbol);
}

</script>
