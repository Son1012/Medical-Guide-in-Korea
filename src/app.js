import { departments, symptoms, severities, medicines, sources, recommendCare, searchSymptoms, mapUrl } from './data.js';

const main = document.querySelector('#main');
const initialHero = main.querySelector('.hero').outerHTML;
const state = { symptom:'', severity:'mild', city:'', redFlag:false, stage:0, medicine:'pain', specialistAdvice:false, checks:new Set() };
const cities = [['','Choose your area (optional)'],['Seoul 서울','Seoul'],['Busan 부산','Busan'],['Incheon 인천','Incheon'],['Daegu 대구','Daegu'],['Daejeon 대전','Daejeon'],['Gwangju 광주','Gwangju'],['Suwon 수원','Suwon'],['Jeju 제주','Jeju']];
const stages = ['Find care','Get ready','At the clinic','Pay & pharmacy','Insurance'];
const icons = {
  hospital:'<path d="M4 21V7h5V3h6v4h5v14M2 21h20M9 21v-5h6v5M10 7h4M12 5v4M7 11h1m8 0h1M7 14h1m8 0h1"/>',
  medicine:'<path d="m8.5 15.5 7-7M5.5 18.5a5 5 0 0 1 0-7l6-6a5 5 0 0 1 7 7l-6 6a5 5 0 0 1-7 0Z"/>',
  emergency:'<path d="M6 17v-6a6 6 0 0 1 12 0v6M4 21v-4h16v4ZM12 1v1M3 5l2 2m16-2-2 2M1 12h2m18 0h2"/>',
  visit:'<path d="M8 5H5v16h14V5h-3M8 3h8v5H8ZM8 12h8m-8 4h5"/>',
  sound:'<path d="m11 4-6 5H2v6h3l6 5ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || ''}</svg>`;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = (url,label,cls='') => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer" class="${cls}">${label}<span class="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span></a>`;
const cityOptions = () => cities.map(([value,label]) => `<option value="${value}" ${state.city===value?'selected':''}>${label}</option>`).join('');
const head = (title,description,back='#home',backText='Home') => `<div class="page-head wrap"><a class="back-link" href="${back}"><span aria-hidden="true">←</span> ${backText}</a><h1>${title}</h1><p>${description}</p></div>`;
const phrase = (ko,roman,en) => `<div class="phrase"><p class="korean" lang="ko">${escape(ko)}</p><p class="romanization">${escape(roman)}</p><p class="translation">${escape(en)}</p><div class="phrase-actions"><button type="button" data-speak="${escape(ko)}">${icon('sound')} Hear Korean</button><button type="button" data-copy="${escape(ko)}">${icon('copy')} Copy Korean</button></div></div>`;
const check = (id,title,description='') => `<li><label><input type="checkbox" data-check="${id}" ${state.checks.has(id)?'checked':''}><span><strong>${title}</strong>${description?`<small>${description}</small>`:''}</span></label></li>`;
const mapLinks = term => `<div class="map-actions">${external(mapUrl(term,state.city),'Search Google Maps')}${external(`https://map.naver.com/p/search/${encodeURIComponent([state.city,term].filter(Boolean).join(' '))}`,'Search Naver Map')}</div>`;

function home() {
  return `${initialHero}<section class="choices wrap" aria-label="Choose the help you need" data-ui>
    ${[['hospital','Find a hospital','Choose where to start.'],['medicine','Find medicine','Know what to ask for.'],['emergency','Emergency help','Get help right now.'],['visit','Other essentials','Prepare, pay, and claim.']].map(([id,title,desc],i)=>`<a class="choice reveal delay-${Math.min(i,3)}" href="#${id}"><div><strong>${title}</strong><small>${desc}</small></div><span class="choice-arrow" aria-hidden="true">↗</span></a>`).join('')}
    </section><section class="journey-band"><div class="wrap"><div class="journey-intro"><h2>Your visit.<br>One step at a time.</h2><p>You don’t need to know the whole system. Start with what you need, and follow your care journey.</p></div><ol class="journey-overview">${[
      ['Find your care','Choose a symptom and the right level of care.'],['Prepare to go','Check your insurance and bring your ID.'],['Talk to a doctor','Show your symptoms in Korean.'],['Pay & collect medicine','Keep your receipt and visit a pharmacy.'],['Claim your costs','Gather documents for your insurer.']
    ].map(([title,desc])=>`<li class="reveal"><strong>${title}</strong><span>${desc}</span></li>`).join('')}</ol><a class="button text" href="#visit">Read the visit guide <span aria-hidden="true">→</span></a></div></section><section class="home-emergency wrap"><div><h2>Need urgent help?</h2><p>For severe breathing trouble, stroke signs, unconsciousness, or uncontrolled bleeding, call an ambulance.</p><div class="actions"><a class="button danger" href="tel:119">Call 119</a><a href="#emergency">Emergency instructions <span aria-hidden="true">→</span></a></div></div><a href="tel:119" class="emergency-number" aria-label="Call emergency services 119">119</a></section>`;
}

function hospital() {
  return `${head('Find the right care.','Choose a symptom or condition from the pamphlet. We’ll suggest a starting point and help you through your visit.')}<div class="flow-layout wrap"><form id="hospital-form" data-ui>
  <div class="form-section"><h2>What brings you here?</h2><label class="field-label" for="symptom-search">Search symptoms or conditions</label><input id="symptom-search" type="search" placeholder="Try headache, cold, or stomach pain" autocomplete="off" aria-describedby="symptom-count"><p id="symptom-count" class="hint" aria-live="polite">${symptoms.length} topics from the pamphlet</p><label class="field-label select-label" for="symptom">Select a symptom or condition</label><select id="symptom" required><option value="">Choose a symptom or condition</option>${symptomOptions(symptoms)}</select><div class="quick-picks" aria-label="Common symptoms">${['cold','headache','stomach','rash'].map(id=>`<button type="button" data-symptom="${id}" aria-pressed="${state.symptom===id}">${symptoms.find(s=>s.id===id).en}</button>`).join('')}</div></div>
  <fieldset class="form-section"><legend><h2>What kind of care?</h2></legend><p class="hint before-options">Choose the description that fits. If you’re unsure, a clinic can assess you and refer you onward.</p><div class="severity-options">${severities.map(s=>`<label class="severity-option"><input type="radio" name="severity" value="${s.id}" ${s.id===state.severity?'checked':''} required><span><strong>${s.title}</strong><small>${s.description}</small></span><span class="tier-label">${s.tier===1?'Clinic':s.tier===2?'General hospital':'Tertiary hospital'}</span></label>`).join('')}</div></fieldset>
  <div class="form-section"><label for="city" class="field-label">Where are you?</label><select id="city">${cityOptions()}</select><p class="hint">Map links open a search. Confirm opening hours, language support, and appointments with the provider.</p></div>
  <div class="safety-note"><p><strong>Check for emergency signs first.</strong> Severe chest pain, trouble breathing, sudden one-sided weakness, sudden loss of vision, unconsciousness, or bleeding that won’t stop need emergency care.</p><label class="check-line"><input type="checkbox" id="red-flag" ${state.redFlag?'checked':''}><span>I have an emergency sign, or I’m worried this could be an emergency.</span></label></div>
  <p id="form-error" class="form-error" role="alert"></p><button type="submit" class="button primary">Show my care guide <span aria-hidden="true">→</span></button></form>
  <aside class="aside-note"><h2>A clinic is a good start.</h2><p>In Korea, you can usually choose a local clinic without registering with a family doctor first.</p><p>Clinics often specialize in one area, such as internal medicine or dermatology.</p><p>This guide suggests a type of care. A doctor decides the diagnosis and treatment.</p><a href="#visit-system">Understand the three levels →</a></aside></div>`;
}
function symptomOptions(items) {
  return Object.entries(departments).map(([id,d])=>{
    const group=items.filter(s=>s.department===id);
    return group.length?`<optgroup label="${escape(d.en)}">${group.map(s=>`<option value="${s.id}" ${state.symptom===s.id?'selected':''}>${s.en} · ${s.ko}</option>`).join('')}</optgroup>`:'';
  }).join('');
}
function prepareContent() {
  return `<h2>Before you leave.</h2><p>Call the clinic or hospital to confirm it can see you. Ask about English support, appointments, and the expected fee.</p><ul class="checklist">${check('id','Passport or residence card','Bring a valid original ID. Ask the provider what it accepts for NHI verification.')}${check('insurance','Insurance details','Confirm your NHIS enrollment and payment status, or check your travel insurance policy.')}${check('meds','Your medication and allergy list','Include supplements, existing conditions, and any pregnancy concerns.')}${check('referral','Referral and records, if needed','For a tertiary hospital, confirm referral requirements before booking.')}${check('claim-form','Insurer’s claim form, if required','Ask your insurer what documents and translations it needs.')}</ul><div class="notice"><strong>Check your NHIS status.</strong><p>Eligibility depends on your visa, employment, residence, and enrollment. A six-month stay alone does not confirm active coverage. Call <a href="tel:0338112000">033-811-2000</a> for foreign-language consultation or <a href="tel:15771000">1577-1000</a>.</p></div>`;
}
function clinicContent(symptom) {
  return `<h2>At the clinic.</h2><ol class="compact-list"><li><strong>Register at reception.</strong> Show your ID and insurance details. Tell the staff if this is your first visit.</li><li><strong>Describe your symptoms.</strong> Say when they started, where it hurts, and what makes them worse. Show your medication and allergy list.</li><li><strong>Ask before tests or treatment.</strong> Confirm the purpose, price, NHI coverage, and any non-covered charges.</li><li><strong>Check the plan.</strong> Ask about follow-up visits and which warning signs mean you should return sooner.</li></ol>${symptom?phrase(`${symptom.ko} 때문에 왔어요.`,`${symptom.pronunciation} ttae-moo-ne wa-sseo-yo.`,`I came because of ${symptom.en.toLowerCase()}.`):''}${phrase('영어로 진료받을 수 있나요?','Yeong-eo-ro jin-ryo-ba-deul soo in-na-yo?','Can I have a consultation in English?')}`;
}
function payContent() {
  return `<h2>Pay. Keep the paperwork.</h2><p>After your consultation, pay at the hospital’s payment desk. If you have active NHI, you generally pay the patient share for covered services and the full price of non-covered services.</p><ul class="checklist">${check('receipt','Collect your receipt and itemized bill','Ask at the payment desk before leaving. You may need both for insurance.')}${check('prescription','Collect your prescription, if provided','A community pharmacy usually dispenses outpatient prescriptions separately.')}${check('instructions','Confirm medicine instructions','Ask about timing, food, side effects, and interactions with your existing medicines.')}</ul>${phrase('영수증과 진료비 세부내역서를 주세요.','Yeong-soo-jeung-gwa jin-ryo-bee se-boo-nae-yeok-seo-reul joo-se-yo.','Please give me a receipt and an itemized medical bill.')}<h3>Take your prescription to a pharmacy.</h3><p>Look for <strong lang="ko">약국 (yak-guk)</strong> or the <strong lang="ko">약</strong> sign. Check its hours; pharmacy schedules vary, especially at weekends and on holidays.</p>${mapLinks('약국')}<div class="actions"><a class="button" href="#medicine">Explore non-prescription medicines →</a></div>`;
}
function insuranceContent() {
  return `<h2>Prepare your insurance claim.</h2><p>Ask your insurer which costs it covers and what paperwork it requires. Policies differ, including the rules for pre-authorization, deadlines, translation, and reimbursement.</p><div class="notice sage"><strong>If you have active NHI</strong><p>Ask your private or overseas insurer whether your co-payment or non-covered expenses qualify. Do not claim the same expense twice beyond what your policies allow.</p></div><p class="spaced"><strong>If you do not have NHI:</strong> you may need to pay the full bill first, then request reimbursement from your overseas insurer. Some policies offer direct billing; check before treatment when possible.</p><h3>Ask for these before you leave.</h3>${documentList()}<h3>Submit your claim.</h3><ol class="compact-list"><li>Pay your bill and keep proof of payment.</li><li>Collect the documents your insurer requests.</li><li>Submit them through your insurer’s website, app, or other accepted channel.</li><li>Respond if the insurer asks for more information.</li><li>Check the decision and reimbursement account details with your insurer.</li></ol><div class="notice">NHIS confirms your Korean public insurance status. Your private insurer decides your private claim. This guide cannot confirm eligibility or reimbursement.</div>`;
}
function documentList() {
  return `<div class="document-grid">${[
    ['Receipt','영수증','Proof of payment'],['Itemized bill','진료비 세부내역서','Breakdown of medical charges'],['Medical certificate','진단서','If your insurer requests it; an extra fee may apply'],['Prescription','처방전','If medicine was prescribed'],['Test results','검사 결과지','If your insurer requests them']
  ].map(([title,ko,desc])=>`<div class="document-item"><strong>${title}</strong><span lang="ko">${ko}</span><small>${desc}</small></div>`).join('')}</div>`;
}
function careResult() {
  if (!state.symptom) return hospital();
  const result=recommendCare(state.symptom,state.severity,state.redFlag);
  if (result.emergency) return emergency();
  const { symptom, department:d } = result;
  const contents=[
    `<h2>Your starting point.</h2><p>For <strong>${symptom.en.toLowerCase()}</strong>, ask about <strong>${d.en.toLowerCase()}</strong>. This is a navigation suggestion based on your selection, not a diagnosis or a clinical triage assessment.</p><div class="phrase"><p class="korean" lang="ko">${d.ko}</p><p class="romanization">${d.say}</p><p class="translation">${d.en}</p><div class="phrase-actions"><button type="button" data-speak="${d.ko}">${icon('sound')} Hear department</button><button type="button" data-copy="${d.ko}">${icon('copy')} Copy department</button></div></div>${phrase(symptom.ko,symptom.pronunciation,symptom.en)}<label class="field-label" for="result-city">Search in your area</label><select id="result-city">${cityOptions()}</select><div id="care-map-links">${careMapLinks(result)}</div><p class="hint">These links search external maps. They do not verify availability, medical suitability, or English-speaking staff.</p><div class="notice spaced">New, sudden, severe, or worsening symptoms need prompt assessment. For emergency signs, <a href="#emergency">call 119</a>. If you need care for a child, contact a pediatric clinic or hospital.</div>`,
    prepareContent(),clinicContent(symptom),payContent(),insuranceContent()
  ];
  return `${head('Your care, step by step.',`${symptom.en} · ${result.title}`,'#hospital','Edit my choices')}<div class="wrap narrow"><section class="result-top" aria-label="Recommended care type"><div><div class="tier-caption">${result.tier===1?'Primary':result.tier===2?'Secondary':'Tertiary'} care · suggested starting point</div><h2>${result.name}</h2><p>${result.detail}</p></div><div class="department"><strong>${d.en}</strong><span lang="ko">${d.ko} · ${result.ko}</span><span>${d.say}</span></div></section><nav class="journey-nav" aria-label="Your care journey">${stages.map((name,i)=>`<button type="button" data-stage="${i}" ${state.stage===i?'aria-current="step"':''}>${name}</button>`).join('')}</nav><section class="journey-content" id="journey-content">${contents[state.stage]}<div class="next-step">${state.stage>0?`<button class="button" data-stage="${state.stage-1}">← ${stages[state.stage-1]}</button>`:'<a class="button" href="#hospital">Change choices</a>'}${state.stage<4?`<button class="button primary" data-stage="${state.stage+1}">${stages[state.stage+1]} →</button>`:'<button class="button primary" data-print>Print my care guide</button>'}</div></section><div class="print-only"><h2>Care summary</h2><p>Symptom: ${symptom.en} · <span lang="ko">${symptom.ko}</span> (${symptom.pronunciation})</p><p>Department: ${d.en} · <span lang="ko">${d.ko}</span> (${d.say})</p><p>Suggested care: ${result.name}. ${result.detail}</p><p>Emergency signs override this suggestion: call 119.</p>${state.stage!==1?`<div class="print-stage">${prepareContent()}</div>`:''}${state.stage!==3?`<div class="print-stage">${payContent()}</div>`:''}${state.stage!==4?`<div class="print-stage">${insuranceContent()}</div>`:''}<p>Care in Korea · General information. Confirm with your clinician and insurer.</p></div></div>`;
}
function careMapLinks(result) {
  const term=result.tier===1?`${result.department.ko} 의원`:result.tier===2?`종합병원 ${result.department.ko}`:'상급종합병원 국제진료센터';
  return mapLinks(term);
}

function medicine() {
  const med=medicines.find(m=>m.id===state.medicine);
  return `${head('A clearer pharmacy visit.','Explore the pamphlet’s seven medicine topics. Show the Korean phrase to a pharmacist and confirm the right product for you.')}<div class="medicine-layout wrap" data-ui><div class="medicine-picker" role="group" aria-label="Choose a symptom">${medicines.map(m=>`<button type="button" data-medicine="${m.id}" aria-pressed="${m.id===state.medicine}">${m.name}<span aria-hidden="true">${m.id===state.medicine?'↗':'+'}</span></button>`).join('')}</div><section id="medicine-detail" tabindex="-1"><div class="medicine-result"><h2>${med.name}</h2><p class="ingredient">${state.specialistAdvice?'Ask a professional first.':med.ingredient}</p>${state.specialistAdvice?'<div class="notice"><p>For a child, pregnancy, breastfeeding, chronic illness, or medicine interactions, a pharmacist or clinician needs to check individual suitability. The pamphlet’s adult product examples may not fit.</p></div>':`<p class="examples">Pamphlet examples: ${med.examples}</p><p class="description">${med.description}</p>`}<div class="notice"><strong>Before you buy</strong><p>${med.caution}</p><p>Follow the current product label and the pharmacist’s advice. Brand names, formulations, and availability can change.</p></div>${phrase(med.phrase,med.pronunciation,med.english)}</div><div class="medicine-safety"><label class="check-line"><input type="checkbox" id="medicine-safety" ${state.specialistAdvice?'checked':''}><span>This is for a child, I’m pregnant or breastfeeding, or I have a chronic condition or take other medicines.</span></label><p class="hint">This guide does not set doses or confirm which medicine is safe for you.</p></div><div class="actions"><a class="button primary" href="#hospital">Need to see a doctor? →</a>${external('https://nedrug.mfds.go.kr/searchDrug','Check a Korean medicine label')}</div></section></div><section class="pharmacy-banner wrap"><div><div class="pharmacy-sign" lang="ko">약국</div><p><strong>Yak-guk. Your local pharmacy.</strong><br>Look for 약. Call ahead to check its opening hours.</p>${mapLinks('약국')}</div><div><h2>After hours?</h2><p>Use E-GEN to look for an open pharmacy. Participating convenience stores sell a limited selection of non-prescription medicines, not a full pharmacy range.</p><p class="hint">Check the exact product, age limits, and package instructions. Store availability varies. For severe symptoms, seek medical care.</p><div class="actions">${external('https://www.e-gen.or.kr/egen/search_pharmacy.do','Find a pharmacy on E-GEN','button light')}</div></div></section>`;
}

function emergency() {
  return `<section class="emergency-page"><div class="wrap"><a class="back-link" href="#home">← Home</a><div class="emergency-hero"><div><h1>Medical emergency?<br>Call 119.</h1><p>Call for an ambulance if someone is seriously ill or injured. Say your location first, then explain what happened. Ask for an English interpreter if you need one.</p><div class="actions"><a href="tel:119" class="button danger">Call 119 now ${icon('emergency')}</a></div><p class="hint">In Korea, dial 119 without an area code.</p></div><a class="emergency-number" href="tel:119" aria-label="Call 119">119</a></div></div></section><div class="emergency-body wrap"><section><h2>Don’t wait for a clinic.</h2><ul><li>Severe trouble breathing or chest pain</li><li>Sudden facial droop, arm weakness, or difficulty speaking</li><li>Loss of consciousness or a seizure</li><li>Severe bleeding, a major injury, or a serious burn</li><li>Swelling of the lips or tongue with breathing difficulty</li><li>Sudden loss of vision or a sudden severe headache</li></ul><div class="notice danger"><strong>Unsure if it’s an emergency?</strong><p>Call 119 and describe the symptoms. Follow the dispatcher’s instructions. Do not drive yourself if you are seriously unwell.</p></div></section><section><h2>Show or say this.</h2>${phrase('응급상황이에요. 구급차를 보내 주세요.','Eung-geup-sang-hwang-ee-e-yo. Goo-geup-cha-reul bo-nae joo-se-yo.','It’s an emergency. Please send an ambulance.')}${phrase('영어 통역이 필요해요.','Yeong-eo tong-yeo-gee pee-ryo-hae-yo.','I need an English interpreter.')}<p>Read out the address on a map, a nearby building name, or a landmark. Keep your phone available for the dispatcher.</p></section></div><section class="wrap prose"><h2>Need non-emergency help?</h2><p>The Korea Travel Helpline <a href="tel:1330">1330</a> can help with travel questions and interpretation. Call <a href="tel:112">112</a> for police. For medical emergencies, use 119.</p>${external('https://www.e-gen.or.kr/egen/main.do','Open the emergency medical portal')}</section>`;
}

function visit() {
  return `${head('Make your visit easier.','The essentials before, during, and after medical care in Korea.')}<div class="visit-layout wrap"><nav class="visit-nav" aria-label="Visit guide contents"><a href="#visit-system">The healthcare system</a><a href="#visit-prepare">Before your visit</a><a href="#visit-clinic">At the clinic</a><a href="#visit-pay">Payment & pharmacy</a><a href="#visit-insurance">Insurance claims</a><a href="#visit-questions">Common questions</a></nav><div><section id="visit-system" class="visit-article"><h2>Three levels of care.</h2><p>Choose a starting point based on your symptoms and care needs. A clinician may refer you to another provider.</p>${severities.map(s=>`<details ${s.tier===1?'open':''}><summary>${s.tier===1?'Primary':s.tier===2?'Secondary':'Tertiary'} care: ${s.name.toLowerCase()}</summary><p><strong>${s.ko}</strong> (${s.say}). ${s.description} ${s.detail}</p></details>`).join('')}<p class="hint">Hospital size alone does not establish its official level. Check the provider’s designation and services.</p><a class="button primary" href="#hospital">Find my starting point →</a></section><section id="visit-prepare" class="visit-article">${prepareContent()}</section><section id="visit-clinic" class="visit-article">${clinicContent()}</section><section id="visit-pay" class="visit-article">${payContent()}</section><section id="visit-insurance" class="visit-article">${insuranceContent()}</section><section id="visit-questions" class="visit-article"><h2>A few common questions.</h2><details><summary>Am I enrolled in National Health Insurance?</summary><p>Employment, residence duration, visa type, and other rules can affect enrollment. Many foreign residents fall under mandatory enrollment after six months, with exceptions and different starting dates. Confirm your active status and contributions with NHIS. This site does not determine eligibility.</p><div class="actions"><a href="tel:0338112000">NHIS foreign-language line: 033-811-2000</a></div><p>Weekdays, 09:00–18:00 Korea time. From overseas, consult the current contact details on the NHIS English website.</p></details><details><summary>Can I use a foreign prescription?</summary><p>Do not assume a Korean pharmacy can fill a prescription from abroad. Bring your prescription and medication list to a Korean clinician or pharmacist and ask what local assessment or prescription you need.</p></details><details><summary>Can I buy medicine at a convenience store?</summary><p>Participating stores carry a limited selection of approved products. The store’s product, strength, or pack size may differ from a pharmacy’s. Check the package and ask a pharmacist about suitability, especially for children or other health conditions.</p></details><details><summary>How do I get help in English?</summary><p>Ask the provider about English-speaking staff when booking. Larger hospitals may have an international center. For travel interpretation assistance, try 1330. In a medical emergency, call 119 and ask for an interpreter.</p></details><div class="notice spaced">You can use these checklists during your visit. They reset when you reload or close the page; this site does not store your medical information.</div></section></div></div>`;
}

function about() {
  return `${head('A guide you can check.','Built from the JOKO “Medical Guide for Foreign Visitors” pamphlet, with official resources to help you verify the next step.')}<article class="wrap prose"><h2>Use it as a starting point.</h2><p>We organize the pamphlet’s symptoms, medical departments, three care levels, pharmacy topics, and insurance checklist around your visit. This is an independent information resource, not a hospital, emergency service, insurer, or government website.</p><p>A symptom can have many causes. The care suggestions use the severity you select; they do not diagnose illness or establish urgency. A clinician or pharmacist should confirm what you need.</p><h2>Medicine notes.</h2><p>Product names are examples from the supplied pamphlet, not endorsements. Check the current Korean label and ask a pharmacist about ingredients, local equivalents, age limits, interactions, and use.</p><p>We have flagged the pamphlet’s Dexfine–hydrocortisone pairing for product verification. We also distinguish basic wound care from antibiotic treatment. We do not provide individualized doses.</p><h2>Your privacy.</h2><p>Your selections and checklist stay in this page’s memory and reset on reload. We use no accounts, cookies, analytics, or browser storage. The site sends no symptom selections to a server. When you choose a map or source link, that external service receives your request and applies its own privacy policy. “Hear Korean” uses your browser’s speech service, which may use an online voice.</p><h2>Sources & further reading.</h2><p>Links checked on November 10, 2026. Check the current source before acting on eligibility, availability, or coverage.</p><div class="source-list">${sources.map(s=>external(s.url,`<strong>${s.name}</strong><span>${s.detail}</span>`)).join('')}</div><h2>About the design.</h2><p>Apple-inspired typography and spacing keep the guide calm and readable. The clinic photograph is an AI-generated illustration of a Korean neighborhood, not an identifiable provider or a recommendation.</p></article>`;
}

function currentRoute() {
  const hash=location.hash.slice(1) || 'home';
  return hash.startsWith('visit-') ? 'visit' : hash;
}
function render({focus=true}={}) {
  const route=currentRoute();
  const routes={home,hospital,care:careResult,medicine,emergency,visit,sources:about};
  main.innerHTML=(routes[route] || home)();
  const titles={home:'Your healthcare guide',hospital:'Find a hospital',care:'Your care guide',medicine:'Find medicine',emergency:'Emergency 119',visit:'Your visit',sources:'About & sources'};
  document.title=`Care in Korea — ${titles[route] || titles.home}`;
  document.querySelectorAll('.site-header nav a').forEach(a=>{
    const active=a.hash===`#${route}` || (route==='care' && a.hash==='#hospital');
    if(active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
  });
  if (focus) {
    if (location.hash.startsWith('#visit-')) {
      const section=document.getElementById(location.hash.slice(1));
      section?.setAttribute('tabindex','-1');section?.focus({preventScroll:true});section?.scrollIntoView();
    } else { window.scrollTo(0,0);main.focus({preventScroll:true}); }
  }
}
let toastTimer;
function toast(message) {
  const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4500);
}
document.addEventListener('click',async event=>{
  if(event.target.closest('.skip-link')) {
    event.preventDefault();main.focus({preventScroll:true});main.scrollIntoView({block:'start'});return;
  }
  const button=event.target.closest('button');
  if (!button) return;
  if (button.dataset.symptom) {
    state.symptom=button.dataset.symptom;
    document.querySelector('#symptom-search').value='';
    document.querySelector('#symptom').innerHTML='<option value="">Choose a symptom or condition</option>'+symptomOptions(symptoms);
    document.querySelector('#symptom').value=state.symptom;
    document.querySelector('#symptom-count').textContent=`${symptoms.length} topics from the pamphlet`;
    document.querySelectorAll('[data-symptom]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.symptom===state.symptom)));
  }
  if ('stage' in button.dataset) {
    state.stage=Number(button.dataset.stage);render({focus:false});
    const panel=document.querySelector('#journey-content');panel.setAttribute('tabindex','-1');panel.focus({preventScroll:true});panel.scrollIntoView({block:'start'});
  }
  if (button.dataset.medicine) {
    state.medicine=button.dataset.medicine;render({focus:false});
    const panel=document.querySelector('#medicine-detail');panel.focus({preventScroll:true});
    if(innerWidth<801) panel.scrollIntoView({block:'start'});
  }
  if (button.dataset.copy) {
    try { await navigator.clipboard.writeText(button.dataset.copy);toast('Korean text copied.'); }
    catch { toast('Copy is unavailable here. Select and copy the Korean text above.'); }
  }
  if (button.dataset.speak) {
    if (!('speechSynthesis' in window)) return toast('Audio is unavailable in this browser. Use the pronunciation shown above.');
    const voices=speechSynthesis.getVoices();
    const voice=voices.find(v=>v.lang.toLowerCase().startsWith('ko'));
    if (!voice) return toast('No Korean voice is installed. Use the pronunciation, or enable a Korean voice in your device settings.');
    speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(button.dataset.speak);utterance.lang='ko-KR';utterance.voice=voice;utterance.rate=.8;
    utterance.onerror=()=>toast('Audio could not play. Use the written pronunciation.');speechSynthesis.speak(utterance);
  }
  if ('print' in button.dataset) window.print();
});
document.addEventListener('input',event=>{
  if(event.target.id==='symptom-search') {
    const matches=searchSymptoms(event.target.value);
    document.querySelector('#symptom').innerHTML='<option value="">Choose a symptom or condition</option>'+symptomOptions(matches);
    if (!matches.some(s=>s.id===state.symptom)) { document.querySelector('#symptom').value='';state.symptom=''; }
    document.querySelector('#symptom-count').textContent=matches.length?`${matches.length} matching topics`:'No matching topics. Try another word, or clear the search.';
  }
});
document.addEventListener('change',event=>{
  const el=event.target;
  if(el.dataset.check) { if(el.checked)state.checks.add(el.dataset.check);else state.checks.delete(el.dataset.check); }
  if(el.id==='symptom') { state.symptom=el.value;document.querySelectorAll('[data-symptom]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.symptom===state.symptom))); }
  if(el.name==='severity')state.severity=el.value;
  if(el.id==='city')state.city=el.value;
  if(el.id==='red-flag') {
    if(el.checked) { state.redFlag=false;location.hash='emergency'; }
    else state.redFlag=false;
  }
  if(el.id==='medicine-safety') { state.specialistAdvice=el.checked;render({focus:false});document.querySelector('#medicine-safety').focus({preventScroll:true}); }
  if(el.id==='result-city') { state.city=el.value;document.querySelector('#care-map-links').innerHTML=careMapLinks(recommendCare(state.symptom,state.severity)); }
});
document.addEventListener('submit',event=>{
  if(event.target.id!=='hospital-form')return;
  event.preventDefault();
  state.symptom=document.querySelector('#symptom').value;state.city=document.querySelector('#city').value;state.redFlag=document.querySelector('#red-flag').checked;
  state.severity=new FormData(event.target).get('severity');
  try {
    const result=recommendCare(state.symptom,state.severity,state.redFlag);state.stage=0;
    location.hash=result.emergency?'emergency':'care';
  } catch(error) { document.querySelector('#form-error').textContent=error.message;document.querySelector('#symptom').focus(); }
});
window.addEventListener('hashchange',()=>render());
render({focus:false});
if(location.hash.startsWith('#visit-')) requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
