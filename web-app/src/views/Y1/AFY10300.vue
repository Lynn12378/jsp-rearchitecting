<template>
  <!--
  ------頁面資訊------
      - 模組代碼: Y1
      - 功能代碼: AFY10300
      - 頁面主標題: 公會補通報作業
      - 頁面副標題: 公會補通報作業
      - 功能規格:
          - 依查詢條件(失敗檔/保單號碼/被保人ID、通報日期、錯誤代碼、收承方式、商品屬性、處理狀態)查詢待補通報資料
          - 選取查詢結果單筆資料後，編輯該筆資料並送出修改
          - 匯出查詢結果為 Excel 檔案
          - 上傳 Excel 檔案批次修正資料
          - 觸發即時大批通報
      - 詳細頁面規格書: .github/skills/jsp-to-vue/references/specs/page-specs/AFY10300.md
   -->

  <!-- TODO: Functional Gap - Header 元件內嵌 -->

  <!-- 麵包屑 + 頁面標題 -->
  <CxlBreadcrumbs
    class="q-mb-md"
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="rootPath"
  />
  <div class="cxl-title-h1 q-mb-md">公會補通報作業</div>

  <!-- 查詢區 -->
  <q-markup-table class="cxl-table cxl-table-horizontal q-mb-md" square flat bordered>
    <thead>
      <tr>
        <th colspan="4" scope="col" class="cxl-table-header">查詢條件</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">查詢方式</th>
        <td>
          <CxlDropdown
            v-model="queryForm.queryNo"
            :options="queryNoOptions"
            map-options
            emit-value
          />
        </td>
        <th scope="row">失敗檔/保單號碼/被保人ID</th>
        <td>
          <CxlInput
            v-model="queryIdNo"
            :error="!!queryErrors.idNo"
            :error-message="queryErrors.idNo"
          />
        </td>
      </tr>
      <tr>
        <th scope="row">通報日期</th>
        <td>
          <CxlInput v-model="queryForm.insrDate" maxlength="7" />
        </td>
        <th scope="row">錯誤代碼</th>
        <td>
          <CxlDropdown
            v-model="queryForm.errorCode"
            :options="errorCodeOptions"
            map-options
            emit-value
          />
        </td>
      </tr>
      <tr>
        <th scope="row">收承方式</th>
        <td>
          <CxlDropdown
            v-model="queryForm.insrType"
            :options="insrTypeOptions"
            map-options
            emit-value
          />
        </td>
        <th scope="row">商品屬性</th>
        <td>
          <CxlDropdown
            v-model="queryForm.prodType"
            :options="prodTypeOptions"
            map-options
            emit-value
          />
        </td>
      </tr>
      <tr>
        <th scope="row">處理狀態</th>
        <td colspan="3">
          <CxlDropdown
            v-model="queryForm.procStatus"
            :options="procStatusOptions"
            map-options
            emit-value
          />
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <div class="row justify-center">
            <CxlButton id="queryBtn" label="F2查詢" @click="onQuery" />
          </div>
        </td>
      </tr>
    </tbody>
  </q-markup-table>

  <!-- 編輯區 -->
  <q-card v-show="editAreaVisible" class="cxl-card q-pa-md q-mb-md">
    <div class="cxl-title-h3 q-mb-md">資料編輯區</div>

    <q-markup-table class="cxl-table-form" flat bordered separator="horizontal">
      <tbody>
        <tr>
          <th scope="row">通報方式</th>
          <td>{{ editExtra.INSR_TYPE_DESC }}</td>
          <th scope="row">被保險人姓名</th>
          <td>
            <CxlInput v-model="editExtra.I_NAME" />
          </td>
          <th scope="row">被保人ID</th>
          <td>
            <CxlInput
              v-model="editIId"
              :error="!!editErrors.I_ID"
              :error-message="editErrors.I_ID"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">被保人生日</th>
          <td>
            <CxlInput
              v-model="editIBirthday"
              maxlength="7"
              :error="!!editErrors.I_BIRTHDAY"
              :error-message="editErrors.I_BIRTHDAY"
            />
          </td>
          <th scope="row">被保險人性別</th>
          <td>
            <CxlDropdown
              v-model="editExtra.I_GENDER"
              :options="genderOptions"
              map-options
              emit-value
            />
          </td>
          <th scope="row">主約保單號碼</th>
          <td>
            <CxlInput
              v-model="editMainPolicyNo"
              :error="!!editErrors.MAIN_POLICY_NO"
              :error-message="editErrors.MAIN_POLICY_NO"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">保單號碼</th>
          <td>
            <CxlInput
              v-model="editPolicyNo"
              :error="!!editErrors.POLICY_NO"
              :error-message="editErrors.POLICY_NO"
            />
          </td>
          <th scope="row">來源別OIU</th>
          <td>
            <CxlInput v-model="editExtra.OIU_IND" />
          </td>
          <th scope="row">銷售通路別</th>
          <td>
            <CxlDropdown
              v-model="editExtra.SALE_CHNL"
              :options="saleChnlOptions"
              map-options
              emit-value
            />
          </td>
        </tr>
        <tr>
          <th scope="row">商品代碼</th>
          <td>
            <CxlInput v-model="editExtra.PROD_CODE" />
          </td>
          <th scope="row">保單分類</th>
          <td>
            <CxlDropdown
              v-model="editExtra.POLICY_CAT"
              :options="policyCatOptions"
              map-options
              emit-value
            />
          </td>
          <th scope="row">險種分類</th>
          <td>
            <CxlDropdown
              v-model="editExtra.POLICY_DUTY"
              :options="policyDutyOptions"
              map-options
              emit-value
            />
          </td>
        </tr>
        <tr>
          <th scope="row">險種</th>
          <td>
            <CxlDropdown
              v-model="editExtra.PROD_KIND"
              :options="prodKindOptions"
              map-options
              emit-value
            />
          </td>
          <th scope="row">公、自費件</th>
          <td>
            <CxlDropdown
              v-model="editExtra.PAY_TYPE"
              :options="payTypeOptions"
              map-options
              emit-value
            />
          </td>
          <th scope="row">身故</th>
          <td>
            <CxlInput
              v-model="payAmt[1].value.value"
              :error="!!payAmt[1].errorMessage.value"
              :error-message="payAmt[1].errorMessage.value"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">完全失能</th>
          <td>
            <CxlInput
              v-model="payAmt[2].value.value"
              :error="!!payAmt[2].errorMessage.value"
              :error-message="payAmt[2].errorMessage.value"
            />
          </td>
          <th scope="row">失能扶助金</th>
          <td>
            <CxlInput
              v-model="payAmt[3].value.value"
              :error="!!payAmt[3].errorMessage.value"
              :error-message="payAmt[3].errorMessage.value"
            />
          </td>
          <th scope="row">特定事故</th>
          <td>
            <CxlInput
              v-model="payAmt[4].value.value"
              :error="!!payAmt[4].errorMessage.value"
              :error-message="payAmt[4].errorMessage.value"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">初次罹患</th>
          <td>
            <CxlInput
              v-model="payAmt[5].value.value"
              :error="!!payAmt[5].errorMessage.value"
              :error-message="payAmt[5].errorMessage.value"
            />
          </td>
          <th scope="row">醫療限額</th>
          <td>
            <CxlInput
              v-model="payAmt[6].value.value"
              :error="!!payAmt[6].errorMessage.value"
              :error-message="payAmt[6].errorMessage.value"
            />
          </td>
          <th scope="row">醫療限額自負</th>
          <td>
            <CxlInput
              v-model="payAmt[7].value.value"
              :error="!!payAmt[7].errorMessage.value"
              :error-message="payAmt[7].errorMessage.value"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">醫療日期</th>
          <td>
            <CxlInput
              v-model="payAmt[8].value.value"
              :error="!!payAmt[8].errorMessage.value"
              :error-message="payAmt[8].errorMessage.value"
            />
          </td>
          <th scope="row">住院手術</th>
          <td>
            <CxlInput
              v-model="payAmt[9].value.value"
              :error="!!payAmt[9].errorMessage.value"
              :error-message="payAmt[9].errorMessage.value"
            />
          </td>
          <th scope="row">住院門診</th>
          <td>
            <CxlInput v-model="editExtra.PAY_AMT10" />
          </td>
        </tr>
        <tr>
          <th scope="row">門診日額</th>
          <td>
            <CxlInput
              v-model="payAmt[11].value.value"
              :error="!!payAmt[11].errorMessage.value"
              :error-message="payAmt[11].errorMessage.value"
            />
          </td>
          <th scope="row">重大疾/傷病</th>
          <td>
            <CxlInput
              v-model="payAmt[12].value.value"
              :error="!!payAmt[12].errorMessage.value"
              :error-message="payAmt[12].errorMessage.value"
            />
          </td>
          <th scope="row">重大燒燙傷</th>
          <td>
            <CxlInput
              v-model="payAmt[13].value.value"
              :error="!!payAmt[13].errorMessage.value"
              :error-message="payAmt[13].errorMessage.value"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">癌症療養</th>
          <td>
            <CxlInput
              v-model="payAmt[14].value.value"
              :error="!!payAmt[14].errorMessage.value"
              :error-message="payAmt[14].errorMessage.value"
            />
          </td>
          <th scope="row">出院療養</th>
          <td>
            <CxlInput
              v-model="payAmt[15].value.value"
              :error="!!payAmt[15].errorMessage.value"
              :error-message="payAmt[15].errorMessage.value"
            />
          </td>
          <th scope="row">失能</th>
          <td>
            <CxlInput
              v-model="payAmt[16].value.value"
              :error="!!payAmt[16].errorMessage.value"
              :error-message="payAmt[16].errorMessage.value"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">喪葬費用</th>
          <td>
            <CxlInput
              v-model="payAmt[17].value.value"
              :error="!!payAmt[17].errorMessage.value"
              :error-message="payAmt[17].errorMessage.value"
            />
          </td>
          <th scope="row">銜接原醫療限額之自負額</th>
          <td>
            <CxlInput
              v-model="payAmt[18].value.value"
              :error="!!payAmt[18].errorMessage.value"
              :error-message="payAmt[18].errorMessage.value"
            />
          </td>
          <th scope="row">分開給付</th>
          <td>
            <CxlInput
              v-model="payAmt[19].value.value"
              :error="!!payAmt[19].errorMessage.value"
              :error-message="payAmt[19].errorMessage.value"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">契約生效日期</th>
          <td>
            <CxlInput
              v-model="editIssueDate"
              maxlength="7"
              :error="!!editErrors.ISSUE_DATE"
              :error-message="editErrors.ISSUE_DATE"
            />
          </td>
          <th scope="row">契約生效時分(旅平險)</th>
          <td>
            <CxlInput v-model="editExtra.ISSUE_TIME" />
          </td>
          <th scope="row">契約滿期日期</th>
          <td>
            <CxlInput
              v-model="editLpsDate"
              maxlength="7"
              :error="!!editErrors.LPS_DATE"
              :error-message="editErrors.LPS_DATE"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">契約滿期時分</th>
          <td>
            <CxlInput v-model="editExtra.LPS_TIME" />
          </td>
          <th scope="row">保費</th>
          <td>
            <CxlInput
              v-model="editPrem"
              :error="!!editErrors.PREM"
              :error-message="editErrors.PREM"
            />
          </td>
          <th scope="row">保費繳別</th>
          <td>
            <CxlDropdown
              v-model="editExtra.PAY_FREQ"
              :options="payFreqOptions"
              map-options
              emit-value
            />
          </td>
        </tr>
        <tr>
          <th scope="row">保費繳費年期</th>
          <td>
            <CxlInput v-model="editExtra.PAY_PERIOD" />
          </td>
          <th scope="row">保單狀況</th>
          <td>
            <CxlInput v-model="editExtra.STATUS" />
          </td>
          <th scope="row">保單狀況生效日期</th>
          <td>
            <CxlInput
              v-model="editLstChgDate"
              maxlength="7"
              :error="!!editErrors.LST_CHG_DATE"
              :error-message="editErrors.LST_CHG_DATE"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">保單狀況生效時分</th>
          <td>
            <CxlInput v-model="editExtra.LST_CHG_TIME" />
          </td>
          <th scope="row">要保人姓名</th>
          <td>
            <CxlInput v-model="editExtra.A_NAME" />
          </td>
          <th scope="row">要保人身分證號碼</th>
          <td>
            <CxlInput
              v-model="editAId"
              :error="!!editErrors.A_ID"
              :error-message="editErrors.A_ID"
            />
          </td>
        </tr>
        <tr>
          <th scope="row">要保人生日</th>
          <td>
            <CxlInput
              v-model="editABirthday"
              maxlength="7"
              :error="!!editErrors.A_BIRTHDAY"
              :error-message="editErrors.A_BIRTHDAY"
            />
          </td>
          <th scope="row">要被保人關係</th>
          <td>
            <CxlDropdown
              v-model="editExtra.RELATION"
              :options="relationOptions"
              map-options
              emit-value
            />
          </td>
          <th scope="row">通報狀態</th>
          <td>
            <CxlDropdown
              v-model="editLiaStatus"
              :options="liaStatusOptions"
              map-options
              emit-value
              :error="!!editErrors.LIA_STATUS"
              :error-message="editErrors.LIA_STATUS"
            />
          </td>
        </tr>
        <tr v-if="isRType">
          <th scope="row">要保書填寫日(收件才需要)</th>
          <td>
            <CxlInput v-model="editExtra.SIGN_DATE" maxlength="7" />
          </td>
          <th scope="row">保經代類別</th>
          <td>
            <CxlDropdown
              v-model="editExtra.BROKTYPE"
              :options="broktypeOptions"
              map-options
              emit-value
            />
          </td>
          <th scope="row"></th>
          <td></td>
        </tr>
        <tr>
          <th scope="row">通報日期</th>
          <td>{{ editExtra.OUTPUT_TIME }}</td>
          <th scope="row">公會通報序號</th>
          <td>{{ editExtra.SER_NO }}</td>
          <th scope="row">資料來源</th>
          <td>{{ editExtra.UPDATE_SRC }}</td>
        </tr>
        <tr>
          <th scope="row">失敗原因</th>
          <td colspan="5">{{ editExtra.MEMO }}</td>
        </tr>
      </tbody>
    </q-markup-table>

    <div class="row justify-center q-gutter-sm q-mt-md">
      <CxlButton id="editBtn" label="F9修改" @click="onEdit" />
      <CxlButton id="cancelBtn" label="F10取消" theme="primary-outline" @click="onCancelEdit" />
    </div>
  </q-card>

  <!-- 查詢結果區 -->
  <template v-if="showQuery">
    <CxlTable
      v-model:selected="selectedRows"
      :rows="tableRows"
      :columns="tableColumns"
      row-key="_rowIndex"
      selection="single"
      class="q-mb-md"
    />
    <div class="row justify-center q-mb-md">
      <CxlButton id="exportBtn" label="Excel匯出" @click="onExport" />
    </div>
  </template>

  <!-- 檔案上傳區 -->
  <div class="row items-center q-gutter-sm q-mb-md">
    <CxlUploader ref="refUploader" name="uploadFile" @getFiles="onGetFiles" />
    <CxlButton id="importBtn" label="F8檔案上傳" @click="onImport" />
    <CxlButton id="insrGroupBtn" label="即時大批通報" theme="primary-outline" @click="onInsrGroupBtn" />
  </div>

  <!-- 說明文字區 -->
  <div class="cxl-text-gray-6d">
    <div>1.用大批匯入時，請先叫出資料後按Excel匯出鈕-->修改錯誤及處理結果(千萬記得保單狀況生效日也要調整)-->至檔案匯入-->按選擇檔案鈕-->選擇檔案-->按F8檔案上傳。(限用Google Chrome)</div>
    <div>2.Excel表格內容說明</div>
    <div class="q-pl-lg">A.處理結果: 輸入代碼如：用此畫面修正及上傳時輸入8。</div>
    <div class="q-pl-xl">(7:不需通報、8重新通報、9至公會系統人工通)</div>
    <div class="q-pl-lg">B.結果:目前僅會顯示3(通報失敗)</div>
    <div class="q-pl-lg">C.保額:此為投保保額，目前僅出壽險會顯示</div>
    <div>3.按F8檔案上傳鈕:收件批次每半小時、承保隔天通報</div>
    <div>4.即時大批通報鈕:將目前所有待通報之案件(收、承保)立即通報公會</div>
    <div>
      5.請參考公會補通報操作手冊、新通報平台系統操作手冊，
      <a href="#" class="cxl-text-primary" @click.prevent="onLinkATA00611">點我開啟</a>
    </div>
  </div>
