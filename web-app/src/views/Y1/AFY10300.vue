<template>
  <q-page class="afy10300 q-pa-sm">
    <div class="afy10300__title row items-center justify-between q-px-sm q-py-xs">
      <div class="text-weight-bold">公會補通報作業</div>
      <div>畫面編號：AFY10300</div>
    </div>

    <section class="afy10300__content q-pa-sm">
      <div class="afy10300__section-title q-mb-xs">公會補通報作業</div>

      <div class="afy10300__table-wrap">
        <q-markup-table dense bordered flat class="afy10300__table">
          <tbody>
            <tr>
              <th scope="row">查詢方式</th>
              <td>
                <q-select
                  v-model="queryNo"
                  :options="queryOptions"
                  :error="Boolean(errors.queryNo)"
                  :error-message="errors.queryNo"
                  dense
                  emit-value
                  map-options
                  outlined
                />
              </td>
              <th scope="row">失敗檔/保單號碼/被保人ID</th>
              <td>
                <q-input
                  v-model="idNo"
                  :error="Boolean(errors.idNo)"
                  :error-message="errors.idNo"
                  dense
                  outlined
                />
              </td>
              <th scope="row">通報日期</th>
              <td>
                <q-input
                  v-model="insrDate"
                  :error="Boolean(errors.insrDate)"
                  :error-message="errors.insrDate"
                  dense
                  maxlength="7"
                  outlined
                />
              </td>
              <th scope="row">錯誤代碼</th>
              <td>
                <q-select
                  v-model="errorCode"
                  :options="errorCodeOptions"
                  dense
                  emit-value
                  map-options
                  outlined
                />
              </td>
              <td class="text-center" rowspan="2">
                <q-btn dense label="F2查詢" @click="onQuery" />
              </td>
            </tr>
            <tr>
              <th scope="row">收承方式</th>
              <td>
                <q-select
                  v-model="insrType"
                  :options="insuranceTypeOptions"
                  dense
                  emit-value
                  map-options
                  outlined
                />
              </td>
              <th scope="row">商品屬性</th>
              <td>
                <q-select
                  v-model="prodType"
                  :options="productTypeOptions"
                  dense
                  emit-value
                  map-options
                  outlined
                />
              </td>
              <th scope="row">處理狀態</th>
              <td>
                <q-select
                  v-model="procStatus"
                  :options="processStatusOptions"
                  dense
                  emit-value
                  map-options
                  outlined
                />
              </td>
              <td colspan="2"></td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>

      <div v-show="showEdit" class="afy10300__table-wrap q-mt-sm">
        <q-markup-table dense bordered flat class="afy10300__table afy10300__edit-table">
          <tbody>
            <tr>
              <td class="afy10300__edit-heading" colspan="10">資料編輯區</td>
            </tr>
            <tr v-for="row in editRows" :key="row.key">
              <template v-for="field in row.fields" :key="field.name">
                <th :class="{ 'text-red': field.emphasis }" scope="row">{{ field.label }}</th>
                <td>
                  <span v-if="field.kind === 'display'">{{ field.model.value }}</span>
                  <q-select
                    v-else-if="field.kind === 'select' && (!field.receiverOnly || isRType)"
                    v-model="field.model.value"
                    :error="Boolean(errors[field.name])"
                    :error-message="errors[field.name]"
                    :options="field.options.value"
                    dense
                    emit-value
                    map-options
                    outlined
                  />
                  <q-input
                    v-else-if="!field.receiverOnly || isRType"
                    v-model="field.model.value"
                    :error="Boolean(errors[field.name])"
                    :error-message="errors[field.name]"
                    :maxlength="field.maxlength"
                    dense
                    outlined
                  />
                </td>
              </template>
            </tr>
            <tr>
              <th scope="row">通報日期</th>
              <td>{{ selectedDisplay.outputTime }}</td>
              <th scope="row">公會通報序號</th>
              <td>{{ selectedDisplay.serNo }}</td>
              <th scope="row">資料來源</th>
              <td>{{ selectedDisplay.updateSrc }}</td>
              <th scope="row">失敗原因</th>
              <td colspan="3">{{ selectedDisplay.memo }}</td>
            </tr>
            <tr>
              <td class="text-center" colspan="10">
                <q-btn dense label="F9修改" @click="onEdit" />
                <q-btn class="q-ml-sm" dense label="F10取消" @click="onCancel" />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>

      <div v-if="showQuery" class="afy10300__table-wrap q-mt-sm">
        <q-markup-table dense bordered flat class="afy10300__table afy10300__result-table">
          <thead>
            <tr>
              <th scope="col">序號</th>
              <th scope="col">選取</th>
              <th scope="col">結果</th>
              <th scope="col">保額</th>
              <th scope="col">通報方式</th>
              <th scope="col">被保人ID</th>
              <th scope="col">被保人生日</th>
              <th scope="col">被保人性別</th>
              <th scope="col">商品代碼</th>
              <th scope="col">險種分類</th>
              <th scope="col">險種</th>
              <th scope="col">保單狀況</th>
              <th scope="col">契約生效日</th>
              <th scope="col">契約滿期日</th>
              <th scope="col">保單狀況生效日期</th>
              <th v-if="isRType" scope="col">要保書填寫日期</th>
              <th scope="col">通報時間</th>
              <th scope="col">錯誤原因</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowNumber) in resultList" :key="row.__rowKey">
              <td class="text-center">{{ rowNumber + 1 }}</td>
              <td class="text-center">
                <q-radio
                  v-model="selectedRowKey"
                  :val="row.__rowKey"
                  dense
                  @update:model-value="selectItem(row)"
                />
              </td>
              <td>{{ row.LIA_STATUS_DESC }}</td>
              <td>{{ row.FACE_AMT }}</td>
              <td>{{ row.INSR_TYPE_DESC }}</td>
              <td>{{ row.I_ID }}</td>
              <td>{{ row.I_BIRTHDAY_ROC }}</td>
              <td>{{ row.I_GENDER_DESC }}</td>
              <td>{{ row.PROD_CODE }}</td>
              <td>{{ row.POLICY_DUTY }}</td>
              <td>{{ row.PROD_KIND }}</td>
              <td>{{ row.STATUS }}</td>
              <td>{{ row.ISSUE_DATE_ROC }}</td>
              <td>{{ row.LPS_DATE_ROC }}</td>
              <td>{{ row.LST_CHG_DATE_ROC }}</td>
              <td v-if="isRType">{{ row.SIGN_DATE }}</td>
              <td>{{ row.OUTPUT_TIME }}</td>
              <td>{{ row.MEMO }}</td>
            </tr>
            <tr>
              <td class="text-center" :colspan="isRType ? 18 : 17">
                <q-btn dense label="Excel匯出" @click="onExport" />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>

      <div class="afy10300__table-wrap q-mt-sm">
        <q-markup-table dense bordered flat class="afy10300__table">
          <tbody>
            <tr>
              <th class="afy10300__upload-label" scope="row">檔案匯入</th>
              <td>
                <q-file
                  v-model="uploadFile"
                  :error="Boolean(errors.uploadFile)"
                  :error-message="errors.uploadFile"
                  accept=".xlsx"
                  dense
                  outlined
                />
              </td>
              <td class="text-center">
                <q-btn dense label="F8檔案上傳" @click="onImport" />
                <q-btn class="q-ml-sm" dense label="即時大批通報" @click="onExecute" />
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>

      <div class="afy10300__table-wrap q-mt-sm">
        <q-markup-table dense bordered flat class="afy10300__table afy10300__instructions">
          <tbody>
            <tr>
              <td>
                1.用大批匯入時，請先叫出資料後按Excel匯出鈕--&gt;修改錯誤及處理結果(千萬記得保單狀況生效日也要調整)--&gt;至檔案匯入--&gt;按選擇檔案鈕--&gt;選擇檔案--&gt;按F8檔案上傳。<span class="text-red">（限用Google Chrome）</span>
              </td>
            </tr>
            <tr><td>2.Excel表格內容說明</td></tr>
            <tr><td>　　　A.處理結果: 輸入代碼如：用此畫面修正及上傳時輸入8。</td></tr>
            <tr><td>　　　　　　　(7:不需通報、8重新通報、9至公會系統人工通)</td></tr>
            <tr><td>　　　B.結果:目前僅會顯示3(通報失敗)</td></tr>
            <tr><td>　　　C.保額:此為投保保額，目前僅出壽險會顯示</td></tr>
            <tr><td>3.按F8檔案上傳鈕:收件批次每半小時、承保隔天通報</td></tr>
            <tr><td>4.即時大批通報鈕:將目前所有待通報之案件(收、承保)立即通報公會</td></tr>
            <tr>
              <td>
                5.請參考公會補通報操作手冊、新通報平台系統操作手冊，
                <button class="afy10300__link" type="button" @click="openOperationManual">點我開啟</button>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </section>

    <q-inner-loading :showing="isLoading" />
  </q-page>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useField, useForm } from 'vee-validate'
