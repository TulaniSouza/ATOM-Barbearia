# 03 - Guidelines de Design e Estilo

O ATOM possui uma identidade visual forte, baseada em um tema escuro com contrastes metálicos e cores vibrantes para ações.

## Identidade Visual
*   **Tema:** Dark Mode.
*   **Estética:** Moderna, limpa e de alto contraste.
*   **Bordas:** Arredondadas (padrão de 8px para cards e botões).

## Cores (Paleta Base)
*   **Fundo Principal:** `#0d0d0d`
*   **Cards/Superfícies:** `#1a1a1a`
*   **Destaque (Primário):** `#cca43b` (Dourado/Bronze)
*   **Sucesso:** `#2ecc71` (Verde)
*   **Erro/Destrutivo:** `#ff4d4d` (Vermelho)
*   **Texto Principal:** `#ffffff`
*   **Texto Secundário:** `#aaaaaa`

## Tipografia
*   **Base/Leitura:** `Barlow`, sans-serif.
*   **Títulos/Destaque:** `Bebas Neue`, sans-serif.

## Mixins SCSS (`src/styles/_mixins.scss`)
Utilize os mixins padronizados para manter a consistência:
*   `flex-center($direction)`: Centralização rápida com flexbox.
*   `primary-btn($bg, $text)`: Estilização base para botões principais.
*   `tablet-up`: Media query para dispositivos tablet e superiores (>= 768px).
