'use strict';

/* ============================================================
   QUICKBORROW — Notre Dame of Midsayap College
   Library Borrowing Management System
   script.js
   ============================================================ */

// Embed NDM College logo as base64
const NDM_LOGO = 'https://tse2.mm.bing.net/th/id/OIP.Dg1QxmBsTRMotX-hBVGp9gHaG8?pid=Api&h=220&P=0';

/* ============================================================
   DATA STORE
   ============================================================ */
const DB = {
  books: [], users: [], transactions: [], issues: [], reservations: [], notifications: [],
  settings: { fineEnabled: false, finePerDay: 5 },

  load() {
    try {
      this.books        = JSON.parse(localStorage.getItem('qb2_books'))        || this._seedBooks();
      this.users        = JSON.parse(localStorage.getItem('qb2_users'))        || this._seedUsers();
      this.transactions = JSON.parse(localStorage.getItem('qb2_transactions')) || this._seedTrans();
      this.issues       = JSON.parse(localStorage.getItem('qb2_issues'))       || this._seedIssues();
      this.reservations = JSON.parse(localStorage.getItem('qb2_reservations'))|| this._seedReservations();
      this.notifications= JSON.parse(localStorage.getItem('qb2_notifications'))|| [];
      this.settings     = JSON.parse(localStorage.getItem('qb2_settings'))    || { fineEnabled: false, finePerDay: 5 };
    } catch(e) {
      this.books = this._seedBooks();
      this.users = this._seedUsers();
      this.transactions = this._seedTrans();
      this.issues = this._seedIssues();
      this.reservations = this._seedReservations();
      this.notifications = [];
      this.settings = { fineEnabled: false, finePerDay: 5 };
    }
  },

  save() {
    try {
      localStorage.setItem('qb2_books',        JSON.stringify(this.books));
      localStorage.setItem('qb2_users',        JSON.stringify(this.users));
      localStorage.setItem('qb2_transactions', JSON.stringify(this.transactions));
      localStorage.setItem('qb2_issues',       JSON.stringify(this.issues));
      localStorage.setItem('qb2_reservations', JSON.stringify(this.reservations));
      localStorage.setItem('qb2_notifications',JSON.stringify(this.notifications));
      localStorage.setItem('qb2_settings',     JSON.stringify(this.settings));
      return true;
    } catch(e) { console.warn('Storage unavailable', e); return false; }
  },

  nextId(arr, prefix) {
    const nums = arr.map(x => parseInt(x.id?.replace(prefix,'')) || 0);
    return prefix + String((Math.max(0,...nums)+1)).padStart(4,'0');
  },

  _seedBooks() {
    return [
      {id:'BK0001',title:'Clean Code',author:'Robert C. Martin',category:'Technology',isbn:'978-0132350884',qty:5,available:3,dateAdded:'2024-01-10',subtitle:'A Handbook of Agile Software Craftsmanship',publisher:'Prentice Hall',subject:'Software Engineering',shelfLocation:'Aisle 3, Shelf B',callNumber:'005.1 MAR',status:'Active',description:'A guide to writing readable, maintainable code, useful for programming assignments and software engineering projects.'},
      {id:'BK0002',title:'The Great Gatsby',author:'F. Scott Fitzgerald',category:'Fiction',isbn:'978-0743273565',qty:4,available:4,dateAdded:'2024-01-12',subtitle:'',publisher:'Scribner',subject:'American Literature',shelfLocation:'Aisle 1, Shelf A',callNumber:'813.52 FIT',status:'Active',description:'A classic novel of the Jazz Age, frequently assigned for literature and reading activities.'},
      {id:'BK0003',title:'A Brief History of Time',author:'Stephen Hawking',category:'Science',isbn:'978-0553380163',qty:3,available:1,dateAdded:'2024-01-15',subtitle:'From the Big Bang to Black Holes',publisher:'Bantam Books',subject:'Physics / Cosmology',shelfLocation:'Aisle 4, Shelf C',callNumber:'523.1 HAW',status:'Active',description:'An accessible introduction to cosmology, ideal for science research papers.'},
      {id:'BK0004',title:'The Pragmatic Programmer',author:'David Thomas',category:'Technology',isbn:'978-0135957059',qty:4,available:2,dateAdded:'2024-02-01',subtitle:'Your Journey to Mastery',publisher:'Addison-Wesley',subject:'Software Engineering',shelfLocation:'Aisle 3, Shelf B',callNumber:'005.1 THO',status:'Active',description:'Practical advice for software development projects and thesis work.'},
      {id:'BK0005',title:'Sapiens',author:'Yuval Noah Harari',category:'History',isbn:'978-0062316097',qty:6,available:5,dateAdded:'2024-02-10',subtitle:'A Brief History of Humankind',publisher:'Harper',subject:'World History / Anthropology',shelfLocation:'Aisle 2, Shelf A',callNumber:'909 HAR',status:'Active',description:'A sweeping look at human history, popular for general knowledge and history reports.'},
      {id:'BK0006',title:'Introduction to Algorithms',author:'Thomas H. Cormen',category:'Mathematics',isbn:'978-0262033848',qty:3,available:3,dateAdded:'2024-02-14',subtitle:'',publisher:'MIT Press',subject:'Computer Science / Mathematics',shelfLocation:'Aisle 3, Shelf D',callNumber:'005.1 COR',status:'Active',description:'A comprehensive algorithms reference used in computer science coursework.'},
      {id:'BK0007',title:'1984',author:'George Orwell',category:'Fiction',isbn:'978-0451524935',qty:7,available:6,dateAdded:'2024-03-01',subtitle:'',publisher:'Signet Classics',shelfLocation:'Aisle 1, Shelf A',subject:'Dystopian Literature',callNumber:'823.912 ORW',status:'Active',description:'A dystopian classic often assigned for reading activities and literary analysis.'},
      {id:'BK0008',title:'The Republic',author:'Plato',category:'Philosophy',isbn:'978-0872201361',qty:2,available:2,dateAdded:'2024-03-05',subtitle:'',publisher:'Hackett Publishing',subject:'Political Philosophy',shelfLocation:'Aisle 5, Shelf A',callNumber:'321.07 PLA',status:'Active',description:'A foundational philosophical dialogue useful for philosophy and ethics research.'},
      {id:'BK0009',title:'Thinking, Fast and Slow',author:'Daniel Kahneman',category:'Non-Fiction',isbn:'978-0374533557',qty:5,available:3,dateAdded:'2024-03-20',subtitle:'',publisher:'Farrar, Straus and Giroux',subject:'Psychology / Behavioral Economics',shelfLocation:'Aisle 2, Shelf B',callNumber:'153.4 KAH',status:'Active',description:'An exploration of decision-making, useful for psychology and business research.'},
      {id:'BK0010',title:'Design Patterns',author:'Gang of Four',category:'Technology',isbn:'978-0201633610',qty:3,available:1,dateAdded:'2024-04-01',subtitle:'Elements of Reusable Object-Oriented Software',publisher:'Addison-Wesley',subject:'Software Engineering',shelfLocation:'Aisle 3, Shelf B',callNumber:'005.1 GAN',status:'Active',description:'The classic catalog of software design patterns for programming projects.'},
    ];
  },

  _seedUsers() {
    return [
      {id:'US0001',name:'Ana Marie Santos',dept:'Computer Science',email:'ana.santos@ndmc.edu.ph',contact:'09171234567',regDate:'2024-01-08'},
      {id:'US0002',name:'Juan Carlos Reyes',dept:'Engineering',email:'jc.reyes@ndmc.edu.ph',contact:'09281234567',regDate:'2024-01-09'},
      {id:'US0003',name:'Maria Clara Dela Cruz',dept:'Business',email:'mclara@ndmc.edu.ph',contact:'09331234567',regDate:'2024-01-15'},
      {id:'US0004',name:'Roberto Fajardo',dept:'Arts',email:'rob.fajardo@ndmc.edu.ph',contact:'09451234567',regDate:'2024-02-01'},
      {id:'US0005',name:'Lorena Evangelista',dept:'Medicine',email:'lorena.e@ndmc.edu.ph',contact:'09561234567',regDate:'2024-02-10'},
      {id:'US0006',name:'Mark Anthony Tan',dept:'Computer Science',email:'mark.tan@ndmc.edu.ph',contact:'09671234567',regDate:'2024-02-18'},
      {id:'US0007',name:'Christine Joy Bautista',dept:'Education',email:'cj.bautista@ndmc.edu.ph',contact:'09781234567',regDate:'2024-03-01'},
      {id:'US0008',name:'Jose Miguel Flores',dept:'Law',email:'jm.flores@ndmc.edu.ph',contact:'09891234567',regDate:'2024-03-12'},
    ];
  },

  _seedTrans() {
    const d = (offset) => { const dt=new Date(); dt.setDate(dt.getDate()+offset); return dt.toISOString().split('T')[0]; };
    return [
      {id:'TX0001',userId:'US0001',bookId:'BK0001',borrowDate:d(-20),dueDate:d(-6), returnDate:d(-8), status:'Returned'},
      {id:'TX0002',userId:'US0002',bookId:'BK0003',borrowDate:d(-15),dueDate:d(-1), returnDate:null, status:'Overdue'},
      {id:'TX0003',userId:'US0003',bookId:'BK0005',borrowDate:d(-10),dueDate:d(4),  returnDate:null, status:'Borrowed'},
      {id:'TX0004',userId:'US0004',bookId:'BK0007',borrowDate:d(-8), dueDate:d(6),  returnDate:null, status:'Borrowed'},
      {id:'TX0005',userId:'US0005',bookId:'BK0009',borrowDate:d(-18),dueDate:d(-4), returnDate:null, status:'Overdue'},
      {id:'TX0006',userId:'US0006',bookId:'BK0004',borrowDate:d(-12),dueDate:d(2),  returnDate:null, status:'Borrowed'},
      {id:'TX0007',userId:'US0001',bookId:'BK0002',borrowDate:d(-25),dueDate:d(-11),returnDate:d(-12),status:'Returned'},
      {id:'TX0008',userId:'US0007',bookId:'BK0010',borrowDate:d(-14),dueDate:d(0),  returnDate:null, status:'Overdue'},
      {id:'TX0009',userId:'US0008',bookId:'BK0006',borrowDate:d(-5), dueDate:d(9),  returnDate:null, status:'Borrowed'},
      {id:'TX0010',userId:'US0002',bookId:'BK0001',borrowDate:d(-30),dueDate:d(-16),returnDate:d(-17),status:'Returned'},
    ];
  },

  _seedReservations() {
    const d = (offset) => { const dt=new Date(); dt.setDate(dt.getDate()+offset); return dt.toISOString().split('T')[0]; };
    return [
      {id:'RS0001',userId:'US0006',bookId:'BK0003',reservedDate:d(-2),status:'Pending'},
      {id:'RS0002',userId:'US0007',bookId:'BK0010',reservedDate:d(-1),status:'Pending'},
    ];
  },

  _seedIssues() {
    const d = (offset) => { const dt=new Date(); dt.setDate(dt.getDate()+offset); return dt.toISOString().split('T')[0]; };
    return [
      {id:'IR0001',transactionId:'TX0002',userId:'US0002',bookId:'BK0003',issueType:'Torn Pages',description:'Pages 45-47 have a tear along the spine side, roughly 3 cm long. The text is still readable but the damage is noticeable. It was already present when I borrowed it.',reportDate:d(-10),severity:'Moderate'},
      {id:'IR0002',transactionId:'TX0005',userId:'US0005',bookId:'BK0009',issueType:'Water Damage',description:'The bottom corner of the book got wet when my bag was caught in rain. Pages 150-160 have slight water marks and mild wrinkling. I apologize for this and am willing to pay for any applicable fee.',reportDate:d(-5),severity:'Minor'},
      {id:'IR0003',transactionId:'TX0001',userId:'US0001',bookId:'BK0001',issueType:'Good Condition',description:'Returning the book in the same condition as when I borrowed it. No damage, no missing pages, spine intact.',reportDate:d(-8),severity:'None'},
    ];
  }
};

