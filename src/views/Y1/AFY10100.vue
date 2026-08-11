<template>
  <div class="afy10100">
    <header class="afy10100__header subTitle">
      <span class="afy10100__header-dot">●</span>
      <span>公會通報查詢</span>
      <span class="afy10100__screen-id">畫面編號：AFY10100</span>
    </header>

    <section class="afy10100__section tbBox2">
      <h2 class="afy10100__section-title">公會通報查詢</h2>
      <q-markup-table dense bordered class="afy10100__table">
        <tbody>
          <tr>
            <td class="tbYellow afy10100__label">身份證字號/統一編號</td>
            <td class="tbYellow2">
              <div class="afy10100__id-field">
                <q-input
                  v-model="inputId"
                  dense
                  outlined
                  :error="!!errors.inputId"
                  :error-message="errors.inputId"
                />
                <q-checkbox
                  v-if="canReturn"
                  v-model="syncReturn"
                  dense
                  label="同步更新公會回檔狀態"
                />
              </div>
            </td>
            <td class="tbYellow afy10100__label">契約角色</td>
            <td class="tbYellow2">
              <q-select
                v-model="role"
                dense
                outlined
                emit-value
                map-options
                :options="ROLE_OPTIONS"
              />
            </td>
            <td class="tbYellow afy10100__label">保單效力</td>
            <td class="tbYellow2">
              <q-select
                v-model="status"
                dense
                outlined
                emit-value
                map-options
                :options="STATUS_OPTIONS"
              />
            </td>
            <td class="tbYellow2 afy10100__action-cell" rowspan="2">
              <q-btn dense label="F2查詢" @click="query" />
            </td>
          </tr>
          <tr>
            <td class="tbYellow afy10100__label">姓名</td>
            <td class="tbYellow2">{{ dataMap.NAME }}</td>
            <td class="tbYellow afy10100__label">生日</td>
            <td class="tbYellow2">{{ dataMap.BIRTHDAY }}</td>
            <td class="tbYellow afy10100__label">公會資料取回日期</td>
            <td class="tbYellow2">{{ dataMap.LAST_UPDATE_TIME }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>

    <section class="afy10100__section">
      <h2 class="afy10100__section-title">保障項目彙整</h2>
      <q-markup-table dense bordered class="afy10100__table afy10100__summary-table">
        <thead>
          <tr>
            <template v-for="group in BENEFIT_HEADER_GROUPS" :key="group">
              <th class="tbBlue2">項目</th>
              <th class="tbBlue">合計</th>
              <th class="tbBlue">同業合計</th>
              <th class="tbBlue">收件</th>
              <th class="tbBlue">承保</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="benefitRow in BENEFIT_ROWS" :key="benefitRow[0].key">
            <template v-for="benefit in benefitRow" :key="benefit.key">
              <td class="tbBlue2">{{ benefit.label }}</td>
              <td class="tbYellow2">{{ formatNumber(dataMap[`${benefit.key}_Tot`]) }}</td>
              <td class="tbYellow2">{{ formatNumber(dataMap[`${benefit.key}_TotSame`]) }}</td>
              <td class="tbYellow2">{{ formatNumber(dataMap[`${benefit.key}_Rr`]) }}</td>
              <td class="tbYellow2">{{ formatNumber(dataMap[`${benefit.key}_LN`]) }}</td>
            </template>
          </tr>
        </tbody>
      </q-markup-table>
    </section>

    <section class="afy10100__section">
      <h2 class="afy10100__section-title">保費資料彙整</h2>
      <q-markup-table dense bordered class="afy10100__table afy10100__summary-table">
        <thead>
          <tr>
            <template v-for="premium in PREMIUM_ITEMS" :key="premium.key">
              <th class="tbBlue2">項目</th>
              <th class="tbBlue">合計</th>
              <th class="tbBlue">收件</th>
              <th class="tbBlue">承保</th>
            </template>
            <th class="tbBlue">操作者</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <template v-for="premium in PREMIUM_ITEMS" :key="premium.key">
              <td class="tbBlue2">{{ premium.label }}</td>
              <td class="tbYellow2">{{ formatNumber(dataMap[`${premium.key}_Tot`]) }}</td>
              <td class="tbYellow2">{{ formatNumber(dataMap[`${premium.key}_Rr`]) }}</td>
              <td class="tbYellow2">{{ formatNumber(dataMap[`${premium.key}_LN`]) }}</td>
            </template>
            <td class="tbYellow2">{{ dataMap.UPDATE_ID }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>

    <section v-if="selectedRow" class="afy10100__section">
      <h2 class="afy10100__section-title">資料編輯區</h2>
      <q-markup-table dense bordered class="afy10100__table afy10100__editor-table">
        <tbody>
          <tr v-for="editRow in EDIT_ROWS" :key="editRow[0].rowKey">
            <template v-for="field in editRow" :key="field.key">
              <td v-if="field.kind === 'empty'" class="tbYellow"></td>
              <td v-else class="tbYellow afy10100__editor-label">{{ field.label }}</td>

              <td v-if="field.kind === 'empty'" class="tbYellow2"></td>
              <td v-else class="tbYellow2">
                <q-input
                  v-if="field.kind === 'input'"
                  v-model="editValues[field.key]"
                  dense
                  outlined
                />
                <q-select
                  v-else-if="field.kind === 'gender'"
                  v-model="editValues[field.key]"
                  dense
                  outlined
                  emit-value
                  map-options
                  :options="GENDER_OPTIONS"
                />
                <q-select
                  v-else-if="field.kind === 'payType'"
                  v-model="editValues[field.key]"
                  dense
                  outlined
                  emit-value
                  map-options
                  :options="PAY_TYPE_OPTIONS"
                />
                <span v-else>{{ displayEditorValue(field.key) }}</span>
              </td>
            </template>
          </tr>
          <tr>
            <td class="tbYellow2 afy10100__editor-actions" colspan="10">
              <q-btn dense label="F9修改" @click="edit" />
              <q-btn dense label="F10刪除" @click="remove" />
              <q-btn dense label="取消" @click="cleanEditor" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>

    <section class="afy10100__section">
      <h2 class="afy10100__section-title">新制通報資料明細</h2>
      <q-markup-table dense bordered class="afy10100__table afy10100__detail-table">
        <thead>
          <tr>
            <th class="tbBlue">序號</th>
            <th class="tbBlue">選取</th>
            <th class="tbBlue">
              <button class="afy10100__sort-button" type="button" @click="sortRows('INSR_TYPE')">
                通報方式<span>{{ sortIndicator("INSR_TYPE") }}</span>
              </button>
            </th>
            <th class="tbBlue">
              <button class="afy10100__sort-button" type="button" @click="sortRows('COMPANY_NAME')">
                公司別<span>{{ sortIndicator("COMPANY_NAME") }}</span>
              </button>
            </th>
            <th class="tbBlue">
              <button class="afy10100__sort-button" type="button" @click="sortRows('POLICY_NO')">
                保單號碼<span>{{ sortIndicator("POLICY_NO") }}</span>
              </button>
            </th>
            <th class="tbBlue">銷售通路</th>
            <th class="tbBlue">商品代碼</th>
            <th class="tbBlue">保單分類</th>
            <th class="tbBlue">險種分類</th>
            <th class="tbBlue">
              <button class="afy10100__sort-button" type="button" @click="sortRows('PROD_KIND')">
                險種<span>{{ sortIndicator("PROD_KIND") }}</span>
              </button>
            </th>
            <th class="tbBlue">保單狀況</th>
            <th class="tbBlue">身故保額</th>
            <th class="tbBlue">醫療限額</th>
            <th class="tbBlue">醫療日額</th>
            <th class="tbBlue">
              <button class="afy10100__sort-button" type="button" @click="sortRows('ISSUE_DATE')">
                契約生效日<span>{{ sortIndicator("ISSUE_DATE") }}</span>
              </button>
            </th>
            <th class="tbBlue">契約滿期日</th>
            <th class="tbBlue">要保人姓名</th>
            <th class="tbBlue">通報時間</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in resultRows" :key="row.__rowKey">
            <td class="tbYellow2">{{ Number(row.__itemValue) + 1 }}</td>
            <td class="tbYellow2">
              <q-radio
                v-model="selectedRowKey"
                dense
                :val="row.__rowKey"
                @update:model-value="selectRow(row)"
              />
            </td>
            <td class="tbYellow2">
              <button class="afy10100__detail-button" type="button" @click="openDetail(row)">
                {{ row.INSR_TYPE }}&nbsp;{{ insrMap[row.INSR_TYPE] }}
              </button>
            </td>
            <td class="tbYellow2">{{ row.COMPANY_NAME }}</td>
            <td class="tbYellow2">{{ row.POLICY_NO }}</td>
            <td class="tbYellow2">{{ row.SALE_CHNL }}</td>
            <td class="tbYellow2">{{ row.PROD_CODE }}</td>
            <td class="tbYellow2">{{ row.POLICY_CAT }}</td>
            <td class="tbYellow2">{{ row.POLICY_DUTY }}</td>
            <td class="tbYellow2">{{ row.PROD_KIND }}</td>
            <td class="tbYellow2">{{ row.STATUS }}</td>
            <td class="tbYellow2">{{ formatNumber(row.PAY_AMT1) }}</td>
            <td class="tbYellow2">{{ formatNumber(row.PAY_AMT6) }}</td>
            <td class="tbYellow2">{{ formatNumber(row.PAY_AMT8) }}</td>
            <td class="tbYellow2">{{ row.ISSUE_DATE }}</td>
            <td class="tbYellow2">{{ row.LPS_DATE }}</td>
            <td class="tbYellow2">{{ row.A_NAME }}</td>
            <td class="tbYellow2">{{ row.UPDATE_TIME }}</td>
          </tr>
          <tr v-if="isAllow">
            <td class="tbYellow2 afy10100__async-action" colspan="18">
              <q-btn dense label="F8即時取回公會資料" @click="checkBeforeAsync" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>

    <section class="afy10100__section">
      <q-markup-table dense bordered class="afy10100__table">
        <tbody>
          <tr v-for="note in NOTES" :key="note">
            <td class="tbYellow3">{{ note }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>

    <q-dialog v-model="showDetail">
      <q-card>
        <q-card-section>
          <!-- TODO: PENDING_CONVERSION: AFY10100ShowDetail -->
          <!-- <AFY10100ShowDetail v-bind="detailParams" /> -->
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useQuasar } from "quasar";
import { useField, useForm } from "vee-validate";
import { object, string } from "yup";

const $cathayAxios = inject("$cathayAxios");
const $q = useQuasar();

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
const BENEFIT_HEADER_GROUPS = ["benefit-a", "benefit-b", "benefit-c"];
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
  { key: "PAY_AMT12", label: "重大疾/傷病" },
  { key: "PAY_AMT13", label: "重大傷燙傷" },
  { key: "PAY_AMT14", label: "癌症療養" },
  { key: "PAY_AMT15", label: "出院療養" },
  { key: "PAY_AMT16", label: "喪失工作能力" },
  { key: "PAY_AMT17", label: "喪葬費用" },
  { key: "PAY_AMT18", label: "銜接原醫療限額之自負額" },
  { key: "PAY_AMT19", label: "分期給付" },
  { key: "EMPTY_BENEFIT_1", label: "" },
  { key: "EMPTY_BENEFIT_2", label: "" },
];
const BENEFIT_ROWS = Array.from(
  { length: BENEFIT_ITEMS.length / 3 },
  (_, rowIndex) => BENEFIT_ITEMS.slice(rowIndex * 3, rowIndex * 3 + 3),
);
const PREMIUM_ITEMS = [
  { key: "YEAR_PREM", label: "年繳保費" },
  { key: "ONCE_PREM", label: "躉繳保費" },
  { key: "FLEX_PREM", label: "超額(彈性)保險費" },
];
const EDIT_ROWS = [
  [
    { key: "INSR_TYPE", label: "通報方式", kind: "text", rowKey: "edit-row-1" },
    { key: "CMNY_CODE", label: "公司別", kind: "text" },
    { key: "I_ID", label: "被保人ID", kind: "text" },
    { key: "I_BIRTHDAY", label: "被保人生日", kind: "text" },
    { key: "POLICY_NO", label: "保單號碼", kind: "text" },
  ],
  [
    { key: "POLICY_CAT", label: "保單分類", kind: "text", rowKey: "edit-row-2" },
    { key: "POLICY_DUTY", label: "險種分類", kind: "text" },
    { key: "PROD_KIND", label: "險種", kind: "text" },
    { key: "STATUS", label: "保單狀況", kind: "text" },
    { key: "LST_CHG_DATE", label: "保單狀況生效日期(受理理賠日、身故日)", kind: "text" },
  ],
  [
    { key: "MAIN_POLICY_NO", label: "主約保單號碼", kind: "text", rowKey: "edit-row-3" },
    { key: "ISSUE_DATE", label: "契約生效日", kind: "text" },
    { key: "ISSUE_TIME", label: "契約生效時分", kind: "text" },
    { key: "LPS_DATE", label: "契約滿期日", kind: "text" },
    { key: "LPS_TIME", label: "契約滿期時分", kind: "text" },
  ],
  [
    { key: "SIGN_DATE", label: "要保書填寫日", kind: "text", rowKey: "edit-row-4" },
    { key: "PREM", label: "保費", kind: "text" },
    { key: "PAY_FREQ", label: "保費繳別", kind: "text" },
    { key: "PAY_PERIOD", label: "保費繳費年期", kind: "text" },
    { key: "LST_CHG_TIME", label: "保單狀況生效時分", kind: "text" },
  ],
  [
    { key: "PAY_AMT1", label: "身故", kind: "input", rowKey: "edit-row-5" },
    { key: "PAY_AMT2", label: "完全失能或最高級失能", kind: "input" },
    { key: "PAY_AMT3", label: "失能扶助金", kind: "input" },
    { key: "PAY_AMT4", label: "特定事故", kind: "input" },
    { key: "PAY_AMT5", label: "初次罹患", kind: "input" },
  ],
  [
    { key: "PAY_AMT6", label: "醫療限額", kind: "input", rowKey: "edit-row-6" },
    { key: "PAY_AMT7", label: "醫療限額自負", kind: "input" },
    { key: "PAY_AMT8", label: "醫療日額", kind: "input" },
    { key: "PAY_AMT9", label: "住院手術", kind: "input" },
    { key: "PAY_AMT10", label: "門診手術", kind: "input" },
  ],
  [
    { key: "PAY_AMT11", label: "門診", kind: "input", rowKey: "edit-row-7" },
    { key: "PAY_AMT12", label: "重大疾/傷病", kind: "input" },
    { key: "PAY_AMT13", label: "重大燒燙傷", kind: "input" },
    { key: "PAY_AMT14", label: "癌症療養", kind: "input" },
    { key: "PAY_AMT15", label: "出院療養", kind: "input" },
  ],
  [
    { key: "PAY_AMT16", label: "喪失工作能力", kind: "input", rowKey: "edit-row-8" },
    { key: "PAY_AMT17", label: "喪葬費用", kind: "input" },
    { key: "PAY_AMT18", label: "銜接原醫療限額之自負額", kind: "input" },
    { key: "PAY_AMT19", label: "分期給付", kind: "input" },
    { key: "BROKTYPE", label: "保經代分類", kind: "input" },
  ],
  [
    { key: "A_NAME", label: "要保人姓名", kind: "input", rowKey: "edit-row-9" },
    { key: "A_ID", label: "要保人身分證號碼", kind: "input" },
    { key: "A_BIRTHDAY", label: "要保人出生日期", kind: "input" },
    { key: "RELATION", label: "要保人與被保險人關係", kind: "input" },
    { key: "UPDATE_TIME", label: "資料寫入時間", kind: "text" },
  ],
  [
    { key: "I_GENDER", label: "被保險人性別", kind: "gender", rowKey: "edit-row-10" },
    { key: "PAY_TYPE", label: "公、自費件", kind: "payType" },
    { key: "OIU_IND", label: "來源別", kind: "text" },
    { key: "SALE_CHNL", label: "銷售通路", kind: "text" },
    { key: "PROD_CODE", label: "商品代碼", kind: "text" },
  ],
  [
    { key: "SER_NO", label: "公會取回序號", kind: "text", rowKey: "edit-row-11" },
    { key: "EMPTY_EDIT_1", label: "", kind: "empty" },
    { key: "EMPTY_EDIT_2", label: "", kind: "empty" },
    { key: "EMPTY_EDIT_3", label: "", kind: "empty" },
    { key: "EMPTY_EDIT_4", label: "", kind: "empty" },
  ],
];
const EDITOR_KEYS = [
  "TBL_NAME",
  "INSR_TYPE",
  "CMNY_CODE",
  "I_ID",
  "I_BIRTHDAY",
  "POLICY_NO",
  "POLICY_CAT",
  "POLICY_DUTY",
  "PROD_KIND",
  "STATUS",
  "LST_CHG_DATE",
  "MAIN_POLICY_NO",
  "ISSUE_DATE",
  "ISSUE_TIME",
  "LPS_DATE",
  "LPS_TIME",
  "SIGN_DATE",
  "PREM",
  "PAY_FREQ",
  "PAY_PERIOD",
  "LST_CHG_TIME",
  ...Array.from({ length: 19 }, (_, index) => `PAY_AMT${index + 1}`),
  "BROKTYPE",
  "A_NAME",
  "A_ID",
  "A_BIRTHDAY",
  "RELATION",
  "UPDATE_TIME",
  "SER_NO",
  "I_GENDER",
  "PAY_TYPE",
];
const DETAIL_KEYS = [
  "INSR_TYPE",
  "CMNY_CODE",
  "I_ID",
  "I_BIRTHDAY",
  "POLICY_NO",
  "POLICY_CAT",
  "POLICY_DUTY",
  "PROD_KIND",
  "STATUS",
  "LST_CHG_DATE",
  "MAIN_POLICY_NO",
  "ISSUE_DATE",
  "ISSUE_TIME",
  "LPS_DATE",
  "LPS_TIME",
  "SIGN_DATE",
  "PREM",
  "PAY_FREQ",
  "PAY_PERIOD",
  "LST_CHG_TIME",
  ...Array.from({ length: 19 }, (_, index) => `PAY_AMT${index + 1}`),
  "BROKTYPE",
  "A_NAME",
  "A_ID",
  "A_BIRTHDAY",
  "RELATION",
  "UPDATE_TIME",
  "SER_NO",
  "I_GENDER",
  "PAY_TYPE",
  "OIU_IND",
  "SALE_CHNL",
  "PROD_CODE",
];
const NOTES = [
  "1. 銷售通路:1網路投保 2業務員3保經、保代 4電話行銷 5機場櫃檯",
  "2. 保單分類：1個人；2團體",
  "3. 險種分類：1人壽保險；2傷害保險；3健康保險 4.年金保險。",
  "4. 險種：01一般；02特定；03投資型；04日額型；05實支實付型；06日額或實支實付擇一型；07手術型；08重大疾病；09帳戶型；10長期看護型；11喪失工作能力；12防癌；13旅平險；14微型；15微型實支實付；16小額終老保險；17.失能扶助保險；18.登山綜合保險；19定期人壽保險(不含一年期)；20海域活動綜合保險；21一年期",
  "5. 繳別：1躉繳；2年繳；3半年繳；4季繳；5月繳；6彈性繳；9繳費期滿",
  "6. 保單狀況：收件: 01有效；06未承保取消件；07契約註銷；11滿期(契約到期)；12鍵值欄位通報錯誤終止；15通報更正；50一○七條/一○七條之一承保資料；51一○七條理賠資料（未滿14足歲之未成年人）；52一○七條/一○七條之一理賠資料（精神障礙或其他心智缺陷/受監護宣告尚未撤銷）。承保: 01有效；02增額；03減額；04展期；05繳清；06契約撤銷；07停效；10解除契約；11滿期(契約到期)；12鍵值欄位通報錯誤終止；20終止1:由要保人提出終止契約效力；21終止2:主被保險人死亡，其他被保險人附同時終止或完全失能或理賠給付後終止附約；30被保險人因自然死身故；31被保險人因意外身故；32被保險人因其他原因故；50一○七條/一○七條之一承保資料；51一○七條理賠資料（未滿14足歲之未成年人）；52一○七條/一○七條之一理賠資料（精神障礙或其他心智缺陷/受監護宣告尚未撤銷）。",
  "7. 保障及保費彙整欄位，金額依頁面上的筆數加總，含本公司及產、壽險通報資料。",
  "8. 即時捉取公會資料：輸入身份證字號∕統一證號，按F8即時捉取公會資料鈕",
];
const NUMBER_FORMATTER = new Intl.NumberFormat("zh-TW", {
  maximumFractionDigits: 0,
});

const asyncSchema = object({
  inputId: string().required("身份證字號/統一編號：不得為空值"),
});
const { errors, setValues, validate } = useForm({
  validationSchema: asyncSchema,
  initialValues: { inputId: "" },
  validateOnMount: false,
});
const { value: inputId } = useField("inputId", undefined, {
  validateOnValueUpdate: false,
});

const role = ref("I");
const status = ref("Y");
const canReturn = ref(false);
const syncReturn = ref(false);
const isAllow = ref(false);
const dataMap = ref({});
const resultRows = ref([]);
const insrMap = ref({});
const oiuIndDesc = ref({});
const saleChnlDesc = ref({});
const selectedRowKey = ref("");
const showDetail = ref(false);
const detailParams = ref({});
const sortDirections = reactive({});
const editValues = reactive(
  Object.fromEntries(EDITOR_KEYS.map((key) => [key, ""])),
);
editValues.I_GENDER = "1";
editValues.PAY_TYPE = "0";

const selectedRow = computed(
  () => resultRows.value.find((row) => row.__rowKey === selectedRowKey.value) ?? null,
);

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "";
  return NUMBER_FORMATTER.format(value);
};

