---
name: jsp-to-vue
description: 將 Legacy JSP 翻新為 Vue SFC
argument-hint: jsp=<JSP 檔案路徑>
disable-model-invocation: true
user-invocable: true
---

# Legacy Code Modernization Skill: JSP to Vue SFC

## Goals
**Primary**: 完整保留來源 JSP(*Legacy JSP*) 的頁面規格，並重建為符合目標開發規範之現代化前端元件(*Vue SFC*)
**Secondary**: 確保翻新結果具備良好可讀性與可維護性

---

## Constraints

### Inputs
**來源 JSP**: 使用者指定的 `jsp` - 頁面規格的唯一依據
**既有公開契約**: `./references/legacy/**/*.md` - 既有專案共用能力(*Shared Capability*)之公開契約(*Public Contract*)說明書
**目標開發規範**: `./references/target/**/*.md` - 目標專案之技術棧、程式碼風格、架構設計原則
**Forbidden**: 禁止存取上述宣告以外之任何檔案或資源

### Processing Boundary
**Frontend-Backend Separation**: 伺服器端耦合邏輯拆分為呈現邏輯(*Presentation Logic*)與業務邏輯(*Business Logic*)，前端僅實作前者，並透過 HTTP Client 消費後者；**Forbidden**: 前端實作伺服器端之業務邏輯(ex: 資料庫存取、檔案系統操作、第三方服務整合)
**External Capability Migration**: 既有共用能力須依目標開發規範，選用或建立對應之現代實作；**Forbidden**: 重新實作共用能力之內部邏輯或編造既有公開契約未定義之功能
**Ambiguity Handling**: 語意不明、技術缺口、或範圍外依賴須明確標記；**Forbidden**: 推論不明業務規格之意圖或引用目標開發規範以外之技術能力
**Forbidden**: 自行修改既有業務邏輯、UI/UX 設計(視覺樣式、版面配置)、頁面流程、資料顯示、使用者輸入、互動與頁面流程等頁面規格

### Outputs
**Component File**: `src/views/<ModuleCode>/<ComponentName>.vue` - 目標前端元件檔案
**Routing Registration**: `src/router/router.js` - 僅新增目標前端元件之路由註冊；**Forbidden**: 修改既有路由
**Forbidden**: 產出上述檔案以外之任何檔案或資源

---

## Rules

### R1: Meta Extraction
**Required**: 從來源 JSP 檔名依序解析以下資訊(ex: `EXA10001.jsp`、`EXA10001_detail.jsp`):
- **SystemCode**: 檔名第 1-2 位 (ex: `EX`)
- **ModuleCode**: 檔名第 3-4 位(ex: `A1`)
- **SubCode**: 檔名第 5-8 位(ex: `0001`)
- **Suffix**: 以`_`連接的附加資訊(ex: `_detail`、`_edit`、`_list`)

**FeatureCode**: `<SystemCode><ModuleCode><SubCode>`(ex: `EXA10001`)
**ComponentName**: `<FeatureCode>(<Suffix>)?`(ex: `EXA10001`、`EXA10001Detail`)

### R2: HTTP Client
**Server-Side Data**:
- **Rationale**: 此類語法之運算執行於伺服器渲染階段，前端無從得知其是否耦合後端業務邏輯
- **Required**: Scriptlet、Expression、Expression Language(ex: `<% %>`、`<%= %>`、`${}`) → 元件掛載時呼叫單一 HTTP Client 取得所有伺服器注入資料
- **Over-approximation**: session 相關語法(ex: `${param.xxx}`、`${sessionScope.xxx}`) 一律視為伺服器端資料
- **Exception**: `htmlBase`、`cssBase`、`imageBase`、`dispatcher` 為既有路徑變數，非屬伺服器端業務資料
- **Forbidden**: 推論僅為前端狀態管理或本地快取

**Client-Side Request**:
- **Required**: 既有請求語法(ex: `<form action>`、Ajax、jQuery) → 依原互動時機個別發起 HTTP Client 呼叫
- **Over-approximation**: `<form action>` 一律歸類為 Client-Side Request
- **Forbidden**: 推論為導向頁面行為

**Contract**: HTTP Client 呼叫須遵循以下結構:
- **Method**: 預設 `POST`
- **Endpoint**: 相對路徑(`<FeatureCode>/<action>`)；**Forbidden**: 保留 `<%=dispatcher%>` 前綴
  - **action**: 執行動作(ex: `query`、`insert`)，預設為 `prompt`；**Forbidden**: 保留 `do` 前綴
- **Request Schema**: 依實際萃取之參數列出
- **Response Schema**: 依實際萃取之參數列出(正規化為開發規範之回應格式)

