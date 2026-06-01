# 05 - Guia de Contribuição

Para manter a qualidade e consistência do código, siga estas diretrizes ao contribuir com o projeto.

## Padrões de Código
*   **Nomenclatura:**
    *   Componentes: PascalCase (ex: `HeaderNavigation.jsx`).
    *   Arquivos de Estilo: Devem acompanhar o nome do componente ou ser globais na pasta `styles/`.
    *   Variáveis/Funções: camelCase.
*   **Estilos:**
    *   Prefira o uso de classes SCSS em vez de estilos inline (a menos que seja necessário para estados dinâmicos complexos).
    *   Importe `_mixins.scss` sempre que precisar de padrões globais.

## Boas Práticas
*   **Surgical Edits:** Faça alterações pontuais e evite refatorações em larga escala sem aviso prévio.
*   **Acessibilidade:** Garanta que botões tenham áreas de toque adequadas e contrastes legíveis.
*   **Responsividade:** Teste sempre em resoluções mobile.

## Processo de Desenvolvimento
1.  Desenvolva o componente em `src/components`.
2.  Adicione o estilo correspondente em `src/styles`.
3.  Integre no `App.jsx` ou na rota correspondente.
4.  Verifique a consistência visual com o Design System.
