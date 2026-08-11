<template>
  <div class="afy10300">
    <header class="afy10300__header subTitle">
      <span>公會補通報作業</span>
      <span>畫面編號：AFY10300</span>
    </header>

    <section>
      <p class="tbBox2">公會補通報作業</p>
      <q-markup-table dense bordered class="afy10300__table">
        <tbody>
          <tr v-for="row in queryRows" :key="row[0].name">
            <template v-for="field in row" :key="field.name">
              <td class="tbYellow afy10300__label">{{ field.label }}</td>
              <td class="tbYellow2 afy10300__field">
                <q-select
                  v-if="field.kind === 'select'"
                  v-model="fieldModels[field.name].value"
                  dense
                  outlined
                  emit-value
                  map-options
                  :options="field.options"
                  :error="!!errors[field.name]"
                  :error-message="errors[field.name]"
                />
                <q-input
                  v-else
                  v-model="fieldModels[field.name].value"
                  dense
                  outlined
                  :maxlength="field.maxlength"
                  :error="!!errors[field.name]"
                  :error-message="errors[field.name]"
                />
              </td>
            </template>
            <td
              v-if="row[0].name === 'queryNo'"
              rowspan="2"
              class="tbYellow2 afy10300__query-action"
            >
              <q-btn dense label="F2查詢" @click="query" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>

    <section v-if="isEditVisible">
      <p class="tbBox2">資料編輯區</p>
      <q-markup-table dense bordered class="afy10300__table">
        <tbody>
          <tr v-for="row in editRows" :key="row[0].name">
            <template v-for="field in row" :key="field.name">
              <td class="tbYellow afy10300__label">
                <span :class="{ 'text-negative': field.emphasis }">{{ field.label }}</span>
              </td>
              <td class="tbYellow2 afy10300__field">
                <template v-if="!field.requiresRType || isRType">
                  <span v-if="field.kind === 'display'">
                    {{ displayValues[field.name] }}
                  </span>
                  <q-select
                    v-else-if="field.kind === 'select'"
                    v-model="fieldModels[field.name].value"
                    dense
                    outlined
                    emit-value
                    map-options
                    :options="field.options ? field.options() : []"
                    :error="!!errors[field.name]"
                    :error-message="errors[field.name]"
                  />
                  <q-input
                    v-else
                    v-model="fieldModels[field.name].value"
                    dense
                    outlined
                    :maxlength="field.maxlength"
                    :error="!!errors[field.name]"
                    :error-message="errors[field.name]"
                  />
                </template>
              </td>
            </template>
          </tr>
          <tr>
            <td colspan="10" class="tbYellow2 text-center">
              <q-btn dense label="F9修改" @click="edit" />
              <q-btn dense label="F10取消" class="q-ml-sm" @click="cancelEdit" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>

    <section v-if="showQuery">
      <div class="afy10300__result-table">
        <q-markup-table dense bordered>
          <thead>
            <tr>
              <th class="tbBlue">序號</th>
              <th class="tbBlue">選取</th>
              <th class="tbBlue">結果</th>
              <th class="tbBlue">保額</th>
              <th class="tbBlue">通報方式</th>
              <th class="tbBlue">被保人ID</th>
              <th class="tbBlue">被保人生日</th>
              <th class="tbBlue">被保人性別</th>
              <th class="tbBlue">商品代碼</th>
              <th class="tbBlue">險種分類</th>
              <th class="tbBlue">險種</th>
              <th class="tbBlue">保單狀況</th>
              <th class="tbBlue">契約生效日</th>
              <th class="tbBlue">契約滿期日</th>
              <th class="tbBlue">保單狀況生效日期</th>
              <th v-if="isRType" class="tbBlue">要保書填寫日期</th>
              <th class="tbBlue">通報時間</th>
              <th class="tbBlue">錯誤原因</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in resultRows" :key="row._rowKey">
              <td class="tbYellow2 text-center">{{ row._sequence }}</td>
              <td class="tbYellow2 text-center">
                <q-radio
                  v-model="selectedRowKey"
                  dense
                  :val="row._rowKey"
                  @update:model-value="selectRow(row)"
                />
              </td>
              <td class="tbYellow2 text-center">{{ row.LIA_STATUS_DESC }}</td>
              <td class="tbYellow2 text-center">{{ row.FACE_AMT }}</td>
              <td class="tbYellow2 text-center">{{ row.INSR_TYPE_DESC }}</td>
              <td class="tbYellow2 text-center">{{ row.I_ID }}</td>
              <td class="tbYellow2 text-center">{{ row.I_BIRTHDAY_ROC }}</td>
              <td class="tbYellow2 text-center">{{ row.I_GENDER_DESC }}</td>
              <td class="tbYellow2 text-center">{{ row.PROD_CODE }}</td>
              <td class="tbYellow2 text-center">{{ row.POLICY_DUTY }}</td>
              <td class="tbYellow2 text-center">{{ row.PROD_KIND }}</td>
              <td class="tbYellow2 text-center">{{ row.STATUS }}</td>
              <td class="tbYellow2 text-center">{{ row.ISSUE_DATE_ROC }}</td>
              <td class="tbYellow2 text-center">{{ row.LPS_DATE_ROC }}</td>
              <td class="tbYellow2 text-center">{{ row.LST_CHG_DATE_ROC }}</td>
              <td v-if="isRType" class="tbYellow2 text-center">{{ row.SIGN_DATE }}</td>
              <td class="tbYellow2">{{ row.OUTPUT_TIME }}</td>
              <td class="tbYellow2">{{ row.MEMO }}</td>
            </tr>
            <tr>
              <td :colspan="isRType ? 18 : 17" class="tbYellow2 text-center">
                <q-btn dense label="Excel匯出" @click="exportFile" />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </section>

    <section>
      <q-markup-table dense bordered class="afy10300__table">
        <tbody>
          <tr>
            <td class="tbYellow afy10300__upload-label">檔案匯入</td>
            <td class="tbYellow2">
              <q-file
                v-model="fieldModels.uploadFile.value"
                dense
                outlined
                accept=".xlsx"
                :error="!!errors.uploadFile"
                :error-message="errors.uploadFile"
              />
            </td>
            <td class="tbYellow2 text-center">
              <q-btn dense label="F8檔案上傳" @click="importFile" />
              <q-btn dense label="即時大批通報" class="q-ml-sm" @click="executeGroupReport" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>

    <section>
      <q-markup-table dense bordered class="afy10300__table">
        <tbody>
          <tr>
            <td class="tbYellow3">
              1.用大批匯入時，請先叫出資料後按Excel匯出鈕→修改錯誤及處理結果(千萬記得保單狀況生效日也要調整)→至檔案匯入→按選擇檔案鈕→選擇檔案→按F8檔案上傳。
              <span class="text-negative">（限用Google Chrome）</span>
            </td>
          </tr>
          <tr><td class="tbYellow3">2.Excel表格內容說明</td></tr>
          <tr><td class="tbYellow3 afy10300__instruction">A.處理結果: 輸入代碼如：用此畫面修正及上傳時輸入8。</td></tr>
          <tr><td class="tbYellow3 afy10300__instruction">（7:不需通報、8重新通報、9至公會系統人工通）</td></tr>
          <tr><td class="tbYellow3 afy10300__instruction">B.結果:目前僅會顯示3(通報失敗)</td></tr>
          <tr><td class="tbYellow3 afy10300__instruction">C.保額:此為投保保額，目前僅出壽險會顯示</td></tr>
          <tr><td class="tbYellow3">3.按F8檔案上傳鈕:收件批次每半小時、承保隔天通報</td></tr>
          <tr><td class="tbYellow3">4.即時大批通報鈕:將目前所有待通報之案件(收、承保)立即通報公會</td></tr>
          <tr>
            <td class="tbYellow3">
              5.請參考公會補通報操作手冊、新通報平台系統操作手冊，
              <a href="#" @click.prevent="openOperationManual">點我開啟</a>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>
  </div>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import { mixed, object, string } from 'yup'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $cathayAxios = inject('$cathayAxios')
