/* ============ Products Manager ============ */

const Products = {
  list: [],

  async load() {
    try {
      const response = await fetch("produtos.json");
      if (!response.ok) throw new Error("Falha ao carregar produtos");
      this.list = await response.json();
      return this.list;
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      return [];
    }
  },

  getById(id) {
    return this.list.find(p => p.id === Number(id)) || null;
  },

  getCategories() {
    const categories = new Set(this.list.map(p => p.category));
    return Array.from(categories).sort();
  },

  search({ query = "", category = "todos", sort = "relevancia" } = {}) {
    let results = [...this.list];

    // Filtrar por categoria
    if (category !== "todos") {
      results = results.filter(p => p.category === category);
    }

    // Filtrar por busca
    if (query && query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Ordenar
    switch (sort) {
      case "menor-preco":
        results.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceA - priceB;
        });
        break;
      case "maior-preco":
        results.sort((a, b) => {
          const priceA = a.salePrice || a.price;
          const priceB = b.salePrice || b.price;
          return priceB - priceA;
        });
        break;
      case "melhor-avaliacao":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "alfabetica":
        results.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
        break;
      default:
        // relevancia: mantém a ordem original
        break;
    }

    return results;
  },

  formatPrice(price) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: STORE_CONFIG.currency
    }).format(price);
  },

  formatStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    let stars = "★".repeat(full);
    if (half) stars += "½";
    stars += "☆".repeat(5 - Math.ceil(rating));
    return stars;
  }
};