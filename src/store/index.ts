import { reactive, toRefs } from 'vue';
import { Product } from '../types/Product';

const STORAGE_KEY = 'product-list';

function getInitialProducts(): Product[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

const state = reactive({
  products: getInitialProducts()
});

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.products));
}

export function useStore() {
  function addProduct(product: Omit<Product, 'id'>) {
    const newProduct: Product = { ...product, id: Date.now() };
    state.products.push(newProduct);
    saveProducts();
  }

  function removeProduct(productId: number) {
    const index = state.products.findIndex((p) => p.id === productId);
    if (index !== -1) {
      state.products.splice(index, 1);
      saveProducts();
    }
  }

  function updateProduct(updatedProduct: Product) {
    const index = state.products.findIndex((p) => p.id === updatedProduct.id);
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct); 
      saveProducts();
    }
  }

  function sortProducts() {
    state.products.sort((a, b) => a.name.localeCompare(b.name));
    saveProducts();
  }

  return {
    ...toRefs(state),
    addProduct,
    removeProduct,
    updateProduct,
    sortProducts
  };
}
