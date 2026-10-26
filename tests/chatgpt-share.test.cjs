const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const storage=new Map();
const ctx=vm.createContext({URL,ownerKey:k=>k,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},document:{getElementById:()=>null},esc:s=>String(s),toast:()=>{}});
vm.runInContext(html.split('// BEGIN CHATGPT SHARE')[1].split('// END CHATGPT SHARE')[0],ctx);
test('only exact ChatGPT project destinations accepted; tracking and fragments removed',()=>{
 assert.equal(ctx.chatGPTProjectURL('https://chatgpt.com/g/g-p-abc/wrong'),null);
 for(const url of ['javascript:alert(1)','https://evil.test/g/g-p-abc/project','https://chatgpt.com.evil.test/g/g-p-abc/project','https://me@chatgpt.com/g/g-p-abc/project','https://chatgpt.com/c/abc'])assert.equal(ctx.chatGPTProjectURL(url),null);
 assert.equal(ctx.chatGPTProjectURL('https://chatgpt.com/g/g-p-abc/project?x=1#test'),'https://chatgpt.com/g/g-p-abc/project');
});
test('analysis snapshot omits identity, credentials and notes by default and preserves exposure/mood data',()=>{
 const visit={id:'a',date:'2026-10-16',moodBefore:2,moodAfter:4,notes:'private',email:'private@example.com',session:'secret',intervals:[{type:'sauna',durationMs:90000,temp:180,activity:['breathing']}]};
 const payload=ctx.chatGPTSnapshot([visit]);
 assert.equal(payload.visitCount,1);assert.equal(payload.visits[0].exposures[0].durationMinutes,1.5);assert.equal(payload.visits[0].moodAfter,4);
 assert.ok(!JSON.stringify(payload).includes('private'));assert.ok(!JSON.stringify(payload).includes('secret'));
 assert.equal(ctx.chatGPTSnapshot([visit],true).visits[0].notes,'private');
 assert.equal(ctx.chatGPTSnapshot([{...visit,moodAfter:5}]).visits[0].moodAfter,5);
 assert.equal(ctx.chatGPTSnapshot([]).visitCount,0);
});
test('saved destination survives reads and disconnect removes it without altering visits',()=>{
 storage.set('olo-chatgpt-project-v1',JSON.stringify({name:'Wellness',url:'https://chatgpt.com/g/g-p-abc/project'}));
 assert.equal(ctx.readChatGPTProject().name,'Wellness');assert.match(ctx.chatGPTStatusMarkup(),/Manual sharing/);
 ctx.showChatGPTShare=()=>{};ctx.disconnectChatGPT();assert.equal(ctx.readChatGPTProject(),null);
 storage.set('olo-chatgpt-project-v1','broken');assert.equal(ctx.readChatGPTProject(),null);
});
