# 樣式規範

## 核心規範

- **Required**: 優先使用 LegacyClass > Quasar Utility Classes > Scoped Style
- **Required**: 行內樣式、樣式屬性改於 `<style scoped>` 內定義
- **Forbidden**: 定義或覆蓋全局樣式(`<style>`、`<style global>`、`<style module>`、`!important`)

---

## 過時樣式屬性對照表

| 舊屬性(HTML 4.0.1) | 新樣式(HTML 5) |
| --- | --- |
| `bgColor` | `background-color` |
| `align` | `text-align`（文字）／`float`（區塊） |
| `width`／`height`（非 img/table） | `width`／`height`（CSS 屬性） |
| `border` | `border`（CSS 屬性） |
| `cellPadding`／`cellSpacing`（table） | `padding`（配合 `border-collapse`） |
| `valign` | `vertical-align` |

---

## 範例

**AS-IS**:
```vue
<template>
  <div class="order-detail tbYellow" style="color: red;">...</div>
</template>
```

**TO-BE**:
```vue
<template>
  <div class="order-detail tbYellow">...</div>
</template>
<style scoped>
.order-detail {
  color: red;
}
</style>
```