const $q = useQuasar()
const router = useRouter()

const QUERY_NO_OPTIONS = [
  { label: '失敗檔 (可不輸入失敗檔序號)', value: '0' },
  { label: '保單號碼', value: '1' },
  { label: '被保人ID', value: '2' },
]
const ERROR_CODE_OPTIONS = ['99', '36', '37', '39', '40', '45'].map((value) => ({
  label: value === '99' ? '全部' : value,
  value,
}))
const INSR_TYPE_OPTIONS = [
  { label: '承保', value: 'L' },
  { label: '收件', value: 'R' },
]
const PROD_TYPE_OPTIONS = [
  { label: '個險', value: 'AT' },
  { label: '團險', value: 'BG' },
  { label: '意外險', value: 'CB' },
]
const PROC_STATUS_OPTIONS = [
  { label: '未處理', value: '1' },
  { label: '已處理', value: '2' },
  { label: '全部', value: '0' },
]
const GENDER_OPTIONS = [
  { label: '男', value: '1' },
  { label: '女', value: '2' },
]
const POLICY_CAT_OPTIONS = [
  { label: '個人', value: '1' },
  { label: '團體', value: '2' },
]
const PAY_TYPE_OPTIONS = [
  { label: '無', value: '0' },
  { label: '公費', value: '1' },
  { label: '自費', value: '2' },
]

