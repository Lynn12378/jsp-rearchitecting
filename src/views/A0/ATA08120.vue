<template>
  <div class="ata08120">
    <header class="ata08120__header subTitle">
      <span aria-hidden="true">●</span>
      <strong>公會通報設定</strong>
      <span class="ata08120__screen-id">畫面編號：ATA08120</span>
    </header>

    <section class="ata08120__content">
      <div class="ata08120__section-title tbBox2">公會通報設定</div>

      <q-markup-table class="ata08120__table tbBox2" dense bordered>
        <thead>
          <tr class="tbBlue">
            <th>契約來源中文</th>
            <th>契約來源</th>
            <th>連線等候時間(毫秒)</th>
            <th>資料等候時間(毫秒)</th>
            <th>作業開關</th>
            <th>公會連線方式</th>
            <th>WebService呼叫方法</th>
            <th>重試次數</th>
            <th>FTP登入帳號</th>
            <th>通報種類</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr class="tbYellow2">
            <td></td>
            <td>
              <q-input
                v-model="newSrc"
                dense
                outlined
                maxlength="6"
                :error="!!errors.newSrc"
                :error-message="errors.newSrc"
              />
            </td>
            <td>
              <q-input
                v-model="newTimeout"
                dense
                outlined
                :error="!!errors.newTimeout"
                :error-message="errors.newTimeout"
              />
            </td>
            <td>
              <q-input
                v-model="newDataTimeout"
                dense
                outlined
                :error="!!errors.newDataTimeout"
                :error-message="errors.newDataTimeout"
              />
            </td>
            <td>
              <q-select
                v-model="newIsEffective"
                dense
                outlined
                emit-value
                map-options
                :options="effectiveOptions"
              />
            </td>
            <td>
              <q-input
                v-model="newConnection"
                dense
                outlined
                maxlength="1"
                :error="!!errors.newConnection"
                :error-message="errors.newConnection"
                @update:model-value="newConnection = toUpperCase(newConnection)"
              />
            </td>
            <td>
              <q-select
                v-model="newAction"
                dense
                outlined
                emit-value
                map-options
                :options="actionOptions"
              />
            </td>
            <td>
              <q-input
                v-model="newRetry"
                dense
                outlined
                :error="!!errors.newRetry"
                :error-message="errors.newRetry"
              />
            </td>
            <td>
              <q-input
                v-model="newFtpHost"
                dense
                outlined
                maxlength="1"
                :error="!!errors.newFtpHost"
                :error-message="errors.newFtpHost"
              />
            </td>
            <td>
              <q-input v-model="newType" dense outlined maxlength="1" />
            </td>
            <td>
              <q-btn class="button" dense label="新增" @click="onInsert" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <q-markup-table class="ata08120__table ata08120__detail-table tbBox2" dense bordered>
        <thead>
          <tr class="tbBlue">
            <th>契約來源中文</th>
            <th>契約來源</th>
            <th>連線等候時間(毫秒)</th>
            <th>資料等候時間(毫秒)</th>
            <th>作業開關</th>
            <th>公會連線方式</th>
            <th>WebService呼叫方法</th>
            <th>重試次數</th>
            <th>FTP登入帳號</th>
            <th>通報種類</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="detail in details"
            :key="detail.src"
            class="tbYellow2"
          >
            <td>{{ detail.srcName }}</td>
            <td>{{ detail.src }}</td>
            <td>
              <q-input
                v-model="detail.timeout"
                dense
                outlined
                :error="!!errors[detailErrorPath(detail.src, 'timeout')]"
                :error-message="errors[detailErrorPath(detail.src, 'timeout')]"
              />
            </td>
            <td>
              <q-input
                v-model="detail.dataTimeout"
                dense
                outlined
                :error="!!errors[detailErrorPath(detail.src, 'dataTimeout')]"
                :error-message="errors[detailErrorPath(detail.src, 'dataTimeout')]"
              />
            </td>
            <td>
              <q-select
                v-model="detail.isEffective"
                dense
                outlined
                emit-value
                map-options
                :options="effectiveOptions"
              />
            </td>
            <td>
              <q-input
                v-model="detail.connection"
                dense
                outlined
                maxlength="1"
                :error="!!errors[detailErrorPath(detail.src, 'connection')]"
                :error-message="errors[detailErrorPath(detail.src, 'connection')]"
                @update:model-value="detail.connection = toUpperCase(detail.connection)"
              />
            </td>
            <td>
              <q-select
                v-model="detail.action"
                dense
                outlined
                emit-value
                map-options
                :options="actionOptions"
              />
            </td>
            <td>
              <q-input
                v-model="detail.retry"
                dense
                outlined
                :error="!!errors[detailErrorPath(detail.src, 'retry')]"
                :error-message="errors[detailErrorPath(detail.src, 'retry')]"
              />
            </td>
            <td>
              <q-input
                v-model="detail.ftpHost"
                dense
                outlined
                maxlength="1"
                :error="!!errors[detailErrorPath(detail.src, 'ftpHost')]"
                :error-message="errors[detailErrorPath(detail.src, 'ftpHost')]"
              />
            </td>
            <td>
              <q-input v-model="detail.type" dense outlined maxlength="1" />
            </td>
            <td>
              <div class="ata08120__actions">
                <q-btn class="button" dense label="刪除" @click="onDelete(detail.src)" />
                <q-btn class="button" dense label="修改" @click="onUpdate(detail.src)" />
              </div>
            </td>
          </tr>
        </tbody>
      </q-markup-table>

      <div class="ata08120__instructions">
        <div>※使用說明:</div>
        <div>1. 通報種類: R=收件，L=承保 (如果是取回作業，這個欄位不會使用)</div>
        <div>2. 公會連線方式: W=Webservice，V=VPN</div>
        <div>3. FTP登入帳號: 1=網路投保，2=批次</div>
        <div>4. 作業開關(正式環境請小心使用): Y-&gt;開，N-&gt;關(代表直接pass該項公會作業)</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { useForm, useField } from "vee-validate";
