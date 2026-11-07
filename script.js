// tanggal ultah
const TARGET = new Date(2026, 10, 10, 0, 0, 0);
const GERAK_KURANG = matchMedia("(prefers-reduced-motion: reduce)").matches;
const HP = matchMedia("(max-width: 600px)").matches;     // layar kecil
const SENTUH = matchMedia("(hover: none)").matches;      // layar sentuh

const BONEKA = ["🧸","🐰","🐻","🐼","🐥","🐱","🐶","🦄","🐹","🐷","🐨","🦊","🐸","🐮"];
const WARNA_KONFETI = ["#ff5c8a","#ffd54f","#7fd6ff","#b8f28b","#ffa6c5","#c9a7ff"];

// fungsi kecil2 biar nggak ngetik berulang
const acak = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => min + Math.random() * (max - min);

function buat({ tag = "span", kelas = "", teks = "", style = {}, vars = {}, induk = document.body, ttl = 1500 }) {
  const el = document.createElement(tag);
  el.className = kelas;
  if (teks) el.textContent = teks;
  Object.assign(el.style, style);
  for (const k in vars) el.style.setProperty(k, vars[k]);
  induk.appendChild(el);
  if (ttl) setTimeout(() => el.remove(), ttl);
  return el;
}

// biar animasi bisa diulang terus
function ulangi(el, kelas) {
  el.classList.remove(kelas);
  void el.offsetWidth;
  el.classList.add(kelas);
}

function titik(e, el) {
  if (e.clientX || e.clientY) return { x: e.clientX, y: e.clientY };
  const b = el.getBoundingClientRect();
  return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
}


/* ===== emoji melayang di background ===== */
const floaties = document.getElementById("floaties");
const ICONS = ["🩷","🎀","⭐","🎈","🍓","✨","🧁","🧸","🐰"];

setInterval(function () {
  buat({
    induk: floaties,
    teks: acak(ICONS),
    style: { left: rand(0, 100) + "vw", fontSize: rand(16, 44) + "px", animationDuration: rand(6, 12) + "s" },
    ttl: 12000
  });
}, 450);


/* ===== konfeti sama burst ===== */
function confetti(x, y, n = 40) {
  if (HP) n = Math.round(n * 0.6);   // di hp dikurangi biar nggak berat
  for (let i = 0; i < n; i++) {
    buat({
      tag: "i",
      kelas: "confetti",
      style: { left: x + "px", top: y + "px", background: WARNA_KONFETI[i % WARNA_KONFETI.length], borderRadius: i % 2 ? "50%" : "3px" },
      vars: { "--x": rand(-260, 260) + "px", "--y": rand(-200, 220) + "px" },
      ttl: 1900
    });
  }
}

function burst(x, y, list, n = 10) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = rand(70, 200);
    buat({
      kelas: "burst",
      teks: list[i % list.length],
      style: { left: x + "px", top: y + "px", fontSize: rand(18, 36) + "px" },
      vars: { "--x": Math.cos(a) * d + "px", "--y": Math.sin(a) * d - 40 + "px", "--r": rand(-180, 180) + "deg" },
      ttl: 1300
    });
  }
}


/* ===== foto utama (cubit pipi) ===== */
const loopy = document.getElementById("loopy");
const stage = document.getElementById("stage");
const wrap = document.querySelector(".loopy-wrap");
const gambarLoopy = loopy.querySelector("img, .foto-utama");   // bisa img, bisa kotak kosong
const cubitEl = loopy.querySelector(".cubit");

const ucapan = [
  "Aduh pipiku dicubit! 🥺", "Aww sakit ih~ 😣", "Gemes ya? hehe 🤭",
  "Jangan dicubit terus dong 🙈", "Pipiku melar nanti~ 🥹", "Hmph! Tapi boleh deh 😚"
];
const emojiGemas = ["🩷","💗","🌸","✨"];
const kataIdle = [
  "pencet aku lagi dongg! 🩷", "ayo kita main~ 🎀", "aku nungguin kamu lho 🥹",
  "cubit pipiku 🤏", "hehe aku lucu ya? 😚"
];

var idleAt = Date.now();

function cubit() {
  ulangi(cubitEl, "aksi");
  ulangi(gambarLoopy, "kena");

  setTimeout(function () {
    const b = cubitEl.getBoundingClientRect();
    burst(b.left, b.top, emojiGemas, 5);
    naik(emojiGemas, 4);
  }, 650);
}

