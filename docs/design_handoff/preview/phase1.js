// ============== PHASE 1 ==============
document.getElementById('phase-1-content').innerHTML = `

<!-- 1. Sign in -->
<div class="screen" data-screen-label="01 Sign in">
  <p class="screen-label"><span class="num">01</span> Sign in</p>
  <div class="screen-wrap" style="display:grid;grid-template-columns:1.1fr 1fr;min-height:560px;">
    <div style="background:var(--ink);color:#F1EDE4;padding:48px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:32px;height:32px;border-radius:8px;background:#F1EDE4;color:var(--ink);display:grid;place-items:center;font-weight:600;font-size:14px;">R</div>
        <span style="font-size:13px;font-weight:500;letter-spacing:-0.005em;">RachelAllOver</span>
      </div>
      <div>
        <p class="serif" style="font-size:46px;line-height:1.0;letter-spacing:-0.02em;color:#F1EDE4;">Track every<br>set, every rep,<br>every week.</p>
        <p style="margin-top:18px;font-size:13px;color:#A39B89;max-width:280px;line-height:1.55;">Built for trainers who want their clients' programs always one click away.</p>
      </div>
      <div style="display:flex;align-items:center;gap:28px;font-size:11px;color:#6F695B;text-transform:uppercase;letter-spacing:.14em;">
        <span><span style="color:var(--sage);">●</span> Encrypted</span>
        <span>No app to install</span>
      </div>
      <div aria-hidden="true" style="position:absolute;right:-60px;top:-40px;width:240px;height:240px;border-radius:50%;border:1px solid rgba(241,237,228,.08);"></div>
      <div aria-hidden="true" style="position:absolute;right:-30px;top:-10px;width:180px;height:180px;border-radius:50%;border:1px solid rgba(241,237,228,.10);"></div>
    </div>

    <div style="padding:48px;display:flex;flex-direction:column;justify-content:center;background:var(--surface);">
      <div style="max-width:320px;width:100%;margin:0 auto;">
        <p class="label" style="margin-bottom:14px;">Welcome back</p>
        <h3 style="font-size:26px;font-weight:500;letter-spacing:-0.02em;line-height:1.1;">Sign in to your <span class="serif" style="font-size:30px;">workspace</span></h3>
        <p style="font-size:13px;color:var(--ink-3);margin-top:8px;">Your role is assigned automatically.</p>

        <div style="margin-top:28px;display:flex;flex-direction:column;gap:12px;">
          <div>
            <p class="label" style="margin-bottom:6px;">Email</p>
            <input class="input" type="email" placeholder="rachel@allover.fit" value="rachel@allover.fit">
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <p class="label">Password</p>
              <a style="font-size:11px;color:var(--ink-3);text-decoration:underline;cursor:pointer;">Forgot?</a>
            </div>
            <input class="input" type="password" value="••••••••••">
          </div>
          <button class="btn primary" style="width:100%;justify-content:center;padding:11px;margin-top:6px;font-size:13px;">Sign in <span style="opacity:.5;margin-left:6px;">→</span></button>
          <div style="display:flex;align-items:center;gap:12px;margin:6px 0;"><div class="divider" style="flex:1;"></div><span style="font-size:10.5px;color:var(--ink-4);text-transform:uppercase;letter-spacing:.14em;">or</span><div class="divider" style="flex:1;"></div></div>
          <button class="btn" style="width:100%;justify-content:center;padding:10px;">
            <svg width="14" height="14" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 2. Trainer dashboard -->
<div class="screen" data-screen-label="02 Trainer dashboard">
  <p class="screen-label"><span class="num">02</span> Trainer dashboard · read mode</p>
  <div class="screen-wrap" style="display:flex;height:640px;">

    <!-- Sidebar -->
    <aside style="width:240px;border-right:1px solid var(--line);display:flex;flex-direction:column;background:var(--surface-soft);flex-shrink:0;">
      <div style="padding:18px 18px 14px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
          <div style="width:28px;height:28px;border-radius:7px;background:var(--ink);color:#fff;display:grid;place-items:center;font-weight:600;font-size:12px;">R</div>
          <span style="font-size:13px;font-weight:600;letter-spacing:-0.01em;">RachelAllOver</span>
        </div>
        <p class="label">Rachel's clients</p>
        <p style="font-size:11px;color:var(--ink-4);margin-top:3px;font-family:'Geist Mono',monospace;">8 active · 1 invited</p>
      </div>

      <div style="padding:0 10px;flex:1;overflow:hidden;display:flex;flex-direction:column;gap:2px;">
        ${renderClientRow('R','Roey','2× / week','sage', true, 'Tue')}
        ${renderClientRow('S','Shoval','3× / week','', false, '')}
        ${renderClientRow('R','Roni','2× / week','', false, '')}
        ${renderClientRow('T','Tom','4× / week','', false, 'Today')}
        ${renderClientRow('M','Maya','2× / week','', false, '')}
        ${renderClientRow('N','Noa','3× / week','', false, '')}
      </div>

      <div style="padding:12px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:6px;">
        <button class="btn" style="width:100%;justify-content:center;">＋ Add client</button>
        <div style="display:flex;align-items:center;gap:10px;padding:6px 4px;">
          <div class="avatar" style="width:26px;height:26px;background:var(--lavender);color:var(--lavender-ink);font-size:11px;">R</div>
          <div style="line-height:1.2;"><p style="font-size:12px;font-weight:500;">Rachel Cohen</p><p style="font-size:10.5px;color:var(--ink-4);">Trainer</p></div>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <main style="flex:1;display:flex;flex-direction:column;overflow:hidden;background:var(--surface);">
      <div style="padding:18px 28px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:14px;">
          <div class="avatar" style="width:44px;height:44px;background:var(--sage);color:var(--sage-ink);font-size:16px;font-weight:600;">R</div>
          <div>
            <div style="display:flex;align-items:center;gap:10px;">
              <h3 style="font-size:18px;font-weight:600;letter-spacing:-0.015em;">Roey Cohen</h3>
              <span class="pill ghost"><span class="dot" style="background:var(--success);"></span>Active</span>
            </div>
            <p style="font-size:12px;color:var(--ink-3);margin-top:2px;">Strength Phase 1 · 2× / week · 12 sessions logged</p>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="btn">View progress</button>
          <button class="btn primary">Edit program</button>
          <button class="btn icon">⋯</button>
        </div>
      </div>

      <!-- Quick stats -->
      <div style="padding:20px 28px 0;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
        ${statCard('Last session','Apr 28','3 days ago','sage')}
        ${statCard('Avg. volume','12,480 kg','+8% vs last month','amber')}
        ${statCard('Streak','4 weeks','consistent','lavender')}
      </div>

      <div style="flex:1;overflow-y:auto;padding:20px 28px;display:flex;flex-direction:column;gap:16px;">
        ${workoutCard('A', 'Workout A', [
          {name:'Pull up', group:'Back', sets:3, reps:7, resist:{type:'band',color:'Red'}, note:true},
          {name:'Db deadlift', group:'Hamstring', sets:3, reps:10, resist:{type:'kg',val:25}, note:false},
          {name:'Db incline bench', group:'Chest', sets:3, reps:10, resist:{type:'kg',val:10}, note:true},
          {name:'Face pulls', group:'Shoulders', sets:3, reps:12, resist:{type:'band',color:'Blue'}, note:false},
          {name:'Plank', group:'Core', sets:3, reps:'45s', resist:{type:'bw'}, note:false},
        ])}
        ${workoutCard('B', 'Workout B', [
          {name:'Db/Bb squat', group:'Quadriceps', sets:3, reps:8, resist:{type:'kg',val:30}, note:false},
          {name:'Bb bench press', group:'Chest', sets:3, reps:10, resist:{type:'kg',val:27.5}, note:false},
        ])}
      </div>
    </main>
  </div>
</div>

<!-- 3. Add new client modal -->
<div class="screen" data-screen-label="03 Add client">
  <p class="screen-label"><span class="num">03</span> Add new client · modal</p>
  <div class="screen-wrap" style="background:var(--bg-2);padding:56px;display:flex;align-items:center;justify-content:center;min-height:600px;position:relative;">
    <!-- backdrop hint -->
    <div style="position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 0%, rgba(21,19,15,.04), transparent 60%);"></div>
    <div style="background:var(--surface);border-radius:var(--r-xl);width:460px;box-shadow:0 24px 60px -20px rgba(21,19,15,.25), 0 2px 0 rgba(21,19,15,.04);position:relative;overflow:hidden;">
      <div style="padding:22px 26px 18px;display:flex;align-items:flex-start;justify-content:space-between;">
        <div>
          <p class="label">New client</p>
          <h3 style="font-size:22px;font-weight:500;letter-spacing:-0.02em;margin-top:6px;">Let's get them <span class="serif" style="font-size:25px;">started</span></h3>
          <p style="font-size:12.5px;color:var(--ink-3);margin-top:6px;">We'll create a program and email an invite link.</p>
        </div>
        <button class="btn icon ghost">✕</button>
      </div>

      <div style="padding:6px 26px 22px;display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;gap:10px;">
          <div style="flex:1;"><p class="label" style="margin-bottom:5px;">First name</p><input class="input" placeholder="Roey" value="Roey"></div>
          <div style="flex:1;"><p class="label" style="margin-bottom:5px;">Last name</p><input class="input" placeholder="Cohen" value="Cohen"></div>
        </div>
        <div><p class="label" style="margin-bottom:5px;">Email</p><input class="input" placeholder="roey@gmail.com" value="roey@gmail.com"></div>
        <div><p class="label" style="margin-bottom:5px;">Program name</p><input class="input" value="Strength Phase 1"></div>
        <div>
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
            <p class="label">Workouts per week</p>
            <span style="font-size:11px;color:var(--ink-4);">creates <span class="mono" style="color:var(--ink-2);">3</span> blank workouts</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;">
            ${[1,2,3,4,5].map(n=>`<button class="btn ${n===3?'primary':''}" style="justify-content:center;padding:11px;font-family:'Geist Mono',monospace;">${n}</button>`).join('')}
          </div>
        </div>
      </div>

      <div style="padding:14px 26px;background:var(--surface-soft);border-top:1px solid var(--line-soft);display:flex;gap:8px;justify-content:space-between;align-items:center;">
        <p style="font-size:11px;color:var(--ink-3);">An invite link will be generated.</p>
        <div style="display:flex;gap:8px;">
          <button class="btn">Cancel</button>
          <button class="btn primary">Create client →</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 4. Blank template -->
<div class="screen" data-screen-label="04 Blank template">
  <p class="screen-label"><span class="num">04</span> Blank template · just created</p>
  <div class="screen-wrap" style="display:flex;flex-direction:column;min-height:540px;">
    <div style="padding:18px 28px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:14px;">
        <div class="avatar" style="width:40px;height:40px;background:var(--sage);color:var(--sage-ink);font-size:14px;font-weight:600;">R</div>
        <div>
          <div style="display:flex;align-items:center;gap:10px;">
            <h3 style="font-size:16px;font-weight:600;letter-spacing:-0.01em;">Roey Cohen</h3>
            <span class="pill amber"><span class="dot"></span>Invite pending</span>
          </div>
          <p style="font-size:12px;color:var(--ink-3);margin-top:2px;">Strength Phase 1 · 3× / week · blank template</p>
        </div>
      </div>
      <button class="btn primary">Edit program</button>
    </div>

    <div style="padding:18px 28px;background:var(--surface-soft);border-bottom:1px solid var(--line-soft);display:flex;align-items:center;gap:12px;">
      <div style="width:28px;height:28px;border-radius:7px;background:var(--lavender);color:var(--lavender-ink);display:grid;place-items:center;font-size:13px;">↗</div>
      <div style="flex:1;"><p style="font-size:12.5px;font-weight:500;">Invite Roey to RachelAllOver</p><p style="font-size:11px;color:var(--ink-3);margin-top:2px;">They'll create their own login.</p></div>
      <div class="mono" style="font-size:11px;color:var(--ink-3);background:var(--surface);border:1px solid var(--line);padding:6px 10px;border-radius:6px;">allover.fit/i/8H4N2K</div>
      <button class="btn sm">Copy link</button>
    </div>

    <div style="flex:1;overflow-y:auto;padding:20px 28px;display:flex;flex-direction:column;gap:14px;">
      ${blankWorkout('Workout A')}
      ${blankWorkout('Workout B')}
      ${blankWorkout('Workout C')}
    </div>
  </div>
</div>

`;

