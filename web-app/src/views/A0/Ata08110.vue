<template>
  <CxlBreadcrumbs
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="rootPath"
  />

  <div class="row items-center justify-between q-mb-md">
    <div class="cxl-title-h1 q-mt-md">公會通報設定</div>
    <div>畫面編號：ATA08110</div>
  </div>

  <q-card class="cxl-card q-pa-md">
    <q-markup-table
      class="cxl-table q-mb-lg"
      flat
      bordered
      separator="cell"
    >
      <colgroup>
        <col style="width: 11%" />
        <col style="width: 8%" />
        <col style="width: 11%" />
        <col style="width: 8%" />
        <col style="width: 20%" />
        <col style="width: 11%" />
        <col style="width: 12%" />
        <col style="width: 9%" />
        <col style="width: 10%" />
      </colgroup>
      <thead>
        <tr>
          <th colspan="9" class="cxl-table-header">新增設定</th>
        </tr>
        <tr>
          <th scope="col">契約來源中文</th>
          <th scope="col">契約來源</th>
          <th scope="col">等待時間(毫秒)</th>
          <th scope="col">是否通算</th>
          <th scope="col">通算網址</th>
          <th scope="col">累計最大保障(萬)</th>
          <th scope="col">連線等候時間(毫秒)</th>
          <th scope="col">重試次數</th>
          <th scope="col">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td>
            <CxlInput
              v-model="srcNew"
              :error="!!errors.srcNew"
              :error-message="errors.srcNew"
            />
          </td>
          <td>
            <CxlInput
              v-model="timeoutNew"
              :error="!!errors.timeoutNew"
              :error-message="errors.timeoutNew"
              @change="checkNewNumber('timeoutNew', '等待時間')"
            />
          </td>
          <td>
            <CxlDropdown
              v-model="callAssoNew"
              :options="CALL_ASSO_OPTIONS"
              map-options
              emit-value
            />
          </td>
          <td>
            <CxlInput
              v-model="urlNew"
              :error="!!errors.urlNew"
              :error-message="errors.urlNew"
            />
          </td>
          <td>
            <CxlInput
              v-model="maxAmtNew"
              :error="!!errors.maxAmtNew"
              :error-message="errors.maxAmtNew"
              @change="checkNewNumber('maxAmtNew', '累計最大保障')"
            />
          </td>
          <td>
            <CxlInput
              v-model="connectTimeoutNew"
              :error="!!errors.connectTimeoutNew"
              :error-message="errors.connectTimeoutNew"
              @change="checkNewNumber('connectTimeoutNew', '連線等候時間')"
            />
          </td>
          <td>
            <CxlInput
              v-model="retryNew"
              :error="!!errors.retryNew"
              :error-message="errors.retryNew"
              @change="checkNewNumber('retryNew', '重試次數')"
            />
          </td>
          <td>
            <CxlButton
              label="新增"
              :loading="isProcessing"
              :disable="isProcessing"
              @click="doInsert"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <CxlTable
      :rows="rows"
      :columns="TABLE_COLUMNS"
      row-key="_rowKey"
      separator="cell"
    >
      <template #body-cell-timeout="props">
        <q-td :props="props">
          <CxlInput
            v-model="props.row.timeout"
            :error="!!getRowError(props.row, 'timeout')"
            :error-message="getRowError(props.row, 'timeout')"
            @update:model-value="clearRowFieldError(props.row, 'timeout')"
            @change="checkRowNumber(props.row, 'timeout', '等待時間')"
          />
        </q-td>
      </template>

      <template #body-cell-callAsso="props">
        <q-td :props="props">
          <CxlDropdown
            v-model="props.row.callAsso"
            :options="CALL_ASSO_OPTIONS"
            map-options
            emit-value
          />
        </q-td>
      </template>

      <template #body-cell-url="props">
        <q-td :props="props">
          <CxlInput
            v-model="props.row.url"
            :error="!!getRowError(props.row, 'url')"
            :error-message="getRowError(props.row, 'url')"
            @update:model-value="clearRowFieldError(props.row, 'url')"
          />
        </q-td>
      </template>

      <template #body-cell-maxAmt="props">
        <q-td :props="props">
          <CxlInput
            v-model="props.row.maxAmt"
            :error="!!getRowError(props.row, 'maxAmt')"
            :error-message="getRowError(props.row, 'maxAmt')"
            @update:model-value="clearRowFieldError(props.row, 'maxAmt')"
            @change="checkRowNumber(props.row, 'maxAmt', '累計最大保障')"
          />
        </q-td>
      </template>

      <template #body-cell-connectTimeout="props">
        <q-td :props="props">
          <CxlInput
            v-model="props.row.connectTimeout"
            :error="!!getRowError(props.row, 'connectTimeout')"
            :error-message="getRowError(props.row, 'connectTimeout')"
            @update:model-value="
              clearRowFieldError(props.row, 'connectTimeout')
            "
            @change="
              checkRowNumber(props.row, 'connectTimeout', '連線等候時間')
            "
          />
        </q-td>
      </template>

      <template #body-cell-retry="props">
        <q-td :props="props">
          <CxlInput
            v-model="props.row.retry"
            :error="!!getRowError(props.row, 'retry')"
            :error-message="getRowError(props.row, 'retry')"
            @update:model-value="clearRowFieldError(props.row, 'retry')"
            @change="checkRowNumber(props.row, 'retry', '重試次數')"
          />
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <div class="row justify-center q-gutter-sm no-wrap">
            <CxlButton
              label="修改"
              :loading="isProcessing"
              :disable="isProcessing"
              @click="doUpdate(props.row)"
            />
            <CxlButton
              label="刪除"
              theme="danger"
              :loading="isProcessing"
              :disable="isProcessing"
              @click="doDelete(props.row)"
            />
          </div>
        </q-td>
      </template>
    </CxlTable>
  </q-card>

  <CxlInfo
    v-model="alertState.isOpen"
    title="系統提示"
    closeText="關閉"
    :status="alertState.status"
    persistent
    @buttonClick="alertState.isOpen = false"
  >
    <p class="cxl-font-18">{{ alertState.message }}</p>
  </CxlInfo>

  <CxlModal
    v-model="confirmState.isOpen"
    title="確認提示"
    cancelText="取消"
    confirmText="確認"
    persistent
    @cancel="cancelConfirm"
    @confirm="confirmAction"
  >
    <p class="cxl-font-18">{{ confirmState.message }}</p>
  </CxlModal>
