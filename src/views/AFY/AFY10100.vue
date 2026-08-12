<template>
  <CxlBreadcrumbs
    :breadcrumbs="navCollection"
    :router-path="$route.path"
    :root-path="rootPath"
  />

  <div class="row items-center justify-between q-mt-md q-mb-md">
    <div class="cxl-title-h1">公會通報查詢</div>
    <div>畫面編號：AFY10100</div>
  </div>

  <q-markup-table
    class="cxl-table cxl-table-horizontal q-mb-lg"
    separator="cell"
    flat
    bordered
  >
    <thead>
      <tr>
        <th colspan="6" class="cxl-table-header">查詢條件</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>
          <span class="cxl-text-danger">*</span>
          身份證字號／統一編號
        </th>
        <td>
          <CxlInput
            v-model="inputId"
            placeholder="請輸入身份證字號或統一編號"
            :error="!!errors.inputId"
            :error-message="errors.inputId"
          />
        </td>
        <th>契約角色</th>
        <td>
          <CxlDropdown
            v-model="role"
            :options="roleOptions"
            map-options
            emit-value
          />
        </td>
        <th>保單效力</th>
        <td>
          <CxlDropdown
            v-model="status"
            :options="statusOptions"
            map-options
            emit-value
          />
        </td>
      </tr>
      <tr>
        <th>同步回檔狀態</th>
        <td>
          <q-checkbox
            v-model="syncReturnStatus"
            class="cxl-checkbox"
            label="同步更新公會回檔狀態"
            :disable="!permissions.canSyncReturnStatus"
            dense
          />
        </td>
        <th>姓名</th>
        <td>{{ queryInfo.name || "—" }}</td>
        <th>生日</th>
        <td>{{ queryInfo.birthday || "—" }}</td>
      </tr>
      <tr>
        <th>公會資料取回日期</th>
        <td colspan="5">{{ queryInfo.lastUpdateTime || "—" }}</td>
      </tr>
      <tr>
        <td colspan="6">
          <div class="row justify-center q-gutter-sm">
            <CxlButton label="F2 查詢" @click="handleQuery" />
            <CxlButton
              v-if="permissions.canRetrieveGuildData"
              label="F8 即時取回公會資料"
              theme="primary-outline"
              @click="handleRetrieveGuildData"
            />
          </div>
        </td>
      </tr>
    </tbody>
  </q-markup-table>

  <template v-if="hasQueried">
    <q-markup-table
      class="cxl-table cxl-table-horizontal q-mb-lg"
      separator="cell"
      flat
      bordered
    >
      <thead>
        <tr>
          <th colspan="5" class="cxl-table-header">保障項目彙整</th>
        </tr>
        <tr>
          <th>項目</th>
          <th>合計</th>
          <th>同業合計</th>
          <th>收件</th>
          <th>承保</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in coverageSummary" :key="item.key">
          <th>{{ item.label }}</th>
          <td class="text-right">{{ formatAmount(item.total) }}</td>
          <td class="text-right">{{ formatAmount(item.peerTotal) }}</td>
          <td class="text-right">{{ formatAmount(item.received) }}</td>
          <td class="text-right">{{ formatAmount(item.underwritten) }}</td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-markup-table
      class="cxl-table cxl-table-horizontal q-mb-lg"
      separator="cell"
      flat
      bordered
    >
      <thead>
        <tr>
          <th colspan="5" class="cxl-table-header">保費資料彙整</th>
        </tr>
        <tr>
          <th>項目</th>
          <th>合計</th>
          <th>收件</th>
          <th>承保</th>
          <th>操作者</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in premiumSummary" :key="item.key">
          <th>{{ item.label }}</th>
          <td class="text-right">{{ formatAmount(item.total) }}</td>
          <td class="text-right">{{ formatAmount(item.received) }}</td>
          <td class="text-right">{{ formatAmount(item.underwritten) }}</td>
          <td>{{ item.operator }}</td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-markup-table
      v-if="editRecord"
      class="cxl-table-form q-mb-lg"
      separator="horizontal"
      flat
      bordered
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
        <tr v-for="(fieldRow, rowIndex) in detailFieldRows" :key="`detail-${rowIndex}`">
          <template v-for="(field, fieldIndex) in fieldRow" :key="field?.key || fieldIndex">
            <th>{{ field?.label }}</th>
            <td>{{ field ? displayValue(editRecord[field.key]) : "" }}</td>
          </template>
        </tr>
        <tr v-for="(fieldRow, rowIndex) in editFieldRows" :key="`edit-${rowIndex}`">
          <template v-for="(field, fieldIndex) in fieldRow" :key="field?.key || fieldIndex">
            <th>{{ field?.label }}</th>
            <td>
              <template v-if="field">
                <CxlDropdown
                  v-if="field.type === 'dropdown'"
                  v-model="editModels[field.key]"
                  :options="field.options"
                  map-options
                  emit-value
                />
                <CxlInput
                  v-else
                  v-model="editModels[field.key]"
                  :type="field.type === 'amount' ? 'number' : 'text'"
                  :placeholder="field.placeholder"
                  :error="!!errors[field.key]"
                  :error-message="errors[field.key]"
                />
              </template>
            </td>
          </template>
        </tr>
        <tr>
          <td colspan="6">
            <div class="row justify-center q-gutter-sm">
              <CxlButton label="F9 修改" @click="handleUpdate" />
              <CxlButton label="F10 刪除" theme="danger" @click="openDeleteConfirm" />
              <CxlButton label="取消" theme="primary-outline" @click="clearSelection" />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <div class="cxl-title-h3 q-mb-sm">新制通報資料明細</div>
    <CxlTable
      v-model:selected="selectedRows"
      :rows="resultRows"
      :columns="resultColumns"
      row-key="id"
      selection="single"
      separator="cell"
      class="q-mb-lg"
    >
      <template #body-cell-reportTypeLabel="props">
        <q-td :props="props">
          <CxlButton
            :label="props.value"
            theme="primary-outline"
            @click="openDetail(props.row)"
          />
        </q-td>
      </template>
    </CxlTable>

    <CxlAccordion class="q-mb-lg">
      <template #header>
        <span class="cxl-accordion-title">欄位代碼說明</span>
        <span class="cxl-accordion-subtitle">展開查看公會通報欄位定義</span>
      </template>
      <template #content>
        <ol class="q-my-none q-pl-lg">
          <li v-for="note in codeNotes" :key="note">{{ note }}</li>
        </ol>
      </template>
    </CxlAccordion>
  </template>

  <CxlModal
    v-model="showInvalidIdConfirm"
    title="證號格式確認"
    confirm-text="繼續取回"
    cancel-text="取消"
    @confirm="continueRetrieveGuildData"
    @cancel="showInvalidIdConfirm = false"
  >
    <p>
      輸入值 {{ inputId }} 不符身份證／統一編號檢核規則，是否仍要繼續作業？
    </p>
  </CxlModal>

  <CxlModal
    v-model="showDeleteConfirm"
    title="刪除確認"
    confirm-text="確認刪除"
    cancel-text="取消"
    @confirm="handleDelete"
    @cancel="showDeleteConfirm = false"
  >
    <p>確定刪除所選取的公會通報資料？此操作無法復原。</p>
  </CxlModal>

  <CxlModal
    v-model="showDetailModal"
    title="公會通報資料明細"
    cancel-text="關閉"
    size="lg"
    content-scroll
    @cancel="showDetailModal = false"
  >
    <q-markup-table
      v-if="detailRecord"
      class="cxl-table-form"
      separator="horizontal"
      flat
      bordered
    >
      <colgroup>
        <col style="width: 18%" />
        <col style="width: 32%" />
        <col style="width: 18%" />
        <col style="width: 32%" />
      </colgroup>
      <tbody>
        <tr v-for="(fieldRow, rowIndex) in modalDetailRows" :key="`modal-${rowIndex}`">
          <template v-for="(field, fieldIndex) in fieldRow" :key="field?.key || fieldIndex">
            <th>{{ field?.label }}</th>
            <td>{{ field ? displayValue(detailRecord[field.key]) : "" }}</td>
          </template>
        </tr>
      </tbody>
    </q-markup-table>
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
import { number, object, string } from "yup";
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

