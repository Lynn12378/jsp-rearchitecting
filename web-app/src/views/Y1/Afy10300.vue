<template>
  <CxlBreadcrumbs
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="rootPath"
  />

  <div class="row items-center justify-between q-mb-md">
    <div class="cxl-title-h1 q-mt-md">公會補通報作業</div>
    <div>畫面編號：AFY10300</div>
  </div>

  <q-card class="cxl-card q-pa-md">
    <q-markup-table
      class="cxl-table cxl-table-horizontal q-mb-md"
      flat
      bordered
      separator="cell"
      style="overflow-x: auto;"
    >
      <thead>
        <tr>
          <th colspan="9" class="cxl-table-header">查詢條件</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">
            <span class="cxl-text-danger">*</span>
            查詢方式
          </th>
          <td>
            <CxlDropdown
              v-model="fieldModels.queryNo.value"
              :options="QUERY_OPTIONS"
              :error="!!errors.queryNo"
              :error-message="errors.queryNo"
              emit-value
              map-options
            />
          </td>
          <th scope="row">失敗檔/保單號碼/被保人ID</th>
          <td>
            <CxlInput
              v-model="fieldModels.idNo.value"
              :error="!!errors.idNo"
              :error-message="errors.idNo"
              placeholder="請輸入查詢值"
            />
          </td>
          <th scope="row">通報日期</th>
          <td>
            <CxlInput
              v-model="fieldModels.insrDate.value"
              :error="!!errors.insrDate"
              :error-message="errors.insrDate"
              maxlength="7"
              placeholder="例：1150101"
            >
              <template #append>
                <span class="cxl-icon-calendar-ts cursor-pointer">
                  <CxlPopupProxy>
                    <CxlCalendar
                      v-model="fieldModels.insrDate.value"
                      calendar="ROC"
                      outputType="ROC"
                      mask="YYYMMDD"
                      minimal
                    />
                  </CxlPopupProxy>
                </span>
              </template>
            </CxlInput>
          </td>
          <th scope="row">錯誤代碼</th>
          <td>
            <CxlDropdown
              v-model="fieldModels.errorCode.value"
              :options="ERROR_CODE_OPTIONS"
              emit-value
              map-options
            />
          </td>
          <td class="text-center" rowspan="2">
            <CxlButton
              label="F2查詢"
              :loading="isProcessing"
              :disable="isProcessing"
              @click="queryData"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">收承方式</th>
          <td>
            <CxlDropdown
              v-model="fieldModels.insrType.value"
              :options="INSURANCE_TYPE_OPTIONS"
              emit-value
              map-options
            />
          </td>
          <th scope="row">商品屬性</th>
          <td>
            <CxlDropdown
              v-model="fieldModels.prodType.value"
              :options="PRODUCT_TYPE_OPTIONS"
              emit-value
              map-options
            />
          </td>
          <th scope="row">處理狀態</th>
          <td>
            <CxlDropdown
              v-model="fieldModels.procStatus.value"
              :options="PROCESS_STATUS_OPTIONS"
              emit-value
              map-options
            />
          </td>
          <td colspan="2"></td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-markup-table
      v-if="showEdit"
      class="cxl-table-form q-mb-md"
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
        <tr v-for="fieldRow in EDIT_ROWS" :key="fieldRow.key">
          <template v-for="field in fieldRow.fields" :key="field.name">
            <th scope="row">
              <span v-if="field.required" class="cxl-text-danger">*</span>
              <span :class="{ 'cxl-text-danger': field.emphasis }">
                {{ field.label }}
              </span>
            </th>
            <td>
              <span v-if="field.kind === 'display'">
                {{ fieldModels[field.name].value }}
              </span>
              <span v-else-if="field.receiverOnly && !isRType">-</span>
              <CxlDropdown
                v-else-if="field.kind === 'select'"
                v-model="fieldModels[field.name].value"
                :options="editOptionSets[field.options]"
                :error="!!errors[field.name]"
                :error-message="errors[field.name]"
                emit-value
                map-options
              />
              <CxlInput
                v-else
                v-model="fieldModels[field.name].value"
                :error="!!errors[field.name]"
                :error-message="errors[field.name]"
                :maxlength="field.maxlength"
              >
                <template v-if="field.kind === 'date'" #append>
                  <span class="cxl-icon-calendar-ts cursor-pointer">
                    <CxlPopupProxy>
                      <CxlCalendar
                        v-model="fieldModels[field.name].value"
                        calendar="ROC"
                        outputType="ROC"
                        mask="YYYMMDD"
                        minimal
                      />
                    </CxlPopupProxy>
                  </span>
                </template>
              </CxlInput>
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
          <td colspan="10">
            <div class="row justify-center q-gutter-sm">
              <CxlButton
                label="F9修改"
                :loading="isProcessing"
                :disable="isProcessing"
                @click="editData"
              />
              <CxlButton
                label="F10取消"
                theme="primary-outline"
                :disable="isProcessing"
                @click="cancelEdit"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <div v-if="showQuery" class="q-mb-md">
      <div class="cxl-title-h3 q-mb-md">查詢結果</div>
      <CxlTable
        v-model:selected="selectedRows"
        :rows="resultList"
        :columns="resultColumns"
        row-key="__rowKey"
        selection="single"
        separator="cell"
      >
        <template #body-selection="scope">
          <div class="row items-center justify-center">
            <q-radio
              :model-value="scope.selected"
              :val="true"
              class="cxl-radio"
              dense
              @update:model-value="selectResultRow(scope.row)"
            />
          </div>
        </template>
      </CxlTable>
      <div class="row justify-center q-mt-md">
        <CxlButton
          label="Excel匯出"
          :loading="isProcessing"
          :disable="isProcessing || resultList.length === 0"
          @click="exportFile"
        />
      </div>
    </div>

    <q-markup-table
      class="cxl-table cxl-table-horizontal q-mb-md"
      flat
      bordered
      separator="cell"
    >
      <tbody>
        <tr>
          <th scope="row">檔案匯入</th>
          <td>
            <q-file
              v-model="fieldModels.uploadFile.value"
              :error="!!errors.uploadFile"
              :error-message="errors.uploadFile"
              accept=".xlsx"
              dense
              outlined
              clearable
            />
          </td>
          <td>
            <div class="row justify-center q-gutter-sm">
              <CxlButton
                label="F8檔案上傳"
                :loading="isProcessing"
                :disable="isProcessing"
                @click="importFile"
              />
              <CxlButton
                label="即時大批通報"
                :disable="isProcessing"
                @click="confirmExecute"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <div class="cxl-ba-1 cxl-border-gray-d8 q-pa-md">
      <ol class="cxl-ordered-list q-my-none">
        <li>
          用大批匯入時，請先叫出資料後按Excel匯出鈕，再修改錯誤及處理結果（保單狀況生效日也需調整），最後選擇檔案並按F8檔案上傳。
          <span class="cxl-text-danger">（限用Google Chrome）</span>
        </li>
        <li>
          Excel表格內容說明：
          <ol type="A">
            <li>處理結果：本畫面修正及上傳時輸入8（7：不需通報、8：重新通報、9：至公會系統人工通報）。</li>
            <li>結果：目前僅會顯示3（通報失敗）。</li>
            <li>保額：此為投保保額，目前僅壽險會顯示。</li>
          </ol>
        </li>
        <li>按F8檔案上傳鈕：收件批次每半小時、承保隔天通報。</li>
        <li>即時大批通報鈕：將目前所有待通報之案件（收、承保）立即通報公會。</li>
        <li>
          請參考公會補通報操作手冊、新通報平台系統操作手冊。
          <CxlButton
            label="點我開啟"
            theme="primary-outline"
            @click="openOperationManual"
          />
        </li>
      </ol>
    </div>
  </q-card>

  <CxlModal
    v-model="executeConfirmOpen"
    title="確認"
    cancelText="取消"
    confirmText="確認"
    persistent
    @cancel="executeConfirmOpen = false"
    @confirm="executeImmediately"
  >
    <p class="cxl-font-18">{{ executeConfirmMessage }}</p>
  </CxlModal>