</template>

<script setup>
// 1. import statements
import { ref, reactive, computed, inject, watch, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useForm, useField } from "vee-validate";
import { object, string, number } from "yup";
import "@/assets/libs/CathayValidateRules.js";
import { CxlBreadcrumbs, CxlInput, CxlDropdown, CxlButton, CxlTable, CxlUploader } from "vue-cathaylife-component";
import navCollection from "@/service/NavCollection.js";
import afy10300Service from "@/service/AFY10300Service.js";

// 2. defineProps, defineEmits, defineExpose
// (無)

const $route = useRoute();
const rootPath = { label: "首頁", url: "/" };
const $cathayAxios = inject("$cathayAxios");
const $notify = inject("$notify");
const $confirm = inject("$confirm");

// 3. ref, reactive
const queryNoOptions = [
  { label: "失敗檔 (可不輸入失敗檔序號)", value: "0" },
  { label: "保單號碼", value: "1" },
  { label: "被保人ID", value: "2" },
];
const errorCodeOptions = [
  { label: "全部", value: "99" },
  { label: "36", value: "36" },
  { label: "37", value: "37" },
  { label: "39", value: "39" },
  { label: "40", value: "40" },
  { label: "45", value: "45" },
];
const insrTypeOptions = [
  { label: "承保", value: "L" },
  { label: "收件", value: "R" },
];
const prodTypeOptions = [
  { label: "個險", value: "AT" },
  { label: "團險", value: "BG" },
  { label: "意外險", value: "CB" },
];
const procStatusOptions = [
  { label: "未處理", value: "1" },
  { label: "已處理", value: "2" },
  { label: "全部", value: "0" },
];
const genderOptions = [
  { label: "男", value: "1" },
  { label: "女", value: "2" },
];
const policyCatOptions = [
  { label: "個人", value: "1" },
  { label: "團體", value: "2" },
];
const payTypeOptions = [
  { label: "無", value: "0" },
  { label: "公費", value: "1" },
  { label: "自費", value: "2" },
];

