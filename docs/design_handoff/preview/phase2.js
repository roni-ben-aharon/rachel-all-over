// ============== PHASE 2 ==============
document.getElementById('phase-2-content').innerHTML = `

<!-- 1. Sign up via invite -->
<div class="screen" data-screen-label="01 Sign up">
  <p class="screen-label"><span class="num">01</span> Sign up · invite only</p>
  <div class="screen-wrap" style="display:grid;grid-template-columns:1fr 1.1fr;min-height:580px;">
    <div style="padding:48px;display:flex;flex-direction:column;justify-content:center;background:var(--surface);">
      <div style="max-width:340px;width:100%;margin:0 auto;">
        <div style="display:inline-flex;align-items:center;gap:10px;padding:6px 12px 6px 6px;background:var(--surface-soft);border:1px solid var(--line);border-radius:999px;margin-bottom:24px;">
          <div class="avatar" style="width:24px;height:24px;background:var(--ink);color:#fff;font-size:10px;font-weight:600;">R</div>
          <span style="font-size:11.5px;color:var(--ink-2);"><b>Rachel</b> invited you</span>
        </div>
        <h3 style="font-size:30px;font-weight:500;letter-spacing:-0.025em;line-height:1.05;">Welcome to your<br><span class="serif" style="font-size:34px;">training space</span></h3>
        <p style="font-size:13px;color:var(--ink-3);margin-top:10px;line-height:1.55;">Create an account to see your program, log sessions, and track progress.</p>

        <div style="margin-top:28px;display:flex;flex-direction:column;gap:12px;">
          <div><p class="label" style="margin-bottom:5px;">Full name</p><input class="input" placeholder="Roey Cohen" value="Roey Cohen"></div>
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;"><p class="label">Email</p><span class="pill ghost" style="font-size:9.5px;padding:2px 7px;">Locked from invite</span></div>
            <input class="input" type="email" value="roey@gmail.com" disabled style="background:var(--surface-sunken);color:var(--ink-3);">
          </div>
          <div>
            <p class="label" style="margin-bottom:5px;">Password</p>
            <input class="input" type="password" placeholder="Min. 8 characters" value="••••••••••">
            <div style="display:flex;align-items:center;gap:6px;margin-top:6px;">
              <div style="flex:1;height:3px;background:var(--surface-sunken);border-radius:2px;overflow:hidden;display:flex;gap:2px;">
                <div style="flex:1;background:var(--success);"></div>
                <div style="flex:1;background:var(--success);"></div>
                <div style="flex:1;background:var(--success);"></div>
                <div style="flex:1;background:var(--surface-sunken);"></div>
              </div>
              <span style="font-size:10.5px;color:var(--success);font-weight:500;">Strong</span>
            </div>
          </div>
          <div>
            <p class="label" style="margin-bottom:5px;">Confirm password</p>
            <input class="input" type="password" placeholder="Re-enter password" value="••••••••••">
            <p style="font-size:10.5px;color:var(--success);margin-top:5px;display:flex;align-items:center;gap:5px;"><span>✓</span> Passwords match</p>
          </div>
          <button class="btn primary" style="width:100%;justify-content:center;padding:11px;margin-top:6px;">Create account →</button>
          <div style="display:flex;align-items:center;gap:12px;margin:6px 0;"><div class="divider" style="flex:1;"></div><span style="font-size:10.5px;color:var(--ink-4);text-transform:uppercase;letter-spacing:.14em;">or</span><div class="divider" style="flex:1;"></div></div>
          <button class="btn" style="width:100%;justify-content:center;padding:10px;">
            <svg width="14" height="14" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Sign up with Google
          </button>
          <p style="font-size:11px;color:var(--ink-4);text-align:center;margin-top:6px;">Already have an account? <a style="color:var(--ink);text-decoration:underline;cursor:pointer;">Sign in</a></p>
        </div>
      </div>
    </div>

    <div style="background:var(--ink);color:#F1EDE4;padding:48px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;">
      <div style="display:flex;align-items:center;gap:10px;font-size:11px;color:#8B8472;text-transform:uppercase;letter-spacing:.14em;">
        <span style="color:var(--sage);">●</span> Your trainer's view of you
      </div>
      <div style="background:#211E18;border:1px solid #2D2A22;border-radius:14px;padding:20px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
          <div class="avatar" style="width:36px;height:36px;background:var(--sage);color:var(--sage-ink);font-size:14px;font-weight:600;">R</div>
          <div><p style="font-size:13px;font-weight:500;color:#F1EDE4;">Roey Cohen</p><p style="font-size:10.5px;color:#8B8472;font-family:'Geist Mono',monospace;">Strength Phase 1 · 2× / wk</p></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div style="background:#15130F;border-radius:9px;padding:11px 12px;"><p style="font-size:10px;color:#6F695B;text-transform:uppercase;letter-spacing:.1em;">This week</p><p style="font-size:18px;font-weight:500;margin-top:4px;color:#F1EDE4;">2<span style="opacity:.4;font-size:14px;">/2</span></p></div>
          <div style="background:#15130F;border-radius:9px;padding:11px 12px;"><p style="font-size:10px;color:#6F695B;text-transform:uppercase;letter-spacing:.1em;">Last session</p><p style="font-size:18px;font-weight:500;margin-top:4px;color:#F1EDE4;">Apr 28</p></div>
        </div>
      </div>
      <div>
        <p class="serif" style="font-size:34px;line-height:1.05;letter-spacing:-0.02em;color:#F1EDE4;">"It's the only<br>tracker I've ever<br>actually kept up<br>with."</p>
        <p style="margin-top:12px;font-size:12px;color:#8B8472;">— Maya, client since Jan</p>
      </div>
    </div>
  </div>
</div>

<!-- 2. Workout session -->
<div class="screen" data-screen-label="02 Workout session">
  <p class="screen-label"><span class="num">02</span> Workout session · trainer logging live</p>
  <div class="screen-wrap" style="display:flex;flex-direction:column;min-height:580px;">

    <!-- Session banner -->
    <div style="padding:16px 28px;background:linear-gradient(180deg, var(--amber) 0%, #ECC976 100%);color:var(--amber-ink);display:flex;align-items:center;justify-content:space-between;gap:24px;border-bottom:1px solid #D7B663;">
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="width:8px;height:8px;border-radius:50%;background:var(--amber-ink);position:relative;">
          <div style="position:absolute;inset:-3px;border:1px solid var(--amber-ink);border-radius:50%;animation:pulse 2s infinite;opacity:.5;"></div>
        </div>
        <div>
          <div style="display:flex;align-items:center;gap:10px;">
            <p style="font-size:14px;font-weight:600;letter-spacing:-0.005em;">Live session — Roey</p>
            <span style="font-family:'Geist Mono',monospace;font-size:11px;background:rgba(91,67,23,.12);padding:2px 8px;border-radius:5px;">28:14</span>
          </div>
          <p style="font-size:11.5px;margin-top:2px;opacity:.7;">Logged as a new version. Won't change the program.</p>
        </div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button class="btn" style="background:rgba(255,255,255,.5);border-color:transparent;color:var(--amber-ink);">Save draft</button>
        <button class="btn amber">End session →</button>
      </div>
    </div>

    <!-- Workout tabs + previous session toggle -->
    <div style="padding:14px 28px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;background:var(--surface);">
      <div style="display:flex;gap:6px;">
        <button class="btn sm primary" style="border-radius:7px;">Workout A</button>
        <button class="btn sm">Workout B</button>
      </div>
      <div style="display:flex;align-items:center;gap:14px;">
        <span style="font-size:11px;color:var(--ink-3);">Previous: <span class="mono" style="color:var(--ink-2);">Apr 21</span></span>
        <button class="btn sm" style="gap:5px;">View previous <span style="opacity:.5;">⌄</span></button>
      </div>
    </div>

    <!-- Editable table -->
    <div style="flex:1;overflow-y:auto;padding:20px 28px;background:var(--surface);">
      <table class="workout" style="background:var(--surface);border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;">
        <thead>
          <tr>
            <th style="width:24%;">Exercise</th>
            <th style="width:13%;">Muscle</th>
            <th style="width:8%;text-align:center;">Sets</th>
            <th style="width:8%;text-align:center;">Reps</th>
            <th style="width:24%;">Resistance</th>
            <th style="width:15%;">Note</th>
            <th style="width:8%;"></th>
          </tr>
        </thead>
        <tbody>
          ${sessionRow('Pull up','Back',3,7,'band-red','Try blue next time',true,'')}
          ${sessionRow('Db deadlift','Hamstring',3,10,'kg-25','',false,'')}
          ${sessionRow('Db incline bench','Chest',3,10,'kg-12.5','Up from 10 kg',true,'progress')}
          ${sessionRow('Face pulls','Shoulders',3,12,'band-blue','',false,'')}
          ${sessionRow('Plank','Core',3,'45s','bw','',false,'')}
        </tbody>
      </table>
      <button class="btn" style="margin-top:14px;width:100%;justify-content:center;border-style:dashed;padding:12px;color:var(--ink-3);">＋ Add exercise</button>
    </div>

    <div style="padding:14px 28px;background:var(--surface-soft);border-top:1px solid var(--line-soft);display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--ink-3);">
        <span style="width:6px;height:6px;border-radius:50%;background:var(--success);"></span>
        Auto-saved · <span class="mono" style="color:var(--ink-2);">11s ago</span>
      </div>
      <div style="font-size:11px;color:var(--ink-4);">Press <span class="kbd">⌘ S</span> to save · <span class="kbd">⌘ Enter</span> to end</div>
    </div>
  </div>
</div>

<!-- 3. Client view -->
<div class="screen" data-screen-label="03 Client view">
  <p class="screen-label"><span class="num">03</span> Client view · my program</p>
  <div class="screen-wrap" style="display:flex;flex-direction:column;min-height:600px;">

    <div style="padding:20px 28px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;background:var(--surface);">
      <div style="display:flex;align-items:center;gap:14px;">
        <div class="avatar" style="width:44px;height:44px;background:var(--sage);color:var(--sage-ink);font-size:16px;font-weight:600;">R</div>
        <div>
          <h3 style="font-size:18px;font-weight:600;letter-spacing:-0.015em;">Hey, Roey <span class="serif" style="font-weight:400;color:var(--ink-3);">👋</span></h3>
          <p style="font-size:12px;color:var(--ink-3);margin-top:2px;">Strength Phase 1 · with Rachel</p>
        </div>
      </div>
      <div style="display:flex;gap:6px;padding:4px;background:var(--surface-sunken);border-radius:10px;">
        <button class="btn sm primary" style="border-radius:7px;">My program</button>
        <button class="btn sm" style="background:transparent;border-color:transparent;">My progress</button>
      </div>
    </div>

    <!-- This week banner -->
    <div style="padding:18px 28px;background:var(--surface-soft);border-bottom:1px solid var(--line-soft);display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:16px;">
      <div>
        <p class="label">This week</p>
        <p style="font-size:24px;font-weight:500;letter-spacing:-0.02em;margin-top:4px;line-height:1.1;">2 sessions <span class="serif" style="color:var(--ink-3);">scheduled</span></p>
        <p style="font-size:11.5px;color:var(--ink-3);margin-top:3px;">Next: Tuesday · Workout B</p>
      </div>
      <div><p class="label">Last logged</p><p class="mono" style="font-size:16px;font-weight:500;margin-top:6px;">Apr 28</p></div>
      <div><p class="label">Streak</p><p style="font-size:16px;font-weight:500;margin-top:6px;">4 weeks <span class="serif" style="color:var(--ink-3);font-size:14px;">strong</span></p></div>
      <div style="display:flex;align-items:center;justify-content:flex-end;"><button class="btn">Download as PDF</button></div>
    </div>

    <div style="flex:1;overflow-y:auto;padding:20px 28px;display:flex;flex-direction:column;gap:14px;background:var(--surface);">
      ${workoutCard('A', 'Workout A', [
        {name:'Pull up', group:'Back', sets:3, reps:7, resist:{type:'band',color:'Red'}, note:true},
        {name:'Db deadlift', group:'Hamstring', sets:3, reps:10, resist:{type:'kg',val:25}, note:false},
        {name:'Db incline bench', group:'Chest', sets:3, reps:10, resist:{type:'kg',val:10}, note:true},
      ])}
      ${workoutCard('B', 'Workout B', [
        {name:'Db/Bb squat', group:'Quadriceps', sets:3, reps:8, resist:{type:'kg',val:30}, note:false},
        {name:'Bb bench press', group:'Chest', sets:3, reps:10, resist:{type:'kg',val:27.5}, note:false},
      ])}
    </div>
  </div>
</div>

<style>
@keyframes pulse {0%{transform:scale(1);opacity:.5}100%{transform:scale(2.2);opacity:0}}
</style>
`;

