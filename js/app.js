/* ============ App Initialization ============ */

const AppState = {
  currentProductId: null,
  currentQty: 1,
  searchQuery: "",
  selectedCategory: "todos",
  selectedSort: "relevancia"
};

// ============ Inicialização ============

document.addEventListener("DOMContentLoaded", async () => {
  // Configurações iniciais
  document.getElementById("year").textContent = new Date().getFullYear();

  // Carregar produtos
  await Products.load();

  // Carregar dados salvos
  Cart.load();
  const savedProfile = Profile.getProfile();

  // Renderizar interface inicial
  updateProductsDisplay();
  UI.renderBenefits();
  // Não renderizar testimoniais fictícias - apenas carregar avaliações reais
  UI.renderStoreRatings();
  UI.renderStoreRatingForm();
  UI.renderSocialLinks();
  UI.renderFooterContact();
  UI.updateCartCount();

  // Atualizar nome do perfil no header
  updateProfileUI(savedProfile);

  // Inicializar navegação
  setupNavigation();
  setupProductsSection();
  setupCartSection();
  setupProfileSection();
  setupOtherFeatures();
});

// ============ Navegação ============

function setupNavigation() {
  const hamburger = document.getElementById("hamburgerBtn");
  const nav = document.getElementById("mainNav");
  const navLinks = nav.querySelectorAll("a");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    nav.classList.toggle("open");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      nav.classList.remove("open");
    });
  });

  // Scroll para fechar navegação
  window.addEventListener("scroll", () => {
    if (nav.classList.contains("open")) {
      hamburger.classList.remove("open");
      nav.classList.remove("open");
    }
  });
}

// ============ Seção de Produtos ============

function setupProductsSection() {
  // Busca
  document.getElementById("searchInput").addEventListener("input", (e) => {
    AppState.searchQuery = e.target.value;
    updateProductsDisplay();
  });

  // Filtro de categoria
  document.getElementById("categoryFilter").addEventListener("change", (e) => {
    AppState.selectedCategory = e.target.value;
    updateProductsDisplay();
  });

  // Ordenação
  document.getElementById("sortFilter").addEventListener("change", (e) => {
    AppState.selectedSort = e.target.value;
    updateProductsDisplay();
  });

  // Clique em produtos (delegação)
  document.getElementById("productsGrid").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const card = btn.closest(".product-card");
    const productId = Number(card?.dataset.id);

    if (btn.dataset.action === "view-product") {
      // Abrir modal ao clicar no card
      const product = UI.openModal(productId);
      if (product) {
        AppState.currentProductId = productId;
        AppState.currentQty = 1;
        // Renderizar avaliações do produto no modal
        if (document.getElementById("productRatings")) {
          UI.renderProductRatings(productId);
        }
        if (document.getElementById("productRatingForm")) {
          UI.renderProductRatingForm(productId);
        }
        setupModalEvents(product);
      }
    } else if (btn.dataset.action === "add-cart") {
      Cart.add(productId, 1);
      UI.updateCartCount();
      UI.showToast("✓ Produto adicionado ao carrinho!");
    }
  });
}

function updateProductsDisplay() {
  const results = Products.search({
    query: AppState.searchQuery,
    category: AppState.selectedCategory,
    sort: AppState.selectedSort
  });

  UI.renderProducts(results);
}

// ============ Modal de Produto ============

function setupModalEvents(product) {
  if (!product) return;

  const modal = document.getElementById("productModal");
  const qtyValue = document.getElementById("qtyValue");
  // BUG FIX #1: ID corrigido (era addToCartBtn, deveria ser id do modal renderizado)
  const addBtn = modal.querySelector(".modal-info button[style*='100%']");

  if (!addBtn) {
    console.error("Botão 'Adicionar ao Carrinho' não encontrado no modal");
    return;
  }

  // Remover listeners antigos para evitar duplicação
  const closeBtn = modal.querySelector(".modal-close");
  if (closeBtn) {
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.replaceWith(newCloseBtn);
    newCloseBtn.addEventListener("click", () => {
      UI.closeModal();
    });
  }

  // Clique no overlay
  modal.addEventListener("click", (e) => {
    if (e.target === modal) UI.closeModal();
  }, { once: true });

  // Quantidade
  const qtyMinus = modal.querySelector("#qtyMinus");
  const qtyPlus = modal.querySelector("#qtyPlus");

  if (qtyMinus) {
    qtyMinus.addEventListener("click", () => {
      AppState.currentQty = Math.max(1, AppState.currentQty - 1);
      qtyValue.textContent = AppState.currentQty;
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener("click", () => {
      if (product.stock > 0) {
        AppState.currentQty = Math.min(product.stock, AppState.currentQty + 1);
        qtyValue.textContent = AppState.currentQty;
      }
    });
  }

  // Adicionar ao carrinho (BUG FIX #3: null check)
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      if (product.stock > 0) {
        Cart.add(AppState.currentProductId, AppState.currentQty);
        UI.updateCartCount();
        UI.showToast(`✓ ${AppState.currentQty}x ${product.name} adicionado!`);
        UI.closeModal();
      } else {
        UI.showToast("❌ Produto indisponível");
      }
    });
  }
}

