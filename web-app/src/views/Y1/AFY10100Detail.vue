<template>
  <main class="afy10100 q-pa-sm">
    <header class="afy10100__title row items-center justify-between q-px-sm">
      <strong>● 公會通報查詢</strong>
      <span>畫面編號：AFY10100</span>
    </header>

    <section class="afy10100__section">
      <div class="afy10100__section-title">公會通報查詢</div>
      <q-markup-table dense bordered flat separator="cell">
        <tbody>
          <tr>
            <th colspan="10" scope="colgroup" class="afy10100__edit-title text-left">
              資料編輯區
            </th>
          </tr>
          <tr v-for="fieldRow in detailRows" :key="fieldRow.key">
            <template v-for="field in fieldRow.fields" :key="field.key">
              <th scope="row" class="afy10100__field-label">{{ field.label }}</th>
              <td class="afy10100__field-value">{{ displayValue(field) }}</td>
            </template>
          </tr>
        </tbody>
      </q-markup-table>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import http from '@/assets/plugins/axios'

const detailRows = [
  {
    key: 'row-1',
    fields: [
      { key: 'INSR_TYPE', label: '通報方式' },
      { key: 'CMNY_CODE', label: '公司別' },
      { key: 'I_ID', label: '被保人ID' },
      { key: 'I_BIRTHDAY', label: '被保人生日' },
      { key: 'POLICY_NO', label: '保單號碼' }
    ]
  },
  {
    key: 'row-2',
    fields: [
      { key: 'POLICY_CAT', label: '保單分類' },
      { key: 'POLICY_DUTY', label: '險種分類' },
      { key: 'PROD_KIND', label: '險種' },
      { key: 'STATUS', label: '保單狀況' },
      { key: 'LST_CHG_DATE', label: '保單狀況生效日期(受理理賠日、身故日)' }
    ]
  },
  {
    key: 'row-3',
    fields: [
      { key: 'MAIN_POLICY_NO', label: '主約保單號碼' },
      { key: 'ISSUE_DATE', label: '契約生效日' },
      { key: 'ISSUE_TIME', label: '契約生效時分' },
      { key: 'LPS_DATE', label: '契約滿期日' },
      { key: 'LPS_TIME', label: '契約滿期時分' }
    ]
  },
  {
    key: 'row-4',
    fields: [
      { key: 'SIGN_DATE', label: '要保書填寫日' },
      { key: 'PREM', label: '保費' },
      { key: 'PAY_FREQ', label: '保費繳別' },
      { key: 'PAY_PERIOD', label: '保費繳費年期' },
      { key: 'LST_CHG_TIME', label: '保單狀況生效時分' }
    ]
  },
  {
    key: 'row-5',
    fields: [
      { key: 'PAY_AMT1', label: '身故' },
      { key: 'PAY_AMT2', label: '完全失能或最高級失能' },
      { key: 'PAY_AMT3', label: '失能扶助金' },
      { key: 'PAY_AMT4', label: '特定事故' },
      { key: 'PAY_AMT5', label: '初次罹患' }
    ]
  },
  {
    key: 'row-6',
    fields: [
      { key: 'PAY_AMT6', label: '醫療限額' },
      { key: 'PAY_AMT7', label: '醫療限額自負' },
      { key: 'PAY_AMT8', label: '醫療日額' },
      { key: 'PAY_AMT9', label: '住院手術' },
      { key: 'PAY_AMT10', label: '門診手術' }
    ]
  },
  {
    key: 'row-7',
    fields: [
      { key: 'PAY_AMT11', label: '門診' },
      { key: 'PAY_AMT12', label: '重大疾/傷病' },
      { key: 'PAY_AMT13', label: '重大燒燙傷' },
      { key: 'PAY_AMT14', label: '癌症療養' },
      { key: 'PAY_AMT15', label: '出院療養' }
    ]
  },
  {
    key: 'row-8',
    fields: [
      { key: 'PAY_AMT16', label: '喪失工作能力' },
      { key: 'PAY_AMT17', label: '喪葬費用' },
      { key: 'PAY_AMT18', label: '銜接原醫療限額之自負額' },
      { key: 'PAY_AMT19', label: '分期給付' },
      { key: 'BROKTYPE', label: '保經代分類' }
    ]
  },
  {
    key: 'row-9',
    fields: [
      { key: 'A_NAME', label: '要保人姓名' },
      { key: 'A_ID', label: '要保人身分證號碼' },
      { key: 'A_BIRTHDAY', label: '要保人出生日期' },
      { key: 'RELATION', label: '要保人與被保險人關係' },
      { key: 'UPDATE_TIME', label: '資料寫入時間' }
    ]
  },
  {
    key: 'row-10',
    fields: [
      { key: 'I_GENDER', label: '被保險人性別', lookup: 'genderDesc' },
      { key: 'PAY_TYPE', label: '公、自費件', lookup: 'payTypeDesc' },
      { key: 'OIU_IND', label: '來源別', lookup: 'oiuIndDesc' },
      { key: 'SALE_CHNL', label: '銷售通路', lookup: 'saleChnlDesc' },
      { key: 'PROD_CODE', label: '商品代碼' }
    ]
  },
  {
    key: 'row-11',
    fields: [
      { key: 'SER_NO', label: '公會取回序號' },
      { key: 'blank-1', label: '' },
      { key: 'blank-2', label: '' },
      { key: 'blank-3', label: '' },
      { key: 'blank-4', label: '' }
    ]
  }
]

