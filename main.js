// ─── EMAILJS CONFIG ───────────────────────────────────────────
// Replace these three values with your own from emailjs.com
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
// ─────────────────────────────────────────────────────────────

// ─── PAGE NAVIGATION ─────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.mobile-menu button').forEach(b => b.classList.remove('active'));

  document.getElementById('page-' + name).classList.add('active');

  const navBtn = document.getElementById('nav-' + name);
  if (navBtn) navBtn.classList.add('active');

  const mobBtn = document.getElementById('mob-' + name);
  if (mobBtn) mobBtn.classList.add('active');

  closeMenu();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── HAMBURGER MENU ──────────────────────────────────────────
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}

function closeMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

// ─── SCROLL REVEAL & HERO ANIMATION ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Trigger hero entrance before first paint
  requestAnimationFrame(() => {
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('hero-in');
  });

  // Tag elements for scroll reveal
  ['.srv', '.step', '.mission-card', '.about-stat', '.c-detail'].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add('visible');
        io.unobserve(target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
});

// ─── FORM SUBMISSION ─────────────────────────────────────────
async function handleFormSubmit(e) {
  e.preventDefault();

  const form      = e.target;
  const submitBtn = form.querySelector('.form-submit');
  const successMsg = document.getElementById('form-success');

  // Collect checked services into a readable string
  const checkedServices = [
    ...form.querySelectorAll('input[type="checkbox"]:checked')
  ].map(cb => cb.value);

  if (checkedServices.length === 0) {
    alert('Please select at least one service type.');
    return;
  }

  // Build the template params object EmailJS will inject into your template.
  // Variable names here must match the {{variable}} placeholders in your
  // EmailJS template exactly.
  const templateParams = {
    from_name:    form.first_name.value + ' ' + form.last_name.value,
    phone:        form.phone.value,
    email:        form.email.value,
    address:      form.address.value,
    services:     checkedServices.join(', '),
    volume:       form.volume.value       || 'Not specified',
    date:         form.preferred_date.value || 'Not specified',
    time:         form.preferred_time.value || 'Not specified',
    description:  form.description.value  || 'None',
    access_notes: form.access_notes.value || 'None',
  };

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);

    form.reset();
    submitBtn.style.display  = 'none';
    successMsg.style.display = 'block';

  } catch (err) {
    console.error('EmailJS error:', err);
    alert('Something went wrong. Please call us directly for a quote.');
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Submit Service Request →';
  }
}