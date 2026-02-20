/**
 * seed-journal.mjs
 *
 * Usage:
 *   node scripts/seed-journal.mjs
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * (reads from .env.local automatically)
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ──
function loadEnv() {
  try {
    const envPath = resolve(__dirname, "..", ".env.local");
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx < 0) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env.local may not exist — rely on already-set env
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ── Category definitions ──
const CATEGORY_DEFS = [
  { name: "Economy", slug: "economy", sort_order: 1 },
  { name: "Investment", slug: "investment", sort_order: 2 },
  { name: "Society", slug: "society", sort_order: 3 },
  { name: "Geopolitics", slug: "geopolitics", sort_order: 4 },
  { name: "Tech", slug: "tech", sort_order: 5 },
  { name: "Personal", slug: "personal", sort_order: 6 },
];

// ── Tag keyword mapping for auto-tagging ──
const TAG_RULES = [
  { keywords: ["임금", "임금격차", "중소기업", "대기업"], tag: "임금격차" },
  { keywords: ["부동산", "아파트", "집값", "pf", "LTV", "DSR"], tag: "부동산" },
  { keywords: ["저출산", "출산", "인구", "노인", "고령"], tag: "저출산" },
  { keywords: ["학벌", "사교육", "학원"], tag: "교육" },
  { keywords: ["환율", "달러", "엔화", "엔저"], tag: "환율" },
  { keywords: ["비트코인", "btc", "암호화폐", "코인"], tag: "비트코인" },
  { keywords: ["금", "희토류", "은", "구리", "우라늄", "원자재"], tag: "원자재" },
  { keywords: ["반도체", "hbm", "삼성전자", "sk하이닉스", "tsmc", "인텔", "파운드리"], tag: "반도체" },
  { keywords: ["ai", "llm", "딥러닝", "gemini", "gpt", "nvidia", "로보틱스"], tag: "AI" },
  { keywords: ["조선", "한화오션", "hd현대중공업", "수주"], tag: "조선" },
  { keywords: ["방산", "한화에어로스페이스", "kf21", "무기"], tag: "방산" },
  { keywords: ["중국", "일대일로", "브릭스"], tag: "중국" },
  { keywords: ["일본", "니케이", "엔저", "플라자합의"], tag: "일본" },
  { keywords: ["미국", "연준", "트럼프", "QE", "QT"], tag: "미국" },
  { keywords: ["이란", "이스라엘", "전쟁", "호르무즈"], tag: "지정학" },
  { keywords: ["테슬라", "tsla", "일론머스크"], tag: "테슬라" },
  { keywords: ["위성", "sar", "해커톤", "gee"], tag: "위성" },
  { keywords: ["경제", "무역수지", "gdp", "인플레", "디플레", "금융위기"], tag: "경제" },
  { keywords: ["투자", "주가", "etf", "reits", "종목"], tag: "투자" },
  { keywords: ["네이버", "카카오", "셀트리온", "현대차", "삼양", "바이오"], tag: "한국주식" },
  { keywords: ["smr", "원전", "전기", "에너지"], tag: "에너지" },
  { keywords: ["정치", "정부", "윤석열", "이재명"], tag: "정치" },
  { keywords: ["기자", "언론", "미디어"], tag: "미디어" },
  { keywords: ["레시피", "파스타"], tag: "레시피" },
  { keywords: ["여행", "안동", "대전", "세종"], tag: "여행" },
  { keywords: ["dli", "강의", "충남대", "수업"], tag: "학습" },
];

function extractTags(text) {
  const lower = text.toLowerCase();
  const tags = new Set();
  for (const rule of TAG_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      tags.add(rule.tag);
    }
  }
  return [...tags].slice(0, 8);
}

function guessCategory(tags, text) {
  const lower = text.toLowerCase();
  if (tags.includes("레시피") || tags.includes("여행") || tags.includes("학습") || lower.includes("생일")) return "Personal";
  if (tags.includes("위성") || tags.includes("AI")) return "Tech";
  if (tags.includes("지정학") || tags.includes("중국") || tags.includes("일본")) return "Geopolitics";
  if (tags.includes("투자") || tags.includes("한국주식") || tags.includes("테슬라") || tags.includes("비트코인") || tags.includes("원자재")) return "Investment";
  if (tags.includes("저출산") || tags.includes("교육") || tags.includes("미디어") || tags.includes("정치")) return "Society";
  return "Economy";
}

function estimateReadingTime(md) {
  const words = md.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function slugFromDate(dateStr) {
  return `journal-${dateStr}`;
}

// ── Parse raw content into date sections ──
function parseJournalEntries(raw) {
  const datePattern = /^(?:#+\s*)?(\d{4}[.\-]\d{2}[.\-]\d{2}|\d{2}[.\-]\d{2}[.\-]\d{2})\s*$/;
  const inlineDatePattern = /^(\d{4}[.\-]\d{2}[.\-]\d{2}|\d{2}[.\-]\d{2}[.\-]\d{2})/;

  const entries = [];
  let currentDate = null;
  let currentLines = [];
  let firstBlockDate = null;

  const lines = raw.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for standalone date line
    const standaloneDateMatch = trimmed.match(datePattern);
    if (standaloneDateMatch) {
      if (currentDate && currentLines.length > 0) {
        entries.push({ date: currentDate, lines: [...currentLines] });
      }
      currentDate = normalizeDate(standaloneDateMatch[1]);
      currentLines = [];
      continue;
    }

    // Check for inline date at start of content
    const inlineMatch = trimmed.match(inlineDatePattern);
    if (inlineMatch && !currentDate) {
      currentDate = normalizeDate(inlineMatch[1]);
      const remainder = trimmed.slice(inlineMatch[0].length).trim();
      if (remainder) currentLines.push(remainder);
      continue;
    }

    if (currentDate) {
      currentLines.push(line);
    } else {
      // Content before any date — assign to first block
      if (!firstBlockDate) firstBlockDate = "2023-09-02";
      currentLines.push(line);
      if (!currentDate) currentDate = firstBlockDate;
    }
  }

  if (currentDate && currentLines.length > 0) {
    entries.push({ date: currentDate, lines: [...currentLines] });
  }

  return entries;
}

function normalizeDate(raw) {
  const cleaned = raw.replace(/\./g, "-");
  const parts = cleaned.split("-");
  if (parts[0].length === 2) {
    const year = parseInt(parts[0], 10);
    parts[0] = year >= 90 ? `19${parts[0]}` : `20${parts[0]}`;
  }
  return parts.join("-");
}

function generateTitle(date, content) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return `메모 (${date})`;
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}년 ${m}월 ${day}일 메모`;
}

function generateExcerpt(content) {
  const firstLine = content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("!["))[0];
  if (!firstLine) return "";
  return firstLine.length > 120 ? firstLine.slice(0, 117) + "..." : firstLine;
}

// ── The raw journal content ──
const RAW_CONTENT = `# 임금격차

중소기업과 대기업간 임금격차 but중소기업다니는 20대도 대기업과 같은 소비를 원함->사치소비의 평준화 근 20년간 대기업 임금상승률에 비해 중소기업대부분의 임금은 동결 또는 소폭 상승 이러한 원인은 더 심한 빈부격차와 아이들을 더 좋은 대학으로 보내고 싶어하는 학벌주의의 심화로 이어진다고 생각함 학벌주의를 약화시킬 수 있으면 사교육비도 낮출 수 있고 이 또한 저출산을 막기위한 긍정적 대안이라고 생각함 중소기업의 임금 상승률은 왜 그대로인지 알 수 없음

## 부동산

한정된자원임 시간이 지날 수록 상승 하지만 한계점 분명 현상황 한계점을 넘김 과도한 부동산가격상승 이유를 모르겠음 제대로된 부동산 정책 개혁이 필요해보임 집값은 심리적 요인때문 인 것 같음 건설사의 하청 재 하청으로 인한 품질저하 APT는 일정 땅에 수십개의 집을 짓는 것인데 모든 집들이 땅값을 그대로 받음. 남는돈은 어디로가는지(?) 부동산은 내재된 가치가 크다고 생각함 결국 이땅에 하나 밖에 없는 땅이기 때문에 가치가 잘 하락하지도 않고 그에 따른 가격이 잘 형성되어야 한다고 생각함 땅이 좁은 대한민국에서는 특히 땅의 가치를 더 높게보고 가치를 잘 매겨주는 것 같음

### 인구

저출산이 심각함 OECD 1위 가장 큰 요소는 자녀를 양육하기 위한 자금이 많이 들어가는 것 ex)기본이 되는 자가집 소유,사교육비,물가,다른사람보다 더 나은 삶을 살기위한 품위유지등 국가에서 지원 할 수 있는 것들은 최대한 해야함 이미 늦었음 고령층을 활용 할 수 있는 방안을 찾아야함 베이비시터로 고용하는등 아이들에 대한 인성교육이 필요함 도덕적헤이를 잘 구분하지 못함 사회화 교육이 필수 불가결로 들어가야함 성적이 나오는 과목들 뿐만아니라 더 중요시 여겨야 할 과목이라고 생각함 도덕 경제 기술과 가정 음악 미술 체육 실생활의 질을 높여줌 우리나라는 저소득 개발도상국이 아님 국가의 성장보다 국민 개개인의 삶의 질 향상과 행복도를 높일 필요가 있음 경제가 성장한다고 선진국이 아님 어느정도 수준에 오르면 문화의 발전이 중요함 미국과 같은경우 경제는 세계최고수준이지만 국민의 의식수준이 높지못함

## 경제

중국도 마찬가지 하지만 중국은 세계2위의 인구를 가지고 내수경제가 탄탄하기 때문에 주권국의 위치에 쉽게 올라 설 수 있음 또한 넓은 땅과 인구를 기반으로 쉽게 성장이 가능함 하지만 정치권의 불안정성 때문에 성장에 방해가 됨 공산주의의 대표격인 만큼 공산주의를 실현하기위한 인간의 욕심배제는 실패한 것 같음 이는 결국 공산주의라는 이념의 실패를 이야기함 대한민국은 갈라치기로 인한 사람들의 혐오감 조성과 같은 일들로 사람들을 심리적으로 더 압박하는 것 같음 저출산을 극복하기 위해서는 결국 심리적인 문제와 물리적인 문제 두가지를 해결해야하기 때문에 심리적 문제 까지 해소해야하는 지금으로서는 더욱 힘들어 진 것 같음 무역수지가 적자로 돌아서면서 국가에 돈이 돌지 않는다는 것이 체감됨 지방 2,300개의 중소건축사들이 작업을 멈추고 7개의 대형건설사들이 파산함 부동산PF경화로 인한 부동산자금들이 마르고 이에 따른 국가안에서 도는 돈의 총량이 줄어든 것 같음 돈을 다시 돌게 하기 위해서는 일시적으로는 가능하지만 장기적으로는 악수가 될 것 같음 하지만 윤석열 정부는 여론관리를 위해서 자금을 일시적으로 유통 할 것 같음 일반인들의 부채율을 낮추고 회사들의 부채를 빠르게 탕감 할 수 있도록 유도해야 후에 오는 경제 여파에서 피해를 입지 않을 수 있음 현재 한국의 외화보유는 국가gdp대비 세계 최고 수준이지만 실제 현금으로 들고 바로 사용 할 수 있는 자금은 30퍼센트가 채 안됨 나머지는 채권 또는 부동산임 이러한 비현물 자산은 현금화하기도 힘들기 때문에 외환보유고가 바닥이 났을때 바로 사용하기가 힘듦 엔저로 인한 투자아이디어 일본의 통화인 엔화가 저점임 이유는 일본이라는 국가에 투자된 자금들이 회수되고있어서 인 것 같음 일본이라는 국가가 30년째 플라자합의와 버블에서 벗어나지 못하고 있기 때문에 디플레이션으로 국가의 성장이 더욱 더뎌진 것 같음 하지만 일본의 엔저는 일본이 반드시 성장한다는 가정하에 투자하기 적기임 하지만 어디까지 엔저가 떨어질지는 예측이 안됨 오른다는 쪽에 베팅하고 싶음 근거는 일본의 경제의 안정성과 내수시장의 견고함임 일본은 전세계의 상사회사들의 큰손이며 막대한 양의 미채권을 보유하고 있음 따라서 일본경제는 미국경제와 운명공동체임

지금의 대한민국의 흐름은 2010년~2013년 흐름과 비슷함 노인세대가 늘어나고 노동가능 인구가 줄어들면서 사람인과 블라인드같은 구직할 수 있는 플렛폼들이 성장하고 있음 그리고 침체되는 경기마저 닮아있음 따라서 기술기반의 가치성장 시장 트렌드 변화를 잘 따라갈 수 있는 기업들이 중요함

노인빈곤율 기사보고 든 생각이다. 대한민국은 급격한 경제 성장으로 각 세대가 겪을 수 있는 환경이 제각기 달랐기 때문에 서로 이해하기 힘든 문화가 생겼고, 해결되지 않은 문제들을 떠안고 그대로 성장해서 그 상처가 곪았다고 생각한다.

어린사람들이 결혼이 늦고 아이를 안낳는 이유 - 본인들이 겪은 경험을 토대로 자기 자식은 그렇게 안키우고 싶다는 생각으로 더 좋은 환경에서 결혼하려고 하다보니 결혼연령도 높아지고 점점상대방에게 서로 요구하는게 많아진것 같음

기자는 월급쟁이가 아닌 프리랜서로 만들고 정부와 시민단체 이익집단이 모여서 등분하고 각자 감시하도록 해야함

하남 도시개발 스피어 대륙당 한개 외국인관광유입 지역상권 발달

2023.11.27

브릭스 5+13개국 희토류매장량 74% 금본위제 부활 중국이 디지털 위안화를 추진하는데 거기에 사용될 발행 기준은 금과 희토류 따라서 btc,이더같은 대표격 암호화폐 성장가능성이 생겼고 금값 더욱 상승할 것 만약 중국이 브릭스 제대로 가동해서 성공시킨다면 세계패권은 더이상 미국이 아닌 중국이 쥘 수도 있음 하지만 변수는 희토류를 가장 대중적으로 사용되는 분야는 철을 강화하기위한 첨가제 또는 자동차 LFP베터리인데 테슬라가 희토류를 사용하지 않도록 베터리를 만든다고 했기 때문에 좀 봐야알듯

2023.11.29

브릭스가 진짜 전세계금의 생산량중 80%를 가져가고있음 인도 국민이 들고있는 금이 2만4000톤 중국인도가 금을 많이 들고 있고 브라질 중국이 희토류 독점이라 진짜 디지털 위안화 될수도

2023.12.01

절 덕숭문중,범어문중 투톱. 덕숭은 수덕사,불국사,범주사,금산사 범어는 해인사,범어사,화엄사,대 신흥사 등 절들이 입장료를 받는 이유는 일제강점기때 일본이 원래 산전체를 절로 보던것을 반경 몇키로를 정해서 나머지를 국유화 했기 때문

최성철, 최은혁, 임성순, 서명 북한 대표적인 해커 제3국 기술정찰국 산하 110연구소 내 해커그룹 라자루스 내부 블루로프,안다리엘

2023.12.09

중국이 인도에게 잘보이기 위해 석탄을 제한하지 않음 이건 디지털 위안화 추진과 일대일로 브릭스의 이익과 연관있을 수 밖에 없음 결론) 금과 btc는 더욱 상승할것 이유는 디지털 위안화 성공 가능성이 높아졌기 때문

2024.03.27

일론머스크의 인터뷰에서 ai의 전기사용비율이 2030년에는 75%까지 늘어날 것이라고 말하고, 미국의 변압기와 전선 노후화로 인해 ls 전선, 현대 일렉트릭등이 주가상승

2024.04.01

cr reits의 가능성 lh에서 70퍼 보증 reits etf도 가능성 생김 슬슬 pf관련 매물이 경매로 나옴 공실률 70퍼

2025.05.31

pc의 수요 감소 ai서버 수요 증가 이유는? pc원가 상승 시간이 지날 수록 서버에 귀속될것 혁신적인 생산 단가를 낮출 방법이 보이지 않는다면 성능이 좋은 서버와 용량을 올리기 위해서는? 돈

2025.06.04

7월 난카이 트로프, 도쿄마린홀딩스, 보상금지급 해외 자산 회수, 엔화상승, 지진 발생 시 주가하락, 변수 6월 17일 BOJ금리 발표

2025.06.13

이스라엘 이란 핵시설 공습 호르무즈 해협 봉쇄 한국으로 들어오는 원유 중 70%가 호르무즈 해협 통과 한국은 2025년 3월 말 기준으로 정부와 민간을 합쳐 총 209.6일분의 석유를 비축하고 있음

2025.06.25

ktx타고 천안아산 가다 생각난거 오송 세종 조치원 괜찮아보임 세종으로 청와대 국회 이전 후 규모가 커진다면 서평리 부강역

2025.07.09

m2통화량에 따른 인플레가 왔을 때 오른 연봉이 디플레가 와도 떨어지지 않음 → 신입 구인 감소 다시 인플레가 오면 인플레가 온 만큼 연봉증가 이런 현상이 QT QE를 시행하던 2008년 리먼브라더스 이후로 계속 진행되는 듯

2025.09.15

산업 체인을 아는게 중요한듯 ai의 경우 전기 → 데이터 센터에 들어가는 하드웨어 → 데이터센터 → llm을 개발하는 등 ai베이스 산업 → ai 응용사업 HD일렉트릭과 효성중공업 LS일렉트릭 세가지를 생각했고 지금와서 주가를 확인하면 그 때 살걸 하는 생각이 또 든다. google이 압도적이라는 생각이 들었다

2025.09.16

ms research에서 GPU의존을 줄이기 위한 새로운 돌파구를 제시 영국 케임브리지 연구소와 마이크로 LED 광원, 광학렌즈, 스마트폰 카메라 센서를 조합해 개발한 아날로그 광학 컴퓨터(AOC)를 공개 NVIDIA를 대체 할 장치가 되었으면 좋겠다

2025.09.28

nvidia가 스타게이트를 짓는 openai에 1000억달러를 투자 스테이블코인으로 미국이 옮겨간다면 미국의 부채를 전세계에 나누기위함 나중에 취업하고싶은기업 센드버드 superbai 쿼리파이 브랜더

2025.09.29

한국의 97년 금융위기 분석 - 헤지펀드들이 태국의 고정 환율제를 공격해서 변동 환율제로 바꾸는데 성공하며 큰 수익을 올림 이때 중국이 본인들 환율을 40% 다운 시킴 종금사 뱅크런 외환보유고 소진

외국인이 당장은 증시에 많이 들어와 괜찮아 보임 다만 잠시 뒤 올 폭풍 전야와 같은 느낌

미국연준의 역레포 잔고도 바닥을 드러냄 연준이 쓸 수 있는 카드는 거의 다쓴듯

2025.09.30

학원비 증가 이재명정부는 단순히 지원금을 뿌리는 것이 아닌 교육자를 양성하여 지식의 격차를 줄였어야함 기술이 눈부시게 발전하는 동안 교육법은 전혀 발전하지 않고 구 시대적인 교육법을 고수하는 중

2025.10.10

한국 주요 기업 종합 분석 - 삼성전자(7점), SK하이닉스(9점), 한화오션(5점), HD현대중공업(9점), 레인보우로보틱스(6점), HD현대(7점), 한화에어로스페이스(9점), 네이버(7점), 현대차그룹(8점), 삼양(6점), 카카오(4점), 셀트리온(8점)

종합 평가 - 방산과 반도체를 가장 고평가하며 한화에어로스페이스와 sk하이닉스 그리고 HD현대중공업 세가지를 꼽을 수 있겠다

2025.10.14

긍정은 수렴하고 혐오는 발산한다. 레프 톨스토이의 안나 카레니나에서 첫 문장은 행복한 가정은 모두 엇비슷하지만, 불행한 가정은 저마다의 이유로 불행하다고 한다. 어쩌면 사회가 혐오에 물드는 것은 행복이 찾아가기 더 어렵고 까다롭기 때문 아닐까

2025.10.26

QE / QT등 RRP나 지준금이나 SOFR이나 IROB 쉽게 이해하는 법 - 시장이 자동차라고 하고 연준은 운전사 QE는 엑셀 QT는 브레이크 속도는 인플레

2025.10.31

롤인데 캐릭이 있어야하나? 그냥 다 똑같은 상태에서 시작해서 데드락처럼 파밍해서 스킬사고 무기사고 해서 하면 안되나?

2025.11.12

생일날 이모랑 할머니랑 용돈을 보내주셨다. 지윤이가 돈을 줬다 미친놈. 구글이 ai 생태계를 통합적으로 운영할 능력을 갖추었다면 이 생태계를 파는 회사를 세우면 안되나? 평화는 모두가 가지지 않고 내려 놓는 것에서 나오는 것이 아닌 모두가 가지고 있는 상태에서 줄을 팽팽히 당겨야 나오는거다.

2025.11.17

뭐든지 밸런스가 중요하다 가치 있는 일을 함에 있어서도 기업을 성장시키는데에도 무엇을 하던 균형이 중요하다. 영원불멸한 것은 없다. 엔트로피에 위배된다. 그렇기에 무엇을 하던 균형을 이루는 상태가 중요하다.

2025.11.25

서브프라임에 대한 그림자금융(NBFI) 사모 대출이 문제가 되는 것 같다. CLO에 PIK라는 신용카드의 리볼빙과 같은 방식이 더해져 있어 고금리인 상품에 리볼빙이 붙으니 상환이 어려워짐 2008년 서브프라임 모기지 규모가 2조 달러인데 사모대출은 1.7조 수준

2025.11.28

인플레이션을 이용해서 미국의 빚을 녹인다 이 주장 타당해보임 트럼프는 m2 총통화량이 증가함에도 불구하고 금리를 내리라는 압박 대놓고 인플레 유발시키고 기본소득 지급한다는건 빚을 녹이고 민심을 달래기 위함

2025.12.01

인텔이 27년부터 IFS 파운드리가 애플의 m 시리즈 생산 가능성 미국정부의 지분이 올라가고 나서 미국 기업들은 가격이 비슷하다면 인텔을 선호하게 될것

2025.12.02

명란연어 파스타 레시피 - 긴자료코 명란 파스타에 라면 수프 우유 연어 스테이크

2025.12.09

부동산에 목숨걸고 사는 사람들이 많다 아파트로 돈을 벌 수 있는 구조 때문인가? 항상 본질이 중요하다. 가치 평가가 중요하며 해당 산업에 관심을 가지고 찾아 볼 경우에는 근본이 되는 원자재부터 가치 평가를 중요시 여기고 연습해야한다.

2025.12.11

은, 우라늄, 구리 26년을 기대하는 원자재 3가지. ai가 당금 가장 가치 있는 산업이라고 생각하기 때문에 ai관련된 원자재를 찾아보는 것 같다. AGI SGI에 대해 gemini와 이야기 하다보니 모라벡의 역설에 대한 이야기를 했다

2025.12.12

일론머스크 인터뷰 - AI가 정신노동을 대체하고 로봇이 육체노동을 대체하는 시대. 비트코인은 에너지 기반 희소성을 직접적으로 반영하는 자산. 물리학적 화폐(physics-based money)의 핵심. 비트코인 한 개라도 사서 콜드월렛에 넣어야한다는 생각이 들었다.

2025.12.15

근친혼으로 인한 유전적 문제는 마치 ai의 자가 학습과 비슷한 양상을 보인다. 로직이 비슷하니

2025.12.24

ㅈ같다 그냥 ㅈ같은 기분 유홍준 교수님 영상 보고 안동 갔다올거다 소수 병산 도산 영양봉감5층전탑 도산서원 - 청량산 - 낙동중학교 - 청암정

2026.01.05

26년 첫 번째 쓰는 글이다. 고모부가 경제학부 출신이신데 은과 구리를 말씀드렸더니 고모부께서는 은과 알루미늄을 보고 계셨다. 지나고 보니 금이 제일 좋은 것 같다 하신다. SLV를 샀다.

2026.01.06

notion api부터 GitHub actions를 사용하여 자동 commit push 까지 어렵다. md로 바꾼 글을 gemini 2.5 flash모델을 사용해서 요약하는 것 까지

2026.01.07

날짜별로 섹션을 분리해서 전체 페이지를 ai에 던져서 요약하고 올리는 것이 아닌 날짜 섹션 별로 있으면 스킵하는 방식으로 수정했다. 존나 어렵다. 사이트에 애착이 생긴다.

2026.01.08

CES 기조연설 한 젠슨 황의 영상을 다시 봤다. 피지컬 ai를 언급하며 벨라 루빈 이야기. 테슬라 종목 분석 TSLA 현재 주가 $431.41 PER 290-300배 고평가 상태이나 피지컬 ai시대에 확실한 가치를 지님. SLV다 팔고 TSLA 샀다.

2026.01.10

은 팔자마자 slv 올라버리네 그래도 tsla도 오르긴 했다. 현대차 지배구조에 대한 이야기를 아버지와 나눴다. 현대모비스를 가운데 두고 지주회사 구조를 세우려 하는 것 같다.

2026.01.11

kt인재개발원가서 NVDA DLI 강의 듣는 좋은 기회가 생겨서 5일동안 대전에 머물게 되었다.

2026.01.12

ollama써서 deepseek r1으로 챗봇 만들어서 사이트에 넣어야겠다. dli 강의 교수님들 참 다양하다. 위성 관련이라 그런가.

2026.01.13

강의 2일차 딥러닝의 기본 cnn, 파인튜닝등. 위성영상을 활용한 ai object detection, semantic segmentation, super resolution 등 배움.

2026.01.14

충남대 공유대학 데이터 마이닝 랩 김조은 박사님 - 데이터 웨어하우스, 연관 분석, SVM, K-Nearest neighbor, Decision Tree, k-means, DBSCAN 등 학습

2026.01.15

해커톤 전날 하루 종일 자료조사. GEE에서 받은 지도 데이터를 PyTorch Tensor로 Normalization → U-Net 아키텍처 → 실행 및 시각화. 역시 프로그래밍은 수학을 잘해야한다.

2026.01.16

해커톤 발표날. 질문 내가 다 받았다. 7분 정도 받았는데 죽는 줄 알았다. 확실히 충대 분들과 말이 잘 통한다.

2026.01.21

확장적 재정정책 인플레로 인한 금, 은 상승 / 다카이치 과반 시 니케이

2026.01.23

2026년 다보스 포럼에서 핵심 아젠다는 방산 지정학 ai 이렇게로 볼 수 있고 방산 5대장 한에스 kai lig 현대로템 한화시스템

2026.02.16

일본인 정신과 전문의 구마시로 도루의 인용:

1. "사회가 요구하는 '정상'의 범위가 극도로 좁아졌다. 사회의 허용 폭이 좁아져서 '환자'가 양산되는 꼴이다."

2. "'나 하나 무해하게 살아남기도 벅찬데, 어떻게 유해한 존재(아이)를 세상에 내놓겠는가'라는 저항이 저출생이라는 결과로 나타나는 식이다."

3. "이제는 '부적응자를 어떻게 가려낼 것인가'보다, 더 많은 사람이 '정상'으로 여겨지고 '건전'하다고 인정받기 위해 무엇이 필요한지를 고민해야 한다."

4. "사회가 쾌적해질수록 '죄인'의 범위도 더 넓어진다. 에밀 뒤르켐이 '질서가 완벽히 유지된 수도원에서는 작은 일탈도 큰 죄악으로 간주한다'고 말했듯."`;

// ── Main execution ──
async function main() {
  console.log("=== Journal Seed Script ===\n");

  // 1. Ensure categories exist
  console.log("1. Upserting categories...");
  const categoryMap = {};
  for (const cat of CATEGORY_DEFS) {
    const { data, error } = await supabase
      .from("categories")
      .upsert(cat, { onConflict: "slug" })
      .select("id, name")
      .single();
    if (error) {
      console.error(`  Failed to upsert category ${cat.name}:`, error.message);
      continue;
    }
    categoryMap[data.name] = data.id;
    console.log(`  ✓ ${data.name} (${data.id})`);
  }

  // 2. Get or create author profile
  console.log("\n2. Checking author profile...");
  const { data: profiles } = await supabase.from("profiles").select("id").limit(1);
  if (!profiles || profiles.length === 0) {
    console.error("  No profiles found. Create a Supabase Auth user first.");
    console.error("  Go to Supabase Dashboard > Authentication > Users > Add User");
    process.exit(1);
  }
  const authorId = profiles[0].id;
  console.log(`  ✓ Author: ${authorId}`);

  // 3. Parse journal entries
  console.log("\n3. Parsing journal entries...");
  const entries = parseJournalEntries(RAW_CONTENT);
  console.log(`  Found ${entries.length} date entries`);

  // 4. Insert posts
  console.log("\n4. Inserting posts...");
  let inserted = 0;
  let skipped = 0;

  for (const entry of entries) {
    const content = entry.lines.join("\n").trim();
    if (!content) {
      skipped++;
      continue;
    }

    const slug = slugFromDate(entry.date);
    const tags = extractTags(content);
    const categoryName = guessCategory(tags, content);
    const categoryId = categoryMap[categoryName] || null;

    const title = generateTitle(entry.date, content);
    const excerpt = generateExcerpt(content);

    // Skip if slug already exists
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      console.log(`  ⊘ ${slug} (already exists)`);
      skipped++;
      continue;
    }

    const { error } = await supabase.from("blog_posts").insert({
      author_id: authorId,
      title,
      slug,
      excerpt,
      content_mdx: content,
      tags,
      category_id: categoryId,
      is_published: true,
      reading_time_minutes: estimateReadingTime(content),
      published_at: new Date(entry.date + "T09:00:00Z").toISOString(),
    });

    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
    } else {
      console.log(`  ✓ ${slug} [${categoryName}] tags=[${tags.join(", ")}]`);
      inserted++;
    }
  }

  console.log(`\n=== Done: ${inserted} inserted, ${skipped} skipped ===`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
