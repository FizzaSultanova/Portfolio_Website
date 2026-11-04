// ===== Certifications list: hide the bottom fade once scrolled to the end =====
document.querySelectorAll('[data-scroll-list]').forEach((list) => {
  const viewport = list.parentElement;
  const update = () => {
    const atEnd = list.scrollTop + list.clientHeight >= list.scrollHeight - 4;
    viewport.classList.toggle('is-end', atEnd);
  };
  list.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
});

// ===== Recognition photo carousel =====
document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('.slide')];
  const prev = carousel.querySelector('[data-prev]');
  const next = carousel.querySelector('[data-next]');
  let index = 0;

  const show = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('is-active', n === index));
    prev.hidden = index === 0;                    // like the design: no "back" arrow on the first photo
    next.hidden = index === slides.length - 1;    // and no "next" arrow on the last one
  };
  prev.addEventListener('click', () => { if (index > 0) show(index - 1); });
  next.addEventListener('click', () => { if (index < slides.length - 1) show(index + 1); });

  // Swipe left/right on touch screens
  const viewport = carousel.querySelector('.carousel__viewport');
  let startX = null;
  viewport.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (dx < -40 && index < slides.length - 1) show(index + 1);
    else if (dx > 40 && index > 0) show(index - 1);
  });
  show(0);
});

// ===== Infrastructure projects slider =====
const track = document.querySelector('[data-track]');
if (track) {
  const prevBtn = document.querySelector('[data-track-prev]');
  const nextBtn = document.querySelector('[data-track-next]');
  const step = () => {
    const card = track.querySelector('.project-card');
    return card ? card.offsetWidth + 18 : 360;
  };
  const update = () => {
    prevBtn.disabled = track.scrollLeft <= 2;
    nextBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  };
  prevBtn.addEventListener('click', () => track.scrollBy({ left: -step() }));
  nextBtn.addEventListener('click', () => track.scrollBy({ left: step() }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// ===== Contact form =====
// The form posts to our own Vercel serverless function (/api/contact), which forwards the
// message to FormSubmit on the server. The recipient address lives in api/contact.js
// (or the CONTACT_EMAIL environment variable in Vercel), not here in the browser.
const CONTACT_ENDPOINT = '/api/contact';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const form = document.querySelector('[data-contact-form]');
if (form) {
  const status = form.querySelector('.contact__status');
  const button = form.querySelector('.btn-send');
  const say = (text, state = 'success') => {
    status.textContent = text;
    status.classList.toggle('is-error', state === 'error');
    status.classList.toggle('is-pending', state === 'pending');
  };

  let sending = false;                                        // blocks duplicate submissions

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    if (form.elements._honey.value) return;                 // a spam bot filled the hidden field

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.message.value.trim();

    // Required-field + email validation (same error style as the other messages)
    if (!name || !email || !message) {
      say('Please fill in your name, email and message.', 'error');
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      say('Please enter a valid email address.', 'error');
      return;
    }

    sending = true;
    button.disabled = true;
    say('Sending…', 'pending');
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message, _honey: form.elements._honey.value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success !== true) throw new Error(data.message || res.statusText);
      form.reset();
      say('Thank you! Your message has been sent.');      // shown in green
    } catch (err) {
      say('Sorry, the message could not be sent. Please try again, or email kami206@gmail.com directly.', 'error');
      console.error('Contact form error:', err);
    } finally {
      sending = false;
      button.disabled = false;
    }
  });
}

// ===== "What I'm Building" slides (Blisko ↔ Teaching AI in the UAE) =====
const ventures = [...document.querySelectorAll('[data-venture]')];
document.querySelectorAll('[data-venture-go]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = Number(btn.dataset.ventureGo);
    ventures.forEach((v, i) => { v.hidden = i !== target; });
    ventures[target].style.animation = 'none';           // replay the fade-in
    void ventures[target].offsetWidth;
    ventures[target].style.animation = '';
    ventures[target].querySelector('[data-venture-go]').focus({ preventScroll: true });
  });
});

// ===== Project cards: flip to show technical details =====
document.querySelectorAll('[data-flip]').forEach((card) => {
  const front = card.querySelector('.project-card__front');
  const back = card.querySelector('.project-card__back');
  const flip = (showBack) => {
    card.classList.toggle('is-flipped', showBack);
    back.inert = !showBack;  back.setAttribute('aria-hidden', String(!showBack));
    front.inert = showBack;  front.setAttribute('aria-hidden', String(showBack));
    (showBack ? back.querySelector('[data-flip-close]') : front.querySelector('[data-flip-open]'))
      .focus({ preventScroll: true });
  };
  card.querySelector('[data-flip-open]').addEventListener('click', () => flip(true));
  card.querySelector('[data-flip-close]').addEventListener('click', () => flip(false));
});