function sessionRow(name, group, sets, reps, resist, note, hasNote, badge){
  const [rType, rVal] = resist.split('-');
  let resistDisplay = '';
  if(rType==='kg') resistDisplay = `<input class="input" value="${rVal} kg" style="font-family:'Geist Mono',monospace;padding:6px 9px;font-size:12px;">`;
  else if(rType==='band'){
    const colorMap = {red:'#C2410C',blue:'#3B82F6',green:'#4F7A3A'};
    resistDisplay = `<div style="display:flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid var(--line);border-radius:8px;background:var(--surface);"><span style="width:8px;height:8px;border-radius:50%;background:${colorMap[rVal]||'#888'};"></span><span style="font-size:12px;">${rVal[0].toUpperCase()+rVal.slice(1)} band</span><span style="margin-left:auto;color:var(--ink-4);font-size:10px;">⌄</span></div>`;
  } else {
    resistDisplay = `<div style="padding:6px 9px;border:1px dashed var(--line);border-radius:8px;font-size:12px;color:var(--ink-3);">Bodyweight</div>`;
  }

  const badgePill = badge==='progress'?`<span class="pill sage" style="font-size:9.5px;padding:2px 6px;margin-left:6px;">↑ PR</span>`:'';
  return `
    <tr>
      <td><input class="input" value="${name}" style="padding:6px 9px;font-size:12.5px;font-weight:500;border-color:transparent;background:transparent;">${badgePill?`<div style="margin-top:4px;">${badgePill}</div>`:''}</td>
      <td><input class="input" value="${group}" style="padding:6px 9px;font-size:12px;color:var(--ink-3);border-color:transparent;background:transparent;"></td>
      <td style="text-align:center;"><input class="input mono" value="${sets}" style="width:42px;padding:6px;text-align:center;font-size:12.5px;"></td>
      <td style="text-align:center;"><input class="input mono" value="${reps}" style="width:42px;padding:6px;text-align:center;font-size:12.5px;"></td>
      <td>${resistDisplay}</td>
      <td>${hasNote
        ? `<div style="display:flex;align-items:center;gap:6px;padding:6px 9px;background:var(--surface-soft);border:1px solid var(--line-soft);border-radius:8px;"><span style="color:var(--ink-3);font-size:11px;">📝</span><span style="font-size:11.5px;color:var(--ink-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${note}</span></div>`
        : `<button class="btn sm" style="padding:6px 9px;color:var(--ink-4);border-style:dashed;">＋ note</button>`
      }</td>
      <td style="text-align:right;"><button class="btn icon ghost" style="color:var(--danger);">✕</button></td>
    </tr>`;
}
