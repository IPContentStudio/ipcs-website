# IPCS Website

GitHub Pages용 정적 홈페이지입니다.

## 공개 설정

1. 이 저장소의 `Settings` → `Pages`로 이동합니다.
2. `Build and deployment`의 Source를 `Deploy from a branch`로 선택합니다.
3. Branch는 `main`, 폴더는 `/docs`를 선택한 뒤 `Save`를 누릅니다.
4. 배포가 완료되면 GitHub가 공개 주소를 표시합니다.

## 수정 위치

- 문구와 섹션: `docs/index.html`
- 디자인: `docs/style.css`
- 모바일 메뉴: `docs/script.js`
- 포트폴리오 기업 정보: `docs/portfolio-data.js`
- 로고: `docs/assets/ipcs-logo.png`

문의 이메일은 현재 `jhpark@human108.com`으로 연결되어 있습니다.

## 포트폴리오 추가 방법

`docs/portfolio-data.js`의 배열에 기업 정보를 한 묶음 추가하면 카드가 자동 생성됩니다. 기업 수가 늘어날 경우 같은 데이터의 `category`, `investmentTypes`, `year`, `status` 값을 사용해 검색과 필터 기능을 확장할 수 있습니다.