</template>

<script setup>
import { inject, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useField, useForm } from "vee-validate";
import { object, string, ValidationError } from "yup";
import {
  CxlBreadcrumbs,
  CxlButton,
  CxlDropdown,
  CxlInfo,
  CxlInput,
  CxlModal,
  CxlTable,
} from "vue-cathaylife-component";
import navCollection from "@/service/NavCollection.js";
import ata08110Service from "@/service/Ata08110Service.js";

const $route = useRoute();
const $cathayAxios = inject("$cathayAxios");
const rootPath = { label: "首頁", url: "/" };

const CALL_ASSO_OPTIONS = [
  { label: "Y", value: "Y" },
  { label: "N", value: "N" },
];

const TABLE_COLUMNS = [
  {
    name: "sourceName",
    label: "契約來源中文",
    field: "sourceName",
    align: "center",
  },
  {
    name: "source",
    label: "契約來源",
    field: "source",
    align: "center",
  },
  {
    name: "timeout",
    label: "等待時間(毫秒)",
    field: "timeout",
    align: "center",
  },
  {
    name: "callAsso",
    label: "是否通算",
    field: "callAsso",
    align: "center",
  },
  {
    name: "url",
    label: "通算網址",
    field: "url",
    align: "center",
  },
  {
    name: "maxAmt",
    label: "累計最大保障(萬)",
    field: "maxAmt",
    align: "center",
  },
  {
    name: "connectTimeout",
    label: "連線等候時間(毫秒)",
    field: "connectTimeout",
    align: "center",
  },
  {
    name: "retry",
    label: "重試次數",
    field: "retry",
    align: "center",
  },
  {
    name: "actions",
    label: "操作",
    field: "actions",
    align: "center",
  },
];