### R3: Page Interaction
**Same-Origin**:
- **Rationale**: 目標路徑符合 *ComponentName* 特徵，為同源頁面
- **Navigation**: `<a href>`、`window.location`、`<jsp:forward>` → 內部頁面跳轉
- **Window**: `window.open` → 使用彈窗元件開啟目標頁面元件
- **Embed**: `<iframe>`、`<jsp:include>` → 內嵌目標頁面元件
- **Contract**:
  - **Target**: `<ComponentName>`:
      - `/prompt` 視為主頁面(ex: `EXA20001/prompt`→ `EXA20001`)
      - 其餘 Suffix 為內頁(ex: `EXA2_0002/detail` → `EXA20002Detail`)
  - **Parameters**: 依實際萃取之參數列出

**Cross-Origin**:
- **Rationale**: 目標路徑不符合 *ComponentName* 特徵或無法解析，為跨源頁面
- **Required**: 維持原生行為，並保留原始參數與路徑

### R4: Shared Capability
**Rationale**: 來源 JSP 對共用能力僅具消費關係，無從得知其內部實作
**Required**: 非本地宣告之變數、方法、類別、Custom Tag(ex: `<my:xxx>`) → 查閱既有公開契約，選型目標專案中候選共用能力:
  - **共用元件**: UI 庫
  - **共用函式**: 共用工具函式庫
**Exception**: 語言與瀏覽器原生語法、公開已知第三方套件之標準用法，其行為已具業界共識，無須查閱既有公開契約
**Conservative Matching**: 依輸入、輸出、功能與副作用逐一比對；等價性未獲充分確認者，不逕行實作
**Forbidden**: 僅憑輸入輸出型別相符，逕行判定功能等價

### R5: Uncertainty Handling
**Unknown Syntax**:
- **Required**: 無法確認功能之語法 → `// TODO: UNKNOWN_SYNTAX: <原始語法>`
- **Format**: `<原始語法>` 須為完整未經修改之原始碼片段，不得摘要或改寫
- **Forbidden**: 臆測業務意圖並逕行實作

**Technical Gap**:
- **Required**: 意圖明確但目標開發規範未提供對應能力之功能 → 標記 `// TODO: TECHNICAL_GAP: <功能描述>`
- **Format**: `<功能描述>` 僅使用繁體中文陳述功能本身，不得夾帶既有語法或暗示實作方式
- **Scope**: 以缺口所在之最小單位標記，不得因局部缺口放棄整體技術結構
- **Forbidden**: 逕行實作或引用目標開發規範以外之技術能力

**Pending Conversion**:
- **Required**: 依賴其他 JSP 翻新結果之元件或路由 → 標記 `// TODO: PENDING_CONVERSION: <ComponentName>`
- **Forbidden**: 逕行產出依賴之 JSP 對應檔案，逾越單一 JSP 之翻新範圍

**Over-approximation**:
- **Required**: 套用 Over-approximation 決策之語法 → 標記 `// TODO: OVER_APPROXIMATION: <複查問句>`
- **Format**: `<複查問句>` 須具體指出待複查之判斷依據，供人工直接複查

**Stub**:
- **Rationale**: 原始碼註解導致編譯錯誤或無法解析
- **Required**: 原始語法為宣告，或其回傳值/輸出結果被其他位置引用時，依下列型態提供 Stub:
  - **變數**: `___<PLACEHOLDER>___`
  - **方法**: `const functionName = (...args) => {}`
  - **類別**: `class ClassName {}`
  - **元件**: `<!-- <ComponentName /> -->`
- **Naming**: 依原始語法之呼叫名稱與參數直接沿用，不得重新命名或變更簽章
- **Position**: TODO 標記置於對應 Stub 之前一行
- **Forbidden**: Stub 內容夾帶臆測之業務邏輯

---

## Workflow

### Phase 1: Analyze & Extract
**Step 1**: 解析來源 JSP 檔名，取得 FeatureCode、ComponentName 等 Meta 資訊
**Step 2**: 掃描來源 JSP 全文，萃取以下項目並判斷是否非本地宣告:
- **Variable**: 變數、常數、屬性
- **Function**: 方法、函式、建構子
- **Class**: 類別、介面
- **Custom Tag**: 自訂 JSP 標籤
**Step 3**: 依引用語法(JS Import、JSP Include、Custom Tag) 查閱既有公開契約(索引: `./references/legacy/index.md`)，取得對應能力之定義內容
**Step 4**: 尚未取得對應能力之語法，標記為 Unknown Syntax
**Step 5**: 掃描來源 JSP 全文，萃取頁面規格(UI/UX 設計、資料顯示、使用者輸入、互動與頁面流程、業務邏輯)

