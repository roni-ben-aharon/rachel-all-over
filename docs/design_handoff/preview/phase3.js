// ============== PHASE 3 ==============
document.getElementById('phase-3-content').innerHTML = `

<!-- 1. Progress graphs -->
<div class="screen" data-screen-label="01 Progress graphs">
  <p class="screen-label"><span class="num">01</span> Progress graphs · client view</p>
  <div class="screen-wrap" style="padding:0;">
    <div style="padding:24px 28px 8px;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1px solid var(--line-soft);">
      <div>
        <p class="label">Progress</p>
        <h3 style="font-size:26px;font-weight:500;letter-spacing:-0.02em;margin-top:4px;">Volume over time <span class="serif" style="color:var(--ink-3);font-size:28px;">— Roey</span></h3>
        <p style="font-size:12.5px;color:var(--ink-3);margin-top:4px;">sets × reps × weight · 6 week window</p>
      </div>
      <div style="display:flex;gap:6px;padding:4px;background:var(--surface-sunken);border-radius:10px;">
        <button class="btn sm" style="background:transparent;border-color:transparent;">4w</button>
        <button class="btn sm primary" style="border-radius:7px;">6w</button>
        <button class="btn sm" style="background:transparent;border-color:transparent;">3m</button>
        <button class="btn sm" style="background:transparent;border-color:transparent;">All</button>
      </div>
    </div>

    <!-- Exercise legend / filter -->
    <div style="padding:18px 28px 12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
      ${legendPill('Deadlift','sage',true)}
      ${legendPill('Squat','rose',true)}
      ${legendPill('Pull up','lavender',true)}
      ${legendPill('Bench press','amber',true)}
      ${legendPill('Face pulls','ghost',false)}
      ${legendPill('Plank','ghost',false)}
      <span style="margin-left:auto;font-size:11px;color:var(--ink-4);">click to toggle</span>
    </div>

    <!-- Chart -->
    <div style="padding:8px 28px 24px;">
      <div style="position:relative;height:260px;border-radius:var(--r-lg);background:linear-gradient(180deg, var(--surface-soft), var(--surface));border:1px solid var(--line-soft);overflow:hidden;">
        <!-- y axis grid -->
        ${[0,1,2,3,4].map(i=>`<div style="position:absolute;left:48px;right:24px;top:${20+i*46}px;height:1px;background:var(--line-soft);"></div>`).join('')}
        ${[0,1,2,3,4].map(i=>`<div style="position:absolute;left:14px;top:${15+i*46}px;font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink-4);">${(5-i)*4}k</div>`).join('')}
        <!-- x axis -->
        <div style="position:absolute;bottom:14px;left:48px;right:24px;display:flex;justify-content:space-between;font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink-4);">
          <span>W14</span><span>W15</span><span>W16</span><span>W17</span><span>W18</span><span>W19</span>
        </div>
        <!-- SVG lines -->
        <svg viewBox="0 0 600 240" preserveAspectRatio="none" style="position:absolute;left:48px;top:20px;right:24px;width:calc(100% - 72px);height:200px;overflow:visible;">
          <defs>
            <linearGradient id="g-deadlift" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7E9A55" stop-opacity="0.2"/><stop offset="100%" stop-color="#7E9A55" stop-opacity="0"/></linearGradient>
          </defs>
          <path d="M 0 180 L 100 165 L 200 150 L 300 120 L 400 90 L 500 60 L 600 35" stroke="#7E9A55" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M 0 180 L 100 165 L 200 150 L 300 120 L 400 90 L 500 60 L 600 35 L 600 240 L 0 240 Z" fill="url(#g-deadlift)"/>

          <path d="M 0 200 L 100 195 L 200 180 L 300 160 L 400 140 L 500 130 L 600 110" stroke="#B27466" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M 0 170 L 100 160 L 200 155 L 300 140 L 400 125 L 500 105 L 600 85" stroke="#7969B8" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M 0 190 L 100 175 L 200 170 L 300 155 L 400 145 L 500 125 L 600 100" stroke="#C9A24D" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

          <!-- Active hover point -->
          <line x1="400" y1="0" x2="400" y2="240" stroke="var(--ink)" stroke-width="0.5" stroke-dasharray="3 3" opacity=".35"/>
          <circle cx="400" cy="90"  r="3" fill="#7E9A55"/>
          <circle cx="400" cy="90"  r="6" fill="#7E9A55" opacity=".18"/>
          <circle cx="400" cy="140" r="3" fill="#B27466"/>
          <circle cx="400" cy="140" r="6" fill="#B27466" opacity=".18"/>
          <circle cx="400" cy="125" r="3" fill="#7969B8"/>
          <circle cx="400" cy="125" r="6" fill="#7969B8" opacity=".18"/>
          <circle cx="400" cy="145" r="3" fill="#C9A24D"/>
          <circle cx="400" cy="145" r="6" fill="#C9A24D" opacity=".18"/>
        </svg>
        <!-- Tooltip -->
        <div style="position:absolute;left:calc(48px + 400px / 600 * (100% - 72px) - 110px);top:18px;background:var(--surface);color:var(--ink);padding:0;border-radius:10px;font-size:11.5px;width:228px;box-shadow:0 16px 40px -12px rgba(21,19,15,.22), 0 0 0 1px rgba(21,19,15,.06);overflow:hidden;">
          <div style="padding:10px 12px 8px;display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid var(--line-soft);background:var(--surface-soft);">
            <div>
              <p style="font-size:13px;font-weight:600;letter-spacing:-0.01em;">Week 17</p>
              <p style="font-family:'Geist Mono',monospace;font-size:10px;color:var(--ink-4);margin-top:1px;">Apr 22 — Apr 28</p>
            </div>
            <span class="pill sage" style="font-size:9.5px;padding:2px 7px;">2 sessions</span>
          </div>
          <div style="padding:8px 12px;display:flex;flex-direction:column;gap:6px;">
            ${tooltipRow('#7E9A55','Deadlift','12,480','+8%','up')}
            ${tooltipRow('#7969B8','Pull up','8,400','+4%','up')}
            ${tooltipRow('#C9A24D','Bench','7,920','+2%','up')}
            ${tooltipRow('#B27466','Squat','6,160','—','flat')}
          </div>
          <div style="padding:7px 12px;background:var(--surface-soft);border-top:1px solid var(--line-soft);display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:10px;color:var(--ink-3);text-transform:uppercase;letter-spacing:.1em;">Total</span>
            <span class="mono" style="font-size:12px;font-weight:600;">34,960 kg</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats grid -->
    <div style="padding:0 28px 24px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
      ${bigStatCard('Total volume','+65%','since Mar 24','sage','↑')}
      ${bigStatCard('Sessions','12','last 6 weeks','lavender','')}
      ${bigStatCard('Best exercise','Deadlift','+112% volume','amber','★')}
    </div>
  </div>
</div>

<!-- 2. CSV Import -->
<div class="screen" data-screen-label="02 CSV import">
  <p class="screen-label"><span class="num">02</span> CSV import · preview</p>
  <div class="screen-wrap">
    <div style="padding:20px 28px;border-bottom:1px solid var(--line-soft);display:flex;justify-content:space-between;align-items:flex-start;gap:24px;">
      <div>
        <p class="label">Import preview</p>
        <h3 style="font-size:22px;font-weight:500;letter-spacing:-0.02em;margin-top:4px;display:flex;align-items:center;gap:10px;">
          <span class="mono" style="font-size:14px;color:var(--ink-3);background:var(--surface-sunken);padding:4px 10px;border-radius:6px;border:1px solid var(--line);">$ROEY.csv</span>
        </h3>
        <div style="margin-top:10px;display:flex;gap:18px;font-size:11.5px;color:var(--ink-3);">
          <span><span class="mono" style="color:var(--ink-2);font-weight:500;">11</span> exercises</span>
          <span><span class="mono" style="color:var(--ink-2);font-weight:500;">2</span> workouts</span>
          <span style="color:var(--danger);"><span class="mono" style="font-weight:500;">5</span> need attention</span>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn">Cancel</button>
        <button class="btn primary">Import program →</button>
      </div>
    </div>

    <!-- Issue banner -->
    <div style="padding:12px 28px;background:var(--surface-soft);border-bottom:1px solid var(--line-soft);display:flex;align-items:center;gap:12px;color:var(--ink-2);">
      <span style="width:6px;height:6px;border-radius:50%;background:var(--danger);flex-shrink:0;"></span>
      <p style="font-size:12px;flex:1;"><span class="mono" style="color:var(--ink);">5 rows</span> need a resistance value — click any to set, or import as-is.</p>
      <button class="btn sm" style="font-size:11px;">Show issues only</button>
    </div>

    <table class="workout" style="border:none;border-radius:0;">
      <thead>
        <tr>
          <th style="width:10%;">Workout</th>
          <th style="width:13%;">Muscle</th>
          <th style="width:11%;">Category</th>
          <th style="width:22%;">Exercise</th>
          <th style="width:6%;text-align:center;">Sets</th>
          <th style="width:7%;text-align:center;">Reps</th>
          <th style="width:18%;">Resistance</th>
          <th style="width:8%;text-align:center;">Note</th>
        </tr>
      </thead>
      <tbody>
        ${csvRow('FBW 1','Back','Secondary','Pull up',2,'7',null,'green/red band',true)}
        ${csvRow('','Hamstring','Primary','Db/Bb Deadlift',3,'10',null,'10/25 kg',false)}
        ${csvRow('','Chest','Primary','Db Incline bench press',3,'10','10 kg','',false)}
        ${csvRow('','Quadriceps','Secondary','Box climb',3,'8',null,'box24',false)}
        ${csvRow('','Shoulders','Primary','Face Pulls',3,'10',null,'#4',false)}
        ${csvRow('','Core','Anti-extension','Plank',3,'45sec','Bodyweight','',false)}
        ${csvRow('FBW 2','Quadriceps','Primary','Db/Bb Squat',3,'8',null,'15/30',false)}
        ${csvRow('','Chest','Primary','Bb Bench press',3,'10','27.5 kg','',false)}
        ${csvRow('','Back','Primary','Machine Narrow Row',3,'12',null,'#6',false)}
        ${csvRow('','Core','Dynamic','Lying Leg Raises',3,'15','Bodyweight','',false)}
      </tbody>
    </table>
  </div>
</div>

<!-- 3. Exercise library combobox -->
<div class="screen" data-screen-label="03 Exercise library combobox">
  <p class="screen-label"><span class="num">03</span> Exercise library · combobox in edit mode</p>
  <div class="screen-wrap" style="overflow:visible;">
    <div class="wcard-head" style="padding:16px 28px;">
      <div class="left">
        <div style="width:24px;height:24px;border-radius:6px;background:var(--ink);color:#fff;display:grid;place-items:center;font-weight:600;font-size:11px;font-family:'Geist Mono',monospace;">A</div>
        <h4 style="font-size:14px;">Workout A — edit mode</h4>
        <span class="pill sage" style="margin-left:4px;">Linked to library</span>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="btn sm">Cancel</button>
        <button class="btn sm primary">Save</button>
      </div>
    </div>

    <table class="workout" style="border-radius:0;border:none;overflow:visible;">
      <thead>
        <tr>
          <th style="width:13%;">Muscle</th>
          <th style="width:12%;">Category</th>
          <th style="width:11%;">Technique</th>
          <th style="width:24%;">Exercise</th>
          <th style="width:7%;text-align:center;">Sets</th>
          <th style="width:7%;text-align:center;">Reps</th>
          <th style="width:18%;">Resistance</th>
          <th style="width:8%;"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input class="input" value="Back" style="font-size:12px;padding:6px 9px;"></td>
          <td><input class="input" value="Secondary" style="font-size:12px;padding:6px 9px;"></td>
          <td><input class="input" placeholder="—" style="font-size:12px;padding:6px 9px;"></td>
          <td><input class="input" value="Pull up" style="font-size:12px;padding:6px 9px;font-weight:500;"></td>
          <td style="text-align:center;"><input class="input mono" value="3" style="width:44px;padding:6px;text-align:center;font-size:12px;"></td>
          <td style="text-align:center;"><input class="input mono" value="7" style="width:44px;padding:6px;text-align:center;font-size:12px;"></td>
          <td><input class="input" value="Red band" style="font-size:12px;padding:6px 9px;"></td>
          <td style="text-align:center;"><button class="btn icon ghost" style="color:var(--danger);">✕</button></td>
        </tr>
        <tr style="background:#F2F4F9;position:relative;z-index:5;">
          <td><div style="display:flex;align-items:center;gap:5px;padding:6px 9px;font-size:12px;background:#E5E9F6;color:var(--lavender-ink);border-radius:7px;border:1px solid #C8C5E4;"><span style="opacity:.5;">●</span>Chest</div></td>
          <td><div style="display:flex;align-items:center;gap:5px;padding:6px 9px;font-size:12px;background:#E5E9F6;color:var(--lavender-ink);border-radius:7px;border:1px solid #C8C5E4;">Primary</div></td>
          <td><input class="input" placeholder="—" style="font-size:12px;padding:6px 9px;"></td>
          <td style="position:relative;">
            <input class="input" value="Db inc" style="font-size:12px;padding:6px 9px;border-color:var(--ink);box-shadow:0 0 0 3px rgba(21,19,15,.08);">
            <!-- Dropdown -->
            <div style="position:absolute;top:calc(100% + 6px);left:0;right:-40px;background:var(--surface);border:1px solid var(--line);border-radius:10px;z-index:100;overflow:hidden;box-shadow:0 16px 40px -8px rgba(21,19,15,.18), 0 2px 0 rgba(21,19,15,.04);">
              <div style="padding:8px 14px 6px;background:var(--surface-soft);border-bottom:1px solid var(--line-soft);display:flex;justify-content:space-between;align-items:center;">
                <span style="font-size:10px;color:var(--ink-4);text-transform:uppercase;letter-spacing:.12em;">2 matches</span>
                <span style="font-size:10px;color:var(--ink-4);"><span class="kbd">↑↓</span> navigate · <span class="kbd">↵</span> select</span>
              </div>
              <div style="padding:11px 14px;background:var(--surface-sunken);border-left:2px solid var(--ink);">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-size:13px;font-weight:500;">Db incline bench press</span>
                  <span class="pill sage" style="font-size:9.5px;">In library</span>
                </div>
                <div style="display:flex;gap:8px;margin-top:3px;font-size:11px;color:var(--ink-3);">
                  <span>Chest</span><span>·</span><span>Primary</span><span>·</span><span class="mono">kg</span>
                </div>
              </div>
              <div style="padding:11px 14px;">
                <span style="font-size:13px;">Db incline fly</span>
                <div style="display:flex;gap:8px;margin-top:3px;font-size:11px;color:var(--ink-3);"><span>Chest</span><span>·</span><span>Isolation</span><span>·</span><span class="mono">kg</span></div>
              </div>
              <div style="padding:11px 14px;border-top:1px solid var(--line-soft);background:var(--surface-soft);display:flex;align-items:center;gap:10px;cursor:pointer;">
                <div style="width:22px;height:22px;border-radius:6px;background:var(--lavender);color:var(--lavender-ink);display:grid;place-items:center;font-weight:600;font-size:13px;">+</div>
                <div>
                  <p style="font-size:12.5px;font-weight:500;color:var(--ink);">Add <span class="mono">"Db inc"</span> to library</p>
                  <p style="font-size:11px;color:var(--ink-3);">Save as a new exercise</p>
                </div>
              </div>
            </div>
          </td>
          <td style="text-align:center;"><input class="input mono" value="3" style="width:44px;padding:6px;text-align:center;font-size:12px;"></td>
          <td style="text-align:center;"><input class="input mono" value="10" style="width:44px;padding:6px;text-align:center;font-size:12px;"></td>
          <td><input class="input" value="10 kg" style="font-size:12px;padding:6px 9px;font-family:'Geist Mono',monospace;"></td>
          <td style="text-align:center;"><button class="btn icon ghost" style="color:var(--danger);">✕</button></td>
        </tr>
      </tbody>
    </table>

    <div style="padding:14px 28px;border-top:1px solid var(--line-soft);background:var(--surface-soft);display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:8px;font-size:11px;color:var(--ink-3);">
        <span style="width:12px;height:12px;border-radius:3px;background:#E5E9F6;border:1px solid #C8C5E4;"></span>
        Lavender fields are auto-filled from the library — still editable
      </div>
      <button class="btn sm" style="border-style:dashed;">＋ Add exercise</button>
    </div>
  </div>
</div>

<!-- 4. Add to library modal -->
<div class="screen" data-screen-label="04 Add to library">
  <p class="screen-label"><span class="num">04</span> Add to library · modal</p>
  <div class="screen-wrap" style="background:var(--bg-2);padding:48px;display:flex;align-items:center;justify-content:center;min-height:500px;">
    <div style="background:var(--surface);border-radius:var(--r-xl);width:420px;box-shadow:0 24px 60px -20px rgba(21,19,15,.25);overflow:hidden;">
      <div style="padding:22px 24px 18px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <div style="width:30px;height:30px;border-radius:8px;background:var(--lavender);color:var(--lavender-ink);display:grid;place-items:center;font-size:15px;font-weight:600;">+</div>
          <span class="label">New exercise</span>
        </div>
        <h3 style="font-size:20px;font-weight:500;letter-spacing:-0.015em;">Add to <span class="serif" style="font-size:23px;">exercise library</span></h3>
        <p style="font-size:12.5px;color:var(--ink-3);margin-top:6px;"><span class="mono" style="color:var(--ink-2);background:var(--surface-sunken);padding:1px 6px;border-radius:4px;">"Box climb"</span> wasn't found. Add it now so it autocompletes next time.</p>
      </div>

      <div style="padding:0 24px 18px;display:flex;flex-direction:column;gap:12px;">
        <div><p class="label" style="margin-bottom:5px;">Name</p><input class="input" value="Box climb"></div>
        <div style="display:flex;gap:10px;">
          <div style="flex:1;"><p class="label" style="margin-bottom:5px;">Muscle group</p><input class="input" placeholder="e.g. Quadriceps"></div>
          <div style="flex:1;"><p class="label" style="margin-bottom:5px;">Category</p><input class="input" placeholder="Secondary"></div>
        </div>
        <div>
          <p class="label" style="margin-bottom:6px;">Default resistance</p>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;">
            <button class="btn primary" style="justify-content:center;padding:10px;">kg</button>
            <button class="btn" style="justify-content:center;padding:10px;">Band</button>
            <button class="btn" style="justify-content:center;padding:10px;">Bodyweight</button>
          </div>
        </div>
      </div>

      <div style="padding:14px 24px;background:var(--surface-soft);border-top:1px solid var(--line-soft);display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn">Skip</button>
        <button class="btn primary">Add to library →</button>
      </div>
    </div>
  </div>
</div>

<!-- 5. Library management -->
<div class="screen" data-screen-label="05 Exercise library">
  <p class="screen-label"><span class="num">05</span> Exercise library · /library</p>
  <div class="screen-wrap">
    <div style="padding:20px 28px;border-bottom:1px solid var(--line-soft);display:flex;align-items:center;justify-content:space-between;">
      <div>
        <p class="label">Library</p>
        <h3 style="font-size:22px;font-weight:500;letter-spacing:-0.02em;margin-top:4px;">Exercise <span class="serif" style="font-size:25px;">library</span></h3>
        <p style="font-size:11.5px;color:var(--ink-3);margin-top:3px;font-family:'Geist Mono',monospace;">107 exercises · 14 added by you</p>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <div style="position:relative;">
          <input class="input" placeholder="Search exercises…" style="width:240px;padding-left:32px;">
          <span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--ink-4);font-size:12px;">⌕</span>
          <span style="position:absolute;right:10px;top:50%;transform:translateY(-50%);" class="kbd">⌘ K</span>
        </div>
        <button class="btn primary">＋ Add exercise</button>
      </div>
    </div>

    <div style="display:flex;gap:6px;padding:14px 28px;border-bottom:1px solid var(--line-soft);background:var(--surface-soft);align-items:center;">
      ${filterPill('All',107,true)}
      ${filterPill('Back',18,false)}
      ${filterPill('Chest',16,false)}
      ${filterPill('Legs',24,false)}
      ${filterPill('Shoulders',14,false)}
      ${filterPill('Arms',12,false)}
      ${filterPill('Core',15,false)}
      ${filterPill('Cardio',8,false)}
      <span style="margin-left:auto;font-size:11px;color:var(--ink-3);display:flex;align-items:center;gap:6px;">Sort by <span class="mono" style="color:var(--ink);">name ↓</span></span>
    </div>

    <table class="workout" style="border:none;border-radius:0;">
      <thead>
        <tr>
          <th style="width:32%;">Exercise</th>
          <th style="width:18%;">Muscle group</th>
          <th style="width:14%;">Category</th>
          <th style="width:14%;">Resistance</th>
          <th style="width:14%;">Added by</th>
          <th style="width:8%;text-align:right;"></th>
        </tr>
      </thead>
      <tbody>
        ${libRow('Bb bench press','Chest','Primary','kg','System')}
        ${libRow('Box climb','Quadriceps','Secondary','Bodyweight','Rachel',true)}
        ${libRow('Db deadlift','Hamstring','Primary','kg','System')}
        ${libRow('Db incline bench press','Chest','Primary','kg','System')}
        ${libRow('Face pulls','Shoulders','Primary','Band','System')}
        ${libRow('Plank','Core','Anti-extension','Bodyweight','System')}
        ${libRow('Pull up','Back','Secondary','Band','System')}
      </tbody>
    </table>

    <div style="padding:14px 28px;border-top:1px solid var(--line-soft);display:flex;align-items:center;justify-content:space-between;font-size:11.5px;color:var(--ink-3);">
      <span>Showing <span class="mono" style="color:var(--ink);">7 of 107</span> exercises</span>
      <div style="display:flex;gap:6px;">
        <button class="btn sm" disabled style="opacity:.5;">← Prev</button>
        <button class="btn sm">Next →</button>
      </div>
    </div>
  </div>
</div>

`;