const createInitialValues = () => ({
  srcNew: "",
  timeoutNew: "",
  callAssoNew: "Y",
  urlNew: "",
  maxAmtNew: "",
  connectTimeoutNew: "",
  retryNew: "",
});

const insertSchema = object({
  srcNew: string().trim().required("契約來源必須輸入"),
  timeoutNew: string()
    .trim()
    .required("等待時間必須輸入")
    .validateNumber("等待時間限定只能輸入數字"),
  urlNew: string().trim().required("通算網址必須輸入"),
  maxAmtNew: string()
    .trim()
    .required("累計最大保障必須輸入")
    .validateNumber("累計最大保障限定只能輸入數字"),
  connectTimeoutNew: string()
    .trim()
    .required("連線等候時間必須輸入")
    .validateNumber("連線等候時間限定只能輸入數字"),
  retryNew: string()
    .trim()
    .required("重試次數必須輸入")
    .validateNumber("重試次數限定只能輸入數字"),
});

const updateRowSchema = object({
  timeout: string()
    .trim()
    .required("等待時間必須輸入")
    .validateNumber("等待時間限定只能輸入數字"),
  url: string().trim().required("通算網址必須輸入"),
  maxAmt: string()
    .trim()
    .required("累計最大保障必須輸入")
    .validateNumber("累計最大保障限定只能輸入數字"),
  connectTimeout: string()
    .trim()
    .required("連線等候時間必須輸入")
    .validateNumber("連線等候時間限定只能輸入數字"),
  retry: string()
    .trim()
    .required("重試次數必須輸入")
    .validateNumber("重試次數限定只能輸入數字"),
});

const { errors, resetForm, setFieldValue, validate } = useForm({
  validationSchema: insertSchema,
  initialValues: createInitialValues(),
  validateOnMount: false,
});

const { value: srcNew } = useField("srcNew");
const { value: timeoutNew } = useField("timeoutNew");
const { value: callAssoNew } = useField("callAssoNew");
const { value: urlNew } = useField("urlNew");
const { value: maxAmtNew } = useField("maxAmtNew");
const { value: connectTimeoutNew } = useField("connectTimeoutNew");
const { value: retryNew } = useField("retryNew");

const rows = ref([]);
const isProcessing = ref(false);
const rowErrors = reactive({});
const alertState = reactive({
  isOpen: false,
  message: "",
  status: "neutral",
});
const confirmState = reactive({
  isOpen: false,
  message: "",
});
let pendingConfirmAction = null;

/**
 * 顯示系統提示。
 *
 * @param {string} message - 提示內容
 * @param {string} [status] - CxlInfo 狀態
 * @returns {void}
 */
const showAlert = (message, status = "neutral") => {
  alertState.message = message;
  alertState.status = status;
  alertState.isOpen = true;
};

/**
 * 顯示確認視窗並暫存確認後執行的動作。
 *
 * @param {string} message - 確認內容
 * @param {() => Promise<void>} action - 確認後執行的動作
 * @returns {void}
 */
const showConfirm = (message, action) => {
  confirmState.message = message;
  pendingConfirmAction = action;
  confirmState.isOpen = true;
};

/**
 * 取消目前確認動作。
 *
 * @returns {void}
 */
const cancelConfirm = () => {
  confirmState.isOpen = false;
  pendingConfirmAction = null;
};

/**
 * 執行目前確認動作。
 *
 * @returns {Promise<void>} 動作完成
 */
const confirmAction = async () => {
  confirmState.isOpen = false;
  const action = pendingConfirmAction;
  pendingConfirmAction = null;
  if (action) {
    await action();
  }
};

/**
 * 將 API 明細映射為頁面列資料。
 *
 * @param {object} detail - ATA08110 明細
 * @param {number} index - 明細索引
 * @returns {object} 頁面列資料
 */
