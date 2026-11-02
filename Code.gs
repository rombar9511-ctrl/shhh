/**
 * 바베큐 파티 현황관리 — Google Apps Script 서버
 * 데이터는 구글 시트 '바베큐 파티 현황 데이터'의 '앱_' 탭들에 저장돼요(처음 열 때 자동으로 만들어짐).
 * 이 시트의 [확장 프로그램 → Apps Script]에 붙여 넣고 웹 앱으로 배포하면 돼요.
 */
var TABS = { people: '앱_참여자', items: '앱_준비물', menus: '앱_메뉴', paid: '앱_송금', meta: '앱_정보' };
var HEADERS = {
  people: ['id', 'name', 'order'],
  items: ['id', 'order', 'cat', 'name', 'qty', 'unit', 'owner', 'status', 'amount', 'payer', 'note', 'mode', 'store', 'dstatus', 'createdAt'],
  menus: ['id', 'name', 'menu', 'updatedAt', 'by'],
  paid: ['id', 'name', 'done', 'updatedAt'],
  meta: ['id', 'date', 'place', 'treasurer', 'account']
};
var NUM_FIELDS = { amount: true, order: true };
var BOOL_FIELDS = { done: true };
var CACHE_KEY = 'bbq-all-v1';

var SEED = {
  "people": [
    {
      "id": "p-eab980ec9ab0eca095",
      "name": "김우정",
      "order": 1
    },
    {
      "id": "p-eab980ec9eacec9d80",
      "name": "김재은",
      "order": 2
    },
    {
      "id": "p-eab980eca780ec9d80",
      "name": "김지은",
      "order": 3
    },
    {
      "id": "p-ebb095ec9a94eb8298",
      "name": "박요나",
      "order": 4
    },
    {
      "id": "p-ebb095ec9b90",
      "name": "박원",
      "order": 5
    },
    {
      "id": "p-ec8ba0ebafbceca780",
      "name": "신민지",
      "order": 6
    },
    {
      "id": "p-ec9c84ec9ca0eca784",
      "name": "위유진",
      "order": 7
    },
    {
      "id": "p-ec9ca4ec849cec9881",
      "name": "윤서영",
      "order": 8
    },
    {
      "id": "p-ec9db4eb8ba4ec9881",
      "name": "이다영",
      "order": 9
    },
    {
      "id": "p-eca084ec97b0eca3bc",
      "name": "전연주",
      "order": 10
    },
    {
      "id": "p-eca1b0ec9ca4eca3bc",
      "name": "조윤주",
      "order": 11
    },
    {
      "id": "p-eca3bcec84b1ed9dac",
      "name": "주성희",
      "order": 12
    },
    {
      "id": "p-ecb59cebaa85eca780",
      "name": "최명지",
      "order": 13
    }
  ],
  "items": [
    {
      "amount": 0,
      "cat": "불·그릴",
      "name": "숯",
      "note": "",
      "order": 1,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "봉",
      "id": "i-001"
    },
    {
      "amount": 0,
      "cat": "불·그릴",
      "name": "착화제 / 토치",
      "note": "",
      "order": 2,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "개",
      "id": "i-002"
    },
    {
      "amount": 0,
      "cat": "불·그릴",
      "name": "라이터",
      "note": "",
      "order": 3,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "개",
      "id": "i-003"
    },
    {
      "amount": 0,
      "cat": "불·그릴",
      "name": "석쇠·그릴망",
      "note": "장소에 있는지 확인",
      "order": 4,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "개",
      "id": "i-004"
    },
    {
      "amount": 0,
      "cat": "불·그릴",
      "name": "집게",
      "note": "",
      "order": 5,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "개",
      "id": "i-005"
    },
    {
      "amount": 0,
      "cat": "불·그릴",
      "name": "가위",
      "note": "",
      "order": 6,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "개",
      "id": "i-006"
    },
    {
      "amount": 0,
      "cat": "불·그릴",
      "name": "목장갑·면장갑",
      "note": "",
      "order": 7,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "켤레",
      "id": "i-007"
    },
    {
      "amount": 0,
      "cat": "불·그릴",
      "name": "쿠킹호일",
      "note": "",
      "order": 8,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "롤",
      "id": "i-008"
    },
    {
      "amount": 0,
      "cat": "고기·메인",
      "name": "삼겹살",
      "note": "",
      "order": 9,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "kg",
      "id": "i-009"
    },
    {
      "amount": 0,
      "cat": "고기·메인",
      "name": "목살",
      "note": "",
      "order": 10,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "kg",
      "id": "i-010"
    },
    {
      "amount": 0,
      "cat": "고기·메인",
      "name": "소시지",
      "note": "",
      "order": 11,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "봉",
      "id": "i-011"
    },
    {
      "amount": 0,
      "cat": "고기·메인",
      "name": "새우",
      "note": "",
      "order": 12,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "팩",
      "id": "i-012"
    },
    {
      "amount": 0,
      "cat": "채소·곁들임",
      "name": "상추",
      "note": "",
      "order": 13,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "봉",
      "id": "i-013"
    },
    {
      "amount": 0,
      "cat": "채소·곁들임",
      "name": "마늘",
      "note": "",
      "order": 14,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "봉",
      "id": "i-014"
    },
    {
      "amount": 0,
      "cat": "채소·곁들임",
      "name": "고추",
      "note": "",
      "order": 15,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "봉",
      "id": "i-015"
    },
    {
      "amount": 0,
      "cat": "채소·곁들임",
      "name": "양파",
      "note": "",
      "order": 16,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "개",
      "id": "i-016"
    },
    {
      "amount": 0,
      "cat": "채소·곁들임",
      "name": "버섯",
      "note": "",
      "order": 17,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "팩",
      "id": "i-017"
    },
    {
      "amount": 0,
      "cat": "채소·곁들임",
      "name": "김치",
      "note": "",
      "order": 18,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "통",
      "id": "i-018"
    },
    {
      "amount": 0,
      "cat": "채소·곁들임",
      "name": "옥수수·고구마",
      "note": "호일 구이용",
      "order": 19,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "개",
      "id": "i-019"
    },
    {
      "amount": 0,
      "cat": "양념·소스",
      "name": "쌈장",
      "note": "",
      "order": 20,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "개",
      "id": "i-020"
    },
    {
      "amount": 0,
      "cat": "양념·소스",
      "name": "소금·후추",
      "note": "",
      "order": 21,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "개",
      "id": "i-021"
    },
    {
      "amount": 0,
      "cat": "양념·소스",
      "name": "참기름(기름장)",
      "note": "",
      "order": 22,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "병",
      "id": "i-022"
    },
    {
      "amount": 0,
      "cat": "식사",
      "name": "햇반",
      "note": "",
      "order": 23,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "개",
      "id": "i-023"
    },
    {
      "amount": 0,
      "cat": "식사",
      "name": "라면",
      "note": "마무리용",
      "order": 24,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "봉",
      "id": "i-024"
    },
    {
      "amount": 0,
      "cat": "음료",
      "name": "생수",
      "note": "",
      "order": 25,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "병",
      "id": "i-025"
    },
    {
      "amount": 0,
      "cat": "음료",
      "name": "음료수",
      "note": "",
      "order": 26,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "병",
      "id": "i-026"
    },
    {
      "amount": 0,
      "cat": "음료",
      "name": "맥주·주류",
      "note": "",
      "order": 27,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "캔",
      "id": "i-027"
    },
    {
      "amount": 0,
      "cat": "음료",
      "name": "얼음",
      "note": "",
      "order": 28,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "봉",
      "id": "i-028"
    },
    {
      "amount": 0,
      "cat": "일회용품·위생",
      "name": "종이접시",
      "note": "",
      "order": 29,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "팩",
      "id": "i-029"
    },
    {
      "amount": 0,
      "cat": "일회용품·위생",
      "name": "종이컵",
      "note": "",
      "order": 30,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "팩",
      "id": "i-030"
    },
    {
      "amount": 0,
      "cat": "일회용품·위생",
      "name": "수저·젓가락",
      "note": "",
      "order": 31,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "팩",
      "id": "i-031"
    },
    {
      "amount": 0,
      "cat": "일회용품·위생",
      "name": "키친타월",
      "note": "",
      "order": 32,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "롤",
      "id": "i-032"
    },
    {
      "amount": 0,
      "cat": "일회용품·위생",
      "name": "물티슈",
      "note": "",
      "order": 33,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "개",
      "id": "i-033"
    },
    {
      "amount": 0,
      "cat": "일회용품·위생",
      "name": "쓰레기봉투",
      "note": "",
      "order": 34,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "장",
      "id": "i-034"
    },
    {
      "amount": 0,
      "cat": "일회용품·위생",
      "name": "지퍼백",
      "note": "남은 음식 포장",
      "order": 35,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "개",
      "id": "i-035"
    },
    {
      "amount": 460000,
      "cat": "장비·기타",
      "name": "장소 대여비",
      "note": "",
      "order": 38,
      "owner": "김재은",
      "payer": "김재은",
      "qty": "1",
      "status": "구매 완료",
      "unit": "회",
      "id": "i-038"
    },
    {
      "amount": 0,
      "cat": "채소·곁들임",
      "createdAt": "2026-11-02T10:20:21.035Z",
      "name": "깻잎",
      "note": "",
      "order": 39,
      "owner": "",
      "payer": "",
      "qty": "",
      "status": "준비 전",
      "unit": "",
      "id": "i-mvz3yd9nv4b9r"
    }
  ],
  "menus": [],
  "paid": [],
  "meta": [
    {
      "id": "overview",
      "date": "12월 20일",
      "place": "건대입구 오프루프",
      "treasurer": "",
      "account": ""
    }
  ]
};

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** 공개 페이지(index.html)가 데이터를 읽을 때: 배포주소?action=all */
function doGet(e) {
  ensureSetup_();
  if (e && e.parameter && e.parameter.action === 'all') return json_(apiGetAll());
  try {
    return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('바베큐 파티 현황')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
  } catch (err) {
    return json_({ ok: true, message: '바베큐 파티 데이터 연결이 켜져 있어요.' });
  }
}

