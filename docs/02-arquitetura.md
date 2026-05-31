# 02 - Arquitetura e Tecnologias

O projeto ATOM é construído sobre uma stack moderna e leve, priorizando a facilidade de manutenção e rapidez no carregamento.

## Stack Tecnológica
*   **React:** Biblioteca principal para a interface.
*   **Vite:** Ferramenta de build e servidor de desenvolvimento.
*   **SCSS:** Pré-processador CSS para estilos modulares e reutilizáveis.
*   **JavaScript:** Linguagem base (ES6+).

## Estrutura de Pastas
A estrutura atual do projeto segue esta organização:

```text
/
├── docs/               # Documentação do projeto
├── screens/            # Protótipos e referências de telas
├── src/
│   ├── assets/         # Imagens, logos e fontes
│   ├── components/     # Componentes React reutilizáveis
│   ├── styles/         # Variáveis, mixins e arquivos SCSS globais/específicos
│   ├── App.jsx         # Componente principal e orquestrador de rotas/telas
│   └── main.jsx        # Ponto de entrada da aplicação
```

## Princípios de Implementação
1.  **Componentes Funcionais:** Uso exclusivo de hooks e funções.
2.  **Mobile-First:** Design pensado primariamente para telas pequenas.
3.  **Simplicidade:** Evitar bibliotecas externas desnecessárias e "over-engineering".
4.  **Código em Inglês:** Nomes de variáveis, funções e componentes devem ser em inglês.
5.  **Interface em Português:** Textos visíveis para o usuário final devem ser em PT-BR.
