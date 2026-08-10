<template>
  <div class="ata08110">
    <header class="ata08110__header">
      <span class="ata08110__bullet">●</span>
      <strong>公會通報設定</strong>
      <span>畫面編號：ATA08110</span>
    </header>

    <main class="ata08110__content">
      <section class="ata08110__panel">
        <h1 class="ata08110__panel-title">公會通報設定</h1>
        <div class="ata08110__panel-body">
          <q-markup-table dense bordered flat separator="cell" class="ata08110__table">
            <thead>
              <tr>
                <th scope="col" class="ata08110__source-name">契約來源中文</th>
                <th scope="col" class="ata08110__source">契約來源</th>
                <th scope="col">等待時間(毫秒)</th>
                <th scope="col">是否通算</th>
                <th scope="col" class="ata08110__url">通算網址</th>
                <th scope="col">累計最大保障(萬)</th>
                <th scope="col">連線等候時間(毫秒)</th>
                <th scope="col">重試次數</th>
                <th scope="col">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>
                  <q-input
                    v-model="srcNew"
                    dense
                    outlined
                    :error="!!errors.srcNew"
                    :error-message="errors.srcNew"
                  />
                </td>
                <td>
                  <q-input
                    v-model="timeoutNew"
                    dense
                    outlined
                    :error="!!errors.timeoutNew"
                    :error-message="errors.timeoutNew"
                    @change="checkNewNumber('timeoutNew', '等待時間')"
                  />
                </td>
                <td>
                  <q-select
                    v-model="callAssoNew"
                    dense
                    outlined
                    :options="callAssoOptions"
                  />
                </td>
                <td>
                  <q-input
                    v-model="urlNew"
                    dense
                    outlined
                    :error="!!errors.urlNew"
                    :error-message="errors.urlNew"
                  />
                </td>
                <td>
                  <q-input
                    v-model="maxAmtNew"
                    dense
                    outlined
                    :error="!!errors.maxAmtNew"
                    :error-message="errors.maxAmtNew"
                    @change="checkNewNumber('maxAmtNew', '累計最大保障')"
                  />
                </td>
                <td>
                  <q-input
                    v-model="connectTimeoutNew"
                    dense
                    outlined
                    :error="!!errors.connectTimeoutNew"
                    :error-message="errors.connectTimeoutNew"
                    @change="checkNewNumber('connectTimeoutNew', '連線等候時間')"
                  />
                </td>
                <td>
                  <q-input
                    v-model="retryNew"
                    dense
                    outlined
                    :error="!!errors.retryNew"
                    :error-message="errors.retryNew"
                    @change="checkNewNumber('retryNew', '重試次數')"
                  />
                </td>
                <td class="ata08110__actions">
                  <q-btn dense label="新增" @click="doInsert" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>

          <q-markup-table dense bordered flat separator="cell" class="ata08110__table ata08110__table--detail">
            <thead>
              <tr>
                <th scope="col" class="ata08110__source-name">契約來源中文</th>
                <th scope="col" class="ata08110__source">契約來源</th>
                <th scope="col">等待時間(毫秒)</th>
                <th scope="col">是否通算</th>
                <th scope="col" class="ata08110__url">通算網址</th>
                <th scope="col">累計最大保障(萬)</th>
                <th scope="col">連線等候時間(毫秒)</th>
                <th scope="col">重試次數</th>
                <th scope="col">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in rows" :key="row.key">
                <td>{{ row.value.sourceName }}</td>
                <td>{{ row.value.source }}</td>
                <td>
                  <q-input
                    v-model="row.value.timeout"
                    dense
                    outlined
                    :error="!!errors[`rows[${rowIndex}].timeout`]"
                    :error-message="errors[`rows[${rowIndex}].timeout`]"
                    @change="checkRowNumber(row, 'timeout', '等待時間')"
                  />
                </td>
                <td>
                  <q-select
                    v-model="row.value.callAsso"
                    dense
                    outlined
                    :options="callAssoOptions"
                  />
                </td>
                <td>
                  <q-input
                    v-model="row.value.url"
                    dense
                    outlined
                    :error="!!errors[`rows[${rowIndex}].url`]"
                    :error-message="errors[`rows[${rowIndex}].url`]"
                  />
                </td>
                <td>
                  <q-input
                    v-model="row.value.maxAmt"
                    dense
                    outlined
                    :error="!!errors[`rows[${rowIndex}].maxAmt`]"
                    :error-message="errors[`rows[${rowIndex}].maxAmt`]"
                    @change="checkRowNumber(row, 'maxAmt', '累計最大保障')"
                  />
                </td>
                <td>
                  <q-input
                    v-model="row.value.connectTimeout"
                    dense
                    outlined
                    :error="!!errors[`rows[${rowIndex}].connectTimeout`]"
                    :error-message="errors[`rows[${rowIndex}].connectTimeout`]"
                    @change="checkRowNumber(row, 'connectTimeout', '連線等候時間')"
                  />
                </td>
                <td>
                  <q-input
                    v-model="row.value.retry"
                    dense
                    outlined
                    :error="!!errors[`rows[${rowIndex}].retry`]"
                    :error-message="errors[`rows[${rowIndex}].retry`]"
                    @change="checkRowNumber(row, 'retry', '重試次數')"
                  />
                </td>
                <td class="ata08110__actions">
                  <q-btn dense label="刪除" @click="doDelete(rowIndex)" />
                  <q-btn dense label="修改" @click="doUpdate(rowIndex)" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useField, useFieldArray, useForm } from 'vee-validate'