</template>

<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useField, useForm } from "vee-validate";
import { mixed, number, object, string } from "yup";
import {
  CxlBreadcrumbs,
  CxlButton,
  CxlCalendar,
  CxlDropdown,
  CxlInput,
  CxlModal,
  CxlPopupProxy,
  CxlTable,
} from "vue-cathaylife-component";
import navCollection from "@/service/NavCollection.js";
import afy10300Service from "@/service/Afy10300Service.js";

const $route = useRoute();
const $cathayAxios = inject("$cathayAxios");
const $notify = inject("$notify");
const rootPath = { label: "首頁", url: "/" };

const QUERY_OPTIONS = [
  { label: "失敗檔（可不輸入失敗檔序號）", value: "0" },
  { label: "保單號碼", value: "1" },
  { label: "被保人ID", value: "2" },
];
const ERROR_CODE_OPTIONS = ["99", "36", "37", "39", "40", "45"].map((value) => ({
  label: value === "99" ? "全部" : value,
  value,
}));
const INSURANCE_TYPE_OPTIONS = [
  { label: "承保", value: "L" },
  { label: "收件", value: "R" },
];
const PRODUCT_TYPE_OPTIONS = [
  { label: "個險", value: "AT" },
  { label: "團險", value: "BG" },
  { label: "意外險", value: "CB" },
];
const PROCESS_STATUS_OPTIONS = [
  { label: "未處理", value: "1" },
  { label: "已處理", value: "2" },
  { label: "全部", value: "0" },
];
const GENDER_OPTIONS = [
  { label: "男", value: "1" },
  { label: "女", value: "2" },
];
const POLICY_CATEGORY_OPTIONS = [
  { label: "個人", value: "1" },
  { label: "團體", value: "2" },
];
const PAY_TYPE_OPTIONS = [
  { label: "無", value: "0" },
  { label: "公費", value: "1" },
  { label: "自費", value: "2" },
];