import { mixed, number, object, string } from 'yup'
import http from '@/assets/plugins/axios'

const $q = useQuasar()
const isLoading = ref(false)
const showQuery = ref(false)
const showEdit = ref(false)
const isRType = ref(false)
const resultList = ref([])
const selectedRowKey = ref(null)
const legacyShowEdit = ref('')

const saleChannelOptions = ref([])
const policyDutyOptions = ref([])
const productKindOptions = ref([])
const paymentFrequencyOptions = ref([])
const relationOptions = ref([])
const brokerTypeOptions = ref([])
const liaStatusOptions = ref([])

const selectedDisplay = reactive({
  outputTime: '',
  serNo: '',
  updateSrc: '',
  updateTime: '',
  memo: ''
})

const originalValues = reactive({
  iId: '',
  iBirthday: '',
  policyNo: '',
  policyCat: '',
  policyDuty: '',
  prodKind: '',
  status: '',
  lstChgDate: '',
  updateTime: ''
})

const registrationValues = reactive({
  queryNo: '',
  idNo: '',
  insrDate: '',
  insrType: '',
  errorCode: '',
  prodType: '',
  procStatus: '',
  radioNum: ''
})

const requiredText = {
  name: 'requiredText',
  message: '不得為空值',
  test: (value) => Boolean(String(value ?? '').trim())
}