/* ============================================================
   UTILS
   ============================================================ */
const Utils = {
  formatDate(s) {
    if (!s) return '—';
    try { return new Date(s).toLocaleDateString('en-PH',{year:'numeric',month:'short',day:'2-digit'}); }
    catch { return s; }
  },
  today() { return new Date().toISOString().split('T')[0]; },
  daysOverdue(due) {
    if (!due) return 0;
    const d=new Date(due), n=new Date();
    d.setHours(0,0,0,0); n.setHours(0,0,0,0);
    return Math.max(0, Math.floor((n-d)/86400000));
  },
  daysUntilDue(due) {
    if (!due) return null;
    const d=new Date(due), n=new Date();
    d.setHours(0,0,0,0); n.setHours(0,0,0,0);
    return Math.floor((d-n)/86400000);
  },
  getBook(id) { return DB.books.find(b=>b.id===id); },
  getUser(id) { return DB.users.find(u=>u.id===id); },
  statusPill(status) {
    const cls={Borrowed:'borrowed',Returned:'returned',Overdue:'overdue'};
    const dot={Borrowed:'●',Returned:'✓',Overdue:'⚠'};
    return `<span class="status-pill ${cls[status]||''}">${dot[status]||''} ${status}</span>`;
  },
  // Severity badge for issue reports
  severityPill(severity) {
    const map = {
      'None':     {cls:'returned', icon:'✓'},
      'Minor':    {cls:'borrowed', icon:'◎'},
      'Moderate': {cls:'overdue',  icon:'⚠'},
      'Severe':   {cls:'overdue',  icon:'✖'},
    };
    const s = map[severity] || {cls:'borrowed', icon:'◎'};
    return `<span class="status-pill ${s.cls}" style="font-size:9px">${s.icon} ${severity||'Unknown'}</span>`;
  },
  calcFine(t) {
    if (!DB.settings.fineEnabled) return null;
    const days = Utils.daysOverdue(t.dueDate);
    if (!days || t.status === 'Returned') return 0;
    return +(days * (DB.settings.finePerDay || 0)).toFixed(2);
  },
  fineLabel(t) {
    const f = Utils.calcFine(t);
    if (f === null) return '—';
    return f > 0 ? `₱${f.toFixed(2)}` : '₱0.00';
  },
  inferSeverity(issueType) {
    if (!issueType || issueType === 'Good Condition (No Issues)') return 'None';
    if (['Torn Pages','Cover Damage','Spine Damage','Stains / Markings'].includes(issueType)) return 'Minor';
    if (['Water Damage','Missing Pages'].includes(issueType)) return 'Moderate';
    if (issueType === 'Lost Book') return 'Severe';
    return 'Minor';
  },
  download(content, filename, type) {
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([content],{type}));
    a.download=filename; a.click();
    URL.revokeObjectURL(a.href);
  },
  toCSV(headers, rows) {
    const e=v=>`"${String(v??'').replace(/"/g,'""')}"`;
    return [headers.map(e).join(','),...rows.map(r=>r.map(e).join(','))].join('\n');
  }
};

/* ============================================================
   CLOCK
   ============================================================ */
function startClock() {
  const tick = () => {
    const now=new Date();
    const cl=document.getElementById('sidebarClock');
    const de=document.getElementById('topbarDate');
    if(cl) cl.textContent=now.toTimeString().split(' ')[0];
    if(de) de.textContent=now.toLocaleDateString('en-PH',{weekday:'short',year:'numeric',month:'short',day:'numeric'});
  };
  tick(); setInterval(tick,1000);
}

/* ============================================================
   NAVIGATION
   ============================================================ */
/* ============================================================
   ROLE-BASED UI
   Shows/hides sidebar sections depending on whether the signed-in
   person is a Librarian or a Student/Faculty user, and updates the
   topbar identity to match.
   ============================================================ */
function applyRoleUI() {
  const role = AUTH.getRole();
  document.body.classList.toggle('role-student', role==='student');
  document.body.classList.toggle('role-librarian', role!=='student');

  document.querySelectorAll('.nav-item').forEach(item=>{
    const roles = (item.dataset.roles||'librarian').split(',');
    item.style.display = roles.includes(role) ? '' : 'none';
  });

  const nameEl=document.getElementById('topbarUserName');
  if(nameEl) nameEl.textContent = AUTH.getDisplayName();
  updateTopbarAvatar();

  updateNotifBadge();
}

// Shows the logged-in student's uploaded profile picture in the topbar,
// falling back to the default person icon when none is set.
function updateTopbarAvatar() {
  const img=document.getElementById('topbarAvatar');
  const icon=document.getElementById('topbarUserIcon');
  if(!img) return;
  const u = AUTH.getRole()==='student' ? Utils.getUser(AUTH.getStudentUserId()) : null;
  if (u && u.avatar) {
    img.src = u.avatar;
    img.style.display = '';
    if(icon) icon.style.display = 'none';
  } else {
    img.style.display = 'none';
    if(icon) icon.style.display = '';
  }
}

function setSidebarOpen(open){
  const sb=document.getElementById('sidebar');
  const bd=document.getElementById('sidebarBackdrop');
  const menuBtn=document.getElementById('menuToggle');
  if(!sb) return;
  sb.classList.toggle('open', open);
  if(bd){
    bd.hidden = false;
    bd.classList.toggle('open', open);
    if(!open){
      // fully remove from the a11y/tab order once the fade-out finishes
      window.setTimeout(()=>{ if(!sb.classList.contains('open')) bd.hidden = true; }, 250);
    }
  }
  menuBtn?.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(item=>{
    item.addEventListener('click',()=>{
      navigateTo(item.dataset.page);
      if(window.innerWidth<960) setSidebarOpen(false);
    });
    // Keyboard accessibility: nav items are focusable <li> elements,
    // so Enter/Space must trigger the same action as a mouse click.
    item.addEventListener('keydown',(e)=>{
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        navigateTo(item.dataset.page);
        if(window.innerWidth<960) setSidebarOpen(false);
      }
    });
  });
  const menuBtn=document.getElementById('menuToggle');
  menuBtn.addEventListener('click',()=>{
    const sb=document.getElementById('sidebar');
    setSidebarOpen(!sb.classList.contains('open'));
  });
  const backdrop=document.getElementById('sidebarBackdrop');
  backdrop?.addEventListener('click', ()=> setSidebarOpen(false));
  window.addEventListener('keydown',(e)=>{
    if(e.key==='Escape') setSidebarOpen(false);
  });
}


function navigateTo(page) {
  document.querySelectorAll('.nav-item').forEach(i=>{
    i.classList.remove('active');
    i.removeAttribute('aria-current');
  });
  const ni=document.querySelector(`.nav-item[data-page="${page}"]`);
  if(ni){ ni.classList.add('active'); ni.setAttribute('aria-current','page'); }

  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pe=document.getElementById(`page-${page}`);
  if(pe) pe.classList.add('active');

  const labels={dashboard:'Dashboard',books:'Book Catalog',users:'User Registry',borrow:'Borrow / Return',reports:'Reports & Analytics',
    mystudent:'My Dashboard',catalog:'Find a Book',mybooks:'My Borrowing',notifications:'Notifications',profile:'My Profile'};
  const pt=document.getElementById('pageTitle');
  if(pt) pt.textContent=labels[page]||page;

  // Breadcrumb: gives users a clear "you are here" trail, reinforcing
  // logical grouping and orientation within the system.
  const bc=document.getElementById('breadcrumb');
  if(bc){
    bc.innerHTML = `<span class="crumb">Home</span><span class="sep" aria-hidden="true">›</span><span class="crumb current">${labels[page]||page}</span>`;
  }
  // Move focus to the page heading so keyboard/screen-reader users
  // land on the new content instead of staying on the nav item.
  const heading = pe ? pe.querySelector('.page-title') : null;
  if(heading){ heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true}); }

  if(page==='dashboard')     refreshDashboard();
  if(page==='books')         renderBooks();
  if(page==='users')         renderUsers();
  if(page==='borrow')        initBorrowPage();
  if(page==='reports')       refreshReports();
  if(page==='mystudent')     renderStudentDashboard();
  if(page==='catalog')       renderCatalog();
  if(page==='mybooks')       renderMyBooks();
  if(page==='notifications') renderNotifications();
  if(page==='profile')       renderStudentProfile();
}

/* ============================================================
   TOAST
   ============================================================ */
let toastTmr=null;
function showToast(msg,type='success') {
  const el=document.getElementById('toast');
  el.textContent=msg; el.className=`toast show ${type}`;
  clearTimeout(toastTmr);
  toastTmr=setTimeout(()=>el.className='toast',3200);
}

/* ============================================================
   DASHBOARD
   ============================================================ */
const charts={};

function refreshDashboard() {
  updateOverdueStatuses();
  const borrowed=DB.transactions.filter(t=>t.status==='Borrowed');
  const overdue =DB.transactions.filter(t=>t.status==='Overdue');
  setEl('statTotalBooks', DB.books.length);
  setEl('statTotalUsers', DB.users.length);
  setEl('statBorrowed',   borrowed.length+overdue.length);
  setEl('statOverdue',    overdue.length);
  buildActivityChart(); buildAvailabilityChart();
  buildTopBooksChart(); buildDeptChart();
  renderRecentTrans();
  updateNotifBadge();
}

function setEl(id,v) { const el=document.getElementById(id); if(el) el.textContent=v; }
function destroyChart(k) { if(charts[k]){charts[k].destroy();delete charts[k];} }

const CHART_OPTS = {
  plugins:{legend:{labels:{color:'#9db89a',font:{family:'Fira Code',size:10},boxWidth:12,padding:14}}},
  scales:{
    x:{ticks:{color:'#4a6550',font:{family:'Fira Code',size:9}},grid:{color:'rgba(255,255,255,.04)'}},
    y:{ticks:{color:'#4a6550',font:{family:'Fira Code',size:9}},grid:{color:'rgba(255,255,255,.04)'}}
  }
};

function buildActivityChart() {
  destroyChart('act'); const ctx=document.getElementById('activityChart'); if(!ctx)return;
  const days=[],borrow=[],returned=[];
  for(let i=6;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    const k=d.toISOString().split('T')[0];
    days.push(d.toLocaleDateString('en',{month:'short',day:'numeric'}));
    borrow.push(DB.transactions.filter(t=>t.borrowDate===k).length);
    returned.push(DB.transactions.filter(t=>t.returnDate===k).length);
  }
  charts.act=new Chart(ctx,{type:'line',data:{labels:days,datasets:[
    {label:'Borrowed',data:borrow,borderColor:'#3ab85a',backgroundColor:'rgba(58,184,90,.08)',tension:.45,pointBackgroundColor:'#3ab85a',pointRadius:4,fill:true},
    {label:'Returned',data:returned,borderColor:'#c9a22a',backgroundColor:'rgba(201,162,42,.08)',tension:.45,pointBackgroundColor:'#c9a22a',pointRadius:4,fill:true}
  ]},options:{responsive:true,...CHART_OPTS}});
}

