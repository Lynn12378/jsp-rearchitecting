# header.jsp 公開契約

> 原始資源：`/html/CM/header.jsp`

- 此資源以 JSP 靜態 include 使用；其 page imports、taglib 宣告、Java 區域變數、HTML、CSS 與 JavaScript 會在翻譯階段合併到呼叫頁。

## **`<%@ include file="/html/CM/header.jsp" %>`**

### 用途

- 初始化共通資源路徑、字元長度換算、登入環境傳遞、功能資安控制、EUDC 字型與浮水印。

### 輸入

- `file`: [String = `/html/CM/header.jsp`, 必填] - 靜態 include 的共通 JSP 路徑。
- `request`: [HttpServletRequest, JSP 隱含物件] - 提供目前 URL、請求屬性與 HTTP header。
  - `requestTimeHandleUUID`: [String, 選填] - 非空且 `window.utility.keepResponseTimeEndParameters` 存在時，於頁面 `load` 事件回報的回應時間追蹤識別。
  - `eBAF_loginPlatformInfo`: [String, 選填] - 傳給 `utility.keep_eBAF_parameter(...)` 的登入平台資訊。
  - `eBAF_loginSystemInfo`: [String, 選填] - 傳給 `utility.keep_eBAF_parameter(...)` 的登入系統資訊。
  - `eBAF_UserObject_Flag`: [String, 選填] - 傳給 `utility.keep_eBAF_parameter(...)` 的使用者物件旗標。
  - `platformDispatcher`: [String, 選填] - 傳給 `utility.keep_eBAF_parameter(...)` 的平台服務入口。
  - `clientheaderhost`: [HTTP header, 選填] - 非空且包含 `w3.cathaylife.com.tw` 時，啟用外部 EUDC 字型路徑查詢。
- `session`: [HttpSession, JSP 隱含物件] - 提供浮水印使用者資料。
  - `$Data.$coreSys$UserObject`: [UserObject, 選填] - 浮水印識別來源；先取 `CATHAY_NO`，只有該值為 `null` 時才改取 `EmpName`。
- `pageContext`: [PageContext, JSP 隱含物件] - 保存本 include 推導的頁面範圍屬性。
- `HttpResponseContext(request).getBeanName()`: [String, 選填] - 功能識別的優先來源；非空白時移除全部底線。
- `request.getRequestURL()`: [String] - bean 名稱無法形成識別時的替代來源；依 `/` 切割後取第一個包含 `.jsp` 的片段，再移除其中全部 `.jsp` 字樣。
- `ConfigManager["ebaf.JSP_CHAR_LENGTH"]`: [String = `"2"`] - 非單位元組字元的長度換算倍數；僅接受不含正負號且大於零的十進位整數字串。
- `ZZ_Z0Z001.getFuncInfo(headerRequestFuncId)`: [List<Map>, 選填] - 功能設定查詢結果；只讀取第一筆。
  - `IS_WATERMARK`: [String] - 嚴格等於 `"Y"` 時啟用浮水印。
  - `PD_CTRL`: [String] - 嚴格等於 `"Y"` 時啟用頁面資料保護控制。
- `FieldOptionList.getName("PT", "STATIC_FILE_URL", "INTERNET_FONT")`: [String, 選填] - 指定入口主機的外部 EUDC 字型根路徑。
- `window.utility`: [Object, 選填] - 既有共通前端工具。
  - `keepResponseTimeEndParameters(uuid)`: [Function, 選填] - 保存回應時間結束參數。
  - `keep_eBAF_parameter(options)`: [Function, 選填] - 保存非空的 eBAF 登入與平台參數。
- `WatermarkPlus.Watermark`: [Constructor, 條件式必需] - `IS_WATERMARK="Y"` 時建立浮水印的外部建構子，由 `watermark-js-plus.js` 提供。

### 輸出

