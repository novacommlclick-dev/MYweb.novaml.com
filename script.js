// --- Feedback section (localStorage, no backend) ---
const fbForm = document.getElementById('feedback-form');
const fbList = document.getElementById('feedback-list');
const fbFeedback = document.getElementById('fb-feedback');

function loadFeedbacks() {
  let feedbacks = [];
  try {
    feedbacks = JSON.parse(localStorage.getItem('novacom_feedbacks')||'[]');
  } catch {}
  return Array.isArray(feedbacks) ? feedbacks : [];
}

function saveFeedbacks(feedbacks) {
  localStorage.setItem('novacom_feedbacks', JSON.stringify(feedbacks));
}

function renderFeedbacks() {
  if(!fbList) return; // feedback section not present in HTML
  const feedbacks = loadFeedbacks();
  fbList.innerHTML = '';
  if (!feedbacks.length) {
    fbList.innerHTML = '<p class="muted">Aucun avis pour le moment. Soyez le premier à partager votre expérience !</p>';
    return;
  }
  feedbacks.slice().reverse().forEach(fb => {
    const div = document.createElement('div');
    div.className = 'feedback-item';
    div.innerHTML = `<div class="feedback-meta">${fb.name} — <span>${fb.date}</span></div><div class="feedback-message">${fb.message}</div>`;
    fbList.appendChild(div);
  });
}

fbForm?.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('fb-name').value.trim();
  const phone = document.getElementById('fb-phone').value.trim();
  const message = document.getElementById('fb-message').value.trim();
  if (!name || !message) {
    fbFeedback.textContent = '⚠️ Merci de remplir tous les champs obligatoires.';
    fbFeedback.style.color = 'crimson';
    return;
  }
  const feedbacks = loadFeedbacks();
  feedbacks.push({
    name: name,
    message: message,
    date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
    phone: phone // not displayed
  });
  saveFeedbacks(feedbacks);
  fbFeedback.textContent = '✅ Merci pour votre avis !';
  fbFeedback.style.color = 'green';
  fbForm.reset();
  renderFeedbacks();
});

// Render feedbacks on page load (only if feedback section exists)
if(fbList) renderFeedbacks();
/* Theme toggle with persistence */
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(dark){
  if(dark){
    document.documentElement.classList.add('dark');
    if(themeToggle){ themeToggle.textContent = '☀️'; themeToggle.setAttribute('aria-pressed','true'); }
    localStorage.setItem('nova_theme','dark');
  } else {
    document.documentElement.classList.remove('dark');
    if(themeToggle){ themeToggle.textContent = '🌙'; themeToggle.setAttribute('aria-pressed','false'); }
    localStorage.setItem('nova_theme','light');
  }
}
function toggleTheme(){ applyTheme(!document.documentElement.classList.contains('dark')) }

/* Mobile menu */
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');
menuToggle?.addEventListener('click',()=>{ navbar.classList.toggle('open') });

/* Smooth anchor scroll handled by CSS scroll-behavior, but ensure menu closes on click */
document.querySelectorAll('#navbar a').forEach(a=>{
  a.addEventListener('click',()=>{ navbar.classList.remove('open') });
});

/* Simple typed text in hero */
const typedEl = document.querySelector('.typed');
const phrases = ["Identité visuelle sur‑mesure","Contenus vidéo & motion design","Stratégies digitales performantes"];
let tI=0, tPos=0, deleting=false;
function tick(){
  if(!typedEl) return;
  const full = phrases[tI];
  if(!deleting){
    typedEl.textContent = full.slice(0,tPos+1);
    tPos++;
    if(tPos===full.length){ setTimeout(()=>deleting=true,900); }
  } else {
    typedEl.textContent = full.slice(0,tPos-1);
    tPos--;
    if(tPos===0){ deleting=false; tI=(tI+1)%phrases.length }
  }
  setTimeout(tick, deleting?60:90);
}

/* Reveal on scroll */
let reveals = document.querySelectorAll('[data-reveal]');
function onScrollReveal(){
  if(!reveals || reveals.length===0) reveals = document.querySelectorAll('[data-reveal]');
  reveals.forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 60) el.classList.add('revealed');
  })
}

