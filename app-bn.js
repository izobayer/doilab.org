const projects = [
  ['বাংলা একাডেমি', 'জার্নাল', 'journal.banglaacademy.gov.bd'],
  ['বাংলা একাডেমি', 'প্রকাশনা', 'pub.banglaacademy.gov.bd'],
  ['আন্তর্জাতিক মাতৃভাষা ইনস্টিটিউট', 'জার্নাল', 'journal.imli.gov.bd'],
  ['আন্তর্জাতিক মাতৃভাষা ইনস্টিটিউট', 'প্রকাশনা', 'pub.imli.gov.bd'],
  ['ঢাকা বিশ্ববিদ্যালয়', 'ফারসি ভাষা ও সাহিত্য বিভাগ · জার্নাল', 'journal.persian.du.ac.bd'],
  ['লোকভাবনা', 'জার্নাল', 'journal.lokabhabna.com'],
  ['রবীন্দ্র বিশ্ববিদ্যালয়', 'জার্নাল', 'journal.rub.ac.bd'],
];
const bn = new Intl.NumberFormat('bn-BD', { minimumIntegerDigits: 2 });
document.getElementById('project-list').innerHTML = projects.map(([name, type, domain], i) => `<a class="project-row" href="https://${domain}" target="_blank" rel="noopener noreferrer" aria-label="${name} ${type} ওয়েবসাইট (নতুন ট্যাবে খুলবে)"><span class="project-number">${bn.format(i + 1)}</span><span class="project-title">${name}<small>${type}</small></span><span class="project-domain">${domain}</span><span class="project-visit">ওয়েবসাইট দেখুন</span></a>`).join('');
const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'মেনু খুলুন'); }
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
document.getElementById('brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const institution = form.elements.institution.value.trim();
  const details = form.elements.details.value.trim();
  if (!institution || !details) { document.getElementById('form-status').textContent = 'প্রতিষ্ঠানের নাম ও পরিকল্পনা লিখুন।'; return; }
  const brief = `DOI ল্যাব বাংলাদেশ — প্রজেক্ট ব্রিফ\n\nপ্রতিষ্ঠান / জার্নাল: ${institution}\nপ্রয়োজনীয় সেবা: ${form.elements.service.value}\n\nপরিকল্পনা:\n${details}\n`;
  const url = URL.createObjectURL(new Blob(['\uFEFF', brief], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'doi-lab-project-brief.txt'; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.getElementById('form-status').textContent = 'ব্রিফ প্রস্তুত। ডাউনলোড ফোল্ডার থেকে ফাইলটি doilaborg@gmail.com ঠিকানায় ইমেইল করুন।';
});

// Real website captures; include only স্ক্রিনশটs successfully obtained.
const স্ক্রিনশটDomains = ['journal.banglaacademy.gov.bd', 'journal.imli.gov.bd', 'pub.imli.gov.bd', 'journal.persian.du.ac.bd', 'journal.lokabhabna.com'];
const slides = projects.filter(project => স্ক্রিনশটDomains.includes(project[2]));
let activeSlide = 0;
const slidePanel = document.getElementById('showcase-slide');
const dotsPanel = document.getElementById('showcase-dots');
function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  const [name, type, domain] = slides[activeSlide];
  slidePanel.innerHTML = `<figure class="showcase-frame"><div class="browser-bar" aria-hidden="true"><i></i><i></i><i></i><span>${domain}</span></div><a href="https://${domain}" target="_blank" rel="noopener noreferrer" aria-label="ওয়েবসাইট দেখুন: ${name} ${type} (নতুন ট্যাবে খুলবে)"><img src="assets/projects/${domain}.jpg" width="1440" height="1000" alt="হোমপেজের স্ক্রিনশট: ${name} — ${type}"></a></figure><div class="showcase-meta"><div><h3>${name}</h3><p>${type}</p></div><a href="https://${domain}" target="_blank" rel="noopener noreferrer">ওয়েবসাইট দেখুন</a></div>`;
  document.getElementById('slide-count').textContent = `${bn.format(activeSlide + 1)} / ${bn.format(slides.length)}`;
  dotsPanel.querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-current', String(i === activeSlide)));
}
slides.forEach(([name, type], index) => {
  const dot = document.createElement('button'); dot.type = 'button';
  dot.setAttribute('aria-label', `দেখুন: ${name} ${type} স্ক্রিনশট`);
  dot.addEventListener('click', () => showSlide(index)); dotsPanel.appendChild(dot);
});
document.getElementById('slide-prev').addEventListener('click', () => showSlide(activeSlide - 1));
document.getElementById('slide-next').addEventListener('click', () => showSlide(activeSlide + 1));
document.getElementById('showcase').addEventListener('keydown', event => {
  if (event.target.matches('input, textarea, select')) return;
  if (event.key === 'ArrowLeft') { event.preventDefault(); showSlide(activeSlide - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showSlide(activeSlide + 1); }
});
let touchStartX = 0;
slidePanel.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
slidePanel.addEventListener('touchend', event => {
  const difference = touchStartX - event.changedTouches[0].screenX;
  if (Math.abs(difference) > 60) showSlide(activeSlide + (difference > 0 ? 1 : -1));
}, { passive: true });
showSlide(0);

const languageSwitch = document.querySelector(".language-switch");
languageSwitch.addEventListener("click", () => { languageSwitch.hash = window.location.hash; });

// Autoplay pauses during interaction and while the page is hidden.
const autoplayButton = document.getElementById('slide-autoplay');
const gallery = document.getElementById('showcase');
let autoplayPaused = false;
let galleryHovered = false;
let autoplayTimer;
function resetAutoplay() {
  clearInterval(autoplayTimer);
  if (autoplayPaused || galleryHovered || document.hidden || gallery.contains(document.activeElement)) return;
  autoplayTimer = setInterval(() => showSlide(activeSlide + 1), 5000);
}
autoplayButton.addEventListener('click', () => {
  autoplayPaused = !autoplayPaused;
  autoplayButton.textContent = autoplayPaused ? 'চালু করুন' : 'থামান';
  autoplayButton.setAttribute('aria-label', autoplayButton.textContent);
  autoplayButton.setAttribute('aria-pressed', String(autoplayPaused));
  resetAutoplay();
});
gallery.addEventListener('mouseenter', () => { galleryHovered = true; resetAutoplay(); });
gallery.addEventListener('mouseleave', () => { galleryHovered = false; resetAutoplay(); });
gallery.addEventListener('focusin', resetAutoplay);
gallery.addEventListener('focusout', () => setTimeout(resetAutoplay, 0));
gallery.addEventListener('touchstart', () => clearInterval(autoplayTimer), { passive: true });
gallery.addEventListener('touchend', resetAutoplay, { passive: true });
gallery.addEventListener('click', resetAutoplay);
document.addEventListener('visibilitychange', resetAutoplay);
resetAutoplay();