const resetEditorForPage = () => {
  EDITOR_KEYS.forEach((key) => {
    editValues[key] = "";
  });
  editValues.I_GENDER = "1";
  editValues.PAY_TYPE = "0";
  selectedRowKey.value = "";
};

const applyPageData = (pageData) => {
  setValues({ inputId: pageData.inputId ?? "" });
  role.value = pageData.role ?? "I";
  status.value = pageData.status ?? "Y";
  canReturn.value = pageData.isReturn === true || pageData.isReturn === "true";
  syncReturn.value = false;
  isAllow.value = pageData.isAllow === true || pageData.isAllow === "true";
  dataMap.value = pageData.dataMap ?? {};
  insrMap.value = pageData.INSRMAP ?? {};
  oiuIndDesc.value = pageData.oiuIndDesc ?? {};
  saleChnlDesc.value = pageData.saleChnlDesc ?? {};
  resultRows.value = (pageData.resultList ?? []).map((row, index) => ({
    ...row,
    __itemValue: String(index),
    __rowKey: `${row.TBL_NAME ?? ""}-${row.SER_NO ?? ""}-${row.POLICY_NO ?? ""}-${index}`,
  }));
  resetEditorForPage();
  editValues.I_GENDER = pageData.I_GENDER ?? "1";
  editValues.PAY_TYPE = pageData.PAY_TYPE ?? "0";
};

