<template>
    <div>
      <h3>{{ product.name }}</h3>
      <p>Seller: {{ product.seller }}</p>
      <p>Integration: {{ product.integration }}</p>
      <button @click="editProduct">Edit</button>
      <button @click="deleteProduct">Delete</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export default defineComponent({
    name: 'ProductItem',
    props: {
      product: {
        type: Object as PropType<{ id: number, name: string, seller: string, integration: string }>,
        required: true,
      },
    },
    emits: ['delete-product', 'edit-product'],
    setup(props, { emit }) {
      const deleteProduct = () => emit('delete-product', props.product.id);
      const editProduct = () => emit('edit-product', props.product);
  
      return { deleteProduct, editProduct };
    },
  });
  </script>
  