function tooltipRow(color, name, vol, delta, dir){
  const deltaColor = dir==='up'?'var(--success)':dir==='down'?'var(--danger)':'var(--ink-4)';
  const arrow = dir==='up'?'↑':dir==='down'?'↓':'';
  return `<div style="display:flex;align-items:center;gap:8px;">
    <span style="width:7px;height:7px;border-radius:50%;background:${color};flex-shrink:0;"></span>
    <span style="flex:1;font-size:11.5px;">${name}</span>
    <span class="mono" style="font-size:11.5px;font-weight:500;letter-spacing:-0.01em;">${vol}</span>
    <span class="mono" style="font-size:10px;color:${deltaColor};min-width:32px;text-align:right;">${arrow}${delta}</span>
  </div>`;
}

function legendPill(name, tone, active){
  const colorMap = {sage:'#7E9A55',rose:'#B27466',lavender:'#7969B8',amber:'#C9A24D',ghost:'#9B9486'};
  return `<button class="pill ${tone}" style="${active?'':'opacity:.45;text-decoration:line-through;'}border:none;padding:5px 11px;font-size:11px;cursor:pointer;">
    <span style="width:8px;height:8px;border-radius:50%;background:${colorMap[tone]};"></span>${name}
  </button>`;
}

function bigStatCard(label, big, sub, tone, icon){
  const bg = tone==='sage'?'var(--sage)':tone==='amber'?'var(--amber)':'var(--lavender)';
  const ink = tone==='sage'?'var(--sage-ink)':tone==='amber'?'var(--amber-ink)':'var(--lavender-ink)';
  return `<div style="background:${bg};border-radius:var(--r-lg);padding:18px 20px;color:${ink};position:relative;overflow:hidden;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <p style="font-size:10.5px;font-weight:500;text-transform:uppercase;letter-spacing:.12em;opacity:.75;">${label}</p>
      ${icon?`<span style="font-size:14px;opacity:.6;">${icon}</span>`:''}
    </div>
    <p style="font-size:30px;font-weight:500;letter-spacing:-0.025em;margin-top:10px;line-height:1;">${big}</p>
    <p style="font-size:11.5px;margin-top:6px;opacity:.7;">${sub}</p>
  </div>`;
}