const EDIT_ROWS = [
  {
    key: "insured",
    fields: [
      { name: "insrTypeDesc", label: "通報方式", kind: "display" },
      { name: "iName", label: "被保險人姓名" },
      { name: "iId", label: "被保人ID", maxlength: 10, required: true },
      { name: "iBirthday", label: "被保人生日", kind: "date", maxlength: 7, required: true },
      { name: "iGender", label: "被保險人性別", kind: "select", options: "gender" },
    ],
  },
  {
    key: "policy",
    fields: [
      { name: "mainPolicyNo", label: "主約保單號碼", maxlength: 20, required: true },
      { name: "policyNo", label: "保單號碼", required: true },
      { name: "oiuInd", label: "來源別OIU" },
      { name: "saleChnl", label: "銷售通路別", kind: "select", options: "saleChannel" },
      { name: "prodCode", label: "商品代碼" },
    ],
  },
  {
    key: "classification",
    fields: [
      { name: "policyCat", label: "保單分類", kind: "select", options: "policyCategory" },
      { name: "policyDuty", label: "險種分類", kind: "select", options: "policyDuty" },
      { name: "prodKind", label: "險種", kind: "select", options: "productKind" },
      { name: "payType", label: "公、自費件", kind: "select", options: "payType" },
      { name: "payAmt1", label: "身故", required: true },
    ],
  },
  {
    key: "amounts-2-6",
    fields: [
      { name: "payAmt2", label: "完全失能", required: true },
      { name: "payAmt3", label: "失能扶助金", required: true },
      { name: "payAmt4", label: "特定事故", required: true },
      { name: "payAmt5", label: "初次罹患", required: true },
      { name: "payAmt6", label: "醫療限額", required: true },
    ],
  },
  {
    key: "amounts-7-11",
    fields: [
      { name: "payAmt7", label: "醫療限額自負", required: true },
      { name: "payAmt8", label: "醫療日額", required: true },
      { name: "payAmt9", label: "住院手術", required: true },
      { name: "payAmt10", label: "門診手術" },
      { name: "payAmt11", label: "門診日額", required: true },
    ],
  },
  {
    key: "amounts-12-16",
    fields: [
      { name: "payAmt12", label: "重大疾/傷病", required: true },
      { name: "payAmt13", label: "重大燒燙傷", required: true },
      { name: "payAmt14", label: "癌症療養", required: true },
      { name: "payAmt15", label: "出院療養", required: true },
      { name: "payAmt16", label: "失能", required: true },
    ],
  },
  {
    key: "amounts-17-dates",
    fields: [
      { name: "payAmt17", label: "喪葬費用", required: true },
      { name: "payAmt18", label: "銜接原醫療限額之自負額", required: true },
      { name: "payAmt19", label: "分期給付", required: true },
      { name: "issueDate", label: "契約生效日期", kind: "date", maxlength: 7, required: true },
      { name: "issueTime", label: "契約生效時分（旅平險）" },
    ],
  },
  {
    key: "term",
    fields: [
      { name: "lpsDate", label: "契約滿期日期", kind: "date", maxlength: 7, required: true },
      { name: "lpsTime", label: "契約滿期時分" },
      { name: "prem", label: "保費", required: true },
      { name: "payFreq", label: "保費繳別", kind: "select", options: "paymentFrequency" },
      { name: "payPeriod", label: "保費繳費年期" },
    ],
  },
  {
    key: "status",
    fields: [
      { name: "status", label: "保單狀況" },
      {
        name: "lstChgDate",
        label: "保單狀況生效日期",
        kind: "date",
        maxlength: 7,
        required: true,
        emphasis: true,
      },
      { name: "lstChgTime", label: "保單狀況生效時分" },
      { name: "aName", label: "要保人姓名" },
      { name: "aId", label: "要保人身分證號碼", maxlength: 10, required: true },
    ],
  },
  {
    key: "applicant",
    fields: [
      { name: "aBirthday", label: "要保人生日", kind: "date", maxlength: 7, required: true },
      { name: "relation", label: "要被保人關係", kind: "select", options: "relation" },
      {
        name: "signDate",
        label: "要保書填寫日（收件才需要）",
        kind: "date",
        maxlength: 7,
        receiverOnly: true,
        emphasis: true,
      },
      {
        name: "brokType",
        label: "保經代類別",
        kind: "select",
        options: "brokerType",
        receiverOnly: true,
      },
      {
        name: "liaStatus",
        label: "通報狀態",
        kind: "select",
        options: "liaStatus",
        required: true,
        emphasis: true,
      },
    ],
  },
];

const BASE_RESULT_COLUMNS = [
  { name: "index", label: "序號", field: (_row, index) => index + 1, align: "center" },
  { name: "liaStatusDesc", label: "結果", field: "LIA_STATUS_DESC", align: "left" },
  { name: "faceAmount", label: "保額", field: "FACE_AMT", align: "right" },
  { name: "insuranceType", label: "通報方式", field: "INSR_TYPE_DESC", align: "left" },
  { name: "insuredId", label: "被保人ID", field: "I_ID", align: "left" },
  { name: "insuredBirthday", label: "被保人生日", field: "I_BIRTHDAY_ROC", align: "center" },
  { name: "insuredGender", label: "被保人性別", field: "I_GENDER_DESC", align: "center" },
  { name: "productCode", label: "商品代碼", field: "PROD_CODE", align: "left" },
  { name: "policyDuty", label: "險種分類", field: "POLICY_DUTY", align: "left" },
  { name: "productKind", label: "險種", field: "PROD_KIND", align: "left" },
  { name: "status", label: "保單狀況", field: "STATUS", align: "left" },
  { name: "issueDate", label: "契約生效日", field: "ISSUE_DATE_ROC", align: "center" },
  { name: "lapseDate", label: "契約滿期日", field: "LPS_DATE_ROC", align: "center" },
  {
    name: "lastChangeDate",
    label: "保單狀況生效日期",
    field: "LST_CHG_DATE_ROC",
    align: "center",
  },
  { name: "outputTime", label: "通報時間", field: "OUTPUT_TIME", align: "center" },
  { name: "memo", label: "錯誤原因", field: "MEMO", align: "left" },
];

