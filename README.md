# YoongeonChoi.github.io

보안 하드닝 + 모션 중심 UI/UX 리디자인이 적용된 정적 PR/포트폴리오 사이트입니다.

이 문서는 단순 소개가 아니라, **운영 매뉴얼**입니다.
사람이 직접 수정하거나 다른 AI에게 작업을 넘길 때 이 README 하나로 구조/규칙/검증 절차를 재현할 수 있도록 작성했습니다.

---

## 0. 프로젝트 목표 (왜 이 구조인가)

### 핵심 목표
- 채용 관점에서 신뢰도 높은 포트폴리오 제공
- 콘텐츠(프로젝트/블로그) 작성 생산성 유지
- 보안/성능/접근성 기준을 배포 파이프라인에서 자동 검증

### 설계 원칙
- 정적 우선(Static-first): GitHub Pages 제약에 맞춘 안정적 배포
- 단순성 우선(Simplicity-first): 불필요한 런타임 의존성 최소화
- 보안 기본값(Secure-by-default): 위험 패턴을 CI에서 차단
- 편집 친화성(Content-first): Markdown 기반 운영

---

## 1. 이번 리디자인에서 추가/개선된 기능

### A. IA(정보구조) 개편
- `Home`: 포지셔닝/핵심 강점/CTA/대표 콘텐츠
- `About`: 업무 방식/협업 스타일
- `Projects`: 케이스 스터디 목록
- `Project Detail`: 문제-결정-성과 중심 상세
- `Blog`: 글 목록 + 태그/카테고리 탐색
- `Blog Detail`: 읽기 모드 + TOC
- `Resume`: 웹 이력서 + PDF 다운로드
- `Contact`: 채용/협업 전환 페이지

### B. 블로그 시스템
- Markdown 기반 (`content/blog/*.md`)
- 태그/카테고리 아카이브 자동 생성
- RSS 자동 생성 (`/feed.xml`)
- syntax highlighting
- 읽기시간 계산

### C. 보안 하드닝
- Markdown 렌더링 sanitization 적용
- 외부 링크 안전 속성 강제
- 위험 패턴 정적 검사 스크립트 추가
  - `eval`, `new Function`, `innerHTML` 대입, 비인가 `dangerouslySetInnerHTML`, `http://` 등
- CI 보안/품질 게이트 추가

### D. 성능/접근성 개선
- static export 유지
- 링크 prefetch 과다 로딩 억제
- `prefers-reduced-motion` 지원
- skip link, heading 구조, focus ring 개선
- Lighthouse 자동 검증

### E. SEO/배포 개선
- 라우트별 메타
- `sitemap.xml`, `robots.txt`, OG 기본 이미지
- GitHub Actions CI + 배포 분리 운영

---

## 2. 페이지 구조 설명

| 경로 | 목적 | 데이터 소스 |
|---|---|---|
| `/` | 첫 인상/포지셔닝/핵심 증거 | `content/projects`, `content/blog` |
| `/about` | 소개/원칙 | 정적 텍스트 |
| `/projects` | 프로젝트 목록 | `content/projects/*.md` |
| `/projects/[slug]` | 케이스 스터디 | `content/projects/*.md` |
| `/blog` | 블로그 인덱스 | `content/blog/*.md` |
| `/blog/[slug]` | 블로그 본문 | `content/blog/*.md` |
| `/blog/tags/[tag]` | 태그별 목록 | 블로그 frontmatter tags |
| `/blog/categories/[category]` | 카테고리별 목록 | 블로그 frontmatter category |
| `/resume` | 이력서 웹 뷰 | `src/site/data/resume.ts` |
| `/contact` | 연락 전환 | `src/site/config.ts` |

---

## 3. 콘텐츠 스키마 (중요)

AI나 사람이 수정할 때 가장 많이 깨지는 부분이 frontmatter 스키마입니다.
아래 규칙을 지켜야 빌드/정렬/필터가 안정적으로 동작합니다.