const $route = useRoute();
const $notify = inject("$notify");
const rootPath = { label: "首頁", url: "/" };

const roleOptions = [
  { label: "被保人", value: "I" },
  { label: "要保人", value: "A" },
];
const statusOptions = [
  { label: "有效", value: "Y" },
  { label: "無效", value: "N" },
  { label: "全部", value: "A" },
];
const genderOptions = [
  { label: "男", value: "1" },
  { label: "女", value: "2" },
];
const payTypeOptions = [
  { label: "無", value: "0" },
  { label: "公費", value: "1" },
  { label: "自費", value: "2" },
];
const coverageFields = [
  { key: "payAmount1", label: "身故" },
  { key: "payAmount2", label: "完全失能或最高級失能" },
  { key: "payAmount3", label: "失能扶助金" },
  { key: "payAmount4", label: "特定事故" },
  { key: "payAmount5", label: "初次罹患" },
  { key: "payAmount6", label: "醫療限額" },
  { key: "payAmount7", label: "醫療限額自負" },
  { key: "payAmount8", label: "醫療日額" },
  { key: "payAmount9", label: "住院手術" },
  { key: "payAmount10", label: "門診手術" },
  { key: "payAmount11", label: "門診" },
  { key: "payAmount12", label: "重大疾／傷病" },
  { key: "payAmount13", label: "重大燒燙傷" },
  { key: "payAmount14", label: "癌症療養" },
  { key: "payAmount15", label: "出院療養" },
  { key: "payAmount16", label: "喪失工作能力" },
  { key: "payAmount17", label: "喪葬費用" },
  { key: "payAmount18", label: "銜接原醫療限額之自負額" },
  { key: "payAmount19", label: "分期給付" },
];
const detailFields = [
  { key: "reportTypeLabel", label: "通報方式" },
  { key: "companyName", label: "公司別" },
  { key: "insuredName", label: "被保人姓名" },
  { key: "insuredId", label: "被保人 ID" },
  { key: "insuredBirthday", label: "被保人生日" },
  { key: "policyNo", label: "保單號碼" },
  { key: "policyCategory", label: "保單分類" },
  { key: "coverageCategory", label: "險種分類" },
  { key: "productKind", label: "險種" },
  { key: "policyStatus", label: "保單狀況" },
  { key: "statusEffectiveDate", label: "保單狀況生效日期" },
  { key: "mainPolicyNo", label: "主約保單號碼" },
  { key: "issueDate", label: "契約生效日" },
  { key: "issueTime", label: "契約生效時分" },
  { key: "expiryDate", label: "契約滿期日" },
  { key: "expiryTime", label: "契約滿期時分" },
  { key: "applicationDate", label: "要保書填寫日" },
  { key: "premium", label: "保費" },
  { key: "payFrequency", label: "保費繳別" },
  { key: "payPeriod", label: "保費繳費年期" },
  { key: "statusEffectiveTime", label: "保單狀況生效時分" },
  { key: "inputTime", label: "資料寫入時間" },
  { key: "sourceLabel", label: "來源別" },
  { key: "salesChannelLabel", label: "銷售通路" },
  { key: "productCode", label: "商品代碼" },
  { key: "serialNo", label: "公會取回序號" },
];
const editFields = [
  ...coverageFields.map((field) => ({
    ...field,
    type: "amount",
    placeholder: `請輸入${field.label}金額`,
  })),
  { key: "brokerType", label: "保經代分類", placeholder: "請輸入保經代分類" },
  { key: "applicantName", label: "要保人姓名", placeholder: "請輸入要保人姓名" },
  { key: "applicantId", label: "要保人身分證號碼", placeholder: "請輸入證號" },
  { key: "applicantBirthday", label: "要保人出生日期", placeholder: "YYYYMMDD" },
  { key: "relation", label: "要保人與被保險人關係", placeholder: "請輸入關係" },
  { key: "insuredGender", label: "被保險人性別", type: "dropdown", options: genderOptions },
  { key: "payType", label: "公、自費件", type: "dropdown", options: payTypeOptions },
];
const modalFields = [...detailFields, ...editFields];
const premiumFields = [
  { key: "annualPremium", label: "年繳保費" },
  { key: "singlePremium", label: "躉繳保費" },
  { key: "flexiblePremium", label: "超額（彈性）保險費" },
];
const codeNotes = [
  "銷售通路：1 網路投保；2 業務員；3 保經、保代；4 電話行銷；5 機場櫃檯。",
  "保單分類：1 個人；2 團體。",
  "險種分類：1 人壽保險；2 傷害保險；3 健康保險；4 年金保險。",
  "繳別：1 躉繳；2 年繳；3 半年繳；4 季繳；5 月繳；6 彈性繳；9 繳費期滿。",
  "保障及保費彙整金額依目前查詢結果加總，包含本公司及同業通報資料。",
  "即時取回公會資料：輸入身份證字號或統一編號後，按 F8 執行。",
];
const permissions = {
  canRetrieveGuildData: true,
  canSyncReturnStatus: true,
};