const dataMap = ref({})
const genderDesc = ref({})
const payTypeDesc = ref({})
const oiuIndDesc = ref({})
const saleChnlDesc = ref({})
const pageMessages = ref([])

const lookupMaps = {
  genderDesc,
  payTypeDesc,
  oiuIndDesc,
  saleChnlDesc
}

const displayValue = (field) => {
  const value = dataMap.value[field.key]
  if (!field.lookup) return value ?? ''
  return lookupMaps[field.lookup].value[value] ?? ''
}

const applyPageData = (pageData = {}) => {
  dataMap.value = pageData.dataMap ?? {}
  genderDesc.value = pageData.genderDesc ?? {}
  payTypeDesc.value = pageData.payTypeDesc ?? {}
  oiuIndDesc.value = pageData.oiuIndDesc ?? {}
  saleChnlDesc.value = pageData.saleChnlDesc ?? {}
  pageMessages.value = pageData.msgs ?? []
}

const loadPage = async () => {
  const response = await http.post('afy10100/prompt', {})
  if (response.data.returnCode !== '0') return
  applyPageData(response.data.data)
}

// TODO: TECHNICAL_GAP: 將標準作業結果訊息同步至共通通知區
const displayMessage = () => {}

// TODO: TECHNICAL_GAP: 套用既有共用框線與標題圖示
// TODO: TECHNICAL_GAP: 套用頁面資訊安全政策與操作稽核
onMounted(async () => {
  await loadPage()
  displayMessage()
})
</script>

<style scoped>
.afy10100 {
  min-width: 1180px;
  min-height: 100%;
  color: #111;
  background-color: #f0fbc6;
}

.afy10100__title {
  position: sticky;
  top: 0;
  z-index: 9;
  min-height: 30px;
  background-color: #f0fbc6;
}

.afy10100__section {
  width: 97%;
  margin: 4px auto 0;
  border: 1px solid #003366;
  background-color: #fff;
}

.afy10100__section-title {
  padding: 5px;
  color: #fff;
  font-weight: 700;
  background-color: #003366;
}

.afy10100__edit-title {
  color: #111;
  background-color: #fff;
}

.afy10100 :deep(table) {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.afy10100__field-label,
.afy10100__field-value {
  width: 10%;
  padding: 5px;
  text-align: center;
  overflow-wrap: anywhere;
}

.afy10100__field-label {
  background-color: #d9e9f6;
}

.afy10100__field-value {
  background-color: #fafbe1;
}
</style>