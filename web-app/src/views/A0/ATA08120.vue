<template>
  <div class="ata08120">
    <header class="ata08120__header">
      <span class="ata08120__bullet" aria-hidden="true">●</span>
      <strong>公會通報設定</strong>
      <span class="ata08120__screen-code">畫面編號：ATA08120</span>
    </header>

    <main class="ata08120__main">
      <section class="ata08120__panel">
        <div class="ata08120__panel-title">公會通報設定</div>
        <div class="ata08120__content">
          <q-markup-table dense bordered flat class="ata08120__table">
            <thead>
              <tr>
                <th scope="col">契約來源中文</th>
                <th scope="col">契約來源</th>
                <th scope="col">連線等候時間(毫秒)</th>
                <th scope="col">資料等候時間(毫秒)</th>
                <th scope="col">作業開關</th>
                <th scope="col">公會連線方式</th>
                <th scope="col">WebService呼叫方法</th>
                <th scope="col">重試次數</th>
                <th scope="col">FTP登入帳號</th>
                <th scope="col">通報種類</th>
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
                    hide-bottom-space
                    :maxlength="6"
                    :error="!!errors.srcNew"
                    :error-message="errors.srcNew"
                  />
                </td>
                <td>
                  <q-input
                    v-model="timeoutNew"
                    dense
                    outlined
                    hide-bottom-space
                    :error="!!errors.timeoutNew"
                    :error-message="errors.timeoutNew"
                  />
                </td>
                <td>
                  <q-input
                    v-model="dataTimeoutNew"
                    dense
                    outlined
                    hide-bottom-space
                    :error="!!errors.dataTimeoutNew"
                    :error-message="errors.dataTimeoutNew"
                  />
                </td>
                <td>
                  <q-select
                    v-model="isEffectiveNew"
                    :options="effectiveOptions"
                    dense
                    outlined
                    hide-bottom-space
                  />
                </td>
                <td>
                  <q-input
                    v-model="connectionNew"
                    dense
                    outlined
                    hide-bottom-space
                    :maxlength="1"
                    :error="!!errors.connectionNew"
                    :error-message="errors.connectionNew"
                  />
                </td>
                <td>
                  <q-select
                    v-model="actionNew"
                    :options="actionOptions"
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    dense
                    outlined
                    hide-bottom-space
                  />
                </td>
                <td>
                  <q-input
                    v-model="retryNew"
                    dense
                    outlined
                    hide-bottom-space
                    :error="!!errors.retryNew"
                    :error-message="errors.retryNew"
                  />
                </td>
                <td>
                  <q-input
                    v-model="ftpHostNew"
                    dense
                    outlined
                    hide-bottom-space
                    :maxlength="1"
                    :error="!!errors.ftpHostNew"
                    :error-message="errors.ftpHostNew"
                  />
                </td>
                <td>
                  <q-input
                    v-model="typeNew"
                    dense
                    outlined
                    hide-bottom-space
                    :maxlength="1"
                  />
                </td>
                <td>
                  <q-btn label="新增" dense @click="insertRow" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>

          <q-markup-table dense bordered flat class="ata08120__table ata08120__table--details">
            <thead>
              <tr>
                <th scope="col">契約來源中文</th>
                <th scope="col">契約來源</th>
                <th scope="col">連線等候時間(毫秒)</th>
                <th scope="col">資料等候時間(毫秒)</th>
                <th scope="col">作業開關</th>
                <th scope="col">公會連線方式</th>
                <th scope="col">WebService呼叫方法</th>
                <th scope="col">重試次數</th>
                <th scope="col">FTP登入帳號</th>
                <th scope="col">通報種類</th>
                <th scope="col">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detail, index) in details" :key="detail.SRC">
                <td>{{ convertSourceName(detail.SRC) }}</td>
                <td>{{ detail.SRC }}</td>
                <td>
                  <q-input
                    v-model="detail.TIMEOUT"
                    dense
                    outlined
                    hide-bottom-space
                    :error="!!rowError(index, 'TIMEOUT')"
                    :error-message="rowError(index, 'TIMEOUT')"
                  />
                </td>
                <td>
                  <q-input
                    v-model="detail.DATA_TIMEOUT"
                    dense
                    outlined
                    hide-bottom-space
                    :error="!!rowError(index, 'DATA_TIMEOUT')"
                    :error-message="rowError(index, 'DATA_TIMEOUT')"
                  />
                </td>
                <td>
                  <q-select
                    v-model="detail.IS_EFFECTIVE"
                    :options="effectiveOptions"
                    dense
                    outlined
                    hide-bottom-space
                  />
                </td>
                <td>
                  <q-input
                    v-model="detail.CONNECTION"
                    dense
                    outlined
                    hide-bottom-space
                    :maxlength="1"
                    :error="!!rowError(index, 'CONNECTION')"
                    :error-message="rowError(index, 'CONNECTION')"
                  />
                </td>
                <td>
                  <q-select
                    v-model="detail.ACTION"
                    :options="actionOptions"
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    dense
                    outlined
                    hide-bottom-space
                  />
                </td>
                <td>
                  <q-input
                    v-model="detail.RETRY"
                    dense
                    outlined
                    hide-bottom-space
                    :error="!!rowError(index, 'RETRY')"
                    :error-message="rowError(index, 'RETRY')"
                  />
                </td>
                <td>
                  <q-input
                    v-model="detail.FTP_HOST"
                    dense
                    outlined
                    hide-bottom-space
                    :maxlength="1"
                    :error="!!rowError(index, 'FTP_HOST')"
                    :error-message="rowError(index, 'FTP_HOST')"
                  />
                </td>
                <td>
                  <q-input
                    v-model="detail.TYPE"
                    dense
                    outlined
                    hide-bottom-space
                    :maxlength="1"
                  />
                </td>
                <td>
                  <div class="ata08120__actions">
                    <q-btn label="刪除" dense @click="deleteRow(index)" />
                    <q-btn label="修改" dense @click="updateRow(index)" />
                  </div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>

          <div class="ata08120__instructions">
            <div>※使用說明:</div>
            <div>1. 通報種類: R=收件，L=承保 (如果是取回作業，這個欄位不會使用)</div>
            <div>2. 公會連線方式: W=Webservice，V=VPN</div>
            <div>3. FTP登入帳號: 1=網路投保，2=批次</div>
            <div>4. 作業開關(正式環境請小心使用): Y-&gt;開，N-&gt;關(代表直接pass該項公會作業)</div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useField, useForm } from 'vee-validate'
