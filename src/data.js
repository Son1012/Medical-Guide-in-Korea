export const departments = {
  internal: { en: 'Internal medicine', ko: '내과', say: 'nae-gwa' },
  ent: { en: 'Ear, nose & throat', ko: '이비인후과', say: 'ee-bee-in-hoo-gwa' },
  eye: { en: 'Ophthalmology', ko: '안과', say: 'an-gwa' },
  neuro: { en: 'Neurology', ko: '신경과', say: 'shin-gyeong-gwa' },
  respiratory: { en: 'Respiratory medicine', ko: '호흡기내과', say: 'ho-heup-gee-nae-gwa' },
  gastro: { en: 'Gastroenterology', ko: '소화기내과', say: 'so-hwa-gee-nae-gwa' },
  skin: { en: 'Dermatology', ko: '피부과', say: 'pee-boo-gwa' },
  gyn: { en: 'Obstetrics & gynecology', ko: '산부인과', say: 'san-boo-in-gwa' },
  ortho: { en: 'Orthopedics', ko: '정형외과', say: 'jeong-hyeong-oe-gwa' },
  uro: { en: 'Urology', ko: '비뇨의학과', say: 'bee-nyo-ui-hak-gwa' }
};

// Symptoms and conditions transcribed from the supplied pamphlet; these are navigation topics, not diagnoses.
const rows = [
  ['cold','Cold','감기','gam-gee','internal'],
  ['fever','Fever','발열','bal-yeol','internal'],
  ['cough','Cough','기침','gee-chim','internal'],
  ['fatigue','Fatigue','피로','pee-ro','internal'],
  ['weight','Unexplained weight changes','체중 변화','che-joong byeon-hwa','internal'],
  ['hypertension','High blood pressure','고혈압','go-hyeol-ap','internal'],
  ['diabetes','Diabetes','당뇨병','dang-nyo-byeong','internal'],
  ['sore-throat','Sore throat','인후통','in-hoo-tong','ent'],
  ['ear-pain','Ear pain','귀 통증','gwee tong-jeung','ent'],
  ['congestion','Nasal congestion','코막힘','ko-mak-him','ent'],
  ['throat','Throat inflammation','인후염','in-hoo-yeom','ent'],
  ['tinnitus','Ringing in the ears','이명','ee-myeong','ent'],
  ['rhinitis','Allergic rhinitis','알레르기 비염','al-le-reu-gee bee-yeom','ent'],
  ['vision','Vision changes','시력 변화','shi-ryeok byeon-hwa','eye'],
  ['red-eyes','Red eyes','눈 충혈','noon choong-hyeol','eye'],
  ['blurry','Blurry vision','흐릿한 시야','heu-rit-han shi-ya','eye'],
  ['eye-pain','Eye pain','눈 통증','noon tong-jeung','eye'],
  ['dry-eyes','Dry eyes','안구 건조','an-goo geon-jo','eye'],
  ['headache','Headache','두통','doo-tong','neuro'],
  ['dizziness','Dizziness','어지럼증','eo-ji-reom-jeung','neuro'],
  ['numbness','Numbness or tingling','저림','jeo-rim','neuro'],
  ['weakness','Nerve weakness','근력 저하','geun-ryeok jeo-ha','neuro'],
  ['stroke','Stroke symptoms','뇌졸중 증상','noe-jol-joong jeung-sang','neuro',true],
  ['spine','Spinal issues','척추 질환','cheok-choo jil-hwan','neuro'],
  ['severe-cough','Severe or persistent cough','심한 기침','shim-han gee-chim','respiratory'],
  ['breathlessness','Severe shortness of breath','심한 호흡곤란','shim-han ho-heup-gon-lan','respiratory',true],
  ['asthma','Asthma','천식','cheon-shik','respiratory'],
  ['lung-infection','Lung infection','폐 감염','pye gam-yeom','respiratory'],
  ['chronic-lung','Chronic respiratory condition','만성 호흡기 질환','man-seong ho-heup-gee jil-hwan','respiratory'],
  ['heartburn','Heartburn','속쓰림','sok-sseu-rim','gastro'],
  ['stomach','Abdominal pain','복통','bok-tong','gastro'],
  ['indigestion','Indigestion','소화불량','so-hwa-bool-lyang','gastro'],
  ['diarrhea','Diarrhea','설사','seol-sa','gastro'],
  ['constipation','Constipation','변비','byeon-bee','gastro'],
  ['vomiting','Vomiting','구토','goo-to','gastro'],
  ['bloating','Bloating','복부 팽만','bok-boo paeng-man','gastro'],
  ['rash','Rash','발진','bal-jin','skin'],
  ['acne','Acne','여드름','yeo-deu-reum','skin'],
  ['eczema','Eczema','습진','seup-jin','skin'],
  ['itching','Skin itching or allergy','피부 가려움','pee-boo ga-ryeo-oom','skin'],
  ['skin-infection','Skin infection','피부 감염','pee-boo gam-yeom','skin'],
  ['menstrual','Menstrual concerns','생리 문제','saeng-ree moon-je','gyn'],
  ['contraception','Contraception','피임 상담','pee-im sang-dam','gyn'],
  ['pregnancy','Pregnancy concerns','임신 상담','im-shin sang-dam','gyn'],
  ['pelvic','Pelvic pain','골반 통증','gol-ban tong-jeung','gyn'],
  ['joint','Joint pain','관절 통증','gwan-jeol tong-jeung','ortho'],
  ['back','Back pain','허리 통증','heo-ree tong-jeung','ortho'],
  ['fracture','Possible fracture','골절 의심','gol-jeol ui-shim','ortho'],
  ['muscle','Muscle or bone injury','근육 또는 뼈 부상','geun-yook tto-neun ppyeo boo-sang','ortho'],
  ['sprain','Sprain','염좌','yeom-jwa','ortho'],
  ['fall','Injury after a fall','낙상 부상','nak-sang boo-sang','ortho'],
  ['urination','Pain or burning when urinating','배뇨통','bae-nyo-tong','uro'],
  ['frequency','Frequent urination','빈뇨','bin-nyo','uro'],
  ['lower-abdomen','Lower abdominal pain (urinary)','하복부 통증','ha-bok-boo tong-jeung','uro'],
  ['uti','Urinary tract infection','요로 감염','yo-ro gam-yeom','uro'],
  ['male-health','Male reproductive health','남성 생식기 상담','nam-seong saeng-shik-gee sang-dam','uro'],
  ['wound','Minor wound','상처','sang-cheo','ortho']
];
export const symptoms = rows.map(([id,en,ko,pronunciation,department,emergency=false]) => ({id,en,ko,pronunciation,department,emergency}));
export const severities = [
  { id:'mild', title:'Mild symptoms', description:'Colds, mild fever, stomach issues, or a minor injury.', tier:1, name:'A local clinic', ko:'의원', say:'ui-won', detail:'Start with an outpatient clinic. You can usually choose one without a referral. Call ahead to check opening hours and language support.' },
  { id:'specialist', title:'Needs specialist care', description:'Persistent symptoms, specialist assessment, or imaging tests.', tier:2, name:'A general hospital', ko:'종합병원', say:'jong-hap-byeong-won', detail:'A general hospital can offer testing and specialist services that a small clinic may not provide. Ask about appointments and whether the department needs a referral.' },
  { id:'complex', title:'Complex or diagnosed condition', description:'Cancer, a rare disease, or a condition needing advanced care.', tier:3, name:'A tertiary hospital', ko:'상급종합병원', say:'sang-geup-jong-hap-byeong-won', detail:'Contact a tertiary hospital or its international center for advanced care. A doctor’s referral is generally needed for NHI-covered outpatient care; exceptions apply. Confirm requirements before booking.' }
];
export function recommendCare(id, severity, redFlag=false) {
  const symptom = symptoms.find(s => s.id === id);
  const level = severities.find(s => s.id === severity);
  if (!symptom || !level) throw new Error('Choose a symptom and a severity level.');
  if (redFlag || symptom.emergency) return { emergency:true, symptom };
  return { ...level, emergency:false, symptom, department:departments[symptom.department] };
}
export function searchSymptoms(query='') {
  const q = query.trim().toLocaleLowerCase();
  return symptoms.filter(s => `${s.en} ${s.ko} ${departments[s.department].en}`.toLocaleLowerCase().includes(q));
}
export function mapUrl(term, city='') {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([city,term].filter(Boolean).join(' '))}`;
}
export const medicines = [
  { id:'pain', name:'Headache & fever', ko:'두통 / 발열', examples:'Tylenol (타이레놀)', ingredient:'Acetaminophen (paracetamol)', description:'An option to discuss for pain or fever. Check the strength and instructions on the Korean package.', caution:'Do not combine products containing acetaminophen. Ask a pharmacist if you have liver disease, drink heavily, or take other medicines. Sudden severe headache needs urgent medical help.', phrase:'두통과 열이 있어요.', pronunciation:'Doo-tong-gwa yeo-ree ee-sseo-yo.', english:'I have a headache and a fever.' },
  { id:'cold', name:'Cold symptoms', ko:'감기', examples:'Pancol A / Coldaewon (판콜에이 / 콜대원)', ingredient:'Combination cold medicine; ingredients vary by product', description:'Tell the pharmacist which symptoms you have. A combination product may contain ingredients you do not need.', caution:'Some formulas cause drowsiness or contain acetaminophen. Avoid duplicate ingredients and check interactions. Not every product or formulation is available at convenience stores.', phrase:'감기약이 필요해요.', pronunciation:'Gam-gee-ya-gee pee-ryo-hae-yo.', english:'I need medicine for cold symptoms.' },
  { id:'indigestion', name:'Indigestion', ko:'소화불량', examples:'Bearse / Festal (베아제 / 훼스탈)', ingredient:'Digestive enzymes; exact ingredients vary', description:'The pamphlet lists digestive enzyme products. Ask a pharmacist whether they fit your symptoms.', caution:'Indigestion products do not treat all causes of abdominal pain. Severe pain, chest pain, vomiting blood, or black stools need urgent assessment.', phrase:'소화가 잘 안 돼요.', pronunciation:'So-hwa-ga jal an dwae-yo.', english:'I have indigestion.' },
  { id:'diarrhea', name:'Diarrhea', ko:'설사', examples:'Smecta (스멕타), pamphlet example; ask for a current local equivalent', ingredient:'Diosmectite', description:'Ask about oral rehydration first and whether an anti-diarrheal product is appropriate.', caution:'Ask about spacing from other medicines. Blood in stools, fever, severe pain, or dehydration needs medical advice. Product availability and age restrictions vary.', phrase:'설사를 해요.', pronunciation:'Seol-sa-reul hae-yo.', english:'I have diarrhea.' },
  { id:'constipation', name:'Constipation', ko:'변비', examples:'Dulcolax / Magmil (둘코락스 / 마그밀)', ingredient:'Bisacodyl / magnesium hydroxide, depending on product', description:'These are different types of laxatives. Ask a pharmacist to choose an option for your situation.', caution:'Do not self-treat severe abdominal pain or vomiting with a laxative. Ask about kidney disease and other medicines before using magnesium products.', phrase:'변비가 있어요.', pronunciation:'Byeon-bee-ga ee-sseo-yo.', english:'I have constipation.' },
  { id:'itch', name:'Itchy skin', ko:'피부 가려움', examples:'Dexfine appears in the pamphlet; verify the exact product with a pharmacist', ingredient:'Ask whether hydrocortisone or another treatment is appropriate', description:'The right treatment depends on the cause of the itch. Show the rash to a pharmacist before buying a cream.', caution:'The pamphlet’s brand-to-ingredient pairing needs verification. Do not put hydrocortisone on cuts or wounds. Ask before use on the face, genitals, infected skin, or in children.', phrase:'피부가 가려워요.', pronunciation:'Pee-boo-ga ga-ryeo-wo-yo.', english:'My skin is itchy.' },
  { id:'wounds', name:'Minor wounds', ko:'상처', examples:'Fucidin (후시딘), only when a pharmacist recommends it', ingredient:'Fusidic acid (a topical antibiotic)', description:'For a small clean cut, start by cleaning it and using a suitable dressing. An antibiotic is not needed for every wound.', caution:'Ask a pharmacist before using antibiotic cream. Deep wounds, animal bites, spreading redness, pus, or bleeding that will not stop need medical care.', phrase:'상처에 쓸 약이 필요해요.', pronunciation:'Sang-cheo-e sseul ya-gee pee-ryo-hae-yo.', english:'I need something for a wound.' }
];
export const sources = [
  { name:'National Health Insurance Service', detail:'Foreign residents, eligibility, and contact information', url:'https://www.nhis.or.kr/english/wbheaa02900m01.do' },
  { name:'VISITKOREA', detail:'Emergency numbers and travel assistance', url:'https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=177&vcontsId=248145' },
  { name:'Seoul Jung-gu', detail:'Korea’s healthcare system and tertiary referrals', url:'https://www.junggu.seoul.kr/english/content.do?cmsid=14855' },
  { name:'E-GEN emergency medical portal', detail:'Hospital and pharmacy search in Korean', url:'https://www.e-gen.or.kr/egen/main.do' },
  { name:'MFDS drug information', detail:'Check the current Korean medicine label and ingredients', url:'https://nedrug.mfds.go.kr/searchDrug' },
  { name:'FDA: acetaminophen safety', detail:'Duplicate ingredients and safe use', url:'https://www.fda.gov/drugs/safe-use-over-counter-pain-relievers-and-fever-reducers/acetaminophen' },
  { name:'NHS: hydrocortisone', detail:'Skin cream precautions', url:'https://www.nhs.uk/medicines/hydrocortisone-for-skin/' },
  { name:'NHS: cuts and grazes', detail:'Basic wound care and when to seek help', url:'https://www.nhs.uk/conditions/cuts-and-grazes/' }
];