const INITIAL_VALUES = {
  queryNo: "0",
  idNo: "",
  insrDate: "",
  errorCode: "99",
  insrType: "L",
  prodType: "AT",
  procStatus: "1",
  insrTypeDesc: "",
  iName: "",
  iId: "",
  iBirthday: "",
  iGender: "1",
  mainPolicyNo: "",
  policyNo: "",
  oiuInd: "",
  saleChnl: "",
  prodCode: "",
  policyCat: "1",
  policyDuty: "",
  prodKind: "",
  payType: "0",
  payAmt1: "",
  payAmt2: "",
  payAmt3: "",
  payAmt4: "",
  payAmt5: "",
  payAmt6: "",
  payAmt7: "",
  payAmt8: "",
  payAmt9: "",
  payAmt10: "",
  payAmt11: "",
  payAmt12: "",
  payAmt13: "",
  payAmt14: "",
  payAmt15: "",
  payAmt16: "",
  payAmt17: "",
  payAmt18: "",
  payAmt19: "",
  issueDate: "",
  issueTime: "",
  lpsDate: "",
  lpsTime: "",
  prem: "",
  payFreq: "",
  payPeriod: "",
  status: "",
  lstChgDate: "",
  lstChgTime: "",
  aName: "",
  aId: "",
  aBirthday: "",
  relation: "",
  signDate: "",
  brokType: "",
  liaStatus: "",
  uploadFile: null,
};

const isProcessing = ref(false);
const showQuery = ref(false);
const showEdit = ref(false);
const isRType = ref(false);
const resultList = ref([]);
const selectedRows = ref([]);
const executeConfirmOpen = ref(false);
const executeConfirmMessage = ref("");
const legacyShowEdit = ref("");
const validationMode = ref("query");

const selectedDisplay = reactive({
  outputTime: "",
  serNo: "",
  updateSrc: "",
  updateTime: "",
  memo: "",
});
const originalValues = reactive({
  iId: "",
  iBirthday: "",
  policyNo: "",
  policyCat: "",
  policyDuty: "",
  prodKind: "",
  status: "",
  lstChgDate: "",
  updateTime: "",
});
const registrationValues = reactive({
  queryNo: "",
  idNo: "",
  insrDate: "",
  insrType: "",
  errorCode: "",
  prodType: "",
  procStatus: "",
  radioNum: "",
});
const editOptionSets = reactive({
  gender: GENDER_OPTIONS,
  policyCategory: POLICY_CATEGORY_OPTIONS,
  payType: PAY_TYPE_OPTIONS,
  saleChannel: [],
  policyDuty: [],
  productKind: [],
  paymentFrequency: [],
  relation: [],
  brokerType: [],
  liaStatus: [],
});

/**
 * 建立非負數欄位驗證規則。
 *
 * @param {string} message - 驗證失敗訊息
 * @returns {import("yup").NumberSchema} Yup 數字規則
 */
const nonNegativeNumber = (message) =>
  number().typeError(message).min(0, message).required(message);

