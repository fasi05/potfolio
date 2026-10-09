document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const menuToggle = document.getElementById('menuToggle');
const mobilePanel = document.getElementById('mobilePanel');
menuToggle.addEventListener('click', () => {
  const isOpen = mobilePanel.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
mobilePanel.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobilePanel.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// =====================================================================
//  GITHUB USERNAME — apna GitHub username yahan likho (e.g. "fasi123").
//  Jab tak khali hai, GitHub button auto-hide rahega.
// =====================================================================
const GITHUB_USER = "";

// =====================================================================
//  NAYA PROJECT PERMANENT ADD KARNE K LIYE: neeche list mein ek block copy karo.
//  1) video ko "videos" folder mein rakho (e.g. videos/shop.mp4)
//  2) poster = video ka pehla frame (optional) e.g. videos/shop.jpg
//  3) github = repo ka naam ("shop") ya poora link
//  4) links = extra buttons [{label, url}]
// =====================================================================
const defaultProjects = [
  {
    name: "Real Estate Website",
    tags: ["React", "Responsive UI", "Vercel"],
    desc: "Property listing website with a clean search-first layout, detailed property pages and a mobile-friendly design for buyers and agents.",
    video: "videos/realestate.mp4",
    poster: "videos/realestate.jpg",
    github: "realestate",
    links: [
      { label: "Live on Vercel", url: "https://vercel.com/fasi-s-projects/realestate", primary: true }
    ],
    fixed: true
  },
  {
    name: "Doctor & Hospital Website",
    tags: ["React", "Appointments", "Vercel"],
    desc: "Hospital and doctor profile website with services, department pages and an easy appointment flow for patients.",
    video: "videos/doctor.mp4",
    poster: "videos/doctor.jpg",
    github: "doctor-hospital",
    links: [
      { label: "Live on Vercel", url: "https://vercel.com/fasi-s-projects/doctor-hospital", primary: true }
    ],
    fixed: true
  },
  {
    name: "Cafe Website",
    tags: ["HTML5", "CSS3", "JavaScript", "Vercel"],
    desc: "Modern cafe website with menu showcase, gallery and contact section, designed to look great on phones and desktops.",
    video: "videos/cafe.mp4",
    poster: "videos/cafe.jpg",
    github: "cafe",
    links: [
      { label: "Live site", url: "https://cafe-five-pi.vercel.app/", primary: true }
    ],
    fixed: true
  }
];

function githubUrl(g){
  if(!g) return "";
  if(/^https?:\/\//i.test(g)) return g;
  return GITHUB_USER ? "https://github.com/" + GITHUB_USER + "/" + g : "";
}
function safeUrl(u){
  return /^https?:\/\//i.test(u || "") ? u : "";
}

const STORAGE_KEY = "devfolio_custom_projects";

function loadCustomProjects(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    console.error("Could not read saved projects:", e);
    return [];
  }
}

function saveCustomProjects(list){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }catch(e){
    console.error("Could not save project:", e);
    alert("Sorry, your project could not be saved in this browser.");
  }
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function videoSources(v){
  // Tries "videos/x.mp4" first, then "x.mp4" in the same folder as this page
  const base = v.split('/').pop();
  const list = v.includes('/') && !/^https?:/i.test(v) ? [v, base] : [v];
  return list.map((src,i) => {
    const last = i === list.length - 1;
    const err = last ? ` onerror="this.closest('.project-media').insertAdjacentHTML('beforeend','<div class=&quot;video-missing&quot;>Video not found. Put ${escapeHtml(base)} next to portfolio.html</div>')"` : '';
    return `<source src="${escapeHtml(src)}" type="video/mp4"${err}>`;
  }).join('');
}

function renderProjects(){
  const grid = document.getElementById('projectsGrid');
  const custom = loadCustomProjects();
  const all = [...defaultProjects, ...custom.map((p,i) => ({...p, customIndex:i}))];

  grid.innerHTML = all.map(p => {
    const gh = githubUrl(p.github);
    const links = [
      ...(p.link ? [{label:"Live link", url:p.link, primary:true}] : []),
      ...(p.links || [])
    ].filter(l => safeUrl(l.url));
    const buttons = links.map(l =>
      `<a class="plink${l.primary ? ' primary' : ''}" href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`
    ).join('') + (gh ? `<a class="plink" href="${escapeHtml(gh)}" target="_blank" rel="noopener">GitHub</a>` : '');

    const media = p.video
      ? `<div class="project-media"><video controls preload="metadata" playsinline ${p.poster ? `poster="${escapeHtml(p.poster)}"` : ''}>${videoSources(p.video)}</video></div>`
      : `<div class="project-thumb">${escapeHtml(p.name.split(' ').slice(0,2).join(' '))}</div>`;

    return `
    <div class="project-card">
      ${media}
      <h3>${escapeHtml(p.name)}</h3>
      <div class="project-tags">
        ${p.tags.map(t => `<span class="ptag">${escapeHtml(t)}</span>`).join('')}
      </div>
      <p class="desc">${escapeHtml(p.desc)}</p>
      ${buttons ? `<div class="project-links">${buttons}</div>` : ''}
      ${p.fixed ? '' : `<div class="project-foot"><button class="remove-btn" onclick="removeProject(${p.customIndex})">Remove</button></div>`}
    </div>`;
  }).join('') + `
    <div class="add-card" onclick="openModal()">
      <div class="add-plus">+</div>
      <div>Add project</div>
    </div>
  `;
}

function removeProject(index){
  const custom = loadCustomProjects();
  custom.splice(index, 1);
  saveCustomProjects(custom);
  renderProjects();
}

function openModal(){
  document.getElementById('overlay').classList.add('open');
}
function closeModal(){
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('pName').value = '';
  document.getElementById('pTags').value = '';
  document.getElementById('pDesc').value = '';
  document.getElementById('pLink').value = '';
  document.getElementById('pGithub').value = '';
  document.getElementById('pVideo').value = '';
}

function saveProject(){
  const name = document.getElementById('pName').value.trim();
  const tagsRaw = document.getElementById('pTags').value.trim();
  const desc = document.getElementById('pDesc').value.trim();
  const link = document.getElementById('pLink').value.trim();
  const github = document.getElementById('pGithub').value.trim();
  const video = document.getElementById('pVideo').value.trim();

  if(!name || !desc){
    alert("Please add at least a project name and description.");
    return;
  }

  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : ["Web Development"];

  const custom = loadCustomProjects();
  custom.push({name, tags, desc, link, github, video, fixed:false});
  saveCustomProjects(custom);
  closeModal();
  renderProjects();
}

document.getElementById('overlay').addEventListener('click', (e) => {
  if(e.target.id === 'overlay') closeModal();
});

renderProjects();
