# HTTP Client 規範

## 核心規範

- **Required**: 引用既有 Axios instance(`const $cathayAxios = inject('$cathayAxios')`)；**Forbidden**: 另行建立或引用其他 HTTP Client
- **Required**: 呼叫路徑為相對路徑(`baseURL` 已於 instance 內設定)；**Forbidden**: 使用絕對路徑或完整 URL
- **Required**: 回應格式為 `{ returnCode: number, data: any }`
  - **returnCode**: `'0'` 表示請求成功，非 `0` 表示失敗
  - **data**: 回應資料本體
- **Required**: 錯誤訊息統一於 Axios instance 內處理; **Forbidden**: 在各個頁面或組件內自行處理錯誤訊息

---

## 範例

```js
const $cathayAxios = inject('$cathayAxios')

const fetchData = async () => {
  const res = await $cathayAxios.post('exa10001/prompt', {})
  if (res.returnCode !== 0) {
    // 錯誤處理
    // CORRECT: 清空資料
    // INCORRECT: 顯示錯誤訊息ex: alert(res.message)
    return
  }
  // 成功處理
}
```