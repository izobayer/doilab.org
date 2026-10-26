function projectUrl(domain) { if (domain.startsWith('doilab.org/')) return '/' + domain.slice(11) + '/'; return 'https://' + domain + (domain === 'journal.bhabanagarafoundation.org' ? '/index.php/BIJBS' : ''); }
const projects = [
  ['নজরুল গবেষণা কেন্দ্র', 'ডিজিটাল আর্কাইভ · ঢাকা বিশ্ববিদ্যালয়', 'doilab.org/nazrul-kendra'],
  ['নজরুল গবেষণা পত্রিকা', 'গবেষণা পত্রিকা · ঢাকা বিশ্ববিদ্যালয়', 'doilab.org/nazrul'],
  ['ভাবনগর ফাউন্ডেশন', 'ইন্টারন্যাশনাল জার্নাল অব বেঙ্গল স্টাডিজ', 'journal.bhabanagarafoundation.org'],
  ['বাংলা একাডেমি', 'জার্নাল', 'journal.banglaacademy.gov.bd'],
  ['বাংলা একাডেমি', 'প্রকাশনা', 'pub.banglaacademy.gov.bd'],
  ['আন্তর্জাতিক মাতৃভাষা ইনস্টিটিউট', 'জার্নাল', 'journal.imli.gov.bd'],
  ['আন্তর্জাতিক মাতৃভাষা ইনস্টিটিউট', 'প্রকাশনা', 'pub.imli.gov.bd'],
  ['ঢাকা বিশ্ববিদ্যালয়', 'ফারসি ভাষা ও সাহিত্য বিভাগ · জার্নাল', 'journal.persian.du.ac.bd'],
  ['লোকভাবনা', 'জার্নাল', 'journal.lokabhabna.com'],
  ['রবীন্দ্র বিশ্ববিদ্যালয়', 'জার্নাল', 'journal.rub.ac.bd'],
];
const bn = new Intl.NumberFormat('bn-BD', { minimumIntegerDigits: 2 });
document.getElementById('project-list').innerHTML = projects.map(([name, type, domain], i) => `<a class="project-row" href="${projectUrl(domain)}" target="_blank" rel="noopener noreferrer" aria-label="${name} ${type} ওয়েবসাইট (নতুন ট্যাবে খুলবে)"><span class="project-number">${bn.format(i + 1)}</span><span class="project-title">${name}<small>${type}</small></span><span class="project-domain">${domain}</span><span class="project-visit">ওয়েবসাইট দেখুন</span></a>`).join('');
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


const screenshotDomains = ['doilab.org/nazrul-kendra','doilab.org/nazrul','journal.bhabanagarafoundation.org','journal.banglaacademy.gov.bd','journal.imli.gov.bd','pub.imli.gov.bd','journal.persian.du.ac.bd','journal.lokabhabna.com'];
const galleryProjects = projects.filter(project => screenshotDomains.includes(project[2]));
const gallery = document.getElementById('showcase');
const panel = document.getElementById('showcase-slide');
const segment = () => galleryProjects.map(([name,type,domain]) => `<a class="continuous-project" href="${projectUrl(domain)}" target="_blank" rel="noopener noreferrer"><div class="continuous-project-title"><strong>${name}</strong><span>${type}</span></div><img src="assets/projects/${domain.replaceAll('/', '-')}-full.jpg" width="1440" alt="${name} — ${type}"></a>`).join('');
panel.innerHTML = `<div class="continuous-window" tabindex="0" aria-label="একটানা চলমান ওয়েবসাইট গ্যালারি"><div class="continuous-track"><div class="continuous-segment">${segment()}</div><div class="continuous-segment" aria-hidden="true" inert>${segment()}</div></div></div>`;
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
  pauseButton.textContent = paused ? 'চালু করুন' : 'থামান';
  pauseButton.setAttribute('aria-label', pauseButton.textContent);
  pauseButton.setAttribute('aria-pressed', String(paused));
});
const languageSwitch = document.querySelector('.language-switch');
languageSwitch.addEventListener('click', () => { languageSwitch.hash = window.location.hash; });
