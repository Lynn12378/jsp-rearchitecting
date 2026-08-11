# Quasar 元件規範

## 核心規範

- **Required**: 使用 `dense`
- **Required**: 表格元件使用 `bordered`
- **Required**: 表單輸入元件使用 `outlined`
- **Forbidden**: 使用 slot 客製化元件內部結構(避免破壞 UI 一致性)；**Exception**: 僅日期選擇器可使用 `#append` slot 客製化觸發按鈕、`q-field` 可使用 `#control` slot 客製化內部元件
- **Forbidden**: 使用元件對照表以外的元件與插件

---

## 元件對照表

| UI 需求 | Quasar 元件 |
|---|---|
| 按鈕 | `q-btn` |
| 輸入框 | `q-input` |
| 下拉選單 | `q-select` |
| 複選框 | `q-checkbox` |
| 單選框 | `q-radio` |
| 日期選擇 | `q-input`、`q-btn`、`q-popup-proxy`、`q-date` |
| 檔案上傳 | `q-file` |
| 頁面內嵌對話框（複雜內容/表單） | `q-dialog`、`q-card`、`q-card-section` |
| 全域快速對話框（確認/輸入） | `$q.dialog` |
| 通知訊息（單向） | `$q.notify` |
| 靜態表格（不需分頁） | `q-markup-table` |
| 動態表格（需分頁） | `q-table` |
| 分頁標籤（頁內切換） | `q-tabs`、`q-tab-panels`、`q-tab`、`q-tab-panel` |
| 分頁標籤（路由切換） | `q-tabs`、`q-route-tab` |
| 載入狀態 | `q-spinner` / `q-skeleton` |
| 群組包裹容器 | `q-field` |

---

## 相關範例

- [日期選擇器範例](./examples/date-picker.md)
- [靜態表格範例](./examples/static-table.md)
- [客戶端分頁表格範例](./examples/client-side-pagination-table.md)
- [伺服器端分頁表格範例](./examples/server-side-pagination-table.md)
- [分頁標籤範例](./examples/tabs.md)
- [路由分頁範例](./examples/route-tab.md)
- [對話框範例](./examples/dialog.md)
