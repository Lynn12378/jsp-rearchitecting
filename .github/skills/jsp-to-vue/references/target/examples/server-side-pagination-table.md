# 伺服器端分頁表格範例

```vue
<template>
  <q-table
    dense
    bordered
    v-model:pagination="pagination"
    :rows="rows"
    :columns="columns"
    row-key="orderNo"
    :loading="loading"
    @request="onRequest"
  />
</template>

<script setup>
import { ref } from 'vue'

const $cathayAxios = inject('$cathayAxios')

const columns = [
  { name: 'orderNo', label: '訂單編號', field: 'orderNo', align: 'left' },
  { name: 'orderDate', label: '訂單日期', field: 'orderDate', align: 'left' }
]
const rows = ref([])
const loading = ref(false)
const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })

const onRequest = async ({ pagination: newPagination }) => {
  loading.value = true
  const res = await $cathayAxios.post('exa10001/prompt', {
    page: newPagination.page,
    rowsPerPage: newPagination.rowsPerPage
  })
  loading.value = false
  if (res.returnCode !== 0) return
  rows.value = res.data.list
  pagination.value.page = newPagination.page
  pagination.value.rowsPerPage = newPagination.rowsPerPage
  pagination.value.rowsNumber = res.data.total
}
</script>
```