const nonNegativeNumber = (message) => number().typeError(message).min(0, message).required(message)

const querySchema = object({
  queryNo: string().required(),
  idNo: string().test({
    name: 'queryIdRequired',
    message: '失敗檔/保單號碼/被保人ID不得為空白',
    test: function (value) {
      return this.parent.queryNo === '0' || Boolean(value?.trim())
    }
  }),
  insrDate: string()
})

const editSchema = object({
  iId: string().test({ ...requiredText, message: '被保人不得為空值' }).max(10),
  iBirthday: string().test({ ...requiredText, message: '被保人生日不得為空值、且必須為日期格式' }),
  mainPolicyNo: string().test({ ...requiredText, message: '主約保單號碼不得為空值' }).max(20),
  policyNo: string().test({
    name: 'policyPrefix',
    message: '保單號碼開頭不同於主約保單號碼',
    test: function (value) {
      return String(value ?? '').startsWith(String(this.parent.mainPolicyNo ?? ''))
    }
  }),
  payAmt1: nonNegativeNumber('身故不得為空值、且需為數字'),
  payAmt2: nonNegativeNumber('完全失能不得為空值、且需為數字'),
  payAmt3: nonNegativeNumber('失能扶助金不得為空值、且需為數字'),
  payAmt4: nonNegativeNumber('特定事故不得為空值、且需為數字'),
  payAmt5: nonNegativeNumber('醫療限額不得為空值、且需為數字'),
  payAmt6: nonNegativeNumber('醫療限額自負不得為空值、且需為數字'),
  payAmt7: nonNegativeNumber('醫療日額不得為空值、且需為數字'),
  payAmt8: nonNegativeNumber('住院手術不得為空值、且需為數字'),
  payAmt9: nonNegativeNumber('住院門診不得為空值、且需為數字'),
  payAmt11: nonNegativeNumber('門診日額不得為空值、且需為數字'),
  payAmt12: nonNegativeNumber('重大疾傷病不得為空值、且需為數字'),
  payAmt13: nonNegativeNumber('重大燒燙傷不得為空值、且需為數字'),
  payAmt14: nonNegativeNumber('癌症療養不得為空值、且需為數字'),
  payAmt15: nonNegativeNumber('出院療養不得為空值、且需為數字'),
  payAmt16: nonNegativeNumber('失能不得為空值、且需為數字'),
  payAmt17: nonNegativeNumber('喪葬費用不得為空值、且需為數字'),
  payAmt18: nonNegativeNumber('術接原醫療限額之自負額不得為空值、且需為數字'),
  payAmt19: nonNegativeNumber('分期給付不得為空值、且需為數字'),
  issueDate: string().test({ ...requiredText, message: '契約生效日不得為空值、且必須為日期格式' }),
  lpsDate: string().test({ ...requiredText, message: '契約滿期日不得為空值、且必須為日期格式' }),
  lstChgDate: string().test({ ...requiredText, message: '保單狀況生效日不得為空值、且必須為日期格式' }),
  prem: nonNegativeNumber('保費不得為空值、且需為數字'),
  aId: string().test({ ...requiredText, message: '要保人不得為空值' }).max(10),
  aBirthday: string().test({ ...requiredText, message: '要保人生日不得為空值、且必須為日期格式' }),
  liaStatus: string().matches(/[0-9]/, '通報狀態需選擇')
})

const importSchema = object({
  uploadFile: mixed()
    .required('請選擇檔案')
    .test('xlsxFile', '檔案格式必須為xlsx檔', (file) => file instanceof File && /\.xlsx$/i.test(file.name))
})