function naik(daftar, jumlah) {
  for (let i = 0; i < jumlah; i++) {
    setTimeout(() => {
      buat({
        induk: wrap,
        kelas: "emoji-naik",
        teks: daftar[i % daftar.length],
        style: { left: rand(10, 90) + "%", fontSize: rand(20, 38) + "px" },
        vars: { "--geser": rand(-40, 40) + "px" },
        ttl: 1800
      });
    }, i * 120);
  }
}

function jatuh(daftar, jumlah) {
  for (let i = 0; i < jumlah; i++) {
    setTimeout(() => {
      buat({
        kelas: "emoji-jatuh",
        teks: daftar[i % daftar.length],
        style: { left: rand(0, 95) + "vw", fontSize: rand(20, 40) + "px" },
        vars: { "--putar": rand(-200, 200) + "deg" },
        ttl: 2700
      });
    }, i * 100);
  }
}

let klik = 0;
loopy.addEventListener("click", function (e) {
  const p = titik(e, loopy);
  klik++;
  idleAt = Date.now();
  cubit();

  // tiap 7x klik ada combo
  if (klik % 7 === 0) {
    setTimeout(() => {
      confetti(p.x, p.y, 80);
      jatuh(BONEKA, 16);
    }, 900);
  }
});

// efek miring ngikutin kursor
wrap.addEventListener("pointermove", (e) => {
  if (SENTUH) return;   // di hp nggak usah miring2, biar scroll tetap mulus
  const b = wrap.getBoundingClientRect();
  const px = (e.clientX - b.left) / b.width - 0.5;
  const py = (e.clientY - b.top) / b.height - 0.5;
  gambarLoopy.style.transform = "perspective(600px) rotateY(" + px * 18 + "deg) rotateX(" + -py * 18 + "deg)";
});
wrap.addEventListener("pointerleave", () => { gambarLoopy.style.transform = ""; });

setInterval(() => {
  if (Date.now() - idleAt > 6000) { cubit(); idleAt = Date.now(); }
}, 7000);


/* ===== hitung mundur ===== */
const cdNote = document.getElementById("cdNote");

function tick() {
  const diff = TARGET - new Date();
  if (diff <= 0) {
    document.getElementById("countdown").style.display = "none";
    cdNote.textContent = "🎉 HARI INI HARI SPESIALMU! 🎉";
    return;
  }
  document.getElementById("d").textContent = Math.floor(diff / 864e5);
  document.getElementById("h").textContent = Math.floor(diff / 36e5) % 24;
  document.getElementById("m").textContent = Math.floor(diff / 6e4) % 60;
  document.getElementById("s").textContent = Math.floor(diff / 1e3) % 60;
}
tick();
setInterval(tick, 1000);


/* ===== galeri foto ===== */
const photosBox = document.getElementById("photos");

const io2 = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("show"); io2.unobserve(e.target); }
}), { threshold: 0.12 });

photosBox.querySelectorAll(".pic").forEach(function (p, i) {
  p.style.transitionDelay = (i % 4) * 90 + "ms";
  io2.observe(p);
});

photosBox.addEventListener("click", (e) => {
  const p = e.target.closest(".pic");
  if (!p) return;
  ulangi(p, "pop");
  burst(e.clientX, e.clientY, ["🩷","📸","✨"], 8);
  confetti(e.clientX, e.clientY, 20);
  buat({ kelas: "doll-pop", teks: acak(BONEKA), style: { left: e.clientX + "px", top: e.clientY + "px" }, ttl: 1300 });
});


/* ===== geng boneka ===== */
const dollRow = document.getElementById("dollRow");
const dollSay = document.getElementById("dollSay");