// 下拉選項(動態，來自後端整頁渲染回應)
const saleChnlOptions = ref([]);
const policyDutyOptions = ref([]);
const prodKindOptions = ref([]);
const payFreqOptions = ref([]);
const relationOptions = ref([]);
const broktypeOptions = ref([]);
const liaStatusOptions = ref([]);

// 查詢區(非驗證欄位)
const queryForm = reactive({
  queryNo: "0",
  insrDate: "",
  errorCode: "99",
  insrType: "L",
  prodType: "AT",
  procStatus: "1",
});

// 最近一次查詢/操作的條件快照與頁面狀態旗標
const regDto = reactive({
  regQueryNo: "",
  regIdNo: "",
  regInsrDate: "",
  regInsrType: "",
  regErrorCode: "",
  regProdType: "",
  regProcStatus: "",
  regRadioNum: "",
});
const showQuery = ref(false);
const isRType = ref(false);
const resultList = ref([]);
const selectedRows = ref([]);
const editAreaVisible = ref(false);
// initAPI 回傳之單一欄位，驅動編輯區 4 個欄位(I_GENDER、POLICY_CAT、PAY_TYPE、POLICY_DUTY)於尚未選取查詢結果列時的初始選取值
const status = ref("");

// 編輯前快照(供後端比對用)
const oldSnapshot = reactive({
  OLD_I_ID: "",
  OLD_I_BIRTHDAY: "",
  OLD_POLICY_NO: "",
  OLD_POLICY_CAT: "",
  OLD_POLICY_DUTY: "",
  OLD_PROD_KIND: "",
  OLD_STATUS: "",
  OLD_LST_CHG_DATE: "",
  OLD_UPDATE_TIME: "",
});

