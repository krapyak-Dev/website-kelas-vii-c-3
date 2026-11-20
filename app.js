/* Website Kelas VII C — frontend publik */
const $ = (s) => document.querySelector(s);
const hasConfig = window.SUPABASE_URL && !window.SUPABASE_URL.startsWith("PASTE_") &&
  window.SUPABASE_ANON_KEY && !window.SUPABASE_ANON_KEY.startsWith("PASTE_");
const db = hasConfig && window.supabase ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;
const fallback = {
  site_name:"KELAS VII C", tagline:"Bersama, Bertumbuh, Berprestasi",
  hero_title:"Satu Kelas. Banyak Cerita.", hero_description:"Tempat berbagi informasi, karya, dan perjalanan kami dalam belajar dan bertumbuh bersama.",
  hero_eyebrow:"WEBSITE RESMI KELAS", hero_caption:"KELUARGA BESAR VII C",
  about_title:"Belajar bersama, melangkah lebih jauh.", about_text:"Kami adalah keluarga kelas yang tumbuh melalui rasa ingin tahu, kerja sama, dan semangat untuk menjadi lebih baik setiap hari.",
  students:"28", admins:"2", school_year:"2026", academic_intro:"Temukan informasi penting untuk mendukung kegiatan belajar dan kebersamaan.",
  contact_intro:"Kirim pesan kepada administrator kelas melalui formulir berikut.", phone:"", admin_email:"", footer_quote:"Ruang digital untuk berbagi informasi dan cerita kelas.",
  schedule:[{day:"Senin",subjects:"Upacara, Matematika, Bahasa Indonesia"},{day:"Selasa",subjects:"IPA, Bahasa Inggris, PPKn"},{day:"Rabu",subjects:"IPS, Seni Budaya, PJOK"},{day:"Kamis",subjects:"Matematika, Bahasa Indonesia, Informatika"},{day:"Jumat",subjects:"Agama, Prakarya"}],
  duties:[{day:"Senin",group:"Kelompok 1"},{day:"Selasa",group:"Kelompok 2"},{day:"Rabu",group:"Kelompok 3"},{day:"Kamis",group:"Kelompok 4"},{day:"Jumat",group:"Kelompok 5"}],
  agenda:[],news:[],gallery:[]
};
let content = structuredClone(fallback);
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function applyContent(c){
  content={...fallback,...(c||{})};
  const set=(id,val)=>{if($(id)) $(id).textContent=val||""};
  set("#brandName",content.site_name);set("#footerName",content.site_name);set("#copyright",`© ${new Date().getFullYear()} ${content.site_name}`);
  set("#brandSub",content.tagline);set("#heroEyebrow",content.hero_eyebrow);set("#heroTitle",content.hero_title);set("#heroDesc",content.hero_description);set("#heroCaption",content.hero_caption);
  set("#aboutTitle",content.about_title);set("#aboutText",content.about_text);set("#statStudents",content.students);set("#statAdmins",content.admins);set("#statYear",content.school_year);
  set("#academicIntro",content.academic_intro);set("#contactIntro",content.contact_intro);set("#footerQuote",content.footer_quote);
  if(content.hero_image_url) $("#home").style.backgroundImage=`linear-gradient(100deg,#0d2948ed 0%,#153a60b8 48%,#122e4d40),url("${content.hero_image_url}")`;
  set("#callNumber",content.phone||"Nomor belum diatur");set("#adminEmail",content.admin_email||"Email belum diatur");
  $("#callLink").href=content.phone?`tel:${content.phone.replace(/[^\d+]/g,"")}`:"#kontak";
  $("#emailLink").href=content.admin_email?`mailto:${content.admin_email}`:"#kontak";
  renderSchedule();renderDuties();renderAgenda();renderNews();renderGallery();
}
function renderSchedule(){const arr=content.schedule||[];$("#scheduleContent").innerHTML=arr.length?`<table class="data-table"><thead><tr><th>HARI</th><th>MATA PELAJARAN</th></tr></thead><tbody>${arr.map(x=>`<tr><td>${esc(x.day)}</td><td>${esc(x.subjects)}</td></tr>`).join("")}</tbody></table>`:'<p class="empty-state">Jadwal belum ditambahkan administrator.</p>'}
function renderDuties(){const arr=content.duties||[];$("#dutyContent").innerHTML=arr.length?arr.map(x=>`<div class="list-item"><b>${esc(x.day)}</b><small>${esc(x.group)}</small></div>`).join(""):'<p class="empty-state">Jadwal piket belum tersedia.</p>'}
function renderAgenda(){const arr=content.agenda||[];$("#agendaContent").innerHTML=arr.length?arr.map(x=>`<div class="agenda-item"><small>${esc(x.date||"Tanggal menyusul")}</small><b>${esc(x.title)}</b></div>`).join(""):'<p class="empty-state">Belum ada agenda kelas.</p>'}
function renderNews(){const arr=content.news||[];$("#newsGrid").innerHTML=arr.length?arr.slice(0,6).map((x,i)=>`<article class="news-card" data-index="${i}"><img src="${esc(x.image_url||"")}" alt="${esc(x.title)}" onerror="this.style.display='none'"><div class="news-content"><small>${esc(x.date||"KABAR KELAS")}</small><h3>${esc(x.title)}</h3><p>${esc((x.body||"").slice(0,115))}${(x.body||"").length>115?"…":""}</p><span>Baca selengkapnya ↗</span></div></article>`).join(""):'<p class="empty-state">Berita dan pengumuman akan tampil di sini setelah ditambahkan administrator.</p>';
  document.querySelectorAll(".news-card").forEach(card=>card.addEventListener("click",()=>openArticle(content.news[Number(card.dataset.index)])));
}
function renderGallery(){const arr=content.gallery||[];$("#galleryGrid").innerHTML=arr.length?arr.slice(0,8).map(x=>`<img src="${esc(x.image_url||"")}" alt="${esc(x.caption||"Dokumentasi kelas")}" onerror="this.style.display='none'">`).join(""):'<div class="gallery-empty">Foto kegiatan kelas akan ditampilkan di sini.</div>'}
function openArticle(x){if(!x)return;$("#modalImage").src=x.image_url||"";$("#modalImage").style.display=x.image_url?"block":"none";$("#modalDate").textContent=x.date||"KABAR KELAS";$("#modalTitle").textContent=x.title||"";$("#modalBody").textContent=x.body||"";$("#articleModal").classList.add("open");$("#articleModal").setAttribute("aria-hidden","false")}
$("#closeModal").addEventListener("click",()=>$("#articleModal").classList.remove("open"));
$("#articleModal").addEventListener("click",e=>{if(e.target.id==="articleModal")$("#articleModal").classList.remove("open")});
$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));
async function loadSite(){if(!db){applyContent(content);return}try{const {data,error}=await db.from("site_content").select("content").eq("id",1).single();if(error)throw error;applyContent(data?.content||content)}catch(e){console.warn("Konten Supabase belum tersedia:",e.message);applyContent(content)}}
$("#messageForm").addEventListener("submit",async e=>{
  e.preventDefault();const form=e.currentTarget;const status=$("#formStatus");const values=Object.fromEntries(new FormData(form).entries());
  if(!db){status.textContent="Website belum terhubung ke Supabase. Administrator perlu menyelesaikan konfigurasi.";return}
  status.textContent="Mengirim pesan...";
  try{
    const {data,error}=await db.functions.invoke("send-message",{body:values});
    if(error)throw error;
    status.textContent="Pesan berhasil dikirim. Terima kasih!";form.reset();
  }catch(err){console.error(err);status.textContent="Pesan belum terkirim. Silakan coba lagi atau hubungi administrator melalui call center."}
});
loadSite();
