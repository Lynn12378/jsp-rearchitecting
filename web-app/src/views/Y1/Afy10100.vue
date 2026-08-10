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

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <q-markup-table
      class="cxl-table cxl-table-horizontal"
      flat
      bordered
      separator="cell"
    >
      <thead>
        <tr>
          <th colspan="6" class="cxl-table-header">查詢條件</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th id="input-id-label" scope="row">
            <span class="cxl-text-danger">*</span>
            身份證字號／統一編號
          </th>
          <td>
            <CxlInput
              v-model="inputId"
              placeholder="請輸入身份證字號或統一編號"
              :error="!!errors.inputId"
              :error-message="errors.inputId"
              aria-labelledby="input-id-label"
              aria-required="true"
            />
          </td>
          <th id="role-label" scope="row">契約角色</th>
          <td>
            <CxlDropdown
              v-model="role"
              :options="ROLE_OPTIONS"
              map-options
              emit-value
              aria-labelledby="role-label"
            />
          </td>
          <th id="status-label" scope="row">保單效力</th>
          <td>
            <CxlDropdown
              v-model="status"
              :options="STATUS_OPTIONS"
              map-options
              emit-value
              aria-labelledby="status-label"
            />
          </td>
        </tr>
        <tr v-if="pageData.isReturn">
          <th scope="row">公會回檔狀態</th>
          <td colspan="5">
            <q-checkbox
              v-model="isReturnChecked"
              class="cxl-checkbox"
              dense
              label="同步更新公會回檔狀態"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">姓名</th>
          <td>{{ pageData.dataMap.NAME }}</td>
          <th scope="row">生日</th>
          <td>{{ pageData.dataMap.BIRTHDAY }}</td>
          <th scope="row">公會資料取回日期</th>
          <td>{{ pageData.dataMap.LAST_UPDATE_TIME }}</td>
        </tr>
        <tr>
          <td colspan="6">
            <div class="row justify-center q-gutter-sm">
              <CxlButton label="F2 查詢" @click="doQuery" />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <q-markup-table style="overflow-x: auto;" class="cxl-table" flat bordered separator="cell">
      <thead>
        <tr>
          <th colspan="15" class="cxl-table-header">保障項目彙整</th>
        </tr>
        <tr>
          <template v-for="group in 3" :key="group">
            <th scope="col">項目</th>
            <th scope="col">合計</th>
            <th scope="col">同業合計</th>
            <th scope="col">收件</th>
            <th scope="col">承保</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="benefitRow in benefitRows" :key="benefitRow[0].key">
          <template v-for="item in benefitRow" :key="item.key">
            <th scope="row">{{ item.label }}</th>
            <td class="text-right">
              {{ formatNumber(pageData.dataMap[`${item.key}_Tot`]) }}
            </td>
            <td class="text-right">
              {{ formatNumber(pageData.dataMap[`${item.key}_TotSame`]) }}
            </td>
            <td class="text-right">
              {{ formatNumber(pageData.dataMap[`${item.key}_Rr`]) }}
            </td>
            <td class="text-right">
              {{ formatNumber(pageData.dataMap[`${item.key}_LN`]) }}
            </td>
          </template>
          <template
            v-for="emptyGroup in 3 - benefitRow.length"
            :key="`empty-benefit-${emptyGroup}`"
          >
            <th scope="row"></th>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </template>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <q-markup-table class="cxl-table" flat bordered separator="cell">
      <thead>
        <tr>
          <th colspan="13" class="cxl-table-header">保費資料彙整</th>
        </tr>
        <tr>
          <template v-for="group in 3" :key="group">
            <th scope="col">項目</th>
            <th scope="col">合計</th>
            <th scope="col">收件</th>
            <th scope="col">承保</th>
          </template>
          <th scope="col">操作者</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <template v-for="item in PREMIUM_ITEMS" :key="item.key">
            <th scope="row">{{ item.label }}</th>
            <td class="text-right">
              {{ formatNumber(pageData.dataMap[`${item.key}_Tot`]) }}
            </td>
            <td class="text-right">
              {{ formatNumber(pageData.dataMap[`${item.key}_Rr`]) }}
            </td>
            <td class="text-right">
              {{ formatNumber(pageData.dataMap[`${item.key}_LN`]) }}
            </td>
          </template>
          <td>{{ pageData.dataMap.UPDATE_ID }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <q-card v-if="selectedRowKey" class="cxl-card q-pa-md q-mb-lg">
    <q-markup-table
      class="cxl-table-form"
      flat
      bordered
      separator="horizontal"
    >
      <colgroup>
        <col style="width: 12%" />
        <col style="width: 21%" />
        <col style="width: 12%" />
        <col style="width: 21%" />
        <col style="width: 12%" />
        <col style="width: 22%" />
      </colgroup>
      <thead>
        <tr>
          <th colspan="6" class="cxl-form-title">資料編輯區</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fieldRow in EDIT_FIELD_ROWS" :key="fieldRow.key">
          <template v-for="field in fieldRow.fields" :key="field.key">
            <template v-if="field.blank">
              <td colspan="2"></td>
            </template>
            <template v-else>
              <th :id="`edit-field-${field.key}`" scope="row">
                {{ field.label }}
              </th>
              <td>
                <CxlInput
                  v-if="field.editor === 'input'"
                  v-model="editModel[field.key]"
                  :aria-labelledby="`edit-field-${field.key}`"
                />
                <CxlDropdown
                  v-else-if="field.editor === 'dropdown'"
                  v-model="editModel[field.key]"
                  :options="field.options"
                  map-options
                  emit-value
                  :aria-labelledby="`edit-field-${field.key}`"
                />
                <template v-else>
                  {{ getEditDisplayValue(field.key) }}
                </template>
              </td>
            </template>
          </template>
        </tr>
        <tr>
          <td colspan="6">
            <div class="row justify-center q-gutter-sm">
              <CxlButton label="F9 修改" @click="doEdit" />
              <CxlButton
                label="F10 刪除"
                theme="danger"
                @click="doDelete"
              />
              <CxlButton
                label="取消"
                theme="primary-outline"
                @click="clearSelection"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <div class="cxl-title-h3 q-mb-md">新制通報資料明細</div>
    <CxlTable
      v-model:pagination="tablePagination"
      v-model:selected="selectedRows"
      :rows="resultRows"
      :columns="RESULT_COLUMNS"
      row-key="__rowKey"
      selection="single"
      separator="cell"
      :rows-per-page-options="[0]"
      :hide-bottom="resultRows.length > 0"
    >
      <template #body-cell-insuranceType="props">
        <q-td :props="props">
          <CxlButton
            :label="formatInsuranceType(props.row)"
            theme="primary-outline"
            @click.stop="openDetail(props.row)"
          />
        </q-td>
      </template>
    </CxlTable>
    <div v-if="pageData.isAllow" class="row justify-center q-mt-md">
      <CxlButton
        label="F8 即時取回公會資料"
        @click="doAsyncCheck"
      />
    </div>
  </q-card>

  <q-card class="cxl-card q-pa-md q-mb-lg">
    <CxlAccordion>
      <template #header>
        <span class="cxl-accordion-title">操作說明</span>
        <span class="cxl-accordion-subtitle">代碼與欄位說明</span>
      </template>
      <template #content>
        <div class="q-gutter-sm">
          <div v-for="note in NOTES" :key="note">{{ note }}</div>
        </div>
      </template>
    </CxlAccordion>
  </q-card>

  <CxlModal
    v-model="detailDialogOpen"
    title="公會通報資料明細"
    cancelText="關閉"
    size="lg"
    contentScroll
    @cancel="closeDetail"
  >
    <q-markup-table
      class="cxl-table-form"
      flat
      bordered
      separator="horizontal"
    >
      <colgroup>
        <col style="width: 12%" />
        <col style="width: 21%" />
        <col style="width: 12%" />
        <col style="width: 21%" />
        <col style="width: 12%" />
        <col style="width: 22%" />
      </colgroup>
      <tbody>
        <tr v-for="fieldRow in DETAIL_FIELD_ROWS" :key="fieldRow.key">
          <template v-for="field in fieldRow.fields" :key="field.key">
            <template v-if="field.blank">
              <td colspan="2"></td>
            </template>
            <template v-else>
              <th scope="row">{{ field.label }}</th>
              <td>{{ getDetailDisplayValue(field.key) }}</td>
            </template>
          </template>
        </tr>
      </tbody>
    </q-markup-table>
  </CxlModal>

  <CxlModal
    v-model="confirmationDialogOpen"
    :title="confirmationTitle"
    confirmText="確認"
    cancelText="取消"
    persistent
    @confirm="handleConfirmation"
    @cancel="handleConfirmationCancel"
  >
    <div>{{ confirmationMessage }}</div>
  </CxlModal>
</template>

<script setup>
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useRoute } from "vue-router";
import { useField, useForm } from "vee-validate";
import { object, string } from "yup";
import {
  CxlAccordion,
  CxlBreadcrumbs,
  CxlButton,
  CxlDropdown,
  CxlInput,
  CxlModal,
  CxlTable,
} from "vue-cathaylife-component";
import navCollection from "@/service/NavCollection.js";
import afy10100Service from "@/service/Afy10100Service.js";