const geng = {
  teddy:  ["Teddy sayang cipaa! 🧸", "Peluk Teddy dulu dong~ 🤗", "Teddy lembut kayak awan ☁️"],
  bunny:  ["Hop hop hop! 🐰", "Bunny mau wortel, eh mau kue! 🥕", "Telinga Bunny goyang-goyang~ 🎀"],
  bruno:  ["Grrr... lucu kan? 🐻", "Bruno ngantuk, mau tidur dulu 😴", "Bruno jago peluk lho! 🤗"],
  pandi:  ["Pandi guling-guling~ 🐼", "Pandi suka bambu sama kamu 🎋", "Ngunyah-ngunyah, hehe 😋"],
  piyo:   ["Piyo piyo! 🐥", "Cuit cuit selamat ulang tahun! 🎂", "Piyo kecil tapi sayang banget 🩷"],
  meong:  ["Meow~ pencet lagi dong 🐱", "Meong minta dielus 😽", "Meong lompat ke kue! 🎂"],
  uni:    ["Uni bisa terbang ke bintang ✨", "Pelangi buat cipaa 🌈", "Wish dari Uni udah dikirim 🦄"],
  hamtar: ["Pipi Hamtar penuh biji 🐹", "Hamtar muter-muter di roda~ 🎡", "Hamtar gemas, kamu lebih gemas 🩷"]
};

const GENG_REAKSI = ["r-lompat","r-salto","r-muter","r-peluk","r-kaget","r-joget","r-malu","r-cium"];
let gengKlik = 0, reaksiTerakhir = "";

dollRow.addEventListener("click", function (e) {
  const d = e.target.closest(".doll");
  if (!d) return;
  gengKlik++;

  // pilih reaksi, jangan sama kayak yang tadi
  let r;
  do { r = acak(GENG_REAKSI); } while (r === reaksiTerakhir);
  reaksiTerakhir = r;

  GENG_REAKSI.forEach((c) => d.classList.remove(c));
  void d.offsetWidth;
  d.classList.add(r);

  const emoji = d.querySelector(".b").textContent;
  const p = titik(e, d);
  burst(p.x, p.y, ["🩷", emoji, "✨"], 8);
  confetti(p.x, p.y, 15);

  if (gengKlik % 8 === 0) {
    dollSay.textContent = "Geng boneka kumpul! Selamat ulang tahun cipaa! 🎉";
    jatuh(BONEKA, 18);
  } else {
    dollSay.textContent = acak(geng[d.dataset.id]);
  }
  ulangi(dollSay, "say-pop");
});

dollRow.addEventListener("animationend", (e) => {
  if (e.target.classList.contains("doll")) GENG_REAKSI.forEach((c) => e.target.classList.remove(c));
});

// boneka main sendiri
(function () {
  const boneka = [...document.querySelectorAll(".doll")];
  const KELAS = ["g-manja","g-kecup","g-pegas","g-pusing","g-intip"];
  const celoteh = [
    "Hihi boneka lagi main sendiri~ 🧸", "Gemes-gemes bareng! 🩷",
    "Ada yang kangen dipencet nih 🥹", "Boneka sayang cipaa! 🎀"
  ];

  function acakLucu() {
    const d = acak(boneka);
    const k = acak(KELAS);
    KELAS.forEach((c) => d.classList.remove(c));
    void d.offsetWidth;
    d.classList.add(k);
    setTimeout(() => d.classList.remove(k), 1600);

    const b = d.getBoundingClientRect();
    burst(b.left + b.width / 2, b.top + b.height / 2, ["🩷","✨", d.querySelector(".b").textContent], 5);

    if (Math.random() < 0.3) { dollSay.textContent = acak(celoteh); ulangi(dollSay, "say-pop"); }
  }

  if (!GERAK_KURANG) setInterval(acakLucu, 2800);
})();


/* ===== kue + lilin ===== */
const btn = document.getElementById("tiup");
const wish = document.getElementById("wish");
const bonekaKue = document.querySelectorAll(".cake-doll");

function soraki() {
  bonekaKue.forEach((d) => ulangi(d, "cheer"));
  setTimeout(() => bonekaKue.forEach((d) => d.classList.remove("cheer")), 2700);
}

btn.addEventListener("click", function () {
  const candles = document.querySelectorAll(".candle");
  const alive = [...candles].filter((c) => !c.classList.contains("off"));

  // kalau semua udah mati, nyalain lagi
  if (!alive.length) {
    candles.forEach((c) => c.classList.remove("off"));
    wish.textContent = "";
    btn.textContent = "Tiup lilin 💨";
    return;
  }

  alive.forEach((c, i) => setTimeout(() => c.classList.add("off"), i * 250));

  setTimeout(() => {
    const r = btn.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top, 80);
    jatuh(BONEKA, 12);
    soraki();
    wish.textContent = "Make a wish! Semoga terkabul semua 🌟";
    btn.textContent = "Nyalakan lagi 🔥";
  }, alive.length * 250 + 100);
});