function buildAvailabilityChart() {
  destroyChart('avail'); const ctx=document.getElementById('availabilityChart'); if(!ctx)return;
  const avail=DB.books.reduce((s,b)=>s+b.available,0);
  const out=DB.books.reduce((s,b)=>s+(b.qty-b.available),0);
  charts.avail=new Chart(ctx,{type:'doughnut',data:{labels:['Available','Borrowed'],datasets:[{
    data:[avail,out],
    backgroundColor:['rgba(58,184,90,.75)','rgba(201,162,42,.75)'],
    borderColor:['#3ab85a','#c9a22a'],borderWidth:1,hoverOffset:8
  }]},options:{responsive:true,cutout:'65%',plugins:{legend:{position:'bottom',labels:{color:'#9db89a',font:{family:'Fira Code',size:10},boxWidth:10,padding:14}}}}});
}

function buildTopBooksChart() {
  destroyChart('top'); const ctx=document.getElementById('topBooksChart'); if(!ctx)return;
  const cnt={};
  DB.transactions.forEach(t=>cnt[t.bookId]=(cnt[t.bookId]||0)+1);
  const sorted=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const labels=sorted.map(([id])=>Utils.getBook(id)?.title?.substring(0,16)||id);
  const data=sorted.map(([,c])=>c);
  charts.top=new Chart(ctx,{type:'bar',data:{labels,datasets:[{label:'Borrows',data,
    backgroundColor:'rgba(29,107,53,.6)',borderColor:'#1d6b35',borderWidth:1,borderRadius:4,
    hoverBackgroundColor:'rgba(58,184,90,.7)'
  }]},options:{responsive:true,indexAxis:'y',plugins:{legend:{display:false}},
    scales:{x:{ticks:{color:'#4a6550',font:{family:'Fira Code',size:9}},grid:{color:'rgba(255,255,255,.04)'}},
      y:{ticks:{color:'#9db89a',font:{family:'Fira Code',size:9}},grid:{display:false}}}}});
}

function buildDeptChart() {
  destroyChart('dept'); const ctx=document.getElementById('deptChart'); if(!ctx)return;
  const cnt={};
  DB.transactions.forEach(t=>{const u=Utils.getUser(t.userId);if(u)cnt[u.dept]=(cnt[u.dept]||0)+1;});
  const labels=Object.keys(cnt),data=Object.values(cnt);
  const palette=['#3ab85a','#c9a22a','#1a9e7e','#8bc34a','#e8c048','#259044','#1d6b35','#a5d6a7'];
  charts.dept=new Chart(ctx,{type:'pie',data:{labels,datasets:[{data,
    backgroundColor:palette.slice(0,labels.length).map(c=>c+'bb'),
    borderColor:palette.slice(0,labels.length),borderWidth:1,hoverOffset:6
  }]},options:{responsive:true,plugins:{legend:{position:'bottom',labels:{color:'#9db89a',font:{family:'Fira Code',size:9},boxWidth:10,padding:10}}}}});
}

function renderRecentTrans() {
  const tbody=document.getElementById('recentTransBody'); if(!tbody)return;
  const recent=[...DB.transactions].slice(-8).reverse();
  if(!recent.length){tbody.innerHTML='<tr><td colspan="6" class="empty-state">No transactions recorded</td></tr>';return;}
  tbody.innerHTML=recent.map(t=>{
    const u=Utils.getUser(t.userId),b=Utils.getBook(t.bookId);
    return `<tr><td>${t.id}</td><td>${u?.name||t.userId}</td><td>${b?.title||t.bookId}</td>
    <td>${Utils.formatDate(t.borrowDate)}</td><td>${Utils.formatDate(t.dueDate)}</td>
    <td>${Utils.statusPill(t.status)}</td></tr>`;
  }).join('');
}

/* ============================================================
   BOOKS
   ============================================================ */
function renderBooks(list=null) {
  const data=list??DB.books, tbody=document.getElementById('booksBody'); if(!tbody)return;
  if(!data.length){tbody.innerHTML='<tr><td colspan="9" class="empty-state">No books found</td></tr>';return;}
  tbody.innerHTML=data.map(b=>`<tr>
    <td>${b.id}</td><td>${b.title}</td><td>${b.author}</td><td>${b.category}</td>
    <td>${b.isbn||'—'}</td><td>${b.qty}</td>
    <td><span class="status-pill ${b.available>0?'returned':'overdue'}">${b.available} / ${b.qty}</span></td>
    <td>${Utils.formatDate(b.dateAdded)}</td>
    <td><button class="act-edit" onclick="openBookModal('${b.id}')">Edit</button>
        <button class="act-del"  onclick="deleteBook('${b.id}')">Delete</button></td>
  </tr>`).join('');
}

function filterBooks() {
  const q=document.getElementById('bookSearch')?.value.toLowerCase()||'';
  const cat=document.getElementById('bookCategoryFilter')?.value||'';
  renderBooks(DB.books.filter(b=>(!q||b.title.toLowerCase().includes(q)||b.author.toLowerCase().includes(q)||b.category.toLowerCase().includes(q))&&(!cat||b.category===cat)));
}

/* ============================================================
   INLINE FIELD VALIDATION (accessible error messaging)
   Pairs a visible message with aria-live so screen readers
   announce it, plus a visual "invalid" state on the input.
   ============================================================ */
function setFieldError(inputId, msg) {
  const input=document.getElementById(inputId);
  const err=document.getElementById(inputId+'Error');
  if(input) input.classList.toggle('invalid', !!msg);
  if(input) input.setAttribute('aria-invalid', msg?'true':'false');
  if(err) err.textContent = msg || '';
}
function clearFieldErrors(...ids){ ids.forEach(id=>setFieldError(id,'')); }

function openBookModal(id=null) {
  const overlay=document.getElementById('bookModalOverlay');
  clearFieldErrors('bookTitle','bookAuthor','bookQty');
  if(id){
    const b=Utils.getBook(id); if(!b)return;
    document.getElementById('bookModalTitle').textContent='Edit Book';
    document.getElementById('editBookId').value=b.id;
    document.getElementById('bookTitle').value=b.title;
    document.getElementById('bookAuthor').value=b.author;
    document.getElementById('bookCategory').value=b.category;
    document.getElementById('bookISBN').value=b.isbn||'';
    document.getElementById('bookQty').value=b.qty;
    document.getElementById('bookDateAdded').value=b.dateAdded||'';
    document.getElementById('bookSubtitle').value=b.subtitle||'';
    document.getElementById('bookPublisher').value=b.publisher||'';
    document.getElementById('bookSubject').value=b.subject||'';
    document.getElementById('bookShelf').value=b.shelfLocation||'';
    document.getElementById('bookCallNumber').value=b.callNumber||'';
    document.getElementById('bookStatus').value=b.status||'Active';
    document.getElementById('bookDescription').value=b.description||'';
  } else {
    document.getElementById('bookModalTitle').textContent='Add New Book';
    ['editBookId','bookTitle','bookAuthor','bookISBN','bookQty','bookSubtitle','bookPublisher','bookSubject','bookShelf','bookCallNumber','bookDescription'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('bookDateAdded').value=Utils.today();
    document.getElementById('bookCategory').selectedIndex=0;
    document.getElementById('bookStatus').selectedIndex=0;
  }
  overlay.classList.add('open');
}
function closeBookModal(){document.getElementById('bookModalOverlay').classList.remove('open');}

function saveBook() {
  const id=document.getElementById('editBookId').value;
  const title=document.getElementById('bookTitle').value.trim();
  const author=document.getElementById('bookAuthor').value.trim();
  const qty=parseInt(document.getElementById('bookQty').value);

  clearFieldErrors('bookTitle','bookAuthor','bookQty');
  let hasError=false;
  if(!title){ setFieldError('bookTitle','Title is required.'); hasError=true; }
  if(!author){ setFieldError('bookAuthor','Author is required.'); hasError=true; }
  if(!qty||qty<1){ setFieldError('bookQty','Enter a quantity of at least 1.'); hasError=true; }
  if(hasError){
    showToast('Please fix the highlighted fields','error');
    document.getElementById(!title?'bookTitle':!author?'bookAuthor':'bookQty').focus();
    return;
  }
  const extra={
    subtitle:document.getElementById('bookSubtitle').value.trim(),
    publisher:document.getElementById('bookPublisher').value.trim(),
    subject:document.getElementById('bookSubject').value.trim(),
    shelfLocation:document.getElementById('bookShelf').value.trim(),
    callNumber:document.getElementById('bookCallNumber').value.trim(),
    status:document.getElementById('bookStatus').value,
    description:document.getElementById('bookDescription').value.trim()
  };
  if(id){
    const idx=DB.books.findIndex(b=>b.id===id);
    const borrowed=DB.books[idx].qty-DB.books[idx].available;
    DB.books[idx]={...DB.books[idx],title,author,category:document.getElementById('bookCategory').value,
      isbn:document.getElementById('bookISBN').value.trim(),qty,available:Math.max(0,qty-borrowed),
      dateAdded:document.getElementById('bookDateAdded').value,...extra};
    showToast(`"${title}" updated`);
  } else {
    DB.books.push({id:DB.nextId(DB.books,'BK'),title,author,category:document.getElementById('bookCategory').value,
      isbn:document.getElementById('bookISBN').value.trim(),qty,available:qty,
      dateAdded:document.getElementById('bookDateAdded').value||Utils.today(),...extra});
    showToast(`"${title}" added to catalog`);
  }
  DB.save(); closeBookModal(); renderBooks();
}

function deleteBook(id) {
  const b=Utils.getBook(id); if(!b)return;
  if(DB.transactions.some(t=>t.bookId===id&&t.status!=='Returned'))return showToast('Cannot delete: book has active borrows','warning');
  if(!confirm(`Delete "${b.title}"?`))return;
  DB.books=DB.books.filter(x=>x.id!==id);
  DB.save(); renderBooks(); showToast(`"${b.title}" removed`);
}

/* ============================================================
   USERS
   ============================================================ */
function renderUsers(list=null) {
  const data=list??DB.users, tbody=document.getElementById('usersBody'); if(!tbody)return;
  if(!data.length){tbody.innerHTML='<tr><td colspan="7" class="empty-state">No users found</td></tr>';return;}
  tbody.innerHTML=data.map(u=>`<tr>
    <td>${u.id}</td><td>${u.name}</td><td>${u.dept}</td><td>${u.email}</td>
    <td>${u.contact||'—'}</td><td>${Utils.formatDate(u.regDate)}</td>
    <td><button class="act-edit" onclick="openUserModal('${u.id}')">Edit</button>
        <button class="act-del"  onclick="deleteUser('${u.id}')">Delete</button></td>
  </tr>`).join('');
}

function filterUsers() {
  const q=document.getElementById('userSearch')?.value.toLowerCase()||'';
  const dept=document.getElementById('deptFilter')?.value||'';
  renderUsers(DB.users.filter(u=>(!q||u.name.toLowerCase().includes(q)||u.email.toLowerCase().includes(q))&&(!dept||u.dept===dept)));
}

function openUserModal(id=null) {
  clearFieldErrors('userName','userEmail');
  if(id){
    const u=Utils.getUser(id); if(!u)return;
    document.getElementById('userModalTitle').textContent='Edit User';
    document.getElementById('editUserId').value=u.id;
    document.getElementById('userName').value=u.name;
    document.getElementById('userDept').value=u.dept;
    document.getElementById('userEmail').value=u.email;
    document.getElementById('userContact').value=u.contact||'';
  } else {
    document.getElementById('userModalTitle').textContent='Register New User';
    ['editUserId','userName','userEmail','userContact'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('userDept').selectedIndex=0;
  }
  document.getElementById('userModalOverlay').classList.add('open');
}
function closeUserModal(){document.getElementById('userModalOverlay').classList.remove('open');}

function saveUser() {
  const id=document.getElementById('editUserId').value;
  const name=document.getElementById('userName').value.trim();
  const email=document.getElementById('userEmail').value.trim();
  const dept=document.getElementById('userDept').value;
  const contact=document.getElementById('userContact').value.trim();

  clearFieldErrors('userName','userEmail');
  let hasError=false;
  if(!name){ setFieldError('userName','Full name is required.'); hasError=true; }
  if(!email||!/^\S+@\S+\.\S+$/.test(email)){ setFieldError('userEmail','Enter a valid email address.'); hasError=true; }
  else if(DB.users.find(u=>u.email===email&&u.id!==id)){ setFieldError('userEmail','This email is already registered.'); hasError=true; }
  if(hasError){
    showToast('Please fix the highlighted fields','error');
    document.getElementById(!name?'userName':'userEmail').focus();
    return;
  }
  if(id){
    const idx=DB.users.findIndex(u=>u.id===id);
    DB.users[idx]={...DB.users[idx],name,dept,email,contact};
    showToast(`${name} updated`);
  } else {
    DB.users.push({id:DB.nextId(DB.users,'US'),name,dept,email,contact,regDate:Utils.today()});
    showToast(`${name} registered`);
  }
  DB.save(); closeUserModal(); renderUsers();
}

function deleteUser(id) {
  const u=Utils.getUser(id); if(!u)return;
  if(DB.transactions.some(t=>t.userId===id&&t.status!=='Returned'))return showToast('Cannot delete: user has active borrows','warning');
  if(!confirm(`Remove "${u.name}" from registry?`))return;
  DB.users=DB.users.filter(x=>x.id!==id);
  DB.save(); renderUsers(); showToast(`${u.name} removed`);
}

/* ============================================================
   BORROW / RETURN
   ============================================================ */
function initBorrowPage() {
  // Users dropdown
  const usel=document.getElementById('borrowUserId');
  if(usel) usel.innerHTML='<option value="">— Select User —</option>'+
    DB.users.map(u=>`<option value="${u.id}">${u.id} — ${u.name}</option>`).join('');

  // Books dropdown (available only)
  const bsel=document.getElementById('borrowBookId');
  const avail=DB.books.filter(b=>b.available>0);
  if(bsel) bsel.innerHTML=(avail.length
    ?'<option value="">— Select Book —</option>'+avail.map(b=>`<option value="${b.id}">${b.id} — ${b.title} (${b.available} avail.)</option>`).join('')
    :'<option>No available books</option>');

  // Default dates
  const today=Utils.today();
  const due14=new Date(); due14.setDate(due14.getDate()+14);
  const bd=document.getElementById('borrowDate'),dd=document.getElementById('dueDate');
  if(bd)bd.value=today; if(dd)dd.value=due14.toISOString().split('T')[0];

  // Return dropdown
  const rsel=document.getElementById('returnTransId');
  const active=DB.transactions.filter(t=>t.status!=='Returned');
  if(rsel) rsel.innerHTML=(active.length
    ?'<option value="">— Select Transaction —</option>'+active.map(t=>{const b=Utils.getBook(t.bookId),u=Utils.getUser(t.userId);return `<option value="${t.id}">${t.id} — ${u?.name||''} / ${b?.title||''}</option>`;}).join('')
    :'<option>No active borrows</option>');

  const rd=document.getElementById('returnDate'); if(rd)rd.value=today;
  document.getElementById('returnPreview').style.display='none';

  // Issue report dropdown — all active (non-returned) transactions
  populateIssueDropdown();

  // Issue report date default
  const ird=document.getElementById('issueReportDate'); if(ird)ird.value=today;
  document.getElementById('issueTxnPreview').style.display='none';

  // Render all tables
  renderActiveBorrows();
  renderTransactions();
  renderIssueHistory();
  renderReservations();
}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('returnTransId')?.addEventListener('change',previewReturn);
  document.getElementById('bookSearch')?.addEventListener('input',filterBooks);
  document.getElementById('userSearch')?.addEventListener('input',filterUsers);
  document.getElementById('activeBorrowSearch')?.addEventListener('input',renderActiveBorrows);
  document.getElementById('catSearch')?.addEventListener('input',renderCatalog);
});

