<template>
  <div class="ata08110">
    <div class="subTitle ata08110__title">
      <span class="ata08110__title-mark">●</span>
      <span>公會通報設定</span>
      <span class="ata08110__screen-number">畫面編號：ATA08110</span>
    </div>

    <section class="tbBox2 ata08110__content">
      <p class="ata08110__section-title">公會通報設定</p>

      <q-markup-table dense bordered class="tbBox2 ata08110__table">
        <thead>
          <tr class="tbBlue">
            <th class="ata08110__source-name-column">契約來源中文</th>
            <th class="ata08110__source-column">契約來源</th>
            <th>等待時間(毫秒)</th>
            <th>是否通算</th>
            <th class="ata08110__url-column">通算網址</th>
            <th>累計最大保障(萬)</th>
            <th>連線等候時間(毫秒)</th>
            <th>重試次數</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr class="tbYellow2">
            <td></td>
            <td>
              <q-input
                v-model="newSrc"
                dense
                outlined
                hide-bottom-space
                :error="!!errors['newEntry.src']"
                :error-message="errors['newEntry.src']"
              />
            </td>
            <td>
              <q-input
                v-model="newTimeout"
                dense
                outlined
                hide-bottom-space
                :error="!!errors['newEntry.timeout']"
                :error-message="errors['newEntry.timeout']"
                @change="checkNewNumber(newTimeout, 'newEntry.timeout', '等待時間')"
              />
            </td>
            <td>
              <q-select
                v-model="newCallAsso"
                dense
                outlined
                emit-value
                map-options
                :options="CALL_ASSO_OPTIONS"
              />
            </td>
            <td>
              <q-input
                v-model="newUrl"
                dense
                outlined
                hide-bottom-space
                :error="!!errors['newEntry.url']"
                :error-message="errors['newEntry.url']"
              />
            </td>
            <td>
              <q-input
                v-model="newMaxAmt"
                dense
                outlined
                hide-bottom-space
                :error="!!errors['newEntry.maxAmt']"
                :error-message="errors['newEntry.maxAmt']"
                @change="checkNewNumber(newMaxAmt, 'newEntry.maxAmt', '累計最大保障')"
              />
            </td>
            <td>
              <q-input
                v-model="newConnectTimeout"
                dense
                outlined
                hide-bottom-space
                :error="!!errors['newEntry.connectTimeout']"
                :error-message="errors['newEntry.connectTimeout']"
                @change="
                  checkNewNumber(
                    newConnectTimeout,
                    'newEntry.connectTimeout',
                    '連線等候時間'
                  )
                "
              />
            </td>
            <td>
              <q-input
                v-model="newRetry"
                dense
                outlined
                hide-bottom-space
                :error="!!errors['newEntry.retry']"
                :error-message="errors['newEntry.retry']"
                @change="checkNewNumber(newRetry, 'newEntry.retry', '重試次數')"
              />
            </td>
            <td>
              <q-btn
                dense
                label="新增"
                :disable="isBusy"
                :loading="pendingAction === 'insert'"
                @click="insertDetail"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <q-markup-table dense bordered class="tbBox2 ata08110__table">
        <thead>
          <tr class="tbBlue">
            <th class="ata08110__source-name-column">契約來源中文</th>
            <th class="ata08110__source-column">契約來源</th>
            <th>等待時間(毫秒)</th>
            <th>是否通算</th>
            <th class="ata08110__url-column">通算網址</th>
            <th>累計最大保障(萬)</th>
            <th>連線等候時間(毫秒)</th>
            <th>重試次數</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(detail, index) in details"
            :key="detail.src"
            class="tbYellow2"
          >
            <td>{{ detail.srcName }}</td>
            <td>{{ detail.src }}</td>
            <td>
              <q-input
                v-model="detail.timeout"
                dense
                outlined
                hide-bottom-space
                :error="isDetailFieldInvalid(index, 'timeout')"
                @change="checkDetailNumber(index, 'timeout', '等待時間')"
              />
            </td>
            <td>
              <q-select
                v-model="detail.callAsso"
                dense
                outlined
                emit-value
                map-options
                :options="CALL_ASSO_OPTIONS"
              />
            </td>
            <td>
              <q-input
                v-model="detail.url"
                dense
                outlined
                hide-bottom-space
                :error="isDetailFieldInvalid(index, 'url')"
              />
            </td>
            <td>
              <q-input
                v-model="detail.maxAmt"
                dense
                outlined
                hide-bottom-space
                :error="isDetailFieldInvalid(index, 'maxAmt')"
                @change="checkDetailNumber(index, 'maxAmt', '累計最大保障')"
              />
            </td>
            <td>
              <q-input
                v-model="detail.connectTimeout"
                dense
                outlined
                hide-bottom-space
                :error="isDetailFieldInvalid(index, 'connectTimeout')"
                @change="
                  checkDetailNumber(index, 'connectTimeout', '連線等候時間')
                "
              />
            </td>
            <td>
              <q-input
                v-model="detail.retry"
                dense
                outlined
                hide-bottom-space
                :error="isDetailFieldInvalid(index, 'retry')"
                @change="checkDetailNumber(index, 'retry', '重試次數')"
              />
            </td>
            <td class="ata08110__action-cell">
              <q-btn
                dense
                label="刪除"
                :disable="isBusy"
                :loading="pendingAction === `delete-${index}`"
                @click="deleteDetail(index)"
              />
              <q-btn
                dense
                label="修改"
                :disable="isBusy"
                :loading="pendingAction === `update-${index}`"
                @click="updateDetail(index)"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { array, object, string } from 'yup'