// TODO: TECHNICAL_GAP: 驗證民國日期格式與日期有效性
const isROCdate = (...args) => {}

const initialValues = {
  queryNo: '0',
  idNo: '',
  insrDate: '',
  errorCode: '99',
  insrType: 'L',
  prodType: 'AT',
  procStatus: '1',
  insrTypeDesc: '',
  iName: '',
  iId: '',
  iBirthday: '',
  iGender: '1',
  mainPolicyNo: '',
  policyNo: '',
  oiuInd: '',
  saleChnl: '',
  prodCode: '',
  policyCat: '1',
  policyDuty: '',
  prodKind: '',
  payType: '0',
  payAmt1: '',
  payAmt2: '',
  payAmt3: '',
  payAmt4: '',
  payAmt5: '',
  payAmt6: '',
  payAmt7: '',
  payAmt8: '',
  payAmt9: '',
  payAmt10: '',
  payAmt11: '',
  payAmt12: '',
  payAmt13: '',
  payAmt14: '',
  payAmt15: '',
  payAmt16: '',
  payAmt17: '',
  payAmt18: '',
  payAmt19: '',
  issueDate: '',
  issueTime: '',
  lpsDate: '',
  lpsTime: '',
  prem: '',
  payFreq: '',
  payPeriod: '',
  status: '',
  lstChgDate: '',
  lstChgTime: '',
  aName: '',
  aId: '',
  aBirthday: '',
  relation: '',
  signDate: '',
  brokType: '',
  liaStatus: '',
  uploadFile: null
}

const { errors, setValues, validate } = useForm({
  validationSchema: querySchema,
  initialValues,
  validateOnMount: false
})

const { value: queryNo } = useField('queryNo')
const { value: idNo } = useField('idNo')
const { value: insrDate } = useField('insrDate')
const { value: errorCode } = useField('errorCode')
const { value: insrType } = useField('insrType')
const { value: prodType } = useField('prodType')
const { value: procStatus } = useField('procStatus')
const { value: insrTypeDesc } = useField('insrTypeDesc')
const { value: iName } = useField('iName')
const { value: iId } = useField('iId')
const { value: iBirthday } = useField('iBirthday')
const { value: iGender } = useField('iGender')
const { value: mainPolicyNo } = useField('mainPolicyNo')
const { value: policyNo } = useField('policyNo')
const { value: oiuInd } = useField('oiuInd')
const { value: saleChnl } = useField('saleChnl')
const { value: prodCode } = useField('prodCode')
const { value: policyCat } = useField('policyCat')
const { value: policyDuty } = useField('policyDuty')
const { value: prodKind } = useField('prodKind')
const { value: payType } = useField('payType')
const { value: payAmt1 } = useField('payAmt1')
const { value: payAmt2 } = useField('payAmt2')
const { value: payAmt3 } = useField('payAmt3')
const { value: payAmt4 } = useField('payAmt4')
const { value: payAmt5 } = useField('payAmt5')
const { value: payAmt6 } = useField('payAmt6')
const { value: payAmt7 } = useField('payAmt7')
const { value: payAmt8 } = useField('payAmt8')
const { value: payAmt9 } = useField('payAmt9')
const { value: payAmt10 } = useField('payAmt10')
const { value: payAmt11 } = useField('payAmt11')
const { value: payAmt12 } = useField('payAmt12')
const { value: payAmt13 } = useField('payAmt13')
const { value: payAmt14 } = useField('payAmt14')
const { value: payAmt15 } = useField('payAmt15')
const { value: payAmt16 } = useField('payAmt16')
const { value: payAmt17 } = useField('payAmt17')
const { value: payAmt18 } = useField('payAmt18')
const { value: payAmt19 } = useField('payAmt19')
const { value: issueDate } = useField('issueDate')
const { value: issueTime } = useField('issueTime')
const { value: lpsDate } = useField('lpsDate')
const { value: lpsTime } = useField('lpsTime')
const { value: prem } = useField('prem')
const { value: payFreq } = useField('payFreq')
const { value: payPeriod } = useField('payPeriod')
const { value: status } = useField('status')
const { value: lstChgDate } = useField('lstChgDate')
const { value: lstChgTime } = useField('lstChgTime')
const { value: aName } = useField('aName')
const { value: aId } = useField('aId')
const { value: aBirthday } = useField('aBirthday')
const { value: relation } = useField('relation')
const { value: signDate } = useField('signDate')
const { value: brokType } = useField('brokType')
const { value: liaStatus } = useField('liaStatus')
const { value: uploadFile } = useField('uploadFile')