import { object, string } from 'yup'
import http from '@/assets/plugins/axios'

const $q = useQuasar()
const callAssoOptions = ['Y', 'N']

const requiredText = {
  name: 'requiredText',
  message: '此欄位為必填',
  test: (value) => !!String(value ?? '').trim()
}

const insertSchema = object({
  srcNew: string().test({ ...requiredText, message: '契約來源必須輸入' }),
  timeoutNew: string().test({ ...requiredText, message: '等待時間必須輸入' }),
  urlNew: string().test({ ...requiredText, message: '通算網址必須輸入' }),
  maxAmtNew: string().test({ ...requiredText, message: '累計最大保障必須輸入' }),
  connectTimeoutNew: string().test({ ...requiredText, message: '連線等候時間必須輸入' }),
  retryNew: string().test({ ...requiredText, message: '重試次數必須輸入' })
})

const updateRowSchema = object({
  timeout: string().test({ ...requiredText, message: '等待時間必須輸入' }),
  url: string().test({ ...requiredText, message: '通算網址必須輸入' }),
  maxAmt: string().test({ ...requiredText, message: '累計最大保障必須輸入' }),
  connectTimeout: string().test({ ...requiredText, message: '連線等候時間必須輸入' }),
  retry: string().test({ ...requiredText, message: '重試次數必須輸入' })
})

const {
  errors,
  resetForm,
  setFieldError,
  setFieldValue,
  validate
} = useForm({
  validationSchema: insertSchema,
  initialValues: {
    srcNew: '',
    timeoutNew: '',
    callAssoNew: 'Y',
    urlNew: '',
    maxAmtNew: '',
    connectTimeoutNew: '',
    retryNew: '',
    rows: []
  },
  validateOnMount: false
})

const { value: srcNew } = useField('srcNew')
const { value: timeoutNew } = useField('timeoutNew')
const { value: callAssoNew } = useField('callAssoNew')
const { value: urlNew } = useField('urlNew')
const { value: maxAmtNew } = useField('maxAmtNew')
const { value: connectTimeoutNew } = useField('connectTimeoutNew')
const { value: retryNew } = useField('retryNew')
const { fields: rows, replace } = useFieldArray('rows')

const showAlert = (message) => new Promise((resolve) => {
  $q.dialog({ message, persistent: true }).onDismiss(resolve)
})

const showConfirm = (message) => new Promise((resolve) => {
  $q.dialog({ message, cancel: true, persistent: true })
    .onOk(() => resolve(true))
    .onCancel(() => resolve(false))
})

// TODO: TECHNICAL_GAP: 顯示共通作業結果訊息
const displayMessage = (...args) => {}

const isSuccess = (response) => String(response?.data?.returnCode) === '0'

const loadData = async () => {
  const response = await http.post('ata08110/prompt', {})
  if (!isSuccess(response)) return

  const detailList = response.data.data?.DTCBZ004_List ?? []
  replace(detailList.map((detail) => ({
    sourceName: detail.SRC_NAME ?? '',
    source: detail.SRC ?? '',
    timeout: detail.TIMEOUT ?? '',
    callAsso: detail.CALL_ASSO ?? 'Y',
    url: detail.URL ?? '',
    maxAmt: detail.MAXAMT ?? '',
    connectTimeout: detail.CONNECT_TIMEOUT ?? '',
    retry: detail.RETRY ?? ''
  })))
  displayMessage()
}

const newFieldValues = () => ({
  timeoutNew: timeoutNew.value,
  maxAmtNew: maxAmtNew.value,
  connectTimeoutNew: connectTimeoutNew.value,
  retryNew: retryNew.value
})

