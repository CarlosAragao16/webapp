/* ============ UI Renderer ============ */

const UI = {
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = String(text || "");
    return div.innerHTML;
  },

  renderProducts(products) {
    const grid = document.getElementById("productsGrid");

    if (products.length === 0) {
      grid.innerHTML = `<div class="empty-state">Nenhum produto encontrado</div>`;
      return;
    }

    grid.innerHTML = products
      .map(p => this.renderProductCard(p))
      .join("");
  },

  renderProductCard(product) {
    const priceDisplay = product.salePrice
      ? `<span class="price">${Products.formatPrice(product.salePrice)}</span><span class="original">${Products.formatPrice(product.price)}</span>`
      : `<span class="price">${Products.formatPrice(product.price)}</span>`;

    const badge = product.badge
      ? `<span class="product-badge">${this.escapeHtml(product.badge)}</span>`
      : "";

    const { average } = Ratings.getProductRating(product.id);

    return `
      <div class="product-card" data-id="${product.id}" role="article" aria-label="Produto: ${this.escapeHtml(product.name)}">
        <button class="product-card-link" data-action="view-product" aria-label="Ver detalhes de ${this.escapeHtml(product.name)}" style="width:100%;text-align:left;border:none;background:none;padding:0;cursor:pointer;">
          <div class="product-media">
            ${badge}
            <img src="${this.escapeHtml(product.image)}" alt="${this.escapeHtml(product.name)}" loading="lazy" aria-hidden="false">
          </div>
          <div class="product-body">
            <h3 class="product-name">${this.escapeHtml(product.name)}</h3>
            <div class="product-rating">
              <span class="stars" aria-label="Avaliação: ${average.toFixed(1)} de 5 estrelas">${Products.formatStars(product.rating)}</span>
              <span>(${product.reviews})</span>
            </div>
            <div class="product-price ${product.salePrice ? "sale" : ""}">
              ${priceDisplay}
            </div>
          </div>
        </button>
        <div class="product-actions">
          <button class="btn btn-primary btn-sm" data-action="add-cart" aria-label="Adicionar ${this.escapeHtml(product.name)} ao carrinho">Adicionar</button>
        </div>
      </div>
    `;
  },

  renderCart() {
    const itemsContainer = document.getElementById("cartItems");
    const footerContainer = document.getElementById("cartFooter");
    const cartDetails = Cart.getDetails();

    if (cartDetails.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty">
          Seu carrinho está vazio
          <button class="btn btn-outline btn-sm" id="continueShopping" style="margin-top: 16px;">
            Continuar comprando
          </button>
        </div>
      `;
      footerContainer.innerHTML = "";
      return;
    }

    itemsContainer.innerHTML = cartDetails
      .map(item => this.renderCartItem(item))
      .join("");

    const total = Cart.getTotal();
    footerContainer.innerHTML = `
      <div class="cart-line">
        <span>Subtotal</span>
        <span>${Products.formatPrice(total)}</span>
      </div>
      <div class="cart-total">
        <span>Total</span>
        <span>${Products.formatPrice(total)}</span>
      </div>
      <button class="btn btn-primary" id="checkoutBtn" style="width: 100%; margin-bottom: 8px;">
        Finalizar Compra
      </button>
      <button class="btn btn-outline" id="clearCartBtn" style="width: 100%;">
        Limpar Carrinho
      </button>
    `;
  },

  renderCartItem(item) {
    const price = item.product.salePrice || item.product.price;
    const subtotal = price * item.quantity;

    return `
      <div class="cart-item" data-id="${item.productId}">
        <div class="cart-item-media">
          <img src="${this.escapeHtml(item.product.image)}" alt="${this.escapeHtml(item.product.name)}" loading="lazy">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${this.escapeHtml(item.product.name)}</div>
          <div class="cart-item-price">${Products.formatPrice(price)} un.</div>
          <div class="cart-item-qty">
            <button type="button" data-action="dec" aria-label="Diminuir">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-action="inc" aria-label="Aumentar">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-action="remove">Remover</button>
      </div>
    `;
  },

  renderModal(product) {
    const priceDisplay = product.salePrice
      ? `<span class="price" id="salePrice">${Products.formatPrice(product.salePrice)}</span><span class="sale-price">${Products.formatPrice(product.price)}</span>`
      : `<span class="price">${Products.formatPrice(product.price)}</span>`;

    const stockStatus = product.stock > 0
      ? `<span style="color: var(--color-success); font-size: 0.85rem;">✓ ${product.stock} em estoque</span>`
      : `<span style="color: var(--color-danger); font-size: 0.85rem;">Indisponível</span>`;

    return `
      <button class="btn-icon modal-close" aria-label="Fechar">✕</button>
      <div class="modal-grid">
        <div class="modal-media">
          <img src="${this.escapeHtml(product.image)}" alt="${this.escapeHtml(product.name)}" loading="lazy">
        </div>
        <div class="modal-info">
          <h2 id="modalTitle">${this.escapeHtml(product.name)}</h2>
          <div class="rating-line">
            <span class="stars">${Products.formatStars(product.rating)}</span>
            <span>(${product.reviews} avaliações)</span>
          </div>
          <p>${this.escapeHtml(product.description)}</p>
          <div class="price-section">
            ${priceDisplay}
          </div>
          <div class="qty-selector">
            <button type="button" id="qtyMinus" aria-label="Diminuir">−</button>
            <span class="qty-value" id="qtyValue">1</span>
            <button type="button" id="qtyPlus" aria-label="Aumentar">+</button>
          </div>
          <button class="btn btn-primary" id="addToCartBtn" style="width: 100%;">
            ${product.stock > 0 ? "Adicionar ao Carrinho" : "Indisponível"}
          </button>
          <div id="stockStatus">${stockStatus}</div>
        </div>
      </div>
    `;
  },

  renderTestimonials(testimonials) {
    const grid = document.getElementById("testimonialsGrid");

    if (testimonials.length === 0) {
      grid.innerHTML = `<p style="text-align: center; color: var(--color-text-muted);">Nenhuma avaliação ainda.</p>`;
      return;
    }

    grid.innerHTML = testimonials
      .map(t => `
        <div class="testimonial-card">
          <div class="testimonial-header">
            <span class="testimonial-name">${this.escapeHtml(t.name)}</span>
            <span class="testimonial-rating">${Products.formatStars(t.rating)}</span>
          </div>
          <p class="testimonial-text">"${this.escapeHtml(t.text)}"</p>
          <p class="testimonial-product">Sobre: ${this.escapeHtml(t.product)}</p>
        </div>
      `)
      .join("");
  },

  renderBenefits() {
    const container = document.getElementById("benefitsGrid");
    const benefits = STORE_CONFIG.benefits || [];

    // BUG FIX #2: Suportar benefícios estruturados com ícones
    container.innerHTML = benefits
      .map((benefit) => {
        // Se benefício for objeto com icon e title, use-o
        const isObject = typeof benefit === 'object' && benefit !== null;
        const icon = isObject ? benefit.icon : "✓";
        const title = isObject ? benefit.title : benefit;
        const desc = isObject ? benefit.desc : "";

        return `
          <div class="benefit-card">
            <div class="benefit-icon">${icon}</div>
            <h3>${this.escapeHtml(title)}</h3>
            ${desc ? `<p>${this.escapeHtml(desc)}</p>` : ""}
          </div>
        `;
      })
      .join("");
  },

  renderSocialLinks() {
    const container = document.getElementById("socialLinks");
    const links = [];

    if (STORE_LINKS.whatsapp()) {
      links.push(`<a href="${STORE_LINKS.whatsapp()}" target="_blank" rel="noopener" title="WhatsApp">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371 0-.57 0-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.718.738 5.33 2.139 7.592l-2.262 6.795 6.958-2.23c2.189 1.161 4.644 1.778 7.203 1.778 5.41 0 9.799-4.39 9.799-9.799 0-2.618-.758-5.07-2.187-7.181A9.869 9.869 0 0011.95 6.98"/>
        </svg>
      </a>`);
    }

    if (STORE_LINKS.instagram()) {
      links.push(`<a href="${STORE_LINKS.instagram()}" target="_blank" rel="noopener" title="Instagram">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.203 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm4.846-10.354c0 .795.645 1.44 1.44 1.44s1.44-.645 1.44-1.44-.645-1.44-1.44-1.44-1.44.645-1.44 1.44z"/>
        </svg>
      </a>`);
    }

    if (STORE_LINKS.tiktok()) {
      links.push(`<a href="${STORE_LINKS.tiktok()}" target="_blank" rel="noopener" title="TikTok">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.75 2.89 2.89 0 0 1 2.31-4.64 2.88 2.88 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.08A6.02 6.02 0 0 0 5 20.1a6.02 6.02 0 0 0 5.07 2.82c3.09 0 5.67-2.37 5.76-5.37V10.87a7.07 7.07 0 0 0 4.58 1.55V9.12a4.9 4.9 0 0 1-.49-.04z"/>
        </svg>
      </a>`);
    }

    container.innerHTML = links.join("");
  },

  renderFooterContact() {
    const container = document.getElementById("footerContact");
    const items = [];

    if (STORE_LINKS.whatsapp()) {
      items.push(`<a href="${STORE_LINKS.whatsapp()}" target="_blank" rel="noopener" class="footer-contact-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371 0-.57 0-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.718.738 5.33 2.139 7.592l-2.262 6.795 6.958-2.23c2.189 1.161 4.644 1.778 7.203 1.778 5.41 0 9.799-4.39 9.799-9.799 0-2.618-.758-5.07-2.187-7.181A9.869 9.869 0 0011.95 6.98"/>
        </svg>
        WhatsApp
      </a>`);
    }

    if (STORE_LINKS.email()) {
      items.push(`<a href="${STORE_LINKS.email()}">📧 E-mail</a>`);
    }

    if (STORE_CONFIG.address) {
      items.push(`<span>📍 ${this.escapeHtml(STORE_CONFIG.address)}</span>`);
    }

    // BUG FIX #5: Verificar items.length em vez de items.join("")
    container.innerHTML = items.length > 0 ? items.join("") : "<p>Contato em breve</p>";
  },

  showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  },

  openCart() {
    const overlay = document.getElementById("cartOverlay");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    this.renderCart();
  },

  closeCart() {
    const overlay = document.getElementById("cartOverlay");
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  },

  openModal(productId) {
    const product = Products.getById(productId);
    if (!product) return;

    const modal = document.getElementById("productModal");
    const container = modal.querySelector(".modal");
    container.innerHTML = this.renderModal(product);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    return product;
  },

  closeModal() {
    const modal = document.getElementById("productModal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  },

  updateCartCount() {
    const count = Cart.getCount();
    const badge = document.getElementById("cartCount");
    badge.textContent = count;
    badge.classList.toggle("hidden", count === 0);
  },

  // ============ Renderizar Avaliações de Produto ============
  renderProductRatings(productId) {
    const container = document.getElementById("productRatings");
    if (!container) return;

    const ratings = Ratings.getProductRatings(productId);
    const { average, count } = Ratings.getProductRating(productId);

    let html = `
      <div class="ratings-summary">
        <div class="rating-stats">
          <div class="rating-average">
            <span class="rating-number">${average.toFixed(1)}</span>
            <span class="rating-stars">${Ratings.formatStars(average)}</span>
          </div>
          <span class="rating-count">${count} ${count === 1 ? 'avaliação' : 'avaliações'}</span>
        </div>
      </div>

      <div class="ratings-list">
        ${ratings.length === 0 
          ? '<p class="no-ratings">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>'
          : ratings.map(r => `
              <div class="rating-item" role="article">
                <div class="rating-header">
                  <span class="rating-name">${this.escapeHtml(r.name)}</span>
                  <span class="rating-stars">${Ratings.formatStars(r.rating)}</span>
                </div>
                ${r.title ? `<div class="rating-title">${this.escapeHtml(r.title)}</div>` : ''}
                <p class="rating-text">${this.escapeHtml(r.text)}</p>
                <time class="rating-date" datetime="${r.date}">
                  ${new Date(r.date).toLocaleDateString('pt-BR')}
                </time>
              </div>
            `).join('')
        }
      </div>
    `;

    container.innerHTML = html;
  },

  // ============ Renderizar Formulário de Avaliação de Produto ============
  renderProductRatingForm(productId) {
    const container = document.getElementById("productRatingForm");
    if (!container) return;

    container.innerHTML = `
      <form class="rating-form" id="addProductRatingForm" data-product-id="${productId}">
        <h4>Compartilhe sua experiência</h4>
        
        <div class="form-group">
          <label for="ratingName">Seu nome (opcional)</label>
          <input 
            type="text" 
            id="ratingName" 
            class="rating-input"
            placeholder="Como você gostaria de ser identificado?"
            maxlength="60"
            aria-label="Seu nome"
          >
        </div>

        <div class="form-group">
          <label for="ratingStars">Avaliação</label>
          <div class="star-picker" id="productStarPicker" role="group" aria-label="Avaliação em estrelas">
            <button type="button" class="star" data-rating="1" aria-label="1 estrela">★</button>
            <button type="button" class="star" data-rating="2" aria-label="2 estrelas">★</button>
            <button type="button" class="star" data-rating="3" aria-label="3 estrelas">★</button>
            <button type="button" class="star" data-rating="4" aria-label="4 estrelas">★</button>
            <button type="button" class="star" data-rating="5" aria-label="5 estrelas">★</button>
          </div>
          <input type="hidden" id="ratingValue" value="0" aria-hidden="true">
        </div>

        <div class="form-group">
          <label for="ratingTitle">Título (opcional)</label>
          <input 
            type="text" 
            id="ratingTitle" 
            class="rating-input"
            placeholder="Ex: Excelente qualidade!"
            maxlength="100"
            aria-label="Título da avaliação"
          >
        </div>

        <div class="form-group">
          <label for="ratingText">Seu comentário</label>
          <textarea 
            id="ratingText" 
            class="rating-textarea"
            rows="4"
            placeholder="Compartilhe sua experiência com este produto..."
            maxlength="500"
            required
            aria-label="Sua avaliação"
            aria-required="true"
          ></textarea>
          <small id="charCount" class="char-count">0/500 caracteres</small>
        </div>

        <div id="ratingFormMsg" class="form-message hidden" role="status" aria-live="polite"></div>

        <button type="submit" class="btn btn-primary" style="width: 100%;">
          Enviar Avaliação
        </button>
      </form>
    `;

    // Setup star picker
    setupProductStarPicker();
    setupProductRatingForm(productId);
  },

  // ============ Renderizar Avaliações da Loja ============
  renderStoreRatings() {
    const container = document.getElementById("storeRatingsSection");
    if (!container) return;

    const ratings = Ratings.getStoreRatings();
    const { average, count } = Ratings.getStoreRating();

    container.innerHTML = `
      <div class="store-ratings-wrapper">
        <div class="ratings-summary">
          <div class="rating-stats">
            <h3>Avaliações da Loja</h3>
            <div class="rating-average">
              <span class="rating-number">${average.toFixed(1)}</span>
              <span class="rating-stars">${Ratings.formatStars(average)}</span>
            </div>
            <span class="rating-count">${count} ${count === 1 ? 'avaliação' : 'avaliações'}</span>
          </div>
        </div>

        <div class="ratings-list">
          ${ratings.length === 0 
            ? '<p class="no-ratings">Nenhuma avaliação ainda. Seja o primeiro a avaliar a loja!</p>'
            : ratings.map(r => `
                <div class="rating-item" role="article">
                  <div class="rating-header">
                    <span class="rating-name">${this.escapeHtml(r.name)}</span>
                    <span class="rating-stars">${Ratings.formatStars(r.rating)}</span>
                  </div>
                  <p class="rating-text">${this.escapeHtml(r.text)}</p>
                  <time class="rating-date" datetime="${r.date}">
                    ${new Date(r.date).toLocaleDateString('pt-BR')}
                  </time>
                </div>
              `).join('')
          }
        </div>
      </div>

      <div id="storeRatingForm"></div>
    `;
  },

  // ============ Renderizar Formulário de Avaliação da Loja ============
  renderStoreRatingForm() {
    const container = document.getElementById("storeRatingForm");
    if (!container) return;

    container.innerHTML = `
      <form class="rating-form" id="addStoreRatingForm">
        <h4>Avalie nossa loja</h4>
        
        <div class="form-group">
          <label for="storeRatingName">Seu nome (opcional)</label>
          <input 
            type="text" 
            id="storeRatingName" 
            class="rating-input"
            placeholder="Como você gostaria de ser identificado?"
            maxlength="60"
            aria-label="Seu nome"
          >
        </div>

        <div class="form-group">
          <label for="storeRatingStars">Sua avaliação</label>
          <div class="star-picker" id="storeStarPicker" role="group" aria-label="Avaliação da loja em estrelas">
            <button type="button" class="star" data-rating="1" aria-label="1 estrela">★</button>
            <button type="button" class="star" data-rating="2" aria-label="2 estrelas">★</button>
            <button type="button" class="star" data-rating="3" aria-label="3 estrelas">★</button>
            <button type="button" class="star" data-rating="4" aria-label="4 estrelas">★</button>
            <button type="button" class="star" data-rating="5" aria-label="5 estrelas">★</button>
          </div>
          <input type="hidden" id="storeRatingValue" value="0" aria-hidden="true">
        </div>

        <div class="form-group">
          <label for="storeRatingText">Seu comentário</label>
          <textarea 
            id="storeRatingText" 
            class="rating-textarea"
            rows="4"
            placeholder="Sua opinião sobre a loja, atendimento, entrega, etc..."
            maxlength="500"
            required
            aria-label="Sua avaliação da loja"
            aria-required="true"
          ></textarea>
          <small class="char-count">0/500 caracteres</small>
        </div>

        <div id="storeRatingFormMsg" class="form-message hidden" role="status" aria-live="polite"></div>

        <button type="submit" class="btn btn-primary" style="width: 100%;">
          Enviar Avaliação
        </button>
      </form>
    `;

    setupStoreStarPicker();
    setupStoreRatingForm();
  }
};