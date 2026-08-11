# 對話框範例

## Embedded

```vue
<template>
  <q-btn dense label="開啟明細" @click="show = true" />
  <q-dialog v-model="show">
    <q-card>
      <q-card-section>
        訂單明細內容
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
```

```vue
<template>
  <q-btn dense label="開啟明細" @click="show = true" />
  <q-dialog v-model="show">
    <OrderDetailCard />
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import OrderDetailCard from './OrderDetailCard.vue'

const show = ref(false)
</script>
```

---

## Plugin

```vue
<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

const onDelete = () => {
  $q.dialog({
    title: '確認刪除',
    message: '是否確認刪除此筆訂單？',
    cancel: true
  }).onOk(() => {
    // 確認後執行
  })
}
</script>
```
