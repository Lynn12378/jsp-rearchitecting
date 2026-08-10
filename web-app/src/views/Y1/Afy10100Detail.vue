<template>
  <CxlBreadcrumbs
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="rootPath"
  />

  <div class="row items-center justify-between q-mb-md">
    <div class="cxl-title-h1 q-mt-md">公會通報查詢</div>
    <div>畫面編號：AFY10100</div>
  </div>

  <q-card class="cxl-card q-pa-md">
    <q-markup-table
      class="cxl-table-form"
      flat
      bordered
      separator="cell"
    >
      <colgroup>
        <col v-for="columnIndex in 10" :key="columnIndex" style="width: 10%" />
      </colgroup>
      <thead>
        <tr>
          <th colspan="10" class="cxl-form-title">資料編輯區</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fieldRow in DETAIL_ROWS" :key="fieldRow.key">
          <template v-for="field in fieldRow.fields" :key="field.key">
            <th
              v-if="field.label"
              :id="`field-${field.key}`"
              scope="row"
            >
              {{ field.label }}
            </th>
            <td
              :colspan="field.colspan ?? 1"
              :headers="field.label ? `field-${field.key}` : undefined"
            >
              {{ displayValue(field) }}
            </td>
          </template>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { CxlBreadcrumbs } from "vue-cathaylife-component";
import navCollection from "@/service/NavCollection.js";
import afy10100DetailService from "@/service/Afy10100DetailService.js";

const $route = useRoute();
const $cathayAxios = inject("$cathayAxios");
const rootPath = { label: "首頁", url: "/" };

const DETAIL_ROWS = [
  {
    key: "row-1",
    fields: [
      { key: "INSR_TYPE", label: "通報方式" },
      { key: "CMNY_CODE", label: "公司別" },
      { key: "I_ID", label: "被保人ID" },
      { key: "I_BIRTHDAY", label: "被保人生日" },
      { key: "POLICY_NO", label: "保單號碼" },
    ],
  },
  {
    key: "row-2",
    fields: [
      { key: "POLICY_CAT", label: "保單分類" },
      { key: "POLICY_DUTY", label: "險種分類" },
      { key: "PROD_KIND", label: "險種" },
      { key: "STATUS", label: "保單狀況" },
      {
        key: "LST_CHG_DATE",
        label: "保單狀況生效日期(受理理賠日、身故日)",
      },
    ],
  },
  {
    key: "row-3",
    fields: [
      { key: "MAIN_POLICY_NO", label: "主約保單號碼" },
      { key: "ISSUE_DATE", label: "契約生效日" },
      { key: "ISSUE_TIME", label: "契約生效時分" },
      { key: "LPS_DATE", label: "契約滿期日" },
      { key: "LPS_TIME", label: "契約滿期時分" },
    ],
  },
  {
    key: "row-4",
    fields: [
      { key: "SIGN_DATE", label: "要保書填寫日" },
      { key: "PREM", label: "保費" },
      { key: "PAY_FREQ", label: "保費繳別" },
      { key: "PAY_PERIOD", label: "保費繳費年期" },
      { key: "LST_CHG_TIME", label: "保單狀況生效時分" },
    ],
  },
  {
    key: "row-5",
    fields: [
      { key: "PAY_AMT1", label: "身故" },
      { key: "PAY_AMT2", label: "完全失能或最高級失能" },
      { key: "PAY_AMT3", label: "失能扶助金" },
      { key: "PAY_AMT4", label: "特定事故" },
      { key: "PAY_AMT5", label: "初次罹患" },
    ],
  },
  {
    key: "row-6",
    fields: [
      { key: "PAY_AMT6", label: "醫療限額" },
      { key: "PAY_AMT7", label: "醫療限額自負" },
      { key: "PAY_AMT8", label: "醫療日額" },
      { key: "PAY_AMT9", label: "住院手術" },
      { key: "PAY_AMT10", label: "門診手術" },
    ],
  },
  {
    key: "row-7",
    fields: [
      { key: "PAY_AMT11", label: "門診" },
      { key: "PAY_AMT12", label: "重大疾/傷病" },
      { key: "PAY_AMT13", label: "重大燒燙傷" },
      { key: "PAY_AMT14", label: "癌症療養" },
      { key: "PAY_AMT15", label: "出院療養" },
    ],
  },
  {
    key: "row-8",
    fields: [
      { key: "PAY_AMT16", label: "喪失工作能力" },
      { key: "PAY_AMT17", label: "喪葬費用" },
      { key: "PAY_AMT18", label: "銜接原醫療限額之自負額" },
      { key: "PAY_AMT19", label: "分期給付" },
      { key: "BROKTYPE", label: "保經代分類" },
    ],
  },
  {
    key: "row-9",
    fields: [
      { key: "A_NAME", label: "要保人姓名" },
      { key: "A_ID", label: "要保人身分證號碼" },
      { key: "A_BIRTHDAY", label: "要保人出生日期" },
      { key: "RELATION", label: "要保人與被保險人關係" },
      { key: "UPDATE_TIME", label: "資料寫入時間" },
    ],
  },
  {
    key: "row-10",
    fields: [
      { key: "I_GENDER", label: "被保險人性別", lookup: "genderDesc" },
      { key: "PAY_TYPE", label: "公、自費件", lookup: "payTypeDesc" },
      { key: "OIU_IND", label: "來源別", lookup: "oiuIndDesc" },
      { key: "SALE_CHNL", label: "銷售通路", lookup: "saleChnlDesc" },
      { key: "PROD_CODE", label: "商品代碼" },
    ],
  },
  {
    key: "row-11",
    fields: [
      { key: "SER_NO", label: "公會取回序號" },
      { key: "blank", label: "", colspan: 8 },
    ],
  },
];

const pageData = ref({
  dataMap: {},
  genderDesc: {},
  payTypeDesc: {},
  oiuIndDesc: {},
  saleChnlDesc: {},
});

/**
 * 取得欄位顯示值，代碼欄位轉換為對應說明。
 *
 * @param {{ key: string, lookup?: string }} field - 欄位設定
 * @returns {*} 欄位顯示值
 */
const displayValue = (field) => {
  const value = pageData.value.dataMap[field.key];
  if (!field.lookup) {
    return value ?? "";
  }
  return pageData.value[field.lookup]?.[value] ?? value ?? "";
};

/**
 * 將頁面初始化資料映射至顯示 DTO。
 *
 * @param {object} data - AFY10100 頁面資料
 * @returns {void}
 */
const applyPageData = (data = {}) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new TypeError("AFY10100 prompt response data must be an object.");
  }
  pageData.value = {
    dataMap: data.dataMap ?? {},
    genderDesc: data.genderDesc ?? {},
    payTypeDesc: data.payTypeDesc ?? {},
    oiuIndDesc: data.oiuIndDesc ?? {},
    saleChnlDesc: data.saleChnlDesc ?? {},
  };
};

/**
 * 載入公會通報查詢資料。
 *
 * @returns {Promise<void>} 載入完成
 */
const loadPage = async () => {
  const response = await $cathayAxios.post(afy10100DetailService.prompt, {});
  if (response.returnCode !== 0) {
    return;
  }
  applyPageData(response.data);
};

onMounted(loadPage);
</script>
