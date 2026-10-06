# Teste de velocidade do site

Último teste: **6 de outubro de 2026 às 13:33**, no site no ar (https://harmonizacaohumana.com.br), com o Lighthouse 12.8.2
(o mesmo motor do PageSpeed Insights do Google). Cada página rodou 3 vezes em cada aparelho; vale a do meio.
O "celular" simula um aparelho médio numa rede 4G lenta, de propósito mais duro que a vida real.

Para rodar de novo: GitHub → aba **Actions** → **Teste de velocidade** → **Run workflow**. Este arquivo se atualiza sozinho.

## Notas (0 a 100)

| Página | Aparelho | Desempenho | Acessibilidade | Boas práticas | SEO | 1º conteúdo | Maior conteúdo | Bloqueio | Estabilidade | Peso |
|---|---|---|---|---|---|---|---|---|---|---|
| A Jornada | celular | 99 | 100 | 100 | 100 | 0.8 s | 2.0 s | 0.0 s | 0.000 | 93 KB |
| A Jornada | computador | 99 | 95 | 100 | 100 | 0.3 s | 0.9 s | 0.0 s | 0.000 | 93 KB |
| Início | celular | 98 | 100 | 100 | 100 | 0.9 s | 2.4 s | 0.0 s | 0.000 | 123 KB |
| Início | computador | 99 | 95 | 100 | 100 | 0.3 s | 0.9 s | 0.0 s | 0.000 | 123 KB |
| Sobre | celular | 98 | 100 | 100 | 100 | 0.8 s | 2.4 s | 0.0 s | 0.000 | 157 KB |
| Sobre | computador | 99 | 95 | 100 | 100 | 0.3 s | 0.9 s | 0.0 s | 0.000 | 120 KB |

**Como ler:** 90 a 100 é verde (ótimo), 50 a 89 é laranja, abaixo de 50 é vermelho.
"Maior conteúdo" é quando a parte principal da tela aparece (bom: até 2,5 s). "Estabilidade" mede se a página
pula enquanto carrega (bom: até 0,1). "Bloqueio" é o tempo em que a página não responde ao toque (bom: até 0,2 s).

## Pontos abaixo de 90 apontados pelo teste

- Background and foreground colors do not have a sufficient contrast ratio. (A Jornada, computador)
- Background and foreground colors do not have a sufficient contrast ratio. (Início, computador)
- Background and foreground colors do not have a sufficient contrast ratio. (Sobre, computador)
