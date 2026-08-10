<template>
  <q-page class="afy10400">
    <header class="afy10400__header row items-center no-wrap">
      <span class="afy10400__marker">●</span>
      <span>公會通報下傳作業</span>
      <span class="afy10400__screen-code q-ml-auto">畫面編號：AFY10400</span>
    </header>

    <main class="afy10400__content">
      <section class="afy10400__panel">
        <h1 class="afy10400__section-title">
          <span class="afy10400__section-marker">●</span>
          公會補通報作業
        </h1>

        <div class="afy10400__table-area">
          <q-markup-table dense bordered flat separator="cell" class="afy10400__table">
            <tbody>
              <tr>
                <td colspan="4" class="afy10400__instructions">
                  1、此畫面請用<span class="text-red">Google Chrome</span>使用<br>
                  2、收承方式、商品屬性，每次只能針對其中一種組合進行下載，若有多種組合下載，需分多次匯出處理<br>
                  3、同一ID查詢多筆保單時，請在保單號碼欄位，輸入多筆且用<span class="text-red">Enter</span>來分格
                </td>
              </tr>
              <tr>
                <th scope="row" class="afy10400__label-cell">收承方式</th>
                <td class="afy10400__value-cell afy10400__value-cell--narrow">
                  <q-select
                    v-model="insrType"
                    :options="insrTypeOptions"
                    emit-value
                    map-options
                    dense
                    outlined
                  />
                </td>
                <th scope="row" class="afy10400__label-cell">商品屬性</th>
                <td class="afy10400__value-cell afy10400__value-cell--wide">
                  <q-select
                    v-model="prodType"
                    :options="prodTypeOptions"
                    emit-value
                    map-options
                    dense
                    outlined
                  />
                </td>
              </tr>
              <tr class="afy10400__column-header">
                <th scope="col">刪除</th>
                <th scope="col">
                  被保人ID
                  <q-btn
                    id="addBtn"
                    label="新增一列"
                    dense
                    no-caps
                    class="q-ml-sm"
                    @click="addRow"
                  />
                </th>
                <th scope="col">保單號碼</th>
                <th scope="col">匯出結果</th>
              </tr>
              <tr
                v-for="(row, rowIndex) in rows"
                :key="row.id"
                :class="rowIndex % 2 === 0 ? 'afy10400__data-row--odd' : 'afy10400__data-row--even'"
              >
                <td class="text-center">
                  <q-btn
                    :id="`deleteBtn_${row.id}`"
                    label="刪除此列"
                    dense
                    no-caps
                    @click="deleteRow(row.id)"
                  />
                </td>
                <td class="text-center">
                  <q-input
                    v-model="row.insuredId"
                    :id="`I_ID_${row.id}`"
                    maxlength="10"
                    dense
                    outlined
                  />
                </td>
                <td class="text-center">
                  <q-input
                    v-model="row.policyNumbers"
                    :id="`POLICY_NO_${row.id}`"
                    type="textarea"
                    rows="3"
                    dense
                    outlined
                  />
                </td>
                <td class="text-center">{{ row.result }}</td>
              </tr>
            </tbody>
          </q-markup-table>

          <div class="afy10400__actions text-center">
            <q-btn
              id="exportBtn"
              label="匯出檔案"
              dense
              no-caps
              :loading="isExporting"
              @click="exportFile"
            />
          </div>
        </div>
      </section>
    </main>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { useQuasar } from 'quasar'
import http from '@/assets/plugins/axios'

const $q = useQuasar()
const nextRowId = ref(0)
const isExporting = ref(false)
const msgs = ref([])

// TODO: UNKNOWN_SYNTAX: <tr class="tbBlue">

const insrTypeOptions = [
  { label: '承保', value: 'L' },
  { label: '收件', value: 'R' }
]
const prodTypeOptions = [
  { label: '個險', value: 'AT' },
  { label: '團險', value: 'BG' },
  { label: '意外險', value: 'CB' }
]

useForm({
  initialValues: {
    insrType: 'L',
    prodType: 'AT',
    rows: []
  },
  validateOnMount: false
})

const { value: insrType } = useField('insrType')
const { value: prodType } = useField('prodType')
const { value: rows } = useField('rows')

// TODO: TECHNICAL_GAP: 將既有作業結果同步到共通通知區
const displayMessage = () => {}

// TODO: TECHNICAL_GAP: 顯示使用者識別與時間浮水印
const displaySecurityWatermark = () => {}

// TODO: TECHNICAL_GAP: 依資訊安全政策限制頁面操作
const applySecurityRestrictions = () => {}

// TODO: TECHNICAL_GAP: 記錄複製內容稽核資訊
const registerCopyAudit = () => {}

