/* ============ Cart Manager ============ */

const Cart = {
  items: [],
  STORAGE_KEY: "bc_beauty_cart",

  load() {
    this.items = Storage.get(this.STORAGE_KEY, []);
    return this.items;
  },

  save() {
    Storage.set(this.STORAGE_KEY, this.items);
  },

  add(productId, quantity = 1) {
    const product = Products.getById(productId);
    if (!product) return false;

    const qty = Math.max(1, Math.floor(Number(quantity)) || 1);
    const existing = this.items.find(i => i.productId === productId);

    if (existing) {
      existing.quantity += qty;
    } else {
      this.items.push({ productId, quantity: qty });
    }

    this.save();
    return true;
  },

  remove(productId) {
    this.items = this.items.filter(i => i.productId !== productId);
    this.save();
  },

  updateQuantity(productId, quantity) {
    const qty = Math.max(0, Math.floor(Number(quantity)) || 0);
    const item = this.items.find(i => i.productId === productId);

    if (!item) return false;

    if (qty <= 0) {
      this.remove(productId);
      return true;
    }

    item.quantity = qty;
    this.save();
    return true;
  },

  increment(productId) {
    const item = this.items.find(i => i.productId === productId);
    if (item) this.updateQuantity(productId, item.quantity + 1);
  },

  decrement(productId) {
    const item = this.items.find(i => i.productId === productId);
    if (item) this.updateQuantity(productId, item.quantity - 1);
  },

  clear() {
    this.items = [];
    this.save();
  },

  getDetails() {
    return this.items
      .map(i => {
        const product = Products.getById(i.productId);
        return product ? { ...i, product } : null;
      })
      .filter(Boolean);
  },

  getTotal() {
    return this.getDetails().reduce((sum, item) => {
      const price = item.product.salePrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);
  },

  getCount() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  },

  isEmpty() {
    return this.items.length === 0;
  },

  formatMessage() {
    const details = this.getDetails();
    if (details.length === 0) return "";

    let message = `Olá! Gostaria de fazer um pedido na *B&C BEAUTY*:\n\n`;

    details.forEach(item => {
      message += `• ${item.product.name} — Qtd: ${item.quantity}x — R$ ${Products.formatPrice((item.product.salePrice || item.product.price) * item.quantity)}\n`;
    });

    message += `\n*Total: ${Products.formatPrice(this.getTotal())}*`;

    const profile = Profile.getProfile();
    if (profile?.name) {
      message += `\n\n*Cliente:* ${profile.name}`;
      if (profile.phone) message += `\n*Telefone:* ${profile.phone}`;
    }

    return message;
  }
};