const mapDetailRow = (detail, index) => ({
  _rowKey: `${detail.SRC ?? "row"}-${index}`,
  sourceName: detail.SRC_NAME ?? "",
  source: detail.SRC ?? "",
  timeout: detail.TIMEOUT ?? "",
  callAsso: detail.CALL_ASSO ?? "Y",
  url: detail.URL ?? "",
  maxAmt: detail.MAXAMT ?? "",
  connectTimeout: detail.CONNECT_TIMEOUT ?? "",
  retry: detail.RETRY ?? "",
});

/**
 * 載入公會通報設定資料。
 *
 * @returns {Promise<boolean>} 是否載入成功
 */
const loadData = async () => {
  const response = await $cathayAxios.post(ata08110Service.prompt, {});
  if (response.returnCode !== 0) {
    return false;
  }

  const detailList = response.data?.DTCBZ004_List ?? [];
  if (!Array.isArray(detailList)) {
    throw new TypeError("ATA08110 prompt detail list must be an array.");
  }
  rows.value = detailList.map(mapDetailRow);
  return true;
};

/**
 * 判斷輸入值是否為空值或有效數字。
 *
 * @param {string|number|null|undefined} value - 待檢核值
 * @returns {boolean} 是否通過數字檢核
 */
const isEmptyOrNumber = (value) =>
  value === "" || value === null || value === undefined || !Number.isNaN(Number(value));

/**
 * 檢核新增區數字欄位。
 *
 * @param {string} fieldName - VeeValidate 欄位名稱
 * @param {string} label - 欄位標籤
 * @returns {void}
 */
const checkNewNumber = (fieldName, label) => {
  const fieldValues = {
    timeoutNew: timeoutNew.value,
    maxAmtNew: maxAmtNew.value,
    connectTimeoutNew: connectTimeoutNew.value,
    retryNew: retryNew.value,
  };
  if (isEmptyOrNumber(fieldValues[fieldName])) {
    return;
  }

  setFieldValue(fieldName, "");
  showAlert(`${label}限定只能輸入數字，請重新輸入。`);
};

/**
 * 檢核既有列數字欄位。
 *
 * @param {object} row - 目前資料列
 * @param {string} fieldName - 欄位名稱
 * @param {string} label - 欄位標籤
 * @returns {void}
 */
const checkRowNumber = (row, fieldName, label) => {
  if (isEmptyOrNumber(row[fieldName])) {
    return;
  }

  row[fieldName] = "";
  showAlert(`${label}限定只能輸入數字，請重新輸入。`);
};

/**
 * 取得指定列欄位的驗證錯誤。
 *
 * @param {object} row - 目前資料列
 * @param {string} fieldName - 欄位名稱
 * @returns {string} 錯誤訊息
 */
const getRowError = (row, fieldName) =>
  rowErrors[row._rowKey]?.[fieldName] ?? "";

/**
 * 清除指定列的驗證錯誤。
 *
 * @param {object} row - 目前資料列
 * @returns {void}
 */
const clearRowErrors = (row) => {
  delete rowErrors[row._rowKey];
};

/**
 * 清除指定列欄位的驗證錯誤。
 *
 * @param {object} row - 目前資料列
 * @param {string} fieldName - 欄位名稱
 * @returns {void}
 */
const clearRowFieldError = (row, fieldName) => {
  if (!rowErrors[row._rowKey]) {
    return;
  }
  delete rowErrors[row._rowKey][fieldName];
  if (Object.keys(rowErrors[row._rowKey]).length === 0) {
    clearRowErrors(row);
  }
};

/**
 * 驗證指定資料列。
 *
 * @param {object} row - 目前資料列
 * @returns {Promise<boolean>} 是否驗證成功
 */
const validateRow = async (row) => {
  clearRowErrors(row);
  try {
    await updateRowSchema.validate(row, { abortEarly: false });
    return true;
  } catch (error) {
    if (!(error instanceof ValidationError)) {
      throw error;
    }
    const validationErrors = error.inner.length ? error.inner : [error];
    rowErrors[row._rowKey] = {};
    validationErrors.forEach((validationError) => {
      rowErrors[row._rowKey][validationError.path] = validationError.message;
    });
    showAlert("紅底文字框為必須輸入或格式不正確。");
    return false;
  }
};

