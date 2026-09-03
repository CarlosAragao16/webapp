# B&C BEAUTY — Loja Virtual Premium

Webapp moderno, responsivo e otimizado para venda de cosméticos com:
- ✅ V-Libras integrado (acessibilidade em LIBRAS)
- ✅ Sistema de perfil do cliente
- ✅ Carrinho persistente (LocalStorage)
- ✅ Busca e filtros avançados
- ✅ Depoimentos de clientes
- ✅ Finalização de pedido via WhatsApp
- ✅ Design mobile-first profissional
- ✅ SEO otimizado

## 🚀 Início Rápido

### Rodar Localmente

Como o site carrega `produtos.json` via `fetch`, é necessário rodá-lo em um servidor local:

**Com Python (recomendado):**
```bash
cd BC-Store
python3 -m http.server 8000
```
Abra `http://localhost:8000`

**Com Node.js:**
```bash
cd BC-Store
npx http-server -p 8000
```

**Com VS Code:**
Instale a extensão "Live Server" e clique com botão direito em `index.html` → "Open with Live Server"

### Publicar Online

Quando publicar em um servidor (GitHub Pages, Netlify, Vercel, hospedagem compartilhada etc.), o site funcionará normalmente sem precisar desses passos.

---

## ⚙️ Configuração Essencial

**Abra `config.js` e preencha:**

```javascript
const STORE_CONFIG = {
  // OBRIGATÓRIO
  whatsapp: "5511999999999", // Seu número: DDI + DDD + número (sem símbolos)

  // Recomendado
  phone: "(11) 99999-9999",
  email: "contato@suaemail.com",
  instagram: "seu_usuario", // sem @
  tiktok: "seu_usuario",
  address: "Rua Nome, 123 — São Paulo, SP",
  
  // Resto é automático
  description: "Cosméticos e cuidados com beleza",
  benefits: [
    "Atendimento personalizado via WhatsApp",
    "Produtos selecionados",
    "Entrega rápida"
  ]
};
```

**Salve e recarregue o site.** Os links e contatos aparecerão automaticamente no site.

---

## 📦 Estrutura

```
BC-Store/
├── index.html              ← Página principal
├── config.js               ← Configurações (preencha aqui!)
├── produtos.json           ← Catálogo de produtos
├── css/
│   └── style.css           ← Estilos (mobile-first, responsivo)
├── js/
│   ├── storage.js          ← Helper de LocalStorage
│   ├── products.js         ← Gerenciador de produtos
│   ├── cart.js             ← Gerenciador do carrinho
│   ├── profile.js          ← Sistema de perfil do cliente
│   ├── ui.js               ← Funções de renderização
│   └── app.js              ← Inicialização e eventos
├── img/
│   └── produtos/           ← Imagens dos produtos (produto-01.jpg até...)
└── README.md               ← Você está aqui
```

---

## 🛍️ Gerenciar Produtos

### Adicionar Produto

1. **Salve a foto** em `img/produtos/produto-14.jpg` (próximo número disponível)
2. **Edite `produtos.json`** e adicione um bloco:

```json
{
  "id": 14,
  "name": "Nome do Produto",
  "category": "Rosto",
  "image": "img/produtos/produto-14.jpg",
  "price": 49.90,
  "salePrice": 39.90,
  "stock": 10,
  "rating": 4.8,
  "reviews": 12,
  "badge": "Em promoção",
  "description": "Descrição detalhada do produto..."
}
```

**Campos obrigatórios:**
- `id` — número único (incrementar sempre)
- `name` — nome do produto
- `category` — uma de: "Maquiagem", "Lábios", "Olhos", "Rosto", "Skincare"
- `price` — preço em reais (ex: 49.90)
- `image` — caminho da imagem

**Campos opcionais:**
- `salePrice` — preço com desconto (se houver)
- `stock` — quantidade em estoque
- `rating` — avaliação de 0 a 5 (ex: 4.8)
- `reviews` — número de avaliações
- `badge` — etiqueta especial (ex: "Bestseller", "Em promoção")
- `description` — descrição longa do produto

### Editar Produto

Encontre o produto no `produtos.json` e altere os campos. Salve e recarregue o navegador.

### Remover Produto

Deletar o bloco do JSON.

---

## 👤 Sistema de Perfil do Cliente