const queryOptions = [
  { label: '失敗檔 (可不輸入失敗檔序號)', value: '0' },
  { label: '保單號碼', value: '1' },
  { label: '被保人ID', value: '2' }
]
const errorCodeOptions = ['99', '36', '37', '39', '40', '45'].map((value) => ({
  label: value === '99' ? '全部' : value,
  value
}))
const insuranceTypeOptions = [
  { label: '承保', value: 'L' },
  { label: '收件', value: 'R' }
]
const productTypeOptions = [
  { label: '個險', value: 'AT' },
  { label: '團險', value: 'BG' },
  { label: '意外險', value: 'CB' }
]
const processStatusOptions = [
  { label: '未處理', value: '1' },
  { label: '已處理', value: '2' },
  { label: '全部', value: '0' }
]
const genderOptions = ref([
  { label: '男', value: '1' },
  { label: '女', value: '2' }
])
const policyCategoryOptions = ref([
  { label: '個人', value: '1' },
  { label: '團體', value: '2' }
])
const payTypeOptions = ref([
  { label: '無', value: '0' },
  { label: '公費', value: '1' },
  { label: '自費', value: '2' }
])

const editRows = [
  {
    key: 'insured',
    fields: [
      { name: 'insrTypeDesc', label: '通報方式', model: insrTypeDesc, kind: 'display' },
      { name: 'iName', label: '被保險人姓名', model: iName },
      { name: 'iId', label: '被保人ID', model: iId },
      { name: 'iBirthday', label: '被保人生日', model: iBirthday, maxlength: 7 },
      { name: 'iGender', label: '被保險人性別', model: iGender, kind: 'select', options: genderOptions }
    ]
  },
  {
    key: 'policy',
    fields: [
      { name: 'mainPolicyNo', label: '主約保單號碼', model: mainPolicyNo },
      { name: 'policyNo', label: '保單號碼', model: policyNo },
      { name: 'oiuInd', label: '來源別OIU', model: oiuInd },
      { name: 'saleChnl', label: '銷售通路別', model: saleChnl, kind: 'select', options: saleChannelOptions },
      { name: 'prodCode', label: '商品代碼', model: prodCode }
    ]
  },
  {
    key: 'classification',
    fields: [
      { name: 'policyCat', label: '保單分類', model: policyCat, kind: 'select', options: policyCategoryOptions },
      { name: 'policyDuty', label: '險種分類', model: policyDuty, kind: 'select', options: policyDutyOptions },
      { name: 'prodKind', label: '險種', model: prodKind, kind: 'select', options: productKindOptions },
      { name: 'payType', label: '公、自費件', model: payType, kind: 'select', options: payTypeOptions },
      { name: 'payAmt1', label: '身故', model: payAmt1 }
    ]
  },
  {
    key: 'amounts-2-6',
    fields: [
      { name: 'payAmt2', label: '完全失能', model: payAmt2 },
      { name: 'payAmt3', label: '失能扶助金', model: payAmt3 },
      { name: 'payAmt4', label: '特定事故', model: payAmt4 },
      { name: 'payAmt5', label: '初次罹患', model: payAmt5 },
      { name: 'payAmt6', label: '醫療限額', model: payAmt6 }
    ]
  },
  {
    key: 'amounts-7-11',
    fields: [
      { name: 'payAmt7', label: '醫療限額自負', model: payAmt7 },
      { name: 'payAmt8', label: '醫療日期', model: payAmt8 },
      { name: 'payAmt9', label: '住院手術', model: payAmt9 },
      { name: 'payAmt10', label: '住院門診', model: payAmt10 },
      { name: 'payAmt11', label: '門診日額', model: payAmt11 }
    ]
  },
  {
    key: 'amounts-12-16',
    fields: [
      { name: 'payAmt12', label: '重大疾/傷病', model: payAmt12 },
      { name: 'payAmt13', label: '重大燒燙傷', model: payAmt13 },
      { name: 'payAmt14', label: '癌症療養', model: payAmt14 },
      { name: 'payAmt15', label: '出院療養', model: payAmt15 },
      { name: 'payAmt16', label: '失能', model: payAmt16 }
    ]
  },
  {
    key: 'amounts-17-dates',
    fields: [
      { name: 'payAmt17', label: '喪葬費用', model: payAmt17 },
      { name: 'payAmt18', label: '銜接原醫療限額之自負額', model: payAmt18 },
      { name: 'payAmt19', label: '分開給付', model: payAmt19 },
      { name: 'issueDate', label: '契約生效日期', model: issueDate },
      { name: 'issueTime', label: '契約生效時分 (旅平險)', model: issueTime }
    ]
  },
  {
    key: 'term',
    fields: [
      { name: 'lpsDate', label: '契約滿期日期', model: lpsDate, maxlength: 7 },
      { name: 'lpsTime', label: '契約滿期時分', model: lpsTime },
      { name: 'prem', label: '保費', model: prem },
      { name: 'payFreq', label: '保費繳別', model: payFreq, kind: 'select', options: paymentFrequencyOptions },
      { name: 'payPeriod', label: '保費繳費年期', model: payPeriod }
    ]
  },
  {
    key: 'status',
    fields: [
      { name: 'status', label: '保單狀況', model: status },
      { name: 'lstChgDate', label: '保單狀況生效日期', model: lstChgDate, emphasis: true },
      { name: 'lstChgTime', label: '保單狀況生效時分', model: lstChgTime },
      { name: 'aName', label: '要保人姓名', model: aName },
      { name: 'aId', label: '要保人身分證號碼', model: aId }
    ]
  },
  {
    key: 'applicant',
    fields: [
      { name: 'aBirthday', label: '要保人生日', model: aBirthday, maxlength: 7 },
      { name: 'relation', label: '要被保人關係', model: relation, kind: 'select', options: relationOptions },
      { name: 'signDate', label: '要保書填寫日 (收件才需要)', model: signDate, receiverOnly: true, emphasis: true },
      { name: 'brokType', label: '保經代類別', model: brokType, kind: 'select', options: brokerTypeOptions, receiverOnly: true },
      { name: 'liaStatus', label: '通報狀態', model: liaStatus, kind: 'select', options: liaStatusOptions, emphasis: true }
    ]
  }
]

