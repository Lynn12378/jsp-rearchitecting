<template>
  <CxlBreadcrumbs
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="rootPath"
  />

  <div class="row items-center justify-between q-mb-md">
    <div class="cxl-title-h1 q-mt-md">公會通報下傳作業</div>
    <div>畫面編號：AFY10400</div>
  </div>

  <q-card class="cxl-card q-pa-md">
    <div class="cxl-title-h3 q-mb-md">公會補通報作業</div>

    <div class="cxl-ba-1 cxl-border-gray-d8 q-pa-sm q-mb-md">
      <ol class="cxl-ordered-list q-my-none">
        <li>
          此畫面請用<span class="cxl-text-danger">Google Chrome</span>使用
        </li>
        <li>
          收承方式、商品屬性，每次只能針對其中一種組合進行下載，若有多種組合下載，需分多次匯出處理
        </li>
        <li>
          同一 ID 查詢多筆保單時，請在保單號碼欄位輸入多筆，並用<span
            class="cxl-text-danger"
          >Enter</span>分隔
        </li>
        <li
          v-for="(message, messageIndex) in promptMessages"
          :key="`${messageIndex}-${message}`"
        >
          {{ message }}
        </li>
      </ol>
    </div>

    <q-markup-table
      class="cxl-table cxl-table-horizontal q-mb-md"
      flat
      bordered
      separator="cell"
    >
      <thead>
        <tr>
          <th colspan="4" class="cxl-table-header">通報設定</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">收承方式</th>
          <td>
            <CxlDropdown
              v-model="insrType"
              :options="INSR_TYPE_OPTIONS"
              :disable="isExporting"
              emit-value
              map-options
              @update:model-value="clearExportResults"
            />
          </td>
          <th scope="row">商品屬性</th>
          <td>
            <CxlDropdown
              v-model="prodType"
              :options="PROD_TYPE_OPTIONS"
              :disable="isExporting"
              emit-value
              map-options
              @update:model-value="clearExportResults"
            />
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <div class="row justify-end q-mb-md">
      <CxlButton
        label="新增一列"
        :disable="isExporting"
        @click="addRow"
      />
    </div>

    <CxlTable
      :rows="rows"
      :columns="TABLE_COLUMNS"
      row-key="id"
      separator="cell"
    >
      <template #body-cell-delete="props">
        <q-td :props="props">
          <CxlButton
            :id="`deleteBtn${props.row.id}`"
            label="刪除此列"
            theme="danger"
            :disable="isExporting"
            @click="deleteRow(props.row.id)"
          />
        </q-td>
      </template>

      <template #body-cell-insuredId="props">
        <q-td :props="props">
          <CxlInput
            :id="`insuredId${props.row.id}`"
            v-model="props.row.insuredId"
            :disable="isExporting"
            maxlength="10"
            placeholder="請輸入被保人 ID"
            @update:model-value="clearRowResult(props.row)"
          />
        </q-td>
      </template>

      <template #body-cell-policyNumbers="props">
        <q-td :props="props">
          <CxlTextarea
            :id="`policyNumbers${props.row.id}`"
            v-model="props.row.policyNumbers"
            :rows="3"
            :disable="isExporting"
            placeholder="每筆保單號碼以 Enter 分隔"
            @update:model-value="clearRowResult(props.row)"
          />
        </q-td>
      </template>

      <template #body-cell-result="props">
        <q-td :props="props">
          {{ props.row.result }}
        </q-td>
      </template>
    </CxlTable>

    <div class="row justify-center q-mt-md">
      <CxlButton
        id="exportBtn"
        label="匯出檔案"
        :loading="isExporting"
        @click="exportFile"
      />
    </div>
  </q-card>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  CxlBreadcrumbs,
  CxlButton,
  CxlDropdown,
  CxlInput,
  CxlTable,
  CxlTextarea,
} from "vue-cathaylife-component";
import navCollection from "@/service/NavCollection.js";
import afy10400Service from "@/service/Afy10400Service.js";

const $route = useRoute();
const $alert = inject("$alert");
const $cathayAxios = inject("$cathayAxios");
const rootPath = { label: "首頁", url: "/" };

const INSR_TYPE_OPTIONS = [
  { label: "承保", value: "L" },
  { label: "收件", value: "R" },
];
const PROD_TYPE_OPTIONS = [
  { label: "個險", value: "AT" },
  { label: "團險", value: "BG" },
  { label: "意外險", value: "CB" },
];
const TABLE_COLUMNS = [
  {
    name: "delete",
    label: "刪除",
    field: "delete",
    align: "center",
  },
  {
    name: "insuredId",
    label: "被保人 ID",
    field: "insuredId",
    align: "left",
  },
  {
    name: "policyNumbers",
    label: "保單號碼",
    field: "policyNumbers",
    align: "left",
  },
  {
    name: "result",
    label: "匯出結果",
    field: "result",
    align: "left",
  },
];

