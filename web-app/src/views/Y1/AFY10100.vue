<template>
  <q-page class="afy10100-page">
    <header class="page-title row items-center justify-between q-px-sm">
      <strong>● 公會通報查詢</strong>
      <span>畫面編號：AFY10100</span>
    </header>

    <main class="q-pa-sm">
      <section class="legacy-section">
        <div class="section-title">公會通報查詢</div>
        <div class="query-grid">
          <div class="field-label">身份證字號/統一編號</div>
          <div class="field-value query-id-field">
            <q-input
              v-model="inputId"
              dense
              outlined
              :error="!!errors.inputId"
              :error-message="errors.inputId"
            />
            <q-checkbox
              v-if="pageData.isReturn"
              v-model="isReturnChecked"
              dense
              label="同步更新公會回檔狀態"
            />
          </div>
          <div class="field-label">契約角色</div>
          <div class="field-value">
            <q-select v-model="role" dense outlined emit-value map-options :options="roleOptions" />
          </div>
          <div class="field-label">保單效力</div>
          <div class="field-value">
            <q-select v-model="status" dense outlined emit-value map-options :options="statusOptions" />
          </div>
          <div class="query-action">
            <q-btn dense label="F2查詢" @click="doQuery" />
          </div>

          <div class="field-label">姓名</div>
          <div class="field-value">{{ pageData.dataMap.NAME }}</div>
          <div class="field-label">生日</div>
          <div class="field-value">{{ pageData.dataMap.BIRTHDAY }}</div>
          <div class="field-label">公會資料取回日期</div>
          <div class="field-value grid-span-2">{{ pageData.dataMap.LAST_UPDATE_TIME }}</div>
        </div>
      </section>

      <section class="legacy-section">
        <div class="section-title">保障項目彙整</div>
        <div class="table-scroll">
          <q-markup-table dense bordered separator="cell" class="summary-table">
            <thead>
              <tr>
                <template v-for="group in 3" :key="group">
                  <th>項目</th>
                  <th>合計</th>
                  <th>同業合計</th>
                  <th>收件</th>
                  <th>承保</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in benefitRows" :key="row[0].key">
                <template v-for="item in row" :key="item.key">
                  <td class="item-cell">{{ item.label }}</td>
                  <td>{{ formatNumber(pageData.dataMap[`${item.key}_Tot`]) }}</td>
                  <td>{{ formatNumber(pageData.dataMap[`${item.key}_TotSame`]) }}</td>
                  <td>{{ formatNumber(pageData.dataMap[`${item.key}_Rr`]) }}</td>
                  <td>{{ formatNumber(pageData.dataMap[`${item.key}_LN`]) }}</td>
                </template>
                <template v-for="emptyGroup in 3 - row.length" :key="`empty-${emptyGroup}`">
                  <td class="item-cell"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </template>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </section>

      <section class="legacy-section">
        <div class="section-title">保費資料彙整</div>
        <div class="table-scroll">
          <q-markup-table dense bordered separator="cell" class="summary-table premium-table">
            <thead>
              <tr>
                <template v-for="group in 3" :key="group">
                  <th>項目</th>
                  <th>合計</th>
                  <th>收件</th>
                  <th>承保</th>
                </template>
                <th>操作者</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <template v-for="item in premiumItems" :key="item.key">
                  <td class="item-cell">{{ item.label }}</td>
                  <td>{{ formatNumber(pageData.dataMap[`${item.key}_Tot`]) }}</td>
                  <td>{{ formatNumber(pageData.dataMap[`${item.key}_Rr`]) }}</td>
                  <td>{{ formatNumber(pageData.dataMap[`${item.key}_LN`]) }}</td>
                </template>
                <td>{{ pageData.dataMap.UPDATE_ID }}</td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </section>

      <section v-if="selectedRowKey" class="legacy-section">
        <div class="section-title">資料編輯區</div>
        <div class="edit-grid">
          <template v-for="field in displayFields" :key="field.key">
            <div class="field-label">{{ field.label }}</div>
            <div class="field-value">{{ displayValue(field.key) }}</div>
          </template>

          <template v-for="item in benefitItems" :key="item.key">
            <div class="field-label">{{ item.label }}</div>
            <div class="field-value">
              <q-input v-model="editModel[item.key]" dense outlined />
            </div>
          </template>

          <template v-for="field in editableTextFields" :key="field.key">
            <div class="field-label">{{ field.label }}</div>
            <div class="field-value">
              <q-input v-model="editModel[field.key]" dense outlined />
            </div>
          </template>

          <div class="field-label">資料寫入時間</div>
          <div class="field-value">{{ selectedInputTime }}</div>
          <div class="field-label">被保險人性別</div>
          <div class="field-value">
            <q-select v-model="editModel.I_GENDER" dense outlined emit-value map-options :options="genderOptions" />
          </div>
          <div class="field-label">公、自費件</div>
          <div class="field-value">
            <q-select v-model="editModel.PAY_TYPE" dense outlined emit-value map-options :options="payTypeOptions" />
          </div>
          <div class="field-label">來源別</div>
          <div class="field-value">{{ selectedDescriptions.oiuInd }}</div>
          <div class="field-label">銷售通路</div>
          <div class="field-value">{{ selectedDescriptions.saleChannel }}</div>
          <div class="field-label">商品代碼</div>
          <div class="field-value">{{ selectedDescriptions.productCode }}</div>
          <div class="field-label">公會取回序號</div>
          <div class="field-value">{{ editModel.SER_NO }}</div>
        </div>
        <div class="row justify-center q-gutter-sm q-pa-sm">
          <q-btn dense label="F9修改" @click="doEdit" />
          <q-btn dense label="F10刪除" @click="doDelete" />
          <q-btn dense label="取消" @click="clearSelection" />
        </div>
      </section>

      <section class="legacy-section">
        <div class="section-title">新制通報資料明細</div>
        <q-table
          v-model:pagination="tablePagination"
          dense
          bordered
          flat
          separator="cell"
          row-key="__rowKey"
          :columns="resultColumns"
          :rows="resultRows"
          :rows-per-page-options="[0]"
          hide-bottom
          class="result-table"
        >
          <template #body-cell-selection="props">
            <q-td :props="props">
              <q-radio
                v-model="selectedRowKey"
                dense
                :val="props.row.__rowKey"
                @update:model-value="selectItem(props.row)"
              />
            </q-td>
          </template>
          <template #body-cell-insuranceType="props">
            <q-td :props="props">
              <a href="#" @click.prevent="openDetail(props.row)">
                {{ props.row.INSR_TYPE }} {{ pageData.insuranceTypeMap[props.row.INSR_TYPE] }}
              </a>
            </q-td>
          </template>
          <template #body-cell-payAmount1="props">
            <q-td :props="props">{{ formatNumber(props.row.PAY_AMT1) }}</q-td>
          </template>
          <template #body-cell-payAmount6="props">
            <q-td :props="props">{{ formatNumber(props.row.PAY_AMT6) }}</q-td>
          </template>
          <template #body-cell-payAmount8="props">
            <q-td :props="props">{{ formatNumber(props.row.PAY_AMT8) }}</q-td>
          </template>
        </q-table>
        <div v-if="pageData.isAllow" class="row justify-center q-pa-sm">
          <q-btn dense label="F8即時取回公會資料" @click="doAsyncCheck" />
        </div>
      </section>

      <section class="notes-section">
        <div v-for="note in notes" :key="note">{{ note }}</div>
      </section>
    </main>

    <q-dialog v-model="detailDialogOpen" full-width>
      <!-- TODO: PENDING_CONVERSION: AFY10100Detail -->
      <!-- <AFY10100Detail v-bind="detailParameters" /> -->
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useField, useForm } from 'vee-validate'
import { object, string } from 'yup'
import http from '@/assets/plugins/axios'

