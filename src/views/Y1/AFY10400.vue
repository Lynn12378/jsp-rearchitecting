<template>
  <div class="afy10400">
    <div class="subTitle afy10400__title">
      <span class="afy10400__title-mark">●</span>
      <span>公會通報下傳作業</span>
      <span class="afy10400__screen-number">畫面編號：AFY10400</span>
    </div>

    <section class="tbBox2 afy10400__content">
      <p class="afy10400__section-title">公會補通報作業</p>

      <q-markup-table dense bordered class="tbBox2">
        <tbody>
          <tr>
            <td colspan="4" class="tbYellow2">
              1、此畫面請用<span class="afy10400__emphasis">Google Chrome</span>使用<br>
              2、收承方式、商品屬性，每次只能針對其中一種組合進行下載，若有多種組合下載，需分多次匯出處理<br>
              3、同一ID查詢多筆保單時，請在保單號碼欄位，輸入多筆且用<span class="afy10400__emphasis">Enter</span>來分格
            </td>
          </tr>
          <tr>
            <td class="tbYellow afy10400__label-cell">收承方式</td>
            <td class="tbYellow2 afy10400__value-cell">
              <q-select
                v-model="insrType"
                dense
                outlined
                emit-value
                map-options
                :options="INSURANCE_TYPE_OPTIONS"
              />
            </td>
            <td class="tbYellow afy10400__label-cell">商品屬性</td>
            <td class="tbYellow2 afy10400__value-cell afy10400__product-cell">
              <q-select
                v-model="prodType"
                dense
                outlined
                emit-value
                map-options
                :options="PRODUCT_TYPE_OPTIONS"
              />
            </td>
          </tr>
          <tr class="tbBlue">
            <td class="afy10400__center-cell">刪除</td>
            <td class="afy10400__center-cell">
              被保人ID
              <q-btn dense label="新增一列" @click="addEntry" />
            </td>
            <td class="afy10400__center-cell">保單號碼</td>
            <td class="afy10400__center-cell">匯出結果</td>
          </tr>
          <tr
            v-for="(entry, index) in entries"
            :key="entry.rowId"
            :class="getEntryRowClass(index)"
          >
            <td class="afy10400__center-cell">
              <q-btn dense label="刪除此列" @click="deleteEntry(entry.rowId)" />
            </td>
            <td class="afy10400__center-cell">
              <q-input
                v-model="entry.insuredId"
                dense
                outlined
                maxlength="10"
                class="afy10400__insured-id"
              />
            </td>
            <td class="afy10400__center-cell">
              <q-input
                v-model="entry.policyNumbers"
                dense
                outlined
                type="textarea"
                rows="3"
              />
            </td>
            <td class="afy10400__center-cell">{{ entry.result }}</td>
          </tr>
        </tbody>
      </q-markup-table>

      <q-markup-table dense bordered class="tbBox2">
        <tbody>
          <tr>
            <td class="tbYellow2 afy10400__export-cell">
              <q-btn
                dense
                label="匯出檔案"
                :loading="isExporting"
                @click="exportFile"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import { array, object, string } from 'yup'
import { useQuasar } from 'quasar'

const INSURANCE_TYPE_OPTIONS = [
  { label: '承保', value: 'L' },
  { label: '收件', value: 'R' }
]
const PRODUCT_TYPE_OPTIONS = [
  { label: '個險', value: 'AT' },
  { label: '團險', value: 'BG' },
  { label: '意外險', value: 'CB' }
]

const $cathayAxios = inject('$cathayAxios')
const $q = useQuasar()
const isExporting = ref(false)
let nextRowId = 0