const FORM_FIELD_NAMES = [
  'queryNo', 'idNo', 'insrDate', 'errorCode', 'insrType', 'prodType', 'procStatus',
  'uploadFile', 'iName', 'iId', 'iBirthday', 'iGender', 'mainPolicyNo', 'policyNo',
  'oiuInd', 'saleChnl', 'prodCode', 'policyCat', 'policyDuty', 'prodKind', 'payType',
  'payAmt1', 'payAmt2', 'payAmt3', 'payAmt4', 'payAmt5', 'payAmt6', 'payAmt7',
  'payAmt8', 'payAmt9', 'payAmt10', 'payAmt11', 'payAmt12', 'payAmt13', 'payAmt14',
  'payAmt15', 'payAmt16', 'payAmt17', 'payAmt18', 'payAmt19', 'issueDate',
  'issueTime', 'lpsDate', 'lpsTime', 'prem', 'payFreq', 'payPeriod', 'status',
  'lstChgDate', 'lstChgTime', 'aName', 'aId', 'aBirthday', 'relation', 'signDate',
  'brokType', 'liaStatus', 'updateTime', 'oldIId', 'oldIBirthday', 'oldPolicyNo',
  'oldPolicyCat', 'oldPolicyDuty', 'oldProdKind', 'oldStatus', 'oldLstChgDate',
  'oldUpdateTime', 'regQueryNo', 'regIdNo', 'regInsrDate', 'regInsrType',
  'regErrorCode', 'regProdType', 'regProcStatus', 'regRadioNum', 'showEdit',
]
const initialValues = Object.fromEntries(FORM_FIELD_NAMES.map((name) => [name, '']))
Object.assign(initialValues, {
  queryNo: '0',
  errorCode: '99',
  insrType: 'L',
  prodType: 'AT',
  procStatus: '1',
  uploadFile: null,
})

const { errors, resetForm, setValues, validate, values } = useForm({
  initialValues,
  validateOnMount: false,
})
const fieldModels = Object.fromEntries(
  FORM_FIELD_NAMES.map((name) => [name, useField(name).value]),
)

const showQuery = ref(false)
const isRType = ref(false)
const isEditVisible = ref(false)
const selectedRowKey = ref('')
const resultRows = ref([])
const saleChnlOptions = ref([])
const policyDutyOptions = ref([])
const prodKindOptions = ref([])
const payFreqOptions = ref([])
const relationOptions = ref([])
const brokTypeOptions = ref([])
const liaStatusOptions = ref([])
const displayValues = reactive({
  insrTypeDesc: '',
  outputTime: '',
  serNo: '',
  updateSrc: '',
  memo: '',
})

const queryRows = [
  [
    { name: 'queryNo', label: '查詢方式', kind: 'select', options: QUERY_NO_OPTIONS },
    { name: 'idNo', label: '失敗檔/保單號碼/被保人ID', kind: 'input' },
    { name: 'insrDate', label: '通報日期', kind: 'input', maxlength: 7 },
    { name: 'errorCode', label: '錯誤代碼', kind: 'select', options: ERROR_CODE_OPTIONS },
  ],
  [
    { name: 'insrType', label: '收承方式', kind: 'select', options: INSR_TYPE_OPTIONS },
    { name: 'prodType', label: '商品屬性', kind: 'select', options: PROD_TYPE_OPTIONS },
    { name: 'procStatus', label: '處理狀態', kind: 'select', options: PROC_STATUS_OPTIONS },
  ],
]