const mapOptions = (options) => (options ?? []).map((option) => ({
  label: `${option.key} ${option.value}`,
  value: option.key
}))

const notifyFailure = (message = '作業失敗') => {
  $q.notify({ type: 'negative', message })
}

const postEndpoint = async (endpoint, payload) => {
  isLoading.value = true
  try {
    const response = await http.post(endpoint, payload)
    if (String(response.data?.returnCode) !== '0') {
      notifyFailure()
      return null
    }
    return response.data.data
  } catch {
    notifyFailure()
    return null
  } finally {
    isLoading.value = false
  }
}

const post = (action, payload) => postEndpoint(`afy10300/${action}`, payload)

const buildFormPayload = () => ({
  queryNo: queryNo.value,
  idNo: idNo.value,
  insrDate: insrDate.value,
  errorCode: errorCode.value,
  insrType: insrType.value,
  prodType: prodType.value,
  procStatus: procStatus.value,
  regQueryNo: registrationValues.queryNo,
  regIdNo: registrationValues.idNo,
  regInsrDate: registrationValues.insrDate,
  regInsrType: registrationValues.insrType,
  regErrorCode: registrationValues.errorCode,
  regProdType: registrationValues.prodType,
  regProcStatus: registrationValues.procStatus,
  regRadioNum: registrationValues.radioNum,
  showEdit: legacyShowEdit.value,
  I_NAME: iName.value,
  I_ID: iId.value,
  I_BIRTHDAY: iBirthday.value,
  I_GENDER: iGender.value,
  MAIN_POLICY_NO: mainPolicyNo.value,
  POLICY_NO: policyNo.value,
  OIU_IND: oiuInd.value,
  SALE_CHNL: saleChnl.value,
  PROD_CODE: prodCode.value,
  POLICY_CAT: policyCat.value,
  POLICY_DUTY: policyDuty.value,
  PROD_KIND: prodKind.value,
  PAY_TYPE: payType.value,
  PAY_AMT1: payAmt1.value,
  PAY_AMT2: payAmt2.value,
  PAY_AMT3: payAmt3.value,
  PAY_AMT4: payAmt4.value,
  PAY_AMT5: payAmt5.value,
  PAY_AMT6: payAmt6.value,
  PAY_AMT7: payAmt7.value,
  PAY_AMT8: payAmt8.value,
  PAY_AMT9: payAmt9.value,
  PAY_AMT10: payAmt10.value,
  PAY_AMT11: payAmt11.value,
  PAY_AMT12: payAmt12.value,
  PAY_AMT13: payAmt13.value,
  PAY_AMT14: payAmt14.value,
  PAY_AMT15: payAmt15.value,
  PAY_AMT16: payAmt16.value,
  PAY_AMT17: payAmt17.value,
  PAY_AMT18: payAmt18.value,
  PAY_AMT19: payAmt19.value,
  ISSUE_DATE: issueDate.value,
  ISSUE_TIME: issueTime.value,
  LPS_DATE: lpsDate.value,
  LPS_TIME: lpsTime.value,
  PREM: prem.value,
  PAY_FREQ: payFreq.value,
  PAY_PERIOD: payPeriod.value,
  STATUS: status.value,
  LST_CHG_DATE: lstChgDate.value,
  LST_CHG_TIME: lstChgTime.value,
  A_NAME: aName.value,
  A_ID: aId.value,
  A_BIRTHDAY: aBirthday.value,
  RELATION: relation.value,
  SIGN_DATE: signDate.value,
  BROKTYPE: brokType.value,
  LIA_STATUS: liaStatus.value,
  UPDATE_TIME: selectedDisplay.updateTime,
  OLD_I_ID: originalValues.iId,
  OLD_I_BIRTHDAY: originalValues.iBirthday,
  OLD_POLICY_NO: originalValues.policyNo,
  OLD_POLICY_CAT: originalValues.policyCat,
  OLD_POLICY_DUTY: originalValues.policyDuty,
  OLD_PROD_KIND: originalValues.prodKind,
  OLD_STATUS: originalValues.status,
  OLD_LST_CHG_DATE: originalValues.lstChgDate,
  OLD_UPDATE_TIME: originalValues.updateTime
})

