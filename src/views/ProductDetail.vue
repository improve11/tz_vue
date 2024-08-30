<template>
    <div>
      <h1>Product Detail</h1>
      <p v-if="!product">Loading...</p>
      <div v-else>
        <h2>{{ product.name }}</h2>
        <p>Seller: {{ product.seller }}</p>
        <p>Integration: {{ product.integration }}</p>
      </div>
    </div>
  </template>

  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';

  export default defineComponent({
    name: 'ProductDetail',
    setup() {
      const route = useRoute();
      const product = ref<{ id: number; name: string; seller: string; integration: string } | null>(null);

      onMounted(() => {
        const productId = route.params.id as string;
        
        const products = [
          { id: 1, name: 'Product 1', seller: 'Seller 1', integration: 'reels' },

        ];
        product.value = products.find((p) => p.id === +productId) || null;
      });

      return { product };
    },
  });
  </script>