/**
 * 建立本地 mock 的保障金額欄位。
 *
 * @param {number} baseAmount - 基準金額
 * @returns {object} 十九項保障金額
 */
const createCoverageAmounts = (baseAmount) =>
  Object.fromEntries(
    coverageFields.map((field, index) => [
      field.key,
      index < 8 ? baseAmount * (index + 1) : Math.round(baseAmount / (index - 5)),
    ]),
  );

const mockRows = [
  {
    id: "AFY-001",
    tableName: "AFY_NOTICE_RECEIVED",
    reportType: "R",
    reportTypeLabel: "收件",
    companyCode: "LIFE",
    companyName: "國泰人壽",
    insuredName: "王小明",
    insuredId: "A123456789",
    insuredBirthday: "1985/03/12",
    insuredGender: "1",
    policyNo: "CATHAY100001",
    policyCategory: "1 個人",
    coverageCategory: "1 人壽保險",
    productKind: "01 一般",
    productCode: "WL001",
    policyStatus: "01 有效",
    policyStatusGroup: "Y",
    statusEffectiveDate: "2026/07/01",
    statusEffectiveTime: "09:30",
    mainPolicyNo: "CATHAY100001",
    issueDate: "2026/01/01",
    issueTime: "00:00",
    expiryDate: "2046/01/01",
    expiryTime: "00:00",
    applicationDate: "2025/12/20",
    premium: 36000,
    payFrequency: "2 年繳",
    payPeriod: "20 年",
    annualPremium: 36000,
    singlePremium: 0,
    flexiblePremium: 0,
    applicantName: "王大明",
    applicantId: "B234567890",
    applicantBirthday: "1960/08/20",
    relation: "父子",
    brokerType: "直營",
    payType: "0",
    sourceLabel: "本公司",
    salesChannel: "2",
    salesChannelLabel: "2 業務員",
    serialNo: "GUILD-20260801-001",
    inputTime: "2026/08/01 10:10:10",
    lastUpdateTime: "2026/08/01 10:10:10",
    operator: "AFYUSER",
    ...createCoverageAmounts(100000),
  },
  {
    id: "AFY-002",
    tableName: "AFY_NOTICE_UNDERWRITTEN",
    reportType: "L",
    reportTypeLabel: "承保",
    companyCode: "PEER",
    companyName: "同業人壽",
    insuredName: "王小明",
    insuredId: "A123456789",
    insuredBirthday: "1985/03/12",
    insuredGender: "1",
    policyNo: "PEER200018",
    policyCategory: "1 個人",
    coverageCategory: "3 健康保險",
    productKind: "05 實支實付型",
    productCode: "MD210",
    policyStatus: "01 有效",
    policyStatusGroup: "Y",
    statusEffectiveDate: "2026/06/15",
    statusEffectiveTime: "14:20",
    mainPolicyNo: "PEER200010",
    issueDate: "2024/06/15",
    issueTime: "00:00",
    expiryDate: "2034/06/15",
    expiryTime: "00:00",
    applicationDate: "2024/06/01",
    premium: 24000,
    payFrequency: "2 年繳",
    payPeriod: "10 年",
    annualPremium: 24000,
    singlePremium: 0,
    flexiblePremium: 6000,
    applicantName: "王小明",
    applicantId: "A123456789",
    applicantBirthday: "1985/03/12",
    relation: "本人",
    brokerType: "保經",
    payType: "2",
    sourceLabel: "公會",
    salesChannel: "3",
    salesChannelLabel: "3 保經、保代",
    serialNo: "GUILD-20260801-002",
    inputTime: "2026/08/01 10:12:30",
    lastUpdateTime: "2026/08/01 10:12:30",
    operator: "AFYUSER",
    ...createCoverageAmounts(50000),
  },
  {
    id: "AFY-003",
    tableName: "AFY_NOTICE_UNDERWRITTEN",
    reportType: "L",
    reportTypeLabel: "承保",
    companyCode: "PEER",
    companyName: "產險公司",
    insuredName: "王小明",
    insuredId: "A123456789",
    insuredBirthday: "1985/03/12",
    insuredGender: "1",
    policyNo: "PEER300027",
    policyCategory: "1 個人",
    coverageCategory: "2 傷害保險",
    productKind: "13 旅平險",
    productCode: "TA500",
    policyStatus: "11 滿期",
    policyStatusGroup: "N",
    statusEffectiveDate: "2026/05/31",
    statusEffectiveTime: "23:59",
    mainPolicyNo: "PEER300027",
    issueDate: "2026/05/25",
    issueTime: "00:00",
    expiryDate: "2026/05/31",
    expiryTime: "23:59",
    applicationDate: "2026/05/20",
    premium: 1200,
    payFrequency: "1 躉繳",
    payPeriod: "1 年",
    annualPremium: 0,
    singlePremium: 1200,
    flexiblePremium: 0,
    applicantName: "王小明",
    applicantId: "A123456789",
    applicantBirthday: "1985/03/12",
    relation: "本人",
    brokerType: "網路",
    payType: "0",
    sourceLabel: "公會",
    salesChannel: "1",
    salesChannelLabel: "1 網路投保",
    serialNo: "GUILD-20260601-003",
    inputTime: "2026/06/01 08:05:42",
    lastUpdateTime: "2026/06/01 08:05:42",
    operator: "AFYUSER",
    ...createCoverageAmounts(10000),
  },
];