const $route = useRoute();
const $cathayAxios = inject("$cathayAxios");
const rootPath = { label: "首頁", url: "/" };

const VALIDATION_SCHEMA = object({
  inputId: string()
    .trim()
    .required("身份證字號／統一編號：不得為空值"),
});
const { errors, setValues, validate } = useForm({
  validationSchema: VALIDATION_SCHEMA,
  initialValues: { inputId: "" },
  validateOnMount: false,
});
const { value: inputId } = useField("inputId");

const ROLE_OPTIONS = [
  { label: "被保人", value: "I" },
  { label: "要保人", value: "A" },
];
const STATUS_OPTIONS = [
  { label: "有效", value: "Y" },
  { label: "無效", value: "N" },
  { label: "全部", value: "A" },
];
const GENDER_OPTIONS = [
  { label: "男", value: "1" },
  { label: "女", value: "2" },
];
const PAY_TYPE_OPTIONS = [
  { label: "無", value: "0" },
  { label: "公費", value: "1" },
  { label: "自費", value: "2" },
];

const BENEFIT_ITEMS = [
  { key: "PAY_AMT1", label: "身故" },
  { key: "PAY_AMT2", label: "完全失能或最高級失能" },
  { key: "PAY_AMT3", label: "失能扶助金" },
  { key: "PAY_AMT4", label: "特定事故" },
  { key: "PAY_AMT5", label: "初次罹患" },
  { key: "PAY_AMT6", label: "醫療限額" },
  { key: "PAY_AMT7", label: "醫療限額自負" },
  { key: "PAY_AMT8", label: "醫療日額" },
  { key: "PAY_AMT9", label: "住院手術" },
  { key: "PAY_AMT10", label: "門診手術" },
  { key: "PAY_AMT11", label: "門診" },
  { key: "PAY_AMT12", label: "重大疾／傷病" },
  { key: "PAY_AMT13", label: "重大燒燙傷" },
  { key: "PAY_AMT14", label: "癌症療養" },
  { key: "PAY_AMT15", label: "出院療養" },
  { key: "PAY_AMT16", label: "喪失工作能力" },
  { key: "PAY_AMT17", label: "喪葬費用" },
  { key: "PAY_AMT18", label: "銜接原醫療限額之自負額" },
  { key: "PAY_AMT19", label: "分期給付" },
];
const PREMIUM_ITEMS = [
  { key: "YEAR_PREM", label: "年繳保費" },
  { key: "ONCE_PREM", label: "躉繳保費" },
  { key: "FLEX_PREM", label: "超額（彈性）保險費" },
];
const DISPLAY_FIELDS = [
  { key: "INSR_TYPE", label: "通報方式" },
  { key: "CMNY_CODE", label: "公司別" },
  { key: "I_ID", label: "被保人 ID" },
  { key: "I_BIRTHDAY", label: "被保人生日" },
  { key: "POLICY_NO", label: "保單號碼" },
  { key: "POLICY_CAT", label: "保單分類" },
  { key: "POLICY_DUTY", label: "險種分類" },
  { key: "PROD_KIND", label: "險種" },
  { key: "STATUS", label: "保單狀況" },
  {
    key: "LST_CHG_DATE",
    label: "保單狀況生效日期（受理理賠日、身故日）",
  },
  { key: "MAIN_POLICY_NO", label: "主約保單號碼" },
  { key: "ISSUE_DATE", label: "契約生效日" },
  { key: "ISSUE_TIME", label: "契約生效時分" },
  { key: "LPS_DATE", label: "契約滿期日" },
  { key: "LPS_TIME", label: "契約滿期時分" },
  { key: "SIGN_DATE", label: "要保書填寫日" },
  { key: "PREM", label: "保費" },
  { key: "PAY_FREQ", label: "保費繳別" },
  { key: "PAY_PERIOD", label: "保費繳費年期" },
  { key: "LST_CHG_TIME", label: "保單狀況生效時分" },
];
const EDITABLE_TEXT_FIELDS = [
  { key: "BROKTYPE", label: "保經代分類" },
  { key: "A_NAME", label: "要保人姓名" },
  { key: "A_ID", label: "要保人身分證號碼" },
  { key: "A_BIRTHDAY", label: "要保人出生日期" },
  { key: "RELATION", label: "要保人與被保險人關係" },
];
const EDIT_KEYS = [
  "TBL_NAME",
  ...DISPLAY_FIELDS.map(({ key }) => key),
  ...BENEFIT_ITEMS.map(({ key }) => key),
  ...EDITABLE_TEXT_FIELDS.map(({ key }) => key),
  "UPDATE_TIME",
  "SER_NO",
  "I_GENDER",
  "PAY_TYPE",
];
const EDIT_FIELDS = [
  ...DISPLAY_FIELDS,
  ...BENEFIT_ITEMS.map((field) => ({ ...field, editor: "input" })),
  ...EDITABLE_TEXT_FIELDS.map((field) => ({ ...field, editor: "input" })),
  { key: "INPUT_TIME", label: "資料寫入時間" },
  {
    key: "I_GENDER",
    label: "被保險人性別",
    editor: "dropdown",
    options: GENDER_OPTIONS,
  },
  {
    key: "PAY_TYPE",
    label: "公、自費件",
    editor: "dropdown",
    options: PAY_TYPE_OPTIONS,
  },
  { key: "OIU_IND", label: "來源別" },
  { key: "SALE_CHNL", label: "銷售通路" },
  { key: "PROD_CODE", label: "商品代碼" },
  { key: "SER_NO", label: "公會取回序號" },
];

