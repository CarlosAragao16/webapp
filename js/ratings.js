/* ============ Ratings & Reviews Manager ============ */

const Ratings = {
  PRODUCTS_KEY: "bc_beauty_product_ratings",
  STORE_KEY: "bc_beauty_store_ratings",

  // Carregar avaliações de um produto
  getProductRatings(productId) {
    const all = Storage.get(this.PRODUCTS_KEY, {});
    return all[productId] || [];
  },

  // Carregar avaliações da loja
  getStoreRatings() {
    return Storage.get(this.STORE_KEY, []);
  },

  // Salvar avaliação de produto
  addProductRating(productId, { name, rating, title, text }) {
    const all = Storage.get(this.PRODUCTS_KEY, {});
    
    if (!all[productId]) {
      all[productId] = [];
    }

    const review = {
      id: Date.now(),
      name: String(name || "Anônimo").trim(),
      rating: Math.min(5, Math.max(1, Math.round(Number(rating) || 1))),
      title: String(title || "").trim(),
      text: String(text || "").trim(),
      date: new Date().toISOString(),
      verified: false // Apenas dados reais, sem verificação automática
    };

    // Validação básica
    if (!review.text) {
      return { ok: false, error: "Escreva um comentário" };
    }

    all[productId].unshift(review);
    Storage.set(this.PRODUCTS_KEY, all);
    return { ok: true, review };
  },

  // Salvar avaliação da loja
  addStoreRating({ name, rating, text }) {
    const reviews = Storage.get(this.STORE_KEY, []);

    const review = {
      id: Date.now(),
      name: String(name || "Anônimo").trim(),
      rating: Math.min(5, Math.max(1, Math.round(Number(rating) || 1))),
      text: String(text || "").trim(),
      date: new Date().toISOString(),
      verified: false
    };

    if (!review.text) {
      return { ok: false, error: "Escreva um comentário" };
    }

    reviews.unshift(review);
    Storage.set(this.STORE_KEY, reviews);
    return { ok: true, review };
  },

  // Calcular média de avaliações de um produto
  getProductRating(productId) {
    const ratings = this.getProductRatings(productId);
    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return { average: sum / ratings.length, count: ratings.length };
  },

  // Calcular média de avaliações da loja
  getStoreRating() {
    const ratings = this.getStoreRatings();
    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return { average: sum / ratings.length, count: ratings.length };
  },

  // Deletar avaliação (apenas local storage)
  deleteProductRating(productId, reviewId) {
    const all = Storage.get(this.PRODUCTS_KEY, {});
    if (all[productId]) {
      all[productId] = all[productId].filter(r => r.id !== reviewId);
      Storage.set(this.PRODUCTS_KEY, all);
      return true;
    }
    return false;
  },

  deleteStoreRating(reviewId) {
    const reviews = Storage.get(this.STORE_KEY, []);
    const filtered = reviews.filter(r => r.id !== reviewId);
    Storage.set(this.STORE_KEY, filtered);
    return true;
  },

  // Formatar stars
  formatStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = "★".repeat(full);
    if (half && full < 5) stars += "½";
    stars += "☆".repeat(5 - Math.ceil(rating));
    return stars;
  }
};