import { array, object, string } from 'yup'
import http from '@/assets/plugins/axios'

const $q = useQuasar()
const selectedIndex = ref(-1)
const actionOptions = ref([])
const messages = ref([])
const effectiveOptions = ['Y', 'N']

const requiredRule = (message) => ({
  name: 'requiredText',
  message,
  test: (value) => !!String(value ?? '').trim(),
})
const numericRule = (message) => ({
  name: 'numericText',
  message,
  test: (value) => !String(value ?? '').trim() || !Number.isNaN(Number(value)),
})
const isSelectedRow = (path) => Number(path.match(/\[(\d+)\]/)?.[1]) === selectedIndex.value
const selectedRequiredRule = (message) => ({
  name: 'selectedRequiredText',
  message,
  test: (value, context) => !isSelectedRow(context.path) || !!String(value ?? '').trim(),
})
const selectedNumericRule = (message) => ({
  name: 'selectedNumericText',
  message,
  test: (value, context) => {
    if (!isSelectedRow(context.path) || !String(value ?? '').trim()) return true
    return !Number.isNaN(Number(value))
  },
})

const insertSchema = object({
  srcNew: string().test(requiredRule('契約來源必須輸入')),
  timeoutNew: string()
    .test(requiredRule('連線等候時間必須輸入'))
    .test(numericRule('連線等候時間必須輸入數字')),
  dataTimeoutNew: string()
    .test(requiredRule('資料等候時間必須輸入'))
    .test(numericRule('資料等候時間必須輸入數字')),
  connectionNew: string().test(requiredRule('公會連線方式必須輸入')),
  retryNew: string()
    .test(requiredRule('重試次數必須輸入'))
    .test(numericRule('重試次數必須輸入數字')),
  ftpHostNew: string().test(requiredRule('FTP登入帳號必須輸入')),
})
const detailSchema = object({
  TIMEOUT: string()
    .test(selectedRequiredRule('連線等待時間必須輸入'))
    .test(selectedNumericRule('連線等待時間必須輸入數字')),
  DATA_TIMEOUT: string()
    .test(selectedRequiredRule('資料等待時間必須輸入'))
    .test(selectedNumericRule('資料等待時間必須輸入數字')),
  CONNECTION: string().test(selectedRequiredRule('公會通報方式必須輸入')),
  RETRY: string()
    .test(selectedRequiredRule('重試次數必須輸入'))
    .test(selectedNumericRule('重試次數必須輸入數字')),
  FTP_HOST: string().test(selectedRequiredRule('FTP登入帳號必須輸入')),
})
const updateSchema = object({ details: array().of(detailSchema) })

const { errors, setValues, validate } = useForm({
  validationSchema: insertSchema,
  initialValues: {
    srcNew: '',
    timeoutNew: '',
    dataTimeoutNew: '',
    isEffectiveNew: 'Y',
    connectionNew: '',
    actionNew: '',
    retryNew: '',
    ftpHostNew: '',
    typeNew: '',
    details: [],
  },
  validateOnMount: false,
})
const { value: srcNew } = useField('srcNew')
const { value: timeoutNew } = useField('timeoutNew')
const { value: dataTimeoutNew } = useField('dataTimeoutNew')
const { value: isEffectiveNew } = useField('isEffectiveNew')
const { value: connectionNew } = useField('connectionNew')
const { value: actionNew } = useField('actionNew')
const { value: retryNew } = useField('retryNew')
const { value: ftpHostNew } = useField('ftpHostNew')
const { value: typeNew } = useField('typeNew')
const { value: details } = useField('details')