/** 공개 페이지가 저장/수정/삭제할 때 */
function doPost(e) {
  try {
    var w = JSON.parse(e.postData.contents);
    return json_(apiWrite(w));
  } catch (err) {
    return json_({ error: String(err && err.message || err) });
  }
}

// 연결된 데이터 시트: '바베큐 파티 현황 데이터'
var SHEET_ID = '1YRInVbrnurt5ScTmmMTgBVnBk1nINPlEctqt2eA2nsk';
function ss_() {
  var active = null;
  try { active = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) {}
  return active || SpreadsheetApp.openById(SHEET_ID);
}

function sheetFor_(col) {
  var name = TABS[col];
  if (!name) throw new Error('알 수 없는 항목: ' + col);
  var sh = ss_().getSheetByName(name);
  if (!sh) {
    sh = ss_().insertSheet(name);
    sh.getRange('A:Z').setNumberFormat('@');
    sh.getRange(1, 1, 1, HEADERS[col].length).setValues([HEADERS[col]]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function ensureSetup_() {
  var sh = sheetFor_('people');
  if (sh.getLastRow() > 1) return;
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (sheetFor_('people').getLastRow() > 1) return;
    Object.keys(SEED).forEach(function (col) {
      var rows = SEED[col] || [];
      if (!rows.length) { sheetFor_(col); return; }
      var s = sheetFor_(col), head = HEADERS[col];
      var values = rows.map(function (o) { return head.map(function (h) { var v = o[h]; return v == null ? '' : String(v); }); });
      s.getRange(2, 1, values.length, head.length).setValues(values);
    });
    CacheService.getScriptCache().remove(CACHE_KEY);
  } finally { lock.releaseLock(); }
}

function readCol_(col) {
  var vals = sheetFor_(col).getDataRange().getValues();
  if (vals.length < 2) return [];
  var head = vals[0].map(String), out = [];
  for (var r = 1; r < vals.length; r++) {
    var row = vals[r];
    if (!row[0]) continue;
    var o = {};
    head.forEach(function (h, i) {
      if (!h) return;
      var v = row[i];
      if (NUM_FIELDS[h]) v = Number(v) || 0;
      else if (BOOL_FIELDS[h]) v = v === true || String(v).toLowerCase() === 'true';
      else v = v == null ? '' : String(v);
      o[h] = v;
    });
    out.push(o);
  }
  return out;
}

function readAll_() {
  var o = {};
  Object.keys(TABS).forEach(function (c) { o[c] = readCol_(c); });
  return o;
}

/** 페이지가 처음 열릴 때와 주기적으로 부르는 함수 */
function apiGetAll() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get(CACHE_KEY);
  if (hit) return JSON.parse(hit);
  var all = readAll_();
  try { cache.put(CACHE_KEY, JSON.stringify(all), 60); } catch (e) {}
  return all;
}

/** 저장/수정/삭제: { op: 'set'|'update'|'delete', col, id, data } */
function apiWrite(w) {
  if (!w || !TABS[w.col]) throw new Error('잘못된 요청이에요');
  var id = String(w.id || '');
  if (!id) throw new Error('id가 없어요');
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = sheetFor_(w.col);
    var vals = sh.getDataRange().getValues();
    var head = vals[0].map(String);
    var rowIdx = -1;
    for (var r = 1; r < vals.length; r++) if (String(vals[r][0]) === id) { rowIdx = r; break; }
    if (w.op === 'delete') {
      if (rowIdx > 0) sh.deleteRow(rowIdx + 1);
    } else if (w.op === 'set' || w.op === 'update') {
      var data = w.data || {};
      Object.keys(data).forEach(function (k) {
        if (k && head.indexOf(k) < 0) { head.push(k); sh.getRange(1, head.length).setValue(k).setFontWeight('bold'); }
      });
      var doc = {};
      if (w.op === 'update') {
        if (rowIdx < 0) throw new Error('이미 지워진 항목이에요');
        head.forEach(function (h, i) { doc[h] = vals[rowIdx][i]; });
      }
      Object.keys(data).forEach(function (k) { doc[k] = data[k]; });
      doc.id = id;
      var row = head.map(function (h) { var v = doc[h]; return v == null ? '' : String(v); });
      if (rowIdx > 0) sh.getRange(rowIdx + 1, 1, 1, head.length).setValues([row]);
      else sh.appendRow(row);
    } else throw new Error('잘못된 요청이에요');
    SpreadsheetApp.flush();
    var all = readAll_();
    try { CacheService.getScriptCache().put(CACHE_KEY, JSON.stringify(all), 60); } catch (e) {}
    return all;
  } finally { lock.releaseLock(); }
}
