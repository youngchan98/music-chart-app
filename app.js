// ── 음악 데이터 ──────────────────────────────────────
const DOMESTIC = [
  { id:1,  emoji:'🌸', title:'봄날',             artist:'BTS',         change:'new', duration:249 },
  { id:2,  emoji:'🔥', title:'Supernova',         artist:'aespa',       change:'+2',  duration:213 },
  { id:3,  emoji:'💜', title:'Love Dive',         artist:'IVE',         change:'-1',  duration:195 },
  { id:4,  emoji:'🌊', title:'ANTIFRAGILE',       artist:'LE SSERAFIM', change:'+5',  duration:182 },
  { id:5,  emoji:'🎭', title:'After Like',        artist:'IVE',         change:'=',   duration:197 },
  { id:6,  emoji:'🌙', title:'밤하늘의 별을',      artist:'경서',         change:'-2',  duration:234 },
  { id:7,  emoji:'⚡', title:'UNFORGIVEN',        artist:'LE SSERAFIM', change:'+1',  duration:208 },
  { id:8,  emoji:'🎵', title:'스물셋',             artist:'IU',          change:'-3',  duration:266 },
  { id:9,  emoji:'🌺', title:'POP!',              artist:'NAYEON',      change:'new', duration:189 },
  { id:10, emoji:'🎶', title:'가을 아침',          artist:'IU',          change:'+3',  duration:221 },
  { id:11, emoji:'💫', title:'DICE',              artist:'NMIXX',       change:'-1',  duration:203 },
  { id:12, emoji:'🎸', title:'Hype boy',          artist:'NewJeans',    change:'+7',  duration:176 },
  { id:13, emoji:'🌈', title:'OMG',               artist:'NewJeans',    change:'-2',  duration:214 },
  { id:14, emoji:'🎤', title:'Attention',         artist:'NewJeans',    change:'=',   duration:189 },
  { id:15, emoji:'🦋', title:'TOMBOY',            artist:'(G)I-DLE',    change:'+2',  duration:194 },
  { id:16, emoji:'💎', title:'Nxde',              artist:'(G)I-DLE',    change:'-4',  duration:216 },
  { id:17, emoji:'🌟', title:'거짓말거짓말거짓말', artist:'이찬혁',       change:'+1',  duration:245 },
  { id:18, emoji:'🎀', title:'Weekend',           artist:'태연',         change:'-1',  duration:198 },
  { id:19, emoji:'🏆', title:'Celebrity',         artist:'IU',          change:'=',   duration:210 },
  { id:20, emoji:'🔮', title:'MIROH',             artist:'Stray Kids',  change:'+3',  duration:228 },
];

const GLOBAL = [
  { id:101, emoji:'🎸', title:'Flowers',         artist:'Miley Cyrus',  change:'new', duration:200 },
  { id:102, emoji:'💿', title:'As It Was',        artist:'Harry Styles', change:'-1',  duration:167 },
  { id:103, emoji:'🔥', title:'Unholy',           artist:'Sam Smith',    change:'+4',  duration:156 },
  { id:104, emoji:'🌙', title:'Anti-Hero',        artist:'Taylor Swift', change:'-2',  duration:200 },
  { id:105, emoji:'⚡', title:'STAY',             artist:'Justin Bieber',change:'+1',  duration:141 },
  { id:106, emoji:'🎵', title:'Calm Down',        artist:'Rema',         change:'=',   duration:239 },
  { id:107, emoji:'💜', title:"Creepin'",         artist:'Metro Boomin', change:'+3',  duration:194 },
  { id:108, emoji:'🌊', title:'Softly',           artist:'Clairo',       change:'-3',  duration:193 },
  { id:109, emoji:'🎭', title:'Escapism.',        artist:'RAYE',         change:'new', duration:192 },
  { id:110, emoji:'🌺', title:'Golden Hour',      artist:'JVKE',         change:'-1',  duration:209 },
  { id:111, emoji:'💫', title:'About Damn Time',  artist:'Lizzo',        change:'+6',  duration:193 },
  { id:112, emoji:'🎶', title:'Rich Flex',        artist:'Drake',        change:'-5',  duration:201 },
  { id:113, emoji:'🌟', title:'Midnight Rain',    artist:'Taylor Swift', change:'+2',  duration:174 },
  { id:114, emoji:'🎀', title:'Beautiful Things', artist:'Benson Boone', change:'new', duration:218 },
  { id:115, emoji:'🏆', title:'Greedy',           artist:'Ariana Grande',change:'-2',  duration:175 },
  { id:116, emoji:'🔮', title:"I'm Good (Blue)",  artist:'David Guetta', change:'+1',  duration:175 },
  { id:117, emoji:'💎', title:'Watermelon Sugar', artist:'Harry Styles', change:'=',   duration:174 },
  { id:118, emoji:'🦋', title:'Levitating',       artist:'Dua Lipa',     change:'-3',  duration:203 },
  { id:119, emoji:'🌈', title:'Peaches',          artist:'Justin Bieber',change:'+4',  duration:198 },
  { id:120, emoji:'🎤', title:'Heat Waves',       artist:'Glass Animals',change:'-1',  duration:238 },
];

