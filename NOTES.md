# 📝 NOTES.md — Lapidare App

Registro vivo das decisões tomadas sobre o app **Lapidare** (painel da nutri + app da paciente).
Atualizado conforme o produto evolui. **Não é documentação pública** — é nosso log interno.

---

## 🎯 Visão geral

**O que é:** template open-source de plataforma completa pra nutricionistas autônomas. Cada nutri tem seu próprio painel + app das pacientes, com banco isolado e zero custo recorrente no plano grátis.

**Pra quem:** nutris que querem profissionalizar o acompanhamento sem pagar SaaS mensal e sem precisar saber programar.

**Modelo:** distribuído via GitHub fork → cada nutri cria seu próprio Supabase + deploy no Netlify (instruções em SETUP.md).

**Repositório:** [github.com/danielasoares-rd/lapidare-app](https://github.com/danielasoares-rd/lapidare-app)
**Deploy de referência:** [lapidareapp.netlify.app](https://lapidareapp.netlify.app)

---

## 🏗️ Stack & arquitetura

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| Frontend | **React 18 + Vite** | Build rápido, dev experience boa |
| Roteamento | **React Router v6** | Padrão React, simples |
| Backend | **Supabase** (Postgres + Auth + Storage + Realtime + RLS) | Tudo em um, plano grátis generoso, RLS pra isolar dados |
| Deploy | **Netlify** | Grátis, integra com GitHub, HTTPS automático |
| Estilo | **Plain CSS + Design Tokens** (sem Tailwind) | Personalizável visualmente sem mexer em código |
| PWA | manifest.json + ícones PNG + meta tags | App instalável no celular da paciente |

**Duas personas no mesmo app:**
- **Painel da Nutri** → desktop-first (sidebar + áreas largas)
- **App da Paciente** → mobile-only PWA (instalável no celular)

---

## 🎨 Identidade visual

### Paleta padrão (editável pela tela Personalização)
- Cream `#F0EBE3` — fundo da página
- Dark `#1C1712` — texto / sidebar / botões primários
- Gold `#C4A882` — acento / destaque
- Verde / Vermelho / Azul / Laranja funcionais

### Tipografia
- **Serif** (títulos): Cormorant Garamond
- **Sans** (corpo): Inter
- Alternativas: Manrope, Playfair + Lato (selecionáveis em Personalização)

### Sistema de Personalização
- Tela `Personalização` no painel da nutri permite:
  - Upload de logo
  - Mudança de nome da marca + tagline
  - Cor primária + secundária
  - Tipografia
- Tudo salvo na tabela `nutris` (campos `brand_*`) e aplicado via ThemeProvider
- **Importante:** sobrescreve `--dark` também (não só `--gold`), pra mudar visual da sidebar/botões

---

## 👩‍⚕️ Painel da Nutri

### Estrutura da sidebar
```
ATENDIMENTO
  📊 Visão geral
  👥 Pacientes
  ➕ Cadastrar paciente
  📅 Agenda
  💬 Chat
  📸 Feed de pratos
  📋 Check-ins
  📑 Prescrições
  📚 Biblioteca (e-books)

GESTÃO DO CONSULTÓRIO
  🧠 Cérebro do negócio
  ⚙️ Meus serviços
  📈 Previsibilidade
  💰 Financeiro real
  🎨 Personalização

SESSÃO
  Nome + Sair
```

### Telas / features principais

**Visão geral:**
- KPIs: receita do mês, meta, mentoradas ativas
- Próximas consultas da semana
- Alertas relacionais: aniversariante, paciente sumida há X dias, parcela atrasada, baixa aderência
- Meta mensal com progresso

**Pacientes:**
- Lista filtrada por status / plano / modalidade
- Cadastro gera link único (token) pra paciente criar senha
- Perfil da paciente com **9 abas**:
  - Evolução (linha do tempo)
  - Follow-up
  - Plano alimentar (importa via JSON)
  - Lista de compras (importa via JSON)
  - Suplementação (habit tracker)
  - Prescrições (PDF)
  - E-books atribuídos
  - Avaliação antropométrica
  - Check-ins / Anamnese / Hábitos

**Agenda:**
- Calendário mensal
- Tipos de consulta: primeira / retorno
- Link automático Jitsi (grátis) ou Meet manual
- Botão "Adicionar ao Google Calendar"
- Links extras: Shaped, Notion, Trello

**Financeiro real:**
- 4 tabs: Entradas / Saídas / Previsibilidade / Por produto
- Vendas com parcelamento (cartão / Pix / Asaas / boleto)
- Status: pago / pendente / atrasado
- Edição e exclusão de venda inteira (cascade nas parcelas)
- Edição de parcela individual

**Cérebro do negócio:**
- Funil de aquisição
- LTV, CAC, churn
- Forecast por produto
- Insights estratégicos

**Previsibilidade:**
- Calculadora: gastos fixos + ticket médio + horas semanais → "você precisa de X pacientes pra bater a meta"
- Persistido em `nutris.previsibilidade_*`

**Meus serviços:**
- Catálogo dos serviços vendidos
- Nome + ticket + descrição + ativo
- Usado pelo Financeiro pra preencher venda com 1 clique

**Check-ins / Questionários:**
- Templates customizáveis
- Múltiplos templates por nutri
- Agendamento recorrente (pg_cron quando disponível)
- Banner no início da paciente quando há pendente
- Anamnese / QFA / Recordatório 24h prontos como modelo

**Biblioteca de e-books:**
- Upload de PDF (1 vez)
- Atribuição individual por paciente
- Banner dourado "📚 Novo e-book" pra paciente

**Personalização:**
- Logo, marca, cores, tipografia
- Tudo aplicado instantaneamente no app

---

## 📱 App da Paciente

### Estrutura
- **Layout mobile-first** (header + body + tab bar inferior)
- **Sheet "Mais"** pra itens secundários
- **PWA instalável** ("Adicionar à Tela de Início")
- Termo de consentimento LGPD no primeiro acesso

### Tab bar principal
- 🏠 Início
- 🥗 Plano
- 📷 Feed
- 💊 Suplementos
- ⋯ Mais (Compras / Progresso / Prescrições / E-books / Hábitos)

### Telas
- **Início:** banners (próxima consulta, check-in pendente, e-book novo), hábitos do dia, atalhos
- **Plano alimentar:** refeições com substituições
- **Lista de compras:** itens por categoria
- **Feed:** posta foto da refeição → nutri comenta
- **Progresso:** gráficos de peso, medidas, % gordura, fotos de evolução
- **Suplementos:** check diário + streak + aderência%
- **Prescrições + E-books:** download de PDF
- **Chat realtime:** com a nutri (Supabase Realtime)
- **Check-in:** responde banner

---

## ✅ Decisões importantes que tomamos

### Cadastro e link único
- **Nutri cadastra paciente** → entra em `pacientes_pendentes` com token único
- Link gerado: `/signup-paciente/:nutriId/:token`
- Paciente clica → cria conta no Supabase Auth → preenche senha → trigger move pra `pacientes`
- Botões "Copiar link" e "WhatsApp" (mensagem pronta)

### Autenticação
- Supabase Auth (email + senha)
- Confirm email **desligado por padrão** (evita rate limit grátis de 3/hora)
- SessionProvider resolve role automaticamente (`nutri` ou `paciente`)
- RequireAuth + RequireRole guards nas rotas

### Plano alimentar
- Importado via **JSON** colado pela nutri
- Validador checa formato antes de salvar
- "Dica do ChatGPT" em amarelo com prompt pronto pra gerar JSON novo

### PWA (instalável no celular)
- `manifest.json` em `/public/`
- Ícones PNG: 192x192, 512x512, 180x180 (apple-touch)
- Meta tags: `apple-mobile-web-app-capable`, `mobile-web-app-capable`, `theme-color`
- Tutorial pra paciente "Adicionar à Tela de Início" no Safari (iOS) e Chrome (Android)

### Distribuição open source
- README.md + SETUP.md + CUSTOMIZAR.md
- Workshop site (`lapidare-fase02-workshop`) com 4 dias de tarefas + 41 itens
- Tutorial em vídeo + prints
- Cada nutri precisa criar seu **próprio Supabase** + **fork no GitHub** + **deploy no Netlify**

### Atualização do template (Sync Fork)
- Nutri faz Sync Fork no GitHub → Netlify auto-redeploy
- **Dados ficam intactos** (estão no Supabase dela, não no GitHub)
- Setup.sql é **idempotente** (`create table if not exists`) → pode rodar de novo sem perder dados

---

## 🐛 Bugs corrigidos (histórico)

| Bug | Causa | Solução |
|-----|-------|---------|
| `Bucket not found` (ebooks) | Bucket Storage não criado pelo setup | SQL pra criar bucket + policies |
| Infinite recursion em policy de ebooks | Policy referenciava a própria tabela | Criar funções `SECURITY DEFINER` (`paciente_pode_ver_ebook`, `nutri_dona_do_ebook`) |
| `--white` não funcionava em paciente | Variável CSS sobrescrita no contexto | Hardcode `#ffffff` em botões críticos |
| Tabs quebradas (Follow-up wrap em 2 linhas) | Falta de overflow control | `white-space: nowrap` + `overflow-x: auto` |
| Personalização só mudava acentos pequenos | Não sobrescrevia `--dark` (sidebar/botões usam) | Sobrescrever `--dark` + tons derivados via `mistura()` |
| Botão "Aceito" do termo invisível | `var(--white)` não resolvia no contexto | Hardcode `#ffffff` |
| `relation "public.servicos" does not exist` (Kelly) | `vendas` tinha FK pra `servicos` mas era criada antes | Mover `CREATE TABLE servicos` antes de `vendas` em setup.sql |
| `schema "cron" does not exist` (Kelly) | pg_cron precisa de permissão Supabase Pro | Wrap em `EXCEPTION` handler + `IF EXISTS pg_namespace` |
| JS quebra (lightbox + check + tabs) | Temporal dead zone com `let diasCompletados` | Mover declaração ANTES do `updateProgress()` |
| Financeiro: sem editar/excluir venda inteira | Só tinha modal de parcela | Botões "Editar venda" + "Excluir venda" no rodapé do card expandido + `EditarVendaModal` (paciente, serviço, data, obs) |

---

## 🔄 Workshop Fase 02 (`lapidare-fase02-workshop`)

Site HTML interativo pra ensinar nutris a fazer o setup + cadastrar primeira paciente.

### Características
- **4 dias de tarefas**, 41 itens no total:
  - Dia 01 — Setup (11 tarefas): GitHub, Fork, Supabase, pg_cron, setup.sql, Netlify, deploy
  - Dia 02 — Personalização (6 tarefas): logo, cores, tipografia
  - Dia 03 — Primeira paciente (11 tarefas): cadastro, **ensinar a instalar app no celular**, JSON do plano, anamnese, hábitos, suplementos
  - Dia 04 — Modificar app com Claude Code (13 tarefas)
- Tabs entre dias + progresso por dia + total
- Checkboxes com persistência no localStorage
- Confetti animation quando completa
- Lightbox com botão "+" pra zoom em prints
- Animações smooth nos checks
- "Como usar este guia" banner explicativo

### Tarefa #2 do Dia 03 (importante)
**"Orientar a paciente a instalar o app no celular"** com mensagem pronta pra mandar no WhatsApp + instruções separadas pra iPhone (Safari) e Android (Chrome).

---

## ⚠️ Limites do plano Free

| Recurso | Limite | Quando estoura |
|---------|--------|----------------|
| Supabase Database | 500 MB | ~100 pacientes ativas por anos |
| Supabase Storage | 1 GB | ~500 fotos de evolução |
| Supabase Email Auth | 3/hora | Configurar SMTP próprio (Resend grátis) |
| GitHub | Ilimitado (repos públicos) | Nunca |
| Netlify | 100 GB/mês banda | Praticamente nunca |

Quando estourar: **Supabase Pro US$ 25/mês** (~R$ 130) com 8 GB DB + 100 GB storage.

---

## 📌 Próximos passos sugeridos (não prioritários)

- [ ] Integração WhatsApp Business API pra disparo automático (boas-vindas, lembretes, alertas)
- [ ] App da paciente PWA com notificações push (já tem manifest, falta service worker)
- [ ] Importação de pacientes via CSV (já tem schema, falta UI completa)
- [ ] Multi-idioma (en, es) pra escalar pra fora do BR
- [ ] Tela de Cérebro do Negócio mais visual (gráficos)
- [ ] Integração Stripe / Asaas pra cobrança automática
- [ ] Export do banco da nutri (backup completo)

---

## 🆘 Suporte recorrente das alunas

**Erros mais comuns:**
1. **"Email rate limit exceeded"** → desligar Confirm email no Supabase
2. **"Bucket not found"** → rodar setup.sql completo de novo
3. **"App diz Conectando... sem fim"** → conferir variáveis VITE_SUPABASE_* no Netlify
4. **"Email não autorizado"** → usar alias `+teste` (ex: `seuemail+ana@gmail.com`)

**Pra atualizar app:**
1. GitHub do fork → botão **Sync fork** → **Update branch**
2. Netlify auto-redeploy em 2-3 min
3. Setup.sql é idempotente, pode rodar de novo se houver mudança no schema
4. **Dados NÃO somem** (estão no Supabase dela)

---

## 📂 Estrutura de pastas (referência)

```
lapidare-app/
├── README.md           # Visão geral pública
├── SETUP.md            # Passo a passo de setup
├── CUSTOMIZAR.md       # Como modificar com Claude Code
├── NOTES.md            # ESTE ARQUIVO (notas internas)
├── LICENSE             # MIT
├── package.json
├── vite.config.js
├── netlify.toml
├── index.html          # PWA meta tags + manifest
├── public/
│   ├── manifest.json   # PWA manifest
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   ├── icon-source.svg # SVG fonte dos ícones (editar pra rebrand)
│   └── icons.svg
├── src/
│   ├── app/
│   │   ├── auth/       # Login, signup, callback
│   │   ├── nutri/      # 14 telas do painel da nutri
│   │   └── paciente/   # 11 telas do app da paciente
│   ├── components/     # Layouts compartilhados (NutriLayout, PacienteLayout, RequireAuth, etc)
│   ├── lib/            # supabase.js, session.jsx, theme.jsx, utils.js, validators
│   ├── styles/         # tokens.css, nutri.css, paciente.css, checkin.css
│   └── main.jsx
└── supabase/
    └── setup.sql       # Schema completo (idempotente, 700+ linhas)
```

---

## 📜 Histórico de versões

- **v1.0** — Lançamento inicial open source
- **v1.1** — Fix pg_cron opcional + ordem servicos/vendas no setup
- **v1.2** — PWA completo (manifest + ícones) + editar/excluir venda no Financeiro
- **v1.3** — Personalização total (Login com marca, cores no Login, mensagens de erro úteis)
- **v1.4** — Sidebar inteira muda com cor primária + contraste adaptativo
- **v1.5** — Fix logo upload (RLS) + cor texto sidebar customizável + labels claros
- **v1.6** — Nome/foto da nutri customizável (substitui "Dra. Daniela" hardcoded) + banner F5 grande

---

## 🆕 Sessão maio/2026 — atualizações pós-criação deste doc

Atualizações implementadas DEPOIS da v1.2 documentada acima. Todas no GitHub
em commits: `f096f9d`, `349701c`, `8cfeb6c`, `d048612`, `2d3e899`, `ae83f8a`, `731b076`.

### 1. Login customizado com marca da nutri
- `Login.jsx` antes: hardcoded "LAPIDARE"
- `Login.jsx` agora: usa `useTheme()` pra mostrar `marca_nome` da nutri (ou logo)
- Nova função SQL `buscar_marca_principal()` — busca marca da nutri "dona" do deploy
  pra exibir mesmo SEM usuário logado (a tela de Login é pública)
- `theme.jsx`: quando role é null/anônimo, agora chama essa RPC

### 2. Personalização agora muda TUDO de verdade (não só acentos)
**Problema raiz:** `nutri.css` redeclarava `--dark`, `--amber` dentro de `.nutri-panel` →
isso tem precedência sobre `:root` onde o JS aplica → personalização não pegava.
Mesmo com `.paciente-app` no paciente.

**Fix:** removeu redeclarações locais, declarou `--dark` e `--amber` no `:root` em
`tokens.css`. JS agora controla via `r.style.setProperty('--dark', primaria)`.

Também adicionou variantes derivadas no `theme.jsx`:
- `--dark-shade` (hover/active bg)
- `--dark-line` (borda do toggle)
- `--dark-label` (labels de grupo na sidebar)
- `--dark-text` (texto claro principal)
- `--dark-muted` (texto inativo)
- `--bg`, `--bg-soft`, `--bg-deep` (background derivado da primária)
- `--ink` (texto escuro derivado da primária)

Login + SignupPaciente: removidos gradientes hardcoded (`#ece6dc 0%, #e3dcce 100%`),
agora usam `var(--bg-soft) 0%, var(--bg-deep) 100%`.

### 3. Contraste adaptativo do texto da sidebar
Quando primária é CLARA (luminância > 0.45 — ex: tan, rose gold), texto vira preto.
Quando ESCURA, texto vira branco. Garante contraste em qualquer paleta.

Fórmula do muted derivada do TEXTO (não da primária) → contraste forte:
- Primária clara: muted = preto + 35% primária
- Primária escura: muted = branco + 40% primária

Função `luminancia(hex)` adicionada no `theme.jsx`.

### 4. Mensagens de erro amigáveis no cadastro
`Login.jsx` agora tem função `mensagemAmigavel(error)` que traduz:
- `Failed to fetch` / `Falha ao buscar` → instrução completa de Trigger Deploy
  + checar URL/key no Netlify (era o problema das nutris novas)
- `Invalid login credentials` → "Email ou senha incorretos"
- `email rate limit` → como desligar Confirm email
- `user already registered` → sugere fazer login

Div do erro recebe `whiteSpace: 'pre-line'` pra quebras de linha.

### 5. Fix do upload de logo (RLS bug)
Erro: "new row violates row-level security policy".
- Adicionada policy `logos_storage_select` (faltava)
- INSERT/UPDATE/DELETE simplificadas: `auth.uid() is not null` em vez de checar
  path com UUID (cada nutri tem Supabase isolado, então pode ser permissivo)
- Bucket `logos` confirmado público

### 6. Cor do texto da sidebar customizável (override manual)
- Nova coluna `nutris.cor_texto_sidebar` (text, nullable)
- Quando preenchida, sobrescreve o auto-calculado
- UI no Personalização: input color + reset "Voltar pro automático"
- `theme.jsx`: aplica override no `--dark-text` se existir

### 7. Banner F5 grande (impossível ignorar)
Substituiu mensagem verde miúda "Personalização salva! Recarregue a página" por
banner amarelo grande com ícone refresh + botão "Recarregar agora" que faz
`window.location.reload()`. Fica sticky até user recarregar.

### 8. Preview do Personalização não some mais (profile-aware)
**Problema:** ao abrir Personalização, useEffect do preview aplicava cores do
`form` (que começa com defaults) antes do `profile` carregar — sidebar piscava
defaults brevemente.

**Fix:** guard `if (!profile) return;` no useEffect — só aplica preview quando
profile já chegou.

### 9. Nome/foto da nutri customizável (substituiu "Dra. Daniela" hardcoded)
**Problema crítico:** 5 lugares no painel da paciente tinham "Dra. Daniela"
hardcoded — paciente da Kelly via "Dra. Daniela" em vez de "Dra. Kelly".

Lugares corrigidos:
- `src/app/paciente/Chat.jsx` (banner + empty state)
- `src/app/paciente/Feed.jsx` (comentário da nutri)
- `src/app/paciente/Inicio.jsx` (consulta no Google Calendar)
- `src/components/PacienteLayout.jsx` (header do chat)

**Solução:**
- Nova coluna `nutris.foto_url`
- `buscar_personalizacao_nutri()` agora retorna `nutri_nome` (= `nome`) e
  `nutri_foto_url` (= `foto_url`)
- `theme.jsx` propaga via `tema.nutri_nome` e `tema.nutri_foto_url`
- Os 5 lugares hardcoded agora usam `useTheme()` + variável dinâmica
- Novo card "Meu perfil" no Personalizacao (separado da Marca) — nome de
  exibição + upload de foto

### 10. Fix erro 42P13 (mudança de return type)
Postgres bloqueia `create or replace function` quando o return type muda
(ex: adicionar coluna nova no return table). Solução: `DROP FUNCTION IF EXISTS`
antes do `CREATE OR REPLACE`. Aplicado em `buscar_personalizacao_nutri()` e
`buscar_marca_principal()` no setup.sql.

### 11. Documentação aprimorada
- `SETUP.md`: nova seção "Falha ao buscar" como PRIMEIRO problema da lista,
  com checklist de 4 passos (variáveis Netlify, redeploy, Supabase pausado, F12)
- `CLAUDE.md`: criado pra dar contexto automático ao agente quando abrir Claude
  Code nessa pasta

---

## 🛠️ Workflow de atualização pras nutris EXISTENTES

Quando alguma atualização nossa precisa de mudança no banco, a nutri faz:
1. **GitHub:** Sync fork → Update branch
2. **Supabase:** copia bloco SQL específico, cola em SQL Editor, Run
3. **Netlify:** redeploy automático em 2-3 min
4. **Browser:** hard refresh (Cmd+Shift+R)

Pra próximas atualizações **só de frontend**, basta o passo 1 + 4 (skip SQL).

Setup.sql é **sempre idempotente** — pode rodar completo de novo sem perder dados.

---

## 📋 Próximas decisões em aberto

- **Banner "Atualização de banco pendente"** no app (auto-detect via tentar
  query e fallback se faltar coluna) — pra alertar nutri quando precisa rodar SQL
- **Manter "Meus serviços" ou unificar com "Esteira"?** (decisão pendente — discutida no DS Company)
- **Edge Function pra auto-migração?** (Caminho 3 da conversa anterior — mais complexo)
- **Importação XLSX direto** (atualmente só CSV) na importação de pacientes

---

_Última atualização: maio/2026 · Mantido por Daniela Soares + Claude Code_