### Phase 2: Plan & Implement
**Step 1**: 查閱目標開發規範(索引: `./references/target/index.md`)，取得元件結構、狀態管理、樣式撰寫等相關慣例
**Step 2**: 綜合頁面規格、能力定義與開發規範慣例，完成設計決策:
  - **UI/UX**: UI 元件選型、版面配置、互動流程
  - **Data**: 前端狀態管理、HTTP Client 請求後端資料、資料格式轉換
  - **Routing**: 元件路由註冊、頁面識別碼傳遞
  - **Form Validation**: 表單驗證規則與錯誤訊息
  - **Naming**: 檔案、變數、元件、路由命名
  - **Shared Capability Selection**: 共用能力選型
  - **Technical Gap**: 技術缺口標記
**Step 3**: 依設計決策，產出目標元件檔案並註冊路由

---

## Output Format
**Structure**: 依序包含頁面規格摘要、設計決策摘要、目標元件檔案、待確認清單
**頁面規格摘要**: 以清單呈現，逐項列出萃取結果(ex: `業務邏輯: 訂單查詢`)
**設計決策摘要**: 以表格呈現，規格項目與決策結果一一對應(ex: `| 規格項目 | 決策 |`)
**語言**: 繁體中文
**Forbidden**: 回應包含完整程式碼片段或推論過程

---

## Examples

### E1: HTTP Client
**AS-IS**:
```jsp
<!-- EXA10001.jsp -->
<%
  User user = (User) session.getAttribute("user");
%>
<c:if test="${hasAuth}">
    <span><%= user.username %></span>
</c:if>

<form action="<%=dispatcher%>/EXA1_0001/doEdit" method="post">
  <input name="email" />
  <button type="submit">更新</button>
</form>
```

**TO-BE**:
```vue
<script setup>
const $cathayAxios = inject('$cathayAxios')

// CORRECT: Scriptlet/EL 為伺服器端資料，元件掛載時統一以單一 HTTP Client 取得
// TODO: OVER_APPROXIMATION: 待複查伺服器資料注入來源是否源於前端狀態
const hasAuth = ref(false)
const user = ref({})
onMounted(async () => {
  const res = await $cathayAxios.post('exa10001/prompt', {})
  if (res.returnCode !== 0) return
  hasAuth.value = res.data.hasAuth
  user.value = res.data.user
})

// CORRECT: Form action 為既有請求語法，依原互動時機個別發起 HTTP Client
const updateProfile = async () => {
  const res = await $cathayAxios.post('exa10001/edit', { email: email.value })
  if (res.returnCode !== 0) return
}
</script>
```

```js
// INCORRECT: 將 EL(${hasAuth}) 誤判為可經由路由 state 取得，而非伺服器端資料
const hasAuth = history.state.hasAuth

// INCORRECT: 將 Scriptlet 誤判為前端可自行維護之狀態，未透過 HTTP Client 取得
const user = ref({ username: '訪客' })

// INCORRECT: 將 Form action 誤判為單純換頁，未發起 HTTP Client 請求
const updateProfile = () => { router.push({ name: 'EXA10001' }) }
```

### E2: Page Interaction
**AS-IS**:
```jsp
<!-- EXA20001.jsp -->
<a href="AT010800">前往帳戶設定</a>
<a href="https://partner.example.com/portal">前往合作夥伴入口</a>
<button onclick="window.open('EXA20002/detail?id=123')">開啟明細</button>
```

**TO-BE**:
```vue
<template>
  <!-- CORRECT: AT010800 符合 ComponentName 特徵，為 Same-Origin，收斂為內部頁面跳轉 -->
  <router-link :to="{ name: 'AT010800' }">前往帳戶設定</router-link>

  <!-- CORRECT: partner.example.com 不符合 ComponentName 特徵，為 Cross-Origin，維持原生連結 -->
  <a href="https://partner.example.com/portal">前往合作夥伴入口</a>

  <!-- CORRECT: EXA20002 符合 ComponentName 特徵，為 Same-Origin，收斂為 Dialog 元件並傳遞參數 -->
  <q-btn label="開啟明細" @click="showDetail = true" />
  <q-dialog v-model="showDetail">
    <!-- TODO: PENDING_CONVERSION: EXA20002Detail -->
    <!-- <EXA20002Detail :id="123" /> -->
  </q-dialog>
</template>
```

```js
// INCORRECT: 將 Cross-Origin 連結誤判為內部路由
router.push({ name: 'PartnerPortal' })

// INCORRECT: 將 Same-Origin 之 window.open 誤判為需維持原生開窗行為
window.open('EXA20002/detail?id=123')
```