function populateIssueDropdown() {
  const sel = document.getElementById('issueTransId');
  if (!sel) return;
  const active = DB.transactions.filter(t => t.status !== 'Returned');
  sel.innerHTML = active.length
    ? '<option value="">— Select Transaction —</option>' + active.map(t => {
        const b = Utils.getBook(t.bookId), u = Utils.getUser(t.userId);
        return `<option value="${t.id}">${t.id} — ${u?.name||t.userId} → ${b?.title||t.bookId}</option>`;
      }).join('')
    : '<option value="">No active borrows to report</option>';
}

function previewIssueTransaction() {
  const id = document.getElementById('issueTransId').value;
  const preview = document.getElementById('issueTxnPreview');
  if (!id) { preview.style.display = 'none'; return; }
  const t = DB.transactions.find(x => x.id === id);
  if (!t) return;
  const b = Utils.getBook(t.bookId), u = Utils.getUser(t.userId);
  document.getElementById('issuePreviewBook').textContent = b?.title || t.bookId;
  document.getElementById('issuePreviewUser').textContent = u?.name || t.userId;
  document.getElementById('issuePreviewDate').textContent = Utils.formatDate(t.borrowDate);
  preview.style.display = 'block';
}

function submitIssueReport() {
  const transId     = document.getElementById('issueTransId').value;
  const issueType   = document.getElementById('issueType').value;
  const description = document.getElementById('issueDescription').value.trim();
  const reportDate  = document.getElementById('issueReportDate').value;

  if (!transId)    return showToast('Select a transaction to report','error');
  if (!issueType)  return showToast('Select an issue type','error');
  if (!description) return showToast('Please provide a description','error');
  if (!reportDate)  return showToast('Set the report date','error');

  const t = DB.transactions.find(x => x.id === transId);
  if (!t) return showToast('Transaction not found','error');

  const severity = Utils.inferSeverity(issueType);

  DB.issues.push({
    id: DB.nextId(DB.issues, 'IR'),
    transactionId: transId,
    userId: t.userId,
    bookId: t.bookId,
    issueType,
    description,
    reportDate,
    severity
  });
  DB.save();

  // Reset form
  document.getElementById('issueTransId').value = '';
  document.getElementById('issueType').value = '';
  document.getElementById('issueDescription').value = '';
  document.getElementById('issueTxnPreview').style.display = 'none';

  const b = Utils.getBook(t.bookId);
  showToast(`Issue report for "${b?.title||t.bookId}" recorded (${severity})`, severity === 'Severe' ? 'error' : 'success');
  renderIssueHistory();
}

/* ============================================================
   ISSUE HISTORY TABLE (Borrow page)
   ============================================================ */
function renderIssueHistory() {
  const tbody = document.getElementById('issueHistoryBody');
  const badge = document.getElementById('issueCount');
  if (!tbody) return;

  if (badge) badge.textContent = `${DB.issues.length} Report${DB.issues.length !== 1 ? 's' : ''}`;

  if (!DB.issues.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No issue reports submitted yet</td></tr>';
    return;
  }

  tbody.innerHTML = [...DB.issues].reverse().map(r => {
    const u = Utils.getUser(r.userId);
    const b = Utils.getBook(r.bookId);
    const truncated = r.description.length > 55
      ? r.description.substring(0, 55) + '…'
      : r.description;
    return `<tr class="${r.severity === 'Severe' ? 'overdue-tr' : ''}">
      <td><span style="font-family:var(--font-mono);font-size:11px">${r.id}</span></td>
      <td>${u?.name || r.userId}</td>
      <td><strong style="color:var(--text-bright)">${b?.title || r.bookId}</strong></td>
      <td><span class="issue-type-tag">${r.issueType}</span></td>
      <td>${Utils.formatDate(r.reportDate)}</td>
      <td>${Utils.severityPill(r.severity)}</td>
    </tr>`;
  }).join('');
}

function previewReturn() {
  const id=document.getElementById('returnTransId').value;
  const preview=document.getElementById('returnPreview');
  if(!id){preview.style.display='none';return;}
  const t=DB.transactions.find(x=>x.id===id); if(!t)return;
  const b=Utils.getBook(t.bookId),u=Utils.getUser(t.userId);
  const od=Utils.daysOverdue(t.dueDate);
  document.getElementById('previewBook').textContent=b?.title||t.bookId;
  document.getElementById('previewUser').textContent=u?.name||t.userId;
  document.getElementById('previewDue').textContent=Utils.formatDate(t.dueDate);
  document.getElementById('previewStatus').innerHTML=od>0
    ?`<span style="color:var(--red)">Overdue by ${od} day(s)</span>`
    :'<span style="color:var(--green-lite)">On time</span>';
  preview.style.display='block';
}

/* ============================================================
   CURRENTLY BORROWED BOOKS TABLE
   ============================================================ */