const buildFormRequest = () => {
  const request = {
    inputId: inputId.value,
    role: role.value,
    status: status.value,
    ...Object.fromEntries(EDITOR_KEYS.map((key) => [key, editValues[key]])),
  };
  if (canReturn.value && syncReturn.value) request.IS_RETURN = "Y";
  if (selectedRow.value) request.item = selectedRow.value.__itemValue;
  return request;
};

const submitPageAction = async (action) => {
  const res = await $cathayAxios.post(`afy10100/${action}`, buildFormRequest());
  if (res.returnCode !== 0) return;
  applyPageData(res.data);
};

const query = async () => {
  await submitPageAction("query");
};

const edit = async () => {
  await submitPageAction("edit");
};

const remove = async () => {
  await submitPageAction("delete");
};

const runAsync = async () => {
  await submitPageAction("async");
};

const checkBeforeAsync = async () => {
  const { valid } = await validate({ schema: asyncSchema });
  if (!valid) return;

  const res = await $cathayAxios.post("afy10100/asynccheckid", {
    inputId: inputId.value,
  });
  if (res.returnCode !== 0) return;

  if (res.data.isIdError === "Y") {
    $q.dialog({
      title: "確認",
      message: `輸入值 ${inputId.value} 不符身份證/統一證號檢核規則，請確認，是否要繼續作業?`,
      cancel: true,
    }).onOk(runAsync);
    return;
  }
  await runAsync();
};

