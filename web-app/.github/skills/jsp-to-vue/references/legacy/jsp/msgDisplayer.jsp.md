# msgDisplayer.jsp 公開契約

> 原始資源：`/html/CM/msgDisplayer.jsp`

- 此資源以 JSP 靜態 include 使用；其 Java 區域變數、輸出腳本、全域物件與 `document.onclick` 指派會合併到呼叫頁。

## **`<%@ include file="/html/CM/msgDisplayer.jsp" %>`**

### 用途

- 將本次 HTTP 回應的 `ReturnMessage` 訊息鏈序列化為前端固定欄位陣列，並建立通知區查找、清除與訊息呈現介面。

### 輸入

- `file`: [String = `/html/CM/msgDisplayer.jsp`, 必填] - 靜態 include 的共通 JSP 路徑。
- `request`: [HttpServletRequest, JSP 隱含物件] - 用來建立 `HttpResponseContext`。
- `HttpResponseContext.getOutputData(IConstantMap.ErrMsg)`: [ReturnMessage, 選填] - 本次作業的訊息鏈；回傳值不是 `ReturnMessage` 或為 `null` 時，改用長度為零的 `ReturnMessage`。
- `ReturnMessage[]`: [游標式訊息鏈] - 由 `hasNext()` 與 `next()` 逐筆讀取。
  - `displayMsgDescs`: [String = `""`] - 一般顯示訊息；伺服器端 CRLF、LF 或 CR 先換成 `<br>`，輸出到前端陣列時再不分大小寫換成換行字元。
  - `msgid`: [String = `""`] - 錯誤編號；採用與 `displayMsgDescs` 相同的換行轉換。
  - `sysid`: [String = `""`] - 系統或程式識別；`null` 時轉為空字串。
  - `type`: [String = `""`] - 訊息類型；`null` 時轉為空字串，本檔不依此欄位分流。
  - `url`: [String = `""`] - 訊息關聯位置；`null` 時轉為空字串，本檔不讀取此欄位。
  - `returnCode`: [String] - 由回傳代碼與空字串串接後得到的文字值。
  - `displayException`: [String = `""`] - 例外原因；伺服器端換行轉成 `<br>`，但輸出到前端陣列時不會轉回換行字元。
- `top.frames`、`parent.frames`: [Window frames] - 既有共通通知區的 frame 結構。

### 輸出

