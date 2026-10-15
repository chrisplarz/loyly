const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const profile={name:'Local',gender:'',weight:'',goal:3};
const visit=(id,notes='original')=>({id,date:'2026-10-01',notes,source:'manual',createdAt:10,intervals:[{type:'sauna',durationMs:60000,temp:null,activity:[]}]});
async function setup(t,width=390){
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});t.after(()=>browser.close());
 const page=await browser.newPage({viewport:{width,height:844}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));t.after(()=>assert.deepEqual(errors,[]));
 await page.route('**/*',r=>r.request().url()==='http://loyly.test/'?r.fulfill({contentType:'text/html',body:html}):r.abort());
 await page.addInitScript(({profile,visits})=>{localStorage.setItem('loyly-journal-v1',JSON.stringify({profile,visits}));localStorage.setItem('loyly-cloud-meta-v1',JSON.stringify({deleted:{deleted:20},profileUpdatedAt:10}))},{profile,visits:[visit('a'),visit('b')]});
 await page.goto('http://loyly.test/');await page.evaluate(()=>nav('profile'));return page;
}
async function upload(page,data){await page.locator('#importFile').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(typeof data==='string'?data:JSON.stringify(data))});}
const stored=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('loyly-journal-v1')));
test('mobile preview, cancellation, merge, recovery and offline operation',async t=>{
 const page=await setup(t);const original=await stored(page);
 const incoming={profile:{...profile,name:'Imported'},visits:[visit('a'),visit('b','conflict'),visit('c'),visit('deleted')]};
 await upload(page,incoming);await page.getByRole('dialog').waitFor();
 assert.deepEqual(await stored(page),original);
 assert.match(await page.getByRole('dialog').innerText(),/1 previously deleted/);
 assert.deepEqual(await page.locator('#modalRoot .stat-number').allTextContents(),['1','1','1']);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.getByRole('button',{name:'Cancel',exact:true}).click();assert.deepEqual(await stored(page),original);
 await page.context().setOffline(true);
 await upload(page,incoming);await page.getByRole('button',{name:'Safe merge · Recommended',exact:true}).click();
 const result=await stored(page);assert.deepEqual(result.visits.slice(0,2),original.visits);assert.equal(result.visits.length,3);assert.deepEqual(result.profile,profile);
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem(RECOVERYKEY)).db),original);
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export backup',exact:true}).click();const download=await downloadPromise;
 const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));assert.deepEqual(exported.visits,result.visits);assert.equal(exported.format,'loyly-journal-v1');
 await upload(page,exported);await page.getByRole('button',{name:'Safe merge · Recommended',exact:true}).click();assert.deepEqual(await stored(page),result);
});
test('invalid file, stale preview, sync in flight, and storage failure cannot change data',async t=>{
 const page=await setup(t,1280),original=await stored(page);
 await upload(page,'{');await page.getByText('That file is not valid JSON. No data changed.').waitFor();assert.deepEqual(await stored(page),original);
 await upload(page,{profile,visits:[visit('c')]});await page.getByRole('dialog').waitFor();
 await page.evaluate(()=>{cloudMeta.deleted.c=50});await page.getByRole('button',{name:'Safe merge · Recommended',exact:true}).click();assert.deepEqual(await stored(page),original);
 await page.evaluate(()=>{syncing=true});await page.getByRole('button',{name:'Safe merge · Recommended',exact:true}).click();assert.deepEqual(await stored(page),original);
 await page.evaluate(()=>{syncing=false;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===KEY){Storage.prototype.setItem=original;throw Error('quota')}return original.call(this,k,v)}});
 await page.getByRole('button',{name:'Safe merge · Recommended',exact:true}).click();assert.deepEqual(await stored(page),original);
 assert.deepEqual(await page.evaluate(()=>db),original);
});
test('replace requires explicit consent, retains draft and records tombstones',async t=>{
 const page=await setup(t);await page.evaluate(()=>{draft={id:'draft',intervals:[]};persistDraft()});
 await upload(page,{profile:{...profile,name:'Imported'},visits:[visit('b','changed')]});
 await page.getByRole('button',{name:'Replace…',exact:true}).click();
 assert.equal(await page.getByRole('button',{name:'Confirm replace',exact:true}).isDisabled(),true);
 assert.equal((await stored(page)).visits.length,2);
 await page.locator('#replaceConsent').check();await page.getByRole('button',{name:'Confirm replace',exact:true}).click();
 const result=await stored(page);assert.equal(result.visits.length,1);assert.equal(result.visits[0].notes,'changed');assert.equal(result.profile.name,'Imported');
 assert.ok(await page.evaluate(()=>cloudMeta.deleted.a));
 const merged=await page.evaluate(()=>mergedData({visits:[{id:'a',date:'2026-10-01',createdAt:10,intervals:[]}],deleted:{},profileUpdatedAt:0}));assert.equal(merged.visits.some(v=>v.id==='a'),false);assert.equal(merged.visits.some(v=>v.id==='b'),true);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem(DRAFTKEY)).id),'draft');
});