/**
 * 將欄位設定分組，並補齊密集表格末列。
 *
 * @param {object[]} fields - 欄位設定
 * @param {number} size - 每列欄位數
 * @returns {{ key: string, fields: object[] }[]} 表格列設定
 */
const createFieldRows = (fields, size) => {
  const rows = [];
  for (let offset = 0; offset < fields.length; offset += size) {
    const rowFields = fields.slice(offset, offset + size);
    while (rowFields.length < size) {
      rowFields.push({
        key: `blank-${offset}-${rowFields.length}`,
        blank: true,
      });
    }
    rows.push({ key: `row-${offset / size + 1}`, fields: rowFields });
  }
  return rows;
};

const EDIT_FIELD_ROWS = createFieldRows(EDIT_FIELDS, 3);
const DETAIL_FIELD_ROWS = createFieldRows(
  EDIT_FIELDS.filter(({ key }) => key !== "INPUT_TIME").concat({
    key: "UPDATE_TIME",
    label: "通報時間",
  }),
  3,
);

const RESULT_COLUMNS = [
  {
    name: "sequence",
    label: "序號",
    field: "__sequence",
    align: "center",
  },
  {
    name: "insuranceType",
    label: "通報方式",
    field: "INSR_TYPE",
    align: "left",
    sortable: true,
  },
  {
    name: "companyName",
    label: "公司別",
    field: "COMPANY_NAME",
    align: "left",
    sortable: true,
  },
  {
    name: "policyNumber",
    label: "保單號碼",
    field: "POLICY_NO",
    align: "center",
    sortable: true,
  },
  {
    name: "saleChannel",
    label: "銷售通路",
    field: "SALE_CHNL",
    align: "left",
  },
  {
    name: "productCode",
    label: "商品代碼",
    field: "PROD_CODE",
    align: "left",
  },
  {
    name: "policyCategory",
    label: "保單分類",
    field: "POLICY_CAT",
    align: "left",
  },
  {
    name: "policyDuty",
    label: "險種分類",
    field: "POLICY_DUTY",
    align: "left",
  },
  {
    name: "productKind",
    label: "險種",
    field: "PROD_KIND",
    align: "left",
    sortable: true,
  },
  {
    name: "policyStatus",
    label: "保單狀況",
    field: "STATUS",
    align: "left",
  },
  {
    name: "payAmount1",
    label: "身故保額",
    field: "PAY_AMT1",
    align: "right",
    format: (value) => formatNumber(value),
  },
  {
    name: "payAmount6",
    label: "醫療限額",
    field: "PAY_AMT6",
    align: "right",
    format: (value) => formatNumber(value),
  },
  {
    name: "payAmount8",
    label: "醫療日額",
    field: "PAY_AMT8",
    align: "right",
    format: (value) => formatNumber(value),
  },
  {
    name: "issueDate",
    label: "契約生效日",
    field: "ISSUE_DATE",
    align: "left",
    sortable: true,
  },
  {
    name: "lapseDate",
    label: "契約滿期日",
    field: "LPS_DATE",
    align: "left",
  },
  {
    name: "applicantName",
    label: "要保人姓名",
    field: "A_NAME",
    align: "left",
  },
  {
    name: "updateTime",
    label: "通報時間",
    field: "UPDATE_TIME",
    align: "left",
  },
];