import { array, lazy, mixed, object, string } from "yup";
import { useQuasar } from "quasar";

const $cathayAxios = inject("$cathayAxios");
const $q = useQuasar();

const EMPTY_VALUES = {
  newSrc: "",
  newTimeout: "",
  newDataTimeout: "",
  newIsEffective: "Y",
  newConnection: "",
  newAction: "",
  newRetry: "",
  newFtpHost: "",
  newType: "",
  details: [],
};

const requiredText = {
  name: "requiredText",
  message: "此欄位必須輸入",
  test: (value) => Boolean(value?.trim()),
};
const numericText = (message) => ({
  name: "numericText",
  message,
  test: (value) => value === undefined || value === null || value === "" || !Number.isNaN(Number(value)),
});

const requiredNumericField = (requiredMessage, numericMessage) =>
  string()
    .test({ ...requiredText, message: requiredMessage })
    .test(numericText(numericMessage));
const requiredOnlyField = (requiredMessage) =>
  string().test({ ...requiredText, message: requiredMessage });

const insertSchema = object({
  newSrc: requiredOnlyField("契約來源必須輸入"),
  newTimeout: requiredNumericField("連線等候時間必須輸入", "連線等候時間必須輸入數字"),
  newDataTimeout: requiredNumericField("資料等候時間必須輸入", "資料等候時間必須輸入數字"),
  newConnection: requiredOnlyField("公會連線方式必須輸入"),
  newRetry: requiredNumericField("重試次數必須輸入", "重試次數必須輸入數字"),
  newFtpHost: requiredOnlyField("FTP登入帳號必須輸入"),
});

const updateDetailSchema = object({
  timeout: requiredNumericField("連線等待時間必須輸入", "連線等待時間必須輸入數字"),
  dataTimeout: requiredNumericField("資料等待時間必須輸入", "資料等待時間必須輸入數字"),
  connection: requiredOnlyField("公會通報方式必須輸入"),
  retry: requiredNumericField("重試次數必須輸入", "重試次數必須輸入數字"),
  ftpHost: requiredOnlyField("FTP登入帳號必須輸入"),
});

const updateSchema = (detailIndex) =>
  object({
    details: array().of(
      lazy((_value, options) =>
        options.path === `details[${detailIndex}]` ? updateDetailSchema : mixed(),
      ),
    ),
  });

const { errors, setValues, validate } = useForm({
  validationSchema: insertSchema,
  initialValues: EMPTY_VALUES,
  validateOnMount: false,
});
const { value: newSrc } = useField("newSrc");
const { value: newTimeout } = useField("newTimeout");
const { value: newDataTimeout } = useField("newDataTimeout");
const { value: newIsEffective } = useField("newIsEffective");
const { value: newConnection } = useField("newConnection");
const { value: newAction } = useField("newAction");
const { value: newRetry } = useField("newRetry");
const { value: newFtpHost } = useField("newFtpHost");
const { value: newType } = useField("newType");
const { value: details } = useField("details");

const actionOptions = ref([]);
const effectiveOptions = [
  { label: "Y", value: "Y" },
  { label: "N", value: "N" },
];

const toUpperCase = (value) => value?.toUpperCase() ?? "";

const findDetailIndex = (src) => details.value.findIndex((detail) => detail.src === src);

