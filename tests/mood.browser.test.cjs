const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
for(const width of [280,320,390,635,768,769,1024,1280,1920])test('mood icons remain evenly spaced and save numeric values at '+width+'px',async t=>{
 const browser=await chromium.launch({headless:true});t.after(()=>browser.close());
 const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
 await page.route('**/*',r=>{const url=new URL(r.request().url());if(url.href==='http://olo-mood.test/')return r.fulfill({contentType:'text/html',body:html});if(/^\/assets\/mood-[1-5]\.svg$/.test(url.pathname))return r.fulfill({contentType:'image/svg+xml',body:fs.readFileSync(path.join(__dirname,'..',url.pathname))});return r.abort()});
 await page.addInitScript(()=>localStorage.setItem('loyly-journal-v1',JSON.stringify({profile:{goal:3,appearance:{dailyIntro:false}},visits:[]})));
 await page.goto('http://olo-mood.test/');await page.evaluate(()=>{sessionTab='manual';nav('journal')});
 for(const row of await page.locator('.mood-row').all()){
  assert.equal(await row.locator('button').count(),5);
  const boxes=await row.locator('button').evaluateAll(es=>es.map(e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right}}));
  assert.ok(boxes.every(b=>Math.abs(b.y-boxes[0].y)<1));
  const gaps=boxes.slice(1).map((b,i)=>b.x-boxes[i].right);
  if(width<=768)assert.ok(Math.max(...gaps)-Math.min(...gaps)<1);else assert.ok(Math.max(...gaps)<=64.1);
  for(let n=1;n<=5;n++){
   const img=row.locator('img').nth(n-1);assert.equal(await img.getAttribute('src'),'assets/mood-'+n+'.svg');
   assert.deepEqual(await img.evaluate(e=>({loaded:e.complete&&e.naturalWidth>0,w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})),{loaded:true,w:32,h:32});
  }
  assert.deepEqual(await row.locator('.mood-label').allTextContents(),['Upset','Down','OK','Good','Excellent']);
 }
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.getByRole('group',{name:'Before your visit mood'}).getByRole('button',{name:'1 · Upset',exact:true}).click();
 await page.getByRole('group',{name:'After your visit mood'}).getByRole('button',{name:'5 · Excellent',exact:true}).click();
 assert.equal(await page.evaluate(()=>manualMoodBefore),1);assert.equal(await page.evaluate(()=>manualMoodAfter),5);
 assert.equal(await page.getByRole('group',{name:'After your visit mood'}).getByRole('button',{name:'5 · Excellent',exact:true}).getAttribute('aria-pressed'),'true');
 for(const [n,color] of [[1,'rgb(166, 78, 66)'],[2,'rgb(220, 158, 119)'],[3,'rgb(245, 216, 148)'],[4,'rgb(192, 199, 155)'],[5,'rgb(148, 158, 106)']]){
  const btn=page.getByRole('group',{name:'After your visit mood'}).locator('button').nth(n-1);await btn.click();
  assert.equal(await page.getByRole('group',{name:'After your visit mood'}).locator('button').nth(n-1).evaluate(e=>getComputedStyle(e).backgroundColor),color);
 }
 await page.locator('#manualHeat').fill('10');await page.getByRole('button',{name:'Save visit',exact:true}).click();
 const visit=await page.evaluate(()=>db.visits[0]);assert.equal(visit.moodBefore,1);assert.equal(visit.moodAfter,5);await page.evaluate(()=>editVisit(db.visits[0].id));assert.equal(await page.getByRole('group',{name:'Before your visit mood'}).getByRole('button',{name:'1 · Upset',exact:true}).getAttribute('aria-pressed'),'true');assert.equal(await page.getByRole('group',{name:'After your visit mood'}).getByRole('button',{name:'5 · Excellent',exact:true}).getAttribute('aria-pressed'),'true');
 if([390,1280].includes(width)){await page.evaluate(()=>{sessionTab='manual';nav('journal')});await page.addStyleTag({content:'#bottomNav,.toast{visibility:hidden!important}'});await page.locator('.mood-row').first().screenshot({path:path.join(__dirname,'../../mood-restore-'+width+'.png')});}
});