import { useQuasar } from 'quasar'

const CALL_ASSO_OPTIONS = [
  { label: 'Y', value: 'Y' },
  { label: 'N', value: 'N' }
]
const REQUIRED_UPDATE_FIELDS = [
  { key: 'timeout', label: '等待時間' },
  { key: 'url', label: '通算網址' },
  { key: 'maxAmt', label: '累計最大保障' },
  { key: 'connectTimeout', label: '連線等候時間' },
  { key: 'retry', label: '重試次數' }
]
const NUMERIC_UPDATE_FIELDS = [
  { key: 'timeout', label: '等待時間' },
  { key: 'maxAmt', label: '累計最大保障' },
  { key: 'connectTimeout', label: '連線等候時間' },
  { key: 'retry', label: '重試次數' }
]

const $cathayAxios = inject('$cathayAxios')
const $q = useQuasar()
const pendingAction = ref('')
const selectedIndex = ref('')
const invalidDetailFields = ref([])
const isBusy = computed(() => pendingAction.value !== '')

const requiredText = (message) => ({
  name: 'requiredText',
  message,
  test: (value) => !!value?.trim()
})
const numericText = (message) => ({
  name: 'numericText',
  message,
  test: (value) => !value || !Number.isNaN(Number(value))
})
const newEntrySchema = object({
  src: string().test(requiredText('契約來源必須輸入')),
  timeout: string()
    .test(requiredText('等待時間必須輸入'))
    .test(numericText('等待時間限定只能輸入數字')),
  callAsso: string(),
  url: string().test(requiredText('通算網址必須輸入')),
  maxAmt: string()
    .test(requiredText('累計最大保障必須輸入'))
    .test(numericText('累計最大保障限定只能輸入數字')),
  connectTimeout: string()
    .test(requiredText('連線等候時間必須輸入'))
    .test(numericText('連線等候時間限定只能輸入數字')),
  retry: string()
    .test(requiredText('重試次數必須輸入'))
    .test(numericText('重試次數限定只能輸入數字'))
})
const insertValidationSchema = object({
  newEntry: newEntrySchema,
  details: array()
})