const NOTES = [
  "1. 銷售通路：1 網路投保；2 業務員；3 保經、保代；4 電話行銷；5 機場櫃檯。",
  "2. 保單分類：1 個人；2 團體。",
  "3. 險種分類：1 人壽保險；2 傷害保險；3 健康保險；4 年金保險。",
  "4. 險種：01 一般；02 特定；03 投資型；04 日額型；05 實支實付型；06 日額或實支實付擇一型；07 手術型；08 重大疾病；09 帳戶型；10 長期看護型；11 喪失工作能力；12 防癌；13 旅平險；14 微型；15 微型實支實付；16 小額終老保險；17 失能扶助保險；18 登山綜合保險；19 定期人壽保險（不含一年期）；20 海域活動綜合保險；21 一年期。",
  "5. 繳別：1 躉繳；2 年繳；3 半年繳；4 季繳；5 月繳；6 彈性繳；9 繳費期滿。",
  "6. 保單狀況：收件：01 有效；06 未承保取消件；07 契約註銷；11 滿期（契約到期）；12 鍵值欄位通報錯誤終止；15 通報更正；50 一○七條／一○七條之一承保資料；51 一○七條理賠資料（未滿 14 足歲之未成年人）；52 一○七條／一○七條之一理賠資料（精神障礙或其他心智缺陷／受監護宣告尚未撤銷）。承保：01 有效；02 增額；03 減額；04 展期；05 繳清；06 契約撤銷；07 停效；10 解除契約；11 滿期（契約到期）；12 鍵值欄位通報錯誤終止；20 終止 1（由要保人提出終止契約效力）；21 終止 2（主被保險人死亡，其他被保險人附同時終止或完全失能或理賠給付後終止附約）；30 被保險人因自然死身故；31 被保險人因意外身故；32 被保險人因其他原因身故；50 一○七條／一○七條之一承保資料；51 一○七條理賠資料（未滿 14 足歲之未成年人）；52 一○七條／一○七條之一理賠資料（精神障礙或其他心智缺陷／受監護宣告尚未撤銷）。",
  "7. 保障及保費彙整欄位依頁面筆數加總，包含本公司及產、壽險通報資料。",
  "8. 輸入身份證字號／統一編號後，可按 F8 即時取回公會資料。",
];

