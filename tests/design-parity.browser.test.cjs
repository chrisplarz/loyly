const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),release=JSON.parse(fs.readFileSync(path.join(__dirname,'../.openai/source-sync.json'))).prepared.version;
for(const width of [320,390,635,1280])test('approved Figma/GitHub navigation, branding and thought card at '+width+'px',async t=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});t.after(()=>browser.close());
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));t.after(()=>assert.deepEqual(errors,[]));
 await page.route('**/*',r=>r.request().url()==='http://olo-parity.test/'?r.fulfill({contentType:'text/html',body:html}):r.abort());
 await page.addInitScript(()=>localStorage.setItem('loyly-journal-v1',JSON.stringify({profile:{goal:3,appearance:{dailyIntro:false}},visits:[]})));
 await page.goto('http://olo-parity.test/');assert.equal(await page.locator('meta[name="olo-release"]').getAttribute('content'),String(release));
 assert.equal(await page.locator('.reflection-hint').textContent(),'Read more');assert.equal(await page.locator('.reflection-attribution').textContent(),'Eckhart Tolle');assert.equal(await page.locator('.reflection-hint').evaluate(e=>getComputedStyle(e,'::before').display),'none');assert.match(await page.locator('.reflection-title').evaluate(e=>getComputedStyle(e).fontFamily),/^Georgia/);assert.equal(await page.locator('.reflection-title').evaluate(e=>getComputedStyle(e).fontStyle),'italic');
 await page.getByRole('button',{name:'Today’s Thought',exact:true}).click();assert.equal(await page.locator('.reflection-hint').textContent(),'Read less');await page.getByRole('button',{name:'Today’s Thought',exact:true}).click();assert.equal(await page.locator('#reflection-body').evaluate(e=>e.inert),true);
 if(width<=680){
  const nav=page.locator('#bottomNav'),pill=page.locator('#bottomNav [aria-current="page"] .bottom-nav-content');assert.equal(await nav.isVisible(),true);assert.equal(await nav.getByRole('button').count(),4);
  assert.equal(await pill.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(244, 241, 230)');assert.equal(await pill.evaluate(e=>Math.round(e.getBoundingClientRect().width)),Math.round(Math.min(86,(width-18)/4-8)));
  assert.equal(await pill.locator('.bottom-nav-label').textContent(),'Home');assert.equal(await pill.locator('.bottom-nav-label').evaluate(e=>getComputedStyle(e).fontWeight),'400');assert.equal(await nav.evaluate(e=>getComputedStyle(e).backdropFilter),'none');
  await nav.getByRole('button',{name:'Insights',exact:true}).click();assert.equal(await page.locator('#bottomNav [aria-current="page"] .bottom-nav-label').textContent(),'Insights');await nav.getByRole('button',{name:'Home',exact:true}).click();
 }else{
  assert.equal(await page.locator('.sidebar-brand').isVisible(),true);assert.equal(await page.locator('.sidebar-brand .brand').evaluate(e=>getComputedStyle(e).fontSize),'28px');assert.equal(await page.locator('.sidebar-brand .brand').evaluate(e=>getComputedStyle(e).fontWeight),'500');assert.equal(await page.locator('.sidebar-brand .brand-sub').evaluate(e=>getComputedStyle(e).textTransform),'uppercase');assert.equal(await page.locator('.sidebar-brand .brand-sub').evaluate(e=>getComputedStyle(e).borderTopWidth),'1px');
 }
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 if(process.env.OLO_RESTORED_SCREENSHOT){await page.screenshot({path:process.env.OLO_RESTORED_SCREENSHOT+'-'+width+'.png',fullPage:true});if(width<=680){await page.locator('.daily-reflection').scrollIntoViewIfNeeded();await page.screenshot({path:process.env.OLO_RESTORED_SCREENSHOT+'-detail-'+width+'.png'})}}
 await page.getByRole('button',{name:'Set Intention',exact:true}).click();assert.equal(await page.getByRole('dialog',{name:'Set an intention',exact:true}).isVisible(),true);await page.getByRole('button',{name:'Cancel',exact:true}).click();assert.equal(await page.locator('#page-journal').isVisible(),true);assert.equal(await page.locator('#liveClock').textContent(),'00:00');
});
