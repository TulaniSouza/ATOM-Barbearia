# GEMINI.md - Hora Marcada (Hora Marcada)

## Visão Geral do Projeto

**Hora Marcada (Hora Marcada)** é uma aplicação web de agendamento com foco em dispositivos móveis, desenvolvida para barbeiros autônomos e pequenas barbearias. Seu objetivo é reduzir a sobrecarga administrativa automatizando o processo de agendamento, substituindo o gerenciamento manual realizado via WhatsApp.

### Principais Funcionalidades (MVP)

* **Dashboards baseados em perfil:** Visões personalizadas para Barbeiros (Profissional) e Clientes.
* **Gerenciamento de Agendamentos:** Visualização e gerenciamento da agenda em tempo real.
* **Chatbot Inteligente:** Assistente integrado para agendamentos rápidos e sincronização com o Google Agenda (Para o futuro).
* **Tematização:** Modo Escuro de alto contraste com cor primária dourada/bronze (#cca43b).

### Stack Tecnológica

* **Frontend:** React 19 (Componentes Funcionais, Hooks), Vite 8.
* **Estilização:** SCSS (Sass 1.1), Variáveis CSS, Mixins.
* **Runtime:** Node.js (servidor de desenvolvimento Vite).
* **Arquitetura:** Estrutura React simplificada, focada em clareza e responsividade mobile-first.

---

## Primeiros Passos

### Pré-requisitos

* Node.js (recomendado utilizar a versão LTS mais recente).
* npm ou yarn.

### Build e Execução

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build

# Visualizar build de produção
npm run preview

# Executar análise de código (lint)
npm run lint
```

---

## Estrutura de Diretórios

* `docs/`: Documentação completa do projeto (Arquitetura, Design System, Fluxos de UX).
* `src/components/`: Componentes React reutilizáveis (ex.: `Login.jsx`).
* `src/styles/`: Estilos globais, variáveis e mixins SCSS (`_mixins.scss`).
* `src/assets/`: Arquivos de marca e recursos estáticos (logo ATOM).
* `screens/`: Protótipos de telas e guias de integração (fases anteriores).
* `PRD.md`: Documento original de requisitos do produto.

---

## Diretrizes de Desenvolvimento

### Padrões de Código

* **Idioma:** Todo o código (variáveis, funções e componentes) deve estar em **inglês**.
* **Interface do Usuário:** Todo texto exibido ao usuário deve estar em **português brasileiro (PT-BR)**.
* **Convenções de Nomenclatura:**

  * Componentes: `PascalCase.jsx`
  * Funções/Variáveis: `camelCase`
  * Estilos: `Component.scss` ou arquivos globais em `src/styles/`.
* **Estilização:** Preferir SCSS com mixins. Evitar estilos inline, exceto quando estritamente necessários para estados dinâmicos.

### Princípios de Implementação

1. **Mobile-First:** Sempre priorizar layout e usabilidade em telas pequenas.
2. **Alterações Cirúrgicas:** Preferir atualizações pontuais em componentes existentes em vez de grandes refatorações.
3. **Simplicidade:** Evitar over-engineering. Manter o escopo alinhado ao MVP definido no `PRD.md`.
4. **Segurança:** Seguir os princípios da LGPD para minimização de dados e consumo seguro de APIs.

### Cores da Interface

* Fundo: `#0d0d0d`
* Superfícies/Cards: `#1a1a1a`
* Primária/Dourado: `#cca43b`
* Sucesso: `#2ecc71`
* Erro: `#ff4d4d`

---

## Observações Contextuais

* O projeto atualmente utiliza dados simulados (mockados) para autenticação e agendamento, no futuro será integrado a API do projeto, para isso, o projeto deve seguir uma arquitetura para fácil troca entre dados mockados e integrar com a API externa.
* Um assistente inteligente (chatbot) está implementado dentro do componente `Login.jsx` para simular solicitações de agendamento.
* Documentação detalhada está disponível na pasta `docs/` para consultas mais profundas sobre arquitetura e decisões técnicas.
