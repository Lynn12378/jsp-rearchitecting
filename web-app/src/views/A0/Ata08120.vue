<template>
  <CxlBreadcrumbs
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="rootPath"
  />

  <div class="row items-center justify-between q-mb-md">
    <div class="cxl-title-h1 q-mt-md">公會通報設定</div>
    <div>畫面編號：ATA08120</div>
  </div>

  <q-card class="cxl-card q-pa-md">
    <q-markup-table
      class="cxl-table q-mb-lg"
      flat
      bordered
      separator="cell"
    >
      <colgroup>
        <col style="width: 10%" />
        <col style="width: 7%" />
        <col style="width: 11%" />
        <col style="width: 11%" />
        <col style="width: 7%" />
        <col style="width: 9%" />
        <col style="width: 13%" />
        <col style="width: 7%" />
        <col style="width: 8%" />
        <col style="width: 7%" />
        <col style="width: 10%" />
      </colgroup>
      <thead>
        <tr>
          <th colspan="11" class="cxl-table-header">新增設定</th>
        </tr>
        <tr>
          <th scope="col">契約來源中文</th>
          <th scope="col">契約來源</th>
          <th scope="col">連線等候時間(毫秒)</th>
          <th scope="col">資料等候時間(毫秒)</th>
          <th scope="col">作業開關</th>
          <th scope="col">公會連線方式</th>
          <th scope="col">WebService呼叫方法</th>
          <th scope="col">重試次數</th>
          <th scope="col">FTP登入帳號</th>
          <th scope="col">通報種類</th>
          <th scope="col">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td>
            <CxlInput
              v-model="srcNew"
              :maxlength="6"
              :error="!!errors.srcNew"
              :error-message="errors.srcNew"
            />
          </td>
          <td>
            <CxlInput
              v-model="timeoutNew"
              :error="!!errors.timeoutNew"
              :error-message="errors.timeoutNew"
            />
          </td>
          <td>
            <CxlInput
              v-model="dataTimeoutNew"
              :error="!!errors.dataTimeoutNew"
              :error-message="errors.dataTimeoutNew"
            />
          </td>
          <td>
            <CxlDropdown
              v-model="isEffectiveNew"
              :options="EFFECTIVE_OPTIONS"
              map-options
              emit-value
            />
          </td>
          <td>
            <CxlInput
              v-model="connectionNew"
              :maxlength="1"
              :error="!!errors.connectionNew"
              :error-message="errors.connectionNew"
            />
          </td>
          <td>
            <CxlDropdown
              v-model="actionNew"
              :options="actionOptions"
              map-options
              emit-value
            />
          </td>
          <td>
            <CxlInput
              v-model="retryNew"
              :error="!!errors.retryNew"
              :error-message="errors.retryNew"
            />
          </td>
          <td>
            <CxlInput
              v-model="ftpHostNew"
              :maxlength="1"
              :error="!!errors.ftpHostNew"
              :error-message="errors.ftpHostNew"
            />
          </td>
          <td>
            <CxlInput v-model="typeNew" :maxlength="1" />
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
          />
        </q-td>
      </template>

      <template #body-cell-dataTimeout="props">
        <q-td :props="props">
          <CxlInput
            v-model="props.row.dataTimeout"
            :error="!!getRowError(props.row, 'dataTimeout')"
            :error-message="getRowError(props.row, 'dataTimeout')"
            @update:model-value="
              clearRowFieldError(props.row, 'dataTimeout')
            "
          />
        </q-td>
      </template>

      <template #body-cell-isEffective="props">
        <q-td :props="props">
          <CxlDropdown
            v-model="props.row.isEffective"
            :options="EFFECTIVE_OPTIONS"
            map-options
            emit-value
          />
        </q-td>
      </template>

      <template #body-cell-connection="props">
        <q-td :props="props">
          <CxlInput
            v-model="props.row.connection"
            :maxlength="1"
            :error="!!getRowError(props.row, 'connection')"
            :error-message="getRowError(props.row, 'connection')"
            @update:model-value="clearRowFieldError(props.row, 'connection')"
          />
        </q-td>
      </template>

      <template #body-cell-action="props">
        <q-td :props="props">
          <CxlDropdown
            v-model="props.row.action"
            :options="actionOptions"
            map-options
            emit-value
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
          />
        </q-td>
      </template>

      <template #body-cell-ftpHost="props">
        <q-td :props="props">
          <CxlInput
            v-model="props.row.ftpHost"
            :maxlength="1"
            :error="!!getRowError(props.row, 'ftpHost')"
            :error-message="getRowError(props.row, 'ftpHost')"
            @update:model-value="clearRowFieldError(props.row, 'ftpHost')"
          />
        </q-td>
      </template>

      <template #body-cell-type="props">
        <q-td :props="props">
          <CxlInput v-model="props.row.type" :maxlength="1" />
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

    <div class="q-mt-md">
      <div>※使用說明:</div>
      <div>1. 通報種類: R=收件，L=承保 (如果是取回作業，這個欄位不會使用)</div>
      <div>2. 公會連線方式: W=Webservice，V=VPN</div>
      <div>3. FTP登入帳號: 1=網路投保，2=批次</div>
      <div>4. 作業開關(正式環境請小心使用): Y-&gt;開，N-&gt;關(代表直接pass該項公會作業)</div>
    </div>
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
import ata08120Service from "@/service/Ata08120Service.js";