const $q = useQuasar()

const requiredInputId = {
  name: 'requiredInputId',
  message: '身份證字號/統一編號：不得為空值',
  test: (value) => !!value?.trim()
}
const asyncSchema = object({ inputId: string().test(requiredInputId) })
const { errors, setValues, validate } = useForm({
  validationSchema: asyncSchema,
  initialValues: { inputId: '' },
  validateOnMount: false
})
const { value: inputId } = useField('inputId')

const role = ref('I')
const status = ref('Y')
const isReturnChecked = ref(false)
const selectedRowKey = ref(null)
const selectedItemValue = ref('')
const selectedInputTime = ref('')
const detailDialogOpen = ref(false)
const detailParameters = ref({})
const tablePagination = ref({ sortBy: null, descending: false, page: 1, rowsPerPage: 0 })

const pageData = reactive({
  isReturn: false,
  isAllow: false,
  dataMap: {},
  resultList: [],
  insuranceTypeMap: {},
  oiuIndDesc: {},
  saleChnlDesc: {}
})

const benefitItems = [
  { key: 'PAY_AMT1', label: '身故' },
  { key: 'PAY_AMT2', label: '完全失能或最高級失能' },
  { key: 'PAY_AMT3', label: '失能扶助金' },
  { key: 'PAY_AMT4', label: '特定事故' },
  { key: 'PAY_AMT5', label: '初次罹患' },
  { key: 'PAY_AMT6', label: '醫療限額' },
  { key: 'PAY_AMT7', label: '醫療限額自負' },
  { key: 'PAY_AMT8', label: '醫療日額' },
  { key: 'PAY_AMT9', label: '住院手術' },
  { key: 'PAY_AMT10', label: '門診手術' },
  { key: 'PAY_AMT11', label: '門診' },
  { key: 'PAY_AMT12', label: '重大疾/傷病' },
  { key: 'PAY_AMT13', label: '重大燒燙傷' },
  { key: 'PAY_AMT14', label: '癌症療養' },
  { key: 'PAY_AMT15', label: '出院療養' },
  { key: 'PAY_AMT16', label: '喪失工作能力' },
  { key: 'PAY_AMT17', label: '喪葬費用' },
  { key: 'PAY_AMT18', label: '銜接原醫療限額之自負額' },
  { key: 'PAY_AMT19', label: '分期給付' }
]