const querySchema = object({
  queryNo: string().required("請選擇查詢方式"),
  idNo: string().test({
    name: "queryIdRequired",
    message: "失敗檔/保單號碼/被保人ID不得為空白",
    test(value) {
      return this.parent.queryNo === "0" || Boolean(value?.trim());
    },
  }),
  insrDate: string().validateROCDate("通報日期非正確的日期格式"),
});
const editSchema = object({
  iId: string().trim().required("被保人不得為空值").max(10, "被保人ID不可超過10碼"),
  iBirthday: string()
    .required("被保人生日不得為空值、且必須為日期格式")
    .validateROCDate("被保人生日不得為空值、且必須為日期格式"),
  mainPolicyNo: string()
    .trim()
    .required("主約保單號碼不得為空值")
    .max(20, "主約保單號碼不可超過20碼"),
  policyNo: string().test({
    name: "policyPrefix",
    message: "保單號碼開頭不同於主約保單號碼",
    test(value) {
      return String(value ?? "").startsWith(String(this.parent.mainPolicyNo ?? ""));
    },
  }),
  payAmt1: nonNegativeNumber("身故不得為空值、且需為數字"),
  payAmt2: nonNegativeNumber("完全失能不得為空值、且需為數字"),
  payAmt3: nonNegativeNumber("失能扶助金不得為空值、且需為數字"),
  payAmt4: nonNegativeNumber("特定事故不得為空值、且需為數字"),
  payAmt5: nonNegativeNumber("初次罹患不得為空值、且需為數字"),
  payAmt6: nonNegativeNumber("醫療限額不得為空值、且需為數字"),
  payAmt7: nonNegativeNumber("醫療限額自負不得為空值、且需為數字"),
  payAmt8: nonNegativeNumber("醫療日額不得為空值、且需為數字"),
  payAmt9: nonNegativeNumber("住院手術不得為空值、且需為數字"),
  payAmt11: nonNegativeNumber("門診日額不得為空值、且需為數字"),
  payAmt12: nonNegativeNumber("重大疾傷病不得為空值、且需為數字"),
  payAmt13: nonNegativeNumber("重大燒燙傷不得為空值、且需為數字"),
  payAmt14: nonNegativeNumber("癌症療養不得為空值、且需為數字"),
  payAmt15: nonNegativeNumber("出院療養不得為空值、且需為數字"),
  payAmt16: nonNegativeNumber("失能不得為空值、且需為數字"),
  payAmt17: nonNegativeNumber("喪葬費用不得為空值、且需為數字"),
  payAmt18: nonNegativeNumber("銜接原醫療限額之自負額不得為空值、且需為數字"),
  payAmt19: nonNegativeNumber("分期給付不得為空值、且需為數字"),
  issueDate: string()
    .required("契約生效日不得為空值、且必須為日期格式")
    .validateROCDate("契約生效日不得為空值、且必須為日期格式"),
  lpsDate: string()
    .required("契約滿期日不得為空值、且必須為日期格式")
    .validateROCDate("契約滿期日不得為空值、且必須為日期格式"),
  lstChgDate: string()
    .required("保單狀況生效日不得為空值、且必須為日期格式")
    .validateROCDate("保單狀況生效日不得為空值、且必須為日期格式"),
  prem: nonNegativeNumber("保費不得為空值、且需為數字"),
  aId: string().trim().required("要保人不得為空值").max(10, "要保人ID不可超過10碼"),
  aBirthday: string()
    .required("要保人生日不得為空值、且必須為日期格式")
    .validateROCDate("要保人生日不得為空值、且必須為日期格式"),
  signDate: string().test({
    name: "receiverSignDate",
    message: "要保書填寫日必須為日期格式",
    test(value) {
      if (!isRType.value || !value) {
        return true;
      }
      return string().validateROCDate().isValidSync(value);
    },
  }),
  liaStatus: string().matches(/[0-9]/, "通報狀態需選擇").required("通報狀態需選擇"),
});
const importSchema = object({
  uploadFile: mixed()
    .required("請選擇檔案")
    .test(
      "xlsxFile",
      "檔案格式必須為xlsx檔",
      (file) => file instanceof File && /\.xlsx$/i.test(file.name),
    ),
});
const validationSchema = computed(
  () => ({
    query: querySchema,
    edit: editSchema,
    import: importSchema,
  })[validationMode.value],
);

const { errors, setErrors, setValues, validate } = useForm({
  validationSchema,
  initialValues: INITIAL_VALUES,
  validateOnMount: false,
});
const fieldModels = Object.fromEntries(
  Object.keys(INITIAL_VALUES).map((fieldName) => [
    fieldName,
    useField(fieldName).value,
  ]),
);

const resultColumns = computed(() => {
  const columns = [...BASE_RESULT_COLUMNS];
  if (isRType.value) {
    columns.splice(14, 0, {
      name: "signDate",
      label: "要保書填寫日期",
      field: "SIGN_DATE_ROC",
      align: "center",
    });
  }
  return columns;
});

/**
 * 取得指定表單欄位目前值。
 *
 * @param {string} fieldName - VeeValidate 欄位名稱
 * @returns {*} 欄位值
 */
const fieldValue = (fieldName) => fieldModels[fieldName].value;

/**
 * 將後端選項資料轉為 CxlDropdown 格式。
 *
 * @param {Array|Record<string, string>} sourceOptions - 後端選項
 * @returns {{ label: string, value: string }[]} 下拉選項
 */
const mapOptions = (sourceOptions) => {
  const options = Array.isArray(sourceOptions)
    ? sourceOptions
    : Object.entries(sourceOptions ?? {}).map(([key, value]) => ({ key, value }));
  return options.map((option) => {
    if (Object.hasOwn(option, "label") && Object.hasOwn(option, "value")) {
      return option;
    }
    const key = String(option.key ?? "");
    const description = String(option.value ?? "");
    return {
      label: description ? `${key} ${description}` : key,
      value: key,
    };
  });
};

/**
 * 執行 API 工作並同步控制操作按鈕狀態。
 *
 * @template T
 * @param {() => Promise<T>} action - 非同步工作
 * @returns {Promise<T>} 工作結果
 */
const runProcessing = async (action) => {
  isProcessing.value = true;
  try {
    return await action();
  } finally {
    isProcessing.value = false;
  }
};

/**
 * 呼叫 AFY10300 一般 JSON API。
 *
 * @param {string} endpoint - Service endpoint
 * @param {object} payload - 請求 DTO
 * @returns {Promise<object|null>} 成功資料，失敗時回傳 null
 */
const postAction = async (endpoint, payload) => {
  const response = await $cathayAxios.post(endpoint, payload);
  if (response.returnCode !== 0) {
    return null;
  }
  return response.data ?? {};
};