### E3: Shared Capability
**AS-IS**:
```js
function(record, value) {
  if (record.keyValue == undefined) {
    return "-";
  }
  if (CSRUtil.isSuccess(resp)) {
    return Date.toROC(value);
  }
  return value;
}
```

**TO-BE**:
```js
// CORRECT: 空值判斷為純前端邏輯，直接轉譯
const formatDate = (record, value) => {
  if (record.keyValue === undefined) {
    return '-'
  }
  // CORRECT: CSRUtil.isSuccess 經查閱既有公開契約，確認與 resp.returnCode === 0 功能等價
  if (resp.returnCode === 0) {
    return toROC(value)
  }
  return value
}

// TODO: TECHNICAL_GAP: 將西元日期轉換為民國日期
const toROC = (value) => {}
```

```js
// INCORRECT: 將 Date.toROC 誤判為 JS 原生方法，未查閱既有公開契約逕行沿用
const formatDate = (record, value) => {
  if (record.keyValue === undefined) return '-'
  if (resp.returnCode === 0) return Date.toROC(value)
  return value
}

// INCORRECT: 重新實作 Date.toROC 內部細節
const toROC = (value) => {
  const year = parseInt(value.substring(0, 4)) - 1911
  return year + value.substring(4)
}

// INCORRECT: 因無法確認 CSRUtil.isSuccess 是否等價，逕行另編邏輯判斷成功與否
if (resp.status === 200 && resp.data) {
  return toROC(value)
}
```

### E4: Uncertainty Handling
**AS-IS**:
```js
// Unknown Syntax 情境：完全陌生的呼叫，無任何線索
LegacyFlowEngine.dispatch(ctx, "STEP_42");

// Technical Gap 情境：意圖明確（判斷是否為假日），但目標開發規範無對應能力
Date.isHoliday(selectedDate);
```

**TO-BE**:
```js
// CORRECT: LegacyFlowEngine.dispatch 查無公開契約登記，且無法從呼叫本身判讀功能，標記 Unknown Syntax
// TODO: UNKNOWN_SYNTAX: LegacyFlowEngine.dispatch(ctx, "STEP_42")

// CORRECT: Date.isHoliday 經查閱既有公開契約，目標開發規範查無對應能力，標記 Technical Gap
// TODO: TECHNICAL_GAP: 判斷指定日期是否為假日
const isHoliday = (selectedDate) => {}
```

```js
// INCORRECT: 臆測 LegacyFlowEngine.dispatch 為流程跳轉，逕行實作對應邏輯
const dispatch = (ctx, step) => {
  if (step === 'STEP_42') {
    router.push({ name: 'NextStep' })
  }
}

// INCORRECT: 摘要或改寫原始語法，未保留完整呼叫內容
// TODO: UNKNOWN_SYNTAX: dispatch 相關邏輯

// INCORRECT: Technical Gap 之功能描述夾帶既有語法
// TODO: TECHNICAL_GAP: Date.isHoliday 邏輯待實作
```

---

## Evaluation Checklist

執行完成後，自我檢核以下項目：

- [ ] **頁面規格完整保留**
  - [ ] 來源 JSP 頁面規格所有項目，皆有對應設計決策或明確標記
  - [ ] 未臆測來源 JSP 未涵蓋之頁面規格
  - [ ] 僅產出單一目標元件檔案，並完成路由註冊
  - [ ] 未修改既有路由

- [ ] **開發規範一致性**
  - [ ] HTTP Client 呼叫符合 [HTTP Client 規範](./references/target/http-client.md) 之引用方式與回應格式
  - [ ] 狀態管理符合 [狀態管理規範](./references/target/state-management.md) 之使用準則
  - [ ] 路由註冊符合 [路由註冊規範](./references/target/route-entry.md) 之格式
  - [ ] 表單驗證符合 [表單驗證規範](./references/target/form-schema.md)，皆以 VeeValidate + Yup 實作
  - [ ] UI 元件符合 [Quasar 元件規範](./references/target/quasar-usage.md) 之對照表與 slot 限制
  - [ ] 樣式撰寫符合 [樣式規範](./references/target/style-rule.md) 之優先序與 scoped 規則
  - [ ] 命名符合 [命名規範](./references/target/naming-rule.md)

- [ ] **業務邏輯歸屬**
  - [ ] 伺服器端耦合邏輯已依規則拆分為呈現邏輯與業務邏輯
  - [ ] 非本地宣告呼叫皆已查閱既有公開契約，未重新實作共用能力之內部邏輯
  - [ ] 語意不明、技術缺口、待轉換、過近似判準項目皆已明確標記
  - [ ] 因標記導致結構缺口者，皆已提供對應 Stub

- [ ] **程式碼品質**
  - [ ] 無任何語法錯誤，可正確編譯與執行