const validationSchema = object({
  inputId: string().trim().required("身份證字號／統一編號不得為空值"),
  ...Object.fromEntries(
    coverageFields.map((field) => [
      field.key,
      number()
        .typeError(`${field.label}必須為數字`)
        .min(0, `${field.label}不得小於 0`),
    ]),
  ),
});
const { errors, setValues, validateField } = useForm({
  validationSchema,
  initialValues: {
    inputId: "A123456789",
    ...Object.fromEntries(editFields.map((field) => [field.key, ""])),
    ...Object.fromEntries(coverageFields.map((field) => [field.key, 0])),
  },
  validateOnMount: false,
});
const { value: inputId } = useField("inputId");
const editModels = reactive(
  Object.fromEntries(
    editFields.map((field) => {
      const { value } = useField(field.key);
      return [field.key, value];
    }),
  ),
);

const role = ref("I");
const status = ref("Y");
const syncReturnStatus = ref(false);
const sourceRows = ref(mockRows.map((row) => ({ ...row })));
const resultRows = ref([]);
const selectedRows = ref([]);
const editRecord = ref(null);
const detailRecord = ref(null);
const hasQueried = ref(false);
const showInvalidIdConfirm = ref(false);
const showDeleteConfirm = ref(false);
const showDetailModal = ref(false);
const queryInfo = ref({
  name: "",
  birthday: "",
  lastUpdateTime: "",
});