const requiredEntry = {
  name: 'requiredEntry',
  message: '被保人ID或保單號碼不得為空值',
  test: function (value) {
    const invalidIndex = value.findIndex(
      (entry) => !entry.insuredId || !entry.policyNumbers
    )
    if (invalidIndex === -1) return true
    return this.createError({
      message: `第${invalidIndex + 1}列的被保人ID或保單號碼不得為空值，若不需要請刪除該列`
    })
  }
}
const uniqueInsuredId = {
  name: 'uniqueInsuredId',
  message: '被保人ID不得重覆',
  test: function (value) {
    const insuredIds = new Set()
    const duplicate = value.find((entry) => {
      if (insuredIds.has(entry.insuredId)) return true
      insuredIds.add(entry.insuredId)
      return false
    })
    if (!duplicate) return true
    return this.createError({
      message: `被保人ID：${duplicate.insuredId}有重覆出現，請合併在同一列處理`
    })
  }
}
const validationSchema = object({
  insrType: string().required(),
  prodType: string().required(),
  entries: array().test(requiredEntry).test(uniqueInsuredId)
})

const { errors, validate } = useForm({
  validationSchema,
  initialValues: {
    insrType: 'L',
    prodType: 'AT',
    entries: []
  },
  validateOnMount: false
})
const { value: insrType } = useField('insrType')
const { value: prodType } = useField('prodType')
const { value: entries } = useField('entries')

const addEntry = () => {
  const rowId = nextRowId
  nextRowId += 1
  entries.value = [
    ...entries.value,
    {
      rowId,
      insuredId: '',
      policyNumbers: '',
      result: ''
    }
  ]
}

const deleteEntry = (rowId) => {
  entries.value = entries.value.filter((entry) => entry.rowId !== rowId)
}

const getEntryRowClass = (index) => (
  index % 2 === 0
    ? 'afy10400__entry-row--light'
    : 'afy10400__entry-row--dark'
)

const applyExportResults = (resultMap) => {
  entries.value = entries.value.map((entry) => ({
    ...entry,
    result: resultMap[entry.insuredId]
  }))
}

// TODO: TECHNICAL_GAP: 下載伺服器已產製的檔案
const downloadFile = async (fileName) => {}

const exportFile = async () => {
  const { valid } = await validate()
  if (!valid) {
    $q.dialog({
      title: '提示',
      message: errors.value.entries
    })
    return
  }

  isExporting.value = true
  try {
    const res = await $cathayAxios.post('afy10400/export', {
      insrType: insrType.value,
      prodType: prodType.value,
      I_ID: entries.value.map((entry) => entry.insuredId),
      POLICY_NO: entries.value.map((entry) => entry.policyNumbers)
    })
    applyExportResults(res.data.rtnMap)
    if (res.returnCode !== 0) return
    await downloadFile(res.data.fileName)
  } finally {
    isExporting.value = false
  }
}

// TODO: OVER_APPROXIMATION: 待複查頁面初始作業訊息是否皆為伺服器端注入資料
onMounted(async () => {
  const res = await $cathayAxios.post('afy10400/prompt', {})
  if (res.returnCode !== 0) return
  displayMessages(res.data.messages)
})
</script>

<style scoped>
.afy10400 {
  min-height: 100%;
  background-color: #f0fbc6;
}

.afy10400__title {
  display: flex;
  align-items: center;
  min-height: 30px;
  padding: 2px;
}

.afy10400__title-mark {
  width: 20px;
  text-align: center;
}

.afy10400__screen-number {
  margin-left: auto;
}

.afy10400__content {
  width: 97%;
  margin: 30px auto 0;
  border: 1px solid #036;
}

.afy10400__section-title {
  margin: 0;
  padding: 5px;
}

.afy10400__emphasis {
  color: red;
}

.afy10400__label-cell,
.afy10400__center-cell,
.afy10400__export-cell {
  text-align: center;
}

.afy10400__label-cell,
.afy10400__value-cell {
  width: 20%;
}

.afy10400__product-cell {
  width: 40%;
}

.afy10400__insured-id {
  max-width: 12rem;
  margin: 0 auto;
}

.afy10400__entry-row--light {
  background-color: #fafbe1;
}

.afy10400__entry-row--dark {
  background-color: #eef1a7;
}
</style>