- `window.msgs`: [Array<Array<String>>] - 每筆訊息固定為七欄，欄位位置請參閱[代碼對照表](#代碼對照表)；原始碼未以 `var`、`let` 或 `const` 宣告，因此在非嚴格模式成為全域屬性。
- `window.msgDisplayer`: [Object] - 通知 frame 整合物件。
  - `getBottomFrame`: [Function(): Window | Frame | undefined] - 查找共通通知 frame。
  - `clearBottomMsg`: [Function(): undefined] - 清除共通通知訊息。
- `window.getMsgBoard`: [Function(): Any] - 取得通知 frame 的 `cathay_common_msgBoard`。
- `window.alertMessages`: [Function(): undefined] - 彙整並呈現錯誤或例外訊息。
- `window.displayMessage`: [Function(): undefined] - 將第一筆訊息同步到通知區，再執行錯誤或例外呈現。
- `document.onclick`: [Function(Event): undefined] - include 直接指定的通知清除處理器。
- `renderedContent`: [JavaScript] - 由目前訊息鏈內容展開的前端陣列與上述介面實作。

### 對外功能

- 取得 `IConstantMap.ErrMsg`，並把每筆訊息序列化成前端七欄陣列。
- 建立適用於 `top` 或 `parent` 下之 `leftFrame.bottomFrame` 與直接 `bottomFrame` 的舊式通知區整合介面。
- 在頁面控制項點擊時，依目標 `type` 嘗試清除既有通知。

### 副作用

- 反覆呼叫原始 `ReturnMessage.hasNext()` 與 `next()`，會推進其游標狀態。
- 直接建立或覆寫全域 `msgs`、`msgDisplayer`、`getMsgBoard`、`alertMessages` 與 `displayMessage`。
- 直接覆寫 `document.onclick`，取代呼叫頁先前透過同一屬性設定的處理器。
- 點擊判斷採用 `'button,submit'.indexOf(target.type) != -1`，並非精確比對兩個代碼；除了 `button` 與 `submit`，任何恰好是該字串子字串的非標準 `type` 也會觸發清除。
- 七個欄位均直接插入雙引號 JavaScript 字串，只處理特定換行；若上游文字含未轉義的雙引號、反斜線或其他控制字元，可能破壞腳本語法或形成指令碼注入。
- 點擊處理與通知清除發生的例外會被靜默忽略。

## **`msgDisplayer.getBottomFrame()`**

### 用途

- 依既定 frame 優先順序尋找共通頁尾通知區。

### 輸入

- 無

### 輸出

- `return`: [Window | Frame | undefined] - 依序回傳第一個存在的 `top.leftFrame.bottomFrame`、`parent.leftFrame.bottomFrame`、`top.bottomFrame` 或 `parent.bottomFrame`；均不存在時回傳 `undefined`。

### 對外功能

- 同時相容通知區位於 `leftFrame` 內或直接位於上層 frame 的兩種舊式版面結構。
- 函式本身不攔截跨來源 frame 存取例外；直接呼叫時，瀏覽器的同源政策例外會傳給呼叫端。

### 副作用

- 無

## **`msgDisplayer.clearBottomMsg()`**

### 用途

- 在可用的共通通知 frame 中呼叫既有 `clearNotifyMsg()`。

### 輸入

- 無

### 輸出

- `return`: [undefined] - 不回報是否找到通知區或是否完成清除。

### 對外功能

- 先呼叫 `this.getBottomFrame()`；存在 `contentWindow` 時從該物件取出 `clearNotifyMsg`，否則直接從 frame 物件取出。
- 只有取得值的型別是 `function` 時才呼叫，且以沒有接收者的函式形式執行。

### 副作用

- 可能清除共通通知區目前顯示的訊息。
- frame 查找、跨來源存取或通知函式執行的所有例外均被靜默忽略。

## **`getMsgBoard()`**

### 用途

- 取得共通通知 frame 對外提供的 `cathay_common_msgBoard` 物件。

### 輸入

- 無

### 輸出

- `return`: [Any | undefined] - 找到通知 frame 時，優先回傳 `bottomFrame.contentWindow.cathay_common_msgBoard`，否則回傳 `bottomFrame.cathay_common_msgBoard`；找不到 frame 時回傳 `undefined`。

### 對外功能

- 保留讓其他 JSP 或腳本存取舊式共通訊息板的全域介面；本檔內部不呼叫此函式。
- 函式本身不攔截 frame 查找或跨來源存取例外。

### 副作用

- 無

## **`alertMessages()`**

### 用途

- 將全域 `msgs` 中需要使用者注意的業務錯誤與技術例外彙整成一段訊息並顯示。

### 輸入

- `window.msgs`: [Array<Array<String>>] - include 建立的七欄訊息陣列；欄位位置與回傳代碼意義請參閱[代碼對照表](#代碼對照表)。
- `window.WIUtil`: [Object, 選填] - 共用訊息元件提供者。
  - `displayMessage({ msg })`: [Function, 條件式] - `WIUtil` 與 `window.jQuery` 均已定義時使用。
- `window.jQuery`: [Any, 選填] - 僅用來判斷共用訊息元件的相依環境是否存在。
- `window.alert`: [Function(String)] - 共用訊息元件不可用時的後備顯示介面。

### 輸出

- `return`: [undefined] - 不回傳彙整文字或顯示結果。

### 對外功能

- `displayException` 為空時，只將 `returnCode` 不是 `"0"` 且不是 `"99"` 的項目加入警示；內容包含一般顯示訊息，並在 `msgid` 非空時附加錯誤編號。
- `displayException` 非空時，加入例外原因與程式識別；此分支不依 `returnCode` 過濾。
- 彙整文字非空且 `WIUtil`、jQuery 均存在時呼叫 `WIUtil.displayMessage({ msg: alertMsg })`，否則呼叫瀏覽器 `alert(alertMsg)`。

### 副作用

- 可能開啟共用訊息元件或瀏覽器警示對話框。
- 不攔截 `WIUtil.displayMessage(...)` 或 `alert(...)` 發生的例外。

## **`displayMessage()`**

### 用途

- 將第一筆回應訊息同步到共通通知區，並接續呈現全部需要注意的錯誤與例外。

### 輸入

- `window.msgs`: [Array<Array<String>>] - include 建立的七欄訊息陣列；通知區只使用第一筆的 `returnCode` 與 `displayMsgDescs`。
- `bottomFrame.txHasRollbackPage`: [Any, 選填] - 交易回復頁旗標；truthy 時略過本次所有通知與警示。
- `bottomFrame.showNotifyMsg`: [Function(Object), 選填] - 共通通知區的訊息同步函式。
  - `options.returnCode`: [String] - `msgs[0][5]` 的回傳代碼。
  - `options.returnMessage`: [String] - `msgs[0][0]` 的一般顯示訊息。

### 輸出

- `return`: [undefined] - 不回報通知區或警示顯示結果；交易回復旗標成立時亦直接回傳 `undefined`。

### 對外功能

- 查找共通通知 frame；若其 `contentWindow` 存在，從 `contentWindow` 讀取旗標與函式，否則直接從 frame 讀取。
- `txHasRollbackPage` 為 truthy 時將其設為 `null` 並立即結束，因此不呼叫 `showNotifyMsg(...)`，也不執行 `alertMessages()`。
- 沒有交易回復旗標且 `showNotifyMsg` 是函式時，只傳送 `msgs[0]`；不會逐筆同步其餘訊息。
- 通知區整合區塊結束後呼叫 `alertMessages()`，讓全部錯誤與例外依其公開契約顯示。

### 副作用

- 可能將 `bottomFrame.txHasRollbackPage` 重設為 `null`。
- 可能更新共通通知區，並透過 `alertMessages()` 顯示共用訊息元件或瀏覽器警示。
- frame 查找、跨來源存取、空 `msgs` 第一筆讀取或 `showNotifyMsg(...)` 執行例外均被靜默忽略；發生此類例外後仍會執行 `alertMessages()`，除非先因交易回復旗標直接結束。

## 代碼對照表

- `msgs[index]` 欄位位置
  - `0` — `displayMsgDescs`: 一般顯示訊息；前端值中的 `<br>` 已轉回換行字元。
  - `1` — `msgid`: 錯誤編號；前端值中的 `<br>` 已轉回換行字元。
  - `2` — `sysid`: 系統或程式識別。
  - `3` — `type`: 訊息類型；本檔不依此欄位分流。
  - `4` — `url`: 關聯位置；本檔不讀取此欄位。
  - `5` — `returnCode`: 回傳代碼。
  - `6` — `displayException`: 例外原因；伺服器換行會保留成字面上的 `<br>`。
- `returnCode`
  - `"0"`: 成功；不加入警示彙整。
  - `"99"`: 保留在頁尾通知區；不加入警示彙整。
  - 其他值: `displayException` 為空時視為需警示的業務錯誤。