function renderClientRow(letter,name,freq,accent,active,nextSession){
  const bg = accent==='sage' ? 'var(--sage)' : 'var(--surface)';
  const ink = accent==='sage' ? 'var(--sage-ink)' : 'var(--ink-3)';
  return `
    <div style="display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:9px;${active?'background:var(--surface);border:1px solid var(--line);box-shadow:0 1px 0 rgba(21,19,15,.03);':''}cursor:pointer;">
      <div class="avatar" style="width:30px;height:30px;background:${bg};color:${ink};font-weight:600;font-size:11.5px;">${letter}</div>
      <div style="flex:1;line-height:1.2;">
        <p style="font-size:12.5px;font-weight:${active?'600':'500'};letter-spacing:-0.005em;">${name}</p>
        <p style="font-size:10.5px;color:var(--ink-4);font-family:'Geist Mono',monospace;margin-top:1px;">${freq}</p>
      </div>
      ${nextSession==='Today'?'<span class="pill amber" style="font-size:9.5px;padding:2px 7px;">Today</span>':nextSession?`<span style="font-size:10px;color:var(--ink-4);font-family:'Geist Mono',monospace;">${nextSession}</span>`:''}
    </div>`;
}

function statCard(label,big,sub,tone){
  const bg = tone==='sage'?'var(--sage)':tone==='amber'?'var(--amber)':'var(--lavender)';
  const ink = tone==='sage'?'var(--sage-ink)':tone==='amber'?'var(--amber-ink)':'var(--lavender-ink)';
  return `<div style="background:${bg};border-radius:var(--r-lg);padding:14px 16px;color:${ink};">
    <p style="font-size:10.5px;font-weight:500;text-transform:uppercase;letter-spacing:.1em;opacity:.75;">${label}</p>
    <p style="font-size:22px;font-weight:600;letter-spacing:-0.02em;margin-top:6px;line-height:1;">${big}</p>
    <p style="font-size:11px;margin-top:4px;opacity:.75;">${sub}</p>
  </div>`;
}

