<template>
  <NuxtLayout>
    <v-app>
      <v-toolbar>
        <v-container class="d-flex align-center">
          <nuxt-link
              to="/"
          >
            <v-img
                :width="128"
                src="/img/logo.svg"
            />
          </nuxt-link>
          <v-spacer/>
          <v-btn
              to="/settings"
          >Настройки
          </v-btn>
          <v-btn
              to="/order-book"
          >Order Book
          </v-btn>
          <v-spacer/>
        </v-container>
      </v-toolbar>
      <v-main>
        <v-container>
          <NuxtPage/>
        </v-container>
      </v-main>
    </v-app>
  </NuxtLayout>
</template>

<script setup>

const orderBookStore = useOrderBookStore();

onMounted(() => {
  if (isClientSide()) {
    setTimeout(() => {
      orderBookStore.connect();
    });
  }
});

onUnmounted(() => {
  if (isClientSide()) {
    setTimeout(() => {
      orderBookStore.disconnect();
    });
  }
});

</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.15s;
}

.page-enter-from {
  opacity: 0;
  transform: translate(16px, 0);
}

.page-leave-to {
  opacity: 0;
  transform: translate(-16px, 0);
}
</style>
