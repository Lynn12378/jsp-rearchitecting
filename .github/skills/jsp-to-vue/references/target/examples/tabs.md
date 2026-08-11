# 分頁標籤範例

```vue
<template>
  <q-tabs dense v-model="tab">
    <q-tab name="basic" label="基本資料" />
    <q-tab name="history" label="異動紀錄" />
  </q-tabs>

  <q-tab-panels v-model="tab">
    <q-tab-panel name="basic">
      基本資料內容
    </q-tab-panel>
    <q-tab-panel name="history">
      <History />
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from 'vue'
import History from './History.vue'

const tab = ref('basic')
</script>
```