const role = ref("I");
const status = ref("Y");
const isReturnChecked = ref(false);
const selectedRows = ref([]);
const tablePagination = ref({ page: 1, rowsPerPage: 0 });
const selectedRowKey = ref(null);
const selectedItemValue = ref("");
const selectedInputTime = ref("");
const detailDialogOpen = ref(false);
const detailParameters = ref({});
const confirmationDialogOpen = ref(false);
const confirmationTitle = ref("確認");
const confirmationMessage = ref("");
let pendingConfirmAction = null;

const pageData = reactive({
  isReturn: false,
  isAllow: false,
  dataMap: {},
  resultList: [],
  insuranceTypeMap: {},
  oiuIndDesc: {},
  saleChnlDesc: {},
});
const editModel = reactive(
  Object.fromEntries(EDIT_KEYS.map((key) => [key, ""])),
);
const selectedDescriptions = reactive({
  oiuInd: "",
  saleChannel: "",
  productCode: "",
});

const benefitRows = computed(() => createFieldRows(BENEFIT_ITEMS, 3).map(
  ({ fields }) => fields.filter((field) => !field.blank),
));
const resultRows = computed(() =>
  pageData.resultList.map((row, rowIndex) => ({
    ...row,
    __sequence: rowIndex + 1,
    __rowKey: createRowKey(row),
  })),
);

