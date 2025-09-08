// Basit oyun durumu
const state = {
  count: 0,
  players: [],         // {name, role, word}
  similarWord: "",
  differentWord: "",
  oddIndex: -1,        // farklı kelimeyi alan
  revealIndex: 0,
  countdownId: null,
  countdownRemaining: 0,
  activeVoterIndex: 0,
  votes: {}, // {playerIndex: count}
  // Rounds & scoring
  totalRounds: 5,
  currentRound: 1,
  scores: {} // {playerName: number}
};

// Örnek kelime çiftleri (benzer – farklı)
// Kullanıcı tarafından sağlanan güncel liste
const WORD_PAIRS = [
  // ROL & İNSANLAR
  { similar: "Öğretmen", different: "Öğrenci" },
  { similar: "Doktor", different: "Eczacı" },
  { similar: "Hakim", different: "Avukat" },
  { similar: "Polis", different: "İtfaiyeci" },
  { similar: "Mühendis", different: "Kaynakçı" },
  { similar: "Aşçı", different: "Garson" },
  { similar: "Yazar", different: "Matbaa" },
  { similar: "Mimar", different: "İnşaat Ustası" },
  { similar: "Pilot", different: "Kabin Görevlisi" },
  { similar: "Şoför", different: "Tamirci" },
  { similar: "Futbolcu", different: "Teknik Direktör" },
  { similar: "Kaleci", different: "Forvet" },
  { similar: "Sunucu", different: "Muhabir" },
  { similar: "Oyuncu", different: "Yönetmen" },
  { similar: "Yayıncı", different: "Şarkıcı" },
  { similar: "Hakem", different: "Seyirci" },
  { similar: "İş İnsanı", different: "Yatırımcı" },
  { similar: "Astronot", different: "Uzaylı" },

  // OKUL & KAMPÜS
  { similar: "Sınıf", different: "Laboratuvar" },
  { similar: "Kütüphane", different: "Sinema Salonu" },
  { similar: "Beyaz Tahta", different: "Projeksiyon" },
  { similar: "Ders Programı", different: "Sınav Takvimi" },
  { similar: "Kalemlik", different: "Beslenme Çantası" },

  // SPOR & OYUN
  { similar: "Futbol", different: "Voleybol" },
  { similar: "Basketbol", different: "Bowling" },
  { similar: "Tenis", different: "Bilardo" },
  { similar: "Kayak", different: "Snowboard" },
  { similar: "Satranç", different: "Tavla" },
  { similar: "Okçuluk", different: "Dart" },
  { similar: "Masa Tenisi", different: "Pişti" },

  // HAYVANLAR
  { similar: "Tavşan", different: "Kanguru" },
  { similar: "Kedi", different: "Fare" },
  { similar: "Köpek", different: "Çakal" },
  { similar: "Aslan", different: "Jaguar" },
  { similar: "Penguen", different: "Martı" },
  { similar: "Baykuş", different: "Şahin" },
  { similar: "Yunus", different: "Köpek Balığı" },
  { similar: "Zürafa", different: "Deve" },

  // YİYECEK & İÇECEK
  { similar: "Menemen", different: "Omlet" },
  { similar: "Simit", different: "Poğaça" },
  { similar: "Lahmacun", different: "Pizza" },
  { similar: "Pilav", different: "Makarna" },
  { similar: "Mantı", different: "Ravioli" },
  { similar: "Waffle", different: "Fırın Patates" },
  { similar: "Kuru Fasulye", different: "Nohut" },
  { similar: "Baklava", different: "Dubai Cikolatası" },
  { similar: "Kelle Paça Çorbası", different: "Ezogelin Çorbası" },
  { similar: "Ayran", different: "Limonata" },

  // ULAŞIM & ARAÇLAR
  { similar: "Otobüs", different: "Tren" },
  { similar: "Taksi", different: "Dolmuş" },
  { similar: "Vapur", different: "Yat" },
  { similar: "Uçak", different: "Helikopter" },
  { similar: "Bisiklet", different: "Scooter" },
  { similar: "Kamyon", different: "Tır" },
  { similar: "Tramvay", different: "Metro" },
  { similar: "Kayık", different: "Sürat Teknesi" },

  // MEKÂN & YER
  { similar: "Kafe", different: "Restoran" },
  { similar: "Çocuk Parkı", different: "Lunapark" },
  { similar: "Müze", different: "Sergi Salonu" },
  { similar: "Plaj", different: "Havuz" },
  { similar: "Köy", different: "Şehir" },
  { similar: "Kasaba", different: "Metropol" },
  { similar: "Stadyum", different: "Spor Salonu" },
  { similar: "Kamp Alanı", different: "Bungalov" },

  // DOĞA & COĞRAFYA
  { similar: "Dağ", different: "Volkan" },
  { similar: "Nehir", different: "Şelale" },
  { similar: "Göl", different: "Deniz" },
  { similar: "Çöl", different: "Buzul" },
  { similar: "Ada", different: "Ana Kara" },
  { similar: "Ekvator", different: "Yağmur Ormanı" },
  { similar: "Mağara", different: "Kanyon" },

  // NESNELER & ARAÇ-GEREÇ
  { similar: "Sandalye", different: "Koltuk" },
  { similar: "Masa", different: "Sandalye" },
  { similar: "Bardak", different: "Termos" },
  { similar: "Defter", different: "Kitap" },
  { similar: "Sulu Boya", different: "Keçeli Kalem" },
  { similar: "Çekiç", different: "Tornavida" },
  { similar: "Anahtar", different: "Kilit" },
  { similar: "Makas", different: "Zımba" },

  // TEKNOLOJİ
  { similar: "Telefon", different: "Tablet" },
  { similar: "Laptop", different: "Masaüstü Bilgisayar" },
  { similar: "Klavye", different: "Fare" },
  { similar: "Kulaklık", different: "Hoparlör" },
  { similar: "Wi-Fi", different: "Mobil Veri" },
  { similar: "Bulut Depolama", different: "Harici Disk" },
  { similar: "Drone", different: "Aksiyon Kamerası" },

  // ETKİNLİK & KAVRAM
  { similar: "Konser", different: "Festival" },
  { similar: "Tiyatro", different: "Opera" },
  { similar: "Sergi", different: "Fuar" },
  { similar: "Piknik", different: "Mangal" },
  { similar: "Yürüyüş", different: "Tırmanış" },
  { similar: "Kamp", different: "Karavan" },

  // ZAMAN & HAVA
  { similar: "Gündoğumu", different: "Günbatımı" },
  { similar: "Fırtına", different: "Dolu" },
  { similar: "Gökkuşağı", different: "Kutup Işıkları" },
  { similar: "Şimşek", different: "Şafak" },

  // FANTEZİ & UZAY
  { similar: "Şövalye", different: "Büyücü" },
  { similar: "Ejderha", different: "Dinazor" },
  { similar: "Gezegen", different: "Uydu" },
  { similar: "Teleskop", different: "Mikroskop" }
];