/**
 * 依目前欄位組成查詢與編輯共用 DTO。
 *
 * @returns {object} AFY10300 表單 DTO
 */
const buildFormPayload = () => ({
  queryNo: fieldValue("queryNo"),
  idNo: fieldValue("idNo"),
  insrDate: fieldValue("insrDate"),
  errorCode: fieldValue("errorCode"),
  insrType: fieldValue("insrType"),
  prodType: fieldValue("prodType"),
  procStatus: fieldValue("procStatus"),
  regQueryNo: registrationValues.queryNo,
  regIdNo: registrationValues.idNo,
  regInsrDate: registrationValues.insrDate,
  regInsrType: registrationValues.insrType,
  regErrorCode: registrationValues.errorCode,
  regProdType: registrationValues.prodType,
  regProcStatus: registrationValues.procStatus,
  regRadioNum: registrationValues.radioNum,
  showEdit: legacyShowEdit.value,
  I_NAME: fieldValue("iName"),
  I_ID: fieldValue("iId"),
  I_BIRTHDAY: fieldValue("iBirthday"),
  I_GENDER: fieldValue("iGender"),
  MAIN_POLICY_NO: fieldValue("mainPolicyNo"),
  POLICY_NO: fieldValue("policyNo"),
  OIU_IND: fieldValue("oiuInd"),
  SALE_CHNL: fieldValue("saleChnl"),
  PROD_CODE: fieldValue("prodCode"),
  POLICY_CAT: fieldValue("policyCat"),
  POLICY_DUTY: fieldValue("policyDuty"),
  PROD_KIND: fieldValue("prodKind"),
  PAY_TYPE: fieldValue("payType"),
  PAY_AMT1: fieldValue("payAmt1"),
  PAY_AMT2: fieldValue("payAmt2"),
  PAY_AMT3: fieldValue("payAmt3"),
  PAY_AMT4: fieldValue("payAmt4"),
  PAY_AMT5: fieldValue("payAmt5"),
  PAY_AMT6: fieldValue("payAmt6"),
  PAY_AMT7: fieldValue("payAmt7"),
  PAY_AMT8: fieldValue("payAmt8"),
  PAY_AMT9: fieldValue("payAmt9"),
  PAY_AMT10: fieldValue("payAmt10"),
  PAY_AMT11: fieldValue("payAmt11"),
  PAY_AMT12: fieldValue("payAmt12"),
  PAY_AMT13: fieldValue("payAmt13"),
  PAY_AMT14: fieldValue("payAmt14"),
  PAY_AMT15: fieldValue("payAmt15"),
  PAY_AMT16: fieldValue("payAmt16"),
  PAY_AMT17: fieldValue("payAmt17"),
  PAY_AMT18: fieldValue("payAmt18"),
  PAY_AMT19: fieldValue("payAmt19"),
  ISSUE_DATE: fieldValue("issueDate"),
  ISSUE_TIME: fieldValue("issueTime"),
  LPS_DATE: fieldValue("lpsDate"),
  LPS_TIME: fieldValue("lpsTime"),
  PREM: fieldValue("prem"),
  PAY_FREQ: fieldValue("payFreq"),
  PAY_PERIOD: fieldValue("payPeriod"),
  STATUS: fieldValue("status"),
  LST_CHG_DATE: fieldValue("lstChgDate"),
  LST_CHG_TIME: fieldValue("lstChgTime"),
  A_NAME: fieldValue("aName"),
  A_ID: fieldValue("aId"),
  A_BIRTHDAY: fieldValue("aBirthday"),
  RELATION: fieldValue("relation"),
  SIGN_DATE: fieldValue("signDate"),
  BROKTYPE: fieldValue("brokType"),
  LIA_STATUS: fieldValue("liaStatus"),
  UPDATE_TIME: selectedDisplay.updateTime,
  OLD_I_ID: originalValues.iId,
  OLD_I_BIRTHDAY: originalValues.iBirthday,
  OLD_POLICY_NO: originalValues.policyNo,
  OLD_POLICY_CAT: originalValues.policyCat,
  OLD_POLICY_DUTY: originalValues.policyDuty,
  OLD_PROD_KIND: originalValues.prodKind,
  OLD_STATUS: originalValues.status,
  OLD_LST_CHG_DATE: originalValues.lstChgDate,
  OLD_UPDATE_TIME: originalValues.updateTime,
});

/**
 * 將後端頁面資料套用至表單、結果與選項 DTO。
 *
 * @param {object} data - AFY10300 回應資料
 * @returns {void}
 */