const $route = useRoute();
const $cathayAxios = inject("$cathayAxios");
const rootPath = { label: "首頁", url: "/" };

const EFFECTIVE_OPTIONS = [
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
    label: "連線等候時間(毫秒)",
    field: "timeout",
    align: "center",
  },
  {
    name: "dataTimeout",
    label: "資料等候時間(毫秒)",
    field: "dataTimeout",
    align: "center",
  },
  {
    name: "isEffective",
    label: "作業開關",
    field: "isEffective",
    align: "center",
  },
  {
    name: "connection",
    label: "公會連線方式",
    field: "connection",
    align: "center",
  },
  {
    name: "action",
    label: "WebService呼叫方法",
    field: "action",
    align: "center",
  },
  {
    name: "retry",
    label: "重試次數",
    field: "retry",
    align: "center",
  },
  {
    name: "ftpHost",
    label: "FTP登入帳號",
    field: "ftpHost",
    align: "center",
  },
  {
    name: "type",
    label: "通報種類",
    field: "type",
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
  dataTimeoutNew: "",
  isEffectiveNew: "Y",
  connectionNew: "",
  actionNew: "",
  retryNew: "",
  ftpHostNew: "",
  typeNew: "",
});

const insertSchema = object({
  srcNew: string().trim().required("契約來源必須輸入"),
  timeoutNew: string()
    .trim()
    .required("連線等候時間必須輸入")
    .validateNumber("連線等候時間限定只能輸入數字"),
  dataTimeoutNew: string()
    .trim()
    .required("資料等候時間必須輸入")
    .validateNumber("資料等候時間限定只能輸入數字"),
  connectionNew: string().trim().required("公會連線方式必須輸入"),
  retryNew: string()
    .trim()
    .required("重試次數必須輸入")
    .validateNumber("重試次數限定只能輸入數字"),
  ftpHostNew: string().trim().required("FTP登入帳號必須輸入"),
});

const updateRowSchema = object({
  timeout: string()
    .trim()
    .required("連線等候時間必須輸入")
    .validateNumber("連線等候時間限定只能輸入數字"),
  dataTimeout: string()
    .trim()
    .required("資料等候時間必須輸入")
    .validateNumber("資料等候時間限定只能輸入數字"),
  connection: string().trim().required("公會通報方式必須輸入"),
  retry: string()
    .trim()
    .required("重試次數必須輸入")
    .validateNumber("重試次數限定只能輸入數字"),
  ftpHost: string().trim().required("FTP登入帳號必須輸入"),
});

const { errors, resetForm, validate } = useForm({
  validationSchema: insertSchema,
  initialValues: createInitialValues(),
  validateOnMount: false,
});

const { value: srcNew } = useField("srcNew");
const { value: timeoutNew } = useField("timeoutNew");
const { value: dataTimeoutNew } = useField("dataTimeoutNew");
const { value: isEffectiveNew } = useField("isEffectiveNew");
const { value: connectionNew } = useField("connectionNew");
const { value: actionNew } = useField("actionNew");
const { value: retryNew } = useField("retryNew");
const { value: ftpHostNew } = useField("ftpHostNew");
const { value: typeNew } = useField("typeNew");