// Ekranlar
const $ = (sel) => document.querySelector(sel);
const showScreen = (id) => {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
};

// START
$("#btn-start").addEventListener("click", () => {
  showScreen("#screen-count");
});
$("#back-to-start").addEventListener("click", () => showScreen("#screen-start"));

// TUR SAYISI SEÇİMİ (başlangıç ekranı)
document.querySelectorAll(".round-opt").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const val = parseInt(btn.dataset.rounds, 10);
    if(!isNaN(val)){
      state.totalRounds = val;
      const sel = document.getElementById('rounds-selected');
      if(sel) sel.textContent = `Seçilen tur: ${val}`;
      document.querySelectorAll('.round-opt').forEach(b=> b.classList.remove('active'));
      btn.classList.add('active');
    }
  });
});
// varsayılanı işaretle
(function markDefaultRounds(){
  const def = document.querySelector(`.round-opt[data-rounds="${state.totalRounds}"]`);
  if(def){ def.classList.add('active'); }
})();

// SAYI SEÇİMİ
document.querySelectorAll(".btn.count").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    state.count = parseInt(btn.dataset.n,10);
    buildNameInputs(state.count);
    showScreen("#screen-names");
  });
});
$("#back-to-count").addEventListener("click", ()=> showScreen("#screen-count"));

// RASTGELE İSİM
const SAMPLE_NAMES = ["Zeynep","Ali","Ece","Can","Derin","Mert","Deniz","Defne","Arda","Elif"];
$("#btn-random-names").addEventListener("click", ()=>{
  document.querySelectorAll(".name-input").forEach((inp,i)=>{
    const pick = SAMPLE_NAMES[(Math.random()*SAMPLE_NAMES.length)|0];
    inp.value = inp.value || `${pick}${(Math.random()*90|0)+10}`;
  });
});