// 編輯區(非驗證欄位)
const editExtra = reactive({
  INSR_TYPE_DESC: "",
  I_NAME: "",
  I_GENDER: "1",
  OIU_IND: "",
  SALE_CHNL: null,
  PROD_CODE: "",
  POLICY_CAT: "1",
  POLICY_DUTY: null,
  PROD_KIND: null,
  PAY_TYPE: "0",
  PAY_AMT10: "",
  ISSUE_TIME: "",
  LPS_TIME: "",
  PAY_FREQ: null,
  PAY_PERIOD: "",
  STATUS: "",
  LST_CHG_TIME: "",
  A_NAME: "",
  RELATION: null,
  SIGN_DATE: "",
  BROKTYPE: null,
  OUTPUT_TIME: "",
  SER_NO: "",
  UPDATE_SRC: "",
  UPDATE_TIME: "",
  MEMO: "",
});

// 查詢結果區表格欄位定義
const tableColumns = computed(() => {
  const columns = [
    { name: "index", label: "序號", field: (row, index) => index + 1, align: "center" },
    { name: "LIA_STATUS_DESC", label: "結果", field: "LIA_STATUS_DESC", align: "left" },
    { name: "FACE_AMT", label: "保額", field: "FACE_AMT", align: "right" },
    { name: "INSR_TYPE_DESC", label: "通報方式", field: "INSR_TYPE_DESC", align: "left" },
    { name: "I_ID", label: "被保人ID", field: "I_ID", align: "left" },
    { name: "I_BIRTHDAY_ROC", label: "被保人生日", field: "I_BIRTHDAY_ROC", align: "left" },
    { name: "I_GENDER_DESC", label: "被保人性別", field: "I_GENDER_DESC", align: "left" },
    { name: "PROD_CODE", label: "商品代碼", field: "PROD_CODE", align: "left" },
    { name: "POLICY_DUTY", label: "險種分類", field: "POLICY_DUTY", align: "left" },
    { name: "PROD_KIND", label: "險種", field: "PROD_KIND", align: "left" },
    { name: "STATUS", label: "保單狀況", field: "STATUS", align: "left" },
    { name: "ISSUE_DATE_ROC", label: "契約生效日", field: "ISSUE_DATE_ROC", align: "left" },
    { name: "LPS_DATE_ROC", label: "契約滿期日", field: "LPS_DATE_ROC", align: "left" },
    { name: "LST_CHG_DATE_ROC", label: "保單狀況生效日期", field: "LST_CHG_DATE_ROC", align: "left" },
  ];
  if (isRType.value) {
    columns.push({ name: "SIGN_DATE", label: "要保書填寫日期", field: "SIGN_DATE", align: "left" });
  }
  columns.push(
    { name: "OUTPUT_TIME", label: "通報時間", field: "OUTPUT_TIME", align: "left" },
    { name: "MEMO", label: "錯誤原因", field: "MEMO", align: "left" },
  );
  return columns;
});