/* ===== kartu doa muncul pas di-scroll ===== */
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
}), { threshold: 0.2 });

document.querySelectorAll(".reveal").forEach((c, i) => {
  c.style.transitionDelay = i * 90 + "ms";
  io.observe(c);
});


/* ===== parade, ngintip, balon, pesawat ===== */
function paradeJalan() {
  const kanan = Math.random() < 0.5;
  const jumlah = 2 + Math.floor(Math.random() * 3);
  const durasi = rand(11, 16);

  for (let i = 0; i < jumlah; i++) {
    const w = buat({
      kelas: "walker " + (kanan ? "ke-kanan" : "ke-kiri"),
      style: { animationDuration: durasi + "s", animationDelay: i * 1.1 + "s", bottom: rand(2, 14) + "px" },
      ttl: (durasi + i * 1.1) * 1000 + 300
    });
    const hop = document.createElement("span");
    hop.className = "hop";
    hop.textContent = acak(BONEKA);
    hop.style.animationDelay = -Math.random() * 0.5 + "s";
    w.appendChild(hop);
  }
}

function intip() {
  const sisi = acak(["kiri","kanan","bawah"]);
  const style = sisi === "bawah" ? { left: rand(8, 85) + "%" } : { top: rand(18, 72) + "%" };
  buat({ kelas: "peek " + sisi, teks: acak(BONEKA), style: style, ttl: 4800 });
}

function balonTerbang() {
  const el = buat({ kelas: "flyer", style: { left: rand(5, 88) + "%", animationDuration: rand(9, 13) + "s" }, ttl: 13500 });
  el.innerHTML = '<span class="fl-b">🎈</span><span class="fl-d">' + acak(BONEKA) + "</span>";
}

function pesawatX() {
  const W = innerWidth, H = innerHeight, m = 80;
  const rotKanan = Math.atan2(H + 2 * m, W + 2 * m) * 180 / Math.PI + 45;
  const rotKiri = Math.atan2(H + 2 * m, -(W + 2 * m)) * 180 / Math.PI + 45;

  buat({
    kelas: "pesawat", teks: "✈️", ttl: 6500,
    vars: { "--sx": -m + "px", "--sy": -m + "px", "--ex": W + m + "px", "--ey": H + m + "px", "--rot": rotKanan + "deg" }
  });
  buat({
    kelas: "pesawat", teks: "✈️", ttl: 6500,
    vars: { "--sx": W + m + "px", "--sy": -m + "px", "--ex": -m + "px", "--ey": H + m + "px", "--rot": rotKiri + "deg" }
  });
}


/* ===== boneka pengikut kursor ===== */
const pengikut = document.getElementById("pengikut");
const pengikutBadan = pengikut.firstElementChild;
const pos = { x: 40, y: innerHeight - 70 };
const tujuan = { x: pos.x, y: pos.y };
let hadap = 1, sentuhTerakhir = 0;

function gerakPengikut() {
  const dx = tujuan.x - pos.x, dy = tujuan.y - pos.y;
  pos.x += dx * 0.07;
  pos.y += dy * 0.07;
  pengikut.classList.toggle("jalan", Math.hypot(dx, dy) > 10);
  if (Math.abs(dx) > 6) hadap = dx < 0 ? -1 : 1;
  pengikut.style.transform = "translate3d(" + (pos.x - 20) + "px," + (pos.y - 20) + "px,0) scaleX(" + hadap + ")";
  requestAnimationFrame(gerakPengikut);
}

if (!GERAK_KURANG) {
  ["pointermove", "pointerdown"].forEach((nama) => window.addEventListener(nama, (e) => {
    tujuan.x = e.clientX + 22;
    tujuan.y = e.clientY + 26;
    sentuhTerakhir = Date.now();
    if (nama === "pointerdown") pengikutBadan.textContent = acak(BONEKA);
  }, { passive: true }));

  // kalau lama nggak disentuh, jalan2 sendiri
  setInterval(() => {
    if (Date.now() - sentuhTerakhir > 6000) {
      tujuan.x = rand(40, innerWidth - 60);
      tujuan.y = rand(innerHeight * 0.5, innerHeight - 60);
    }
  }, 5000);
  gerakPengikut();

  setTimeout(intip, 3500);        setInterval(intip, 12000);
  setTimeout(paradeJalan, 5000);  setInterval(paradeJalan, 24000);
  setTimeout(balonTerbang, 8000); setInterval(balonTerbang, 18000);
  setTimeout(pesawatX, 4000);     setInterval(pesawatX, 20000);
}


