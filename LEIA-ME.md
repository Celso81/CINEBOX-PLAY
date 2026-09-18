# CINEBOX PLAY — Landing Page

Site de página única para venda de IPTV **para cliente final (pessoa física)**.
Feito em HTML, CSS e JavaScript puro, sem build e sem dependências — é só subir na Netlify.

---

## 1. Como publicar na Netlify (2 minutos)

**Jeito mais rápido — arrastar e soltar:**

1. Entre em [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arraste **a pasta inteira** deste projeto para a página
3. Pronto. A Netlify te dá uma URL do tipo `nome-aleatorio.netlify.app`
4. Em *Site configuration → Change site name*, troque para algo como `cineboxplay`

**Para atualizar depois:** vá em *Deploys* e arraste a pasta de novo.

**Jeito profissional (recomendado a médio prazo):** suba a pasta para um repositório
no GitHub e conecte na Netlify. Aí toda alteração que você salvar publica sozinha.

---

## 2. Endereço atual do site

O site roda hoje em **https://cineboxplay.netlify.app** e todas as URLs internas
(canonical, Open Graph, JSON-LD, sitemap) já apontam para lá. Funciona normalmente:
indexa no Google, o preview do link aparece no WhatsApp, os rich results funcionam.

Quando comprar o domínio próprio, são 4 arquivos para trocar — veja a seção seguinte.

---

## 3. Conectar seu domínio próprio (quando quiser)

O domínio é **obrigatório** se você quer ranquear no Google. O `.netlify.app` não ranqueia bem.

1. Registre `cineboxplay.com.br` no [registro.br](https://registro.br) (custa cerca de R$ 40/ano)
2. Na Netlify: *Domain management → Add a domain*
3. A Netlify te mostra os servidores DNS. Cole eles no painel do registro.br
4. Espere de 1 a 24 horas. O HTTPS é ativado automaticamente e de graça

**Depois de conectar o domínio, troque o endereço nestes 4 arquivos:**

| Arquivo | O que trocar |
|---|---|
| `index.html` | Todas as ocorrências de `cineboxplay.netlify.app` (canonical, Open Graph e JSON-LD) |
| `sitemap.xml` | A URL da home |
| `robots.txt` | A linha do `Sitemap:` |
| `netlify.toml` | Descomentar o bloco de redirect `sem-www` → `www` |

E no Search Console: crie uma propriedade nova para o domínio, envie o sitemap e use a
ferramenta **Mudança de endereço** para transferir o histórico do netlify.app. A Netlify
cria o 301 automaticamente quando você define o domínio como primário — que é justamente
o que essa ferramenta exige para funcionar.

---

## 3. O que você PRECISA revisar antes de divulgar

Escrevi a página com os números que são padrão no mercado. **Confira se cada um bate com o
seu servidor de verdade** — promessa que não se cumpre vira pedido de reembolso e reclamação.

| Onde | O que conferir |
|---|---|
| Barra de números e planos | `+18.000 canais` e `+65.000 filmes e séries` |
| Barra de números | `99,9% de estabilidade` |
| Seção de garantia | Garantia de **7 dias com devolução do dinheiro** — só deixe se você for honrar |
| Teste grátis | Está escrito **6 horas** em toda a página |
| Planos | Formas de pagamento: Pix, cartão e boleto |
| Seção de teste | "Liberação em até 5 minutos" |

### Depoimentos — obrigatório trocar

A seção **"O que dizem nossos clientes"** está com textos marcados `[SUBSTITUIR]`.

Coloque depoimentos **reais** de clientes seus, com autorização. Depoimento inventado
é propaganda enganosa (art. 37 do Código de Defesa do Consumidor) e, se o cliente
descobrir, destrói a confiança que a página inteira tentou construir.

**Dica que converte muito mais:** tire print das mensagens de WhatsApp dos seus clientes
elogiando (borrando o número), salve em `assets/img/` e troque os cards por imagens.
Print de conversa real converte mais que texto digitado.

### Foto da sala — pronta ✅

A seção **"É assim que fica a sua sala"** já está funcionando. A foto foi otimizada:

| Arquivo | Peso | Uso |
|---|---|---|
| ~~`sala-cinebox.png`~~ | 1.938 KB | original — **pode apagar** |
| `sala-cinebox.jpg` | 146 KB | fallback para navegadores antigos |
| `sala-cinebox.webp` | 101 KB | o que quase todo mundo vai carregar |

Redução de **95%**. A página usa `<picture>`, então o navegador escolhe sozinho o formato
mais leve que ele aceita.

**Apague o `sala-cinebox.png`** antes de publicar. Ele não é mais usado e, num deploy
por arrastar-e-soltar, subiria 1,9 MB de peso morto para a Netlify.

Se um dia trocar a foto, salve a nova como `assets/img/sala-original.jpg` e rode:

```bash
npm install sharp && node tratar-foto.js
```

Depois **apague a pasta `node_modules`** — ela não faz parte do site.

O script tem ainda um modo opcional que desfoca as capas de filmes e séries que aparecem
na TV da foto. Vem desligado. Para ligar, troque `DESFOCAR = false` para `true` no topo do arquivo.

### Sobre marcas de terceiros

O texto da página foi escrito de propósito sem citar nenhuma marca de canal, emissora ou
serviço de streaming — mantenha assim nas partes escritas.

Vale saber o motivo: capa de filme, logo de canal e nome de serviço de streaming são
propriedade das produtoras e emissoras. É o motivo mais comum de site desse ramo receber
notificação de remoção, ser desindexado pelo Google ou ser derrubado pela hospedagem.
Se um dia isso acontecer, o caminho é trocar as imagens por versões sem marcas
identificáveis — o script `tratar-foto.js` já faz isso com um toggle.

---

## 4. Como mexer nas coisas mais comuns

### Trocar o número do WhatsApp

Uma linha só, no arquivo `assets/js/main.js`:

```js
const WHATSAPP = '5512907926732';   // 55 + DDD + número, tudo junto
```

Isso atualiza **todos os 17 botões da página** de uma vez, cada um com a mensagem
pré-escrita certa (o botão do plano anual já abre falando do plano anual).

O número que está lá agora é o temporário que você me passou: **(12) 90792-6732**.

Troque também no rodapé, em `index.html`, onde aparece escrito para o visitante ler:

```html
<a href="#" class="js-wpp" data-msg="...">WhatsApp: (12) 90792-6732</a>
```

### Trocar preços

Estão na seção `<!-- PLANOS -->` do `index.html`. Cada plano tem 3 lugares para atualizar:

1. `plan__from` — o preço riscado (o "de R$ 60,00")
2. `plan__price` — o preço final
3. `plan__eq` — o valor por mês e a economia
4. `data-msg` do botão — a mensagem que vai para o seu WhatsApp

**E não esqueça do JSON-LD no topo do arquivo**, no bloco `"offers"` — é dele que o Google
tira o preço que aparece no resultado da busca.

### Depois de editar CSS ou JS

Suba o número da versão no final do `index.html` e no `<head>`:

```html
<link rel="stylesheet" href="assets/css/style.css?v=4">
<script src="assets/js/main.js?v=4" defer></script>
```

Troque `v=4` por `v=5`. Sem isso, quem já visitou o site continua vendo a versão antiga
por causa do cache.

---

## 5. SEO — o plano para brigar pelo primeiro lugar

O site já sai na frente do concorrente em **estrutura técnica**. Mas ranquear é uma
maratona: o cariocaoplay está no ar há anos e tem histórico com o Google. Espere de
**3 a 6 meses** para começar a aparecer bem. Não existe atalho.

### O que já está pronto

- Title e meta description com as palavras-chave certas
- H1 único com "melhor IPTV do Brasil" + "teste grátis 6 horas"
- Hierarquia correta de H2 e H3 em toda a página
- **Schema markup JSON-LD** com Organization, WebSite, Product, BreadcrumbList e FAQPage
  — *o concorrente não tem isso*. É o que gera as perguntas expansíveis direto no Google
- 17 perguntas de FAQ, com o schema batendo exatamente com o texto visível
- Guia educativo de ~1.500 palavras sobre IPTV (o Google adora conteúdo que ensina)
- `sitemap.xml` e `robots.txt`
- Cabeçalhos de cache e segurança no `netlify.toml` (Core Web Vitals)
- Imagem de compartilhamento em PNG 1200×630 para o link ficar bonito no WhatsApp

### O que você precisa fazer (por ordem de impacto)

1. **Google Search Console** — [search.google.com/search-console](https://search.google.com/search-console).
   Cadastre o site, envie o `sitemap.xml` e peça indexação da home. Faça isso **no primeiro dia**.
2. **Teste o schema** em [search.google.com/test/rich-results](https://search.google.com/test/rich-results).
   Cole a URL do site e confirme que o FAQ aparece.
3. **Google Analytics ou Meta Pixel** — sem medir, você não sabe qual rede traz cliente.
4. **Link nas 3 bios** (TikTok, YouTube, Instagram). Link de rede social ajuda o Google
   a descobrir o site rápido.

> **Arquivo de verificação:** o `google411160a00b6b0b56.html` na raiz é o que mantém
> o site verificado no Search Console. **Nunca apague** e sempre inclua nos deploys —
> se ele sumir, você perde o acesso à propriedade e precisa verificar tudo de novo.
5. **Blog** — é aqui que a briga é ganha de verdade. O concorrente ranqueia porque tem
   artigos. Sugestões de pauta, cada uma vira uma página nova:
   - "Qual a melhor IPTV do Brasil em 2026? Guia completo"
   - "Como instalar IPTV na Smart TV Samsung passo a passo"
   - "Como instalar IPTV na Smart TV LG passo a passo"
   - "IPTV está travando? 7 causas e como resolver"
   - "IPTV ou TV por assinatura: qual compensa mais?"
   - "Melhores aplicativos de IPTV para Android e Fire Stick"
   - "Quanto de internet preciso para assistir IPTV em 4K?"

   Me chama quando quiser que eu escreva e monte essas páginas.

### Palavras-chave que a página está mirando

`melhor iptv` · `melhor iptv do brasil` · `teste iptv grátis` ·
`teste iptv grátis 6 horas` · `melhor lista iptv` · `iptv 2026` · `iptv 4k` ·
`iptv que não trava` · `iptv para smart tv` · `iptv barato` · `assinar iptv`

---

## 6. Links prontos para a bio das redes sociais

Estes atalhos já estão configurados no `netlify.toml`:

- `cineboxplay.com.br` — página inteira
- `cineboxplay.com.br/teste` — vai direto na seção do teste grátis
- `cineboxplay.com.br/planos` — vai direto nos preços

Para o funil que vem dos seus cortes de filme, use o `/teste`: a pessoa clicou querendo
assistir o filme, então quanto menos ela rolar até o botão, melhor converte.

---

## 7. Estrutura dos arquivos

```
SITE DE IPTV P2PLUS/
├── index.html              # a página inteira
├── google411160a...html    # ⚠️ verificação do Search Console — NUNCA APAGUE
├── netlify.toml            # cache, segurança e redirects
├── robots.txt              # instruções para o Google
├── sitemap.xml             # mapa do site
├── tratar-foto.js          # otimiza a foto da sala (não vai para o ar)
├── LEIA-ME.md              # este guia
└── assets/
    ├── css/style.css       # todo o visual
    ├── js/main.js          # WhatsApp, menu, FAQ, animações
    └── img/
        ├── favicon.svg         # ícone da aba
        ├── icon-32/180/512.png # ícones em PNG
        ├── logo.svg            # logo
        ├── og-image.svg        # fonte editável da imagem de compartilhamento
        ├── og-image.png        # a que o WhatsApp e o Google usam (1200×630)
        ├── sala-cinebox.webp   # foto da sala — versão leve (101 KB)
        ├── sala-cinebox.jpg    # foto da sala — fallback (146 KB)
        ├── tela-tv.webp/.jpg      # recorte usado dentro da TV do topo
        ├── tela-celular.webp/.jpg # recorte usado dentro do celular do topo
        └── sala-cinebox.png       # ⚠️ original de 1,9 MB — PODE APAGAR
```

Os recortes da TV e do celular do hero saíram da própria `sala-cinebox.png`. Se um dia
trocar a foto principal, esses dois precisam ser regerados junto — me avisa que eu refaço.

Se editar o `og-image.svg`, precisa gerar o PNG de novo — me avisa que eu converto.

---

## 8. Seções da página, na ordem

1. Barra de anúncio com o teste grátis
2. Menu fixo
3. Hero — H1, promessa principal e CTA (com a tela real dentro da TV)
4. Barra de números com contagem animada
5. Foto "É assim que fica a sua sala"
6. Dores — os 3 problemas de quem paga TV cara
7. Vantagens — os 6 pilares do serviço
8. Teste grátis de 6 horas + como pegar
9. Conteúdo disponível por categoria
10. Aparelhos compatíveis
11. Planos e preços
12. Garantia de 7 dias
13. Como contratar em 3 passos
14. Comparativo: CINEBOX PLAY x TV por assinatura x streamings
15. Depoimentos ⚠️ *trocar pelos reais*
16. Guia educativo "O que é IPTV" (peso de SEO)
17. FAQ com 17 perguntas
18. CTA final
19. Rodapé com links internos
20. Botão flutuante de WhatsApp + barra fixa no celular
