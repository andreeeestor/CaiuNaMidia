# SaiuNaMídia - COPASA

O **SaiuNaMídia** é uma aplicação web desenvolvida exclusivamente para apoiar e otimizar o fluxo de trabalho do setor de publicidade da **COPASA**. 

A plataforma funciona como um explorador e repositório de arquivos focado em mídia (imagens, banners e peças publicitárias), fornecendo uma interface rica, robusta e familiar (similar ao Google Drive/Finder), que permite o armazenamento, organização e compartilhamento rápido de recursos essenciais da equipe.

## 🚀 Principais Funcionalidades

- **Dashboard Estilo Explorer:** Interface em Grid (Grade) e List (Lista), navegação por pastas com visual idêntico aos melhores exploradores de arquivos.
- **Armazenamento em Nuvem (Cloudinary):** Upload seguro e otimizado de imagens.
- **Organização por Pastas:** Estrutura em árvore ilimitada, facilitando encontrar materiais de campanhas específicas.
- **Visualização Rápida (Lightbox):** Pré-visualização com um único clique com link imediato para compartilhamento.
- **Sistema de Seleção e Ações em Lote:** Caixas de seleção individuais para exclusão e movimentação de múltiplas mídias de uma vez.
- **Menu de Contexto (Right-click):** Acesso rápido às opções de cópia de link, mover arquivo ou deletar.
- **Design COPASA:** Tema alinhado à identidade visual da companhia.
- **Área Restrita:** Acesso protegido por senha garantindo segurança dos materiais internos (NextAuth).

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [Next.js 15 (App Router)](https://nextjs.org/) + React 19
- **Estilização:** CSS Modular (Foco em performance e UI fiel à identidade da COPASA)
- **Autenticação:** [NextAuth.js (v4)](https://next-auth.js.org/)
- **Armazenamento/CDN:** [Cloudinary](https://cloudinary.com/) (API Integrada para gerenciamento dos recursos)

## 📦 Como executar o projeto localmente

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env.local` na raiz com as seguintes chaves (solicite à equipe responsável):
   ```env
   # Cloudinary Keys
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   
   # NextAuth
   NEXTAUTH_SECRET=uma-string-secreta-forte
   NEXTAUTH_URL=http://localhost:3000
   
   # Acesso
   ACCESS_PASSWORD=senha_do_sistema
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:3000` no seu navegador.

---
*Desenvolvido para facilitar o dia a dia da Publicidade da COPASA.*
