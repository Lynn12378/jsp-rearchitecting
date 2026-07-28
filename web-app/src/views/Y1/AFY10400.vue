<template>
  <!--
  ------頁面資訊------
      - 模組代碼: Y1
      - 功能代碼: AFY10400
      - 頁面主標題: 公會通報下傳作業
      - 頁面副標題: 公會補通報作業
      - 功能規格:
          - 動態新增/刪除被保人ID與保單號碼查詢列
          - 依收承方式、商品屬性與各列被保人ID/保單號碼，匯出對應資料檔案
          - 匯出前逐列檢核必填與被保人ID重複
      - 詳細頁面規格書: .github/skills/jsp-to-vue/references/specs/page-specs/AFY10400.md
   -->
  <!-- 麵包屑 + 頁面標題 -->
  <CxlBreadcrumbs
    class="q-mb-md"
    :breadcrumbs="navCollection"
    :routerPath="$route.path"
    :rootPath="rootPath"
  />
  <div class="cxl-title-h1 q-mb-md">公會通報下傳作業</div>

  <!-- 提示文字與條件列 -->
  <q-markup-table class="cxl-table cxl-table-horizontal q-mb-md" square flat bordered>
    <tbody>
      <tr>
        <td colspan="4">
          <div>1、此畫面請用<span class="cxl-text-danger">Google Chrome</span>使用</div>
          <div>2、收承方式、商品屬性，每次只能針對其中一種組合進行下載，若有多種組合下載，需分多次匯出處理</div>
          <div>3、同一ID查詢多筆保單時，請在保單號碼欄位，輸入多筆且用<span class="cxl-text-danger">Enter</span>來分格</div>
        </td>
      </tr>
      <tr>
        <th scope="row">收承方式</th>
        <td>
          <CxlDropdown v-model="insrType" :options="insrTypeOptions" map-options emit-value />
        </td>
        <th scope="row">商品屬性</th>
        <td>
          <CxlDropdown v-model="prodType" :options="prodTypeOptions" map-options emit-value />
        </td>
      </tr>
    </tbody>
  </q-markup-table>

  <!-- 明細資料列(可動態新增/刪除) -->
  <div class="row justify-end q-mb-sm">
    <CxlButton id="addBtn" label="新增一列" @click="doAdd" />
  </div>
  <q-markup-table class="cxl-table cxl-table-horizontal q-mb-md" square flat bordered>
    <thead>
      <tr>
        <th scope="col">刪除</th>
        <th scope="col"><span class="cxl-text-danger">*</span>被保人ID</th>
        <th scope="col"><span class="cxl-text-danger">*</span>保單號碼</th>
        <th scope="col">匯出結果</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.key">
        <td class="text-center">
          <CxlButton
            :id="`deleteBtn_${row.key}`"
            label="刪除此列"
            theme="danger-outline"
            size="sm"
            @click="doDelete(row.key)"
          />
        </td>
        <td>
          <CxlInput v-model="row.iId" maxlength="10" />
        </td>
        <td>
          <CxlTextarea v-model="row.policyNo" :rows="3" />
        </td>
        <td class="text-center">{{ row.exportResult }}</td>
      </tr>
    </tbody>
  </q-markup-table>

  <!-- 匯出區 -->
  <div class="row justify-center q-mb-md">
    <CxlButton id="exportBtn" label="匯出檔案" @click="doExport" />
  </div>
</template>

<script setup>
// 1. import statements
import { ref, inject } from "vue";
import { useRoute } from "vue-router";
import { CxlBreadcrumbs, CxlDropdown, CxlInput, CxlTextarea, CxlButton } from "vue-cathaylife-component";
import navCollection from "@/service/NavCollection.js";
import afy10400Service from "@/service/AFY10400Service.js";

// 2. defineProps, defineEmits, defineExpose
// (無)

const $route = useRoute();
const rootPath = { label: "首頁", url: "/" };
const $cathayAxios = inject("$cathayAxios");
const $notify = inject("$notify");

// 3. ref, reactive
const insrTypeOptions = [
  { label: "承保", value: "L" },
  { label: "收件", value: "R" },
];
const prodTypeOptions = [
  { label: "個險", value: "AT" },
  { label: "團險", value: "BG" },
  { label: "意外險", value: "CB" },
];

const insrType = ref("L");
const prodType = ref("AT");

// 明細資料列(對應來源 JSP table1 之動態列)
const rows = ref([]);
let uniqueNum = 0;

// 4-5. Validation Objects and methods / schema, useForm, useField
// (無，doExport 內採手動逐列檢核，非表單欄位層級驗證)

// 6. computed, watch, onMounted, onUnmounted, onUpdated
// (無)

// 7. event handlers

/**
 * 新增一筆明細資料列(page 內部業務邏輯，非外部介面)
 */
const doAdd = () => {
  uniqueNum += 1;
  rows.value.push({
    key: uniqueNum,
    iId: "",
    policyNo: "",
    exportResult: "",
  });
};

/**
 * 刪除指定明細資料列(page 內部業務邏輯，非外部介面)
 * @param {number} key - 欲刪除資料列的唯一序號
 */
const doDelete = (key) => {
  rows.value = rows.value.filter((row) => row.key !== key);
};

/**
 * 匯出檔案：逐列檢核必填與被保人ID重複，通過後送出匯出請求並觸發下載
 */
const doExport = async () => {
  for (let i = 0; i < rows.value.length; i++) {
    const row = rows.value[i];
    if (row.iId.trim() === "" || row.policyNo.trim() === "") {
      $notify.warning(`第${i + 1}列的被保人ID或保單號碼不得為空值，若不需要請刪除該列`);
      return;
    }
    for (let j = i + 1; j < rows.value.length; j++) {
      if (row.iId === rows.value[j].iId) {
        $notify.warning(`被保人ID：${row.iId}有重覆出現，請合併在同一列處理`);
        return;
      }
    }
  }

  await exportFile();
};

// 8. API calls methods（need JSDoc）

/**
 * 匯出(Remote Call Interface - export)：送出各列被保人ID/保單號碼，取得匯出結果對照表與檔案名稱後觸發下載
 */
const exportFile = async () => {
  const resp = await $cathayAxios.post(afy10400Service.export, {
    insrType: insrType.value,
    prodType: prodType.value,
    table1_I_ID: rows.value.map((row) => row.iId),
    table1_POLICY_NOs: rows.value.map((row) => row.policyNo),
  });

  if (resp.returnCode !== 0) {
    return;
  }

  const rtnMap = resp.data?.rtnMap || {};
  rows.value.forEach((row) => {
    if (rtnMap[row.iId] !== undefined) {
      row.exportResult = rtnMap[row.iId];
    }
  });

  await downloadFile(resp.data.fileName);
};

/**
 * 下載(Remote Call Interface - download)
 * @param {string} fileName - 匯出檔案名稱
 */
const downloadFile = async (fileName) => {
  await $cathayAxios.download(afy10400Service.download, { fileName }, fileName);
};

// 9. Other methods
// (無)
</script>