const resultColumns = [
  {
    name: "index",
    label: "序號",
    field: "rowNumber",
    align: "center",
  },
  {
    name: "reportTypeLabel",
    label: "通報方式",
    field: "reportTypeLabel",
    align: "left",
    sortable: true,
  },
  {
    name: "companyName",
    label: "公司別",
    field: "companyName",
    align: "left",
    sortable: true,
  },
  {
    name: "policyNo",
    label: "保單號碼",
    field: "policyNo",
    align: "left",
    sortable: true,
  },
  {
    name: "salesChannel",
    label: "銷售通路",
    field: "salesChannel",
    align: "center",
  },
  {
    name: "productCode",
    label: "商品代碼",
    field: "productCode",
    align: "left",
  },
  {
    name: "policyCategory",
    label: "保單分類",
    field: "policyCategory",
    align: "left",
  },
  {
    name: "coverageCategory",
    label: "險種分類",
    field: "coverageCategory",
    align: "left",
  },
  {
    name: "productKind",
    label: "險種",
    field: "productKind",
    align: "left",
    sortable: true,
  },
  {
    name: "policyStatus",
    label: "保單狀況",
    field: "policyStatus",
    align: "left",
  },
  {
    name: "payAmount1",
    label: "身故保額",
    field: "payAmount1",
    align: "right",
    format: (value) => formatAmount(value),
  },
  {
    name: "payAmount6",
    label: "醫療限額",
    field: "payAmount6",
    align: "right",
    format: (value) => formatAmount(value),
  },
  {
    name: "payAmount8",
    label: "醫療日額",
    field: "payAmount8",
    align: "right",
    format: (value) => formatAmount(value),
  },
  {
    name: "issueDate",
    label: "契約生效日",
    field: "issueDate",
    align: "center",
    sortable: true,
  },
  {
    name: "expiryDate",
    label: "契約滿期日",
    field: "expiryDate",
    align: "center",
  },
  {
    name: "applicantName",
    label: "要保人姓名",
    field: "applicantName",
    align: "left",
  },
  {
    name: "lastUpdateTime",
    label: "通報時間",
    field: "lastUpdateTime",
    align: "center",
  },
];

