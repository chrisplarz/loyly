const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
for(const width of [320,390,768,1280])for(const reducedMotion of ['reduce','no-preference'])test(`Settings jumps ${width}px ${reducedMotion}`,async t=>{
 const browser=await chromium.launch({headless:true});t.after(()=>browser.close());const page=await browser.newPage({viewport:{width,height:850},reducedMotion}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',r=>r.request().url()==='http://jump.test/'?r.fulfill({contentType:'text/html',body:html}):r.abort());
 await page.addInitScript(()=>localStorage.setItem('loyly-journal-v1',JSON.stringify({profile:{goal:3,appearance:{dailyIntro:false}},visits:[]})));
 await page.goto('http://jump.test/');await page.evaluate(()=>nav('profile'));const nav=page.getByRole('navigation',{name:'Settings sections'}),buttons=nav.getByRole('button');assert.equal(await buttons.count(),6);
 assert.equal(await buttons.allTextContents().then(x=>x.join('').trim()),'');
 const before=await page.evaluate(()=>localStorage.getItem('loyly-journal-v1'));
 for(const name of ['Calendar preferences','Appearance','Your data belongs to you','Profile']){
  await nav.getByRole('button',{name,exact:true}).click();await page.waitForTimeout(reducedMotion==='reduce'?50:600);
  const button=nav.getByRole('button',{name,exact:true});assert.equal(await button.getAttribute('aria-current'),'location');
  const metrics=await button.evaluate(b=>{const n=b.closest('nav'),section=document.getElementById(b.getAttribute('aria-controls'));return {gap:section.querySelector('h2').getBoundingClientRect().top-n.getBoundingClientRect().bottom,selected:b.getBoundingClientRect().width,others:[...n.children].filter(x=>x!==b).map(x=>x.getBoundingClientRect().width),bg:getComputedStyle(b).backgroundColor,color:getComputedStyle(b).color}});
  assert.ok(Math.abs(metrics.gap-20)<2,JSON.stringify(metrics));assert.ok(metrics.others.every(w=>w<metrics.selected));assert.equal(metrics.bg,'rgb(25, 56, 50)');assert.equal(metrics.color,'rgb(255, 255, 255)');
 }
 await page.evaluate(()=>{const e=document.getElementById('settings-thought');window.scrollTo({top:scrollY+e.querySelector('h2').getBoundingClientRect().top-70,behavior:'instant'})});await page.waitForTimeout(100);assert.equal(await nav.getByRole('button',{name:'Today’s Thought',exact:true}).getAttribute('aria-current'),'location');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.equal(await page.evaluate(()=>localStorage.getItem('loyly-journal-v1')),before);
 if(process.env.OLO_JUMP_SCREENSHOTS&&reducedMotion==='reduce'&&[390,1280].includes(width)){await nav.getByRole('button',{name:'Appearance',exact:true}).click();await page.screenshot({path:process.env.OLO_JUMP_SCREENSHOTS+'-'+width+'.png'})}
 await page.evaluate(()=>nav('home'));await page.evaluate(()=>nav('profile'));assert.equal(await page.locator('.section-jump-nav').count(),1);assert.deepEqual(errors,[]);
});
