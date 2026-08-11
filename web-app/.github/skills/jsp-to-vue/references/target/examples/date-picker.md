# 日期選擇器範例

```vue
<template>
  <q-input dense outlined v-model="orderDate" mask="####/##/##" label="訂單日期">
    <template #append>
      <q-btn dense icon="event">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="orderDate" />
        </q-popup-proxy>
      </q-btn>
    </template>
  </q-input>
</template>

<script setup>
import { ref } from 'vue'

const orderDate = ref('')
</script>
```