/**
 * 將欄位定義切成固定欄數，供密集資料表格呈現。
 *
 * @param {object[]} fields - 欄位定義
 * @param {number} size - 每列欄位數
 * @returns {(object|null)[][]} 補齊空欄位後的二維陣列
 */
const chunkFields = (fields, size) => {
  const rows = [];
  for (let index = 0; index < fields.length; index += size) {
    const row = fields.slice(index, index + size);
    rows.push([...row, ...Array(size - row.length).fill(null)]);
  }
  return rows;
};

const detailFieldRows = chunkFields(detailFields, 3);
const editFieldRows = chunkFields(editFields, 3);
const modalDetailRows = chunkFields(modalFields, 2);

/**
 * 加總指定資料欄位。
 *
 * @param {object[]} rows - 資料列
 * @param {string} key - 欄位名稱
 * @returns {number} 加總結果
 */
const sumField = (rows, key) =>
  rows.reduce((total, row) => total + Number(row[key] || 0), 0);

const coverageSummary = computed(() =>
  coverageFields.map((field) => {
    const receivedRows = resultRows.value.filter((row) => row.reportType === "R");
    const underwrittenRows = resultRows.value.filter((row) => row.reportType === "L");
    const peerRows = resultRows.value.filter((row) => row.companyCode !== "LIFE");
    return {
      ...field,
      total: sumField(resultRows.value, field.key),
      peerTotal: sumField(peerRows, field.key),
      received: sumField(receivedRows, field.key),
      underwritten: sumField(underwrittenRows, field.key),
    };
  }),
);

const premiumSummary = computed(() =>
  premiumFields.map((field) => {
    const receivedRows = resultRows.value.filter((row) => row.reportType === "R");
    const underwrittenRows = resultRows.value.filter((row) => row.reportType === "L");
    return {
      ...field,
      total: sumField(resultRows.value, field.key),
      received: sumField(receivedRows, field.key),
      underwritten: sumField(underwrittenRows, field.key),
      operator: resultRows.value[0]?.operator || "—",
    };
  }),
);

/**
 * 將金額轉為千分位格式。
 *
 * @param {number|string} value - 原始金額
 * @returns {string} 格式化金額
 */
