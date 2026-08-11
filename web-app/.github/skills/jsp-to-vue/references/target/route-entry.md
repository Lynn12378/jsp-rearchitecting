# 路由註冊規範

## 核心規範

- **Required**: 元件以動態匯入(Lazy Load)註冊；**Forbidden**: 靜態匯入(於檔案頂部 `import`)
- **Required**: 目標模組尚無父路由(`<ModuleCode>`)時，需先行於根路由註冊父路由
- **Required**: `name` 使用 `<ComponentName>`(PascalCase)；**Forbidden**: 自訂路由名稱
- **Required**: 於既有 `children` 陣列末端新增
- **Required**: 頁面識別碼(如詳情頁之資料 ID)使用 Route Params
- **Required**: 模組路由皆使用 `BaseLayout` 作為元件，統一顯示頁面浮水印

---

## 範例一、註冊路由

```js
{
  path: 'EXA10001',
  name: 'EXA10001',
  component: () => import('@/views/A1/EXA10001.vue')
}
```

**註冊父路由**:

```js
{
  path: '/A1',
  component: BaseLayout,
  children: [
    // 註冊子路由
  ]
}
```

---

## 範例二、頁面識別碼定義與傳遞

```js
{
  path: 'EXA10002/:id', // 頁面識別碼定義
  name: 'EXA10002',
  component: () => import('@/views/A1/EXA10002.vue')
}

// 發送端
router.push({ name: 'EXA10002', params: { id: 123 } })

// 接收端
const id = route.params.id
```
