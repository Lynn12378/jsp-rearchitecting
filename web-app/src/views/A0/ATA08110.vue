<template>
  <!-- 麵包屑 -->
  <CxlBreadcrumbs class="q-mb-md" :breadcrumbs="navCollection" :routerPath="$route.path" :rootPath="rootPath" />
  <!-- 頁面標題 -->
  <div class="cxl-title-h1 q-mt-md q-mb-md">公會通報設定</div>

  <!-- 新增列表單 -->
  <q-markup-table class="cxl-table cxl-table-horizontal q-mb-md" flat bordered>
    <thead>
      <tr>
        <th scope="col">契約來源中文</th>
        <th scope="col"><span class="cxl-text-danger">*</span> 契約來源</th>
        <th scope="col"><span class="cxl-text-danger">*</span> 等待時間(毫秒)</th>
        <th scope="col">是否通算</th>
        <th scope="col"><span class="cxl-text-danger">*</span> 通算網址</th>
        <th scope="col"><span class="cxl-text-danger">*</span> 累計最大保障(萬)</th>
        <th scope="col"><span class="cxl-text-danger">*</span> 連線等候時間(毫秒)</th>
        <th scope="col"><span class="cxl-text-danger">*</span> 重試次數</th>
        <th scope="col">操作</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td></td>
        <td>
          <CxlInput v-model="srcNew" :error="!!newRowErrors.srcNew" :error-message="newRowErrors.srcNew" />
        </td>
        <td>
          <CxlInput
            v-model="timeoutNew"
            :error="!!newRowErrors.timeoutNew"
            :error-message="newRowErrors.timeoutNew"
            @blur="timeoutNew = onCheckNumber(timeoutNew, '等待時間')"
          />
        </td>
        <td>
          <CxlDropdown v-model="callAssoNew" :options="callAssoOptions" map-options emit-value />
        </td>
        <td>
          <CxlInput v-model="urlNew" :error="!!newRowErrors.urlNew" :error-message="newRowErrors.urlNew" />
        </td>
        <td>
          <CxlInput
            v-model="maxamtNew"
            :error="!!newRowErrors.maxamtNew"
            :error-message="newRowErrors.maxamtNew"
            @blur="maxamtNew = onCheckNumber(maxamtNew, '累計最大保障')"
          />
        </td>
        <td>
          <CxlInput
            v-model="connectTimeoutNew"
            :error="!!newRowErrors.connectTimeoutNew"
            :error-message="newRowErrors.connectTimeoutNew"
            @blur="connectTimeoutNew = onCheckNumber(connectTimeoutNew, '連線等候時間')"
          />
        </td>
        <td>
          <CxlInput
            v-model="retryNew"
            :error="!!newRowErrors.retryNew"
            :error-message="newRowErrors.retryNew"
            @blur="retryNew = onCheckNumber(retryNew, '重試次數')"
          />
        </td>
        <td>
          <CxlButton label="新增" @click="onInsert" />
        </td>
      </tr>
    </tbody>
  </q-markup-table>

  <!-- 資料列表 -->
  <CxlTable :rows="rowFields" :columns="columns" row-key="key">
    <template #body-cell-srcName="props">
      <q-td :props="props">{{ props.row.value.srcName }}</q-td>
    </template>
    <template #body-cell-src="props">
      <q-td :props="props">{{ props.row.value.src }}</q-td>
    </template>
    <template #body-cell-timeout="props">
      <q-td :props="props">
        <CxlInput
          v-model="props.row.value.timeout"
          :error="!!rowsErrors[`rows[${getRowIndex(props.row)}].timeout`]"
          :error-message="rowsErrors[`rows[${getRowIndex(props.row)}].timeout`]"
          @blur="props.row.value.timeout = onCheckNumber(props.row.value.timeout, '等待時間')"
        />
      </q-td>
    </template>
    <template #body-cell-callAsso="props">
      <q-td :props="props">
        <CxlDropdown v-model="props.row.value.callAsso" :options="callAssoOptions" map-options emit-value />
      </q-td>
    </template>
    <template #body-cell-url="props">
      <q-td :props="props">
        <CxlInput
          v-model="props.row.value.url"
          :error="!!rowsErrors[`rows[${getRowIndex(props.row)}].url`]"
          :error-message="rowsErrors[`rows[${getRowIndex(props.row)}].url`]"
        />
      </q-td>
    </template>
    <template #body-cell-maxamt="props">
      <q-td :props="props">
        <CxlInput
          v-model="props.row.value.maxamt"
          :error="!!rowsErrors[`rows[${getRowIndex(props.row)}].maxamt`]"
          :error-message="rowsErrors[`rows[${getRowIndex(props.row)}].maxamt`]"
          @blur="props.row.value.maxamt = onCheckNumber(props.row.value.maxamt, '累計最大保障')"
        />
      </q-td>
    </template>
    <template #body-cell-connectTimeout="props">
      <q-td :props="props">
        <CxlInput
          v-model="props.row.value.connectTimeout"
          :error="!!rowsErrors[`rows[${getRowIndex(props.row)}].connectTimeout`]"
          :error-message="rowsErrors[`rows[${getRowIndex(props.row)}].connectTimeout`]"
          @blur="props.row.value.connectTimeout = onCheckNumber(props.row.value.connectTimeout, '連線等候時間')"
        />
      </q-td>
    </template>
    <template #body-cell-retry="props">
      <q-td :props="props">
        <CxlInput
          v-model="props.row.value.retry"
          :error="!!rowsErrors[`rows[${getRowIndex(props.row)}].retry`]"
          :error-message="rowsErrors[`rows[${getRowIndex(props.row)}].retry`]"
          @blur="props.row.value.retry = onCheckNumber(props.row.value.retry, '重試次數')"
        />
      </q-td>
    </template>
    <template #body-cell-action="props">
      <q-td :props="props">
        <div class="q-gutter-sm row justify-center">
          <CxlButton label="修改" @click="onUpdate(getRowIndex(props.row))" />
          <CxlButton label="刪除" theme="danger" @click="onDelete(getRowIndex(props.row))" />
        </div>
      </q-td>
    </template>
  </CxlTable>