const selectRow = (row) => {
  selectedRowKey.value = row.__rowKey;
  EDITOR_KEYS.forEach((key) => {
    editValues[key] = row[key] ?? "";
  });
  // TODO: UNKNOWN_SYNTAX: parseEUDC();
};

const cleanEditor = () => {
  EDITOR_KEYS.forEach((key) => {
    editValues[key] = "";
  });
  selectedRowKey.value = "";
};

const displayEditorValue = (key) => {
  if (key === "UPDATE_TIME") return selectedRow.value?.INPUT_TIME ?? "";
  if (key === "OIU_IND") return oiuIndDesc.value[selectedRow.value?.OIU_IND] ?? "";
  if (key === "SALE_CHNL") return saleChnlDesc.value[selectedRow.value?.SALE_CHNL] ?? "";
  if (key === "PROD_CODE") return selectedRow.value?.PROD_CODE ?? "";
  return editValues[key] ?? "";
};

const sortRows = (key) => {
  sortDirections[key] = sortDirections[key] !== "asc" ? "asc" : "desc";
  const direction = sortDirections[key] === "asc" ? 1 : -1;
  resultRows.value.sort((left, right) => {
    const leftValue = String(left[key] ?? "").toUpperCase();
    const rightValue = String(right[key] ?? "").toUpperCase();
    return leftValue.localeCompare(rightValue) * direction;
  });
};