O cliente pode:
1. Criar um perfil com **nome, e-mail e telefone**
2. Os dados são salvos no navegador (LocalStorage)
3. Ao finalizar pedido, os dados aparecem automáticamente na mensagem do WhatsApp
4. O nome do cliente aparece no header como saudação

**Dados salvos:**
- Apenas no navegador do cliente (não no servidor)
- O cliente pode remover a qualquer hora
- Facilita compras futuras

---

## 🛒 Carrinho e Checkout

### Como Funciona

1. Cliente adiciona produtos
2. Carrinho salva automaticamente
3. Clica em "Finalizar Compra"
4. Abre WhatsApp com mensagem pronta com:
   - Lista de produtos + quantidades
   - Total da compra
   - Dados do cliente (se salvou perfil)

**Importante:** Configure o `whatsapp` em `config.js` para que o checkout funcione.

---

## ♿ Acessibilidade (V-Libras)

**V-Libras está integrado por padrão!**

Um botão "Acessibilidade" aparece no canto inferior esquerdo. Ao clicar, abre um intérprete de LIBRAS em videoconferência.

Você não precisa fazer nada — o site já funciona com acessibilidade nativa.

---

## 📱 Mobile-First Responsivo

- ✅ Menu hambúrguer automático em celular
- ✅ Grade de produtos adapta-se ao tamanho da tela
- ✅ Carrinho desliza pela lateral (drawer)
- ✅ Todos os botões com tamanho mínimo de 44px (acessível)
- ✅ Testado em iOS e Android

---

## 🔍 SEO e Performance

- Meta tags configuradas em `index.html`
- Lazy loading de imagens
- Imagens otimizadas
- Estrutura semântica HTML5
- CSS mobile-first
- JavaScript modular e eficiente

Para melhorar SEO ainda mais:
1. Configure `og:image` em `config.js` com logo da loja
2. Configure `siteUrl` com seu domínio

---

## 🎯 Depoimentos de Clientes

No arquivo `config.js`, existe um array `DEMO_TESTIMONIALS`. Esses são depoimentos de exemplo.

Para usar seus próprios depoimentos, edite:

```javascript
const DEMO_TESTIMONIALS = [
  {
    id: 1,
    name: "Nome da Cliente",
    rating: 5,
    text: "O que ela disse sobre o produto",
    product: "Nome do Produto"
  },
  // ... mais depoimentos
];
```

---

## 📊 Dados Salvos no Cliente

**LocalStorage:**
- `bc_beauty_cart` — carrinho de compras
- `bc_beauty_profile` — dados do cliente (nome, e-mail, telefone)

Tudo é salvo no navegador do cliente. Você não tem acesso a esses dados.

---

## 🚀 Publicar (Deploy)

### GitHub Pages (Grátis)

1. Crie um repositório `seu-usuario.github.io`
2. Copie os arquivos para lá
3. Acesse `https://seu-usuario.github.io`

### Netlify (Grátis)

1. Abra [netlify.com](https://netlify.com)
2. Arraste a pasta `BC-Store` para "Deploy"
3. Pronto!

### Vercel (Grátis)

1. Abra [vercel.com](https://vercel.com)
2. Clique "Import Project"
3. Selecione a pasta
4. Deploy automático

---

## ⚡ Melhorias Futuras (Opcional)

- [ ] Integrar com sistema de pagamento (Stripe, PagSeguro)
- [ ] Adicionar categoria "Ofertas do Dia"
- [ ] Integração com email (newsletter)
- [ ] Dark mode
- [ ] Relatório de vendas via painel admin

---

## 🐛 Troubleshooting

**"Produtos não carregam"**
→ Certifique-se de rodá-lo em um servidor local ou hospedado. Não abra `index.html` diretamente.

**"WhatsApp não abre"**
→ Configure `whatsapp` em `config.js` no formato correto: `5511999999999`

**"Links de redes sociais não aparecem"**
→ Configure `instagram` e `tiktok` em `config.js` (apenas o username, sem @)

**"Imagens não carregam"**
→ Verifique se os arquivos estão em `img/produtos/` e nomeados corretamente

---

## 📞 Suporte

Qualquer dúvida, consulte a estrutura do código ou entre em contato para customizações.

---

**B&C BEAUTY © 2026 — Desenvolvido com ❤️**