/**
 * 將數值格式化為千分位文字。
 *
 * @param {string|number|null|undefined} value - 原始值
 * @returns {string|number} 格式化結果
 */
const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  const number = Number(value);
  return Number.isNaN(number)
    ? value
    : new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 20,
      }).format(number);
};

/**
 * 建立結果列唯一識別值。
 *
 * @param {object} row - API 結果列
 * @returns {string} 唯一識別值
 */
const createRowKey = (row) =>
  [
    row.TBL_NAME,
    row.INSR_TYPE,
    row.CMNY_CODE,
    row.POLICY_NO,
    row.UPDATE_TIME,
    row.SER_NO,
  ].join("|");

/**
 * 格式化通報方式與說明。
 *
 * @param {object} row - API 結果列
 * @returns {string} 通報方式顯示文字
 */
const formatInsuranceType = (row) =>
  [row.INSR_TYPE, pageData.insuranceTypeMap[row.INSR_TYPE]]
    .filter(Boolean)
    .join(" ");

/**
 * 取得編輯區唯讀欄位值。
 *
 * @param {string} key - 欄位鍵值
 * @returns {*} 顯示值
 */
const getEditDisplayValue = (key) => {
  const specialValues = {
    INPUT_TIME: selectedInputTime.value,
    OIU_IND: selectedDescriptions.oiuInd,
    SALE_CHNL: selectedDescriptions.saleChannel,
    PROD_CODE: selectedDescriptions.productCode,
  };
  return specialValues[key] ?? editModel[key] ?? "";
};

/**
 * 取得明細彈窗欄位值。
 *
 * @param {string} key - 欄位鍵值
 * @returns {*} 顯示值
 */
