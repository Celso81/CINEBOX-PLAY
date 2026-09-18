/* ============================================================
   CINEBOX PLAY — Melhor IPTV do Brasil
   Script principal
   ------------------------------------------------------------
   ⚠️ PARA TROCAR O NÚMERO DO WHATSAPP, MUDE APENAS A LINHA ABAIXO.
      Formato: 55 + DDD + número, tudo junto e sem símbolos.
============================================================ */

const WHATSAPP = '5512907926732';   // (12) 90792-6732

const MSG_PADRAO = 'Olá! Vim pelo site do CINEBOX PLAY e quero o teste grátis de 6 horas.';

/* ------------------------------------------------------------
   1. Monta todos os links de WhatsApp da página
------------------------------------------------------------ */
function montarLinksWhatsapp() {
  document.querySelectorAll('.js-wpp').forEach((el) => {
    const msg = el.dataset.msg || MSG_PADRAO;
    el.setAttribute('href', `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });
}

/* ------------------------------------------------------------
   2. Menu mobile
------------------------------------------------------------ */
function menuMobile() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;

  const fechar = () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', () => {
    const aberto = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(aberto));
  });

  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', fechar));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && fechar());
}

/* ------------------------------------------------------------
   3. Header ganha fundo sólido ao rolar
------------------------------------------------------------ */
function headerScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const atualizar = () => header.classList.toggle('is-stuck', window.scrollY > 30);
  atualizar();
  window.addEventListener('scroll', atualizar, { passive: true });
}

/* ------------------------------------------------------------
   4. Animação de entrada das seções
------------------------------------------------------------ */
function revelarAoRolar() {
  // Só os blocos visuais. Os parágrafos do artigo de SEO ficam de fora
  // de propósito: eram ~40 elementos a mais para observar, com ganho
  // visual nenhum e custo de processamento no celular.
  const alvos = document.querySelectorAll(
    '.pain, .card, .cat, .dev, .plan, .review, .how__step, .turn, .guar, .test__box'
  );
  if (!alvos.length) return;

  // Sem suporte a IntersectionObserver: mostra tudo direto.
  if (!('IntersectionObserver' in window)) return;

  alvos.forEach((el) => el.classList.add('reveal'));

  const obs = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada, i) => {
        if (!entrada.isIntersecting) return;
        setTimeout(() => entrada.target.classList.add('is-in'), i * 60);
        obs.unobserve(entrada.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  alvos.forEach((el) => obs.observe(el));
}

/* ------------------------------------------------------------
   5. Contagem animada dos números da barra de estatísticas
------------------------------------------------------------ */
function animarNumeros() {
  const stats = document.querySelectorAll('[data-count]');
  if (!stats.length || !('IntersectionObserver' in window)) return;

  const formatar = (n) => n.toLocaleString('pt-BR');

  const obs = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;

        const el = entrada.target;
        const alvo = parseInt(el.dataset.count, 10);
        const duracao = 1400;
        let inicio = null;

        const passo = (agora) => {
          if (inicio === null) inicio = agora;
          const p = Math.min((agora - inicio) / duracao, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = formatar(Math.floor(alvo * eased)) + '+';
          if (p < 1) requestAnimationFrame(passo);
        };

        requestAnimationFrame(passo);
        obs.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((el) => obs.observe(el));
}

/* ------------------------------------------------------------
   6. Só uma pergunta do FAQ aberta por vez
------------------------------------------------------------ */
function faqExclusivo() {
  const perguntas = document.querySelectorAll('.faq .q');
  perguntas.forEach((q) => {
    q.addEventListener('toggle', () => {
      if (!q.open) return;
      perguntas.forEach((outra) => outra !== q && (outra.open = false));
    });
  });
}

/* ------------------------------------------------------------
   7. Ano atual no rodapé
------------------------------------------------------------ */
function anoAtual() {
  const el = document.getElementById('ano');
  if (el) el.textContent = new Date().getFullYear();
}

/* ------------------------------------------------------------
   Inicialização
------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  montarLinksWhatsapp();
  menuMobile();
  headerScroll();
  revelarAoRolar();
  animarNumeros();
  faqExclusivo();
  anoAtual();
});
