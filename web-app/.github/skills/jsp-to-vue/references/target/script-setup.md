# Script Setup 規範

## 核心規範

- **Required**: 採用 `<script setup>`語法糖之 Composition API；**Forbidden**: Options API
- **Required**: 元件按照 `<template>` > `<script setup>` > `<style scoped>` 順序撰寫
- **Required**: `v-for` 綁定唯一鍵值(`:key`)；**Forbidden**: 以 `index` 作為鍵值
- **Required**: 具名匯入；**Forbidden**: 預設或星號匯入(ex: `import Vue from 'vue'`、`import * as Vue from 'vue'`)
- **Required**: 箭頭函式(Arrow Function)定義(`const func = () => {}`)；**Forbidden**: Function Declaration 定義(`function func() {}`)；**Exception**: 函式依賴呼叫時 `this` 綁定以取得父層 context 者，得採 Function Declaration 定義
- **Required**: 文字插值(`{{ }}`)或屬性綁定(`v-bind`)輸出內容；**Forbidden**: 使用 `v-html`，以避免 XSS 攻擊