// 查詢結果區表格資料(附加 _rowIndex 供 row-key 與選取列還原使用)
const tableRows = computed(() => resultList.value.map((row, index) => ({ ...row, _rowIndex: index })));

// 使用者於查詢結果區選取列時，將該列資料填入編輯區(對應原 q-radio @update:model-value)
watch(selectedRows, (rows) => {
  if (rows && rows.length > 0) {
    onSelectResultRow(rows[0]._rowIndex);
  }
});

// 4. Validation Objects and methods
/**
 * 保單號碼開頭需與主約保單號碼相同(page 內部業務規則，非外部介面)
 */
const policyNoStartsWithMain = {
  name: "policy-no-starts-with-main",
  message: "保單號碼開頭不同於主約保單號碼",
  test: function (value) {
    const mainPolicyNo = this.parent.MAIN_POLICY_NO || "";
    return (value || "").substring(0, mainPolicyNo.length) === mainPolicyNo;
  },
};

/**
 * 通報狀態需為 0~9 的單一數字選項(page 內部業務規則，非外部介面)
 */
const liaStatusIsDigit = {
  name: "lia-status-is-digit",
  message: "通報狀態需選擇",
  test: (value) => /^[0-9]$/.test(value || ""),
};

// 5. schema, useForm, useField
// 查詢表單
const queryValidationSchema = object({
  idNo: string().test("id-no-required-unless-query-no-zero", "失敗檔/保單號碼/被保人ID不得為空白", (value) => {
    if (queryForm.queryNo === "0") {
      return true;
    }
    return !!(value || "").trim();
  }),
});
const { errors: queryErrors, validate: validateQuery } = useForm({
  validationSchema: queryValidationSchema,
  initialValues: { idNo: "" },
  validateOnMount: false,
});
const { value: queryIdNo } = useField("idNo");

// 編輯表單
// PAY_AMT1~PAY_AMT19(不含 PAY_AMT10，PAY_AMT10 無驗證需求，見 editExtra.PAY_AMT10)
const payAmtKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const payAmtLabels = {
  1: "身故",
  2: "完全失能",
  3: "失能扶助金",
  4: "特定事故",
  5: "醫療限額",
  6: "醫療限額自負",
  7: "醫療日額",
  8: "住院手術",
  9: "住院門診",
  11: "門診日額",
  12: "重大疾傷病",
  13: "重大燒燙傷",
  14: "癌症療養",
  15: "出院療養",
  16: "失能",
  17: "喪葬費用",
  18: "術接原醫療限額",
  19: "分期給付",
};
const payAmtSchemaFields = {};
const payAmtInitialValues = {};
payAmtKeys.forEach((n) => {
  const msg = `${payAmtLabels[n]}不得為空值、且需為數字`;
  payAmtSchemaFields[`PAY_AMT${n}`] = number().typeError(msg).required(msg).min(0, msg);
  payAmtInitialValues[`PAY_AMT${n}`] = "";
});

