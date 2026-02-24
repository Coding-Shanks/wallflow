import { useState, useRef, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0f0f11; color: #e8e6f0; }

  :root {
    --bg: #0f0f11;
    --surface: #1a1a1f;
    --surface2: #222228;
    --border: #2e2e38;
    --accent: #7c3aed;
    --accent2: #a855f7;
    --text: #e8e6f0;
    --muted: #8885a0;
    --card-r: 14px;
  }

  .app { min-height: 100vh; background: var(--bg); }

  /* NAV */
  nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; height: 60px;
    background: rgba(15,15,17,0.85); backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .nav-logo svg { color: var(--accent2); }
  .nav-logo span { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.15rem; letter-spacing: -0.5px; }
  .nav-actions { display: flex; align-items: center; gap: 10px; }
  .btn { cursor: pointer; border: none; border-radius: 8px; font-family: inherit; font-size: 0.88rem; font-weight: 500; transition: all .18s; }
  .btn-ghost { background: transparent; color: var(--text); padding: 8px 16px; }
  .btn-ghost:hover { background: var(--surface2); }
  .btn-primary { background: var(--accent); color: #fff; padding: 8px 18px; }
  .btn-primary:hover { background: var(--accent2); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(124,58,237,.4); }
  .btn-secondary { background: var(--surface2); color: var(--text); padding: 8px 18px; border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--accent); }
  .avatar-btn { width: 34px; height: 34px; border-radius: 50%; overflow: hidden; cursor: pointer; border: 2px solid var(--accent); }
  .avatar-btn img { width: 100%; height: 100%; object-fit: cover; }

  /* HERO */
  .hero { padding: 72px 28px 48px; text-align: center; position: relative; overflow: hidden; }
  .hero::before {
    content: ''; position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero h1 { font-family: 'Syne', sans-serif; font-size: clamp(2.2rem,5vw,3.4rem); font-weight: 800; line-height: 1.1; letter-spacing: -1px; margin-bottom: 14px; }
  .hero p { color: var(--muted); max-width: 480px; margin: 0 auto 32px; line-height: 1.6; }
  .search-wrap { max-width: 520px; margin: 0 auto; position: relative; }
  .search-wrap input {
    width: 100%; padding: 14px 20px 14px 48px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; color: var(--text); font-family: inherit; font-size: 0.92rem;
    outline: none; transition: border-color .18s;
  }
  .search-wrap input:focus { border-color: var(--accent); }
  .search-wrap input::placeholder { color: var(--muted); }
  .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--muted); }

  /* GRID */
  .section { padding: 32px 28px; }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .section-header h2 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; }
  .wall-grid { columns: 1; gap: 16px; }
  @media(min-width:540px){ .wall-grid { columns: 2; } }
  @media(min-width:900px){ .wall-grid { columns: 3; } }
  @media(min-width:1200px){ .wall-grid { columns: 4; } }
  .wall-card {
    break-inside: avoid; margin-bottom: 16px;
    border-radius: var(--card-r); overflow: hidden;
    background: var(--surface); cursor: pointer;
    transition: transform .22s, box-shadow .22s;
    border: 1px solid var(--border);
  }
  .wall-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,.5); }
  .wall-card img { width: 100%; display: block; }
  .wall-card-info { padding: 10px 12px; }
  .wall-card-info h3 { font-size: 0.9rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .wall-card-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 6px; }
  .wall-card-meta span { font-size: 0.77rem; color: var(--muted); display: flex; align-items: center; gap: 4px; }
  .tag { display: inline-block; padding: 3px 9px; background: var(--surface2); border-radius: 20px; font-size: 0.73rem; color: var(--muted); margin: 3px 3px 0 0; border: 1px solid var(--border); cursor: pointer; }
  .tag:hover { border-color: var(--accent); color: var(--accent2); }

  /* MODAL / DETAIL */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.75); backdrop-filter: blur(6px); z-index: 200; display: flex; align-items: flex-start; justify-content: center; overflow-y: auto; padding: 24px 16px; }
  .modal { background: var(--surface); border-radius: 18px; border: 1px solid var(--border); width: 100%; max-width: 660px; overflow: hidden; animation: slideUp .25s ease; }
  @keyframes slideUp { from { opacity:0; transform: translateY(20px) } to { opacity:1; transform: none } }
  .modal-img { width: 100%; display: block; max-height: 380px; object-fit: cover; }
  .modal-body { padding: 24px; }
  .modal-body h2 { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 700; margin-bottom: 6px; }
  .uploader { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .uploader img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
  .uploader span { font-size: 0.85rem; color: var(--muted); }
  .uploader b { color: var(--text); cursor: pointer; }
  .uploader b:hover { color: var(--accent2); }
  .modal-desc { color: var(--muted); font-size: 0.88rem; line-height: 1.6; margin-bottom: 14px; }
  .modal-tags { margin-bottom: 20px; }
  .modal-actions { display: flex; gap: 12px; }
  .btn-like { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; cursor: pointer; font-size: 0.9rem; color: var(--text); transition: all .18s; }
  .btn-like:hover, .btn-like.liked { border-color: #e03;  color: #f55; }
  .btn-download { flex: 2; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: var(--accent); border-radius: 10px; cursor: pointer; font-size: 0.9rem; color: #fff; font-weight: 600; transition: all .18s; border: none; }
  .btn-download:hover { background: var(--accent2); }
  .close-btn { position: absolute; top: 16px; right: 16px; background: rgba(0,0,0,.6); border: none; color: #fff; border-radius: 50%; width: 34px; height: 34px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; }
  .modal-relative { position: relative; }
  .comments-section { padding: 0 24px 24px; border-top: 1px solid var(--border); }
  .comments-title { font-family:'Syne',sans-serif; font-weight:600; font-size:0.95rem; padding: 16px 0 12px; }
  .comment-input-wrap { display: flex; gap: 10px; margin-bottom: 16px; }
  .comment-input-wrap input { flex:1; background: var(--surface2); border:1px solid var(--border); border-radius:8px; padding:10px 14px; color:var(--text); font-family:inherit; font-size:0.85rem; outline:none; }
  .comment-input-wrap input:focus { border-color:var(--accent); }
  .comment { display:flex; gap:10px; margin-bottom:14px; }
  .comment img { width:28px; height:28px; border-radius:50%; object-fit:cover; flex-shrink:0; }
  .comment-text b { font-size:0.82rem; color:var(--text); }
  .comment-text p { font-size:0.83rem; color:var(--muted); margin-top:2px; line-height:1.5; }

  /* AUTH FORMS */
  .auth-page { min-height: calc(100vh - 60px); display:flex; align-items:center; justify-content:center; padding: 40px 16px; }
  .auth-card { background:var(--surface); border:1px solid var(--border); border-radius:18px; padding:36px 32px; width:100%; max-width:400px; animation: slideUp .25s ease; }
  .auth-card h2 { font-family:'Syne',sans-serif; font-weight:700; font-size:1.5rem; margin-bottom:6px; }
  .auth-card p { color:var(--muted); font-size:0.85rem; margin-bottom:24px; }
  .form-group { margin-bottom:16px; }
  .form-group label { display:block; font-size:0.83rem; margin-bottom:6px; color:var(--text); }
  .form-group input { width:100%; padding:11px 14px; background:var(--surface2); border:1px solid var(--border); border-radius:8px; color:var(--text); font-family:inherit; font-size:0.88rem; outline:none; transition:border-color .18s; }
  .form-group input:focus { border-color:var(--accent); }
  .form-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
  .form-row label { font-size:0.83rem; }
  .link { color:var(--accent2); cursor:pointer; text-decoration:none; font-size:0.83rem; }
  .link:hover { text-decoration:underline; }
  .btn-full { width:100%; padding:12px; font-size:0.92rem; font-weight:600; border-radius:10px; border:none; cursor:pointer; margin-bottom:10px; }
  .divider { text-align:center; color:var(--muted); font-size:0.8rem; margin:4px 0 10px; position:relative; }
  .auth-footer { text-align:center; font-size:0.83rem; color:var(--muted); margin-top:16px; }

  /* PROFILE */
  .profile-header { background: var(--surface); border-bottom: 1px solid var(--border); padding: 40px 28px 28px; }
  .profile-top { display: flex; align-items: flex-end; gap: 20px; max-width: 900px; margin: 0 auto 16px; }
  .profile-avatar { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent); flex-shrink:0; }
  .profile-info h2 { font-family:'Syne',sans-serif; font-size:1.5rem; font-weight:700; }
  .profile-info p { color:var(--muted); font-size:0.85rem; margin-top:4px; }
  .profile-stats { display:flex; gap:24px; margin-top:10px; }
  .profile-stats span { font-size:0.82rem; color:var(--muted); }
  .profile-stats b { color:var(--text); font-size:0.95rem; }
  .profile-actions { display:flex; gap:10px; margin-left:auto; }
  .upload-section { padding: 28px; max-width: 900px; margin: 0 auto; }
  .upload-dropzone {
    border: 2px dashed var(--border); border-radius: 14px; padding: 40px;
    text-align: center; cursor: pointer; transition: border-color .18s, background .18s;
    margin-bottom: 20px;
  }
  .upload-dropzone:hover, .upload-dropzone.drag { border-color: var(--accent); background: rgba(124,58,237,.05); }
  .upload-dropzone p { color:var(--muted); font-size:0.88rem; margin-top:8px; }
  .upload-preview img { width:100%; max-height:260px; object-fit:cover; border-radius:10px; margin-bottom:16px; }

  /* TOAST */
  .toast { position:fixed; bottom:28px; right:28px; background:var(--surface2); border:1px solid var(--accent); border-radius:10px; padding:12px 20px; font-size:0.88rem; z-index:999; animation:slideUp .2s ease; box-shadow:0 8px 30px rgba(0,0,0,.4); }
`;

// ─── Sample wallpapers data ───────────────────────────────────────────────────
const SAMPLE_WALLS = [
  { id:1, title:"Cosmic Cliffs", url:"https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800", thumb:"https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400", tags:["space","nebula","galaxy","stars"], desc:"A stunning view of a distant nebula, captured by the James Webb Space Telescope. The vibrant colors and sharp details create an awe-inspiring cosmic landscape.", uploader:"Astro Explorer", avatar:"https://i.pravatar.cc/40?img=1", likes:1253, downloads:7890 },
  { id:2, title:"Mountain Silence", url:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", thumb:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400", tags:["mountains","nature","fog","serene"], desc:"Majestic peaks wrapped in morning mist. Perfect for a calm, focused workspace.", uploader:"Peak Wanderer", avatar:"https://i.pravatar.cc/40?img=5", likes:982, downloads:5430 },
  { id:3, title:"Neon City Rain", url:"https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800", thumb:"https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400", tags:["city","neon","rain","night","urban"], desc:"A cyberpunk street drenched in neon reflections after a rainstorm.", uploader:"UrbanLens", avatar:"https://i.pravatar.cc/40?img=9", likes:2101, downloads:11203 },
  { id:4, title:"Desert Geometry", url:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800", thumb:"https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400", tags:["desert","abstract","sand","dunes"], desc:"Rolling sand dunes cast perfect geometric shadows under a blazing sun.", uploader:"Sahara Dreams", avatar:"https://i.pravatar.cc/40?img=12", likes:754, downloads:3210 },
  { id:5, title:"Aurora Borealis", url:"https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800", thumb:"https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400", tags:["aurora","night","sky","nature","colorful"], desc:"The northern lights dance in vivid greens and purples above a frozen lake.", uploader:"Arctic Soul", avatar:"https://i.pravatar.cc/40?img=15", likes:3420, downloads:18900 },
  { id:6, title:"Ocean Abstract", url:"https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800", thumb:"https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400", tags:["ocean","abstract","blue","waves"], desc:"Aerial view of breaking waves creating natural abstract patterns.", uploader:"SeaVision", avatar:"https://i.pravatar.cc/40?img=20", likes:891, downloads:4523 },
  { id:7, title:"Forest Canopy", url:"https://images.unsplash.com/photo-1448375240586-882707db888b?w=800", thumb:"https://images.unsplash.com/photo-1448375240586-882707db888b?w=400", tags:["forest","green","nature","trees"], desc:"Looking up through an ancient forest canopy, sunlight filtering through the leaves.", uploader:"Green Earth", avatar:"https://i.pravatar.cc/40?img=22", likes:1122, downloads:6001 },
  { id:8, title:"Volcanic Dawn", url:"https://images.unsplash.com/photo-1552055040-8a9ef34f01bb?w=800", thumb:"https://images.unsplash.com/photo-1552055040-8a9ef34f01bb?w=400", tags:["volcano","fire","dramatic","landscape"], desc:"Lava meets the ocean at dawn, steam and fire creating a primal scene.", uploader:"Fire & Stone", avatar:"https://i.pravatar.cc/40?img=26", likes:2305, downloads:9800 },
];

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home"); // home | login | register | detail | profile | upload
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState(null);
  const [walls, setWalls] = useState(SAMPLE_WALLS);
  const [search, setSearch] = useState("");
  const [likedIds, setLikedIds] = useState([]);
  const [comments, setComments] = useState({ 1:["Love this!","Incredible colors"], 3:["Cyberpunk vibes ❤️"] });
  const [toast, setToast] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 2500); };

  const filteredWalls = walls.filter(w =>
    !search || w.title.toLowerCase().includes(search.toLowerCase()) || w.tags.some(t=>t.includes(search.toLowerCase()))
  );

  const goDetail = (w) => { setSelected(w); setPage("detail"); };
  const goProfile = (name) => { setViewUser(name); setPage("profile"); };

  const handleDownload = (w) => {
    const a = document.createElement("a");
    a.href = w.url;
    a.download = w.title + ".jpg";
    a.target = "_blank";
    a.click();
    showToast("Download started! 🎉");
    setWalls(prev => prev.map(x => x.id===w.id ? {...x, downloads: x.downloads+1} : x));
  };

  const toggleLike = (w) => {
    if (!user) { setPage("login"); return; }
    setLikedIds(prev => prev.includes(w.id) ? prev.filter(id=>id!==w.id) : [...prev, w.id]);
    setWalls(prev => prev.map(x => x.id===w.id ? {...x, likes: likedIds.includes(w.id) ? x.likes-1 : x.likes+1} : x));
  };

  const userWalls = user ? walls.filter(w=>w.uploader===user.username) : [];

  return (
    <>
      <style>{FONTS}{CSS}</style>
      <div className="app">
        <Nav user={user} page={page} setPage={setPage} setUser={setUser} goProfile={goProfile} />
        {page==="home" && <HomePage walls={filteredWalls} search={search} setSearch={setSearch} goDetail={goDetail} likedIds={likedIds} user={user} setPage={setPage} />}
        {page==="login" && <LoginPage setUser={setUser} setPage={setPage} showToast={showToast} />}
        {page==="register" && <RegisterPage setUser={setUser} setPage={setPage} showToast={showToast} />}
        {page==="detail" && selected && <DetailPage wall={walls.find(w=>w.id===selected.id)||selected} onClose={()=>setPage("home")} onDownload={handleDownload} likedIds={likedIds} toggleLike={toggleLike} comments={comments} setComments={setComments} user={user} setPage={setPage} goProfile={goProfile} showToast={showToast} />}
        {page==="profile" && <ProfilePage user={user} viewUser={viewUser} walls={user&&viewUser===user.username ? userWalls : walls.filter(w=>w.uploader===viewUser)} setPage={setPage} showToast={showToast} setWalls={setWalls} />}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ user, page, setPage, setUser, goProfile }) {
  return (
    <nav>
      <div className="nav-logo" onClick={()=>setPage("home")}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <polygon points="14,2 26,24 2,24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/>
          <polygon points="14,8 22,22 6,22" fill="currentColor" opacity=".3"/>
        </svg>
        <span>WallFlow</span>
      </div>
      <div className="nav-actions">
        {user ? (
          <>
            <button className="btn btn-secondary" onClick={()=>{ goProfile(user.username); }}>Upload</button>
            <div className="avatar-btn" onClick={()=>goProfile(user.username)}>
              <img src={user.avatar} alt={user.username} />
            </div>
          </>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={()=>setPage("login")}>Login</button>
            <button className="btn btn-primary" onClick={()=>setPage("register")}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────
function HomePage({ walls, search, setSearch, goDetail, likedIds, user, setPage }) {
  return (
    <div>
      <div className="hero">
        <h1>Explore Wallpapers</h1>
        <p>Discover a world of breathtaking visuals. Find the perfect background to inspire your day.</p>
        <div className="search-wrap">
          <svg className="search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by title or tag (e.g., 'nature', 'abstract')..." />
        </div>
      </div>
      <div className="section">
        <div className="section-header">
          <h2>{search ? `Results for "${search}"` : "Featured Wallpapers"}</h2>
          <span style={{fontSize:"0.82rem",color:"var(--muted)"}}>{walls.length} wallpapers</span>
        </div>
        <div className="wall-grid">
          {walls.map(w => (
            <div className="wall-card" key={w.id} onClick={()=>goDetail(w)}>
              <img src={w.thumb} alt={w.title} loading="lazy" />
              <div className="wall-card-info">
                <h3>{w.title}</h3>
                <div className="wall-card-meta">
                  <span>
                    <svg width="13" height="13" fill={likedIds.includes(w.id)?"#f55":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {w.likes.toLocaleString()}
                  </span>
                  <span>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    {w.downloads.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {walls.length===0 && <div style={{textAlign:"center",color:"var(--muted)",padding:"60px 0"}}>No wallpapers found for "{search}"</div>}
      </div>
    </div>
  );
}

// ─── Detail ───────────────────────────────────────────────────────────────────
function DetailPage({ wall, onClose, onDownload, likedIds, toggleLike, comments, setComments, user, setPage, goProfile, showToast }) {
  const [commentText, setCommentText] = useState("");
  const wallComments = comments[wall.id] || [];

  const addComment = () => {
    if (!user) { setPage("login"); return; }
    if (!commentText.trim()) return;
    setComments(prev => ({ ...prev, [wall.id]: [...(prev[wall.id]||[]), commentText.trim()] }));
    setCommentText("");
  };

  return (
    <div className="overlay" onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-relative">
          <img className="modal-img" src={wall.url} alt={wall.title} />
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <h2>{wall.title}</h2>
          <div className="uploader">
            <img src={wall.avatar} alt={wall.uploader} />
            <span>Uploaded by <b onClick={()=>{ onClose(); goProfile(wall.uploader); }}>{wall.uploader}</b></span>
          </div>
          <p className="modal-desc">{wall.desc}</p>
          <div className="modal-tags">{wall.tags.map(t=><span className="tag" key={t}>{t}</span>)}</div>
          <div className="modal-actions">
            <button className={`btn-like${likedIds.includes(wall.id)?" liked":""}`} onClick={()=>toggleLike(wall)}>
              <svg width="16" height="16" fill={likedIds.includes(wall.id)?"currentColor":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {wall.likes.toLocaleString()}
            </button>
            <button className="btn-download" onClick={()=>onDownload(wall)}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {wall.downloads.toLocaleString()} · Download
            </button>
          </div>
        </div>
        <div className="comments-section">
          <div className="comments-title">Comments ({wallComments.length})</div>
          <div className="comment-input-wrap">
            <img src={user?.avatar||"https://i.pravatar.cc/40?img=33"} alt="" style={{width:28,height:28,borderRadius:"50%",objectFit:"cover",flexShrink:0}} />
            <input value={commentText} onChange={e=>setCommentText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addComment()} placeholder="Add a public comment..." />
            <button className="btn btn-primary" style={{padding:"8px 14px",fontSize:"0.8rem"}} onClick={addComment}>Post</button>
          </div>
          {wallComments.map((c,i)=>(
            <div className="comment" key={i}>
              <img src={`https://i.pravatar.cc/40?img=${30+i}`} alt="" />
              <div className="comment-text">
                <b>{i===0?"Peak Wanderer":"UrbanLens"}</b>
                <p>{c}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginPage({ setUser, setPage, showToast }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const handle = () => {
    if (!email || !pw) return;
    const u = { username: email.split("@")[0], email, avatar: `https://i.pravatar.cc/80?img=33` };
    setUser(u); setPage("home"); showToast("Welcome back! 👋");
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login to WallFlow</h2>
        <p>Enter your email below to login to your account</p>
        <div className="form-group"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="m@example.com" /></div>
        <div className="form-group">
          <div className="form-row"><label>Password</label><span className="link">Forgot your password?</span></div>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-full" onClick={handle}>Login</button>
        <div className="divider">or</div>
        <button className="btn btn-secondary btn-full" onClick={handle}>Login with Google</button>
        <div className="auth-footer">Don't have an account? <span className="link" onClick={()=>setPage("register")}>Sign up</span></div>
      </div>
    </div>
  );
}

// ─── Register ─────────────────────────────────────────────────────────────────
function RegisterPage({ setUser, setPage, showToast }) {
  const [username, setUsername] = useState(""); const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const handle = () => {
    if (!username || !email || !pw) return;
    const u = { username, email, avatar: `https://i.pravatar.cc/80?img=44` };
    setUser(u); setPage("home"); showToast("Account created! Welcome 🎉");
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign Up for WallFlow</h2>
        <p>Enter your information to create an account</p>
        <div className="form-group"><label>Username</label><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Max" /></div>
        <div className="form-group"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="m@example.com" /></div>
        <div className="form-group"><label>Password</label><input type="password" value={pw} onChange={e=>setPw(e.target.value)} /></div>
        <button className="btn btn-primary btn-full" onClick={handle}>Create an account</button>
        <div className="divider">or</div>
        <button className="btn btn-secondary btn-full" onClick={handle}>Sign up with Google</button>
        <div className="auth-footer">Already have an account? <span className="link" onClick={()=>setPage("login")}>Sign in</span></div>
      </div>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function ProfilePage({ user, viewUser, walls, setPage, showToast, setWalls }) {
  const isOwn = user && user.username === viewUser;
  const [uploadMode, setUploadMode] = useState(false);
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState(""); const [desc, setDesc] = useState(""); const [tags, setTags] = useState("");
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const submitUpload = () => {
    if (!preview || !title) { showToast("Please add an image and title"); return; }
    const newWall = {
      id: Date.now(), title, url: preview, thumb: preview,
      tags: tags.split(",").map(t=>t.trim()).filter(Boolean),
      desc: desc || "No description provided.", uploader: user.username,
      avatar: user.avatar, likes: 0, downloads: 0
    };
    setWalls(prev => [newWall, ...prev]);
    showToast("Wallpaper uploaded! 🖼️");
    setUploadMode(false); setPreview(null); setTitle(""); setDesc(""); setTags("");
  };

  return (
    <div>
      <div className="profile-header">
        <div className="profile-top">
          <img className="profile-avatar" src={`https://i.pravatar.cc/80?u=${viewUser}`} alt={viewUser} />
          <div className="profile-info">
            <h2>{viewUser}</h2>
            <p>WallFlow Creator</p>
            <div className="profile-stats">
              <span><b>{walls.length}</b> uploads</span>
              <span><b>{walls.reduce((a,w)=>a+w.likes,0).toLocaleString()}</b> likes</span>
              <span><b>{walls.reduce((a,w)=>a+w.downloads,0).toLocaleString()}</b> downloads</span>
            </div>
          </div>
          {isOwn && (
            <div className="profile-actions">
              <button className="btn btn-primary" onClick={()=>setUploadMode(u=>!u)}>
                {uploadMode ? "Cancel" : "+ Upload Wallpaper"}
              </button>
            </div>
          )}
        </div>
      </div>

      {isOwn && uploadMode && (
        <div className="upload-section">
          <div
            className={`upload-dropzone${drag?" drag":""}`}
            onDragOver={e=>{ e.preventDefault(); setDrag(true); }}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{ e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={()=>fileRef.current.click()}
          >
            {!preview ? (
              <>
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <p>Drag & drop or click to upload<br/><span style={{fontSize:"0.78rem"}}>PNG, JPG, WEBP up to 20MB</span></p>
              </>
            ) : <img src={preview} alt="preview" style={{maxHeight:200,borderRadius:8}} />}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])} />
          <div className="form-group"><label>Title *</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="My Amazing Wallpaper" /></div>
          <div className="form-group"><label>Description</label><input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Tell us about this wallpaper..." /></div>
          <div className="form-group"><label>Tags (comma separated)</label><input value={tags} onChange={e=>setTags(e.target.value)} placeholder="nature, landscape, blue" /></div>
          <button className="btn btn-primary btn-full" onClick={submitUpload}>Publish Wallpaper</button>
        </div>
      )}

      <div className="section">
        <div className="section-header">
          <h2>{isOwn ? "My Uploads" : `${viewUser}'s Uploads`}</h2>
        </div>
        {walls.length === 0 ? (
          <div style={{textAlign:"center",color:"var(--muted)",padding:"60px 0"}}>
            {isOwn ? "No uploads yet. Upload your first wallpaper!" : "No uploads yet."}
          </div>
        ) : (
          <div className="wall-grid">
            {walls.map(w => (
              <div className="wall-card" key={w.id} onClick={()=>setPage("detail")}>
                <img src={w.thumb} alt={w.title} loading="lazy" />
                <div className="wall-card-info">
                  <h3>{w.title}</h3>
                  <div className="wall-card-meta">
                    <span>❤ {w.likes.toLocaleString()}</span>
                    <span>↓ {w.downloads.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
