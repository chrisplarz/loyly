import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {cpSync,mkdirSync,mkdtempSync,readFileSync,readdirSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const same=(a,b)=>JSON.stringify(Object.entries(a).sort())===JSON.stringify(Object.entries(b).sort());
const runtimePath=p=>['index.html','sw.js','manifest.webmanifest'].includes(p)||/^(assets|icons)\//.test(p);
function walk(root,prefix=''){
 return readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(root,e.name),prefix+e.name+'/'):[prefix+e.name]).sort();
}
export function runtimeFiles(root){const names=['index.html','sw.js','manifest.webmanifest',...['assets','icons'].flatMap(dir=>walk(path.join(root,dir),dir+'/'))].sort();return Object.fromEntries(names.map(p=>[p,hash(readFileSync(path.join(root,p)))]))}
function load(root){return JSON.parse(readFileSync(path.join(root,'.openai/source-sync.json'),'utf8'))}
function outputPath(root){const dir=JSON.parse(readFileSync(path.join(root,'.openai/hosting.json'),'utf8')).static?.directory;if(dir!=='dist')throw Error('Expected the existing dist static output.');return path.join(root,dir)}
export function assertGitHubTarget(config){
 if(config.remote!=='https://github.com/chrisplarz/olo-notes.git'||config.branch!=='main')throw Error('Unexpected approved GitHub repository.');
}
export function fetchGitHub(config){
 // Read-only fetch, with no long-lived GitHub or Sites credential stored by this script.
 assertGitHubTarget(config);
 const dir=mkdtempSync(path.join(tmpdir(),'olo-source-check-'));
 const env={...process.env};for(const key of Object.keys(env))if(key.startsWith('GIT_'))delete env[key];env.GIT_TERMINAL_PROMPT='0';
 const git=(...args)=>execFileSync('git',['-C',dir,...args],{env,maxBuffer:8*1024*1024,stdio:['ignore','pipe','pipe']});
 try{
  git('init','--quiet');git('fetch','--quiet','--depth=1',config.remote,config.branch);
  const commit=git('rev-parse','FETCH_HEAD').toString().trim();
  const files=Object.fromEntries(git('ls-tree','-r','--name-only','FETCH_HEAD').toString().trim().split('\n').filter(runtimePath).sort().map(p=>[p,hash(git('show','FETCH_HEAD:'+p))]));
  return {commit,files};
 }finally{rmSync(dir,{recursive:true,force:true})}
}
export function assertUpstream(lock,upstream){
 if(same(upstream.files,lock.github.files)||same(upstream.files,lock.prepared?.files||{}))return;
 const known=lock.prepared?.files||lock.github.files;
 const changed=[...new Set([...Object.keys(known),...Object.keys(upstream.files)])].filter(p=>known[p]!==upstream.files[p]);
 throw Error(`GitHub source drift at ${upstream.commit}: ${changed.join(', ')}. Compare and reconcile the approved changes before publishing. No automatic overwrite is allowed.`);
}
export function verifyRelease(root,{online=false,upstream}={}){
 const lock=load(root),files=runtimeFiles(root),out=Object.fromEntries(walk(outputPath(root)).map(p=>[p,hash(readFileSync(path.join(outputPath(root),p)))]));
 if(!same(files,out))throw Error('Source and dist differ. Run the release prepare command before publishing.');
 if(!same(files,lock.prepared?.files||{}))throw Error('Runtime changed after release preparation. Re-prepare and re-test before publishing.');
 const html=readFileSync(path.join(root,'index.html'),'utf8'),sw=readFileSync(path.join(root,'sw.js'),'utf8'),version=lock.prepared.version;
 if(!html.includes(`<meta name="olo-release" content="${version}">`)||!sw.includes(`loyly-journal-shell-v${version}'`))throw Error('Release identity and service-worker revision differ.');
 if(online||upstream)assertUpstream(lock,upstream||fetchGitHub(lock.github));
 return {version,files:Object.keys(files).length,githubChecked:online||!!upstream};
}
export function prepareRelease(root,version,{upstream}={}){
 if(!Number.isSafeInteger(version)||version<1)throw Error('Provide a positive release version.');
 const lock=load(root),remote=upstream||fetchGitHub(lock.github);assertUpstream(lock,remote);
 const sw=readFileSync(path.join(root,'sw.js'),'utf8');if(!sw.includes(`loyly-journal-shell-v${version}'`))throw Error('Set the matching service-worker revision before preparation.');
 let html=readFileSync(path.join(root,'index.html'),'utf8');const identity=`<meta name="olo-release" content="${version}">`;
 html=/<meta name="olo-release"[^>]*>/.test(html)?html.replace(/<meta name="olo-release"[^>]*>/,identity):html.replace('</head>',identity+'\n</head>');
 writeFileSync(path.join(root,'index.html'),html);
 const files=runtimeFiles(root),out=outputPath(root);
 for(const p of Object.keys(files)){mkdirSync(path.dirname(path.join(out,p)),{recursive:true});cpSync(path.join(root,p),path.join(out,p))}
 lock.github={...lock.github,commit:remote.commit,files:remote.files};lock.prepared={version,files};
 writeFileSync(path.join(root,'.openai/source-sync.json'),JSON.stringify(lock,null,2)+'\n');
 return verifyRelease(root,{upstream:remote});
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const [command,...args]=process.argv.slice(2),root=process.cwd();
  if(command==='prepare'&&args.length===2&&args[0]==='--version')console.log(JSON.stringify(prepareRelease(root,Number(args[1]))));
  else if(command==='check'&&(args.length===0||(args.length===1&&args[0]==='--online')))console.log(JSON.stringify(verifyRelease(root,{online:args.includes('--online')})));
  else throw Error('Use: node scripts/release.mjs prepare --version N | check [--online]');
 }catch(e){console.error('Release blocked: '+e.message);process.exitCode=1}
}