// ── 상태 변수 ────────────────────────────────────────
let currentTrack = null;    // 현재 선택된 곡
let currentTab   = 'domestic'; // 현재 탭 (국내/해외)
let isPlaying    = false;   // 재생 중인지 여부
let progress     = 0;       // 현재 재생 위치 (초)
let timer        = null;    // 타이머
let liked        = {};      // 좋아요 목록

// ── 차트 목록 그리기 ─────────────────────────────────
function renderChart(tab) {
    const data = tab === 'domestic' ? DOMESTIC : GLOBAL;
    const el   = document.getElementById('chartList');
    el.innerHTML = '';

    data.forEach((track, index) => {
        const rankClass = index === 0 ? 'rank-1'
                        : index === 1 ? 'rank-2'
                        : index === 2 ? 'rank-3'
                        : 'rank-other';
        
        const chg = track.change;
        let changeHtml;
        if      (chg === 'new')        changeHtml = `<span class="change-new">NEW</span>`;
        else if (chg.startsWith('+'))  changeHtml = `<span class="change-up">▲${chg.slice(1)}</span>`;
        else if (chg.startsWith('-'))  changeHtml = `<span class="change-down">▼${chg.slice(1)}</span>`;
        else                           changeHtml = `<span class="change-same">−</span>`;

        const isThisPlaying = currentTrack && currentTrack.id === track.id;
        const isLiked       = liked[track.id] || false;

        const row = document.createElement('div');
        row.className = 'track-item' + (isThisPlaying ? ' playing ' : '');
        row.innerHTML = `
            <div class="rank-num ${rankClass}">${index + 1}</div>
            <div class="track-cover">${track.emoji}</div>
            <div class="track-info">
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.artist}</div>
            </div>
            <div class="track-change">${changeHtml}</div>
            <div class="track-actions">
                <button class="icon-btn ${isLiked ? 'liked' : ''}"
                onclick="toggleLike(event, ${track.id})">
                ${isLiked ? '❤️' : '🤍'}
                </button>
                <button class="icon-btn"
                onclick="addToPlaylist(event, ${track.id})">➕</button>
                <button class="icon-btn"
                onclick="selectTrack(event, ${track.id})">▶</button>
            </div>`;
        
        // 행 클릭해도 재생
        row.addEventListener('click', () => selectTrack(null, track.id));
        el.appendChild(row);
    });
}

// ── 탭 전환 ──────────────────────────────────────────
function switchTab(btn, tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderChart(tab);
}

