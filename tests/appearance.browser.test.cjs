const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const root=path.join(__dirname,'..');
const profile={name:'Nordic',gender:'',weight:'',goal:3};
const visit={id:'unchanged',date:'2026-10-01',createdAt:10,notes:'Keep me',intervals:[]};
// Test-only scene stand-ins exercise playback without introducing production stock imagery.
const scene='<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path fill="#81988b" d="M0 0h100v100H0z"/></svg>';
async function setup(t,{width=390,media=true,reducedMotion='no-preference',appearance,day,draft,slow=false}={}){
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});t.after(()=>browser.close());
 const page=await browser.newPage({viewport:{width,height:844},reducedMotion});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));t.after(()=>assert.deepEqual(errors,[]));
 await page.clock.install({time:new Date(2026,9,15,12)});
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.pathname==='/')return route.fulfill({contentType:'text/html',body:fs.readFileSync(path.join(root,'index.html'),'utf8')});
  if(/welcome-/.test(url.pathname)){
   if(slow)return; // Simulate an indefinitely pending media request.
   return media?route.fulfill({contentType:'image/svg+xml',body:scene}):route.abort();
  }
  if(url.pathname.startsWith('/assets/')&&fs.existsSync(path.join(root,url.pathname)))return route.fulfill({contentType:'image/svg+xml',body:fs.readFileSync(path.join(root,url.pathname))});
  return route.abort();
 });
 await page.addInitScript(({profile,visit,appearance,day,draft})=>{
  if(!localStorage.getItem('loyly-journal-v1'))localStorage.setItem('loyly-journal-v1',JSON.stringify({profile:{...profile,...(appearance?{appearance}:{})},visits:[visit]}));
  if(day)localStorage.setItem('loyly-welcome-day-v1',day);
  if(draft)localStorage.setItem('loyly-live-v1',JSON.stringify(draft));
 },{profile,visit,appearance,day,draft});
 await page.goto('http://loyly.test/',{waitUntil:'domcontentloaded'});return page;
}
const stored=page=>page.evaluate(()=>JSON.parse(localStorage.getItem(KEY)));
test('leaf paper replaces saved contours across reload, profile save and cloud merge',async t=>{
 const page=await setup(t,{media:false});await page.evaluate(()=>nav('profile'));
 assert.equal(await page.getByRole('radio').count(),0);
 assert.equal(await page.locator('body').getAttribute('data-background'),'botanical');
 await page.getByLabel('Show daily welcome intro').uncheck();
 await page.getByRole('button',{name:'Save preferences',exact:true}).click();
 assert.deepEqual((await stored(page)).visits,[visit]);
 assert.deepEqual((await stored(page)).profile.appearance,{background:'botanical',dailyIntro:false});
 await page.reload();assert.equal(await page.locator('body').getAttribute('data-background'),'botanical');
 await page.evaluate(()=>{adoptMerged(mergedData({profile:{...db.profile,appearance:{background:'contours',dailyIntro:false}},profileUpdatedAt:Date.now()+1000,visits:db.visits}))});
 assert.equal(await page.locator('body').getAttribute('data-background'),'botanical');
 assert.deepEqual((await stored(page)).visits,[visit]);
});
test('welcome lasts three seconds, shows Skip and plays once per local calendar day',async t=>{
 const page=await setup(t);await page.locator('.welcome-intro').waitFor();
 assert.equal(await page.getByRole('button',{name:'Skip',exact:true}).count(),1);
 assert.equal(await page.evaluate(()=>localStorage.getItem(WELCOME_DAY_KEY)),'2026-10-15');
 await page.clock.runFor(1500);assert.equal(await page.locator('.welcome-intro').count(),1);
 // Playwright's JS clock does not advance the browser's CSS animation timeline.
 await page.locator('.welcome-scene.second').evaluate(el=>el.getAnimations().forEach(a=>{a.pause();a.currentTime=1500}));
 assert.ok(Number(await page.locator('.welcome-scene.second').evaluate(el=>getComputedStyle(el).opacity))>0);
 await page.clock.runFor(1500);assert.equal(await page.locator('.welcome-intro').count(),0);
 await page.reload();assert.equal(await page.locator('.welcome-intro').count(),0);
 await page.clock.setSystemTime(new Date(2026,9,16,12));await page.evaluate(()=>playWelcome());await page.locator('.welcome-intro').waitFor();
 assert.equal(await page.evaluate(()=>localStorage.getItem(WELCOME_DAY_KEY)),'2026-10-16');
});
test('Skip, Escape and immediate access to session dismiss intro without changing journal',async t=>{
 const page=await setup(t);await page.locator('.welcome-intro').waitFor();
 await page.getByRole('button',{name:'Skip',exact:true}).click();assert.equal(await page.locator('.welcome-intro').count(),0);
 await page.evaluate(()=>playWelcome(true));await page.locator('.welcome-intro').waitFor();await page.keyboard.press('Escape');assert.equal(await page.locator('.welcome-intro').count(),0);
 await page.evaluate(()=>playWelcome(true));await page.locator('.welcome-intro').waitFor();
 await page.getByRole('button',{name:/Start session/}).click();assert.equal(await page.locator('.welcome-intro').count(),0);assert.equal(await page.evaluate(()=>view),'session');
 assert.deepEqual((await stored(page)).visits,[visit]);
});
test('disabled daily intro still allows preview; preview leaves daily tracking untouched',async t=>{
 const page=await setup(t,{appearance:{background:'contours',dailyIntro:false}});await page.evaluate(()=>nav('profile'));
 await page.getByRole('button',{name:'Preview introduction'}).click();await page.locator('.welcome-intro').waitFor();
 assert.equal(await page.evaluate(()=>localStorage.getItem(WELCOME_DAY_KEY)),null);
 await page.clock.runFor(3000);assert.equal(await page.locator('.welcome-intro').count(),0);
 assert.equal(await page.evaluate(()=>document.activeElement.id),'previewWelcome');
});
test('reduced motion skips welcome and media movement, including preview and runtime changes',async t=>{
 const page=await setup(t,{reducedMotion:'reduce'});assert.equal(await page.locator('.welcome-intro').count(),0);
 await page.evaluate(()=>nav('profile'));await page.getByRole('button',{name:'Preview introduction'}).click();
 await page.getByText('Introduction skipped because Reduce Motion is enabled.').waitFor();
 assert.equal(await page.evaluate(()=>localStorage.getItem(WELCOME_DAY_KEY)),null);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.getByRole('button',{name:'Preview introduction'}).click();await page.locator('.welcome-intro').waitFor();
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('.welcome-intro').waitFor({state:'detached'});
});
test('missing and stalled media fail open without recording a daily view',async t=>{
 for(const options of [{media:false},{slow:true}]){
  const page=await setup(t,options);await page.clock.runFor(1300);
  assert.equal(await page.locator('.welcome-intro').count(),0);assert.equal(await page.evaluate(()=>localStorage.getItem(WELCOME_DAY_KEY)),null);
  await page.getByRole('button',{name:/Start session/}).click();assert.equal(await page.evaluate(()=>view),'session');
 }
});
test('storage failures roll back welcome preference and skip automatic welcome; unfinished session is preserved',async t=>{
 const page=await setup(t,{draft:{id:'in-progress',intervals:[]}});assert.equal(await page.locator('.welcome-intro').count(),0);
 await page.evaluate(()=>nav('profile'));const before=await stored(page);
 await page.evaluate(()=>{Storage.prototype.setItem=function(){throw Error('blocked')}});
 await page.getByLabel('Show daily welcome intro').uncheck();assert.equal(await page.getByLabel('Show daily welcome intro').isChecked(),true);
 assert.deepEqual(await stored(page),before);assert.equal(await page.evaluate(()=>draft.id),'in-progress');
 await page.evaluate(()=>{draft=null;playWelcome()});await page.clock.runFor(1500);assert.equal(await page.locator('.welcome-intro').count(),0);
});
test('mobile and desktop keep content within viewport and hero geometry intact',async t=>{
 for(const width of [360,390,1280]){
  const page=await setup(t,{width,media:false});await page.evaluate(()=>nav('profile'));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.evaluate(()=>{nav('home');document.getElementById('page-home').getAnimations().forEach(a=>a.finish())});const before=await page.locator('.hero').boundingBox();
  await page.evaluate(()=>{db.profile.appearance={background:'botanical'};applyAppearance()});assert.deepEqual(await page.locator('.hero').boundingBox(),before);
  if(width===390){await page.screenshot({path:'/tmp/loyly-botanical-mobile.png',fullPage:true});}
 }
});