const applyPageData = (data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new TypeError("AFY10300 response data must be an object.");
  }
  setValues({
    queryNo: data.queryNo ?? "0",
    idNo: data.idNo ?? "",
    insrDate: data.insrDate ?? "",
    errorCode: data.errorCode ?? "99",
    insrType: data.insrType ?? "L",
    prodType: data.prodType ?? "AT",
    procStatus: data.procStatus ?? "1",
  });
  registrationValues.queryNo = data.regQueryNo ?? "";
  registrationValues.idNo = data.regIdNo ?? "";
  registrationValues.insrDate = data.regInsrDate ?? "";
  registrationValues.insrType = data.regInsrType ?? "";
  registrationValues.errorCode = data.regErrorCode ?? "";
  registrationValues.prodType = data.regProdType ?? "";
  registrationValues.procStatus = data.regProcStatus ?? "";
  registrationValues.radioNum = data.regRadioNum ?? "";
  showQuery.value = Boolean(data.showQuery);
  showEdit.value = false;
  isRType.value = data.isRType ?? data.insrType === "R";
  selectedRows.value = [];
  resultList.value = (data.resultList ?? []).map((row, rowIndex) => ({
    ...row,
    __rowKey: `${row.SER_NO ?? row.POLICY_NO ?? "row"}-${rowIndex}`,
  }));
  editOptionSets.saleChannel = mapOptions(data.SALE_CHNL_OPTION);
  editOptionSets.policyDuty = mapOptions(data.POLICY_DUTY_OPTION);
  editOptionSets.productKind = mapOptions(data.PROD_KIND_OPTION);
  editOptionSets.paymentFrequency = mapOptions(data.PAY_FREQ_OPTION);
  editOptionSets.relation = mapOptions(data.RELATION_OPTION);
  editOptionSets.brokerType = mapOptions(data.BROKTYPE_OPTION);
  editOptionSets.liaStatus = mapOptions(data.LIA_STATUS_OPTION);

  for (const message of data.msgs ?? []) {
    if (typeof message === "string") {
      $notify.info(message);
    }
  }
};

/**
 * 將選取結果列映射到資料編輯區。
 *
 * @param {object} row - 查詢結果列
 * @returns {void}
 */
const selectResultRow = (row) => {
  selectedRows.value = [row];
  const rowNumber = resultList.value.findIndex((item) => item.__rowKey === row.__rowKey);
  registrationValues.radioNum = String(rowNumber);
  setValues({
    insrTypeDesc: row.INSR_TYPE_DESC ?? "",
    iName: row.I_NAME ?? "",
    iId: row.I_ID ?? "",
    iBirthday: row.I_BIRTHDAY_ROC ?? "",
    iGender: row.I_GENDER ?? "",
    mainPolicyNo: row.MAIN_POLICY_NO ?? "",
    policyNo: row.POLICY_NO ?? "",
    oiuInd: row.OIU_IND ?? "",
    saleChnl: row.SALE_CHNL ?? "",
    prodCode: row.PROD_CODE ?? "",
    policyCat: row.POLICY_CAT ?? "",
    policyDuty: row.POLICY_DUTY ?? "",
    prodKind: row.PROD_KIND ?? "",
    payType: row.PAY_TYPE ?? "",
    payAmt1: row.PAY_AMT1 ?? "",
    payAmt2: row.PAY_AMT2 ?? "",
    payAmt3: row.PAY_AMT3 ?? "",
    payAmt4: row.PAY_AMT4 ?? "",
    payAmt5: row.PAY_AMT5 ?? "",
    payAmt6: row.PAY_AMT6 ?? "",
    payAmt7: row.PAY_AMT7 ?? "",
    payAmt8: row.PAY_AMT8 ?? "",
    payAmt9: row.PAY_AMT9 ?? "",
    payAmt10: row.PAY_AMT10 ?? "",
    payAmt11: row.PAY_AMT11 ?? "",
    payAmt12: row.PAY_AMT12 ?? "",
    payAmt13: row.PAY_AMT13 ?? "",
    payAmt14: row.PAY_AMT14 ?? "",
    payAmt15: row.PAY_AMT15 ?? "",
    payAmt16: row.PAY_AMT16 ?? "",
    payAmt17: row.PAY_AMT17 ?? "",
    payAmt18: row.PAY_AMT18 ?? "",
    payAmt19: row.PAY_AMT19 ?? "",
    issueDate: row.ISSUE_DATE_ROC ?? "",
    issueTime: row.ISSUE_TIME ?? "",
    lpsDate: row.LPS_DATE_ROC ?? "",
    lpsTime: row.LPS_TIME ?? "",
    prem: row.PREM ?? "",
    payFreq: row.PAY_FREQ ?? "",
    payPeriod: row.PAY_PERIOD ?? "",
    status: row.STATUS ?? "",
    lstChgDate: row.LST_CHG_DATE_ROC ?? "",
    lstChgTime: row.LST_CHG_TIME ?? "",
    aName: row.A_NAME ?? "",
    aId: row.A_ID ?? "",
    aBirthday: row.A_BIRTHDAY_ROC ?? "",
    relation: row.RELATION ?? "",
    signDate: row.SIGN_DATE_ROC ?? "",
    brokType: row.BROKTYPE ?? "",
    liaStatus: row.LIA_STATUS ?? "",
  });
  selectedDisplay.outputTime = row.OUTPUT_TIME ?? "";
  selectedDisplay.serNo = row.SER_NO ?? "";
  selectedDisplay.updateSrc = row.UPDATE_SRC ?? "";
  selectedDisplay.updateTime = row.UPDATE_TIME ?? "";
  selectedDisplay.memo = row.MEMO ?? "";
  Object.assign(originalValues, {
    iId: row.I_ID ?? "",
    iBirthday: row.I_BIRTHDAY ?? "",
    policyNo: row.POLICY_NO ?? "",
    policyCat: row.POLICY_CAT ?? "",
    policyDuty: row.POLICY_DUTY ?? "",
    prodKind: row.PROD_KIND ?? "",
    status: row.STATUS ?? "",
    lstChgDate: row.LST_CHG_DATE ?? "",
    updateTime: row.UPDATE_TIME ?? "",
  });
  legacyShowEdit.value = "";
  showEdit.value = true;
};

