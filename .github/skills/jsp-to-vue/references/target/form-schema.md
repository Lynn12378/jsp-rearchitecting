# 表單驗證規範

## 核心規範

- **Required**: 表單以 `useForm` 宣告(虛擬表單)；**Forbidden**: 使用 `<form>` 標籤包覆欄位
- **Required**: 驗證欄位以 `useField` 宣告並直接綁定 `v-model`；**Forbidden**: 以外部 `ref` 物件包覆後綁定(VeeValidate 無法追蹤)
- **Required**: 跨欄位驗證使用 `this.parent` 取得同表單其他欄位值
- **Required**: 錯誤訊息取自 `useForm` 之 `errors`；**Forbidden**: 取自 `useField` 之回傳值
- **Required**: 資料回填以 `setValues` 賦值；**Forbidden**: 直接指派欄位值(不會觸發追蹤)
- **Required**: 全表單重置使用 `resetForm`，單一欄位重置使用 `resetField`；**Forbidden**: 直接指派欄位值進行重置
- **Required**: `initialValues` 須為所有驗證欄位設定初始值，並設定 `validateOnMount: false`；**Forbidden**: 省略上述設定(將導致進入頁面即顯示錯誤)
- **Required**: 全域驗證規則檢查 `@/assets/libs/CathayValidateRules.js`(具名匯入實際使用之方法)；**Forbidden**: 以匿名匯入整份模組(`import '...'`)
- **Required**: 頁面重複使用之驗證邏輯，包裝為驗證器物件(`{ name, message, test }`)復用；**Forbidden**: 於各欄位重複撰寫相同 `test()` 邏輯
- **Required**: 同一表單依情境需要多種驗證規則時，各自定義獨立 `validationSchema`，並依情境使用 `validate({ schema })` 指定驗證規則
- **Required**: 表單驗證必須使用 `validate()` 觸發，並依回傳結果判斷是否中斷後續流程

---

## 範例

```vue
<template>
  <q-input v-model="email" :error="!!errors.email" :error-message="errors.email" />
  <q-btn label="儲存" @click="onSave" />
  <q-btn label="送出" @click="onSubmit" />
  <q-btn label="清空" @click="resetForm" />
</template>

<script setup>
import { onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import { object, string } from 'yup'
import { mobile } from '@/assets/libs/CathayValidateRules.js'

const $cathayAxios = inject('$cathayAxios')

// 頁面共用驗證器，供多個欄位復用
const requiredText = { name: 'requiredText', message: '此欄位為必填', test: (value) => !!value?.trim() }
const startTimeCheck = { name: 'startTimeCheck', message: '開始時間不得大於結束時間', test: function (value) { return value < this.parent.endTime } }

const schemaSave = object({
  email: string().test(requiredText).email()
})
const schemaSubmit = object({
  email: string().test(requiredText).email(),
  mobile: string().mobile(), // 全域規則
  endTime: string().test(startTimeCheck)
})

const { errors, setValues, resetForm, resetField, validate } = useForm({
  validationSchema: schemaSave,
  initialValues: { email: '', mobile: '', startTime: '', endTime: '' },
  validateOnMount: false
})
const { value: email } = useField('email')

onMounted(async () => {
  const res = await $cathayAxios.post('exa10001/prompt', {})
  if (res.returnCode !== 0) return
  setValues({ email: res.data.email })
})

const onSave = async () => {
  const { valid } = await validate({ schema: schemaSave })
  if (!valid) return
  await $cathayAxios.post('exa10001/save', { email: email.value })
}

const onSubmit = async () => {
  const { valid } = await validate({ schema: schemaSubmit })
  if (!valid) return
  await $cathayAxios.post('exa10001/submit', { email: email.value })
}
</script>
```
