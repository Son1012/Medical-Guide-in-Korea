import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
if(!process.argv[2]) {
  console.error('Usage: node tests/browser-smoke.mjs /path/to/design-taste-frontend/scripts/lib/cdp.mjs');
  process.exit(2);
}
const { Browser } = await import(pathToFileURL(process.argv[2]).href);
const root=resolve('dist');
const out=resolve('.taste-skill/browser');
await mkdir(out,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp'};
const server=createServer(async(req,res)=>{
  try {
    const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403);return res.end();}
    const file=(await stat(path)).isDirectory()?resolve(path,'index.html'):path;
    res.writeHead(200,{'content-type':types[extname(file)]||'text/plain'});res.end(await readFile(file));
  }catch{res.writeHead(404);res.end('Not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url=`http://127.0.0.1:${server.address().port}`;
const browser=await Browser.launch();
let checks=0;
const pass=name=>{checks++;console.log('PASS '+name);};
const pause=()=>new Promise(r=>setTimeout(r,180));
try {
  const page=await browser.newPage();
  const routes=async hash=>{await page.eval(h=>location.hash=h,hash);await pause();};
  const click=async selector=>{await page.eval(s=>{const e=document.querySelector(s);if(!e)throw new Error('Missing '+s);e.click();},selector);await pause();};
  await page.goto(url);
  assert.equal(await page.eval(()=>document.querySelectorAll('.choice').length),4);pass('home has four entry points');
  await routes('hospital');
  await page.eval(()=>document.querySelector('#hospital-form').requestSubmit());
  assert.equal(await page.eval(()=>location.hash),'#hospital');pass('empty symptom cannot submit');
  await click('#red-flag');
  assert.equal(await page.eval(()=>location.hash),'#emergency');
  assert.ok(await page.eval(()=>document.querySelector('a[href="tel:119"]')));pass('emergency checkbox bypasses empty symptom');
  await click('.skip-link');assert.equal(await page.eval(()=>location.hash),'#emergency');
  assert.equal(await page.eval(()=>document.activeElement.id),'main');pass('skip link preserves emergency route');
  for(const [level,label] of [['mild','A local clinic'],['specialist','A general hospital'],['complex','A tertiary hospital']]){
    await routes('hospital');await click('[data-symptom="cold"]');await click(`input[value="${level}"]`);
    await page.eval(()=>document.querySelector('#hospital-form').requestSubmit());await pause();
    assert.equal(await page.eval(()=>document.querySelector('.result-top h2').textContent),label);pass(level+' care result');
  }
  await page.eval(()=>{const e=document.querySelector('#result-city');e.value='Busan 부산';e.dispatchEvent(new Event('change',{bubbles:true}));});
  assert.match(await page.eval(()=>decodeURIComponent(document.querySelector('#care-map-links a').href)),/Busan 부산/);pass('map search includes selected city');
  for(let i=1;i<=4;i++){
    await click(`[data-stage="${i}"]`);assert.equal(await page.eval(()=>document.querySelector('[aria-current="step"]').dataset.stage),String(i));
    assert.ok(await page.eval(()=>document.querySelector('#journey-content h2').textContent));
  }pass('all five care journey stages render');
  await click('[data-stage="1"]');await click('[data-check="id"]');await click('[data-stage="2"]');await click('[data-stage="1"]');
  assert.equal(await page.eval(()=>document.querySelector('[data-check="id"]').checked),true);pass('checklist survives navigation');
  await click('[data-stage="4"]');
  await page.send('Emulation.setEmulatedMedia',{media:'print'});
  assert.equal(await page.eval(()=>getComputedStyle(document.querySelector('.print-only')).display),'block');
  const pdf=await page.send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true});
  await writeFile(resolve(out,'care-guide.pdf'),Buffer.from(pdf.data,'base64'));
  await page.send('Emulation.setEmulatedMedia',{media:''});pass('care guide prints with summary and documents');
  await routes('hospital');
  await page.eval(()=>{const el=document.querySelector('#symptom-search');el.value='두통';el.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.equal(await page.eval(()=>document.querySelectorAll('#symptom option').length),2);pass('Korean symptom search');
  await page.eval(()=>{const el=document.querySelector('#symptom-search');el.value='zzzzzz';el.dispatchEvent(new Event('input',{bubbles:true}));});
  assert.equal(await page.eval(()=>document.querySelectorAll('#symptom option').length),1);pass('empty search has explicit no-results state');
  await routes('hospital');
  await click('input[value="mild"]');
  await click('[data-symptom="cold"]');
  await page.eval(()=>{const el=document.querySelector('#symptom');el.value='stroke';el.dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('#hospital-form').requestSubmit();});await pause();
  assert.equal(await page.eval(()=>location.hash),'#emergency');pass('stroke selection overrides mild care');
  await routes('medicine');
  for(const id of ['pain','cold','indigestion','diarrhea','constipation','itch','wounds']){
    await click(`[data-medicine="${id}"]`);
    assert.ok(await page.eval(()=>document.querySelector('.medicine-result .korean').textContent));
  }pass('all seven medicine topics render with Korean phrases');
  await click('#medicine-safety');assert.equal(await page.eval(()=>document.querySelector('.medicine-result .examples')),null);
  assert.match(await page.eval(()=>document.querySelector('.ingredient').textContent),/professional/);pass('special circumstances hide product examples');
  await routes('visit-insurance');assert.equal(await page.eval(()=>document.activeElement.id),'visit-insurance');pass('insurance deep link focuses the correct section');
  await routes('hospital');await click('[data-symptom="cold"]');await page.eval(()=>document.querySelector('#hospital-form').requestSubmit());await pause();
  for(const width of [1440,768,390,375]){
    await page.setViewport({width,height:width<600?844:900,mobile:width<600});
    for(const route of ['home','hospital','care','medicine','emergency','visit','sources']){
      await routes(route);
      const metrics=await page.eval(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,heading:document.querySelector('h1').innerText,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length}));
      assert.equal(metrics.overflow,false,`${width} ${route} overflow`);assert.equal(metrics.broken,0);
      if(['home','hospital','care','medicine','emergency'].includes(route))await page.screenshot({path:resolve(out,`${route}-${width}.jpg`)});
    }
    pass(`all routes fit ${width}px without overflow or broken images`);
  }
  assert.deepEqual(page.consoleErrors,[]);pass('no uncaught browser errors');
  console.log(`${checks} browser checks passed. Screenshots and printable PDF: ${out}`);
}finally{await browser.close();server.close();}