// TODO: TECHNICAL_GAP: 將後端已產製之檔案交付給使用者
const deliverDownloadedFile = (...args) => {}

const addRow = () => {
  nextRowId.value += 1
  rows.value = [
    ...rows.value,
    {
      id: nextRowId.value,
      insuredId: '',
      policyNumbers: '',
      result: ''
    }
  ]
}

const deleteRow = (rowId) => {
  rows.value = rows.value.filter((row) => row.id !== rowId)
}

const showValidationMessage = (message) => {
  $q.dialog({ message })
}

const validateRows = () => {
  for (let rowIndex = 0; rowIndex < rows.value.length; rowIndex += 1) {
    const row = rows.value[rowIndex]
    if (row.insuredId === '' || row.policyNumbers === '') {
      showValidationMessage(`第${rowIndex + 1}列的被保人ID或保單號碼不得為空值，若不需要請刪除該列`)
      return false
    }

    for (let compareIndex = rowIndex + 1; compareIndex < rows.value.length; compareIndex += 1) {
      if (row.insuredId === rows.value[compareIndex].insuredId) {
        showValidationMessage(`被保人ID：${row.insuredId}有重覆出現，請合併在同一列處理`)
        return false
      }
    }
  }

  return true
}

const applyExportResults = (resultMap = {}) => {
  rows.value = rows.value.map((row) => ({
    ...row,
    result: resultMap[row.insuredId]
  }))
}

const downloadFile = async (requestUrl, params, isOpenNewBrowse) => {
  const response = await http.post(requestUrl, params)
  if (String(response.data.returnCode) !== '0') return

  deliverDownloadedFile(response.data.data, isOpenNewBrowse)
}

const exportFile = async () => {
  if (!validateRows()) return

  const payload = {
    insrType: insrType.value,
    prodType: prodType.value,
    I_ID: rows.value.map((row) => row.insuredId),
    POLICY_NO: rows.value.map((row) => row.policyNumbers)
  }

  isExporting.value = true
  try {
    const response = await http.post('afy10400/export', payload)
    const responseData = response.data.data ?? {}
    applyExportResults(responseData.rtnMap)

    if (String(response.data.returnCode) !== '0') return

    await downloadFile('afy10400/download', { fileName: responseData.fileName }, false)
  } finally {
    isExporting.value = false
  }
}

onMounted(async () => {
  const response = await http.post('afy10400/prompt', {})
  if (String(response.data.returnCode) === '0') {
    msgs.value = Array.isArray(response.data.data?.msgs) ? response.data.data.msgs : []
    displayMessage()
  }

  displaySecurityWatermark()
  applySecurityRestrictions()
  registerCopyAudit()
})
</script>

<style scoped>
.afy10400 {
  min-height: 100%;
  color: #000;
  background-color: #f0fbc6;
}

.afy10400__header {
  min-height: 30px;
  padding: 2px 8px;
  border: solid #003366;
  border-width: 4px 4px 0;
  background-color: #f0fbc6;
}

.afy10400__marker {
  margin-right: 8px;
  font-size: 8px;
}

.afy10400__screen-code {
  text-align: right;
}

.afy10400__content {
  min-height: calc(100vh - 30px);
  padding: 8px 4px;
  border-right: 4px solid #003366;
  border-left: 4px solid #003366;
}

.afy10400__panel {
  width: 97%;
  margin: 0 auto;
  border: 1px solid #003366;
  background-color: #fff;
}

.afy10400__section-title {
  min-height: 30px;
  margin: 0;
  padding: 6px;
  color: #000;
  background-color: #f0fbc6;
  font-size: 16px;
  font-weight: normal;
}

.afy10400__section-marker {
  margin-right: 4px;
  color: #003366;
}

.afy10400__table-area {
  padding: 5px;
}

.afy10400__table {
  width: 100%;
  border-color: #003366;
  border-radius: 0;
}

.afy10400__instructions,
.afy10400__value-cell,
.afy10400__actions,
.afy10400__data-row--odd {
  background-color: #fafbe1;
}

.afy10400__label-cell,
.afy10400__data-row--even {
  background-color: #eef1a7;
}

.afy10400__instructions {
  padding: 5px;
  white-space: normal;
}

.afy10400__label-cell,
.afy10400__value-cell {
  width: 20%;
}

.afy10400__value-cell {
  text-align: left;
}

.afy10400__value-cell--wide {
  width: 40%;
}

.afy10400__column-header {
  text-align: center;
}

.afy10400__actions {
  padding: 5px;
  border: solid #003366;
  border-width: 0 1px 1px;
}
</style>