// ============ Carrinho ============

function setupCartSection() {
  document.getElementById("openCartBtn").addEventListener("click", () => {
    UI.openCart();
  });

  document.getElementById("closeCartBtn").addEventListener("click", () => {
    UI.closeCart();
  });

  document.getElementById("cartOverlay").addEventListener("click", (e) => {
    if (e.target.id === "cartOverlay") UI.closeCart();
  });

  // Delegação de eventos no carrinho
  document.addEventListener("click", (e) => {
    const cartItem = e.target.closest(".cart-item");
    if (!cartItem) {
      // Continuar comprando
      if (e.target.id === "continueShopping") UI.closeCart();
      return;
    }

    const productId = Number(cartItem.dataset.id);
    const action = e.target.dataset.action;

    if (action === "inc") Cart.increment(productId);
    if (action === "dec") Cart.decrement(productId);
    if (action === "remove") Cart.remove(productId);

    UI.renderCart();
    UI.updateCartCount();
  });

  // Botões do footer do carrinho
  document.addEventListener("click", (e) => {
    if (e.target.id === "clearCartBtn") {
      if (confirm("Tem certeza que deseja limpar o carrinho?")) {
        Cart.clear();
        UI.renderCart();
        UI.updateCartCount();
      }
    }

    if (e.target.id === "checkoutBtn") {
      if (Cart.isEmpty()) return;

      if (!STORE_CONFIG.whatsapp) {
        UI.showToast("Número de WhatsApp não configurado");
        return;
      }

      const message = Cart.formatMessage();
      const url = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener");

      // Limpar após finalizar
      Cart.clear();
      UI.renderCart();
      UI.updateCartCount();
      UI.closeCart();
      UI.showToast("Pedido enviado! Aguarde a confirmação no WhatsApp.");
    }
  });
}

// ============ Perfil do Cliente ============

function setupProfileSection() {
  const form = document.getElementById("profileForm");
  const clearBtn = document.getElementById("clearProfileBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("profileName").value,
      email: document.getElementById("profileEmail").value,
      phone: document.getElementById("profilePhone").value
    };

    const result = Profile.saveProfile(data);

    if (!result.ok) {
      UI.showToast("❌ " + result.error);
      return;
    }

    UI.showToast("✓ Perfil salvo com sucesso!");
    updateProfileUI(result.profile);
    form.reset();
  });

  clearBtn.addEventListener("click", () => {
    if (confirm("Deseja realmente remover seu perfil?")) {
      Profile.clearProfile();
      updateProfileUI(null);
      form.reset();
      UI.showToast("Perfil removido");
    }
  });
}

function updateProfileUI(profile) {
  const form = document.getElementById("profileForm");
  const info = document.getElementById("profileInfo");
  const clearBtn = document.getElementById("clearProfileBtn");
  const perfLink = document.getElementById("perfilLink");

  if (profile) {
    form.classList.add("hidden");
    info.classList.remove("hidden");
    clearBtn.classList.remove("hidden");

    document.getElementById("profileDisplay").innerHTML = `
      <strong>${UI.escapeHtml(profile.name)}</strong><br>
      ${UI.escapeHtml(profile.email)}<br>
      ${profile.phone ? UI.escapeHtml(profile.phone) : ""}
    `;

    // Atualizar saudação no header
    const firstName = profile.name.split(" ")[0];
    perfLink.textContent = `Olá, ${firstName}!`;
  } else {
    form.classList.remove("hidden");
    info.classList.add("hidden");
    clearBtn.classList.add("hidden");
    document.getElementById("profileTitle").textContent = "Criar Meu Perfil";
    perfLink.textContent = "Meu Perfil";
  }
}

// ============ Outros Recursos ============

function setupOtherFeatures() {
  // Voltar ao topo
  const backToTop = document.getElementById("backToTopBtn");

  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 400);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Atualizar ano no rodapé
  document.getElementById("year").textContent = new Date().getFullYear();

  // Tagline do rodapé
  document.getElementById("footerTagline").textContent = STORE_CONFIG.description;
}

// ============ AVALIAÇÕES — Star Picker (Produtos) ============

function setupProductStarPicker() {
  const picker = document.getElementById("productStarPicker");
  if (!picker) return;

  const stars = picker.querySelectorAll(".star");
  const valueInput = document.getElementById("ratingValue");

  stars.forEach(star => {
    star.addEventListener("click", () => {
      const rating = Number(star.dataset.rating);
      valueInput.value = rating;
      
      stars.forEach((s, idx) => {
        s.classList.toggle("active", idx < rating);
      });
    });

    star.addEventListener("mouseover", () => {
      const rating = Number(star.dataset.rating);
      stars.forEach((s, idx) => {
        s.style.opacity = idx < rating ? "1" : "0.3";
      });
    });
  });

  picker.addEventListener("mouseleave", () => {
    stars.forEach(s => s.style.opacity = "1");
  });
}