</template>

<script setup>
// 1. import statements
import { onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import { useForm, useField, useFieldArray } from "vee-validate";
import { object, string, array } from "yup";
import { CxlBreadcrumbs, CxlInput, CxlDropdown, CxlButton, CxlTable } from "vue-cathaylife-component";
import navCollection from "@/service/NavCollection.js";
import ata08110Service from "@/service/ATA08110Service.js";

// 2. inject
const $cathayAxios = inject("$cathayAxios");
const $notify = inject("$notify");
const $confirm = inject("$confirm");

// 3. ref, reactive
const $route = useRoute();
const rootPath = { label: "首頁", url: "/" };

const callAssoOptions = [
  { label: "是", value: "Y" },
  { label: "否", value: "N" },
];

const columns = [
  { name: "srcName", label: "契約來源中文", field: (row) => row.value.srcName, align: "left" },
  { name: "src", label: "契約來源", field: (row) => row.value.src, align: "left" },
  { name: "timeout", label: "等待時間(毫秒)", field: (row) => row.value.timeout, align: "left" },
  { name: "callAsso", label: "是否通算", field: (row) => row.value.callAsso, align: "left" },
  { name: "url", label: "通算網址", field: (row) => row.value.url, align: "left" },
  { name: "maxamt", label: "累計最大保障(萬)", field: (row) => row.value.maxamt, align: "left" },
  { name: "connectTimeout", label: "連線等候時間(毫秒)", field: (row) => row.value.connectTimeout, align: "left" },
  { name: "retry", label: "重試次數", field: (row) => row.value.retry, align: "left" },
  { name: "action", label: "操作", field: () => "", align: "center" },
];

// 4-5. Validation Objects and methods / schema, useForm, useField

// 新增列驗證 schema(對應 doInsert 必填檢核)
const newRowSchema = object({
  srcNew: string().required("契約來源必須輸入"),
  timeoutNew: string().required("等待時間必須輸入"),
  urlNew: string().required("通算網址必須輸入"),
  maxamtNew: string().required("累計最大保障必須輸入"),
  connectTimeoutNew: string().required("連線等候時間必須輸入"),
  retryNew: string().required("重試次數必須輸入"),
});

const {
  errors: newRowErrors,
  validate: validateNewRow,
  resetForm: resetNewRowForm,
} = useForm({
  validationSchema: newRowSchema,
  initialValues: {
    srcNew: "",
    timeoutNew: "",
    callAssoNew: "Y",
    urlNew: "",
    maxamtNew: "",
    connectTimeoutNew: "",
    retryNew: "",
  },
  validateOnMount: false,
});

const { value: srcNew } = useField("srcNew");
const { value: timeoutNew } = useField("timeoutNew");
const { value: urlNew } = useField("urlNew");
const { value: maxamtNew } = useField("maxamtNew");
const { value: connectTimeoutNew } = useField("connectTimeoutNew");
const { value: retryNew } = useField("retryNew");
const { value: callAssoNew } = useField("callAssoNew", undefined, { initialValue: "Y" });

// 資料列驗證 schema(對應 doUpdate 必填檢核，SRC、CALL_ASSO 不檢核)
const rowSchema = object({
  timeout: string().required("等待時間必須輸入"),
  url: string().required("通算網址必須輸入"),
  maxamt: string().required("累計最大保障必須輸入"),
  connectTimeout: string().required("連線等候時間必須輸入"),
  retry: string().required("重試次數必須輸入"),
});

const rowsValidationSchema = object({
  rows: array().of(rowSchema),
});

const {
  errors: rowsErrors,
  validateField: validateRowField,
  setValues: setRowsValues,
} = useForm({
  validationSchema: rowsValidationSchema,
  initialValues: { rows: [] },
  validateOnMount: false,
});

const { fields: rowFields } = useFieldArray("rows");

// 6. computed, watch, onMounted, onUnmounted, onUpdated
onMounted(() => {
  fetchList();
});

// 7. event handlers

/**
 * 依 field entry 的 key 取得該列在 rowFields 中的實際索引
 * @param {object} row - CxlTable body-cell slot 提供的 row 物件(useFieldArray field entry)
 * @returns {number} 該列在 rowFields 中的索引
 */
const getRowIndex = (row) => rowFields.value.findIndex((field) => field.key === row.key);

/**
 * 檢核輸入值是否為數字，非數字時顯示警示訊息並清空該值
 * @param {string} value - 欲檢核的欄位值
 * @param {string} label - 欄位中文名稱
 * @returns {string} 檢核後的欄位值(非數字時回傳空字串)
 */
const onCheckNumber = (value, label) => {
  if (isNaN(value)) {
    $notify.warning(`${label}限定只能輸入數字，請重新輸入。`);
    return "";
  }
  return value;
};

/**
 * 刪除指定資料列
 * @param {number} index - 欲刪除的資料列索引
 */
const onDelete = (index) => {
  $confirm("請確認是否要刪除?").then(async () => {
    await deleteItem(index);
  });
};

/**
 * 修改指定資料列
 * @param {number} index - 欲修改的資料列索引
 */
const onUpdate = async (index) => {
  const fieldsToValidate = ["timeout", "url", "maxamt", "connectTimeout", "retry"];
  const results = await Promise.all(fieldsToValidate.map((field) => validateRowField(`rows[${index}].${field}`)));

  if (results.some((result) => !result.valid)) {
    $notify.warning("紅底文字框為必須輸入。");
    return;
  }

  $confirm("請確認是否要修改?").then(async () => {
    await updateItem(index);
  });
};

/**
 * 新增一筆設定資料
 */
const onInsert = async () => {
  const { valid } = await validateNewRow();
  if (!valid) {
    $notify.warning("紅底文字框為必須輸入。");
    return;
  }
  await insertItem();
};

// 8. API calls methods（need JSDoc）

/**
 * 查詢公會通報設定清單(Contract A / Contract E)
 */
const fetchList = async () => {
  const resp = await $cathayAxios.get(ata08110Service.queryList);
  if (resp.returnCode !== 0) {
    return;
  }

  setRowsValues({
    rows: resp.data.DTCBZ004_List.map((item) => ({
      src: item.SRC,
      // TODO: Unknown Behavior - <cathay:conver sys="AT" field="SRC" value="${detail.SRC}"/>
      srcName: item.SRC_NAME,
      timeout: item.TIMEOUT,
      callAsso: item.CALL_ASSO,
      url: item.URL,
      maxamt: item.MAXAMT,
      connectTimeout: item.CONNECT_TIMEOUT,
      retry: item.RETRY,
    })),
  });
};

/**
 * 新增公會通報設定(Contract B)
 */
const insertItem = async () => {
  const resp = await $cathayAxios.post(ata08110Service.insert, {
    SRC_NEW: srcNew.value,
    TIMEOUT_NEW: timeoutNew.value,
    CALL_ASSO_NEW: callAssoNew.value,
    URL_NEW: urlNew.value,
    MAXAMT_NEW: maxamtNew.value,
    CONNECT_TIMEOUT_NEW: connectTimeoutNew.value,
    RETRY_NEW: retryNew.value,
  });

  if (resp.returnCode !== 0) {
    await fetchList();
    return;
  }

  $notify.success("公會通報設定新增成功");
  resetNewRowForm();
  await fetchList();
};

/**
 * 刪除公會通報設定(Contract C)
 * 原始行為為表單(form1)整體序列化送出，包含新增列欄位、所有既有資料列欄位(陣列)及欲刪除列索引
 * @param {number} index - 欲刪除的資料列索引
 */
const deleteItem = async (index) => {
  const resp = await $cathayAxios.post(ata08110Service.delete, {
    index,
    SRC_NEW: srcNew.value,
    TIMEOUT_NEW: timeoutNew.value,
    CALL_ASSO_NEW: callAssoNew.value,
    URL_NEW: urlNew.value,
    MAXAMT_NEW: maxamtNew.value,
    CONNECT_TIMEOUT_NEW: connectTimeoutNew.value,
    RETRY_NEW: retryNew.value,
    SRC: rowFields.value.map((field) => field.value.src),
    TIMEOUT: rowFields.value.map((field) => field.value.timeout),
    CALL_ASSO: rowFields.value.map((field) => field.value.callAsso),
    URL: rowFields.value.map((field) => field.value.url),
    MAXAMT: rowFields.value.map((field) => field.value.maxamt),
    CONNECT_TIMEOUT: rowFields.value.map((field) => field.value.connectTimeout),
    RETRY: rowFields.value.map((field) => field.value.retry),
  });

  if (resp.returnCode !== 0) {
    await fetchList();
    return;
  }

  $notify.success("公會通報設定刪除成功");
  await fetchList();
};

/**
 * 修改公會通報設定(Contract D)
 * @param {number} index - 欲修改的資料列索引
 */
const updateItem = async (index) => {
  const row = rowFields.value[index].value;
  const resp = await $cathayAxios.post(ata08110Service.update, {
    index,
    SRC: row.src,
    TIMEOUT: row.timeout,
    CALL_ASSO: row.callAsso,
    URL: row.url,
    MAXAMT: row.maxamt,
    CONNECT_TIMEOUT: row.connectTimeout,
    RETRY: row.retry,
  });

  if (resp.returnCode !== 0) {
    await fetchList();
    return;
  }

  $notify.success("公會通報設定修改成功");
  await fetchList();
};
</script>