function renderActiveBorrows() {
  const tbody = document.getElementById('activeBorrowsBody');
  const countBadge = document.getElementById('activeBorrowCount');
  if (!tbody) return;

  const q = (document.getElementById('activeBorrowSearch')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('activeBorrowStatusFilter')?.value || '';

  let active = DB.transactions.filter(t => t.status !== 'Returned');
  if (statusFilter) active = active.filter(t => t.status === statusFilter);
  if (q) {
    active = active.filter(t => {
      const u = Utils.getUser(t.userId);
      const b = Utils.getBook(t.bookId);
      return (u?.name||'').toLowerCase().includes(q)
          || (u?.dept||'').toLowerCase().includes(q)
          || (b?.title||'').toLowerCase().includes(q)
          || (b?.author||'').toLowerCase().includes(q)
          || t.id.toLowerCase().includes(q);
    });
  }

  const totalActive = DB.transactions.filter(t => t.status !== 'Returned').length;
  if (countBadge) countBadge.textContent = `${totalActive} Active`;

  if (!active.length) {
    tbody.innerHTML = `<tr><td colspan="10" class="empty-state">${
      q || statusFilter ? 'No matching records found' : '✓ No books currently borrowed'
    }</td></tr>`;
    return;
  }

  tbody.innerHTML = active.map(t => {
    const u = Utils.getUser(t.userId);
    const b = Utils.getBook(t.bookId);
    const daysLeft = Utils.daysUntilDue(t.dueDate);
    const isOverdue = t.status === 'Overdue';

    let daysCell;
    if (isOverdue) {
      const od = Utils.daysOverdue(t.dueDate);
      daysCell = `<span style="color:var(--red);font-family:var(--font-mono);font-weight:700">+${od}d overdue</span>`;
    } else if (daysLeft === 0) {
      daysCell = `<span style="color:var(--gold-lite);font-family:var(--font-mono)">Due today</span>`;
    } else if (daysLeft <= 3) {
      daysCell = `<span style="color:var(--gold);font-family:var(--font-mono)">${daysLeft}d left ⚡</span>`;
    } else {
      daysCell = `<span style="color:var(--teal);font-family:var(--font-mono)">${daysLeft}d left</span>`;
    }

    const rowClass = isOverdue ? 'overdue-tr' : '';
    return `<tr class="${rowClass}">
      <td><span style="font-family:var(--font-mono);font-size:11px">${t.id}</span></td>
      <td>${u?.name || t.userId}</td>
      <td><span style="color:var(--text-dim);font-size:12px">${u?.dept || '—'}</span></td>
      <td><strong style="color:var(--text-bright)">${b?.title || t.bookId}</strong></td>
      <td style="color:var(--text-dim);font-size:12px">${b?.author || '—'}</td>
      <td><span class="status-pill borrowed" style="font-size:9px">${b?.category || '—'}</span></td>
      <td>${Utils.formatDate(t.borrowDate)}</td>
      <td>${Utils.formatDate(t.dueDate)}</td>
      <td>${daysCell}</td>
      <td>${Utils.statusPill(t.status)}</td>
    </tr>`;
  }).join('');
}

function borrowBook() {
  const userId=document.getElementById('borrowUserId').value;
  const bookId=document.getElementById('borrowBookId').value;
  const borrowDate=document.getElementById('borrowDate').value;
  const dueDate=document.getElementById('dueDate').value;
  if(!userId)return showToast('Select a user','error');
  if(!bookId)return showToast('Select a book','error');
  if(!borrowDate)return showToast('Set borrow date','error');
  if(!dueDate)return showToast('Set due date','error');
  if(dueDate<borrowDate)return showToast('Due date must be after borrow date','error');
  if(DB.transactions.find(t=>t.userId===userId&&t.bookId===bookId&&t.status!=='Returned'))
    return showToast('User already has this book borrowed','warning');
  const bidx=DB.books.findIndex(b=>b.id===bookId);
  if(bidx===-1||DB.books[bidx].available<1)return showToast('Book not available','error');
  DB.books[bidx].available--;
  DB.transactions.push({id:DB.nextId(DB.transactions,'TX'),userId,bookId,borrowDate,dueDate,returnDate:null,status:'Borrowed'});
  const borrowedTitle = Utils.getBook(bookId)?.title || bookId;
  notifyStudent(userId, bookId, 'borrow', `You have borrowed "${borrowedTitle}".`);
  notifyStudent(userId, bookId, 'care', `Please make sure "${borrowedTitle}" is returned in good condition and has no damage.`);
  DB.save();
  showToast(`"${borrowedTitle}" borrowed successfully — SMS & Gmail notification sent`);
  initBorrowPage();
}

function returnBook() {
  const txnId=document.getElementById('returnTransId').value;
  const returnDate=document.getElementById('returnDate').value;
  if(!txnId)return showToast('Select a transaction','error');
  if(!returnDate)return showToast('Set return date','error');
  const tidx=DB.transactions.findIndex(t=>t.id===txnId);
  if(tidx===-1)return showToast('Transaction not found','error');
  const t=DB.transactions[tidx];
  if(t.status==='Returned')return showToast('Already returned','warning');
  if(returnDate<t.borrowDate)return showToast('Return date before borrow date','error');
  DB.transactions[tidx].returnDate=returnDate;
  DB.transactions[tidx].status='Returned';
  const bidx=DB.books.findIndex(b=>b.id===t.bookId);
  if(bidx!==-1)DB.books[bidx].available++;
  DB.save();
  showToast(`"${Utils.getBook(t.bookId)?.title}" returned`);
  initBorrowPage();
}

function renderTransactions(list=null) {
  const data=list??DB.transactions, tbody=document.getElementById('transBody'); if(!tbody)return;
  if(!data.length){tbody.innerHTML='<tr><td colspan="7" class="empty-state">No transactions found</td></tr>';return;}
  tbody.innerHTML=[...data].reverse().map(t=>{
    const u=Utils.getUser(t.userId),b=Utils.getBook(t.bookId);
    const rc=t.status==='Overdue'?'overdue-tr':'';
    return `<tr class="${rc}"><td>${t.id}</td><td>${u?.name||t.userId}</td><td>${b?.title||t.bookId}</td>
    <td>${Utils.formatDate(t.borrowDate)}</td><td>${Utils.formatDate(t.dueDate)}</td>
    <td>${Utils.formatDate(t.returnDate)}</td><td>${Utils.statusPill(t.status)}</td></tr>`;
  }).join('');
}

function filterTransactions() {
  const s=document.getElementById('txnStatusFilter').value;
  renderTransactions(s?DB.transactions.filter(t=>t.status===s):DB.transactions);
}

/* ============================================================
   RESERVATIONS (librarian queue)
   ============================================================ */
function renderReservations() {
  const tbody=document.getElementById('reservationBody');
  const badge=document.getElementById('reservationCount');
  if(!tbody) return;
  const pending=DB.reservations.filter(r=>r.status==='Pending');
  if(badge) badge.textContent=`${pending.length} Pending`;
  if(!DB.reservations.length){
    tbody.innerHTML='<tr><td colspan="6" class="empty-state">No reservations yet</td></tr>';
    return;
  }
  tbody.innerHTML=[...DB.reservations].reverse().map(r=>{
    const u=Utils.getUser(r.userId), b=Utils.getBook(r.bookId);
    const canApprove = r.status==='Pending';
    const cls={Pending:'borrowed',Fulfilled:'returned',Cancelled:'overdue'}[r.status]||'borrowed';
    return `<tr>
      <td><span style="font-family:var(--font-mono);font-size:11px">${r.id}</span></td>
      <td>${u?.name||r.userId}</td>
      <td><strong style="color:var(--text-bright)">${b?.title||r.bookId}</strong></td>
      <td>${Utils.formatDate(r.reservedDate)}</td>
      <td><span class="status-pill ${cls}">${r.status}</span></td>
      <td>${canApprove?`<button class="act-edit" onclick="approveReservation('${r.id}')">Approve</button>
        <button class="act-del" onclick="cancelReservation('${r.id}')">Cancel</button>`:'—'}</td>
    </tr>`;
  }).join('');
}

function approveReservation(id) {
  const r=DB.reservations.find(x=>x.id===id); if(!r||r.status!=='Pending')return;
  const b=Utils.getBook(r.bookId);
  if(!b||b.available<1){ showToast('No copies available yet — reservation stays in queue','warning'); return; }
  b.available--;
  const due=new Date(); due.setDate(due.getDate()+14);
  DB.transactions.push({id:DB.nextId(DB.transactions,'TX'),userId:r.userId,bookId:r.bookId,
    borrowDate:Utils.today(),dueDate:due.toISOString().split('T')[0],returnDate:null,status:'Borrowed',renewCount:0});
  r.status='Fulfilled';
  DB.save();
  showToast(`Reservation approved — "${b.title}" issued to ${Utils.getUser(r.userId)?.name||r.userId}`);
  renderReservations(); renderTransactions(); renderActiveBorrows(); initBorrowPage();
}

function cancelReservation(id) {
  const r=DB.reservations.find(x=>x.id===id); if(!r)return;
  r.status='Cancelled';
  DB.save();
  showToast('Reservation cancelled','warning');
  renderReservations();
}

/* ============================================================
   FINE SETTINGS (librarian)
   ============================================================ */
function toggleFineSetting() {
  const enabled=document.getElementById('fineEnabledToggle')?.checked || false;
  const rate=parseFloat(document.getElementById('fineRateInput')?.value)||0;
  DB.settings.fineEnabled=enabled;
  DB.settings.finePerDay=rate;
  DB.save();
  showToast(`Fine calculation ${enabled?'enabled':'disabled'}`);
  renderOverdueTable();
}

/* ============================================================
   STUDENT PORTAL: FIND A BOOK (catalog search)
   ============================================================ */
function renderCatalog() {
  const grid=document.getElementById('catalogGrid'); if(!grid) return;
  const q=(document.getElementById('catSearch')?.value||'').toLowerCase();
  const cat=document.getElementById('catCategoryFilter')?.value||'';
  const avail=document.getElementById('catAvailFilter')?.value||'';
  const sort=document.getElementById('catSort')?.value||'az';

  const borrowCounts={};
  DB.transactions.forEach(t=>borrowCounts[t.bookId]=(borrowCounts[t.bookId]||0)+1);

  let list=DB.books.filter(b=>{
    const hay=[b.title,b.author,b.isbn,b.category,b.subject,b.publisher,b.description].join(' ').toLowerCase();
    const matchesQ = !q || hay.includes(q);
    const matchesCat = !cat || b.category===cat;
    let matchesAvail = true;
    if(avail==='available') matchesAvail = b.available>0;
    else if(avail==='new') { const added=new Date(b.dateAdded); matchesAvail = (Date.now()-added.getTime())/86400000 <= 60; }
    else if(avail==='popular') matchesAvail = (borrowCounts[b.id]||0) >= 2;
    return matchesQ && matchesCat && matchesAvail;
  });

  if(sort==='az') list=[...list].sort((a,b)=>a.title.localeCompare(b.title));
  else if(sort==='za') list=[...list].sort((a,b)=>b.title.localeCompare(a.title));
  else if(sort==='newest') list=[...list].sort((a,b)=>new Date(b.dateAdded)-new Date(a.dateAdded));
  else if(sort==='oldest') list=[...list].sort((a,b)=>new Date(a.dateAdded)-new Date(b.dateAdded));
  else if(sort==='popular') list=[...list].sort((a,b)=>(borrowCounts[b.id]||0)-(borrowCounts[a.id]||0));

  if(!list.length){ grid.innerHTML='<p class="empty-state">No books match your search. Try a different keyword or filter.</p>'; return; }

  grid.innerHTML=list.map(b=>{
    const isAvail=b.available>0;
    return `<div class="book-card">
      <div class="book-card-top">
        <span class="status-pill ${isAvail?'returned':'overdue'}">${isAvail?`${b.available} available`:'All copies out'}</span>
        ${(borrowCounts[b.id]||0)>=2?'<span class="badge gold">Popular</span>':''}
      </div>
      <h3 class="book-card-title">${b.title}</h3>
      ${b.subtitle?`<p class="book-card-subtitle">${b.subtitle}</p>`:''}
      <p class="book-card-meta">by ${b.author} · ${b.category}${b.subject?` · ${b.subject}`:''}</p>
      ${b.description?`<p class="book-card-desc">${b.description}</p>`:''}
      <div class="book-card-details">
        <span>Shelf: <strong>${b.shelfLocation||'—'}</strong></span>
        <span>Call No: <strong>${b.callNumber||'—'}</strong></span>
        <span>ISBN: <strong>${b.isbn||'—'}</strong></span>
      </div>
      <button class="btn-primary full" onclick="openBookReader('${b.id}')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        Open Book
      </button>
    </div>`;
  }).join('');
}

/* ============================================================
   STUDENT PORTAL: OPEN BOOK (read-only study view)
   Students open a book straight from the catalog to read/study.
   Borrowing a physical copy still happens at the librarian desk.
   ============================================================ */
const READER_STATE = { bookId: null, pages: [], pageIndex: 0 };

// Builds a short set of placeholder reading pages for a book. This is a
// prototype, so it never reproduces real, copyrighted book text — it just
// demonstrates the reading interface using the book's own catalog summary.
function buildReaderPages(b) {
  const intro = b.description
    ? b.description
    : `A ${(b.category||'library').toLowerCase()} title available in the QuickBorrow collection.`;
  const pages = [
    `${intro}\n\nOpen this book any time you have an assignment, research task, or library activity — this view is for reading and studying on-screen.`
  ];
  const sections = ['Overview', 'Key Ideas', 'Study Notes', 'Discussion Points'];
  sections.forEach((label, i) => {
    pages.push(`${label}\n\nThis section of "${b.title}" is available for on-screen study. Use the Prev / Next controls to move through the material at your own pace, and take notes as you go.`);
  });
  return pages;
}

function openBookReader(bookId) {
  const b = Utils.getBook(bookId); if (!b) return;
  READER_STATE.bookId = bookId;
  READER_STATE.pages = buildReaderPages(b);
  READER_STATE.pageIndex = 0;

  setEl('readerBookTitle', b.title);
  setEl('readerBookAuthor', `by ${b.author} · ${b.category}${b.subject?` · ${b.subject}`:''}`);
  const cover = document.getElementById('readerCover');
  if (cover) cover.textContent = (b.title||'?').trim().charAt(0).toUpperCase();

  renderReaderPage();
  document.getElementById('bookReaderOverlay')?.classList.add('open');
}

function closeBookReader() {
  document.getElementById('bookReaderOverlay')?.classList.remove('open');
}

function renderReaderPage() {
  const content = document.getElementById('readerPageContent');
  const indicator = document.getElementById('readerPageIndicator');
  const prevBtn = document.getElementById('readerPrevBtn');
  const nextBtn = document.getElementById('readerNextBtn');
  const total = READER_STATE.pages.length;
  if (content) content.textContent = READER_STATE.pages[READER_STATE.pageIndex] || '';
  if (indicator) indicator.textContent = `Page ${READER_STATE.pageIndex+1} of ${total}`;
  if (prevBtn) prevBtn.disabled = READER_STATE.pageIndex <= 0;
  if (nextBtn) nextBtn.disabled = READER_STATE.pageIndex >= total-1;
  if (content) content.scrollTop = 0;
}

function readerPrevPage() {
  if (READER_STATE.pageIndex > 0) { READER_STATE.pageIndex--; renderReaderPage(); }
}
function readerNextPage() {
  if (READER_STATE.pageIndex < READER_STATE.pages.length-1) { READER_STATE.pageIndex++; renderReaderPage(); }
}

/* ============================================================
   STUDENT PORTAL: MY DASHBOARD
   ============================================================ */
const ANNOUNCEMENTS = [
  {title:'Extended Hours During Finals Week', body:'The library will be open until 9:00 PM on weekdays during finals week.'},
  {title:'New Arrivals This Month', body:'Check the "Find a Book" page and filter by New Arrivals to see the latest titles.'},
  {title:'Reminder: Handle With Care', body:'Please report any damage or issues with borrowed books right away using the Borrow/Return desk.'}
];

function renderStudentDashboard() {
  updateOverdueStatuses();
  const uid=AUTH.getStudentUserId();
  const mine=DB.transactions.filter(t=>t.userId===uid);
  const active=mine.filter(t=>t.status!=='Returned');
  const overdue=mine.filter(t=>t.status==='Overdue');
  const returned=mine.filter(t=>t.status==='Returned');
  const reserved=DB.reservations.filter(r=>r.userId===uid&&r.status==='Pending');

  setEl('stuStatBorrowed',active.length);
  setEl('stuStatOverdue',overdue.length);
  setEl('stuStatReserved',reserved.length);
  setEl('stuStatReturned',returned.length);

  const tbody=document.getElementById('stuDueBody');
  if(tbody){
    const dueSoonOrOverdue=active.filter(t=>{
      const days=Utils.daysUntilDue(t.dueDate);
      return days===null || days<=3;
    });
    if(!dueSoonOrOverdue.length){
      tbody.innerHTML='<tr><td colspan="4" class="empty-state">✓ Nothing due soon — you\'re all caught up</td></tr>';
    } else {
      tbody.innerHTML=dueSoonOrOverdue.map(t=>{
        const b=Utils.getBook(t.bookId);
        return `<tr class="${t.status==='Overdue'?'overdue-tr':''}">
          <td><strong style="color:var(--text-bright)">${b?.title||t.bookId}</strong></td>
          <td>${Utils.formatDate(t.dueDate)}</td>
          <td>${Utils.statusPill(t.status)}</td>
          <td>${(t.renewCount||0)<2?`<button class="act-edit" onclick="renewBook('${t.id}')">Renew</button>`:'<span class="empty-state" style="padding:0">Renewal limit reached</span>'}</td>
        </tr>`;
      }).join('');
    }
  }

  const annEl=document.getElementById('stuAnnouncements');
  if(annEl) annEl.innerHTML=ANNOUNCEMENTS.map(a=>`<li class="announcement-item"><strong>${a.title}</strong><span>${a.body}</span></li>`).join('');

  updateNotifBadge();
}

/* ============================================================
   STUDENT PORTAL: MY BORROWING
   ============================================================ */
function renewBook(txnId) {
  const t=DB.transactions.find(x=>x.id===txnId); if(!t) return;
  if(t.status==='Returned'){ showToast('This book has already been returned','warning'); return; }
  t.renewCount=t.renewCount||0;
  if(t.renewCount>=2){ showToast('Renewal limit reached (2 renewals max)','error'); return; }
  const newDue=new Date(t.dueDate); newDue.setDate(newDue.getDate()+7);
  t.dueDate=newDue.toISOString().split('T')[0];
  t.renewCount++;
  if(t.status==='Overdue' && t.dueDate>=Utils.today()) t.status='Borrowed';
  DB.save();
  showToast(`Renewed — new due date ${Utils.formatDate(t.dueDate)}`);
  renderStudentDashboard(); renderMyBooks();
}

function renderMyBooks() {
  updateOverdueStatuses();
  const uid=AUTH.getStudentUserId();
  const mine=DB.transactions.filter(t=>t.userId===uid);
  const active=mine.filter(t=>t.status!=='Returned');

  const borrowedBody=document.getElementById('myBorrowedBody');
  if(borrowedBody){
    if(!active.length){
      borrowedBody.innerHTML='<tr><td colspan="6" class="empty-state">You have no books currently borrowed</td></tr>';
    } else {
      borrowedBody.innerHTML=active.map(t=>{
        const b=Utils.getBook(t.bookId);
        return `<tr class="${t.status==='Overdue'?'overdue-tr':''}">
          <td><strong style="color:var(--text-bright)">${b?.title||t.bookId}</strong></td>
          <td>${Utils.formatDate(t.borrowDate)}</td>
          <td>${Utils.formatDate(t.dueDate)}</td>
          <td>${Utils.statusPill(t.status)}</td>
          <td>${Utils.fineLabel(t)}</td>
          <td>${(t.renewCount||0)<2?`<button class="act-edit" onclick="renewBook('${t.id}')">Renew</button>`:'—'}</td>
        </tr>`;
      }).join('');
    }
  }

  const resBody=document.getElementById('myReservationsBody');
  if(resBody){
    const mineRes=DB.reservations.filter(r=>r.userId===uid);
    if(!mineRes.length){
      resBody.innerHTML='<tr><td colspan="4" class="empty-state">No reservations placed</td></tr>';
    } else {
      resBody.innerHTML=[...mineRes].reverse().map(r=>{
        const b=Utils.getBook(r.bookId);
        const cls={Pending:'borrowed',Fulfilled:'returned',Cancelled:'overdue'}[r.status]||'borrowed';
        return `<tr>
          <td><strong style="color:var(--text-bright)">${b?.title||r.bookId}</strong></td>
          <td>${Utils.formatDate(r.reservedDate)}</td>
          <td><span class="status-pill ${cls}">${r.status}</span></td>
          <td>${r.status==='Pending'?`<button class="act-del" onclick="cancelReservation('${r.id}'); renderMyBooks();">Cancel</button>`:'—'}</td>
        </tr>`;
      }).join('');
    }
  }

  const histBody=document.getElementById('myHistoryBody');
  if(histBody){
    if(!mine.length){
      histBody.innerHTML='<tr><td colspan="5" class="empty-state">No borrowing history yet</td></tr>';
    } else {
      histBody.innerHTML=[...mine].reverse().map(t=>{
        const b=Utils.getBook(t.bookId);
        return `<tr class="${t.status==='Overdue'?'overdue-tr':''}">
          <td><strong style="color:var(--text-bright)">${b?.title||t.bookId}</strong></td>
          <td>${Utils.formatDate(t.borrowDate)}</td>
          <td>${Utils.formatDate(t.dueDate)}</td>
          <td>${Utils.formatDate(t.returnDate)}</td>
          <td>${Utils.statusPill(t.status)}</td>
        </tr>`;
      }).join('');
    }
  }

  updateNotifBadge();
}

/* ============================================================
   STUDENT PORTAL: MY PROFILE (avatar + Gmail)
   ============================================================ */
const MAX_AVATAR_BYTES = 600_000; // keep localStorage usage sane (base64 inflates ~33%)

function renderStudentProfile() {
  const u = Utils.getUser(AUTH.getStudentUserId());
  if (!u) return;

  setEl('profileName', u.name);
  setEl('profileMeta', `${u.dept} · Student ID 2026-0001`);
  const recNameEl=document.getElementById('profileRecName'); if(recNameEl) recNameEl.value=u.name||'';
  const recDeptEl=document.getElementById('profileRecDept'); if(recDeptEl) recDeptEl.value=u.dept||'';
  const recEmailEl=document.getElementById('profileRecEmail'); if(recEmailEl) recEmailEl.value=u.email||'';
  const gmailEl=document.getElementById('profileGmail'); if(gmailEl) gmailEl.value=u.gmail||'';
  const contactEl=document.getElementById('profileContact'); if(contactEl) contactEl.value=u.contact||'';

  updateProfileAvatarPreview(u.avatar);
}

function updateProfileAvatarPreview(avatarDataUrl) {
  const img=document.getElementById('profileAvatarPreview');
  const fallback=document.getElementById('profileAvatarFallback');
  const u = Utils.getUser(AUTH.getStudentUserId());
  const initial = (u?.name||'?').trim().charAt(0).toUpperCase();
  if (fallback) fallback.textContent = initial;
  if (!img) return;
  if (avatarDataUrl) {
    img.src = avatarDataUrl;
    img.classList.add('has-image');
    if (fallback) fallback.style.display = 'none';
  } else {
    img.classList.remove('has-image');
    img.removeAttribute('src');
    if (fallback) fallback.style.display = '';
  }
}

function initProfilePage() {
  const avatarInput=document.getElementById('profileAvatarInput');
  const avatarEditBtn=document.getElementById('profileAvatarEditBtn');
  const removeBtn=document.getElementById('profileRemovePhotoBtn');
  const saveBtn=document.getElementById('profileSaveBtn');
  const gmailInput=document.getElementById('profileGmail');
  const contactInput=document.getElementById('profileContact');

  avatarEditBtn?.addEventListener('click', ()=> avatarInput?.click());

  avatarInput?.addEventListener('change', ()=>{
    const file = avatarInput.files && avatarInput.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file', 'error'); avatarInput.value=''; return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      showToast('That image is too large — please pick one under 600KB', 'error'); avatarInput.value=''; return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const u = Utils.getUser(AUTH.getStudentUserId());
      if (!u) return;
      const previousAvatar = u.avatar;
      u.avatar = reader.result;
      updateProfileAvatarPreview(u.avatar);
      updateTopbarAvatar();
      if (DB.save()) {
        showToast('Profile picture updated');
      } else {
        // Ran out of browser storage space — roll back so the UI doesn't
        // claim a photo is saved when it silently wasn't.
        u.avatar = previousAvatar;
        updateProfileAvatarPreview(u.avatar);
        updateTopbarAvatar();
        showToast('That image is too large to store in this browser demo — try a smaller photo', 'error');
      }
    };
    reader.onerror = () => showToast('Could not read that image — please try another', 'error');
    reader.readAsDataURL(file);
  });

  removeBtn?.addEventListener('click', ()=>{
    const u = Utils.getUser(AUTH.getStudentUserId());
    if (!u) return;
    delete u.avatar;
    DB.save();
    updateProfileAvatarPreview(null);
    updateTopbarAvatar();
    if (avatarInput) avatarInput.value = '';
    showToast('Profile picture removed');
  });

  gmailInput?.addEventListener('input', ()=>setFieldError('profileGmail',''));
  contactInput?.addEventListener('input', ()=>setFieldError('profileContact',''));

  saveBtn?.addEventListener('click', ()=>{
    const u = Utils.getUser(AUTH.getStudentUserId());
    if (!u) return;
    const gmail = (gmailInput?.value || '').trim();
    const contact = (contactInput?.value || '').trim();
    if (!gmail) {
      setFieldError('profileGmail', 'A Gmail address is required so notifications can reach you.');
      gmailInput?.focus();
      return;
    }
    if (!/^[^\s@]+@gmail\.com$/i.test(gmail)) {
      setFieldError('profileGmail', 'Please enter a valid @gmail.com address.');
      gmailInput?.focus();
      return;
    }
    if (contact && !/^[0-9+\-\s()]{7,15}$/.test(contact)) {
      setFieldError('profileContact', 'Please enter a valid contact number.');
      contactInput?.focus();
      return;
    }
    setFieldError('profileGmail','');
    setFieldError('profileContact','');
    u.gmail = gmail;
    u.contact = contact;
    DB.save();
    showToast('Profile saved — notifications will be sent to your Gmail');
  });
}