const benefitRows = computed(() => {
  const rows = []
  for (let offset = 0; offset < benefitItems.length; offset += 3) {
    rows.push(benefitItems.slice(offset, offset + 3))
  }
  return rows
})

const premiumItems = [
  { key: 'YEAR_PREM', label: '年繳保費' },
  { key: 'ONCE_PREM', label: '躉繳保費' },
  { key: 'FLEX_PREM', label: '超額(彈性)保險費' }
]

const displayFields = [
  { key: 'INSR_TYPE', label: '通報方式' },
  { key: 'CMNY_CODE', label: '公司別' },
  { key: 'I_ID', label: '被保人ID' },
  { key: 'I_BIRTHDAY', label: '被保人生日' },
  { key: 'POLICY_NO', label: '保單號碼' },
  { key: 'POLICY_CAT', label: '保單分類' },
  { key: 'POLICY_DUTY', label: '險種分類' },
  { key: 'PROD_KIND', label: '險種' },
  { key: 'STATUS', label: '保單狀況' },
  { key: 'LST_CHG_DATE', label: '保單狀況生效日期(受理理賠日、身故日)' },
  { key: 'MAIN_POLICY_NO', label: '主約保單號碼' },
  { key: 'ISSUE_DATE', label: '契約生效日' },
  { key: 'ISSUE_TIME', label: '契約生效時分' },
  { key: 'LPS_DATE', label: '契約滿期日' },
  { key: 'LPS_TIME', label: '契約滿期時分' },
  { key: 'SIGN_DATE', label: '要保書填寫日' },
  { key: 'PREM', label: '保費' },
  { key: 'PAY_FREQ', label: '保費繳別' },
  { key: 'PAY_PERIOD', label: '保費繳費年期' },
  { key: 'LST_CHG_TIME', label: '保單狀況生效時分' }
]

const editableTextFields = [
  { key: 'BROKTYPE', label: '保經代分類' },
  { key: 'A_NAME', label: '要保人姓名' },
  { key: 'A_ID', label: '要保人身分證號碼' },
  { key: 'A_BIRTHDAY', label: '要保人出生日期' },
  { key: 'RELATION', label: '要保人與被保險人關係' }
]