const sortIndicator = (key) => (sortDirections[key] === "asc" ? "▲" : "▼");

const openDetail = (row) => {
  detailParams.value = Object.fromEntries(
    DETAIL_KEYS.map((key) => [key, row[key] ?? ""]),
  );
  showDetail.value = true;
};

const handleHotKey = (event) => {
  const actions = {
    F2: query,
    F8: isAllow.value ? checkBeforeAsync : null,
    F9: selectedRow.value ? edit : null,
    F10: selectedRow.value ? remove : null,
  };
  const action = actions[event.key];
  if (!action) return;
  event.preventDefault();
  action();
};

// TODO: OVER_APPROXIMATION: 待複查 JSP EL 注入資料是否全數來自後端
onMounted(async () => {
  window.addEventListener("keydown", handleHotKey);
  const res = await $cathayAxios.post("afy10100/prompt", {});
  if (res.returnCode !== 0) return;
  applyPageData(res.data);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleHotKey);
});

// TODO: TECHNICAL_GAP: 套用頁面資料保護控制
// TODO: TECHNICAL_GAP: 回報頁面回應時間
// TODO: TECHNICAL_GAP: 傳遞登入平台與系統資訊
// TODO: TECHNICAL_GAP: 套用 EUDC 字型
// TODO: TECHNICAL_GAP: 顯示作業結果通知
</script>

