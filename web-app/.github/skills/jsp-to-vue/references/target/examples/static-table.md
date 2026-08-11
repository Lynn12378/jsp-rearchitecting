# 靜態表格範例

```vue
<template>
  <q-markup-table dense bordered>
    <template>
      <tbody>
        <tr>
          <td>訂單編號</td>
          <td>
            <q-input dense outlined v-model="orderNo" />
          </td>
          <td>訂單狀態</td>
          <td>
            <q-select dense outlined v-model="status" :options="statusOptions" />
          </td>
        </tr>
        <tr>
          <td>訂單日期區間</td>
          <td colspan="3">
            <q-field dense borderless>
              <template #control>
                <q-input dense outlined v-model="startDate" mask="####/##/##" placeholder="起始日">
                  <template #append>
                    <q-btn dense icon="event">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="startDate" />
                      </q-popup-proxy>
                    </q-btn>
                  </template>
                </q-input>
                <span>~</span>
                <q-input dense outlined v-model="endDate" mask="####/##/##" placeholder="結束日">
                  <template #append>
                    <q-btn dense icon="event">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="endDate" />
                      </q-popup-proxy>
                    </q-btn>
                  </template>
                </q-input>
              </template>
            </q-field>
          </td>
        </tr>
      </tbody>
    </template>
  </q-markup-table>
  <q-btn dense label="查詢" @click="onSearch" />
</template>

<script setup>
import { ref } from 'vue'

const orderNo = ref('')
const status = ref('')
const startDate = ref('')
const endDate = ref('')
const statusOptions = ['處理中', '已完成', '已取消']

const onSearch = () => {}
</script>
```
