const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const core=html.split('// BEGIN BACKUP CORE')[1].split('// END BACKUP CORE')[0];
const ctx=vm.createContext({structuredClone});vm.runInContext(core,ctx);
const {parseBackup,planBackup,buildBackupRestore}=ctx;
const profile={name:'Local',gender:'',weight:'',goal:3};
const visit=(id,notes='original')=>({id,date:'2026-10-01',source:'manual',notes,createdAt:10,intervals:[{id:'interval-'+id,type:'sauna',durationMs:60000,temp:null,activity:[]}]});
const backup=visits=>({profile,visits});
const meta=()=>({deleted:{},profileUpdatedAt:10});
const json=x=>JSON.parse(JSON.stringify(x));
test('legacy and v1 export/import round trip',()=>{
 const original=backup([visit('a')]);
 for(const payload of [original,{...original,format:'loyly-journal-v1',exportedAt:new Date().toISOString()}])assert.deepEqual(json(parseBackup(JSON.stringify(payload))),original);
});
test('duplicate IDs inside a file are rejected, even identical visits',()=>{
 assert.throws(()=>parseBackup(JSON.stringify(backup([visit('a'),visit('a')]))));
 assert.throws(()=>parseBackup(JSON.stringify(backup([visit('a'),visit('a','conflict')]))));
});
test('malformed files and unsafe fields are rejected without mutating local data',()=>{
 const local=backup([visit('local')]),before=JSON.stringify(local);
 for(const bad of ['{',JSON.stringify({visits:[]}),JSON.stringify({...backup([]),format:'other'}),JSON.stringify(backup([{...visit('a'),date:'2026-02-30'}])),JSON.stringify(backup([{...visit('a'),intervals:[{type:'sauna',durationMs:-1}]}])),JSON.stringify(backup([{...visit('a'),notes:{bad:true}}])),JSON.stringify(backup([visit('__proto__')]))])assert.throws(()=>parseBackup(bad));
 assert.equal(JSON.stringify(local),before);
});
test('counts new, duplicate and conflict independently of key order / sync timestamp',()=>{
 const local=backup([visit('a'),visit('b')]);
 const incoming=backup([{updatedAt:999,...visit('a')},visit('b','changed'),visit('c')]);
 const p=planBackup(incoming,local,{});
 assert.deepEqual([p.newVisits.length,p.duplicates.length,p.conflicts.length],[1,1,1]);
});
test('safe merge keeps every existing visit and preference; repeated merge is idempotent',()=>{
 const local=backup([visit('a'),visit('b')]),incoming={profile:{...profile,name:'Imported'},visits:[visit('a','conflict'),visit('c')]};
 const before=JSON.stringify(local),result=buildBackupRestore(incoming,local,meta(),'merge',100);
 assert.deepEqual(json(result.db.visits.slice(0,2)),local.visits);assert.deepEqual(json(result.db.profile),profile);assert.equal(JSON.stringify(local),before);
 assert.equal(result.db.visits.length,3);assert.equal(buildBackupRestore(incoming,result.db,result.meta,'merge',200).db.visits.length,3);
});
test('merge respects tombstones; explicit replace records removals and deliberate resurrection',()=>{
 const local=backup([{...visit('a'),updatedAt:500}]),incoming=backup([visit('deleted')]),m={deleted:{deleted:900,older:20},profileUpdatedAt:10};
 const merged=buildBackupRestore(incoming,local,m,'merge',100);
 assert.equal(merged.db.visits.length,1);assert.equal(planBackup(incoming,local,m.deleted).deleted.length,1);
 const replaced=buildBackupRestore(incoming,local,m,'replace',100);
 assert.equal(replaced.meta.deleted.a,500);assert.equal(replaced.meta.deleted.older,20);assert.equal(replaced.db.visits[0].updatedAt,901);
});
test('replacement advances conflict and preference timestamps',()=>{
 const local=backup([{...visit('a'),updatedAt:500}]);
 const incoming={profile:{...profile,name:'Imported'},visits:[visit('a','changed')]};
 const result=buildBackupRestore(incoming,local,{deleted:{},profileUpdatedAt:900},'replace',100);
 assert.equal(result.db.visits[0].updatedAt,501);assert.equal(result.meta.profileUpdatedAt,901);
});