const editFields = [
  { name: 'insrTypeDesc', label: '通報方式', kind: 'display' },
  { name: 'iName', label: '被保險人姓名', kind: 'input' },
  { name: 'iId', label: '被保人ID', kind: 'input' },
  { name: 'iBirthday', label: '被保人生日', kind: 'input', maxlength: 7 },
  { name: 'iGender', label: '被保險人性別', kind: 'select', options: () => GENDER_OPTIONS },
  { name: 'mainPolicyNo', label: '主約保單號碼', kind: 'input' },
  { name: 'policyNo', label: '保單號碼', kind: 'input' },
  { name: 'oiuInd', label: '來源別OIU', kind: 'input' },
  { name: 'saleChnl', label: '銷售通路別', kind: 'select', options: () => saleChnlOptions.value },
  { name: 'prodCode', label: '商品代碼', kind: 'input' },
  { name: 'policyCat', label: '保單分類', kind: 'select', options: () => POLICY_CAT_OPTIONS },
  { name: 'policyDuty', label: '險種分類', kind: 'select', options: () => policyDutyOptions.value },
  { name: 'prodKind', label: '險種', kind: 'select', options: () => prodKindOptions.value },
  { name: 'payType', label: '公、自費件', kind: 'select', options: () => PAY_TYPE_OPTIONS },
  { name: 'payAmt1', label: '身故', kind: 'input' },
  { name: 'payAmt2', label: '完全失能', kind: 'input' },
  { name: 'payAmt3', label: '失能扶助金', kind: 'input' },
  { name: 'payAmt4', label: '特定事故', kind: 'input' },
  { name: 'payAmt5', label: '初次罹患', kind: 'input' },
  { name: 'payAmt6', label: '醫療限額', kind: 'input' },
  { name: 'payAmt7', label: '醫療限額自負', kind: 'input' },
  { name: 'payAmt8', label: '醫療日期', kind: 'input' },
  { name: 'payAmt9', label: '住院手術', kind: 'input' },
  { name: 'payAmt10', label: '住院門診', kind: 'input' },
  { name: 'payAmt11', label: '門診日額', kind: 'input' },
  { name: 'payAmt12', label: '重大疾/傷病', kind: 'input' },
  { name: 'payAmt13', label: '重大燒燙傷', kind: 'input' },
  { name: 'payAmt14', label: '癌症療養', kind: 'input' },
  { name: 'payAmt15', label: '出院療養', kind: 'input' },
  { name: 'payAmt16', label: '失能', kind: 'input' },
  { name: 'payAmt17', label: '喪葬費用', kind: 'input' },
  { name: 'payAmt18', label: '銜接原醫療限額之自負額', kind: 'input' },
  { name: 'payAmt19', label: '分開給付', kind: 'input' },
  { name: 'issueDate', label: '契約生效日期', kind: 'input', maxlength: 7 },
  { name: 'issueTime', label: '契約生效時分(旅平險)', kind: 'input' },
  { name: 'lpsDate', label: '契約滿期日期', kind: 'input', maxlength: 7 },
  { name: 'lpsTime', label: '契約滿期時分', kind: 'input' },
  { name: 'prem', label: '保費', kind: 'input' },
  { name: 'payFreq', label: '保費繳別', kind: 'select', options: () => payFreqOptions.value },
  { name: 'payPeriod', label: '保費繳費年期', kind: 'input' },
  { name: 'status', label: '保單狀況', kind: 'input' },
  { name: 'lstChgDate', label: '保單狀況生效日期', kind: 'input', emphasis: true, maxlength: 7 },
  { name: 'lstChgTime', label: '保單狀況生效時分', kind: 'input' },
  { name: 'aName', label: '要保人姓名', kind: 'input' },
  { name: 'aId', label: '要保人身分證號碼', kind: 'input' },
  { name: 'aBirthday', label: '要保人生日', kind: 'input', maxlength: 7 },
  { name: 'relation', label: '要被保人關係', kind: 'select', options: () => relationOptions.value },
  { name: 'signDate', label: '要保書填寫日(收件才需要)', kind: 'input', emphasis: true, maxlength: 7, requiresRType: true },
  { name: 'brokType', label: '保經代類別', kind: 'select', options: () => brokTypeOptions.value, requiresRType: true },
  { name: 'liaStatus', label: '通報狀態', kind: 'select', options: () => liaStatusOptions.value, emphasis: true },
  { name: 'outputTime', label: '通報日期', kind: 'display' },
  { name: 'serNo', label: '公會通報序號', kind: 'display' },
  { name: 'updateSrc', label: '資料來源', kind: 'display' },
  { name: 'memo', label: '失敗原因', kind: 'display' },
]
const editRows = []
for (let offset = 0; offset < editFields.length; offset += 5) {
  editRows.push(editFields.slice(offset, offset + 5))
}

const requiredText = (name, message, min = 1, max) => string().test({
  name,
  message,
  test: (value) => {
    const length = value?.length ?? 0
    return length >= min && (max === undefined || length <= max)
  },
})
const requiredNumber = (name, message) => string().test({
  name,
  message,
  test: (value) => value !== undefined
    && value !== null
    && value.length > 0
    && !Number.isNaN(Number(value))
    && Number(value) >= 0,
})

// TODO: TECHNICAL_GAP: 驗證民國日期格式、曆法正確性與年份下限
const isROCdate = (...args) => {}
const requiredRocDate = (name, message) => string().test({
  name,
  message,
  test: (value) => !!value && isROCdate(value),
})

