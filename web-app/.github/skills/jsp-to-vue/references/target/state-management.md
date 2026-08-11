# 狀態管理規範

## 核心規範

- **Required**: 單一頁面內部狀態使用 `ref`/`reactive`
- **Required**: 元件間狀態使用 `props`/`emits`
- **Required**: 頁面間狀態使用 `history.state`
- **Required**: 全域狀態使用 Pinia Store(登入者資訊、全域權限)；**Forbidden**: 自行新增或重新定義全域 Store

---

## History State

```js
// 發送端
router.push({ name: 'EXA10001', state: { orderId: 123 } })

// 接收端
const orderId = history.state.orderId
```

---

## Pinia State

```js
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { userName, permissions } = storeToRefs(userStore)
```

**可用全域 Store 清單**:

| Store | Import 路徑 | 提供狀態 | 提供方法 | 適用情境 |
|---|---|---|---|---|