### 3-1. 블로그 글 스키마 (`content/blog/*.md`)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `title` | string | 예 | 글 제목 |
| `summary` | string | 예 | 목록/SEO용 요약 |
| `date` | `YYYY-MM-DD` 문자열 | 예 | 발행일(정렬 기준) |
| `updated` | `YYYY-MM-DD` 문자열 | 아니오 | 수정일 |
| `tags` | string[] | 예(빈 배열 가능) | 태그 목록 |
| `category` | string | 예 | 카테고리 |
| `featured` | boolean | 아니오 | 강조 표시용 |
| `draft` | boolean | 아니오 | `true`면 빌드 제외 |

### 3-2. 프로젝트 스키마 (`content/projects/*.md`)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `title` | string | 예 | 프로젝트명 |
| `summary` | string | 예 | 한 줄 설명 |
| `role` | string | 예 | 본인 역할 |
| `timeline` | string | 예 | 기간 |
| `featured` | boolean | 아니오 | 홈 노출 우선 |
| `order` | number | 아니오 | 목록 정렬 우선순위 |
| `stack` | string[] | 아니오 | 기술 스택 |
| `impact` | string[] | 아니오 | 정량/정성 성과 |
| `links.demo` | URL | 아니오 | 데모 |
| `links.repo` | URL | 아니오 | 코드 저장소 |
| `links.caseStudy` | URL | 아니오 | 외부 문서 |

---

## 4. 블로그 작성 방법 (실무 절차)

### 4-1. 새 글 추가
1. 파일 생성
```bash
content/blog/my-post-slug.md
```
2. frontmatter 작성
3. 본문 작성 (`##`, `###` 권장)
4. 로컬 확인
```bash
npm run dev
```
5. 품질 검증
```bash
npm run verify
npm run audit
```

### 4-2. 블로그 frontmatter 템플릿
```md
---
title: "포스트 제목"
summary: "목록/SEO 요약"
date: "2026-02-16"
updated: "2026-02-17"
tags:
  - security
  - portfolio
category: "Security"
featured: false
draft: false
---

## 문제
...

## 접근
...

## 결과
...
```

### 4-3. 글 작성 권장 규칙
- 제목은 구체적으로: 문제/대상/결과가 드러나게
- 본문은 `문제 -> 접근 -> 결과` 흐름 유지
- 결과 섹션에는 가능하면 수치 포함
- 코드블록 언어 지정 (`ts`, `tsx`, `bash` 등)

### 4-4. 자동 반영되는 것
- `/blog` 목록
- `/blog/tags/[tag]`
- `/blog/categories/[category]`
- RSS (`/feed.xml`)

---

## 5. 프로젝트(케이스 스터디) 작성 방법

### 5-1. 파일 생성
```bash
content/projects/my-project-slug.md
```

### 5-2. 프로젝트 frontmatter 템플릿
```md
---
title: "프로젝트명"
summary: "한 줄 요약"
role: "Lead Product Engineer"
timeline: "2026 Q1"
featured: true
order: 1
stack:
  - Next.js
  - TypeScript
impact:
  - "핵심 성과 1"
  - "핵심 성과 2"
links:
  demo: "https://example.com"
  repo: "https://github.com/..."
---

## Problem
...

## Approach
...

## Security / Trade-offs
...

## Outcome
...
```

### 5-3. 작성 포인트
- 본인 역할(`role`)을 모호하지 않게 작성
- 성과(`impact`)는 recruiter가 빠르게 읽을 수 있게 짧고 명확하게
- 기술 나열보다 의사결정 이유를 본문에서 설명

---

## 6. 로컬 개발/검증 명령어

### 설치
```bash
npm ci
```

### 개발 서버
```bash
npm run dev
```

### 개별 점검
```bash
npm run lint
npm run typecheck
npm run security:check
npm run audit
```

### 통합 검증 (배포 게이트와 동일)
```bash
npm run verify
```

### Lighthouse 기준 검증 (모바일)
```bash
npm run lighthouse:check
```

### 빌드
```bash
npm run build
```
- build 전에 RSS 생성이 자동 수행됩니다.
- 결과물은 `out/`에 생성됩니다.