// TODO: TECHNICAL_GAP: 套用目前作業的資訊安全政策與操作稽核
// TODO: TECHNICAL_GAP: 套用既有共用頁面樣式與圖片資源
// TODO: TECHNICAL_GAP: 顯示目前作業結果於共通通知區
const displayMessage = () => {}
// TODO: TECHNICAL_GAP: 將契約來源代碼轉換為中文名稱
const convertSourceName = (...args) => {}

const isSuccess = (response) => String(response?.returnCode) === '0'
const toActionOptions = (actionMap) => Object.entries(actionMap ?? {}).map(([value, label]) => ({ value, label }))

const fetchPage = async () => {
  const response = await http.post('ata08120/prompt', {})
  if (!isSuccess(response.data)) return

  const data = response.data.data ?? {}
  setValues({ details: data.DTAFY001_List ?? [] })
  actionOptions.value = toActionOptions(data.ACTION_Map)
  messages.value = data.msgs ?? []
  displayMessage()
}

const buildFormPayload = (index = '') => ({
  SRC_NEW: srcNew.value,
  TIMEOUT_NEW: timeoutNew.value,
  DATA_TIMEOUT_NEW: dataTimeoutNew.value,
  IS_EFFECTIVE_NEW: isEffectiveNew.value,
  CONNECTION_NEW: connectionNew.value,
  ACTION_NEW: actionNew.value,
  RETRY_NEW: retryNew.value,
  FTP_HOST_NEW: ftpHostNew.value,
  TYPE_NEW: typeNew.value,
  index,
  SRC: details.value.map((detail) => detail.SRC),
  TIMEOUT: details.value.map((detail) => detail.TIMEOUT),
  DATA_TIMEOUT: details.value.map((detail) => detail.DATA_TIMEOUT),
  IS_EFFECTIVE: details.value.map((detail) => detail.IS_EFFECTIVE),
  CONNECTION: details.value.map((detail) => detail.CONNECTION),
  ACTION: details.value.map((detail) => detail.ACTION),
  RETRY: details.value.map((detail) => detail.RETRY),
  FTP_HOST: details.value.map((detail) => detail.FTP_HOST),
  TYPE: details.value.map((detail) => detail.TYPE),
})

const insertRow = async () => {
  connectionNew.value = connectionNew.value.toUpperCase()
  const { valid } = await validate({ schema: insertSchema })
  if (!valid) return

  const response = await http.post('ata08120/insert', buildFormPayload())
  if (isSuccess(response.data)) {
    $q.notify({ message: '公會通報設定新增成功' })
  }
  await fetchPage()
}

const deleteRow = (index) => {
  selectedIndex.value = index
  $q.dialog({
    title: '確認',
    message: '請確認是否要刪除?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const response = await http.post('ata08120/delete', buildFormPayload(index))
    if (isSuccess(response.data)) {
      $q.notify({ message: '公會通報設定刪除成功' })
    }
    await fetchPage()
  })
}

const updateRow = async (index) => {
  selectedIndex.value = index
  details.value[index].CONNECTION = details.value[index].CONNECTION.toUpperCase()
  const { valid } = await validate({ schema: updateSchema })
  if (!valid) return

  $q.dialog({
    title: '確認',
    message: '請確認是否要修改?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const response = await http.post('ata08120/update', buildFormPayload(index))
    if (isSuccess(response.data)) {
      $q.notify({ message: '公會通報設定修改成功' })
    }
    await fetchPage()
  })
}

const rowError = (index, field) => errors.value?.[`details[${index}].${field}`] ?? ''

onMounted(fetchPage)
</script>

<style scoped>
.ata08120 {
  min-height: 100%;
  background-color: #f0fbc6;
  color: #000;
}

.ata08120__header {
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  align-items: center;
  min-height: 30px;
  padding: 2px 8px;
}

.ata08120__bullet {
  font-size: 8px;
  text-align: center;
}

.ata08120__screen-code {
  text-align: right;
}

.ata08120__main {
  min-height: calc(100vh - 30px);
  padding: 0 4px;
}

.ata08120__panel {
  width: 97%;
  margin: 0 auto;
  padding: 1px;
  background-color: #036;
}

.ata08120__panel-title {
  min-height: 27px;
  padding: 5px;
}

.ata08120__content {
  overflow-x: auto;
  padding: 5px;
  background-color: #fff;
}

.ata08120__table {
  min-width: 86rem;
  border-radius: 0;
}

.ata08120__table--details {
  margin-top: 2rem;
}

.ata08120__table :deep(table) {
  table-layout: fixed;
}

.ata08120__table :deep(th),
.ata08120__table :deep(td) {
  padding: 2px;
  text-align: center;
  white-space: normal;
}

.ata08120__table :deep(th:nth-child(1)) {
  width: 12%;
}

.ata08120__table :deep(th:nth-child(2)) {
  width: 8%;
}

.ata08120__table :deep(th:nth-child(n + 3)) {
  width: 10%;
}

.ata08120__actions {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.ata08120__instructions {
  margin-top: 4px;
  line-height: 1.5;
}
</style>