const {
  errors,
  resetField,
  setValues,
  validate
} = useForm({
  validationSchema: insertValidationSchema,
  initialValues: {
    newEntry: {
      src: '',
      timeout: '',
      callAsso: 'Y',
      url: '',
      maxAmt: '',
      connectTimeout: '',
      retry: ''
    },
    details: []
  },
  validateOnMount: false
})
const { value: newSrc } = useField('newEntry.src')
const { value: newTimeout } = useField('newEntry.timeout')
const { value: newCallAsso } = useField('newEntry.callAsso')
const { value: newUrl } = useField('newEntry.url')
const { value: newMaxAmt } = useField('newEntry.maxAmt')
const { value: newConnectTimeout } = useField('newEntry.connectTimeout')
const { value: newRetry } = useField('newEntry.retry')
const { value: details } = useField('details')

const showAlert = (message) => new Promise((resolve) => {
  $q.dialog({
    title: '提示',
    message,
    persistent: true
  }).onOk(resolve)
})

const confirmAction = (message) => new Promise((resolve) => {
  $q.dialog({
    title: '確認',
    message,
    cancel: true,
    persistent: true
  })
    .onOk(() => resolve(true))
    .onCancel(() => resolve(false))
})

const showValidationErrors = async () => {
  const message = Object.values(errors.value).join('\n')
  if (message) await showAlert(message)
  await showAlert('紅底文字框為必須輸入。')
}

const getInvalidFields = (index) => {
  const detail = details.value[index]
  if (!detail) return REQUIRED_UPDATE_FIELDS.map(({ key }) => key)
  return REQUIRED_UPDATE_FIELDS
    .filter(({ key }) => !detail[key]?.trim())
    .map(({ key }) => key)
}

const getInvalidNumbers = (index) => {
  const detail = details.value[index]
  if (!detail) return []
  return NUMERIC_UPDATE_FIELDS
    .filter(({ key }) => (
      detail[key] && Number.isNaN(Number(detail[key]))
    ))
    .map(({ key }) => key)
}

const createUpdateValidationSchema = (index) => object({
  details: array()
    .test({
      name: 'requiredUpdateDetail',
      message: '修改欄位必須輸入',
      test: function (value) {
        const missingFields = getInvalidFields(index)
        if (missingFields.length === 0) return true
        const labels = REQUIRED_UPDATE_FIELDS
          .filter(({ key }) => missingFields.includes(key))
          .map(({ label }) => label)
        return this.createError({
          message: `${labels.join('、')}必須輸入`
        })
      }
    })
    .test({
      name: 'numericUpdateDetail',
      message: '數值欄位限定只能輸入數字',
      test: function (value) {
        const invalidNumbers = getInvalidNumbers(index)
        if (invalidNumbers.length === 0) return true
        const labels = NUMERIC_UPDATE_FIELDS
          .filter(({ key }) => invalidNumbers.includes(key))
          .map(({ label }) => label)
        return this.createError({
          message: `${labels.join('、')}限定只能輸入數字`
        })
      }
    })
})

const isDetailFieldInvalid = (index, field) => (
  selectedIndex.value === index && invalidDetailFields.value.includes(field)
)

const checkNewNumber = async (value, fieldName, label) => {
  if (!Number.isNaN(Number(value))) return
  await showAlert(`${label}限定只能輸入數字，請重新輸入。`)
  resetField(fieldName)
}

const checkDetailNumber = async (index, fieldName, label) => {
  const value = details.value[index][fieldName]
  if (!Number.isNaN(Number(value))) return
  await showAlert(`${label}限定只能輸入數字，請重新輸入。`)
  const nextDetails = details.value.map((detail, detailIndex) => (
    detailIndex === index
      ? { ...detail, [fieldName]: '' }
      : detail
  ))
  resetField('details', { value: nextDetails })
}