/* Lightbox */
function openLightbox(img){
  const lb = document.getElementById('lightbox');
  const lbimg = document.getElementById('lightbox-img');
  if(!lb||!lbimg) return;
  lbimg.src = img.src;
  const cap = document.getElementById('lightbox-caption');
  if(cap) cap.textContent = img.dataset.caption || img.alt || '';
  lb.setAttribute('aria-hidden','false');
  lb.style.display = 'flex';
}
function closeLightbox(){
  const lb = document.getElementById('lightbox');
  if(!lb) return;
  const cap = document.getElementById('lightbox-caption');
  if(cap) cap.textContent = '';
  lb.setAttribute('aria-hidden','true');
  lb.style.display = 'none';
}
document.getElementById('lb-close')?.addEventListener('click',closeLightbox);
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeLightbox() });

/* Testimonials slider */
const slider = document.getElementById('testimonial-slider');
let slideIndex=0, slideTimer=null;
function showSlide(i){
  if(!slider) return;
  const slides = slider.querySelectorAll('.slide');
  if(!slides.length) return;
  slideIndex = (i+slides.length)%slides.length;
  slider.style.transform = `translateX(-${slideIndex*100}%)`;
}
function startSlides(){ slideTimer = setInterval(()=>showSlide(slideIndex+1),4000) }
function stopSlides(){ clearInterval(slideTimer) }
document.querySelector('.t-prev')?.addEventListener('click',()=>{ stopSlides(); showSlide(slideIndex-1); startSlides(); });
document.querySelector('.t-next')?.addEventListener('click',()=>{ stopSlides(); showSlide(slideIndex+1); startSlides(); });

/* Back to top */
const backTop = document.getElementById('back-to-top');
window.addEventListener('scroll',()=>{
  if(window.scrollY>300) backTop.style.display='block'; else backTop.style.display='none';
  onScrollReveal();
});
backTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* Form behaviour: build mailto link (no backend) */
const form = document.getElementById('contact-form');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const feedback = document.getElementById('form-feedback');

  if (!name || !email || !message) {
    feedback.textContent = '⚠️ Veuillez remplir tous les champs.';
    feedback.style.color = 'crimson';
    return;
  }

  // Build a mailto: link so the user's mail client opens (static-only, no backend)
  const to = "novacomml.click@gmail.com";
  const subject = encodeURIComponent(`Demande de contact — ${name}`);
  const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

  // Try to open the mail client
  window.location.href = mailto;
  feedback.textContent = "✨ Votre client mail devrait s'ouvrir. Si rien ne se passe, copiez l'email: contact@novacom.example";
  feedback.style.color = 'var(--muted)';
  form.reset();
});

/* copy-to-clipboard fallback removed per request */

/* Initialization */
function initSite(){
  // theme
  const preferred = localStorage.getItem('nova_theme');
  applyTheme(preferred==='dark');
  // typed
  tick();
  // testimonials layout: wrap slides
  if(slider){
    const slides = Array.from(slider.children);
    const inner = document.createElement('div'); inner.className='slider-inner';
    slides.forEach(s=>inner.appendChild(s));
    slider.appendChild(inner);
    slider.style.width='100%';
    showSlide(0); startSlides();
  }
  // reveal on load
  onScrollReveal();
  // Safety fallback: if some items remain hidden (below threshold or JS race), reveal them after a short delay so content is always visible
  setTimeout(()=>{
    reveals = document.querySelectorAll('[data-reveal]');
    reveals.forEach(el=>el.classList.add('revealed'))
  }, 700);
  // Add lightbox handlers to gallery images and copy captions to data attributes (safe)
  document.querySelectorAll('.gallery img').forEach(img=>{
    const cap = img.closest('figure')?.querySelector('figcaption');
    if(cap) img.dataset.caption = cap.textContent.trim();
    img.addEventListener('click', ()=> openLightbox(img));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  // DOM already ready — run initialization immediately
  initSite();
}