const checkNewNumber = async (fieldName, label) => {
  const value = newFieldValues()[fieldName]
  if (!Number.isNaN(Number(value))) return

  await showAlert(`${label}限定只能輸入數字，請重新輸入。`)
  setFieldValue(fieldName, '')
}

const checkRowNumber = async (row, fieldName, label) => {
  if (!Number.isNaN(Number(row.value[fieldName]))) return

  await showAlert(`${label}限定只能輸入數字，請重新輸入。`)
  row.value[fieldName] = ''
}

const clearRowErrors = (rowIndex) => {
  Object.keys(updateRowSchema.fields).forEach((fieldName) => {
    setFieldError(`rows[${rowIndex}].${fieldName}`, undefined)
  })
}

const validateRow = async (rowIndex) => {
  clearRowErrors(rowIndex)
  try {
    await updateRowSchema.validate(rows.value[rowIndex].value, { abortEarly: false })
    return true
  } catch (validationError) {
    const validationErrors = validationError.inner?.length
      ? validationError.inner
      : [validationError]
    validationErrors.forEach((error) => {
      setFieldError(`rows[${rowIndex}].${error.path}`, error.message)
    })
    await showAlert('紅底文字框為必須輸入。')
    return false
  }
}

const serializeForm = (index = '') => {
  const detailRows = rows.value.map((row) => row.value)
  return {
    SRC_NEW: srcNew.value,
    TIMEOUT_NEW: timeoutNew.value,
    CALL_ASSO_NEW: callAssoNew.value,
    URL_NEW: urlNew.value,
    MAXAMT_NEW: maxAmtNew.value,
    CONNECT_TIMEOUT_NEW: connectTimeoutNew.value,
    RETRY_NEW: retryNew.value,
    index,
    SRC: detailRows.map((row) => row.source),
    TIMEOUT: detailRows.map((row) => row.timeout),
    CALL_ASSO: detailRows.map((row) => row.callAsso),
    URL: detailRows.map((row) => row.url),
    MAXAMT: detailRows.map((row) => row.maxAmt),
    CONNECT_TIMEOUT: detailRows.map((row) => row.connectTimeout),
    RETRY: detailRows.map((row) => row.retry)
  }
}

const requestAction = async (action, index, successMessage) => {
  const response = await http.post(`ata08110/${action}`, serializeForm(index))
  if (isSuccess(response)) await showAlert(successMessage)
  resetForm()
  await loadData()
}

const doInsert = async () => {
  const { valid } = await validate()
  if (!valid) {
    await showAlert('紅底文字框為必須輸入。')
    return
  }
  await requestAction('insert', '', '公會通報設定新增成功')
}

const doDelete = async (rowIndex) => {
  const agreed = await showConfirm('請確認是否要刪除?')
  if (!agreed) return
  await requestAction('delete', rowIndex, '公會通報設定刪除成功')
}

const doUpdate = async (rowIndex) => {
  const valid = await validateRow(rowIndex)
  if (!valid) return

  const agreed = await showConfirm('請確認是否要修改?')
  if (!agreed) return
  await requestAction('update', rowIndex, '公會通報設定修改成功')
}

onMounted(loadData)
</script>

<style scoped>
.ata08110 {
  min-height: 100%;
  background-color: #f0fbc6;
}

.ata08110__header {
  display: grid;
  grid-template-columns: 20px 1fr auto;
  align-items: center;
  min-height: 30px;
  padding: 2px 8px;
  border: 4px solid #003366;
}

.ata08110__bullet {
  font-size: 8px;
  text-align: center;
}

.ata08110__content {
  min-height: calc(100vh - 30px);
  padding: 5px 4px;
  border-right: 4px solid #003366;
  border-left: 4px solid #003366;
}

.ata08110__panel {
  width: 97%;
  margin: 0 auto;
  border: 1px solid #003366;
  background-color: #fff;
}

.ata08110__panel-title {
  min-height: 26px;
  margin: 0;
  padding: 5px;
  font-size: 14px;
  line-height: 16px;
}

.ata08110__panel-body {
  padding: 5px;
}

.ata08110__table {
  width: 100%;
}

.ata08110__table--detail {
  margin-top: 32px;
}

.ata08110__table th,
.ata08110__table td {
  width: 10%;
  padding: 4px;
  text-align: center;
  vertical-align: middle;
  white-space: normal;
}

.ata08110__table .ata08110__source-name {
  width: 12%;
}

.ata08110__table .ata08110__source {
  width: 7%;
}

.ata08110__table .ata08110__url {
  width: 21%;
}

.ata08110__actions {
  white-space: nowrap;
}

.ata08110__actions .q-btn + .q-btn {
  margin-left: 4px;
}
</style>