const insrType = ref("L");
const prodType = ref("AT");
const rows = ref([]);
const promptMessages = ref([]);
const nextRowId = ref(0);
const isExporting = ref(false);

/**
 * 將被保人 ID 正規化為後端查詢格式。
 *
 * @param {string} insuredId - 被保人 ID
 * @returns {string} 正規化後的被保人 ID
 */
const normalizeInsuredId = (insuredId) => insuredId.trim().toUpperCase();

/**
 * 新增一列待匯出的保單資料。
 *
 * @returns {void}
 */
const addRow = () => {
  nextRowId.value += 1;
  rows.value.push({
    id: nextRowId.value,
    insuredId: "",
    policyNumbers: "",
    result: "",
  });
};

/**
 * 刪除指定的保單資料列。
 *
 * @param {number} rowId - 資料列識別碼
 * @returns {void}
 */
const deleteRow = (rowId) => {
  rows.value = rows.value.filter((row) => row.id !== rowId);
};

/**
 * 清除指定資料列的舊匯出結果。
 *
 * @param {{ result: string }} row - 資料列
 * @returns {void}
 */
const clearRowResult = (row) => {
  row.result = "";
};

/**
 * 清除所有資料列的舊匯出結果。
 *
 * @returns {void}
 */
const clearExportResults = () => {
  rows.value.forEach(clearRowResult);
};

/**
 * 顯示資料檢核提示。
 *
 * @param {string} message - 提示訊息
 * @returns {void}
 */
const showValidationMessage = (message) => {
  $alert.info(message, "提示");
};

/**
 * 檢核匯出資料是否完整且被保人 ID 未重複。
 *
 * @returns {boolean} 是否通過檢核
 */
const validateRows = () => {
  if (rows.value.length === 0) {
    showValidationMessage("請至少新增一列資料");
    return false;
  }

  const insuredIdRowMap = new Map();
  for (let rowIndex = 0; rowIndex < rows.value.length; rowIndex += 1) {
    const row = rows.value[rowIndex];
    const insuredId = normalizeInsuredId(row.insuredId);
    const policyNumbers = row.policyNumbers.trim();

    if (!insuredId || !policyNumbers) {
      showValidationMessage(
        `第${rowIndex + 1}列的被保人 ID 或保單號碼不得為空值，若不需要請刪除該列`,
      );
      return false;
    }
    row.insuredId = insuredId;
    row.policyNumbers = policyNumbers;

    if (insuredIdRowMap.has(insuredId)) {
      showValidationMessage(
        `被保人 ID：${insuredId}有重複出現，請合併在同一列處理`,
      );
      return false;
    }
    insuredIdRowMap.set(insuredId, rowIndex);
  }

  return true;
};

/**
 * 將後端匯出結果回填至對應資料列。
 *
 * @param {Record<string, string>} resultMap - 以被保人 ID 為鍵的匯出結果
 * @returns {void}
 */
const applyExportResults = (resultMap = {}) => {
  if (!resultMap || typeof resultMap !== "object" || Array.isArray(resultMap)) {
    throw new TypeError("AFY10400 export result map must be an object.");
  }

  rows.value = rows.value.map((row) => ({
    ...row,
    result: resultMap[normalizeInsuredId(row.insuredId)] ?? "",
  }));
};

/**
 * 呼叫後端匯出資料並下載產製檔案。
 *
 * @returns {Promise<void>} 匯出完成
 */
const exportFile = async () => {
  if (!validateRows()) {
    return;
  }

  clearExportResults();
  const exportRows = rows.value.map((row) => ({ ...row }));
  const payload = {
    insrType: insrType.value,
    prodType: prodType.value,
    I_ID: exportRows.map((row) => row.insuredId),
    POLICY_NO: exportRows.map((row) => row.policyNumbers),
  };

  isExporting.value = true;
  try {
    const response = await $cathayAxios.post(afy10400Service.exportFile, payload);
    if (response.returnCode !== 0) {
      return;
    }

    const responseData = response.data;
    if (!responseData || typeof responseData !== "object") {
      throw new TypeError("AFY10400 export response data must be an object.");
    }

    applyExportResults(responseData.rtnMap);
    if (!responseData.fileName) {
      throw new TypeError("AFY10400 export response must include fileName.");
    }

    await $cathayAxios.download(
      afy10400Service.download,
      { fileName: responseData.fileName },
      responseData.fileName,
    );
  } finally {
    isExporting.value = false;
  }
};

/**
 * 載入頁面提示訊息。
 *
 * @returns {Promise<void>} 載入完成
 */
const loadPromptMessages = async () => {
  const response = await $cathayAxios.post(afy10400Service.prompt, {});
  if (response.returnCode !== 0) {
    return;
  }

  const messages = response.data?.msgs;
  if (messages !== undefined && !Array.isArray(messages)) {
    throw new TypeError("AFY10400 prompt messages must be an array.");
  }
  promptMessages.value = messages ?? [];
};

onMounted(loadPromptMessages);
</script>