const applyPromptData = (data) => {
  setValues({
    queryNo: data.queryNo ?? '0',
    idNo: data.idNo ?? '',
    insrDate: '',
    errorCode: data.errorCode ?? '99',
    insrType: data.insrType ?? 'L',
    prodType: data.prodType ?? 'AT',
    procStatus: data.procStatus ?? '1'
  })
  registrationValues.queryNo = data.regQueryNo ?? ''
  registrationValues.idNo = data.regIdNo ?? ''
  registrationValues.insrDate = data.regInsrDate ?? ''
  registrationValues.insrType = data.regInsrType ?? ''
  registrationValues.errorCode = data.regErrorCode ?? ''
  registrationValues.prodType = data.regProdType ?? ''
  registrationValues.procStatus = data.regProcStatus ?? ''
  registrationValues.radioNum = data.regRadioNum ?? ''
  showQuery.value = Boolean(data.showQuery)
  isRType.value = Boolean(data.isRType)
  resultList.value = (data.resultList ?? []).map((row) => ({
    ...row,
    __rowKey: crypto.randomUUID()
  }))
  saleChannelOptions.value = mapOptions(data.SALE_CHNL_OPTION)
  policyDutyOptions.value = mapOptions(data.POLICY_DUTY_OPTION)
  productKindOptions.value = mapOptions(data.PROD_KIND_OPTION)
  paymentFrequencyOptions.value = mapOptions(data.PAY_FREQ_OPTION)
  relationOptions.value = mapOptions(data.RELATION_OPTION)
  brokerTypeOptions.value = mapOptions(data.BROKTYPE_OPTION)
  liaStatusOptions.value = mapOptions(data.LIA_STATUS_OPTION)

  for (const message of data.msgs ?? []) {
    if (typeof message === 'string') {
      $q.notify({ message })
    }
  }
}

const selectItem = (row) => {
  const rowNumber = resultList.value.findIndex((item) => item.__rowKey === row.__rowKey)
  registrationValues.radioNum = String(rowNumber)
  setValues({
    insrTypeDesc: row.INSR_TYPE_DESC ?? '',
    iName: row.I_NAME ?? '',
    iId: row.I_ID ?? '',
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
    status: row.PAY_PERIOD ?? '',
    lstChgDate: row.LST_CHG_DATE_ROC ?? '',
    lstChgTime: row.LST_CHG_TIME ?? '',
    aName: row.A_NAME ?? '',
    aId: row.A_ID ?? '',
    aBirthday: row.A_BIRTHDAY_ROC ?? '',
    relation: row.RELATION ?? '',
    liaStatus: row.LIA_STATUS ?? '',
    signDate: row.SIGN_DATE_ROC ?? '',
    brokType: row.BROKTYPE ?? ''
  })
  selectedDisplay.outputTime = row.OUTPUT_TIME ?? ''
  selectedDisplay.serNo = row.SER_NO ?? ''
  selectedDisplay.updateSrc = row.UPDATE_SRC ?? ''
  selectedDisplay.updateTime = row.UPDATE_TIME ?? ''
  selectedDisplay.memo = row.MEMO ?? ''
  originalValues.iId = row.I_ID ?? ''
  originalValues.iBirthday = row.I_BIRTHDAY ?? ''
  originalValues.policyNo = row.POLICY_NO ?? ''
  originalValues.policyCat = row.POLICY_CAT ?? ''
  originalValues.policyDuty = row.POLICY_DUTY ?? ''
  originalValues.prodKind = row.PROD_KIND ?? ''
  originalValues.status = row.STATUS ?? ''
  originalValues.lstChgDate = row.LST_CHG_DATE ?? ''
  originalValues.updateTime = row.UPDATE_TIME ?? ''
  showEdit.value = true
}

