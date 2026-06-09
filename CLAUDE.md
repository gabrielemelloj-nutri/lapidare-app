# 🌿 Lapidare App — contexto pro Claude Code

> **Esse arquivo é lido automaticamente quando você abre Claude Code nessa pasta.**
> Dá o contexto inicial pra qualquer agente saber onde está e o que tá rolando.

---

## O QUE É

**Lapidare** é um **template open source** de plataforma completa pra **nutricionistas autônomas**.

- Cada nutri tem **o próprio deploy** (faz fork do GitHub + cria Supabase próprio + deploya no Netlify)
- Zero custo recorrente (tudo plano free)
- Distribuído via [github.com/danielasoares-rd/lapidare-app](https://github.com/danielasoares-rd/lapidare-app)
- Deploy de referência: [lapidareapp.netlify.app](https://lapidareapp.netlify.app)

---

## STACK

- **Frontend:** React 18 + Vite + React Router v6
- **Backend:** Supabase (Postgres + Auth + Storage + Realtime + RLS)
- **Deploy:** Netlify
- **Estilo:** Plain CSS + design tokens (sem Tailwind)
- **PWA:** Instalável no celular (manifest + ícones)

---

## DUAS PERSONAS NO MESMO APP

| Persona | Rota | Layout |
|---------|------|--------|
| **Nutri** (dona do consultório) | `/nutri/*` | Desktop-first (sidebar) |
| **Paciente** (cliente da nutri) | `/paciente/*` | Mobile-only (PWA) |

---

## DOCUMENTAÇÃO INTERNA — LEIA ANTES DE QUALQUER MUDANÇA

Os arquivos abaixo têm o histórico completo do projeto. **Antes de fazer mudanças, leia esses primeiro:**

| Arquivo | O que tem |
|---------|-----------|
| [`NOTES.md`](NOTES.md) | **REGISTRO COMPLETO** — todas as decisões, bugs corrigidos, features, RPCs, schema, próximos passos. **FONTE DA VERDADE.** |
| [`README.md`](README.md) | Visão pública do projeto (pra quem chega de fora) |
| [`SETUP.md`](SETUP.md) | Passo a passo de setup pra novas nutris (workshop Fase 02) |
| [`CUSTOMIZAR.md`](CUSTOMIZAR.md) | Guia de como modificar o app com Claude Code (pra nutris) |

---

## ESTRUTURA DA PASTA

```
lapidare-app/
├── CLAUDE.md       # ← VOCÊ ESTÁ AQUI (orientação pro agente)
├── NOTES.md        # ← LEIA ESSE: histórico de decisões
├── README.md       # Visão pública
├── SETUP.md        # Tutorial passo a passo
├── CUSTOMIZAR.md   # Pra nutris modificarem o app
├── LICENSE         # MIT
├── package.json
├── vite.config.js
├── netlify.toml
├── index.html      # PWA meta tags
├── public/
│   ├── manifest.json    # PWA
│   ├── favicon.svg
│   ├── icon-*.png       # Ícones PWA (192/512)
│   └── apple-touch-icon.png
├── src/
│   ├── app/
│   │   ├── auth/        # Login, signup, callback
│   │   ├── nutri/       # 14 telas do painel da nutri
│   │   └── paciente/    # 11 telas do app da paciente
│   ├── components/      # NutriLayout, PacienteLayout, RequireAuth
│   ├── lib/             # supabase.js, session.jsx, theme.jsx, utils.js
│   ├── styles/          # tokens.css, nutri.css, paciente.css
│   └── main.jsx
└── supabase/
    └── setup.sql        # Schema completo (~1400 linhas, idempotente)
```

---

## REGRAS IMPORTANTES PRO AGENTE

### 1. SEMPRE leia `NOTES.md` antes de mudanças grandes
Tem 100% do histórico — bugs já corrigidos, decisões tomadas, próximos passos. Evita refazer trabalho ou quebrar coisas que já funcionavam.

### 2. Schema do Supabase é **idempotente**
O `setup.sql` pode ser rodado várias vezes sem perder dados. Usa `if not exists` em todas as criações. Sempre que mudar schema, mantém essa propriedade.

### 3. NUNCA gere SQL que apague dados sem confirmar com Daniela
- `DROP TABLE`, `TRUNCATE`, `DELETE` em produção → SEMPRE perguntar antes
- ALTER, CREATE, INSERT idempotentes → OK
- Mudanças de RPC (return type) precisam de `DROP FUNCTION` antes

### 4. Personalização visual é via banco, não código
A nutri customiza marca/cores/foto na tela `Personalização`. O `ThemeProvider` (`src/lib/theme.jsx`) lê isso e aplica via CSS variables. **NÃO hardcode cores ou nomes.**

### 5. Distribuição open source
Mudanças devem ser:
- **Idempotentes no banco** (rodar de novo é seguro)
- **Compatíveis com versões antigas** quando possível (graceful degradation)
- **Documentadas em NOTES.md** depois de implementar

### 6. Antes de fazer push pro GitHub, Daniela precisa gerar token
**NUNCA commitar/pushar sem pedir token novo** (ela tem que gerar manual em Settings → Developer settings → Personal access tokens). Depois do push, **lembrar ela de revogar o token**.

---

## FLUXO DE TRABALHO TÍPICO

1. **Daniela traz um bug ou feature**
2. **Você lê `NOTES.md`** pra ver se já tem histórico relacionado
3. **Investiga o código** com Read/Grep
4. **Propõe a solução** (não implementa direto se for grande)
5. **Implementa** depois de validar a abordagem
6. **Testa com `npm run build`** pra garantir que compila
7. **Pede token pro push** (Daniela gera, manda)
8. **Push** + lembra dela de revogar
9. **Atualiza `NOTES.md`** com a mudança feita

---

## CONTEXTO ATUAL (estado em maio/2026)

- Lapidare v1.x em produção
- 3+ nutris ativas (Daniela + Kelly + Carla)
- Últimas mudanças: personalização avançada (cor sidebar, nome/foto da nutri pra paciente ver), fix logo upload, mensagens de erro amigáveis

**Próximos passos sugeridos** (ver NOTES.md):
- Banner "Atualização de banco pendente" no app (auto-detect)
- Integração WhatsApp Business API
- Notificações push no PWA da paciente
- Melhoria da importação de CSV (suporte XLSX)

---

## PROJETO IRMÃO (NÃO MISTURAR)

A Daniela também trabalha no **DS Company Dashboard** (`/Users/danielasoares/Desktop/dashboard-ds-company/`) — esse é o **negócio dela** (gerenciar mentoradas, financeiro do consultório dela, esteira de produtos).

**Esse aqui (Lapidare) é DIFERENTE** — é o produto que ela vende como template. Os contextos NÃO se misturam.

Se ela mencionar "DS Company", "esteira de serviços", "mentoradas", "Painel-Mentorada", "Arsenal de Stories/Carrosséis" → ela tá falando do OUTRO projeto. Avise educadamente que pra mexer naquilo é melhor abrir o outro Claude Code lá em `dashboard-ds-company`.

---

_Última atualização: maio/2026 · Daniela Soares + Claude_
