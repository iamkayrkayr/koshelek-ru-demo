<template>
  <div>
    <h3 class="mb-4">
      История изменений валютной пары
    </h3>

    <ClientOnly>
      <h5 class="mb-3">Часовой пояс: {{ displayTz }}</h5>

      <v-data-iterator
          :items="items"
          :page="pagination.page"
          :items-per-page="itemsPerPage"
      >
        <template v-slot:default="{ items: slice }">
          <v-table density="compact">
            <tbody>
            <tr
                v-for="{ raw: item } in slice"
                :key="item.id"
            >
              <td>{{ displayDatetime(item.at) }}</td>
              <td>{{ item.from }} -> {{ item.to }}</td>
            </tr>
            </tbody>
          </v-table>
        </template>

        <template v-slot:footer="{ pageCount }">
          <v-pagination v-model="pagination.page" :length="pageCount"/>
        </template>
      </v-data-iterator>

      <div
          class="mt-4 d-flex flex-row"
      >
        <v-btn
            :disabled="items.length < 1"
            class="ml-auto"
            @click="$emit('clear')"
        >
          Clear
        </v-btn>
      </div>

      <template #fallback>
        <span class="text-grey-darken-1">Загрузка ...</span>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup>

defineProps({
  items: {
    type: Array,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
});

function displayDatetime(ts) {
  return (new Date(ts)).toLocaleString();
}

const displayTz = computed(() => {
  return new Date().toLocaleDateString(undefined, {day: '2-digit', timeZoneName: 'long'}).substring(4);
});

const pagination = ref({
  page: 1,
});

</script>