const querySchema = object({
  idNo: string().test({
    name: 'queryIdNo',
    message: '失敗檔/保單號碼/被保人ID不得為空白',
    test: function (value) {
      return this.parent.queryNo === '0' || !!value?.trim()
    },
  }),
  insrDate: string().test({
    name: 'queryInsrDate',
    message: '通報日期非正確的日期格式',
    test: (value) => !value?.trim() || isROCdate(value.trim()),
  }),
})
const editSchema = object({
  iId: requiredText('iId', '被保人不得為空值', 1, 10),
  iBirthday: requiredRocDate('iBirthday', '被保人生日不得為空值、且必須為日期格式'),
  mainPolicyNo: requiredText('mainPolicyNo', '主約保單號碼不得為空值', 1, 20),
  policyNo: string().test({
    name: 'policyNoPrefix',
    message: '保單號碼開頭不同於主約保單號碼',
    test: function (value) {
      return (value ?? '').startsWith(this.parent.mainPolicyNo ?? '')
    },
  }),
  payAmt1: requiredNumber('payAmt1', '身故不得為空值、且需為數字'),
  payAmt2: requiredNumber('payAmt2', '完全失能不得為空值、且需為數字'),
  payAmt3: requiredNumber('payAmt3', '失能扶助金不得為空值、且需為數字'),
  payAmt4: requiredNumber('payAmt4', '特定事故不得為空值、且需為數字'),
  payAmt5: requiredNumber('payAmt5', '醫療限額不得為空值、且需為數字'),
  payAmt6: requiredNumber('payAmt6', '醫療限額自負不得為空值、且需為數字'),
  payAmt7: requiredNumber('payAmt7', '醫療日額不得為空值、且需為數字'),
  payAmt8: requiredNumber('payAmt8', '住院手術不得為空值、且需為數字'),
  payAmt9: requiredNumber('payAmt9', '住院門診不得為空值、且需為數字'),
  payAmt11: requiredNumber('payAmt11', '門診日額不得為空值、且需為數字'),
  payAmt12: requiredNumber('payAmt12', '重大疾傷病不得為空值、且需為數字'),
  payAmt13: requiredNumber('payAmt13', '重大燒燙傷不得為空值、且需為數字'),
  payAmt14: requiredNumber('payAmt14', '癌症療養不得為空值、且需為數字'),
  payAmt15: requiredNumber('payAmt15', '出院療養不得為空值、且需為數字'),
  payAmt16: requiredNumber('payAmt16', '失能不得為空值、且需為數字'),
  payAmt17: requiredNumber('payAmt17', '喪葬費用不得為空值、且需為數字'),
  payAmt18: requiredNumber('payAmt18', '術接原醫療限額之自負額不得為空值、且需為數字'),
  payAmt19: requiredNumber('payAmt19', '分期給付不得為空值、且需為數字'),
  issueDate: requiredRocDate('issueDate', '契約生效日不得為空值、且必須為日期格式'),
  lpsDate: requiredRocDate('lpsDate', '契約滿期日不得為空值、且必須為日期格式'),
  lstChgDate: requiredRocDate('lstChgDate', '保單狀況生效日不得為空值、且必須為日期格式'),
  prem: requiredNumber('prem', '保費不得為空值、且需為數字'),
  aId: requiredText('aId', '要保人不得為空值', 1, 10),
  aBirthday: requiredRocDate('aBirthday', '要保人生日不得為空值、且必須為日期格式'),
  liaStatus: string().test({
    name: 'liaStatus',
    message: '通報狀態需選擇',
    test: (value) => /[0-9]/.test(value ?? ''),
  }),
  signDate: string().test({
    name: 'signDate',
    message: '要保書填寫日必須為日期格式',
    test: (value) => !isRType.value || !(Number(value) > 0) || isROCdate(value),
  }),
})
const uploadSchema = object({
  uploadFile: mixed()
    .required('請選擇檔案')
    .test('xlsxFile', '檔案格式必須為xlsx檔', (file) => (
      file instanceof File && /\.xlsx$/i.test(file.name)
    )),
})

const normalizeOptions = (options = []) => options.map((option) => ({
  label: `${option.key} ${option.value}`,
  value: option.key,
}))
const buildRowKey = (row) => [
  row.I_ID,
  row.I_BIRTHDAY,
  row.POLICY_NO,
  row.POLICY_CAT,
  row.POLICY_DUTY,
  row.PROD_KIND,
  row.STATUS,
  row.LST_CHG_DATE,
  row.UPDATE_TIME,
].join('|')