const buildFormPayload = () => ({
  SRC_NEW: newSrc.value,
  TIMEOUT_NEW: newTimeout.value,
  CALL_ASSO_NEW: newCallAsso.value,
  URL_NEW: newUrl.value,
  MAXAMT_NEW: newMaxAmt.value,
  CONNECT_TIMEOUT_NEW: newConnectTimeout.value,
  RETRY_NEW: newRetry.value,
  index: selectedIndex.value,
  SRC: details.value.map((detail) => detail.src),
  TIMEOUT: details.value.map((detail) => detail.timeout),
  CALL_ASSO: details.value.map((detail) => detail.callAsso),
  URL: details.value.map((detail) => detail.url),
  MAXAMT: details.value.map((detail) => detail.maxAmt),
  CONNECT_TIMEOUT: details.value.map((detail) => detail.connectTimeout),
  RETRY: details.value.map((detail) => detail.retry)
})

const fetchPageData = async () => {
  const res = await $cathayAxios.post('ata08110/prompt', {})
  if (res.returnCode !== 0) return
  setValues({
    newEntry: {
      src: '',
      timeout: '',
      callAsso: 'Y',
      url: '',
      maxAmt: '',
      connectTimeout: '',
      retry: ''
    },
    details: res.data.details
  })
  selectedIndex.value = ''
  invalidDetailFields.value = []
  displayMessage(res.data.messages)
}

const submitAction = async (action, successMessage) => {
  const res = await $cathayAxios.post(
    `ata08110/${action}`,
    buildFormPayload()
  )
  if (res.returnCode === 0) await showAlert(successMessage)
  await fetchPageData()
}

const insertDetail = async () => {
  selectedIndex.value = ''
  const { valid } = await validate({ schema: insertValidationSchema })
  if (!valid) {
    await showValidationErrors()
    return
  }

  pendingAction.value = 'insert'
  try {
    await submitAction('insert', '公會通報設定新增成功')
  } finally {
    pendingAction.value = ''
  }
}

const deleteDetail = async (index) => {
  selectedIndex.value = index
  const agreed = await confirmAction('請確認是否要刪除?')
  if (!agreed) return

  pendingAction.value = `delete-${index}`
  try {
    await submitAction('delete', '公會通報設定刪除成功')
  } finally {
    pendingAction.value = ''
  }
}

const updateDetail = async (index) => {
  selectedIndex.value = index
  invalidDetailFields.value = [
    ...getInvalidFields(index),
    ...getInvalidNumbers(index)
  ]
  const { valid } = await validate({
    schema: createUpdateValidationSchema(index)
  })
  if (!valid) {
    await showValidationErrors()
    return
  }

  const agreed = await confirmAction('請確認是否要修改?')
  if (!agreed) return

  pendingAction.value = `update-${index}`
  try {
    await submitAction('update', '公會通報設定修改成功')
  } finally {
    pendingAction.value = ''
  }
}

// TODO: OVER_APPROXIMATION: 待複查頁面初始清單與作業訊息是否皆為伺服器端注入資料
onMounted(fetchPageData)
</script>

<style scoped>
.ata08110 {
  min-height: 100%;
  background-color: #f0fbc6;
}

.ata08110__title {
  display: flex;
  align-items: center;
  min-height: 30px;
  padding: 2px;
}

.ata08110__title-mark {
  width: 20px;
  text-align: center;
}

.ata08110__screen-number {
  margin-left: auto;
}

.ata08110__content {
  width: 97%;
  margin: 30px auto 0;
  border: 1px solid #036;
}

.ata08110__section-title {
  margin: 0;
  padding: 5px;
}

.ata08110__table {
  width: 100%;
}

.ata08110__table + .ata08110__table {
  margin-top: 2rem;
}

.ata08110__table th,
.ata08110__table td {
  text-align: center;
  vertical-align: middle;
}

.ata08110__source-name-column {
  width: 12%;
}

.ata08110__source-column {
  width: 7%;
}

.ata08110__url-column {
  width: 21%;
}

.ata08110__action-cell {
  white-space: nowrap;
}

.ata08110__action-cell .q-btn + .q-btn {
  margin-left: 0.25rem;
}
</style>