// ── 곡 선택 ──────────────────────────────────────────
function selectTrack(e, id) {
    if (e) e.stopPropagation();

    const allTracks = currentTab === 'domestic' ? DOMESTIC : GLOBAL;
    const track     = allTracks.find(t => t.id === id);
    if (!track) return;

    // 같은 곡 누르면 재생/일시정지 토글
    if (currentTrack && currentTrack.id === id) {
        togglePlay();
        return;
    }

    currentTrack = track;
    isPlaying    = true;
    progress     = 0;

    updateUI();
    startTimer();
    renderChart(currentTab);
    }

// ── 재생 / 일시정지 ──────────────────────────────────
function togglePlay() {
    if (!currentTrack) return;
    isPlaying = !isPlaying;
    if (isPlaying) startTimer();
    else           clearInterval(timer);
    updatePlayButtons();
    renderChart(currentTab);
}

// ── 이전 곡 ──────────────────────────────────────────
function prevTrack() {
    if (!currentTrack) return;
    const all = currentTab === 'domestic' ? DOMESTIC : GLOBAL;
    const idx = all.findIndex(t => t.id === currentTrack.id);
    const prev = all[(idx - 1 + all.length) % all.length];
    selectTrack(null, prev.id);
}

// ── 다음 곡 ──────────────────────────────────────────
function nextTrack() {
    if (!currentTrack) return;
    const all = currentTab === 'domestic' ? DOMESTIC : GLOBAL;
    const idx = all.findIndex(t => t.id === currentTrack.id);
    const next = all[(idx + 1) % all.length];
    selectTrack(null, next.id);
}

// ── 타이머 (1초마다 진행) ────────────────────────────
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        if (!currentTrack || !isPlaying) return;
        progress += 1;
        if (progress >= currentTrack.duration) {
        nextTrack(); // 곡 끝나면 다음 곡
        return;
        }
        updateProgress();
        }, 1000);
}

// ── 좋아요 토글 ──────────────────────────────────────
function toggleLike(e, id) {
    e.stopPropagation();
    liked[id] = !liked[id];
    renderChart(currentTab);
}

// ── UI 전체 업데이트 ─────────────────────────────────
function updateUI() {
    if (!currentTrack) return;
    const t = currentTrack;

    // 사이드바
    document.getElementById('npCover').textContent    = t.emoji;
    document.getElementById('npTitle').textContent    = t.title;
    document.getElementById('npArtist').textContent   = t.artist;
    document.getElementById('totalTime').textContent  = formatTime(t.duration);

    // 하단 바
    document.getElementById('pbCover').textContent    = t.emoji;
    document.getElementById('pbTitle').textContent    = t.title;
    document.getElementById('pbArtist').textContent   = t.artist;
    document.getElementById('pbTotalTime').textContent = formatTime(t.duration);

    updateProgress();
    updatePlayButtons();
}

// ── 진행바 업데이트 ──────────────────────────────────
function updateProgress() {
    if (!currentTrack) return;
    const pct = (progress / currentTrack.duration * 100).toFixed(1) + '%';

    document.getElementById('progressFill').style.width = pct;
    document.getElementById('pbBarFill').style.width    = pct;
    document.getElementById('curTime').textContent      = formatTime(progress);
    document.getElementById('pbCurTime').textContent    = formatTime(progress);
}

// ── 재생 버튼 아이콘 업데이트 ────────────────────────
function updatePlayButtons() {
    const icon = isPlaying ? '⏸' : '▶';
    document.getElementById('playBtn').innerHTML   = icon;
    document.getElementById('pbPlayBtn').innerHTML = icon;
}

// ── 시간 포맷 (초 → 분:초) ──────────────────────────
function formatTime(seconds) {
    const m  = Math.floor(seconds / 60);
    const s  = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
}

// ── 페이지 로드 시 차트 그리기 ───────────────────────
renderChart('domestic');

// ── 플레이리스트 ─────────────────────────────────────
let playlist = JSON.parse(localStorage.getItem('playlist')) || [];