const getDetailDisplayValue = (key) => {
  const value = detailParameters.value[key];
  const lookupMaps = {
    INSR_TYPE: pageData.insuranceTypeMap,
    I_GENDER: Object.fromEntries(
      GENDER_OPTIONS.map((option) => [option.value, option.label]),
    ),
    PAY_TYPE: Object.fromEntries(
      PAY_TYPE_OPTIONS.map((option) => [option.value, option.label]),
    ),
    OIU_IND: pageData.oiuIndDesc,
    SALE_CHNL: pageData.saleChnlDesc,
  };
  return lookupMaps[key]?.[value] ?? value ?? "";
};

/**
 * 清空編輯區資料。
 *
 * @returns {void}
 */
const clearEditModel = () => {
  selectedRowKey.value = null;
  selectedItemValue.value = "";
  selectedInputTime.value = "";
  EDIT_KEYS.forEach((key) => {
    editModel[key] = "";
  });
  selectedDescriptions.oiuInd = "";
  selectedDescriptions.saleChannel = "";
  selectedDescriptions.productCode = "";
};

/**
 * 清除表格選取與編輯資料。
 *
 * @returns {void}
 */
const clearSelection = () => {
  selectedRows.value = [];
  clearEditModel();
};

/**
 * 將選取列映射至編輯區。
 *
 * @param {object} row - 選取的結果列
 * @returns {void}
 */
const selectItem = (row) => {
  selectedRowKey.value = row.__rowKey;
  selectedItemValue.value = String(row.__sequence - 1);
  EDIT_KEYS.forEach((key) => {
    editModel[key] = row[key] ?? "";
  });
  selectedInputTime.value = row.INPUT_TIME ?? "";
  selectedDescriptions.oiuInd = pageData.oiuIndDesc[row.OIU_IND] ?? "";
  selectedDescriptions.saleChannel =
    pageData.saleChnlDesc[row.SALE_CHNL] ?? "";
  selectedDescriptions.productCode = row.PROD_CODE ?? "";
};

watch(selectedRows, (rows) => {
  if (rows.length === 0) {
    clearEditModel();
    return;
  }
  selectItem(rows[0]);
});

/**
 * 將 API 資料映射至頁面 DTO。
 *
 * @param {object} data - AFY10100 頁面資料
 * @returns {void}
 */
const applyPageData = (data = {}) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new TypeError("AFY10100 response data must be an object.");
  }
  if (data.resultList !== undefined && !Array.isArray(data.resultList)) {
    throw new TypeError("AFY10100 resultList must be an array.");
  }

  pageData.isReturn = Boolean(data.isReturn);
  pageData.isAllow = Boolean(data.isAllow);
  pageData.dataMap = data.dataMap ?? {};
  pageData.resultList = data.resultList ?? [];
  pageData.insuranceTypeMap = data.INSRMAP ?? {};
  pageData.oiuIndDesc = data.oiuIndDesc ?? {};
  pageData.saleChnlDesc = data.saleChnlDesc ?? {};
  setValues({ inputId: data.inputId ?? "" });
  role.value = data.role ?? "I";
  status.value = data.status ?? "Y";
  if (!pageData.isReturn) {
    isReturnChecked.value = false;
  }
  clearSelection();
};

/**
 * 建立 AFY10100 操作請求 DTO。
 *
 * @returns {object} 請求資料
 */
const buildFormPayload = () => ({
  inputId: inputId.value,
  IS_RETURN: isReturnChecked.value ? "Y" : "",
  role: role.value,
  status: status.value,
  item: selectedItemValue.value,
  ...Object.fromEntries(EDIT_KEYS.map((key) => [key, editModel[key]])),
});

/**
 * 呼叫 AFY10100 操作並套用回傳頁面資料。
 *
 * @param {string} endpoint - Service endpoint
 * @param {object} payload - 請求 DTO
 * @returns {Promise<boolean>} 是否成功
 */
const postAction = async (endpoint, payload) => {
  const response = await $cathayAxios.post(endpoint, payload);
  if (response.returnCode !== 0) {
    return false;
  }
  applyPageData(response.data ?? {});
  return true;
};

/**
 * 查詢公會通報資料。
 *
 * @returns {Promise<void>} 查詢完成
 */