const applyServerData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new TypeError('AFY10300 response data must be an object')
  }

  resetForm({ values: initialValues })
  setValues({
    queryNo: String(data.queryNo ?? '0'),
    idNo: data.idNo ?? '',
    insrDate: '',
    errorCode: String(data.errorCode ?? '99'),
    insrType: data.insrType ?? 'L',
    prodType: data.prodType ?? 'AT',
    procStatus: String(data.procStatus ?? '1'),
    regQueryNo: data.regQueryNo ?? '',
    regIdNo: data.regIdNo ?? '',
    regInsrDate: data.regInsrDate ?? '',
    regInsrType: data.regInsrType ?? '',
    regErrorCode: data.regErrorCode ?? '',
    regProdType: data.regProdType ?? '',
    regProcStatus: data.regProcStatus ?? '',
    regRadioNum: data.regRadioNum ?? '',
    showEdit: data.showEdit ?? '',
    iBirthday: data.I_BIRTHDAY ?? '',
    lpsDate: data.LPS_DATE ?? '',
    aBirthday: data.A_BIRTHDAY ?? '',
    signDate: data.SIGN_DATE ?? '',
  })

  showQuery.value = Boolean(data.showQuery)
  isRType.value = Boolean(data.isRType)
  saleChnlOptions.value = normalizeOptions(data.SALE_CHNL_OPTION)
  policyDutyOptions.value = normalizeOptions(data.POLICY_DUTY_OPTION)
  prodKindOptions.value = normalizeOptions(data.PROD_KIND_OPTION)
  payFreqOptions.value = normalizeOptions(data.PAY_FREQ_OPTION)
  relationOptions.value = normalizeOptions(data.RELATION_OPTION)
  brokTypeOptions.value = normalizeOptions(data.BROKTYPE_OPTION)
  liaStatusOptions.value = normalizeOptions(data.LIA_STATUS_OPTION)

  resultRows.value = (data.resultList ?? []).map((row, rowNumber) => ({
    ...row,
    _radioNum: String(rowNumber),
    _rowKey: buildRowKey(row),
    _sequence: rowNumber + 1,
  }))
  selectedRowKey.value = ''
  isEditVisible.value = false

  if (data.showEdit === 'Y') {
    const selectedRow = resultRows.value.find(
      (row) => row._radioNum === String(data.regRadioNum),
    )
    if (selectedRow) {
      selectedRowKey.value = selectedRow._rowKey
      selectRow(selectedRow)
    }
  }
}

const selectRow = (row) => {
  setValues({
    regRadioNum: row._radioNum,
    iId: row.I_ID ?? '',
    iName: row.I_NAME ?? '',
    iBirthday: row.I_BIRTHDAY_ROC ?? '',
    iGender: row.I_GENDER ?? '',
    mainPolicyNo: row.MAIN_POLICY_NO ?? '',
    policyNo: row.POLICY_NO ?? '',
    oiuInd: row.OIU_IND ?? '',
    saleChnl: row.SALE_CHNL ?? '',
    prodCode: row.PROD_CODE ?? '',
    policyCat: row.POLICY_CAT ?? '',
    policyDuty: row.POLICY_DUTY ?? '',
    prodKind: row.PROD_KIND ?? '',
    payType: row.PAY_TYPE ?? '',
    payAmt1: row.PAY_AMT1 ?? '',
    payAmt2: row.PAY_AMT2 ?? '',
    payAmt3: row.PAY_AMT3 ?? '',
    payAmt4: row.PAY_AMT4 ?? '',
    payAmt5: row.PAY_AMT5 ?? '',
    payAmt6: row.PAY_AMT6 ?? '',
    payAmt7: row.PAY_AMT7 ?? '',
    payAmt8: row.PAY_AMT8 ?? '',
    payAmt9: row.PAY_AMT9 ?? '',
    payAmt10: row.PAY_AMT10 ?? '',
    payAmt11: row.PAY_AMT11 ?? '',
    payAmt12: row.PAY_AMT12 ?? '',
    payAmt13: row.PAY_AMT13 ?? '',
    payAmt14: row.PAY_AMT14 ?? '',
    payAmt15: row.PAY_AMT15 ?? '',
    payAmt16: row.PAY_AMT16 ?? '',
    payAmt17: row.PAY_AMT17 ?? '',
    payAmt18: row.PAY_AMT18 ?? '',
    payAmt19: row.PAY_AMT19 ?? '',
    issueDate: row.ISSUE_DATE_ROC ?? '',
    issueTime: row.ISSUE_TIME ?? '',
    lpsDate: row.LPS_DATE_ROC ?? '',
    lpsTime: row.LPS_TIME ?? '',
    prem: row.PREM ?? '',
    payFreq: row.PAY_FREQ ?? '',
    payPeriod: row.PAY_PERIOD ?? '',
    // Preserve the legacy editor mapping, which sources STATUS from PAY_PERIOD.
    status: row.PAY_PERIOD ?? '',
    lstChgDate: row.LST_CHG_DATE_ROC ?? '',
    lstChgTime: row.LST_CHG_TIME ?? '',
    aName: row.A_NAME ?? '',
    aId: row.A_ID ?? '',
    aBirthday: row.A_BIRTHDAY_ROC ?? '',
    relation: row.RELATION ?? '',
    liaStatus: row.LIA_STATUS ?? '',
    updateTime: row.UPDATE_TIME ?? '',
    signDate: row.SIGN_DATE_ROC ?? '',
    brokType: row.BROKTYPE ?? '',
    oldIId: row.I_ID ?? '',
    oldIBirthday: row.I_BIRTHDAY ?? '',
    oldPolicyNo: row.POLICY_NO ?? '',
    oldPolicyCat: row.POLICY_CAT ?? '',
    oldPolicyDuty: row.POLICY_DUTY ?? '',
    oldProdKind: row.PROD_KIND ?? '',
    oldStatus: row.STATUS ?? '',
    oldLstChgDate: row.LST_CHG_DATE ?? '',
    oldUpdateTime: row.UPDATE_TIME ?? '',
  })
  Object.assign(displayValues, {
    insrTypeDesc: row.INSR_TYPE_DESC ?? '',
    outputTime: row.OUTPUT_TIME ?? '',
    serNo: row.SER_NO ?? '',
    updateSrc: row.UPDATE_SRC ?? '',
    memo: row.MEMO ?? '',
  })
  isEditVisible.value = true
}

