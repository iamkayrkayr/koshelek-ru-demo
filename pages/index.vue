<template>
  <div class="pt-8">
    <div
        class="mb-4 d-md-flex flex-sm-row"
    >
      <h1
          class="mb-2 mb-sm-4 text-h5 text-sm-h4"
      >Биржевой стакан - {{ orderBookStore.selectedSymbolInfo.title }}</h1>

      <v-spacer/>

      <v-select
          v-model="orderBookStore.orderBookDisplayConfig.limit"
          style="max-width: 320px;"
          :items="orderBookStore.orderBookDisplayConfig.limitOptions"
          label="Показывать строк:"
          variant="solo-filled"
          :loading="!isTableReady"
          :disabled="!isTableReady"
      ></v-select>
    </div>

    <v-sheet
        class="d-block d-sm-none"
    >
      <v-slide-group
          v-model="selectedView"
      >
        <v-slide-group-item
            v-slot="{ isSelected }"
            :value="0"
        >
          <v-btn
              :color="isSelected ? 'primary' : undefined"
              class="ma-2 flex-1-0"
              rounded
              @click="selectedView = 0"
          >
            Bid
          </v-btn>
        </v-slide-group-item>
        <v-slide-group-item
            v-slot="{ isSelected }"
            :value="1"
        >
          <v-btn
              :color="isSelected ? 'primary' : undefined"
              class="ma-2 flex-1-0"
              rounded
              @click="selectedView = 1"
          >
            Ask
          </v-btn>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>

    <div
        v-if="!isTableReady"
        class=""
    >
      <v-progress-linear
          indeterminate
      />
    </div>
    <div
        v-else
        class="d-flex flex-row ga-4"
    >
      <div
          v-if="smAndUp || (selectedView === 0)"
          class="flex-1-1-100"
      >
        <h2 class="mb-4 d-none d-sm-block text-h6 text-sm-h5">
          Bid
        </h2>
        <OrderTable
            :rows="orderBookStore.bidsSlice"
            theme="bid"
            :symbol-info="orderBookStore.selectedSymbolInfo"
        />
      </div>
      <div
          v-if="smAndUp || (selectedView === 1)"
          class="flex-1-1-100"
      >
        <h2 class="mb-4 d-none d-sm-block text-h6 text-sm-h5">
          Ask
        </h2>
        <OrderTable
            :rows="orderBookStore.asksSlice"
            theme="ask"
            :symbol-info="orderBookStore.selectedSymbolInfo"
        />
      </div>
    </div>
  </div>
</template>

<script setup>

useHead({
  title: 'Order Book',
});

import {useDisplay} from "vuetify";

const orderBookStore = useOrderBookStore();

const isTableReady = computed(() => {
  return ((selectedView.value !== undefined) && orderBookStore.isWsConnected && (orderBookStore.bids.length > 0));
});

const {
  smAndUp,
} = useDisplay();

const selectedView = ref(undefined);

onMounted(() => {
  // fix: v-model for v-slide-group is not applied initially
  selectedView.value = 0;
});

</script>