---

## 7. 배포/CI 파이프라인

### GitHub Pages 배포
- 파일: `.github/workflows/deploy.yml`
- 흐름:
  1. `npm ci`
  2. `npm run verify`
  3. `out/404.html` + `.nojekyll`
  4. artifact 업로드
  5. `actions/deploy-pages` 배포

### CI 품질 게이트
- 파일: `.github/workflows/ci.yml`
- 실행 항목:
  - lint
  - typecheck
  - security check
  - dependency audit
  - build
  - lighthouse threshold check

---

## 8. 디렉토리 구조

```txt
content/
  blog/                 # 블로그 Markdown 원본
  projects/             # 프로젝트 Markdown 원본
src/
  app/                  # Next.js 라우트
  site/                 # UI 컴포넌트, 디자인 시스템, 사이트 설정
  lib/content/          # Markdown 로더/파서/타입
  lib/security/         # CSP 등 보안 설정
scripts/
  generate-rss.mjs      # RSS 생성
  security-check.mjs    # 정적 보안 규칙 검사
  lighthouse-check.mjs  # Lighthouse 점수 검증
docs/
  security-audit.md
  design-system.md
  portfolio-checklist-2026.md
```

---

## 9. 자주 수정하는 파일
- 사이트 메타/링크: `src/site/config.ts`
- 이력서 데이터: `src/site/data/resume.ts`
- 블로그 글: `content/blog/*.md`
- 프로젝트 글: `content/projects/*.md`
- 디자인 토큰: `src/app/globals.css`

---

## 10. 다른 AI에게 작업을 넘길 때 프롬프트 가이드

아래 형식으로 요청하면 구조를 덜 깨고 작업할 확률이 높습니다.

```txt
이 저장소는 Next.js static export 기반 포트폴리오 사이트다.
반드시 다음을 지켜라:
1) content/blog와 content/projects frontmatter 스키마를 변경하지 말 것
2) 보안 관련 스크립트(scripts/security-check.mjs) 우회 금지
3) 변경 후 npm run verify, npm run audit, npm run lighthouse:check 실행
4) README의 "콘텐츠 스키마"와 "검증 절차"를 기준으로 수정할 것
```

추가로 전달하면 좋은 정보:
- 어떤 페이지를 바꾸는지
- 콘텐츠만 바꾸는지(구조 변경 없음) / 구조까지 바꾸는지
- Lighthouse 목표 유지 여부

---

## 11. 릴리즈 전 체크리스트

- [ ] `npm run verify` 통과
- [ ] `npm run audit` 취약점 0 확인
- [ ] `npm run lighthouse:check` 기준 통과
- [ ] 새 글/프로젝트 slug 중복 없음
- [ ] `draft: true` 글이 실수로 남지 않았는지 확인
- [ ] `docs/security-audit.md` 갱신 필요 여부 확인

---

## 12. 트러블슈팅

### Q1. 글을 추가했는데 목록에 안 뜸
- 파일 확장자 확인 (`.md` / `.mdx`)
- `draft: true` 여부 확인
- frontmatter 키 오타 확인 (`title`, `summary`, `date` 등)

### Q2. 태그/카테고리 페이지가 비어 있음
- 해당 글의 `tags`, `category` 값 확인
- 대소문자/공백 혼용 여부 확인

### Q3. 빌드는 되는데 Lighthouse가 떨어짐
- 이미지/폰트/불필요한 클라이언트 스크립트 증가 여부 확인
- prefetch 또는 대규모 애니메이션 변경 여부 확인

### Q4. security check 실패
- `eval`, `innerHTML` 대입, 비인가 `dangerouslySetInnerHTML` 사용 여부 확인
- 외부 URL이 `http://`로 들어갔는지 확인

---

## 13. 참고 문서
- 보안 감사 보고서: `docs/security-audit.md`
- 디자인 시스템/모션 가이드: `docs/design-system.md`
- 2026 포트폴리오 체크리스트: `docs/portfolio-checklist-2026.md`