// 플레이리스트에 곡 추가
function addToPlaylist(e, id) {
    e.stopPropagation();
    const all = currentTab === 'domestic' ? DOMESTIC : GLOBAL;
    const track = all.find(t => t.id === id);
    if (!track) return;

    if (playlist.find(t => t.id === id)) {
        showToast('이미 플레이리스트에 있어요!');
        return;
    }
    playlist.push(track);
    localStorage.setItem('playlist', JSON.stringify(playlist));
    showToast(`${track.title} 추가됨 ✅`);
    renderPlaylistPage();
}

// 플레이리스트에서 곡 삭제
function removeFromPlatlist(id) {
    playlist = playlist.filter(t => t.id !== id);
    localStorage.setItem('playlist', JSON.stringify(playlist));
    renderPlaylistPage();
}

// 플레이리스트 페이지 렌더링
function renderPlaylistPage() {
    const el = document.getElementById('playlistItems');
    if (!el) return;
     if (playlist.length === 0) {
        el.innerHTML = `
            <div class="playlist-empty">
                <div style="font-size:48px;">🎵</div>
                <p>아직 추가된 곡이 없어요</p>
                <p style="font-size:13px;color:var(--muted);margin-top:8px;">차트에서 ➕ 버튼을 눌러 추가해보세요!</p>
            </div>`;
        return;
    }

    el.innerHTML = playlist.map((track, index) => `
       <div class="track-item ${currentTrack && currentTrack.id === track.id ? 'playing' : ''}"
       onclick="selectTrack(null, ${track.id})">
       <div class="rank-num rank-other">${index + 1}</div>
       <div class="track-cover">${track.emoji}</div>
       <div class="track-info">
           <div class="track-title">${track.title}</div>
           <div class="track-artist">${track.artist}</div>
       </div>
       <div class="track-change"></div>
       <div class="track-actions">
           <button class="icon-btn" onclick="event.stopPropagation(); removeFromPlaylist(${track.id})">🗑️</button>
           <button class="icon-btn" onclick="selectTrack(event, ${track.id})">▶</button>
       </div>
       </div>`).join('');
}

// 페이지 전환
function showPage(page) {
    document.getElementById('chartPage').style.display    = page === 'chart'    ? 'block' : 'none';
    document.getElementById('playlistPage').style.display = page === 'playlist' ? 'block' : 'none';

    // 히어로 섹션도 차트일 때만 보이게
    document.querySelector('.hero').style.display = page === 'chart' ? 'flex' : 'none';

    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    if (page === 'chart')    document.querySelector('nav a:nth-child(1)').classList.add('active');
    if (page === 'playlist') document.querySelector('nav a:nth-child(4)').classList.add('active');

    if (page === 'playlist') renderPlaylistPage();
}

// 토스트 메시지
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// 플레이리스트에서 다음 곡 재생
function nextTrack() {
    if (!currentTrack) return;

    const isPlaylistVisible = document.getElementById('playlistPage').style.display === 'block';
    const list = isPlaylistVisible && playlist.length > 0 ? playlist
        : currentTab === 'domestic' ? DOMESTIC : GLOBAL;
    
    const idx = list.findIndex(t => t.id === currentTrack.id);
    if (idx === -1) {
        const all = currentTab === 'domestic' ? DOMESTIC : GLOBAL;
        const i = all.findIndex(t => t.id === currentTrack.id);
        selectTrack(null, all[(i + 1) % all.length].id);
        return;
    }
    selectTrack(null, list[(idx + 1) % list.length].id);
}

function prevTrack() {
    if (!currentTrack) return;

    const isPlaylistVisible = document.getElementById('playlistPage').style.display === 'block';
    const list = isPlaylistVisible && playlist.length > 0 ? playlist
        : currentTab === 'domestic' ? DOMESTIC : GLOBAL;
    
    const idx = list.findIndex(t => t.id === currentTrack.id);
    if (idx === -1) {
        const all = currentTab === 'domestic' ? DOMESTIC : GLOBAL;
        const i = all.findIndex(t => t.id ===currentTrack.id);
        selectTrack(null, all[(i - 1 + all.length) % all.length].id);
        return;
    }
    selectTrack(null, list[(idx - 1 + list.length) % list.length].id);
}