const editValidationSchema = object({
  I_ID: string().required("被保人不得為空值").max(10, "被保人不得為空值"),
  I_BIRTHDAY: string().required("被保人生日不得為空值、且必須為日期格式").validateROCDate("被保人生日不得為空值、且必須為日期格式"),
  MAIN_POLICY_NO: string().required("主約保單號碼不得為空值").max(20, "主約保單號碼不得為空值"),
  POLICY_NO: string().test(policyNoStartsWithMain),
  ISSUE_DATE: string().required("契約生效日不得為空值、且必須為日期格式").validateROCDate("契約生效日不得為空值、且必須為日期格式"),
  LPS_DATE: string().required("契約滿期日不得為空值、且必須為日期格式").validateROCDate("契約滿期日不得為空值、且必須為日期格式"),
  LST_CHG_DATE: string().required("保單狀況生效日不得為空值、且必須為日期格式").validateROCDate("保單狀況生效日不得為空值、且必須為日期格式"),
  PREM: number().typeError("保費不得為空值、且需為數字").required("保費不得為空值、且需為數字").min(0, "保費不得為空值、且需為數字"),
  A_ID: string().required("要保人不得為空值").max(10, "要保人不得為空值"),
  A_BIRTHDAY: string().required("要保人生日不得為空值、且必須為日期格式").validateROCDate("要保人生日不得為空值、且必須為日期格式"),
  LIA_STATUS: string().test(liaStatusIsDigit),
}).shape(payAmtSchemaFields);
const { errors: editErrors, validate: validateEdit } = useForm({
  validationSchema: editValidationSchema,
  initialValues: {
    I_ID: "",
    I_BIRTHDAY: "",
    MAIN_POLICY_NO: "",
    POLICY_NO: "",
    ISSUE_DATE: "",
    LPS_DATE: "",
    LST_CHG_DATE: "",
    PREM: "",
    A_ID: "",
    A_BIRTHDAY: "",
    LIA_STATUS: "",
    ...payAmtInitialValues,
  },
  validateOnMount: false,
});
const { value: editIId } = useField("I_ID");
const { value: editIBirthday } = useField("I_BIRTHDAY");
const { value: editMainPolicyNo } = useField("MAIN_POLICY_NO");
const { value: editPolicyNo } = useField("POLICY_NO");
const { value: editIssueDate } = useField("ISSUE_DATE");
const { value: editLpsDate } = useField("LPS_DATE");
const { value: editLstChgDate } = useField("LST_CHG_DATE");
const { value: editPrem } = useField("PREM");
const { value: editAId } = useField("A_ID");
const { value: editABirthday } = useField("A_BIRTHDAY");
const { value: editLiaStatus } = useField("LIA_STATUS");

const payAmt = {};
payAmtKeys.forEach((n) => {
  payAmt[n] = useField(`PAY_AMT${n}`);
});

// 上傳表單(CxlUploader 透過 @getFiles 事件取得 FormData，非 v-model 綁定，故不使用 VeeValidate)
const refUploader = ref(null);
const uploadFormData = ref(null);

// 6. computed, watch, onMounted, onUnmounted
let hotKeyHandler = null;
onMounted(async () => {
  await fetchInitialState();

  hotKeyHandler = (event) => {
    if (event.key === "F2") {
      event.preventDefault();
      onQuery();
    } else if (event.key === "F9") {
      event.preventDefault();
      onEdit();
    } else if (event.key === "F10") {
      event.preventDefault();
      onCancelEdit();
    } else if (event.key === "F8") {
      event.preventDefault();
      onImport();
    }
  };
  window.addEventListener("keydown", hotKeyHandler);
});

onUnmounted(() => {
  if (hotKeyHandler) {
    window.removeEventListener("keydown", hotKeyHandler);
  }
});

// 7. event handlers
/**
 * 依 API 回應套用整頁渲染狀態(下拉選項、查詢結果、查詢區/快照回填)
 * @param {object} data - API 回應資料
 */
const applyPageState = (data) => {
  queryForm.queryNo = data.queryNo ?? queryForm.queryNo;
  queryIdNo.value = data.idNo ?? "";
  queryForm.insrDate = data.insrDate ?? "";
  queryForm.errorCode = data.errorCode ?? queryForm.errorCode;
  queryForm.insrType = data.insrType ?? queryForm.insrType;
  queryForm.prodType = data.prodType ?? queryForm.prodType;
  queryForm.procStatus = data.procStatus ?? queryForm.procStatus;

  regDto.regQueryNo = data.regQueryNo ?? "";
  regDto.regIdNo = data.regIdNo ?? "";
  regDto.regInsrDate = data.regInsrDate ?? "";
  regDto.regInsrType = data.regInsrType ?? "";
  regDto.regErrorCode = data.regErrorCode ?? "";
  regDto.regProdType = data.regProdType ?? "";
  regDto.regProcStatus = data.regProcStatus ?? "";
  regDto.regRadioNum = data.regRadioNum ?? "";

  showQuery.value = !!data.showQuery;
  isRType.value = !!data.isRType;
  resultList.value = data.resultList || [];
  selectedRows.value = [];

  saleChnlOptions.value = formatOptionList(data.SALE_CHNL_OPTION);
  policyDutyOptions.value = formatOptionList(data.POLICY_DUTY_OPTION);
  prodKindOptions.value = formatOptionList(data.PROD_KIND_OPTION);
  payFreqOptions.value = formatOptionList(data.PAY_FREQ_OPTION);
  relationOptions.value = formatOptionList(data.RELATION_OPTION);
  broktypeOptions.value = formatOptionList(data.BROKTYPE_OPTION);
  liaStatusOptions.value = formatOptionList(data.LIA_STATUS_OPTION);

  editIBirthday.value = data.I_BIRTHDAY ?? "";
  editLpsDate.value = data.LPS_DATE ?? "";
  editABirthday.value = data.A_BIRTHDAY ?? "";
  editExtra.SIGN_DATE = data.SIGN_DATE ?? "";

  status.value = data.status ?? "";
  editExtra.I_GENDER = status.value;
  editExtra.POLICY_CAT = status.value;
  editExtra.PAY_TYPE = status.value;
  editExtra.POLICY_DUTY = status.value;

  // 依回傳的 showEdit 還原選取列與編輯區(對應來源 JSP initApp 中 $F('showEdit') == 'Y' 的還原邏輯)
  // 設定 selectedRows 會觸發下方 watch(selectedRows) 呼叫 onSelectResultRow 填入編輯區，故此處不重複呼叫
  if (data.showEdit === "Y" && regDto.regRadioNum !== "" && resultList.value[Number(regDto.regRadioNum)]) {
    const restoredRow = tableRows.value[Number(regDto.regRadioNum)];
    if (restoredRow) {
      selectedRows.value = [restoredRow];
    }
  } else {
    editAreaVisible.value = false;
  }
};