- `htmlBase`: [String] - `<CXL:csCommon>` 建立的共通 HTML 資源基準位置。
- `cssBase`: [String] - `<CXL:csCommon>` 建立的共通樣式資源基準位置。
- `imageBase`: [String] - `<CXL:csCommon>` 建立的共通影像資源基準位置。
- `dispatcher`: [String] - `<CXL:csCommon>` 建立的共通服務入口。
- `window.charCountsByte`: [Integer] - 有效設定值轉成十進位整數；設定不是正整數字串時為 `2`。
- `pageContext.headerRequestFuncId`: [String, 選擇性] - 功能識別非空白且功能查詢至少有一筆時才設定。
- `pageContext.isWaterMark`: [Boolean, 選擇性] - 功能查詢成功時，表示首筆設定的 `IS_WATERMARK` 是否為 `"Y"`。
- `pageContext.watermark_datetime`: [String, 選擇性] - include 執行當下以 `yyyy-MM-dd HH:mm:ss` 產生的時間文字；使用者資料處理沒有發生例外時設定。
- `pageContext.watermark_escapeHtml_txt`: [String, 選擇性] - 使用者識別經 `StringEscapeUtils.escapeHtml(...)` 處理的文字。
- `pageContext.watermark_txt`: [String, 選擇性] - 未經 HTML 編碼的使用者識別；找不到使用者資料時為空字串。
- `pageContext.internetFontUrl`: [String, 選擇性] - `clientheaderhost` 符合指定網域且設定查詢成功時的外部字型根路徑。
- `window.fpcsAlertMsgs`: [Object, 條件式] - 資料保護控制使用的列印、複製、剪下、全選與儲存警示文字；只有 `PD_CTRL="Y"` 且既有值不是物件時建立。
- `window.fpcsStopEventActions(event)`: [Function(Boolean), 條件式] - 阻止事件並顯示對應警示，固定回傳 `false`。
- `window.fpcsDoAddEventListener(element, eventName, handler)`: [Function(undefined), 條件式] - 以捕捉階段 `addEventListener`、`attachEvent` 或 `on...` 屬性登錄事件。
- `root_wm.watermark_funcIds`: [Array<String>, 條件式] - 同源浮水印根視窗所記錄的功能識別清單。
- `root_wm.watermark_root`: [Window, 條件式] - 同源 frame 架構選用的浮水印根視窗。
- `renderedContent`: [HTML/CSS/JavaScript] - taglib 宣告後的共通腳本、資料保護列印樣式、EUDC `@font-face` 與浮水印初始化程式。

### 對外功能

- 呼叫 `<CXL:csCommon trace="false" .../>` 建立部署環境相關的共通資源與服務位置。
- 在 `window.utility` 可用時，登錄回應時間追蹤，並傳遞所有非空的 eBAF 登入或平台參數。
- 依 bean 名稱或 JSP URL 推導功能識別，再查詢首筆功能設定。
- `PD_CTRL="Y"` 時，於頁面載入後控制右鍵選單、列印、剪下及 Ctrl+A／X／S／P；一般 `copy` 事件不會被阻止，而會觸發複製稽核。
- 複製稽核會取得目前頁面或 `textarea` 的選取文字、合併連續空白、對相同原文進行 `60` 秒去重，並將超過 `5000` 字元的內容截為前 `4997` 字元加上 `...`。
- 複製稽核只手動編碼 `%`、`#`、`&`、空白、`+`、`?`、`=`，再把內容、功能識別、原始正規化文字長度與時間戳組成 `/ZZWeb/servlet/HttpDispatcher/ZZM0_0105/ctrlMsavelog` 的影像 URL。
- `IS_WATERMARK="Y"` 時，選擇同源最上層既有浮水印根視窗或目前視窗，並在 `load` 事件將功能識別加入清單及建立浮水印。
- 浮水印內容為使用者識別與 include 執行時間，採多行文字、`190 × 85`、旋轉 `17` 度、透明度 `0.07`、網格排列，並啟用 DOM 變更監測與保護。
- 宣告 `EUDC` 字型；符合指定入口主機時先列出集中設定的 `eudc.woff2` 與 `eudc.ttf`，之後仍保留目前應用程式 `/hanlinks` 下的兩個後備來源。

### 副作用

- 靜態 include 會把 imports、taglib、JSP 區域變數、樣式與腳本直接合併至呼叫頁；重複 include 可能造成變數、函式或輸出衝突。
- 無條件載入 `${htmlBase}/CM/js/ui/watermark-js-plus.js`；啟用浮水印且根視窗尚無 `watermark` 時，還會向根視窗的 `<head>` 再附加相同來源的 `<script>`。
- 資料保護控制會阻止右鍵、列印事件、剪下及 Ctrl+A／X／S／P，顯示阻擋訊息，並在列印媒體中隱藏 `body` 直屬內容、改顯示資安政策文字。
- 複製稽核建立未附加至 DOM 的 `<img>` 並設定 `src`；瀏覽器可因此向稽核端點送出包含使用者選取內容的 GET 請求。URL 只做部分字元替換，不是完整的 URI 元件編碼。
- 同源且目前 `window.name` 為 `mainFrame` 時，會清空最上層 `watermark_funcIds` 並把 `watermark_root` 改為目前視窗。
- 浮水印會向根視窗新增 DOM、監控器與功能識別；每個 include 實例在載入時都可能再次建立 `WatermarkPlus.Watermark`。
- 卸載事件拼為 `berforeunload`；`addEventListener` 分支還錯誤登錄載入處理函式，`attachEvent` 分支則把清理處理函式登錄到 `onload`。即使清理函式執行，也會把 `splice(...)` 回傳的已移除項目重新指定給完整清單，因此功能識別清理不可靠。
- 功能設定、使用者或字型查詢例外會呼叫 `printStackTrace()`；同源與浮水印前端例外通常只寫入主控台後繼續執行。
