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
  whatsapp: "",      // Formato: 5511987654321 (55 + DDD + número, sem símbolos)
  phone: "",         // Formato: (11) 99999-9999 (opcional)
  email: "",         // exemplo@email.com (opcional)
  address: "",       // Rua Nome, 123 — Bairro, São Paulo, SP (se houver retirada física)
  
  // === REDES SOCIAIS (deixar vazio se ainda não tiver) ===
  instagram: "",     // username SEM @
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
  demo: true,        // true = mostra dados de exemplo; false = hide demo content
  
  // === POLÍTICA DE ENTREGA (opcional) ===
  deliveryPolicy: "", // "Entrega em São Paulo: 1-3 dias úteis"
  paymentMethods: "", // "Pagamento via Pix, dinheiro ou transferência"
};

// === VALIDAÇÃO AUTOMÁTICA ===
// Avisa se a loja tem config vazia (modo demo)
if (STORE_CONFIG.demo && !STORE_CONFIG.whatsapp) {
  console.log("📝 Modo DEMO ativo. Preencha STORE_CONFIG com dados reais antes de publicar.");
}

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

// Dados de exemplo para demo (remover quando tiver dados reais)
const DEMO_TESTIMONIALS = [
  {
    id: 1,
    name: "Mariana",
    rating: 5,
    text: "Adorei! Os produtos chegaram rápido e a qualidade é excelente.",
    product: "Lip Oil Vivai"
  },
  {
    id: 2,
    name: "Julia",
    rating: 5,
    text: "Atendimento muito bom via WhatsApp, recomendo!",
    product: "Black Mask"
  },
  {
    id: 3,
    name: "Sofia",
    rating: 4.5,
    text: "Voltei a comprar! Produtos de verdade funcionam.",
    product: "Sérum Vitamina C"
  }
];