/**
 * 將後端選項清單(`{key, value}` 陣列)轉為 CxlDropdown 所需的 `{label, value}` 格式
 * @param {Array<{key: string, value: string}>} list - 後端選項清單
 * @returns {Array<{label: string, value: string}>}
 */
const formatOptionList = (list) => (list || []).map((item) => ({ label: `${item.key} ${item.value}`, value: item.key }));

/**
 * 選取查詢結果列，將該列資料填入編輯區(page 內部業務邏輯，非外部介面)
 * @param {number} index - 選取列於 resultList 中的索引
 */
const onSelectResultRow = (index) => {
  const row = resultList.value[index];
  if (!row) {
    return;
  }

  regDto.regRadioNum = String(index);

  editExtra.INSR_TYPE_DESC = row.INSR_TYPE_DESC;
  editIId.value = row.I_ID;
  editExtra.I_NAME = row.I_NAME;
  editIBirthday.value = row.I_BIRTHDAY_ROC;
  editExtra.I_GENDER = row.I_GENDER;
  editMainPolicyNo.value = row.MAIN_POLICY_NO;
  editPolicyNo.value = row.POLICY_NO;
  editExtra.OIU_IND = row.OIU_IND;
  editExtra.SALE_CHNL = row.SALE_CHNL;
  editExtra.PROD_CODE = row.PROD_CODE;
  editExtra.POLICY_CAT = row.POLICY_CAT;
  editExtra.POLICY_DUTY = row.POLICY_DUTY;
  editExtra.PROD_KIND = row.PROD_KIND;
  editExtra.PAY_TYPE = row.PAY_TYPE;
  payAmtKeys.forEach((n) => {
    payAmt[n].value.value = row[`PAY_AMT${n}`];
  });
  editExtra.PAY_AMT10 = row.PAY_AMT10;
  editIssueDate.value = row.ISSUE_DATE_ROC;
  editExtra.ISSUE_TIME = row.ISSUE_TIME;
  editLpsDate.value = row.LPS_DATE_ROC;
  editExtra.LPS_TIME = row.LPS_TIME;
  editPrem.value = row.PREM;
  editExtra.PAY_FREQ = row.PAY_FREQ;
  editExtra.PAY_PERIOD = row.PAY_PERIOD;
  editExtra.STATUS = row.PAY_PERIOD;
  editLstChgDate.value = row.LST_CHG_DATE_ROC;
  editExtra.LST_CHG_TIME = row.LST_CHG_TIME;
  editExtra.A_NAME = row.A_NAME;
  editAId.value = row.A_ID;
  editABirthday.value = row.A_BIRTHDAY_ROC;
  editExtra.RELATION = row.RELATION;
  editLiaStatus.value = row.LIA_STATUS;
  editExtra.OUTPUT_TIME = row.OUTPUT_TIME;
  editExtra.SER_NO = row.SER_NO;
  editExtra.UPDATE_SRC = row.UPDATE_SRC;
  editExtra.UPDATE_TIME = row.UPDATE_TIME;
  editExtra.MEMO = row.MEMO;

  if (isRType.value) {
    editExtra.SIGN_DATE = row.SIGN_DATE_ROC;
    editExtra.BROKTYPE = row.BROKTYPE;
  }

  oldSnapshot.OLD_I_ID = row.I_ID;
  oldSnapshot.OLD_I_BIRTHDAY = row.I_BIRTHDAY;
  oldSnapshot.OLD_POLICY_NO = row.POLICY_NO;
  oldSnapshot.OLD_POLICY_CAT = row.POLICY_CAT;
  oldSnapshot.OLD_POLICY_DUTY = row.POLICY_DUTY;
  oldSnapshot.OLD_PROD_KIND = row.PROD_KIND;
  oldSnapshot.OLD_STATUS = row.STATUS;
  oldSnapshot.OLD_LST_CHG_DATE = row.LST_CHG_DATE;
  oldSnapshot.OLD_UPDATE_TIME = row.UPDATE_TIME;

  editAreaVisible.value = true;
};

/**
 * F10 取消：隱藏編輯區，不呼叫後端(page 內部業務邏輯，非外部介面)
 */
const onCancelEdit = () => {
  editAreaVisible.value = false;
};

/**
 * CxlUploader 取檔事件：檢核副檔名並暫存 FormData，供 F8 按鈕觸發上傳
 * @param {FormData} formData - CxlUploader 收集之檔案 FormData
 */
const onGetFiles = (formData) => {
  if (formData.keys().next().done) {
    uploadFormData.value = null;
    return;
  }
  const file = [...formData.values()].find((entry) => entry instanceof File);
  if (!file || !/\.(xlsx)$/i.test(file.name || "")) {
    $notify.error("檔案格式必須為xlsx檔");
    refUploader.value?.clear();
    uploadFormData.value = null;
    return;
  }
  uploadFormData.value = formData;
};

/**
 * 開啟操作手冊連結(Hypermedia Contract - link)
 */
const onLinkATA00611 = () => {
  const url = "/AAWeb/servlet/HttpDispatcher/AAZ0_0404/prompt?SYS_NO=AT&SUB_SYS_NO=A0&FUNC_ID=ATA00611&isShowQueryItem=R";
  window.location.href = url;
};

// 8. API calls methods（need JSDoc）
/**
 * 初始頁面載入，取得下拉選項與初始查詢狀態
 */
const fetchInitialState = async () => {
  const resp = await $cathayAxios.get(afy10300Service.query);
  if (resp.returnCode !== 0) {
    return;
  }
  applyPageState(resp.data);
};