/* ============================================================
   NOTIFICATIONS (shared: librarian + student)
   ============================================================ */
// Records a simulated SMS + Gmail delivery for a student. This is a
// front-end-only prototype: there is no backend, and no Twilio/Gmail API
// credentials to actually place a call out to a telecom or email provider.
// Both channels are logged as delivered to the student's registered Gmail
// address (their "SMS" notification is also sent through Gmail, per how
// this system is set up) so the feature and its UI are fully wired up —
// swapping in real delivery later is just replacing this function's body
// with actual API calls from a server.
function notifyStudent(userId, bookId, kind, message) {
  const u = Utils.getUser(userId);
  const gmail = (u && u.gmail) ? u.gmail : null;
  const ts = new Date().toISOString();
  ['sms','gmail'].forEach(channel=>{
    DB.notifications.push({
      id: DB.nextId(DB.notifications, 'NT'),
      userId, bookId, kind, channel, message,
      to: gmail || '(no Gmail on file — add one in My Profile)',
      sentAt: ts
    });
  });
}

function buildNotifications() {
  const role=AUTH.getRole();
  const items=[];

  if(role==='student'){
    const uid=AUTH.getStudentUserId();
    const mine=DB.transactions.filter(t=>t.userId===uid&&t.status!=='Returned');
    mine.forEach(t=>{
      const b=Utils.getBook(t.bookId);
      const days=Utils.daysUntilDue(t.dueDate);
      if(t.status==='Overdue'){
        items.push({type:'overdue',icon:'⚠',title:`Overdue: "${b?.title||t.bookId}"`,body:`Was due ${Utils.formatDate(t.dueDate)}. Please return or renew as soon as possible.`});
      } else if(days!==null && days<=3){
        items.push({type:'due',icon:'⏰',title:`Due soon: "${b?.title||t.bookId}"`,body:`Due on ${Utils.formatDate(t.dueDate)} (${days<=0?'today':days+' day(s) left'}).`});
      }
    });
    DB.reservations.filter(r=>r.userId===uid&&r.status==='Fulfilled').forEach(r=>{
      const b=Utils.getBook(r.bookId);
      items.push({type:'reservation',icon:'✓',title:`Reservation ready: "${b?.title||r.bookId}"`,body:'Your reserved book has been issued to you.'});
    });
    // SMS + Gmail delivery log for this student, most recent first (capped).
    [...DB.notifications].filter(n=>n.userId===uid).reverse().slice(0,10).forEach(n=>{
      const channelLabel = n.channel==='sms' ? 'SMS' : 'Gmail';
      const channelIcon = n.channel==='sms' ? '📱' : '📧';
      items.push({
        type:`channel-${n.channel}`, icon:channelIcon,
        title:`${channelLabel} notification sent`,
        body:`${n.message} — sent to ${n.to}`
      });
    });
  } else {
    const overdue=DB.transactions.filter(t=>t.status==='Overdue');
    if(overdue.length) items.push({type:'overdue',icon:'⚠',title:`${overdue.length} overdue book(s)`,body:'Review the Overdue Monitoring table in Reports.'});
    const pendingRes=DB.reservations.filter(r=>r.status==='Pending');
    if(pendingRes.length) items.push({type:'reservation',icon:'📌',title:`${pendingRes.length} reservation(s) awaiting approval`,body:'Visit Borrow / Return → Reservation Queue.'});
    const lowStock=DB.books.filter(b=>b.available===0);
    if(lowStock.length) items.push({type:'stock',icon:'📚',title:`${lowStock.length} title(s) fully checked out`,body:'Consider acquiring additional copies.'});
    const recentIssues=DB.issues.filter(r=>r.severity==='Severe'||r.severity==='Moderate');
    if(recentIssues.length) items.push({type:'issue',icon:'🛠',title:`${recentIssues.length} book condition report(s) need review`,body:'Check Book Condition & Issue Reports in Reports.'});
  }

  ANNOUNCEMENTS.forEach(a=>items.push({type:'announcement',icon:'📢',title:a.title,body:a.body}));
  return items;
}

