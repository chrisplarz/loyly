const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const api=import('../scripts/release.mjs');
async function fixture(t){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'olo-release-test-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 for(const d of ['.openai','assets','icons'])fs.mkdirSync(path.join(root,d));
 for(const [p,s] of Object.entries({'index.html':'<html><head></head><body>approved</body></html>','sw.js':"const CACHE='loyly-journal-shell-v33';",'manifest.webmanifest':'{}','assets/paper.svg':'<svg/>','icons/icon.svg':'<svg/>','.openai/hosting.json':JSON.stringify({static:{directory:'dist'}})}))fs.writeFileSync(path.join(root,p),s);
 const a=await api,upstream={commit:'reviewed-main',files:a.runtimeFiles(root)};
 fs.writeFileSync(path.join(root,'.openai/source-sync.json'),JSON.stringify({schema:1,github:{files:upstream.files},prepared:null}));return {root,a,upstream};
}
test('prepare derives output, records exact hashes and identifies the release',async t=>{
 const {root,a,upstream}=await fixture(t);const result=a.prepareRelease(root,33,{upstream});assert.equal(result.version,33);assert.deepEqual(a.runtimeFiles(root),a.runtimeFiles(path.join(root,'dist')));assert.match(fs.readFileSync(path.join(root,'dist/index.html'),'utf8'),/name="olo-release" content="33"/);assert.equal(a.verifyRelease(root).files,5);
});
test('unknown GitHub runtime changes block preparation before mutating source or output',async t=>{
 const {root,a,upstream}=await fixture(t),before=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.throws(()=>a.prepareRelease(root,33,{upstream:{commit:'new-main',files:{...upstream.files,'index.html':'changed'}}}),/GitHub source drift/);assert.equal(fs.readFileSync(path.join(root,'index.html'),'utf8'),before);assert.equal(fs.existsSync(path.join(root,'dist')),false);
});
test('the merged published release is accepted as the next upstream baseline',async t=>{
 const {root,a,upstream}=await fixture(t);a.prepareRelease(root,33,{upstream});const merged={commit:'merged-release-33',files:a.runtimeFiles(root)};fs.appendFileSync(path.join(root,'index.html'),'<!-- new focused feature -->');a.prepareRelease(root,33,{upstream:merged});assert.equal(JSON.parse(fs.readFileSync(path.join(root,'.openai/source-sync.json'))).github.commit,'merged-release-33');
});
test('stale or extra deployment output blocks the final check',async t=>{
 const {root,a,upstream}=await fixture(t);a.prepareRelease(root,33,{upstream});fs.appendFileSync(path.join(root,'dist/index.html'),'stale');assert.throws(()=>a.verifyRelease(root),/Source and dist differ/);a.prepareRelease(root,33,{upstream});fs.writeFileSync(path.join(root,'dist/stale.js'),'old');assert.throws(()=>a.verifyRelease(root),/Source and dist differ/);
});
test('changing both source and output after preparation cannot bypass fingerprint checking',async t=>{
 const {root,a,upstream}=await fixture(t);a.prepareRelease(root,33,{upstream});for(const p of ['index.html','dist/index.html'])fs.appendFileSync(path.join(root,p),'changed');assert.throws(()=>a.verifyRelease(root),/Runtime changed after release preparation/);
});
test('new upstream drift at publication and inconsistent release versions both fail',async t=>{
 const {root,a,upstream}=await fixture(t);assert.throws(()=>a.prepareRelease(root,34,{upstream}),/matching service-worker/);a.prepareRelease(root,33,{upstream});assert.throws(()=>a.verifyRelease(root,{upstream:{commit:'racing-edit',files:{...upstream.files,'sw.js':'changed'}}}),/GitHub source drift/);
});

test('release configuration targets the renamed olo-notes main and rejects other repositories or branches',async()=>{
 const a=await api,approved={remote:'https://github.com/chrisplarz/olo-notes.git',branch:'main'};
 assert.doesNotThrow(()=>a.assertGitHubTarget(approved));
 const configured=JSON.parse(fs.readFileSync(path.join(__dirname,'../.openai/source-sync.json'),'utf8')).github;
 assert.deepEqual({remote:configured.remote,branch:configured.branch},approved);
 for(const config of [{...approved,remote:'https://github.com/chrisplarz/loyly.git'},{...approved,remote:'https://github.com/other/olo-notes.git'},{...approved,branch:'unreviewed'}])assert.throws(()=>a.fetchGitHub(config),/Unexpected approved GitHub repository/);
});