const formatAmount = (value) => Number(value || 0).toLocaleString("zh-TW");

/**
 * 顯示一般欄位值，金額欄位套用千分位。
 *
 * @param {unknown} value - 欄位值
 * @returns {string} 顯示文字
 */
const displayValue = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return String(value);
};

/**
 * 依查詢條件篩選本地 mock 資料。
 *
 * @returns {Promise<void>} 無回傳值
 */
const handleQuery = async () => {
  const { valid } = await validateField("inputId");
  if (!valid) {
    $notify.warning("請先輸入身份證字號或統一編號");
    return;
  }

  const normalizedId = inputId.value.trim().toUpperCase();
  resultRows.value = sourceRows.value
    .filter((row) => {
      const roleId = role.value === "I" ? row.insuredId : row.applicantId;
      const matchesStatus =
        status.value === "A" || row.policyStatusGroup === status.value;
      return roleId === normalizedId && matchesStatus;
    })
    .map((row, index) => ({ ...row, rowNumber: index + 1 }));
  hasQueried.value = true;
  clearSelection();

  const firstRow = resultRows.value[0];
  queryInfo.value = {
    name:
      role.value === "I"
        ? firstRow?.insuredName || ""
        : firstRow?.applicantName || "",
    birthday:
      role.value === "I"
        ? firstRow?.insuredBirthday || ""
        : firstRow?.applicantBirthday || "",
    lastUpdateTime: firstRow?.lastUpdateTime || "",
  };

  if (resultRows.value.length === 0) {
    $notify.info("查無符合條件的公會通報資料");
  }
};

/**
 * 清除選取與編輯資料。
 *
 * @returns {void}
 */
const clearSelection = () => {
  selectedRows.value = [];
  editRecord.value = null;
};

/**
 * 將編輯內容寫回本地 mock 資料。
 *
 * @returns {Promise<void>} 無回傳值
 */
const handleUpdate = async () => {
  if (!editRecord.value) {
    $notify.warning("請先選取要修改的資料");
    return;
  }

  const validationResults = await Promise.all(
    coverageFields.map((field) => validateField(field.key)),
  );
  if (validationResults.some((result) => !result.valid)) {
    $notify.warning("請確認保障金額欄位");
    return;
  }

  const normalizedRecord = {
    ...editRecord.value,
    ...Object.fromEntries(
      editFields.map((field) => [field.key, editModels[field.key]]),
    ),
    ...Object.fromEntries(
      coverageFields.map((field) => [
        field.key,
        Number(editModels[field.key] || 0),
      ]),
    ),
  };
  const sourceIndex = sourceRows.value.findIndex(
    (row) => row.id === normalizedRecord.id,
  );
  const resultIndex = resultRows.value.findIndex(
    (row) => row.id === normalizedRecord.id,
  );
  const hasInvalidAmount = coverageFields.some(
    (field) => !Number.isFinite(normalizedRecord[field.key]),
  );
  if (sourceIndex < 0 || resultIndex < 0 || hasInvalidAmount) {
    $notify.error("選取資料已失效，請重新查詢後再操作");
    return;
  }
  sourceRows.value.splice(sourceIndex, 1, normalizedRecord);
  resultRows.value.splice(resultIndex, 1, normalizedRecord);
  selectedRows.value = [normalizedRecord];
  $notify.success("公會通報資料已更新（本地 mock）");
};

/**
 * 開啟刪除確認視窗。
 *
 * @returns {void}
 */
const openDeleteConfirm = () => {
  if (!editRecord.value) {
    $notify.warning("請先選取要刪除的資料");
    return;
  }
  showDeleteConfirm.value = true;
};

/**
 * 刪除目前選取的本地 mock 資料。
 *
 * @returns {void}
 */
const handleDelete = () => {
  const selectedId = editRecord.value?.id;
  if (!selectedId) {
    showDeleteConfirm.value = false;
    $notify.warning("請先選取要刪除的資料");
    return;
  }

  sourceRows.value = sourceRows.value.filter((row) => row.id !== selectedId);
  resultRows.value = resultRows.value
    .filter((row) => row.id !== selectedId)
    .map((row, index) => ({ ...row, rowNumber: index + 1 }));
  showDeleteConfirm.value = false;
  clearSelection();
  $notify.success("公會通報資料已刪除（本地 mock）");
};