const detailErrorPath = (src, field) => {
  const detailIndex = findDetailIndex(src);
  return `details[${detailIndex}].${field}`;
};

const buildRequest = (index = "") => ({
  SRC_NEW: newSrc.value,
  TIMEOUT_NEW: newTimeout.value,
  DATA_TIMEOUT_NEW: newDataTimeout.value,
  IS_EFFECTIVE_NEW: newIsEffective.value,
  CONNECTION_NEW: newConnection.value,
  ACTION_NEW: newAction.value,
  RETRY_NEW: newRetry.value,
  FTP_HOST_NEW: newFtpHost.value,
  TYPE_NEW: newType.value,
  SRC: details.value.map((detail) => detail.src),
  TIMEOUT: details.value.map((detail) => detail.timeout),
  DATA_TIMEOUT: details.value.map((detail) => detail.dataTimeout),
  IS_EFFECTIVE: details.value.map((detail) => detail.isEffective),
  CONNECTION: details.value.map((detail) => detail.connection),
  ACTION: details.value.map((detail) => detail.action),
  RETRY: details.value.map((detail) => detail.retry),
  FTP_HOST: details.value.map((detail) => detail.ftpHost),
  TYPE: details.value.map((detail) => detail.type),
  index,
});

const fetchPageData = async () => {
  const res = await $cathayAxios.post("ata08120/prompt", {});
  if (res.returnCode !== 0) {
    setValues(EMPTY_VALUES);
    actionOptions.value = [];
    return;
  }

  setValues({
    ...EMPTY_VALUES,
    details: res.data.details,
  });
  actionOptions.value = res.data.actionOptions;
};

const notifySuccess = (message) => {
  $q.notify({ type: "positive", message });
};

const confirmAction = (message) =>
  new Promise((resolve) => {
    $q.dialog({
      message,
      cancel: true,
      persistent: true,
    })
      .onOk(() => resolve(true))
      .onCancel(() => resolve(false));
  });

const onInsert = async () => {
  const { valid } = await validate({ schema: insertSchema });
  if (!valid) return;

  newConnection.value = toUpperCase(newConnection.value);
  const res = await $cathayAxios.post("ata08120/insert", buildRequest());
  if (res.returnCode === 0) {
    notifySuccess("公會通報設定新增成功");
  }
  await fetchPageData();
};

const onDelete = async (src) => {
  const detailIndex = findDetailIndex(src);
  const agreed = await confirmAction("請確認是否要刪除?");
  if (!agreed) return;

  const res = await $cathayAxios.post("ata08120/delete", buildRequest(detailIndex));
  if (res.returnCode === 0) {
    notifySuccess("公會通報設定刪除成功");
  }
  await fetchPageData();
};

const onUpdate = async (src) => {
  const detailIndex = findDetailIndex(src);
  const { valid } = await validate({ schema: updateSchema(detailIndex) });
  if (!valid) return;

  const agreed = await confirmAction("請確認是否要修改?");
  if (!agreed) return;

  details.value[detailIndex].connection = toUpperCase(details.value[detailIndex].connection);
  const res = await $cathayAxios.post("ata08120/update", buildRequest(detailIndex));
  if (res.returnCode === 0) {
    notifySuccess("公會通報設定修改成功");
  }
  await fetchPageData();
};

onMounted(async () => {
  // TODO: OVER_APPROXIMATION: 待複查 DTAFY001_List 與 ACTION_Map 是否皆為伺服器端注入資料
  await fetchPageData();
});
</script>

<style scoped>
.ata08120 {
  position: relative;
  min-height: 100%;
  background-color: #f0fbc6;
}

.ata08120__header {
  position: absolute;
  z-index: 9;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: 20px 1fr auto;
  align-items: center;
  width: 100%;
  min-height: 30px;
  padding: 2px 8px;
  box-sizing: border-box;
}

.ata08120__screen-id {
  text-align: right;
}

.ata08120__content {
  padding: 30px 1.5% 12px;
}

.ata08120__section-title {
  padding: 5px;
}

.ata08120__table {
  width: 100%;
  table-layout: fixed;
}

.ata08120__table th,
.ata08120__table td {
  width: 10%;
  padding: 4px;
  text-align: center;
  vertical-align: middle;
  white-space: normal;
}

.ata08120__table th:first-child,
.ata08120__table td:first-child {
  width: 12%;
}

.ata08120__table th:nth-child(2),
.ata08120__table td:nth-child(2) {
  width: 8%;
}

.ata08120__detail-table {
  margin-top: 24px;
}

.ata08120__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.ata08120__instructions {
  margin-top: 8px;
}
</style>