function renderNotifications() {
  const list=document.getElementById('notifList'); if(!list) return;
  const items=buildNotifications();
  if(!items.length){ list.innerHTML='<li class="empty-state">No notifications right now</li>'; return; }
  list.innerHTML=items.map(n=>`<li class="notif-item notif-${n.type}">
    <span class="notif-icon" aria-hidden="true">${n.icon}</span>
    <span class="notif-text"><strong>${n.title}</strong><span>${n.body}</span></span>
  </li>`).join('');
}

function updateNotifBadge() {
  const badge=document.getElementById('notifNavBadge'); if(!badge) return;
  const items=buildNotifications().filter(n=>n.type!=='announcement' && !n.type.startsWith('channel-'));
  if(items.length){ badge.textContent=items.length; badge.style.display='inline-flex'; }
  else { badge.style.display='none'; }
}

/* ============================================================
   OVERDUE AUTO-UPDATE
   ============================================================ */
function updateOverdueStatuses() {
  const today=Utils.today(); let changed=false;
  DB.transactions.forEach((t,i)=>{
    if(t.status==='Borrowed'&&t.dueDate&&t.dueDate<today){
      DB.transactions[i].status='Overdue';
      changed=true;
      if(!DB.transactions[i].overdueNotified){
        const title = Utils.getBook(t.bookId)?.title || t.bookId;
        notifyStudent(t.userId, t.bookId, 'overdue', `Your borrowed book "${title}" is overdue. Please return it by the due date.`);
        notifyStudent(t.userId, t.bookId, 'fine', `If you do not return "${title}" on time, you will be charged a fine.`);
        DB.transactions[i].overdueNotified = true;
      }
    }
  });
  if(changed)DB.save();
}

/* ============================================================
   REPORTS
   ============================================================ */
function refreshReports() {
  updateOverdueStatuses();
  const fEnabled=document.getElementById('fineEnabledToggle');
  const fRate=document.getElementById('fineRateInput');
  if(fEnabled) fEnabled.checked=!!DB.settings.fineEnabled;
  if(fRate) fRate.value=DB.settings.finePerDay ?? 5;
  const borrowed=DB.transactions.filter(t=>t.status==='Borrowed');
  const returned=DB.transactions.filter(t=>t.status==='Returned');
  const overdue =DB.transactions.filter(t=>t.status==='Overdue');
  setEl('rStatBooks',DB.books.length);
  setEl('rStatUsers',DB.users.length);
  setEl('rStatBorrowed',borrowed.length+overdue.length);
  setEl('rStatReturned',returned.length);
  setEl('rStatOverdue',overdue.length);
  renderOverdueTable();
  renderReportIssues();
  updateNotifBadge();
}

function renderOverdueTable() {
  const tbody=document.getElementById('overdueBody'); if(!tbody)return;
  const list=DB.transactions.filter(t=>t.status==='Overdue');
  if(!list.length){tbody.innerHTML='<tr><td colspan="6" class="empty-state">✓ No overdue books</td></tr>';return;}
  tbody.innerHTML=list.map(t=>{
    const u=Utils.getUser(t.userId),b=Utils.getBook(t.bookId);
    const days=Utils.daysOverdue(t.dueDate);
    const fine=DB.settings.fineEnabled?` · <span style="color:var(--gold-lite)">${Utils.fineLabel(t)}</span>`:'';
    return `<tr class="overdue-tr"><td>${t.id}</td><td>${u?.name||t.userId}</td>
    <td>${b?.title||t.bookId}</td><td>${Utils.formatDate(t.dueDate)}</td>
    <td><strong style="color:var(--red);font-family:var(--font-mono)">+${days} days</strong>${fine}</td>
    <td>${u?.dept||'—'}</td></tr>`;
  }).join('');
}

/* Issue reports table in Reports page */
function renderReportIssues() {
  const tbody = document.getElementById('reportIssueBody');
  const badge = document.getElementById('rStatIssues');
  if (!tbody) return;
  if (badge) badge.textContent = `${DB.issues.length} Report${DB.issues.length !== 1 ? 's' : ''}`;
  if (!DB.issues.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No issue reports on record</td></tr>';
    return;
  }
  tbody.innerHTML = [...DB.issues].reverse().map(r => {
    const u = Utils.getUser(r.userId);
    const b = Utils.getBook(r.bookId);
    const truncated = r.description.length > 80
      ? r.description.substring(0, 80) + '…'
      : r.description;
    return `<tr class="${r.severity === 'Severe' ? 'overdue-tr' : ''}">
      <td><span style="font-family:var(--font-mono);font-size:11px">${r.id}</span></td>
      <td>${u?.name || r.userId}</td>
      <td><strong style="color:var(--text-bright)">${b?.title || r.bookId}</strong></td>
      <td><span class="issue-type-tag">${r.issueType}</span></td>
      <td style="max-width:260px;white-space:normal;font-size:11px;color:var(--text-dim)">${truncated}</td>
      <td>${Utils.formatDate(r.reportDate)}</td>
      <td>${Utils.severityPill(r.severity)}</td>
    </tr>`;
  }).join('');
}

/* ============================================================
   EXPORT
   ============================================================ */