const buildMainPayload = () => ({
  queryNo: values.queryNo,
  idNo: values.idNo,
  insrDate: values.insrDate,
  errorCode: values.errorCode,
  insrType: values.insrType,
  prodType: values.prodType,
  procStatus: values.procStatus,
  regQueryNo: values.regQueryNo,
  regIdNo: values.regIdNo,
  regInsrDate: values.regInsrDate,
  regInsrType: values.regInsrType,
  regErrorCode: values.regErrorCode,
  regProdType: values.regProdType,
  regProcStatus: values.regProcStatus,
  regRadioNum: values.regRadioNum,
  item: values.regRadioNum,
  showEdit: values.showEdit,
  I_NAME: values.iName,
  I_ID: values.iId,
  I_BIRTHDAY: values.iBirthday,
  I_GENDER: values.iGender,
  MAIN_POLICY_NO: values.mainPolicyNo,
  POLICY_NO: values.policyNo,
  OIU_IND: values.oiuInd,
  SALE_CHNL: values.saleChnl,
  PROD_CODE: values.prodCode,
  POLICY_CAT: values.policyCat,
  POLICY_DUTY: values.policyDuty,
  PROD_KIND: values.prodKind,
  PAY_TYPE: values.payType,
  PAY_AMT1: values.payAmt1,
  PAY_AMT2: values.payAmt2,
  PAY_AMT3: values.payAmt3,
  PAY_AMT4: values.payAmt4,
  PAY_AMT5: values.payAmt5,
  PAY_AMT6: values.payAmt6,
  PAY_AMT7: values.payAmt7,
  PAY_AMT8: values.payAmt8,
  PAY_AMT9: values.payAmt9,
  PAY_AMT10: values.payAmt10,
  PAY_AMT11: values.payAmt11,
  PAY_AMT12: values.payAmt12,
  PAY_AMT13: values.payAmt13,
  PAY_AMT14: values.payAmt14,
  PAY_AMT15: values.payAmt15,
  PAY_AMT16: values.payAmt16,
  PAY_AMT17: values.payAmt17,
  PAY_AMT18: values.payAmt18,
  PAY_AMT19: values.payAmt19,
  ISSUE_DATE: values.issueDate,
  ISSUE_TIME: values.issueTime,
  LPS_DATE: values.lpsDate,
  LPS_TIME: values.lpsTime,
  PREM: values.prem,
  PAY_FREQ: values.payFreq,
  PAY_PERIOD: values.payPeriod,
  STATUS: values.status,
  LST_CHG_DATE: values.lstChgDate,
  LST_CHG_TIME: values.lstChgTime,
  A_NAME: values.aName,
  A_ID: values.aId,
  A_BIRTHDAY: values.aBirthday,
  RELATION: values.relation,
  SIGN_DATE: values.signDate,
  BROKTYPE: values.brokType,
  LIA_STATUS: values.liaStatus,
  UPDATE_TIME: values.updateTime,
  OLD_I_ID: values.oldIId,
  OLD_I_BIRTHDAY: values.oldIBirthday,
  OLD_POLICY_NO: values.oldPolicyNo,
  OLD_POLICY_CAT: values.oldPolicyCat,
  OLD_POLICY_DUTY: values.oldPolicyDuty,
  OLD_PROD_KIND: values.oldProdKind,
  OLD_STATUS: values.oldStatus,
  OLD_LST_CHG_DATE: values.oldLstChgDate,
  OLD_UPDATE_TIME: values.oldUpdateTime,
})

