<template>
  <div>
    <h2>{{ isEditing ? 'Edit Product' : 'Add Product' }}</h2>
    <form @submit.prevent="submit">
      <input v-model="name" type="text" placeholder="Product Name" required />
      <input v-model="seller" type="text" placeholder="Seller" required />
      <select v-model="integration" required>
        <option value="reels">Reels</option>
        <option value="stories">Stories</option>
      </select>
      <button type="submit">{{ isEditing ? 'Update' : 'Add' }}</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from 'vue';
import { Product } from '../types/Product';

export default defineComponent({
  props: {
    product: {
      type: Object as () => Product | null,

      default: null
    }
  },
  emits: ['addProduct', 'editProduct'],
  setup(props, { emit }) {
    const name = ref('');
    const seller = ref('');
    const integration = ref('reels');
    const isEditing = ref(false);

    watchEffect(() => {
      if (props.product) {
        name.value = props.product.name;
        seller.value = props.product.seller;
        integration.value = props.product.integration;
        isEditing.value = true;
      } else {
        name.value = '';
        seller.value = '';
        integration.value = 'reels';
        isEditing.value = false;
      }
    });

    function submit() {
      if (isEditing.value && props.product) {
        emit('editProduct', {
          id: props.product.id,
          name: name.value,
          seller: seller.value,
          integration: integration.value
        });
      } else {
        emit('addProduct', { name: name.value, seller: seller.value, integration: integration.value });
      }
      name.value = '';
      seller.value = '';
      integration.value = 'reels';
      isEditing.value = false;
    }

    return { name, seller, integration, isEditing, submit };
  }
});
</script>