function setupProductRatingForm(productId) {
  const form = document.getElementById("addProductRatingForm");
  if (!form) return;

  const textarea = form.querySelector(".rating-textarea");
  const charCount = form.querySelector(".char-count");

  if (textarea) {
    textarea.addEventListener("input", () => {
      charCount.textContent = `${textarea.value.length}/500 caracteres`;
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#ratingName").value || "Anônimo";
    const rating = Number(form.querySelector("#ratingValue").value);
    const title = form.querySelector("#ratingTitle").value;
    const text = form.querySelector("#ratingText").value;
    const msgEl = form.querySelector("#ratingFormMsg");

    if (rating < 1) {
      msgEl.textContent = "❌ Selecione uma avaliação";
      msgEl.className = "form-message error";
      msgEl.classList.remove("hidden");
      return;
    }

    if (!text.trim()) {
      msgEl.textContent = "❌ Escreva um comentário";
      msgEl.className = "form-message error";
      msgEl.classList.remove("hidden");
      return;
    }

    const result = Ratings.addProductRating(productId, { name, rating, title, text });

    if (!result.ok) {
      msgEl.textContent = "❌ " + result.error;
      msgEl.className = "form-message error";
      msgEl.classList.remove("hidden");
      return;
    }

    msgEl.textContent = "✓ Avaliação enviada com sucesso!";
    msgEl.className = "form-message success";
    msgEl.classList.remove("hidden");

    form.reset();
    document.getElementById("ratingValue").value = "0";
    document.querySelectorAll("#productStarPicker .star").forEach(s => s.classList.remove("active"));
    
    UI.renderProductRatings(productId);
    
    setTimeout(() => msgEl.classList.add("hidden"), 3000);
  });
}

// ============ AVALIAÇÕES — Star Picker (Loja) ============

function setupStoreStarPicker() {
  const picker = document.getElementById("storeStarPicker");
  if (!picker) return;

  const stars = picker.querySelectorAll(".star");
  const valueInput = document.getElementById("storeRatingValue");

  stars.forEach(star => {
    star.addEventListener("click", () => {
      const rating = Number(star.dataset.rating);
      valueInput.value = rating;
      
      stars.forEach((s, idx) => {
        s.classList.toggle("active", idx < rating);
      });
    });

    star.addEventListener("mouseover", () => {
      const rating = Number(star.dataset.rating);
      stars.forEach((s, idx) => {
        s.style.opacity = idx < rating ? "1" : "0.3";
      });
    });
  });

  picker.addEventListener("mouseleave", () => {
    stars.forEach(s => s.style.opacity = "1");
  });
}

function setupStoreRatingForm() {
  const form = document.getElementById("addStoreRatingForm");
  if (!form) return;

  const textarea = form.querySelector(".rating-textarea");
  const charCount = form.querySelector(".char-count");

  if (textarea) {
    textarea.addEventListener("input", () => {
      charCount.textContent = `${textarea.value.length}/500 caracteres`;
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#storeRatingName").value || "Anônimo";
    const rating = Number(form.querySelector("#storeRatingValue").value);
    const text = form.querySelector("#storeRatingText").value;
    const msgEl = form.querySelector("#storeRatingFormMsg");

    if (rating < 1) {
      msgEl.textContent = "❌ Selecione uma avaliação";
      msgEl.className = "form-message error";
      msgEl.classList.remove("hidden");
      return;
    }

    if (!text.trim()) {
      msgEl.textContent = "❌ Escreva um comentário";
      msgEl.className = "form-message error";
      msgEl.classList.remove("hidden");
      return;
    }

    const result = Ratings.addStoreRating({ name, rating, text });

    if (!result.ok) {
      msgEl.textContent = "❌ " + result.error;
      msgEl.className = "form-message error";
      msgEl.classList.remove("hidden");
      return;
    }

    msgEl.textContent = "✓ Avaliação enviada com sucesso!";
    msgEl.className = "form-message success";
    msgEl.classList.remove("hidden");

    form.reset();
    document.getElementById("storeRatingValue").value = "0";
    document.querySelectorAll("#storeStarPicker .star").forEach(s => s.classList.remove("active"));
    
    UI.renderStoreRatings();
    UI.renderStoreRatingForm();
    
    setTimeout(() => msgEl.classList.add("hidden"), 3000);
  });
}

// ============ Utilidades ============

// BUG FIX #4: Remover listener duplicado - já definido em setupModalEvents
// Este listener global foi removido para evitar memory leak