/**
 * 開啟資料明細視窗。
 *
 * @param {object} row - 公會通報資料
 * @returns {void}
 */
const openDetail = (row) => {
  detailRecord.value = { ...row };
  showDetailModal.value = true;
};

/**
 * 檢查身份證字號或統一編號基本格式。
 *
 * @param {string} value - 證號
 * @returns {boolean} 是否符合基本格式
 */
const isIdentifierFormatValid = (value) =>
  /^[A-Z][12]\d{8}$/.test(value) || /^\d{8}$/.test(value);

/**
 * 執行本地 mock 公會資料取回。
 *
 * @returns {Promise<void>} 無回傳值
 */
const performGuildDataRetrieval = async () => {
  const normalizedId = inputId.value.trim().toUpperCase();
  const roleKey = role.value === "I" ? "insuredId" : "applicantId";
  const existingIndex = sourceRows.value.findIndex(
    (row) => row[roleKey] === normalizedId,
  );
  const retrievalTime = new Date().toLocaleString("zh-TW", { hour12: false });

  if (existingIndex >= 0) {
    sourceRows.value[existingIndex] = {
      ...sourceRows.value[existingIndex],
      lastUpdateTime: retrievalTime,
    };
  } else {
    sourceRows.value.push({
      ...mockRows[0],
      id: `AFY-${Date.now()}`,
      [roleKey]: normalizedId,
      ...(role.value === "I"
        ? { insuredName: "即時取回資料" }
        : { applicantName: "即時取回資料" }),
      policyNo: `GUILD${Date.now()}`,
      serialNo: `GUILD-${Date.now()}`,
      inputTime: retrievalTime,
      lastUpdateTime: retrievalTime,
    });
  }

  await handleQuery();
  $notify.success(
    syncReturnStatus.value
      ? "已取回公會資料並同步回檔狀態（本地 mock）"
      : "已取回公會資料（本地 mock）",
  );
};

/**
 * 驗證證號後執行即時取回。
 *
 * @returns {Promise<void>} 無回傳值
 */
const handleRetrieveGuildData = async () => {
  if (!permissions.canRetrieveGuildData) {
    $notify.warning("目前帳號無即時取回公會資料權限");
    return;
  }

  const { valid } = await validateField("inputId");
  if (!valid) {
    $notify.warning("請先輸入身份證字號或統一編號");
    return;
  }

  const normalizedId = inputId.value.trim().toUpperCase();
  if (!isIdentifierFormatValid(normalizedId)) {
    showInvalidIdConfirm.value = true;
    return;
  }
  await performGuildDataRetrieval();
};

/**
 * 使用者確認後，以異常格式證號繼續取回。
 *
 * @returns {Promise<void>} 無回傳值
 */
const continueRetrieveGuildData = async () => {
  showInvalidIdConfirm.value = false;
  await performGuildDataRetrieval();
};

/**
 * 處理原 JSP 的功能鍵操作。
 *
 * @param {KeyboardEvent} event - 鍵盤事件
 * @returns {void}
 */
const handleHotKey = (event) => {
  const actions = {
    F2: handleQuery,
    F8: permissions.canRetrieveGuildData ? handleRetrieveGuildData : null,
    F9: editRecord.value ? handleUpdate : null,
    F10: editRecord.value ? openDeleteConfirm : null,
  };
  const action = actions[event.key];
  if (!action) {
    return;
  }
  event.preventDefault();
  action();
};

watch(selectedRows, ([row]) => {
  editRecord.value = row ? { ...row } : null;
  if (row) {
    setValues(
      Object.fromEntries(
        editFields.map((field) => [field.key, row[field.key] ?? ""]),
      ),
    );
  }
});

onMounted(() => {
  window.addEventListener("keydown", handleHotKey);
  handleQuery();
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleHotKey);
});
</script>
