<template>
  <div class="product-list">
    <h1 class="title">Product List</h1>
    
    <div class="filter-section">
      <label for="filter" class="filter-label">Filter by Integration Method:</label>
      <select v-model="filter" id="filter" class="filter-select">
        <option value="">All</option>
        <option value="reels">Reels</option>
        <option value="stories">Stories</option>
      </select>
    </div>

    <button @click="sortProducts" class="sort-button">Sort Alphabetically</button>

    <div class="product-items">
      <div v-for="product in filteredProducts" :key="product.id" class="product-item">
        <span class="product-info" @click="selectProductForEditing(product)">
          {{ product.name }} - {{ product.seller }} - {{ product.integration }}
        </span>
        <button class="edit-button" @click="selectProductForEditing(product)">Edit</button>
        <button class="delete-button" @click="removeProduct(product.id)">Delete</button>
      </div>
    </div>

    <div class="pagination">
      <button v-if="page > 1" @click="previousPage" class="pagination-button">Previous</button>
      <button v-if="page < totalPages" @click="nextPage" class="pagination-button">Next</button>
    </div>

    <div class="add-edit-section">
      <h2>{{ selectedProduct ? 'Edit' : 'Add' }} Product</h2>
      <form @submit.prevent="submitForm">
        <input v-model="newProduct.name" placeholder="Product Name" required />
        <input v-model="newProduct.seller" placeholder="Seller" required />
        <select v-model="newProduct.integration" required>
          <option value="" disabled>Select Integration Method</option>
          <option value="reels">Reels</option>
          <option value="stories">Stories</option>
        </select>
        <button type="submit" class="add-edit-button">
          {{ selectedProduct ? 'Update' : 'Add' }} Product
        </button>
        <button v-if="selectedProduct" @click="cancelEdit" type="button" class="cancel-button">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, ComputedRef } from 'vue';
import { useStore } from '../store';
import { Product } from '../types/Product';

export default defineComponent({
  setup() {
    const store = useStore();
    const filter = ref<string>('');
    const page = ref<number>(1);
    const itemsPerPage = 20;
    const selectedProduct = ref<Product | null>(null);

    const newProduct = ref<Product>({ id: 0, name: '', seller: '', integration: '' });

    const filteredProducts: ComputedRef<Product[]> = computed(() => {
      let products = store.products.value;
      if (filter.value) {
        products = products.filter((product: Product) => product.integration === filter.value);
      }
      const start = (page.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return products.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(store.products.value.length / itemsPerPage);
    });

    function submitForm() {
      if (selectedProduct.value) {
        updateProduct(newProduct.value);
      } else {
        addProduct(newProduct.value);
      }
    }

    function addProduct(product: Product) {
      store.addProduct({ ...product }); 
      clearForm();
    }

    function removeProduct(productId: number) {
      store.removeProduct(productId);
    }

    function selectProductForEditing(product: Product) {
      selectedProduct.value = { ...product };

      newProduct.value = { ...product };
    }

    function updateProduct(updatedProduct: Product) {
      if (selectedProduct.value) {
        store.updateProduct({ ...updatedProduct, id: selectedProduct.value.id });
        selectedProduct.value = null;
        clearForm();
      }
    }

    function cancelEdit() {
      selectedProduct.value = null;
      clearForm();
    }

    function sortProducts() {
      store.sortProducts();
    }

    function nextPage() {
      if (page.value < totalPages.value) {
        page.value += 1;
      }
    }

    function previousPage() {
      if (page.value > 1) {
        page.value -= 1;
      }
    }

    function clearForm() {
      newProduct.value = { id: 0, name: '', seller: '', integration: '' };
    }

    return {
      filter,
      filteredProducts,
      page,
      totalPages,
      selectedProduct,
      newProduct,
      submitForm,
      removeProduct,
      selectProductForEditing,
      cancelEdit,
      sortProducts,
      nextPage,
      previousPage
    };
  }
});
</script>

<style scoped>
.product-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.title {
  text-align: center;
  color: #333;
}

.filter-section {
  margin-bottom: 20px;
  text-align: center;
}

.filter-label {
  margin-right: 10px;
}

.filter-select {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.sort-button {
  display: block;
  margin: 10px auto;
  padding: 10px 20px;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sort-button:hover {
  background-color: #0056b3;
}

.product-items {
  margin-top: 20px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  transition: background-color 0.3s;
}

.product-item:hover {
  background-color: #e9e9e9;
}

.product-info {
  flex-grow: 1;
  cursor: pointer;
  color: #007BFF;
  transition: color 0.3s;
}

.product-info:hover {
  color: #0056b3;
}

.edit-button, .delete-button {
  padding: 5px 10px;
  border: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button {
  background-color: #FFC107;
  margin-right: 10px;
}

.edit-button:hover {
  background-color: #e0a800;
}

.delete-button {
  background-color: #DC3545;
}

.delete-button:hover {
  background-color: #c82333;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

.pagination-button {
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  background-color: #28A745;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-button:hover {
  background-color: #218838;
}

.add-edit-section {
  margin-top: 40px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.add-edit-section h2 {
  text-align: center;
  color: #333;
}

.add-edit-section form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.add-edit-section input,
.add-edit-section select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.add-edit-button {
  background-color: #28A745;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-edit-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #FFC107;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #d39e00;
}
</style>