<style scoped>
.afy10100 {
  min-height: 100%;
  padding: 0 4px 16px;
  background-color: #f0fbc6;
}

.afy10100__header {
  position: sticky;
  top: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  min-height: 30px;
  padding: 2px 8px;
  background-color: #f0fbc6;
}

.afy10100__header-dot {
  margin-right: 8px;
  font-size: 8px;
}

.afy10100__screen-id {
  margin-left: auto;
}

.afy10100__section {
  width: 97%;
  margin: 8px auto 0;
}

.afy10100__section-title {
  margin: 0;
  padding: 4px 6px;
  font-size: 1rem;
  font-weight: 400;
}

.afy10100__table {
  width: 100%;
  table-layout: auto;
}

.afy10100__table th,
.afy10100__table td {
  padding: 4px;
  text-align: left;
  vertical-align: middle;
}

.afy10100__summary-table th,
.afy10100__summary-table td,
.afy10100__editor-table th,
.afy10100__editor-table td {
  text-align: center;
}

.afy10100__label {
  width: 8%;
}

.afy10100__id-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.afy10100__id-field .q-input {
  min-width: 220px;
}

.afy10100__action-cell,
.afy10100__async-action,
.afy10100__editor-actions {
  text-align: center;
}

.afy10100__editor-label {
  width: 10%;
}

.afy10100__editor-table td {
  width: 10%;
}

.afy10100__editor-actions .q-btn + .q-btn {
  margin-left: 8px;
}

.afy10100__detail-table {
  min-width: 1500px;
}

.afy10100__sort-button,
.afy10100__detail-button {
  padding: 0;
  border: 0;
  color: inherit;
  font: inherit;
  text-decoration: underline;
  background: transparent;
  cursor: pointer;
}

.afy10100__detail-table th,
.afy10100__detail-table td {
  text-align: center;
  white-space: nowrap;
}
</style>