/**
 * 切換驗證情境並驗證目前表單。
 *
 * @param {"query"|"edit"|"import"} mode - 驗證情境
 * @returns {Promise<boolean>} 是否通過驗證
 */
const validateMode = async (mode) => {
  setErrors({});
  validationMode.value = mode;
  await nextTick();
  const { valid } = await validate();
  return valid;
};

/**
 * 查詢公會補通報資料。
 *
 * @returns {Promise<void>} 查詢完成
 */
const queryData = async () => {
  if (!(await validateMode("query"))) {
    return;
  }
  const data = await runProcessing(() =>
    postAction(afy10300Service.query, buildFormPayload()),
  );
  if (data !== null) {
    applyPageData(data);
  }
};

/**
 * 修改選取的公會通報資料。
 *
 * @returns {Promise<void>} 修改完成
 */
const editData = async () => {
  if (!(await validateMode("edit"))) {
    return;
  }
  const data = await runProcessing(() =>
    postAction(afy10300Service.edit, buildFormPayload()),
  );
  if (data !== null) {
    applyPageData(data);
  }
};

/**
 * 關閉資料編輯區。
 *
 * @returns {void}
 */
const cancelEdit = () => {
  legacyShowEdit.value = "N";
  showEdit.value = false;
  selectedRows.value = [];
};

/**
 * 依目前查詢條件下載 Excel。
 *
 * @returns {Promise<void>} 下載完成
 */
const exportFile = async () => {
  const payload = {
    regQueryNo: registrationValues.queryNo,
    regIdNo: registrationValues.idNo,
    regInsrDate: registrationValues.insrDate,
    regInsrType: registrationValues.insrType,
    regErrorCode: registrationValues.errorCode,
    regProdType: registrationValues.prodType,
    regProcStatus: registrationValues.procStatus,
  };
  await runProcessing(() =>
    $cathayAxios.download(afy10300Service.exportFile, payload, "AFY10300.xlsx"),
  );
};

/**
 * 上傳 Excel 修正檔。
 *
 * @returns {Promise<void>} 上傳完成
 */
const importFile = async () => {
  if (!(await validateMode("import"))) {
    return;
  }
  const payload = new FormData();
  payload.append("uploadFile", fieldValue("uploadFile"));
  const response = await runProcessing(() =>
    $cathayAxios.upload(afy10300Service.importFile, payload),
  );
  if (response.returnCode !== 0) {
    return;
  }
  applyPageData(response.data ?? {});
};

/**
 * 開啟即時大批通報確認視窗。
 *
 * @returns {void}
 */
const confirmExecute = () => {
  if (fieldValue("insrType") === "R") {
    $notify.warning("僅可選擇承保通報（收件類每30分鐘一次）");
    return;
  }
  const insuranceLabel =
    INSURANCE_TYPE_OPTIONS.find((option) => option.value === fieldValue("insrType"))
      ?.label ?? "";
  const productLabel =
    PRODUCT_TYPE_OPTIONS.find((option) => option.value === fieldValue("prodType"))
      ?.label ?? "";
  executeConfirmMessage.value = `確認要執行【${productLabel}${insuranceLabel}】即時大批通報嗎？`;
  executeConfirmOpen.value = true;
};

/**
 * 執行即時大批通報。
 *
 * @returns {Promise<void>} 執行完成
 */
const executeImmediately = async () => {
  executeConfirmOpen.value = false;
  const data = await runProcessing(() =>
    postAction(afy10300Service.execute, buildFormPayload()),
  );
  if (data !== null) {
    applyPageData(data);
  }
};

/**
 * 開啟公會補通報操作手冊。
 *
 * @returns {Promise<void>} 請求完成
 */
const openOperationManual = async () => {
  await runProcessing(() =>
    postAction(afy10300Service.operationManual, {
      SYS_NO: "AT",
      SUB_SYS_NO: "A0",
      FUNC_ID: "ATA00611",
      isShowQueryItem: "R",
    }),
  );
};

/**
 * 處理 AFY10300 功能鍵。
 *
 * @param {KeyboardEvent} event - 鍵盤事件
 * @returns {void}
 */
const handleHotKey = (event) => {
  const handlers = {
    F2: queryData,
    F8: importFile,
    F9: showEdit.value ? editData : null,
    F10: showEdit.value ? cancelEdit : null,
  };
  const handler = handlers[event.key];
  if (!handler) {
    return;
  }
  event.preventDefault();
  handler();
};

/**
 * 載入 AFY10300 初始資料。
 *
 * @returns {Promise<void>} 載入完成
 */
const loadPage = async () => {
  const data = await runProcessing(() => postAction(afy10300Service.prompt, {}));
  if (data !== null) {
    applyPageData(data);
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleHotKey);
  loadPage();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleHotKey);
});
</script>