const editKeys = [
  'TBL_NAME', ...displayFields.map(({ key }) => key), ...benefitItems.map(({ key }) => key),
  ...editableTextFields.map(({ key }) => key), 'UPDATE_TIME', 'SER_NO', 'I_GENDER', 'PAY_TYPE'
]
const editModel = reactive(Object.fromEntries(editKeys.map((key) => [key, ''])))
const selectedDescriptions = reactive({ oiuInd: '', saleChannel: '', productCode: '' })

const roleOptions = [
  { label: '被保人', value: 'I' },
  { label: '要保人', value: 'A' }
]
const statusOptions = [
  { label: '有效', value: 'Y' },
  { label: '無效', value: 'N' },
  { label: '全部', value: 'A' }
]
const genderOptions = [
  { label: '男', value: '1' },
  { label: '女', value: '2' }
]
const payTypeOptions = [
  { label: '無', value: '0' },
  { label: '公費', value: '1' },
  { label: '自費', value: '2' }
]

const resultColumns = [
  { name: 'sequence', label: '序號', field: '__sequence', align: 'center' },
  { name: 'selection', label: '選取', field: '__rowKey', align: 'center' },
  { name: 'insuranceType', label: '通報方式', field: 'INSR_TYPE', align: 'left', sortable: true },
  { name: 'companyName', label: '公司別', field: 'COMPANY_NAME', align: 'left', sortable: true },
  { name: 'policyNumber', label: '保單號碼', field: 'POLICY_NO', align: 'center', sortable: true },
  { name: 'saleChannel', label: '銷售通路', field: 'SALE_CHNL', align: 'left' },
  { name: 'productCode', label: '商品代碼', field: 'PROD_CODE', align: 'left' },
  { name: 'policyCategory', label: '保單分類', field: 'POLICY_CAT', align: 'left' },
  { name: 'policyDuty', label: '險種分類', field: 'POLICY_DUTY', align: 'left' },
  { name: 'productKind', label: '險種', field: 'PROD_KIND', align: 'left', sortable: true },
  { name: 'policyStatus', label: '保單狀況', field: 'STATUS', align: 'left' },
  { name: 'payAmount1', label: '身故保額', field: 'PAY_AMT1', align: 'left' },
  { name: 'payAmount6', label: '醫療限額', field: 'PAY_AMT6', align: 'left' },
  { name: 'payAmount8', label: '醫療日額', field: 'PAY_AMT8', align: 'left' },
  { name: 'issueDate', label: '契約生效日', field: 'ISSUE_DATE', align: 'left', sortable: true },
  { name: 'lapseDate', label: '契約滿期日', field: 'LPS_DATE', align: 'left' },
  { name: 'applicantName', label: '要保人姓名', field: 'A_NAME', align: 'left' },
  { name: 'updateTime', label: '通報時間', field: 'UPDATE_TIME', align: 'left' }
]

const rowKey = (row) => [
  row.TBL_NAME, row.INSR_TYPE, row.CMNY_CODE, row.POLICY_NO, row.UPDATE_TIME, row.SER_NO
].join('|')

const resultRows = computed(() => pageData.resultList.map((row, rowIndex) => ({
  ...row,
  __sequence: rowIndex + 1,
  __rowKey: rowKey(row)
})))

