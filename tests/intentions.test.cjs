const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes('const KEY='));
const code=script.slice(0,script.lastIndexOf("navRender();nav('home');"));
const KEY='loyly-journal-v1',DRAFTKEY='loyly-live-v1';
function harness(store=new Map()){
 const nodes=new Map();
 const node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',textContent:'',innerHTML:'',hidden:false,disabled:false,open:false,isConnected:true,style:{setProperty(){}},dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(k,v){this[k]=v},getAttribute(k){return this[k]},querySelector(){return null},querySelectorAll(){return []},focus(){},showModal(){this.open=true},close(){this.open=false},getBoundingClientRect(){return {left:0,right:540,top:0,bottom:700}}});return nodes.get(id)};
 const state={fail:false,writes:[],downloads:[]};
 const ctx=vm.createContext({URL,Date,Math,JSON,Map,Set,Object,Number,String,Array,Boolean,Error,structuredClone,crypto:{randomUUID:()=>`id-${++state.counter}`},localStorage:{getItem:k=>store.get(k)||null,setItem(k,v){if(state.fail&&k===KEY)throw Error('Quota');store.set(k,v);state.writes.push(k)},removeItem:k=>store.delete(k)},document:{getElementById:node,activeElement:node('opener'),querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},removeEventListener(){},documentElement:{classList:{add(){},remove(){}}}},window:{addEventListener(){},scrollTo(){},innerHeight:844},navigator:{onLine:false},setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,confirm:()=>true,console});
 state.counter=0;vm.runInContext(code,ctx);
 vm.runInContext("renderPage=()=>{};renderSessionArea=()=>{};nav=page=>view=page;toast=msg=>{};downloadFile=(content,name,type)=>globalThis.downloads.push({content,name,type});",ctx);ctx.downloads=state.downloads;
 return {ctx,store,state,node,run:s=>vm.runInContext(s,ctx),json:s=>JSON.parse(vm.runInContext(`JSON.stringify(${s})`,ctx))};
}
function pending(h,text='Give myself room to rest.') {h.ctx.openIntention();h.ctx.updateIntentionInput(text);h.ctx.saveIntention()}
function interval(h){h.ctx.startInterval('sauna');h.run('draft.current.accumulated=60000;draft.current.startedAt=Date.now()');h.ctx.completeCurrent();assert.equal(h.ctx.persistDraft(),true)}
test('pending survives refresh, edits in place, and removal creates no visit or timer',()=>{
 const h=harness();pending(h);assert.equal(h.json('db.visits.length'),0);assert.equal(h.json('draft'),null);
 const reopened=harness(h.store);assert.equal(reopened.json('db.pendingIntention'),'Give myself room to rest.');
 reopened.ctx.openIntention();assert.equal(reopened.json('intentionEditor.text'),'Give myself room to rest.');reopened.ctx.updateIntentionInput('Find quiet.');reopened.ctx.saveIntention();assert.equal(reopened.json('db.pendingIntention'),'Find quiet.');
 reopened.ctx.openIntention();reopened.ctx.saveIntention(true);assert.equal(reopened.json('db.pendingIntention||null'),null);assert.match(reopened.ctx.homeIntentionMarkup(),/Set an intention/);
});
test('cancel is unchanged; dirty dismiss and Keep editing preserve entered text',()=>{
 const h=harness();pending(h,'Original');h.ctx.openIntention();h.ctx.requestIntentionDismiss();assert.equal(h.json('intentionEditor'),null);
 h.ctx.openIntention();h.ctx.updateIntentionInput('Unsaved');h.ctx.requestIntentionDismiss();assert.equal(h.node('intentionDiscard').hidden,false);assert.equal(h.json('db.pendingIntention'),'Original');h.ctx.keepIntentionEditing();assert.equal(h.json('intentionEditor.text'),'Unsaved');h.ctx.closeIntention();assert.equal(h.json('db.pendingIntention'),'Original');
});
test('save rejects blank text, supports editable suggestions and one submission',()=>{
 const h=harness();h.ctx.openIntention();h.ctx.updateIntentionInput('   ');assert.equal(h.node('intentionSave').disabled,true);h.ctx.saveIntention();assert.equal(h.json('db.pendingIntention||null'),null);
 h.ctx.chooseIntentionSuggestion(1);assert.equal(h.json('intentionEditor.text'),'Give myself time to slow down and be present.');h.ctx.updateIntentionInput('My own words');h.ctx.saveIntention();const writes=h.state.writes.filter(k=>k===KEY).length;h.ctx.saveIntention();assert.equal(h.state.writes.filter(k=>k===KEY).length,writes);
});
test('failed intention save retains dialog, entered text, saved value and supports retry',()=>{
 const h=harness();pending(h,'Original');h.ctx.openIntention();h.ctx.updateIntentionInput('Updated');h.state.fail=true;h.ctx.saveIntention();assert.equal(h.json('db.pendingIntention'),'Original');assert.equal(h.json('intentionEditor.text'),'Updated');assert.equal(h.node('intentionError').hidden,false);assert.equal(h.node('intentionDialog').open,true);
 h.state.fail=false;h.ctx.saveIntention();assert.equal(h.json('db.pendingIntention'),'Updated');assert.equal(h.node('intentionDialog').open,false);
});
test('visit creation consumes pending exactly once in one atomic KEY write; no timer starts',()=>{
 const h=harness();pending(h);const count=h.state.writes.filter(k=>k===KEY).length;h.ctx.beginLive();assert.equal(h.state.writes.filter(k=>k===KEY).length,count+1);const id=h.json('draft.id');assert.equal(h.json('draft.intention'),'Give myself room to rest.');assert.equal(h.json('draft.current'),null);assert.equal(h.json('db.pendingIntention||null'),null);h.ctx.beginLive();assert.equal(h.json('draft.id'),id);
 const reopened=harness(h.store);assert.equal(reopened.json('draft.id'),id);assert.equal(reopened.json('db.pendingIntention||null'),null);
});
test('failed visit creation preserves pending and creates no current visit',()=>{
 const h=harness();pending(h);h.state.fail=true;assert.equal(h.ctx.ensureLiveVisit(),false);assert.equal(h.json('draft'),null);assert.equal(h.json('db.pendingIntention'),'Give myself room to rest.');const reopened=harness(h.store);assert.equal(reopened.json('draft'),null);assert.equal(reopened.json('db.pendingIntention'),'Give myself room to rest.');
});
test('active visit can add/edit its own intention; pending slot is not used',()=>{
 const h=harness();h.ctx.beginLive();h.ctx.openIntention();h.ctx.updateIntentionInput('Be here.');h.ctx.saveIntention();assert.equal(h.json('draft.intention'),'Be here.');assert.equal(h.json('db.pendingIntention||null'),null);
 h.ctx.openIntention();h.ctx.updateIntentionInput('Rest.');h.ctx.saveIntention();assert.equal(h.json('draft.intention'),'Rest.');assert.match(h.ctx.homeIntentionMarkup(),/Your intention/);
});
test('historical entry does not consume pending; intention and response editable per visit',()=>{
 const h=harness();pending(h,'For tomorrow');h.ctx.beginManual();h.run("manualDate='2026-01-01';manualIntention='Historical rest';manualIntentionResponse='Somewhat'");h.node('manualDate').value='2026-01-01';h.node('manualHeat').value='10';h.ctx.saveManual();assert.equal(h.json('db.pendingIntention'),'For tomorrow');assert.equal(h.json('db.visits[0].intention'),'Historical rest');assert.equal(h.json('db.visits[0].intentionResponse'),'Somewhat');
 const id=h.json('db.visits[0].id');h.ctx.editVisit(id);assert.equal(h.json('manualIntention'),'Historical rest');h.ctx.updateManualIntention('New intention');h.ctx.setIntentionResponse('manual','Yes');h.ctx.saveManual();assert.equal(h.json('db.visits.length'),1);assert.equal(h.json('db.visits[0].intentionResponse'),'Yes');assert.equal(h.json('db.pendingIntention'),'For tomorrow');
});
test('optional reflection toggles off, persists and failed completion keeps the correct active intention',()=>{
 const h=harness();pending(h);h.ctx.beginLive();interval(h);h.ctx.openReflectModal();h.ctx.setIntentionResponse('live','Yes');assert.equal(h.json('draft.intentionResponse'),'Yes');h.ctx.setIntentionResponse('live','Yes');assert.equal(h.json('draft.intentionResponse'),null);h.ctx.setIntentionResponse('live','Not today');
 h.node('reflectBefore').value='3';h.node('reflectAfter').value='4';h.node('reflectNotes').value='A quiet hour';h.state.fail=true;h.ctx.saveLiveVisit();assert.equal(h.json('db.visits.length'),0);assert.equal(h.json('draft.intentionResponse'),'Not today');assert.equal(h.json('draft.intention'),'Give myself room to rest.');assert.equal(h.node('reflectNotes').value,'A quiet hour');
 h.state.fail=false;h.ctx.saveLiveVisit();assert.equal(h.json('draft'),null);assert.equal(h.json('db.visits[0].intentionResponse'),'Not today');h.ctx.saveLiveVisit();assert.equal(h.json('db.visits.length'),1);assert.equal(harness(h.store).json('draft'),null);
});
test('legacy active draft migrates; visits without intentions save normally; deleting does not requeue',()=>{
 const store=new Map([[DRAFTKEY,JSON.stringify({id:'legacy',date:'2026-01-01',intervals:[{type:'sauna',durationMs:60000}],current:null})]]);const h=harness(store);assert.equal(h.json('draft.id'),'legacy');h.node('reflectBefore').value=3;h.node('reflectAfter').value=4;h.ctx.saveLiveVisit();assert.equal(h.json('db.visits.length'),1);assert.equal(harness(store).json('draft'),null);
 h.ctx.deleteVisit('legacy');assert.equal(h.json('db.visits.length'),0);assert.equal(h.json('db.pendingIntention||null'),null);
});
test('JSON/CSV/private analysis export includes intentions; backup validates and round-trips new fields',()=>{
 const h=harness();pending(h,'Next');h.run("db.visits=[{id:'v1',date:'2026-01-01',intervals:[{type:'sauna',durationMs:60000}],intention:'Rest',intentionResponse:'Yes'}]");h.ctx.persist();h.ctx.exportJSON();const backup=JSON.parse(h.state.downloads[0].content);assert.equal(backup.pendingIntention,'Next');assert.ok(!Object.hasOwn(backup,'activeVisit'));assert.equal(h.ctx.parseBackup(JSON.stringify(backup)).visits[0].intentionResponse,'Yes');
 h.ctx.exportCSV();assert.match(h.state.downloads[1].content,/Intention response/);assert.match(h.state.downloads[1].content,/Rest/);
 const visits=h.json('db.visits');assert.equal(h.ctx.chatGPTSnapshot(visits,true).visits[0].intention,'Rest');assert.equal(h.ctx.chatGPTSnapshot(visits,false).visits[0].intention,undefined);
 for(const invalid of [{...backup,pendingIntention:'x'.repeat(201)},{...backup,visits:[{...backup.visits[0],intentionResponse:'Fail'}]},{...backup,visits:[{...backup.visits[0],intention:12}]}])assert.throws(()=>h.ctx.parseBackup(JSON.stringify(invalid)));
});
test('cloud adoption and backup restore keep device-local pending and active intention',()=>{
 const h=harness();pending(h);h.ctx.beginLive();h.run("db.pendingIntention='For later'");h.ctx.persist();h.ctx.adoptMerged({profile:h.json('db.profile'),visits:[],deleted:{},profileUpdatedAt:0});assert.equal(h.json('draft.intention'),'Give myself room to rest.');assert.equal(h.json('db.pendingIntention'),'For later');
 const backup={profile:h.json('db.profile'),visits:[],pendingIntention:'From backup'};
 const merged=h.ctx.buildBackupRestore(backup,h.json('db'),{deleted:{},profileUpdatedAt:0},'merge');assert.equal(merged.db.pendingIntention,'For later');assert.equal(merged.db.activeVisit.intention,'Give myself room to rest.');
 const replaced=h.ctx.buildBackupRestore(backup,h.json('db'),{deleted:{},profileUpdatedAt:0},'replace');assert.equal(replaced.db.pendingIntention,'From backup');assert.equal(replaced.db.activeVisit.intention,'Give myself room to rest.');
});
test('Escape asks before discarding; form markup has accessible native dialog controls',()=>{
 const h=harness();h.ctx.openIntention();h.ctx.updateIntentionInput('Keep this text');h.node('intentionDiscard').hidden=true;let prevented=false;h.node('intentionDialog').oncancel({preventDefault(){prevented=true}});assert.equal(prevented,true);assert.equal(h.node('intentionDiscard').hidden,false);assert.equal(h.json('intentionEditor.text'),'Keep this text');h.node('intentionDialog').oncancel({preventDefault(){}});assert.equal(h.node('intentionForm').hidden,false);
 const markup=h.node('intentionDialog').innerHTML;for(const expected of ['maxlength="200"','aria-pressed="false"','for="intentionText"','aria-describedby="intentionCount intentionDescription"','Discard changes?','Keep editing'])assert.ok(markup.includes(expected));assert.match(html,/<dialog class="intention-dialog"/);assert.match(html,/\.intention-dialog::backdrop/);assert.match(html,/intention-keyboard-inset/);
});
test('failed removal can retry the same action and failed active edit preserves the previous intention',()=>{
 const h=harness();pending(h,'Original');h.ctx.openIntention();h.state.fail=true;h.ctx.saveIntention(true);assert.equal(h.json('db.pendingIntention'),'Original');h.state.fail=false;h.ctx.saveIntention();assert.equal(h.json('db.pendingIntention||null'),null);
 pending(h,'Attached');h.ctx.beginLive();h.ctx.openIntention();h.ctx.updateIntentionInput('Changed');h.state.fail=true;h.ctx.saveIntention();assert.equal(h.json('draft.intention'),'Attached');assert.equal(h.json('intentionEditor.text'),'Changed');
});
test('an unrelated visit is unchanged, and optional reflection can be skipped entirely',()=>{
 const h=harness();h.run("db.visits=[{id:'old',date:'2026-01-01',intervals:[{type:'sauna',durationMs:60000}],intention:'Original history',intentionResponse:'Yes'}]");h.ctx.persist();pending(h,'New');h.ctx.beginLive();interval(h);h.node('reflectBefore').value=3;h.node('reflectAfter').value=4;h.ctx.saveLiveVisit();assert.equal(h.json('db.visits[0].intentionResponse'),null);assert.equal(h.json('db.visits[1].intention'),'Original history');assert.equal(h.json('db.visits[1].intentionResponse'),'Yes');
 const id=h.json('db.visits[0].id');h.ctx.deleteVisit(id);assert.equal(h.json('db.pendingIntention||null'),null);assert.equal(h.json('db.visits.length'),1);
});