function resistChip(r){
  if(!r) return '<span style="color:var(--ink-4);">—</span>';
  if(r.type==='kg') return `<span class="resist-chip"><span class="mono">${r.val} kg</span></span>`;
  if(r.type==='band'){
    const colorMap = {Red:'#C2410C',Blue:'#3B82F6',Green:'#4F7A3A',Black:'#15130F',Purple:'#7C5BD0'};
    return `<span class="resist-chip"><span class="swatch" style="background:${colorMap[r.color]}"></span>${r.color}</span>`;
  }
  if(r.type==='bw') return `<span class="resist-chip" style="background:transparent;border:1px dashed var(--line);">Bodyweight</span>`;
  return '—';
}

function workoutCard(letter, label, rows){
  return `
  <div class="wcard">
    <div class="wcard-head">
      <div class="left">
        <div style="width:24px;height:24px;border-radius:6px;background:var(--ink);color:#fff;display:grid;place-items:center;font-weight:600;font-size:11px;font-family:'Geist Mono',monospace;">${letter}</div>
        <h4>${label}</h4>
        <span class="sub">${rows.length} exercises</span>
      </div>
      <div style="display:flex;gap:6px;align-items:center;">
        <span style="font-size:11px;color:var(--ink-4);">Last: <span class="mono" style="color:var(--ink-3);">Apr 28</span></span>
        <button class="btn sm">View</button>
      </div>
    </div>
    <table class="workout">
      <thead><tr>
        <th style="width:30%;">Exercise</th>
        <th style="width:16%;">Muscle</th>
        <th style="width:9%;text-align:center;">Sets</th>
        <th style="width:9%;text-align:center;">Reps</th>
        <th style="width:24%;">Resistance</th>
        <th style="width:12%;text-align:right;">Note</th>
      </tr></thead>
      <tbody>
        ${rows.map(r=>`
          <tr>
            <td><span class="ex-name">${r.name}</span></td>
            <td class="muted">${r.group}</td>
            <td style="text-align:center;"><span class="num">${r.sets}</span></td>
            <td style="text-align:center;"><span class="num">${r.reps}</span></td>
            <td>${resistChip(r.resist)}</td>
            <td style="text-align:right;">${r.note?'<span class="note-btn active" data-comment-anchor="cc-1" title="Has note"><span class="note-glyph"><i></i><i></i><i></i></span></span>':'<span class="note-btn empty">＋</span>'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>`;
}

function blankWorkout(label){
  return `
  <div class="wcard" style="background:var(--surface-soft);">
    <div class="wcard-head" style="background:var(--surface);">
      <div class="left">
        <div style="width:24px;height:24px;border-radius:6px;background:var(--surface-sunken);color:var(--ink-3);display:grid;place-items:center;font-weight:600;font-size:11px;font-family:'Geist Mono',monospace;">${label.slice(-1)}</div>
        <h4>${label}</h4>
        <span class="sub" style="color:var(--ink-4);">0 exercises</span>
      </div>
    </div>
    <div style="padding:32px 18px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;">
      <div style="width:36px;height:36px;border-radius:9px;background:var(--surface);border:1px dashed var(--line);display:grid;place-items:center;color:var(--ink-4);font-size:18px;">+</div>
      <p style="font-size:12.5px;color:var(--ink-3);">No exercises yet</p>
      <p style="font-size:11px;color:var(--ink-4);">Click <span class="kbd">Edit program</span> to add</p>
    </div>
  </div>`;
}
