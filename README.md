# 바베큐 파티 현황

12월 20일 크리스마스 바베큐 파티 현황관리 페이지예요. 메뉴, 준비물(배달 포함), 정산을 링크 하나로 함께 관리해요.
로그인 없이 누구나 쓸 수 있고, 데이터는 주최자의 구글 시트에 저장돼요.

## GitHub Pages로 공개하기

1. GitHub에서 **New repository** → 이름 예: `bbq-party` → **Public** → Create
2. **Add file → Upload files** → `index.html`, `README.md` 끌어다 놓기 → **Commit changes**
3. **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main** / **(root)** → **Save**
4. 1~2분 뒤 `https://<깃허브아이디>.github.io/bbq-party/` 주소가 생겨요. 이 주소를 카톡에 공유하면 돼요.

## 데이터 연결 (한 번만)

데이터는 구글 시트 **바베큐 파티 현황 데이터**에 저장돼요. 시트에 Apps Script(`Code.gs`)를 붙여 웹 앱으로 배포한 뒤,
`index.html` 맨 위의 이 줄에 배포 주소를 넣어 주세요. GitHub에서 `index.html`을 열고 연필 아이콘을 눌러 고치면 돼요.

```js
var API_URL = '여기에_Apps_Script_배포_주소를_붙여넣기';
// 예: var API_URL = 'https://script.google.com/macros/s/AKfy..../exec';
```

`Code.gs`에는 참여자 이름이 들어 있어서 이 저장소에는 올리지 않아요. 구글 시트의 Apps Script에만 붙여 주세요.