function csvRow(workout, muscle, category, exercise, sets, reps, parsed, note, isHeader){
  const isError = parsed === null;
  return `<tr style="${isHeader?'background:var(--surface-soft);':''}">
    <td><span style="font-weight:${isHeader?'600':'400'};color:${workout?'var(--ink)':'transparent'};">${workout||'·'}</span></td>
    <td class="muted">${muscle}</td>
    <td class="muted">${category}</td>
    <td><span class="ex-name">${exercise}</span></td>
    <td style="text-align:center;"><span class="num">${sets}</span></td>
    <td style="text-align:center;"><span class="num">${reps}</span></td>
    <td>${isError ? `<div style="display:flex;align-items:center;gap:6px;padding:4px 9px;background:transparent;border:1px dashed var(--danger);border-radius:6px;color:var(--danger);font-size:11.5px;width:fit-content;cursor:pointer;"><span class="mono">${note}</span><span style="opacity:.5;">→</span></div>` : `<span class="resist-chip mono">${parsed}</span>`}</td>
    <td style="text-align:center;">${note && !isError ? '<span class="note-btn active" title="Has note"><span class="note-glyph"><i></i><i></i><i></i></span></span>' : '<span class="note-btn empty">＋</span>'}</td>
  </tr>`;
}

function filterPill(name, count, active){
  return `<button class="btn sm" style="${active?'background:var(--ink);color:#fff;border-color:var(--ink);':''}gap:6px;">
    ${name}<span style="font-family:'Geist Mono',monospace;font-size:10px;opacity:${active?.65:.5};">${count}</span>
  </button>`;
}

function libRow(name, muscle, category, resist, addedBy, custom){
  return `<tr>
    <td><span class="ex-name">${name}</span>${custom?'<span class="pill lavender" style="font-size:9.5px;margin-left:8px;padding:2px 6px;">Custom</span>':''}</td>
    <td class="muted">${muscle}</td>
    <td class="muted">${category}</td>
    <td><span class="resist-chip mono" style="font-size:10.5px;">${resist}</span></td>
    <td class="muted" style="font-family:'Geist Mono',monospace;font-size:11.5px;">${addedBy}</td>
    <td style="text-align:right;"><button class="btn icon ghost" style="color:var(--ink-3);">✎</button></td>
  </tr>`;
}
