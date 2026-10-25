function projectUrl(domain) { return 'https://' + domain + (domain === 'journal.bhabanagarafoundation.org' ? '/index.php/BIJBS' : ''); }
const projects = [
  ['Bhabanagara Foundation', 'International Journal of Bengal Studies', 'journal.bhabanagarafoundation.org'],
  ['Bangla Academy', 'Journal', 'journal.banglaacademy.gov.bd'],
  ['Bangla Academy', 'Publications', 'pub.banglaacademy.gov.bd'],
  ['International Mother Language Institute', 'Journal', 'journal.imli.gov.bd'],
  ['International Mother Language Institute', 'Publications', 'pub.imli.gov.bd'],
  ['University of Dhaka', 'Department of Persian Language and Literature · Journal', 'journal.persian.du.ac.bd'],
  ['Lokabhabna', 'Journal', 'journal.lokabhabna.com'],
  ['Rabindra University', 'Journal', 'journal.rub.ac.bd'],
];
const bn = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 });
document.getElementById('project-list').innerHTML = projects.map(([name, type, domain], i) => `<a class="project-row" href="${projectUrl(domain)}" target="_blank" rel="noopener noreferrer" aria-label="${name} ${type} website (opens in a new tab)"><span class="project-number">${bn.format(i + 1)}</span><span class="project-title">${name}<small>${type}</small></span><span class="project-domain">${domain}</span><span class="project-visit">View website</span></a>`).join('');
const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open menu'); }
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
document.getElementById('brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const institution = form.elements.institution.value.trim();
  const details = form.elements.details.value.trim();
  if (!institution || !details) { document.getElementById('form-status').textContent = 'Please enter your institution name and project details.'; return; }
  const brief = `DOI Lab Bangladesh — Project Brief\n\nInstitution / journal: ${institution}\nService: ${form.elements.service.value}\n\nProject details:\n${details}\n`;
  const url = URL.createObjectURL(new Blob(['\uFEFF', brief], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'doi-lab-project-brief.txt'; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.getElementById('form-status').textContent = 'Your brief is ready. Check your downloads and email it to doilaborg@gmail.com.';
});

// Real website captures; include only screenshots successfully obtained.
const screenshotDomains = ['journal.bhabanagarafoundation.org', 'journal.banglaacademy.gov.bd', 'journal.imli.gov.bd', 'pub.imli.gov.bd', 'journal.persian.du.ac.bd', 'journal.lokabhabna.com'];
const slides = projects.filter(project => screenshotDomains.includes(project[2]));
let activeSlide = 0;
const slidePanel = document.getElementById('showcase-slide');
const dotsPanel = document.getElementById('showcase-dots');
function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  const [name, type, domain] = slides[activeSlide];
  slidePanel.innerHTML = `<figure class="showcase-frame"><div class="browser-bar" aria-hidden="true"><i></i><i></i><i></i><span>${domain}</span></div><a href="${projectUrl(domain)}" target="_blank" rel="noopener noreferrer" aria-label="Visit ${name} ${type} (opens in a new tab)"><div class="website-scroll-window"><img class="website-scroll-image" src="assets/projects/${domain}-full.jpg" width="1440" alt="Homepage screenshot of ${name} — ${type}"></div></a></figure><div class="showcase-meta"><div><h3>${name}</h3><p>${type}</p></div><a href="${projectUrl(domain)}" target="_blank" rel="noopener noreferrer">Visit website</a></div>`;
  prepareScreenshotScroll();
  document.getElementById('slide-count').textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  dotsPanel.querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-current', String(i === activeSlide)));
}
slides.forEach(([name, type], index) => {
  const dot = document.createElement('button'); dot.type = 'button';
  dot.setAttribute('aria-label', `Show ${name} ${type} screenshot`);
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
  gallery.classList.toggle("scroll-paused", autoplayPaused || galleryHovered || document.hidden || gallery.contains(document.activeElement));
  if (autoplayPaused || galleryHovered || document.hidden || gallery.contains(document.activeElement)) return;
  autoplayTimer = setInterval(() => showSlide(activeSlide + 1), 20000);
}
autoplayButton.addEventListener('click', () => {
  autoplayPaused = !autoplayPaused;
  autoplayButton.textContent = autoplayPaused ? 'Play' : 'Pause';
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

function prepareScreenshotScroll() {
  const image = slidePanel.querySelector('.website-scroll-image');
  if (!image) return;
  function measure() {
    const distance = Math.max(0, image.getBoundingClientRect().height - image.parentElement.clientHeight);
    image.style.setProperty('--scroll-distance', `${-distance}px`);
  }
  image.addEventListener('load', measure, { once: true });
  if (image.complete) measure();
}
window.addEventListener('resize', prepareScreenshotScroll);