// İSİM AL – OYUNU BAŞLAT
$("#names-form").addEventListener("submit", (e)=>{
  e.preventDefault();
  const inputs = [...document.querySelectorAll(".name-input")];
  const names = inputs.map(i=>i.value.trim()).map((n,i)=> n || `Oyuncu ${i+1}`);
  // skorları başlat, raundu sıfırla
  state.scores = {};
  names.forEach(n=> state.scores[n] = 0);
  state.currentRound = 1;
  startNewRound(names);
});

// YENİ TUR (isimler kalsın)
$("#btn-restart-round").addEventListener("click", ()=>{
  startNewRound(state.players.map(p=>p.name));
});
// BAŞA DÖN
$("#btn-reset").addEventListener("click", fullReset);
$("#btn-full-reset").addEventListener("click", fullReset);

function fullReset(){
  stopCountdown();
  state.count = 0;
  state.players = [];
  state.revealIndex = 0;
  state.activeVoterIndex = 0;
  state.votes = {};
  state.totalRounds = 5;
  state.currentRound = 1;
  state.scores = {};
  showScreen("#screen-start");
}

// SIRAYLA GÖSTER
$("#btn-show").addEventListener("click", ()=>{
  const i = state.revealIndex;
  const p = state.players[i];
  $("#word-text").textContent = p.word;
  $("#word-box").classList.remove("hidden");
  $("#btn-show").disabled = true;
  $("#btn-hide-next").disabled = false;
});

$("#btn-hide-next").addEventListener("click", ()=>{
  // gizle ve sıradaki oyuncuya geç
  $("#word-box").classList.add("hidden");
  $("#btn-show").disabled = false;
  $("#btn-hide-next").disabled = true;

  state.revealIndex++;
  if(state.revealIndex >= state.players.length){
    showScreen("#screen-end");
    startCountdown(180); // 3 dakika
  } else {
    updateRevealHeader();
  }
});

$("#btn-new-round").addEventListener("click", ()=>{
  startNewRound(state.players.map(p=>p.name));
});

// Oylamaya geç (sayacı atla)
const btnSkipVote = $("#btn-skip-vote");
if(btnSkipVote){
  btnSkipVote.addEventListener("click", ()=>{
    stopCountdown();
    const status = $("#countdown-status");
    if(status){ status.textContent = "Tartışma erken geçildi — oylamaya geçiliyor."; }
    goToVoting();
  });
}

// Yardımcılar
function buildNameInputs(n){
  const box = $("#names-list");
  box.innerHTML = "";
  for(let i=0;i<n;i++){
    const wrap = document.createElement("div");
    const inp = document.createElement("input");
    inp.type = "text";
    inp.placeholder = `Oyuncu ${i+1} adı`;
    inp.className = "name-input";
    wrap.appendChild(inp);
    box.appendChild(wrap);
  }
}

function startNewRound(names){
  stopCountdown();
  state.players = names.map(n=>({name:n, role:"", word:""}));
  state.count = state.players.length;
  state.votes = {};
  state.activeVoterIndex = 0;
  // skor nesnesi mevcut değilse veya eksikse tamamla (oyuncular sabit kalsın)
  state.players.forEach(p=>{ if(!(p.name in state.scores)) state.scores[p.name] = 0; });

  // Kelime çifti seç
  const pair = WORD_PAIRS[(Math.random()*WORD_PAIRS.length)|0];
  state.similarWord = pair.similar;
  state.differentWord = pair.different;

  // Tam olarak 1 kişiye farklı kelime ata
  state.oddIndex = (Math.random()*state.count)|0;

  state.players.forEach((p,idx)=>{
    if(idx === state.oddIndex){
      p.role = "different";
      p.word = state.differentWord;
    }else{
      p.role = "similar";
      p.word = state.similarWord;
    }
  });

  state.revealIndex = 0;
  updateRevealHeader();
  showScreen("#screen-reveal");
}

function updateRevealHeader(){
  const p = state.players[state.revealIndex];
  $("#reveal-title").textContent = `Sıra: ${p.name}`;
}