const query = async () => {
  const { valid } = await validate({ schema: querySchema })
  if (!valid) return

  const res = await $cathayAxios.post('afy10300/query', buildMainPayload())
  if (res.returnCode !== 0) return
  applyServerData(res.data)
}

const edit = async () => {
  const { valid } = await validate({ schema: editSchema })
  if (!valid) return

  const res = await $cathayAxios.post('afy10300/edit', buildMainPayload())
  if (res.returnCode !== 0) return
  applyServerData(res.data)
}

const cancelEdit = () => {
  setValues({ showEdit: 'N' })
  selectedRowKey.value = ''
  isEditVisible.value = false
}

// TODO: TECHNICAL_GAP: 交付後端產製的受保護下載檔案
const downloadFile = (...args) => {}
const exportFile = async () => {
  const res = await $cathayAxios.post('afy10300/export', {
    regQueryNo: values.regQueryNo,
    regIdNo: values.regIdNo,
    regInsrDate: values.regInsrDate,
    regInsrType: values.regInsrType,
    regErrorCode: values.regErrorCode,
    regProdType: values.regProdType,
    regProcStatus: values.regProcStatus,
  })
  if (res.returnCode !== 0) return
  downloadFile(res.data)
}

const importFile = async () => {
  const { valid } = await validate({ schema: uploadSchema })
  if (!valid) return

  const payload = new FormData()
  payload.append('uploadFile', values.uploadFile)
  const res = await $cathayAxios.post('afy10300/import', payload)
  if (res.returnCode !== 0) return
  applyServerData(res.data)
}

const executeGroupReport = () => {
  if (values.insrType === 'R') {
    $q.notify({ type: 'warning', message: '僅可選擇承保通報(收件類每30分鐘一次)' })
    return
  }

  const insrTypeText = INSR_TYPE_OPTIONS.find((option) => option.value === values.insrType)?.label ?? ''
  const prodTypeText = PROD_TYPE_OPTIONS.find((option) => option.value === values.prodType)?.label ?? ''
  $q.dialog({
    title: '確認',
    message: `確認要執行【${prodTypeText}${insrTypeText}】即時大批通報嗎？`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const res = await $cathayAxios.post('afy10300/execute', buildMainPayload())
    if (res.returnCode !== 0) return
    applyServerData(res.data)
  })
}

const openOperationManual = () => {
  // TODO: PENDING_CONVERSION: AAZ00404
  router.push({
    name: 'AAZ00404',
    state: {
      SYS_NO: 'AT',
      SUB_SYS_NO: 'A0',
      FUNC_ID: 'ATA00611',
      isShowQueryItem: 'R',
    },
  })
}

const handleHotKey = (event) => {
  const actions = {
    F2: query,
    F8: importFile,
    F9: isEditVisible.value ? edit : undefined,
    F10: isEditVisible.value ? cancelEdit : undefined,
  }
  const action = actions[event.key]
  if (!action) return
  event.preventDefault()
  action()
}

onMounted(async () => {
  window.addEventListener('keydown', handleHotKey)

  // TODO: OVER_APPROXIMATION: 待複查 JSP 注入的查詢條件、選項清單、結果資料與頁面顯示旗標是否皆由後端提供
  const res = await $cathayAxios.post('afy10300/prompt', {})
  if (res.returnCode !== 0) return
  applyServerData(res.data)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleHotKey)
})
</script>

<style scoped>
.afy10300 {
  width: 100%;
  min-width: 960px;
}

.afy10300__header {
  display: flex;
  justify-content: space-between;
  min-height: 30px;
  padding: 4px 12px;
  background-color: #f0fbc6;
}

.afy10300__table {
  width: 100%;
  margin-bottom: 8px;
}

.afy10300__label {
  width: 8%;
  text-align: center;
}

.afy10300__field {
  width: 12%;
}

.afy10300__query-action {
  width: 10%;
  text-align: center;
}

.afy10300__result-table {
  width: 100%;
  margin-bottom: 8px;
  overflow-x: auto;
}

.afy10300__result-table th,
.afy10300__result-table td {
  white-space: nowrap;
}

.afy10300__upload-label {
  width: 20%;
  text-align: center;
}

.afy10300__instruction {
  padding-left: 48px;
}
</style>
