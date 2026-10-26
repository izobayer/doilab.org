function projectUrl(domain) { if (domain.startsWith('doilab.org/')) return '/' + domain.slice(11) + '/'; return 'https://' + domain + (domain === 'journal.bhabanagarafoundation.org' ? '/index.php/BIJBS' : ''); }
const projects = [
  ['University of Dhaka', 'Department of Persian Language and Literature · Academic website', 'persian.du.ac.bd'],
  ['Nazrul Research Centre', 'Digital archive · University of Dhaka', 'doilab.org/nazrul-kendra'],
  ['Nazrul Research Journal', 'Research journal · University of Dhaka', 'doilab.org/nazrul'],
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


const screenshotDomains = ['persian.du.ac.bd','doilab.org/nazrul-kendra','doilab.org/nazrul','journal.bhabanagarafoundation.org','journal.banglaacademy.gov.bd','journal.imli.gov.bd','pub.imli.gov.bd','journal.persian.du.ac.bd','journal.lokabhabna.com'];
const galleryProjects = projects.filter(project => screenshotDomains.includes(project[2]));
const gallery = document.getElementById('showcase');
const panel = document.getElementById('showcase-slide');
const segment = () => galleryProjects.map(([name,type,domain]) => `<a class="continuous-project" href="${projectUrl(domain)}" target="_blank" rel="noopener noreferrer"><div class="continuous-project-title"><strong>${name}</strong><span>${type}</span></div><img src="assets/projects/${domain.replaceAll('/', '-')}-full.jpg" width="1440" alt="${name} — ${type}"></a>`).join('');
panel.innerHTML = `<div class="continuous-window" tabindex="0" aria-label="Continuously scrolling website gallery"><div class="continuous-track"><div class="continuous-segment">${segment()}</div><div class="continuous-segment" aria-hidden="true" inert>${segment()}</div></div></div>`;
const track = panel.querySelector('.continuous-track');
const segmentElement = panel.querySelector('.continuous-segment');
function measureGallery() {
  track.style.setProperty('--gallery-distance', `${-segmentElement.getBoundingClientRect().height}px`);
  const cards = Array.from(segmentElement.children);
  track.style.setProperty('--gallery-duration', `${cards.length * 4}s`);
  let offset = 0;
  const frames = ['0% { transform: translateY(0); }'];
  cards.forEach((card, index) => {
    offset += card.getBoundingClientRect().height;
    frames.push(`${(index + 1) / cards.length * 100}% { transform: translateY(${-offset}px); }`);
  });
  let timingStyle = document.getElementById('gallery-timing');
  if (!timingStyle) { timingStyle = document.createElement('style'); timingStyle.id = 'gallery-timing'; document.head.appendChild(timingStyle); }
  timingStyle.textContent = `@keyframes continuous-rise { ${frames.join(' ')} }`;
}
panel.querySelectorAll('img').forEach(image => image.addEventListener('load', measureGallery));
window.addEventListener('resize', measureGallery);
measureGallery();
const pauseButton = document.getElementById('slide-autoplay');
pauseButton.addEventListener('click', () => {
  const paused = gallery.classList.toggle('gallery-paused');
  pauseButton.textContent = paused ? 'Play' : 'Pause';
  pauseButton.setAttribute('aria-label', pauseButton.textContent);
  pauseButton.setAttribute('aria-pressed', String(paused));
});
const languageSwitch = document.querySelector('.language-switch');
languageSwitch.addEventListener('click', () => { languageSwitch.hash = window.location.hash; });