/* ===== boneka lempar love ===== */
function lemparLove() {
  const r = wrap.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;   // kalau fotonya lagi nggak kelihatan, skip
  const ty = -(wrap.offsetHeight * 0.62 - 57);

  [{ sisi: "kiri", d: 1 }, { sisi: "kanan", d: -1 }].forEach(({ sisi, d }) => {
    buat({ induk: wrap, kelas: "lempar-doll " + sisi, teks: acak(BONEKA), vars: { "--d": d }, ttl: 2500 });

    setTimeout(() => {
      const love = buat({
        induk: wrap, kelas: "lempar-love " + sisi, teks: acak(["🩷","💗","💖"]), ttl: 0,
        vars: { "--tx": -d * 26 + "px", "--ty": ty + "px", "--d": d }
      });

      setTimeout(() => {
        const b = love.getBoundingClientRect();
        const x = b.left + b.width / 2, y = b.top + b.height / 2;
        love.remove();
        burst(x, y, ["🩷","💗","💖","✨"], 12);
        confetti(x, y, 25);
        buat({ induk: wrap, kelas: "ucap-ultah " + sisi, teks: "Selamat\nUlang\nTahun\nCipa 🎉", ttl: 4700 });
      }, 900);
    }, 1100);
  });
}

if (!GERAK_KURANG) {
  setTimeout(lemparLove, 6000);
  setInterval(lemparLove, 18000);
}


/* ===== PETASAN (baru) ===== */
// 2 roket: satu dari kiri, satu dari kanan. naik dari bawah, meledak di atas samping
function petasan() {
  const lebar = innerWidth;
  const tinggi = innerHeight;

  // agak masuk dari tepi layar biar ledakannya nggak kepotong
  const jarakTepi = Math.max(60, lebar * 0.14);
  const sisi = [jarakTepi, lebar - jarakTepi];

  sisi.forEach(function (x, i) {
    const yAkhir = rand(tinggi * 0.18, tinggi * 0.32);
    const warna = acak(WARNA_KONFETI);

    // kanan telat dikit biar kelihatan gantian
    setTimeout(function () {
      buat({
        kelas: "roket",
        style: { left: x + "px", background: warna },
        vars: { "--naik": -(tinggi - yAkhir) + "px" },
        ttl: 1300
      });

      // sampai atas langsung meledak
      setTimeout(function () { meledak(x, yAkhir, warna); }, 1100);
    }, i * 200);
  });

  // tulisannya muncul di tengah atas, pas kedua ledakan udah jalan
  setTimeout(function () {
    buat({
      kelas: "tulisan-petasan",
      teks: "Selamat Ulang Tahun\nCipaaaa! 🎉",
      style: { left: lebar / 2 + "px", top: tinggi * 0.3 + "px" },
      ttl: 3800
    });
  }, 1100 + 200 + 150);
}

function meledak(x, y, warna) {
  const jumlah = HP ? 20 : 30;
  const maxJarak = HP ? 110 : 170;   // di hp lebih kecil biar nggak keluar layar

  for (let i = 0; i < jumlah; i++) {
    const sudut = (i / jumlah) * Math.PI * 2;
    const jarak = rand(maxJarak * 0.5, maxJarak);
    buat({
      kelas: "percik",
      style: {
        left: x + "px",
        top: y + "px",
        background: i % 3 === 0 ? "#fff" : warna
      },
      vars: {
        "--x": Math.cos(sudut) * jarak + "px",
        "--y": Math.sin(sudut) * jarak + "px"
      },
      ttl: 1500
    });
  }

  burst(x, y, ["✨","🩷","⭐"], 6);
  confetti(x, y, 25);
}

// klik tanggal di atas buat nyalain petasan manual
const tanggalTag = document.querySelector(".tag");
tanggalTag.addEventListener("click", petasan);
tanggalTag.style.cursor = "pointer";

if (!GERAK_KURANG) {
  setTimeout(petasan, 2500);
  setInterval(petasan, 14000);
}