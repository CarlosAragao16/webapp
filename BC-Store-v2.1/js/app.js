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
  UI.renderTestimonials(DEMO_TESTIMONIALS);
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
      const product = UI.openModal(productId);
      if (product) {
        AppState.currentProductId = productId;
        AppState.currentQty = 1;
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
  const modal = document.getElementById("productModal");
  const qtyValue = document.getElementById("qtyValue");
  const addBtn = document.getElementById("addToCartBtn");

  // Botão de fechar
  modal.querySelector(".modal-close")?.addEventListener("click", () => {
    UI.closeModal();
  });

  // Clique no overlay
  modal.addEventListener("click", (e) => {
    if (e.target === modal) UI.closeModal();
  });

  // Quantidade
  document.getElementById("qtyMinus").addEventListener("click", () => {
    AppState.currentQty = Math.max(1, AppState.currentQty - 1);
    qtyValue.textContent = AppState.currentQty;
  });

  document.getElementById("qtyPlus").addEventListener("click", () => {
    if (product.stock > 0) {
      AppState.currentQty = Math.min(product.stock, AppState.currentQty + 1);
      qtyValue.textContent = AppState.currentQty;
    }
  });

  // Adicionar ao carrinho
  addBtn.addEventListener("click", () => {
    if (product.stock > 0) {
      Cart.add(AppState.currentProductId, AppState.currentQty);
      UI.updateCartCount();
      UI.showToast(`✓ ${AppState.currentQty}x ${product.name} adicionado!`);
      UI.closeModal();
    }
  });

  // Tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      UI.closeModal();
    }
  });
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

// ============ Utilidades ============

window.addEventListener("keydown", (e) => {
  // Fechar modal com ESC
  if (e.key === "Escape") {
    const modal = document.getElementById("productModal");
    if (modal.classList.contains("open")) UI.closeModal();

    const cart = document.getElementById("cartOverlay");
    if (cart.classList.contains("open")) UI.closeCart();
  }
});