const onQuery = async () => {
  const { valid } = await validate({ schema: querySchema })
  if (!valid) return
  const data = await post('query', buildFormPayload())
  if (data) applyPromptData(data)
}

const onEdit = async () => {
  const { valid } = await validate({ schema: editSchema })
  if (!valid) return
  const data = await post('edit', buildFormPayload())
  if (data) applyPromptData(data)
}

const onCancel = () => {
  legacyShowEdit.value = 'N'
  showEdit.value = false
}

// TODO: TECHNICAL_GAP: 將後端產製的 Excel 檔案交付給使用者
const downloadFile = (...args) => {}

const onExport = async () => {
  const data = await post('export', {
    regQueryNo: registrationValues.queryNo,
    regIdNo: registrationValues.idNo,
    regInsrDate: registrationValues.insrDate,
    regInsrType: registrationValues.insrType,
    regErrorCode: registrationValues.errorCode,
    regProdType: registrationValues.prodType,
    regProcStatus: registrationValues.procStatus
  })
  if (data) downloadFile(data)
}

const onImport = async () => {
  const { valid } = await validate({ schema: importSchema })
  if (!valid) return
  const payload = new FormData()
  payload.append('uploadFile', uploadFile.value)
  const data = await post('import', payload)
  if (data) applyPromptData(data)
}

const executeImmediately = async () => {
  const data = await post('execute', buildFormPayload())
  if (data) applyPromptData(data)
}

const onExecute = () => {
  if (insrType.value === 'R') {
    $q.notify({ type: 'warning', message: '僅可選擇承保通報(收件類每30分鐘一次)' })
    return
  }
  const insuranceLabel = insuranceTypeOptions.find((option) => option.value === insrType.value)?.label ?? ''
  const productLabel = productTypeOptions.find((option) => option.value === prodType.value)?.label ?? ''
  $q.dialog({
    title: '確認',
    message: `確認要執行【${productLabel}${insuranceLabel}】即時大批通報嗎？`,
    cancel: true,
    persistent: true
  }).onOk(executeImmediately)
}

const openOperationManual = async () => {
  await postEndpoint('aaz00404/prompt', {
    SYS_NO: 'AT',
    SUB_SYS_NO: 'A0',
    FUNC_ID: 'ATA00611',
    isShowQueryItem: 'R'
  })
}

const handleHotKey = (event) => {
  const handlers = {
    F2: onQuery,
    F8: onImport,
    F9: showEdit.value ? onEdit : null,
    F10: showEdit.value ? onCancel : null
  }
  const handler = handlers[event.key]
  if (!handler) return
  event.preventDefault()
  handler()
}

onMounted(async () => {
  window.addEventListener('keydown', handleHotKey)
  const data = await post('prompt', {})
  if (data) applyPromptData(data)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleHotKey)
})
</script>

<style scoped>
.afy10300 {
  min-width: 1180px;
  background-color: #f0fbc6;
  color: #000;
}

.afy10300__title {
  min-height: 30px;
  border: 1px solid #003366;
  background-color: #f0fbc6;
}

.afy10300__content {
  border: 1px solid #003366;
  background-color: #fff;
}

.afy10300__section-title {
  color: #003366;
  font-weight: 700;
}

.afy10300__table-wrap {
  width: 100%;
  overflow-x: auto;
}

.afy10300__table {
  width: 100%;
  border-collapse: collapse;
}

.afy10300__table th {
  background-color: #fff6bf;
  font-weight: 400;
  text-align: center;
}

.afy10300__table td {
  background-color: #fffde8;
  vertical-align: middle;
}

.afy10300__edit-table {
  min-width: 1160px;
  table-layout: fixed;
}

.afy10300__edit-table th {
  width: 8%;
}

.afy10300__edit-table td {
  width: 12%;
}

.afy10300__edit-heading {
  background-color: #fff;
  font-weight: 700;
}

.afy10300__result-table {
  min-width: 1500px;
}

.afy10300__result-table thead th {
  background-color: #c9e7ff;
  font-weight: 700;
  white-space: nowrap;
}

.afy10300__upload-label {
  width: 20%;
}

.afy10300__instructions td {
  background-color: #fff6bf;
}

.afy10300__link {
  padding: 0;
  border: 0;
  background: transparent;
  color: #0645ad;
  cursor: pointer;
  text-decoration: underline;
}
</style>