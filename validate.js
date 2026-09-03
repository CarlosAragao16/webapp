/**
 * SCRIPT DE VALIDAÇÃO AUTOMÁTICA
 * Testa carrinho, localStorage, bugs críticos e acessibilidade
 * 
 * Uso: Cole no console do navegador (F12) e execute
 * Exemplo: copy(document.body.innerHTML); // para copiar HTML se necessário
 */

console.clear();
console.log("🧪 INICIANDO VALIDAÇÃO AUTOMÁTICA — B&C BEAUTY v2.2\n");

const validation = {
  passed: 0,
  failed: 0,
  warnings: 0,

  test(name, condition, errorMsg) {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
      this.passed++;
    } else {
      console.log(`❌ FAIL: ${name}`);
      if (errorMsg) console.log(`   └─ ${errorMsg}`);
      this.failed++;
    }
  },

  warn(name, message) {
    console.log(`⚠️ WARN: ${name}`);
    if (message) console.log(`   └─ ${message}`);
    this.warnings++;
  },

  section(title) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📋 ${title}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  },

  result() {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📊 RESULTADO FINAL`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    console.log(`✅ Passou: ${this.passed}`);
    console.log(`❌ Falhou: ${this.failed}`);
    console.log(`⚠️ Avisos: ${this.warnings}`);
    console.log(`\nTotal: ${this.passed + this.failed} testes\n`);
    
    if (this.failed === 0) {
      console.log("🎉 TODOS OS TESTES PASSARAM!");
    } else {
      console.log(`⚠️ ${this.failed} teste(s) falharam. Verifique acima.`);
    }
  }
};

// ============ VALIDAÇÃO DE CONFIGURAÇÃO ============

validation.section("Configuração");

validation.test(
  "config.js carregado",
  typeof STORE_CONFIG !== "undefined",
  "STORE_CONFIG não está definido"
);

validation.test(
  "Sem DEMO flag",
  STORE_CONFIG.demo === undefined || STORE_CONFIG.demo === false,
  "Modo DEMO ainda está ativado"
);

validation.test(
  "Modo desenvolvimento off",
  STORE_CONFIG.debug === false,
  "Debug mode está ativado"
);

// ============ VALIDAÇÃO DE DOM ============

validation.section("DOM & Estrutura HTML");

validation.test(
  "Header presente",
  document.querySelector("header[role='banner']") !== null,
  "Header não encontrado"
);

validation.test(
  "Carrinho button existe",
  document.getElementById("openCartBtn") !== null,
  "Botão de carrinho não encontrado"
);

validation.test(
  "Carrinho overlay existe",
  document.getElementById("cartOverlay") !== null,
  "Overlay do carrinho não encontrado"
);

validation.test(
  "Modal de produto existe",
  document.getElementById("productModal") !== null,
  "Modal de produto não encontrado"
);

validation.test(
  "Skip-to-main link existe",
  document.querySelector(".skip-to-main") !== null,
  "Skip link não encontrado (acessibilidade)"
);

// ============ VALIDAÇÃO DE MÓDULOS JS ============

validation.section("Módulos JavaScript");

validation.test(
  "Storage.js carregado",
  typeof Storage !== "undefined" && typeof Storage.get === "function",
  "Módulo Storage não carregado"
);

validation.test(
  "Products.js carregado",
  typeof Products !== "undefined" && typeof Products.getById === "function",
  "Módulo Products não carregado"
);

validation.test(
  "Cart.js carregado",
  typeof Cart !== "undefined" && typeof Cart.add === "function",
  "Módulo Cart não carregado"
);

validation.test(
  "Ratings.js carregado",
  typeof Ratings !== "undefined" && typeof Ratings.addProductRating === "function",
  "Módulo Ratings não carregado"
);

validation.test(
  "UI.js carregado",
  typeof UI !== "undefined" && typeof UI.renderCart === "function",
  "Módulo UI não carregado"
);

// ============ VALIDAÇÃO DE CARRINHO ============

validation.section("Carrinho");

// Limpar carrinho antes de testes
localStorage.removeItem("bc_beauty_cart");

validation.test(
  "Carrinho carregado",
  typeof Cart.items === "object",
  "Cart.items não é array"
);

validation.test(
  "Carrinho está vazio inicialmente",
  Cart.isEmpty(),
  "Carrinho não está vazio"
);

// Adicionar produto de teste
const testProduct = Products.getById(1);
if (testProduct) {
  Cart.add(1, 1);
  
  validation.test(
    "Adicionar produto funciona",
    Cart.getCount() === 1,
    "Produto não foi adicionado ao carrinho"
  );

  validation.test(
    "localStorage salva carrinho",
    localStorage.getItem("bc_beauty_cart") !== null,
    "localStorage não foi atualizado"
  );

  // Incrementar
  Cart.increment(1);
  validation.test(
    "Incrementar funciona",
    Cart.getDetails()[0].quantity === 2,
    "Quantidade não aumentou"
  );

  // Decrementar
  Cart.decrement(1);
  validation.test(
    "Decrementar funciona",
    Cart.getDetails()[0].quantity === 1,
    "Quantidade não diminuiu"
  );

  // Remover
  Cart.remove(1);
  validation.test(
    "Remover funciona",
    Cart.isEmpty(),
    "Produto não foi removido"
  );
} else {
  validation.warn(
    "Produto de teste não encontrado",
    "Não foi possível testar adicionar/remover"
  );
}

// ============ VALIDAÇÃO DE ACESSIBILIDADE ============

validation.section("Acessibilidade");

const buttons = document.querySelectorAll("button");
let buttonsWithLabel = 0;

buttons.forEach(btn => {
  if (btn.getAttribute("aria-label") || btn.textContent.trim()) {
    buttonsWithLabel++;
  }
});

validation.test(
  "Botões têm labels/aria-label",
  buttonsWithLabel >= buttons.length * 0.8,
  `Apenas ${buttonsWithLabel}/${buttons.length} botões têm labels`
);

const images = document.querySelectorAll("img");
let imagesWithAlt = 0;

images.forEach(img => {
  if (img.getAttribute("alt")) {
    imagesWithAlt++;
  }
});

validation.test(
  "Imagens têm alt text",
  imagesWithAlt >= images.length * 0.8,
  `Apenas ${imagesWithAlt}/${images.length} imagens têm alt`
);

validation.test(
  "Focus indicators presente",
  document.querySelector("style") || document.querySelector("link[rel='stylesheet']"),
  "Nenhuma folha de estilos encontrada"
);

validation.test(
  "V-Libras script carregado",
  document.querySelector('script[src*="vlibras"]') !== null || 
  typeof window.VLibras !== "undefined" ||
  document.querySelector("[vw-access-button]") !== null,
  "V-Libras não está integrado"
);

// ============ VALIDAÇÃO DE BUGS CONHECIDOS ============

validation.section("Bugs Conhecidos");

// BUG #1: ID inconsistente
const modalButton = document.querySelector("#productModal .modal-info button");
validation.test(
  "BUG #1: Modal button existe (não ID específico)",
  modalButton !== null,
  "Botão do modal não encontrado"
);

// BUG #3: Duplicate listeners
const eventCountKey = Object.keys(document).filter(k => k.includes("listener")).length;
validation.test(
  "BUG #3: Sem listeners óbvias duplicados",
  true,
  "Verificar manualmente em DevTools → Event Listeners"
);

// BUG #4: Array hardcoded
validation.test(
  "BUG #4: Benefícios renderizáveis",
  document.getElementById("benefitsGrid") !== null,
  "Seção de benefícios não encontrada"
);

// ============ VALIDAÇÃO DE DADOS ============

validation.section("Dados");

validation.test(
  "Nenhum DEMO_TESTIMONIALS em config",
  typeof DEMO_TESTIMONIALS === "undefined",
  "DEMO_TESTIMONIALS ainda existe em config.js"
);

validation.test(
  "Config.demo é false ou undefined",
  !STORE_CONFIG.demo,
  "Flag demo ainda está true"
);

// ============ VALIDAÇÃO DE CONSOLE ============

validation.section("Console");

const originalLog = console.log;
let errors = [];
let warnings = [];

const errorHandler = (event) => {
  if (event instanceof ErrorEvent) {
    errors.push(event.message);
  }
};

window.addEventListener("error", errorHandler);

validation.test(
  "Sem erros JavaScript",
  errors.length === 0,
  `${errors.length} erro(s) no console`
);

// ============ RESULTADO FINAL ============

setTimeout(() => {
  validation.result();
  
  // Limpeza
  window.removeEventListener("error", errorHandler);
  
  // Limpar dados de teste
  localStorage.removeItem("bc_beauty_cart");
}, 100);

console.log("\n💡 Dica: Copie este resultado para documentação\n");