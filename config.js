/* ======================================================
   B&C BEAUTY — Configuração Central
   ⚙️ Altere aqui todos os dados da loja
   Nenhuma informação fictícia será mostrada se deixada vazia.
   ====================================================== */

const STORE_CONFIG = {
  // === INFORMAÇÕES DA LOJA ===
  name: "B&C BEAUTY",
  tagline: "Beleza, cuidado e bem-estar em um só lugar.",
  description: "Cosméticos premium selecionados com cuidado para você brilhar a cada dia.",
  
  // === CONTATO (preencha com dados REAIS antes de publicar) ===
  whatsapp: "1145661766",      // Formato: 5511987654321 (55 + DDD + número, sem símbolos)
  phone: "",         // Formato: (11) 99999-9999 (opcional)
  email: "bcbeauty@gmail.com",         // exemplo@email.com (opcional)
  address: "Rua Onze de Abril, 2",       // Rua Nome, 123 — Bairro, São Paulo, SP (se houver retirada física)
  
  // === REDES SOCIAIS (deixar vazio se ainda não tiver) ===
  instagram: "bcbeauty.oficial",     // username SEM @
  tiktok: "",        // username SEM @
  
  // === CONFIGURAÇÃO DE LOJA ===
  currency: "BRL",   // Moeda padrão
  currencySymbol: "R$",
  currencyPlacement: "left", // "left" ou "right"
  
  // === BENEFÍCIOS DA LOJA ===
  // Customize com os reais benefícios
  benefits: [
    { icon: "💬", title: "Atendimento Personalizado", desc: "Suporte via WhatsApp para tirar dúvidas" },
    { icon: "✨", title: "Produtos Selecionados", desc: "Escolhidos com cuidado para qualidade" },
    { icon: "🚚", title: "Entrega Rápida", desc: "Enviamos com segurança para você" }
  ],
  
  // === OPEN GRAPH / SEO ===
  siteUrl: "",       // https://seu-dominio.com (preencher quando publicar)
  logoUrl: "",       // https://seu-dominio.com/logo.png (opcional)
  
  // === CONFIGURAÇÕES DE DESENVOLVIMENTO ===
  debug: false,      // true = mostra logs no console
  
  // === POLÍTICA DE ENTREGA (opcional) ===
  deliveryPolicy: "", // "Entrega em São Paulo: 1-3 dias úteis"
  paymentMethods: "", // "Pagamento via Pix, dinheiro ou transferência"
};

// === VALIDAÇÃO AUTOMÁTICA ===
// BUG FIX #6: Validação de configuração
(function validateConfig() {
  // Verificar currency válida
  const validCurrencies = ["BRL", "USD", "EUR"];
  if (!validCurrencies.includes(STORE_CONFIG.currency)) {
    console.warn(`⚠️ Moeda "${STORE_CONFIG.currency}" pode não ser suportada. Use: ${validCurrencies.join(", ")}`);
  }

  // Validar formato do WhatsApp
  if (STORE_CONFIG.whatsapp && !/^\d{10,15}$/.test(STORE_CONFIG.whatsapp)) {
    console.warn("⚠️ Formato de WhatsApp pode estar incorreto. Use apenas números (55 + DDD + número)");
  }

  // Avisar sobre dados faltando
  if (!STORE_CONFIG.whatsapp) {
    console.warn("⚠️ WhatsApp não configurado. Preencha em config.js");
  }
})();

// Links formatados (não altere, sistema preenche automaticamente)
const STORE_LINKS = {
  whatsapp() {
    if (!STORE_CONFIG.whatsapp) return null;
    const msg = encodeURIComponent("Olá! Gostaria de conhecer os produtos da B&C BEAUTY.");
    return `https://wa.me/${STORE_CONFIG.whatsapp}?text=${msg}`;
  },
  instagram() {
    if (!STORE_CONFIG.instagram) return null;
    return `https://instagram.com/${STORE_CONFIG.instagram}`;
  },
  tiktok() {
    if (!STORE_CONFIG.tiktok) return null;
    return `https://tiktok.com/@${STORE_CONFIG.tiktok}`;
  },
  email() {
    if (!STORE_CONFIG.email) return null;
    return `mailto:${STORE_CONFIG.email}`;
  },
};

// As avaliações de clientes são carregadas de localStorage
// Nenhum dado fictício é mostrado. A seção de avaliações
// exibirá "Nenhuma avaliação ainda" até que clientes avaliem.