const doQuery = async () => {
  const { valid } = await validate();
  if (!valid) {
    return;
  }

  const mockPayload = {
    "inputId":"A123456789",
    "role":"I",
    "status":""
  }
  await postAction(afy10100Service.query, mockPayload);
};

/**
 * 要求確認刪除所選資料。
 *
 * @returns {void}
 */
const doDelete = () => {
  showConfirmation("請確認是否刪除所選資料？", async () => {
    await postAction(afy10100Service.delete, buildFormPayload());
  }, "刪除確認");
};

/**
 * 修改所選公會通報資料。
 *
 * @returns {Promise<void>} 修改完成
 */
const doEdit = async () => {
  await postAction(afy10100Service.edit, buildFormPayload());
};

/**
 * 即時取回公會通報資料。
 *
 * @returns {Promise<void>} 取回完成
 */
const doAsync = async () => {
  await postAction(afy10100Service.async, buildFormPayload());
};

/**
 * 驗證識別碼後執行即時取回。
 *
 * @returns {Promise<void>} 檢核完成
 */
const doAsyncCheck = async () => {
  const { valid } = await validate();
  if (!valid) {
    return;
  }

  const response = await $cathayAxios.post(afy10100Service.asyncCheckId, {
    inputId: inputId.value,
  });
  if (response.returnCode !== 0) {
    return;
  }
  if (response.data?.isIdError !== "Y") {
    await doAsync();
    return;
  }

  showConfirmation(
    `輸入值 ${inputId.value} 不符身份證／統一編號檢核規則，是否仍要繼續作業？`,
    doAsync,
    "識別碼檢核提醒",
  );
};

/**
 * 顯示選取列完整明細。
 *
 * @param {object} row - 結果列
 * @returns {void}
 */
const openDetail = (row) => {
  detailParameters.value = { ...row };
  detailDialogOpen.value = true;
};

/**
 * 關閉明細彈窗。
 *
 * @returns {void}
 */
const closeDetail = () => {
  detailDialogOpen.value = false;
};

/**
 * 顯示確認對話框。
 *
 * @param {string} message - 確認訊息
 * @param {Function} action - 確認後執行動作
 * @param {string} [title] - 對話框標題
 * @returns {void}
 */
const showConfirmation = (message, action, title = "確認") => {
  confirmationTitle.value = title;
  confirmationMessage.value = message;
  pendingConfirmAction = action;
  confirmationDialogOpen.value = true;
};

/**
 * 執行確認對話框暫存動作。
 *
 * @returns {Promise<void>} 動作完成
 */
const handleConfirmation = async () => {
  const action = pendingConfirmAction;
  pendingConfirmAction = null;
  confirmationDialogOpen.value = false;
  if (action) {
    await action();
  }
};

/**
 * 取消確認對話框。
 *
 * @returns {void}
 */
const handleConfirmationCancel = () => {
  pendingConfirmAction = null;
  confirmationDialogOpen.value = false;
};

/**
 * 載入 AFY10100 初始資料。
 *
 * @returns {Promise<void>} 載入完成
 */
const loadPage = async () => {
  const response = await $cathayAxios.post(afy10100Service.prompt, {});
  if (response.returnCode !== 0) {
    return;
  }
  applyPageData(response.data ?? {});
};

/**
 * 處理頁面功能鍵。
 *
 * @param {KeyboardEvent} event - 鍵盤事件
 * @returns {void}
 */
const handleHotKey = (event) => {
  const actions = {
    F2: doQuery,
    F8: pageData.isAllow ? doAsyncCheck : null,
    F9: selectedRowKey.value ? doEdit : null,
    F10: selectedRowKey.value ? doDelete : null,
  };
  const action = actions[event.key];
  if (!action) {
    return;
  }
  event.preventDefault();
  action();
};

onMounted(() => {
  window.addEventListener("keydown", handleHotKey);
  loadPage();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleHotKey);
});
</script>
