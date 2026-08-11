# 前端開發規範

## 技術棧

- **框架**: Vue 3 (Composition API)
- **UI 元件庫**: Quasar
- **HTTP Client**: Axios
- **路由**: Vue Router (HTML5 History Mode)
- **狀態管理**: Pinia
- **表單驗證**: VeeValidate (Composition API) + Yup
- **日期處理**: Day.js
- **建置工具**: Vite

---

## 專案目錄

```
src/
├── assets/                 # 靜態資源
│   ├── libs/               # 第三方函式庫
│   ├── plugins/            # 插件
│   └── utils/              # 工具函式
├── components/             # 全域通用元件
├── router/                 # 路由設定
├── stores/                 # Pinia 狀態管理
├── views/                  # 頁面視圖
│   └── <ModuleCode>/       # 業務模組資料夾
└── App.vue
```

---

## 相關規範

- [命名規範](./naming-rule.md) - 檔案、變數、元件、路由命名規則
- [Script Setup 規範](./script-setup.md) - `<script setup>` 與 Composition API 撰寫規則
- [狀態管理規範](./state-management.md) - 頁面內部狀態、頁面間資料傳遞、全域共用狀態之使用準則
- [路由註冊規範](./route-entry.md) - 新增路由 entry 之格式與頁面識別碼傳遞方式
- [HTTP Client 規範](./http-client.md) - Axios instance 引用方式與呼叫慣例
- [樣式規範](./style-rule.md) - 樣式優先序、行內樣式遷移、過時屬性對照表
- [Quasar 元件規範](./quasar-usage.md) - 常見 UI 需求對應之 Quasar 元件
- [表單驗證規範](./form-schema.md) - VeeValidate + Yup 驗證 schema 寫法