const actionOptions = ref([]);
const sourceNameMap = ref({});
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
 * 將 API Action 對照轉換為下拉選單格式。
 *
 * @param {object} actionMap - WebService 呼叫方法對照
 * @returns {{ label: string, value: string }[]} 下拉選單項目
 */
const toActionOptions = (actionMap) =>
  Object.entries(actionMap).map(([value, label]) => ({ value, label }));

/**
 * 將 API 明細映射為頁面列資料。
 *
 * @param {object} detail - ATA08120 明細
 * @param {number} index - 明細索引
 * @returns {object} 頁面列資料
 */
const mapDetailRow = (detail, index) => ({
  _rowKey: `${detail.SRC ?? "row"}-${index}`,
  sourceName:
    detail.SRC_NAME ??
    detail.SRC_DESC ??
    sourceNameMap.value[detail.SRC] ??
    "",
  source: detail.SRC ?? "",
  timeout: detail.TIMEOUT ?? "",
  dataTimeout: detail.DATA_TIMEOUT ?? "",
  isEffective: detail.IS_EFFECTIVE ?? "Y",
  connection: detail.CONNECTION ?? "",
  action: detail.ACTION ?? "",
  retry: detail.RETRY ?? "",
  ftpHost: detail.FTP_HOST ?? "",
  type: detail.TYPE ?? "",
});

/**
 * 載入公會通報設定資料。
 *
 * @returns {Promise<boolean>} 是否載入成功
 */
const loadData = async () => {
  const response = await $cathayAxios.post(ata08120Service.prompt, {});
  if (response.returnCode !== 0) {
    return false;
  }

  const data = response.data ?? {};
  const detailList = data.DTAFY001_List ?? [];
  if (!Array.isArray(detailList)) {
    throw new TypeError("ATA08120 prompt detail list must be an array.");
  }
  if (
    !data.ACTION_Map ||
    typeof data.ACTION_Map !== "object" ||
    Array.isArray(data.ACTION_Map)
  ) {
    throw new TypeError("ATA08120 ACTION_Map must be an object.");
  }
  if (
    data.SRC_Map !== undefined &&
    (typeof data.SRC_Map !== "object" || Array.isArray(data.SRC_Map))
  ) {
    throw new TypeError("ATA08120 SRC_Map must be an object.");
  }

  actionOptions.value = toActionOptions(data.ACTION_Map);
  sourceNameMap.value = data.SRC_Map ?? {};
  rows.value = detailList.map(mapDetailRow);
  return true;
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
 * @returns {object} ATA08120 request DTO
 */
const serializeForm = (index = "") => ({
  SRC_NEW: normalizeInput(srcNew.value),
  TIMEOUT_NEW: normalizeInput(timeoutNew.value),
  DATA_TIMEOUT_NEW: normalizeInput(dataTimeoutNew.value),
  IS_EFFECTIVE_NEW: isEffectiveNew.value,
  CONNECTION_NEW: normalizeInput(connectionNew.value).toUpperCase(),
  ACTION_NEW: actionNew.value,
  RETRY_NEW: normalizeInput(retryNew.value),
  FTP_HOST_NEW: normalizeInput(ftpHostNew.value),
  TYPE_NEW: normalizeInput(typeNew.value).toUpperCase(),
  index,
  SRC: rows.value.map((row) => row.source),
  TIMEOUT: rows.value.map((row) => normalizeInput(row.timeout)),
  DATA_TIMEOUT: rows.value.map((row) => normalizeInput(row.dataTimeout)),
  IS_EFFECTIVE: rows.value.map((row) => row.isEffective),
  CONNECTION: rows.value.map((row) =>
    normalizeInput(row.connection).toUpperCase(),
  ),
  ACTION: rows.value.map((row) => row.action),
  RETRY: rows.value.map((row) => normalizeInput(row.retry)),
  FTP_HOST: rows.value.map((row) => normalizeInput(row.ftpHost)),
  TYPE: rows.value.map((row) => normalizeInput(row.type).toUpperCase()),
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
    ata08120Service.insert,
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
    throw new RangeError("ATA08120 delete row was not found.");
  }
  showConfirm("請確認是否要刪除？", () =>
    requestAction(
      ata08120Service.delete,
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
    throw new RangeError("ATA08120 update row was not found.");
  }
  showConfirm("請確認是否要修改？", () =>
    requestAction(
      ata08120Service.update,
      rowIndex,
      "公會通報設定修改成功",
    ),
  );
};

onMounted(loadData);
</script>
