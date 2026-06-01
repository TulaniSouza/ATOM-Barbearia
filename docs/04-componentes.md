# 04 - Componentes e Fluxos

Esta seção detalha os componentes e fluxos implementados atualmente na aplicação.

## Componentes Atuais

### `Login.jsx`
*   **Função:** Gerencia a autenticação inicial do usuário.
*   **Estados:** Suporta perfis de `barber` (barbeiro) e `client` (cliente).
*   **Integração:** Realiza o bootstrap do estado do usuário no `App.jsx`.

### `App.jsx` (Dashboard)
Atua como o orquestrador principal, exibindo telas diferentes baseadas no perfil logado:

1.  **Visão do Barbeiro:**
    *   Exibe a lista de solicitações pendentes.
    *   Permite aceitar ou recusar agendamentos.
    *   Feedback visual imediato para ações.
2.  **Visão do Cliente:**
    *   Exibe grade de horários disponíveis.
    *   Permite selecionar um horário para enviar solicitação.

## Fluxo de Usuário (UX)
1.  **Entrada:** Usuário acessa a tela de login.
2.  **Autenticação:** Escolha de perfil (simulado no MVP).
3.  **Dashboard:**
    *   Se Barbeiro: Gerencia solicitações de hoje.
    *   Se Cliente: Visualiza e solicita novos horários.
4.  **Ação:** Confirmação de agendamento via interface.