/**
 * F2 查詢
 */
const onQuery = async () => {
  const { valid } = await validateQuery();
  if (!valid) {
    return;
  }

  const resp = await $cathayAxios.post(afy10300Service.query, {
    queryNo: queryForm.queryNo,
    idNo: queryIdNo.value,
    insrDate: queryForm.insrDate,
    errorCode: queryForm.errorCode,
    insrType: queryForm.insrType,
    prodType: queryForm.prodType,
    procStatus: queryForm.procStatus,
  });
  if (resp.returnCode !== 0) {
    return;
  }
  applyPageState(resp.data);
};

/**
 * F9 修改
 */
const onEdit = async () => {
  const { valid } = await validateEdit();
  if (!valid) {
    return;
  }

  const payAmtValues = {};
  payAmtKeys.forEach((n) => {
    payAmtValues[`PAY_AMT${n}`] = payAmt[n].value.value;
  });

  const resp = await $cathayAxios.post(afy10300Service.edit, {
    I_ID: editIId.value,
    I_NAME: editExtra.I_NAME,
    I_BIRTHDAY: editIBirthday.value,
    I_GENDER: editExtra.I_GENDER,
    MAIN_POLICY_NO: editMainPolicyNo.value,
    POLICY_NO: editPolicyNo.value,
    OIU_IND: editExtra.OIU_IND,
    SALE_CHNL: editExtra.SALE_CHNL,
    PROD_CODE: editExtra.PROD_CODE,
    POLICY_CAT: editExtra.POLICY_CAT,
    POLICY_DUTY: editExtra.POLICY_DUTY,
    PROD_KIND: editExtra.PROD_KIND,
    PAY_TYPE: editExtra.PAY_TYPE,
    ...payAmtValues,
    PAY_AMT10: editExtra.PAY_AMT10,
    ISSUE_DATE: editIssueDate.value,
    ISSUE_TIME: editExtra.ISSUE_TIME,
    LPS_DATE: editLpsDate.value,
    LPS_TIME: editExtra.LPS_TIME,
    PREM: editPrem.value,
    PAY_FREQ: editExtra.PAY_FREQ,
    PAY_PERIOD: editExtra.PAY_PERIOD,
    STATUS: editExtra.STATUS,
    LST_CHG_DATE: editLstChgDate.value,
    LST_CHG_TIME: editExtra.LST_CHG_TIME,
    A_NAME: editExtra.A_NAME,
    A_ID: editAId.value,
    A_BIRTHDAY: editABirthday.value,
    RELATION: editExtra.RELATION,
    LIA_STATUS: editLiaStatus.value,
    SIGN_DATE: isRType.value ? editExtra.SIGN_DATE : undefined,
    BROKTYPE: isRType.value ? editExtra.BROKTYPE : undefined,
    UPDATE_TIME: editExtra.UPDATE_TIME,
    regRadioNum: regDto.regRadioNum,
    ...oldSnapshot,
    queryNo: queryForm.queryNo,
    idNo: queryIdNo.value,
    insrDate: queryForm.insrDate,
    errorCode: queryForm.errorCode,
    insrType: queryForm.insrType,
    prodType: queryForm.prodType,
    procStatus: queryForm.procStatus,
  });
  if (resp.returnCode !== 0) {
    return;
  }
  applyPageState(resp.data);
};

/**
 * Excel 匯出：以最近一次查詢條件快照下載檔案(使用 $cathayAxios.download，內建 blob 下載與錯誤通知)
 */
const onExport = async () => {
  await $cathayAxios.download(
    afy10300Service.export,
    {
      regQueryNo: regDto.regQueryNo,
      regIdNo: regDto.regIdNo,
      regInsrDate: regDto.regInsrDate,
      regInsrType: regDto.regInsrType,
      regErrorCode: regDto.regErrorCode,
      regProdType: regDto.regProdType,
      regProcStatus: regDto.regProcStatus,
    },
    "AFY10300.xlsx",
  );
};

/**
 * F8 檔案上傳
 */
const onImport = async () => {
  if (!uploadFormData.value) {
    $notify.warning("請選擇檔案");
    return;
  }

  const resp = await $cathayAxios.upload(afy10300Service.import, uploadFormData.value);
  if (resp.returnCode !== 0) {
    return;
  }
  applyPageState(resp.data);
  refUploader.value?.clear();
  uploadFormData.value = null;
};

/**
 * 即時大批通報
 */
const onInsrGroupBtn = async () => {
  if (queryForm.insrType === "R") {
    $notify.warning("僅可選擇承保通報(收件類每30分鐘一次)");
    return;
  }

  const insrTypeText = insrTypeOptions.find((o) => o.value === queryForm.insrType)?.label || "";
  const prodTypeText = prodTypeOptions.find((o) => o.value === queryForm.prodType)?.label || "";

  const confirmed = await $confirm(`確認要執行【${prodTypeText}${insrTypeText}】即時大批通報嗎？`);
  if (!confirmed) {
    return;
  }

  const resp = await $cathayAxios.post(afy10300Service.execute, {
    queryNo: queryForm.queryNo,
    idNo: queryIdNo.value,
    insrDate: queryForm.insrDate,
    errorCode: queryForm.errorCode,
    insrType: queryForm.insrType,
    prodType: queryForm.prodType,
    procStatus: queryForm.procStatus,
  });
  if (resp.returnCode !== 0) {
    return;
  }
  applyPageState(resp.data);
};

// 9. Other methods
// (無)
</script>