// --- Geri Sayım (3:00) ---
function startCountdown(seconds){
  stopCountdown();
  state.countdownRemaining = seconds;
  updateCountdownDisplay();
  state.countdownId = setInterval(()=>{
    state.countdownRemaining--;
    updateCountdownDisplay();
    handleCountdownAnimations();
    if(state.countdownRemaining <= 0){
      stopCountdown();
      const status = $("#countdown-status");
      if(status){
        status.textContent = "Tartışma bitti — oylamaya geçin.";
      }
      // End shake & vibrate
      const app = document.querySelector('#app');
      if(app){
        app.classList.add('shake');
        setTimeout(()=> app.classList.remove('shake'), 600);
      }
      if(navigator && typeof navigator.vibrate === 'function'){
        try{ navigator.vibrate(200); }catch(e){}
      }
      // Oylama ekranına geç
      goToVoting();
    }
  }, 1000);
}

function stopCountdown(){
  if(state.countdownId){
    clearInterval(state.countdownId);
    state.countdownId = null;
  }
}

function updateCountdownDisplay(){
  const el = $("#countdown");
  if(!el) return;
  const m = Math.floor(state.countdownRemaining/60);
  const s = state.countdownRemaining%60;
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function handleCountdownAnimations(){
  const el = $("#countdown");
  if(!el) return;
  if(state.countdownRemaining <= 10 && state.countdownRemaining > 0){
    el.classList.add('countdown-urgent');
    // retrigger pop animation each tick
    el.classList.remove('pop');
    // force reflow
    void el.offsetWidth;
    el.classList.add('pop');
  } else {
    el.classList.remove('countdown-urgent');
    el.classList.remove('pop');
  }
}

// --- Oylama Akışı ---
function goToVoting(){
  // initialize sequential voting
  state.activeVoterIndex = 0;
  state.votes = {};
  updateVoteTurnHeader();
  renderVoteList();
  const res = $("#vote-result");
  if(res){ res.classList.add("hidden"); res.textContent = ""; }
  showScreen("#screen-vote");
}

function updateVoteTurnHeader(){
  const el = $("#vote-turn");
  if(!el) return;
  const voter = state.players[state.activeVoterIndex];
  el.textContent = `Sıra: ${voter ? voter.name : '-'} — Oy kullanabilirsiniz`;
}

function renderVoteList(){
  const list = $("#vote-list");
  if(!list) return;
  list.innerHTML = "";
  state.players.forEach((p, idx)=>{
    const btn = document.createElement("button");
    btn.className = "btn vote-btn";
    btn.dataset.index = String(idx);
    btn.textContent = p.name;
    // aktif oyuncu kendine oy veremesin
    btn.disabled = (idx === state.activeVoterIndex);
    btn.addEventListener("click", onVoteClickSequential);
    list.appendChild(btn);
  });
}

function onVoteClickSequential(e){
  const target = e.currentTarget;
  const votedIdx = parseInt(target.dataset.index, 10);
  // guard: only active voter can proceed (soft confirmation on shared device)
  const voter = state.players[state.activeVoterIndex];
  const buttons = document.querySelectorAll('#vote-list button');
  // disable inputs briefly to avoid double clicks
  buttons.forEach(b=> b.disabled = true);
  const ok = window.confirm(`Şu an oy kullanan: ${voter?.name}. Onaylıyor musunuz?`);
  if(!ok){
    // re-enable buttons (except self)
    buttons.forEach((b)=>{
      const idx = parseInt(b.dataset.index,10);
      b.disabled = (idx === state.activeVoterIndex);
    });
    return;
  }

  // record vote
  state.votes[votedIdx] = (state.votes[votedIdx] || 0) + 1;

  // advance turn
  state.activeVoterIndex++;
  if(state.activeVoterIndex >= state.players.length){
    showVoteResultsSummary();
    return;
  }

  // next voter UI
  updateVoteTurnHeader();
  renderVoteList();
}

function showVoteResultsSummary(){
  const counts = state.players.map((p, idx)=> state.votes[idx] || 0);
  const max = Math.max(...counts);
  const topIndices = counts
    .map((c,i)=>({c,i}))
    .filter(x=> x.c === max)
    .map(x=> x.i);
  const tie = topIndices.length > 1;
  // Skor güncelle
  applyRoundScoring(tie, topIndices[0]);
  // Tur özeti ekranını hazırla
  renderRoundSummary(tie, counts, topIndices);
  showScreen('#screen-round-summary');
}

function applyRoundScoring(tie, chosenIdx){
  const impIdx = state.oddIndex;
  const impName = state.players[impIdx]?.name;
  if(impName == null) return;
  if(tie || chosenIdx !== impIdx){
    // Imposter wins: +2 to imposter
    state.scores[impName] = (state.scores[impName] || 0) + 2;
  } else {
    // Same-word team wins: +1 to each non-imposter
    state.players.forEach((p, idx)=>{
      if(idx !== impIdx){ state.scores[p.name] = (state.scores[p.name] || 0) + 1; }
    });
  }
}

function renderRoundSummary(tie, counts, topIndices){
  const title = document.getElementById('round-summary-title');
  if(title){ title.textContent = `Tur ${state.currentRound} / ${state.totalRounds}`; }
  const details = document.getElementById('round-summary-details');
  const impIdx = state.oddIndex;
  const impName = state.players[impIdx]?.name || '?';
  const chosenIdx = topIndices[0];
  const chosenName = typeof chosenIdx === 'number' ? state.players[chosenIdx]?.name : null;
  const correct = !tie && chosenIdx === impIdx;
  if(details){
    details.textContent = tie
      ? `Berabere! Casus: ${impName}`
      : `En çok oy alan: ${chosenName}. ${correct ? 'Doğru tahmin!' : 'Yanlış tahmin.'} Casus: ${impName}`;
  }
  renderScoreboard('round-scoreboard', state.scores);
}

function renderScoreboard(containerId, scores){
  const cont = document.getElementById(containerId);
  if(!cont) return;
  cont.innerHTML = '';
  const entries = Object.entries(scores).sort((a,b)=> b[1]-a[1]);
  const ul = document.createElement('ul');
  entries.forEach(([name, score], idx)=>{
    const li = document.createElement('li');
    li.textContent = name;
    const v = document.createElement('span');
    v.textContent = String(score);
    if(idx===0) li.classList.add('top');
    li.appendChild(v);
    ul.appendChild(li);
  });
  cont.appendChild(ul);
}

// Tur özeti ekranı butonları
const btnNextRound = document.getElementById('btn-next-round');
if(btnNextRound){
  btnNextRound.addEventListener('click', ()=>{
    state.currentRound++;
    if(state.currentRound > state.totalRounds){
      // Final ekranı
      showFinalResults();
      return;
    }
    startNewRound(state.players.map(p=>p.name));
  });
}
const btnSummaryReset = document.getElementById('btn-summary-reset');
if(btnSummaryReset){ btnSummaryReset.addEventListener('click', fullReset); }

// Final sonuçlar
function showFinalResults(){
  // kazanan(lar)
  const entries = Object.entries(state.scores).sort((a,b)=> b[1]-a[1]);
  const topScore = entries.length ? entries[0][1] : 0;
  const winners = entries.filter(e=> e[1] === topScore).map(e=> e[0]);
  const fw = document.getElementById('final-winner');
  if(fw){
    fw.textContent = winners.length>1 ? `Berabere! (${winners.join(', ')})` : `Kazanan: ${winners[0] || '-'}`;
  }
  renderScoreboard('final-scoreboard', state.scores);
  showScreen('#screen-final');
}

const btnFinalNew = document.getElementById('btn-final-new');
if(btnFinalNew){
  btnFinalNew.addEventListener('click', ()=>{
    // Aynı oyuncular, skorlar sıfır, raund 1
    const names = state.players.map(p=>p.name);
    state.scores = {};
    names.forEach(n=> state.scores[n]=0);
    state.currentRound = 1;
    // aynı tur sayısıyla devam
    startNewRound(names);
  });
}
const btnFinalReset = document.getElementById('btn-final-reset');
if(btnFinalReset){ btnFinalReset.addEventListener('click', fullReset); }

// Voting screen actions
const btnVoteNewRound = $("#btn-vote-new-round");
if(btnVoteNewRound){
  btnVoteNewRound.addEventListener("click", ()=>{
    startNewRound(state.players.map(p=>p.name));
  });
}
const btnVoteReset = $("#btn-vote-reset");
if(btnVoteReset){
  btnVoteReset.addEventListener("click", fullReset);
}

/* — İPUÇLARI —
- Yeni kelime çifti eklemek için WORD_PAIRS dizisine {similar:"...", different:"..."} ekle.
- Oyunun “tartışma/oylama” bölümünü istersen ek bir ekranla geliştirebilirsin.
*/