const notes = [
  '1. 銷售通路:1網路投保 2業務員3保經、保代 4電話行銷 5機場櫃檯',
  '2. 保單分類：1個人；2團體',
  '3. 險種分類：1人壽保險；2傷害保險；3健康保險 4.年金保險。',
  '4. 險種：01一般；02特定；03投資型；04日額型；05實支實付型；06日額或實支實付擇一型；07手術型；08重大疾病；09帳戶型；10長期看護型；11喪失工作能力；12防癌；13旅平險；14微型；15微型實支實付；16小額終老保險；17.失能扶助保險；18.登山綜合保險；19定期人壽保險(不含一年期)；20海域活動綜合保險；21一年期',
  '5. 繳別：1躉繳；2年繳；3半年繳；4季繳；5月繳；6彈性繳；9繳費期滿',
  '6. 保單狀況： 收件: 01有效；06未承保取消件；07契約註銷；11滿期(契約到期)；12鍵值欄位通報錯誤終止；15通報更正; 50一○七條/一○七條之一承保資料；51一○七條理賠資料（未滿14足歲之未成年人）；52一○七條/一○七條之一理賠資料（精神障礙或其他心智缺陷/受監護宣告尚未撤銷）。承保: 01有效；02增額；03減額；04展期；05繳清；06契約撤銷；07停效; 10解除契約；11滿期(契約到期)；12鍵值欄位通報錯誤終止；20終止1:由要保人提出終止契約效力;21.終止2:主被保險人死亡，其他被保險人附同時終止或完全失能或理賠給付後終止附約;30被保險人因自然死身故；31被保險人因意外身故;32被保險人因其他原因故;50一○七條/一○七條之一承保資料；51一○七條理賠資料（未滿14足歲之未成年人）；52一○七條/一○七條之一理賠資料（精神障礙或其他心智缺陷/受監護宣告尚未撤銷）。',
  '7. 保障及保費彙整欄位，金額依頁面上的筆數加總，含本公司及產、壽險通報資料。',
  '8. 即時捉取公會資料：輸入身份證字號∕統一證號，按F8即時捉取公會資料鈕'
]

const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') return ''
  const number = Number(value)
  return Number.isNaN(number) ? value : new Intl.NumberFormat('en-US', { maximumFractionDigits: 20 }).format(number)
}

const displayValue = (key) => editModel[key]

// TODO: TECHNICAL_GAP: 將標準作業訊息集合呈現於共通通知區
const displayMessage = (...args) => {}

const applyPageData = (data = {}) => {
  pageData.isReturn = Boolean(data.isReturn)
  pageData.isAllow = Boolean(data.isAllow)
  pageData.dataMap = data.dataMap ?? {}
  pageData.resultList = data.resultList ?? []
  pageData.insuranceTypeMap = data.INSRMAP ?? {}
  pageData.oiuIndDesc = data.oiuIndDesc ?? {}
  pageData.saleChnlDesc = data.saleChnlDesc ?? {}
  setValues({ inputId: data.inputId ?? '' })
  role.value = data.role ?? 'I'
  status.value = data.status ?? 'Y'
  clearSelection()
}

const requestSucceeded = (response) => String(response.data.returnCode) === '0'

const postAction = async (action, payload) => {
  const response = await http.post(`afy10100/${action}`, payload)
  if (!requestSucceeded(response)) return false
  applyPageData(response.data.data)
  return true
}

const formPayload = () => ({
  inputId: inputId.value,
  IS_RETURN: isReturnChecked.value ? 'Y' : '',
  role: role.value,
  status: status.value,
  item: selectedItemValue.value,
  ...Object.fromEntries(editKeys.map((key) => [key, editModel[key]]))
})

const doQuery = async () => {
  await postAction('query', formPayload())
}

const doDelete = async () => {
  await postAction('delete', formPayload())
}

const doEdit = async () => {
  await postAction('edit', formPayload())
}

const doAsync = async () => {
  await postAction('async', formPayload())
}

const doAsyncCheck = async () => {
  const { valid } = await validate({ schema: asyncSchema })
  if (!valid) return

  const response = await http.post('afy10100/asyncCheckId', { inputId: inputId.value })
  if (!requestSucceeded(response)) return
  if (response.data.data?.isIdError !== 'Y') {
    await doAsync()
    return
  }

  $q.dialog({
    message: `輸入值 ${inputId.value} 不符身份證/統一證號檢核規則，請確認，是否要繼續作業?`,
    cancel: true,
    persistent: true
  }).onOk(doAsync)
}

const selectItem = (row) => {
  selectedRowKey.value = row.__rowKey
  selectedItemValue.value = String(row.__sequence - 1)
  editKeys.forEach((key) => {
    editModel[key] = row[key] ?? ''
  })
  selectedInputTime.value = row.INPUT_TIME ?? ''
  selectedDescriptions.oiuInd = pageData.oiuIndDesc[row.OIU_IND] ?? ''
  selectedDescriptions.saleChannel = pageData.saleChnlDesc[row.SALE_CHNL] ?? ''
  selectedDescriptions.productCode = row.PROD_CODE ?? ''
  // TODO: UNKNOWN_SYNTAX: parseEUDC();
}