function exportData(type, format) {
  const ts=Utils.today();
  if(format==='csv'){
    let csv='',fn='';
    if(type==='books'){
      csv=Utils.toCSV(['BookID','Title','Author','Category','ISBN','Quantity','AvailableCopies','DateAdded'],DB.books.map(b=>[b.id,b.title,b.author,b.category,b.isbn||'',b.qty,b.available,b.dateAdded]));
      fn=`QuickBorrow_Books_${ts}.csv`;
    } else if(type==='users'){
      csv=Utils.toCSV(['UserID','Name','Department','Email','ContactNumber','RegistrationDate'],DB.users.map(u=>[u.id,u.name,u.dept,u.email,u.contact||'',u.regDate]));
      fn=`QuickBorrow_Users_${ts}.csv`;
    } else if(type==='transactions'){
      csv=Utils.toCSV(['TransactionID','UserID','BookID','BorrowDate','DueDate','ReturnDate','Status'],DB.transactions.map(t=>[t.id,t.userId,t.bookId,t.borrowDate,t.dueDate,t.returnDate||'',t.status]));
      fn=`QuickBorrow_Transactions_${ts}.csv`;
    } else if(type==='issues'){
      csv=Utils.toCSV(['ReportID','TransactionID','UserID','BookID','IssueType','Description','ReportDate','Severity'],DB.issues.map(r=>[r.id,r.transactionId,r.userId,r.bookId,r.issueType,r.description,r.reportDate,r.severity]));
      fn=`QuickBorrow_IssueReports_${ts}.csv`;
    }
    Utils.download(csv,fn,'text/csv');
    showToast(`${fn} exported`);
  } else if(format==='json'){
    let data,fn;
    if(type==='books'){data=DB.books.map(b=>({BookID:b.id,Title:b.title,Author:b.author,Category:b.category,ISBN:b.isbn||'',Quantity:b.qty,AvailableCopies:b.available,DateAdded:b.dateAdded}));fn=`QuickBorrow_Books_${ts}.json`;}
    else if(type==='users'){data=DB.users.map(u=>({UserID:u.id,Name:u.name,Department:u.dept,Email:u.email,ContactNumber:u.contact||'',RegistrationDate:u.regDate}));fn=`QuickBorrow_Users_${ts}.json`;}
    else if(type==='transactions'){data=DB.transactions.map(t=>({TransactionID:t.id,UserID:t.userId,BookID:t.bookId,BorrowDate:t.borrowDate,DueDate:t.dueDate,ReturnDate:t.returnDate||null,Status:t.status}));fn=`QuickBorrow_Transactions_${ts}.json`;}
    else if(type==='issues'){data=DB.issues.map(r=>({ReportID:r.id,TransactionID:r.transactionId,UserID:r.userId,BookID:r.bookId,IssueType:r.issueType,Description:r.description,ReportDate:r.reportDate,Severity:r.severity}));fn=`QuickBorrow_IssueReports_${ts}.json`;}
    else if(type==='all'){
      data={
        exportDate:ts,
        exportedBy:'QuickBorrow — NDM College',
        institution:'Notre Dame of Midsayap College',
        books:DB.books.map(b=>({BookID:b.id,Title:b.title,Author:b.author,Category:b.category,ISBN:b.isbn||'',Quantity:b.qty,AvailableCopies:b.available,DateAdded:b.dateAdded})),
        users:DB.users.map(u=>({UserID:u.id,Name:u.name,Department:u.dept,Email:u.email,ContactNumber:u.contact||'',RegistrationDate:u.regDate})),
        transactions:DB.transactions.map(t=>({TransactionID:t.id,UserID:t.userId,BookID:t.bookId,BorrowDate:t.borrowDate,DueDate:t.dueDate,ReturnDate:t.returnDate||null,Status:t.status})),
        issueReports:DB.issues.map(r=>({ReportID:r.id,TransactionID:r.transactionId,UserID:r.userId,BookID:r.bookId,IssueType:r.issueType,Description:r.description,ReportDate:r.reportDate,Severity:r.severity}))
      };
      fn=`QuickBorrow_FullDataset_${ts}.json`;
    }
    Utils.download(JSON.stringify(data,null,2),fn,'application/json');
    showToast(`${fn} exported`);
  }
}

/* ============================================================
   AUTHENTICATION (prototype-level login gate)
   Demonstrates HCI login principles: clear labels, consistent
   buttons, accessible inputs, and helpful error messages.
   Not a real security layer — for prototype demonstration only.
   ============================================================ */
const AUTH = {
  DEMO_USER: 'librarian',
  DEMO_PASS: 'NDMC@2026',
  DISPLAY_NAME: 'Admin Librarian',

  STUDENT_USER: 'student',
  STUDENT_PASS: 'Student@2026',
  // Students must present their Student ID Number as well as their username —
  // this system is student-only (no separate faculty login).
  STUDENT_ID: '2026-0001',
  // Demo student is tied to a real seeded user record so "My Borrowing" has data.
  STUDENT_LINKED_USER_ID: 'US0001',

  isLoggedIn() {
    return sessionStorage.getItem('qb2_session') === 'active';
  },
  getRole() {
    return sessionStorage.getItem('qb2_role') || 'librarian';
  },
  getStudentUserId() {
    return sessionStorage.getItem('qb2_student_id') || this.STUDENT_LINKED_USER_ID;
  },
  getDisplayName() {
    if (this.getRole() === 'student') {
      const u = Utils.getUser(this.getStudentUserId());
      return u ? u.name : 'Student User';
    }
    return this.DISPLAY_NAME;
  },
  // The student portal only accepts a matching Student ID Number + username +
  // password together — this system is for students only, there is no
  // separate faculty login.
  login(username, password, role, idNumber) {
    if (role === 'student') {
      const idOk = (idNumber || '').trim() === this.STUDENT_ID;
      if (idOk && username.toLowerCase() === this.STUDENT_USER && password === this.STUDENT_PASS) {
        sessionStorage.setItem('qb2_session', 'active');
        sessionStorage.setItem('qb2_role', 'student');
        sessionStorage.setItem('qb2_student_id', this.STUDENT_LINKED_USER_ID);
        return true;
      }
      return false;
    }
    if (username.toLowerCase() === this.DEMO_USER && password === this.DEMO_PASS) {
      sessionStorage.setItem('qb2_session', 'active');
      sessionStorage.setItem('qb2_role', 'librarian');
      return true;
    }
    return false;
  },
  // Used only to give a helpful hint when someone types the *other* portal's
  // credentials into the wrong tab — it never grants access on its own.
  matchesOtherRole(username, password, role) {
    const u = username.toLowerCase();
    if (role === 'student') {
      return u === this.DEMO_USER && password === this.DEMO_PASS;
    }
    return u === this.STUDENT_USER && password === this.STUDENT_PASS;
  },
  logout() {
    sessionStorage.removeItem('qb2_session');
    sessionStorage.removeItem('qb2_role');
    sessionStorage.removeItem('qb2_student_id');
    document.body.classList.add('app-locked');
    showToast('You have been logged out','warning');
  }
};

function initLogin() {
  const logoutBtn=document.getElementById('logoutBtn');

  document.querySelectorAll('[data-forgot]').forEach(link=>{
    link.addEventListener('click', (e)=>{
      e.preventDefault();
      showToast('Please contact the library administrator to reset your password.','warning');
    });
  });

  if(AUTH.isLoggedIn()) document.body.classList.remove('app-locked');

  // Wire up one portal's form: its own username/password/error fields and its
  // own fixed role, so the two sign-in experiences never share state.
  function wireLoginForm({formId, idId, userId, passId, toggleId, formErrId, role}) {
    const form=document.getElementById(formId);
    const idInput=idId ? document.getElementById(idId) : null;
    const userInput=document.getElementById(userId);
    const passInput=document.getElementById(passId);
    const toggleBtn=document.getElementById(toggleId);
    const formError=document.getElementById(formErrId);

    idInput?.addEventListener('input', ()=>setFieldError(idId,''));
    userInput?.addEventListener('input', ()=>setFieldError(userId,''));
    passInput?.addEventListener('input', ()=>setFieldError(passId,''));

    toggleBtn?.addEventListener('click', ()=>{
      const showing = passInput.type === 'text';
      passInput.type = showing ? 'password' : 'text';
      toggleBtn.setAttribute('aria-pressed', showing ? 'false':'true');
      toggleBtn.setAttribute('aria-label', showing ? 'Show password':'Hide password');
    });

    form?.addEventListener('submit', (e)=>{
      e.preventDefault();
      const idNumber = idInput ? idInput.value.trim() : undefined;
      const username=userInput.value.trim();
      const password=passInput.value;
      let hasError=false;
      formError.classList.remove('show'); formError.textContent='';

      if(idInput && !idNumber){ setFieldError(idId,'Student ID Number is required.'); hasError=true; }
      if(!username){ setFieldError(userId,'Username is required.'); hasError=true; }
      if(!password){ setFieldError(passId,'Password is required.'); hasError=true; }
      if(hasError){
        (idInput && !idNumber ? idInput : (!username?userInput:passInput)).focus();
        return;
      }

      if(AUTH.login(username,password,role,idNumber)){
        document.body.classList.remove('app-locked');
        applyRoleUI();
        form.reset();
        showToast(`Welcome back, ${AUTH.getDisplayName()}`);
        navigateTo(role === 'student' ? 'mystudent' : 'dashboard');
      } else if (AUTH.matchesOtherRole(username, password, role)) {
        const otherPortal = role === 'student' ? 'Librarian' : 'Student';
        formError.textContent = `Those are ${otherPortal} credentials — this is the ${role==='student'?'Student':'Librarian'} sign-in. Go back and choose "${otherPortal}" instead.`;
        formError.classList.add('show');
      } else if (idInput && username.toLowerCase()===AUTH.STUDENT_USER && password===AUTH.STUDENT_PASS) {
        formError.textContent = 'Your Student ID Number doesn\'t match our records. Please check it and try again.';
        formError.classList.add('show');
        idInput.focus();
      } else {
        formError.textContent = 'Incorrect Student ID Number, username, or password. Please try again.';
        formError.classList.add('show');
        passInput.focus();
      }
    });
  }

  wireLoginForm({formId:'librarianLoginForm', userId:'libUsername', passId:'libPassword',
    toggleId:'libPasswordToggle', formErrId:'librarianFormError', role:'librarian'});
  wireLoginForm({formId:'studentLoginForm', idId:'stuIdNumber', userId:'stuUsername', passId:'stuPassword',
    toggleId:'stuPasswordToggle', formErrId:'studentFormError', role:'student'});

  logoutBtn?.addEventListener('click', ()=>{
    AUTH.logout();
    window.location.href = 'index.html';
  });
}

/* ============================================================
   ACCESSIBILITY TOOLBAR
   Lets users opt into higher contrast — preference persists
   across visits via localStorage.
   ============================================================ */
function initAccessibilityToolbar() {
  const contrastBtn=document.getElementById('contrastToggle');
  const body=document.body;
  let highContrast=localStorage.getItem('qb2_contrast')==='on';

  function applyContrast(){
    body.classList.toggle('high-contrast', highContrast);
    contrastBtn?.setAttribute('aria-pressed', highContrast?'true':'false');
    localStorage.setItem('qb2_contrast', highContrast?'on':'off');
  }

  applyContrast();

  contrastBtn?.addEventListener('click', ()=>{
    highContrast=!highContrast;
    applyContrast();
    showToast(`High contrast mode ${highContrast?'enabled':'disabled'}`);
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const logoEl=document.getElementById('ndmLogo');
  if(logoEl) logoEl.src=NDM_LOGO;
  const loginLogoEl=document.getElementById('loginNdmLogo');
  if(loginLogoEl) loginLogoEl.src=NDM_LOGO;

  // Each portal file declares which role it serves via <body data-role="...">.
  // If a session for the *other* role somehow reaches this page, clear it so
  // the person always lands on this portal's own login form, never the
  // other portal's app shell.
  const PAGE_ROLE = document.body.dataset.role || null;
  if (PAGE_ROLE && AUTH.isLoggedIn() && AUTH.getRole() !== PAGE_ROLE) {
    sessionStorage.removeItem('qb2_session');
    sessionStorage.removeItem('qb2_role');
    sessionStorage.removeItem('qb2_student_id');
  }

  DB.load();
  startClock();
  initNavigation();
  initLogin();
  initProfilePage();
  initAccessibilityToolbar();
  applyRoleUI();
  navigateTo(PAGE_ROLE === 'student' ? 'mystudent' : 'dashboard');
});