/**
 * 將輸入值轉為去除前後空白的字串。
 *
 * @param {string|number|null|undefined} value - 輸入值
 * @returns {string} 正規化字串
 */
const normalizeInput = (value) => String(value ?? "").trim();

/**
 * 將目前頁面資料序列化為後端表單格式。
 *
 * @param {number|string} [index] - 操作列索引
 * @returns {object} ATA08110 request DTO
 */
const serializeForm = (index = "") => ({
  SRC_NEW: normalizeInput(srcNew.value),
  TIMEOUT_NEW: normalizeInput(timeoutNew.value),
  CALL_ASSO_NEW: callAssoNew.value,
  URL_NEW: normalizeInput(urlNew.value),
  MAXAMT_NEW: normalizeInput(maxAmtNew.value),
  CONNECT_TIMEOUT_NEW: normalizeInput(connectTimeoutNew.value),
  RETRY_NEW: normalizeInput(retryNew.value),
  index,
  SRC: rows.value.map((row) => row.source),
  TIMEOUT: rows.value.map((row) => normalizeInput(row.timeout)),
  CALL_ASSO: rows.value.map((row) => row.callAsso),
  URL: rows.value.map((row) => normalizeInput(row.url)),
  MAXAMT: rows.value.map((row) => normalizeInput(row.maxAmt)),
  CONNECT_TIMEOUT: rows.value.map((row) =>
    normalizeInput(row.connectTimeout),
  ),
  RETRY: rows.value.map((row) => normalizeInput(row.retry)),
});

/**
 * 呼叫設定異動 API，成功後重載頁面。
 *
 * @param {string} endpoint - Service endpoint
 * @param {number|string} index - 操作列索引
 * @param {string} successMessage - 成功提示
 * @returns {Promise<void>} 異動完成
 */
const requestAction = async (endpoint, index, successMessage) => {
  if (isProcessing.value) {
    showAlert("資料處理中，請稍候。");
    return;
  }

  isProcessing.value = true;
  try {
    const response = await $cathayAxios.post(endpoint, serializeForm(index));
    if (response.returnCode !== 0) {
      return;
    }

    resetForm({ values: createInitialValues() });
    Object.keys(rowErrors).forEach((key) => delete rowErrors[key]);
    const reloaded = await loadData();
    if (!reloaded) {
      return;
    }
    showAlert(successMessage, "positive");
  } finally {
    isProcessing.value = false;
  }
};

/**
 * 新增公會通報設定。
 *
 * @returns {Promise<void>} 新增完成
 */
const doInsert = async () => {
  const { valid } = await validate();
  if (!valid) {
    showAlert("紅底文字框為必須輸入或格式不正確。");
    return;
  }
  await requestAction(
    ata08110Service.insert,
    "",
    "公會通報設定新增成功",
  );
};

/**
 * 要求確認刪除指定資料列。
 *
 * @param {object} row - 待刪除資料列
 * @returns {void}
 */
const doDelete = (row) => {
  const rowIndex = rows.value.findIndex((item) => item._rowKey === row._rowKey);
  if (rowIndex < 0) {
    throw new RangeError("ATA08110 delete row was not found.");
  }
  showConfirm("請確認是否要刪除？", () =>
    requestAction(
      ata08110Service.delete,
      rowIndex,
      "公會通報設定刪除成功",
    ),
  );
};

/**
 * 驗證並要求確認修改指定資料列。
 *
 * @param {object} row - 待修改資料列
 * @returns {Promise<void>} 驗證完成
 */
const doUpdate = async (row) => {
  const valid = await validateRow(row);
  if (!valid) {
    return;
  }

  const rowIndex = rows.value.findIndex((item) => item._rowKey === row._rowKey);
  if (rowIndex < 0) {
    throw new RangeError("ATA08110 update row was not found.");
  }
  showConfirm("請確認是否要修改？", () =>
    requestAction(
      ata08110Service.update,
      rowIndex,
      "公會通報設定修改成功",
    ),
  );
};

onMounted(loadData);
</script>
