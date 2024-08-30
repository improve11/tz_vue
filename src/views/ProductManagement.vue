<template>
    <div>
      <h1>Product Management</h1>
      <ProductList />
    </div>
  </template>

  <script lang="ts">
  import { defineComponent } from 'vue';
  import ProductList from '../components/ProductList.vue';

  export default defineComponent({
    name: 'ProductManagement',
    components: {
      ProductList,
    },
  });
  </script>