const clearSelection = () => {
  selectedRowKey.value = null
  selectedItemValue.value = ''
  selectedInputTime.value = ''
  editKeys.forEach((key) => {
    editModel[key] = ''
  })
  selectedDescriptions.oiuInd = ''
  selectedDescriptions.saleChannel = ''
  selectedDescriptions.productCode = ''
}

const openDetail = (row) => {
  detailParameters.value = Object.fromEntries([
    ...displayFields.map(({ key }) => key),
    ...benefitItems.map(({ key }) => key),
    ...editableTextFields.map(({ key }) => key),
    'UPDATE_TIME', 'SER_NO', 'I_GENDER', 'PAY_TYPE', 'OIU_IND', 'SALE_CHNL', 'PROD_CODE'
  ].map((key) => [key, row[key] ?? '']))
  detailDialogOpen.value = true
}

const handleHotKey = (event) => {
  const actions = {
    F2: doQuery,
    F8: pageData.isAllow ? doAsyncCheck : null,
    F9: selectedRowKey.value ? doEdit : null,
    F10: selectedRowKey.value ? doDelete : null
  }
  const action = actions[event.key]
  if (!action) return
  event.preventDefault()
  action()
}

onMounted(async () => {
  window.addEventListener('keydown', handleHotKey)
  const response = await http.post('afy10100/prompt', {})
  if (!requestSucceeded(response)) return
  applyPageData(response.data.data)
  displayMessage()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleHotKey)
})
</script>

<style scoped>
.afy10100-page {
  min-width: 1180px;
  background-color: #f0fbc6;
  color: #111;
  font-family: Arial, sans-serif;
  font-size: 12px;
}

.page-title {
  position: sticky;
  top: 0;
  z-index: 9;
  min-height: 30px;
  border: 1px solid #003366;
  background-color: #f0fbc6;
}

.legacy-section {
  margin-bottom: 2px;
  border: 1px solid #003366;
  background-color: #fff;
}

.section-title {
  min-height: 24px;
  padding: 4px 6px;
  border-bottom: 1px solid #003366;
  background-color: #f0fbc6;
  font-weight: 700;
}

.query-grid {
  display: grid;
  grid-template-columns: 130px minmax(220px, 1fr) 80px minmax(140px, 0.6fr) 80px minmax(140px, 0.6fr) 100px;
  gap: 1px;
  padding: 1px;
  background-color: #003366;
}

.edit-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(100px, 1fr) minmax(110px, 1fr));
  gap: 1px;
  padding: 1px;
  background-color: #003366;
}

.field-label,
.field-value,
.query-action {
  min-height: 34px;
  padding: 3px 5px;
}

.field-label {
  display: flex;
  align-items: center;
  background-color: #fff4b8;
}

.field-value {
  display: flex;
  align-items: center;
  min-width: 0;
  background-color: #fffde7;
}

.field-value :deep(.q-field),
.field-value :deep(.q-select) {
  width: 100%;
}

.query-id-field {
  gap: 8px;
}

.query-action {
  display: flex;
  grid-column: 7;
  grid-row: 1 / span 2;
  align-items: center;
  justify-content: center;
  background-color: #fffde7;
}

.grid-span-2 {
  grid-column: span 2;
}

.table-scroll {
  overflow-x: auto;
}

.summary-table,
.premium-table,
.result-table {
  min-width: 1160px;
}

.summary-table th,
.result-table :deep(th) {
  background-color: #d8e8f8;
  color: #111;
  font-weight: 700;
  text-align: center;
}

.summary-table td {
  min-width: 66px;
  background-color: #fffde7;
  text-align: center;
}

.summary-table .item-cell {
  min-width: 112px;
  background-color: #d8e8f8;
}

.result-table :deep(td) {
  background-color: #fffde7;
}

.notes-section {
  border: 1px solid #003366;
  background-color: #fafbe1;
}

.notes-section > div {
  padding: 4px 6px;
  border-bottom: 1px solid #d8d8a8;
}

.notes-section > div:last-child {
  border-bottom: 0;
}
</style>