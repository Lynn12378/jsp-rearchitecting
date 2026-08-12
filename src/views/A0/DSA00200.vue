<template>
  <div class="dsa00200">
    <iframe
      class="dsa00200__viewer-frame"
      :src="iframeSrc || undefined"
      title="影像瀏覽器"
    ></iframe>

    <template v-if="showLegacyViewer">
      <!-- TODO: TECHNICAL_GAP: 以舊版 ActiveX 元件檢視案件影像 -->
      <!-- <LegacyImageViewer /> -->
    </template>

    <p class="dsa00200__response"></p>
  </div>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

const $cathayAxios = inject('$cathayAxios')

const pageData = reactive({
  isViewExe: '',
  isIframe: '',
  imageUrl: '',
  userId: '',
  userName: '',
  applyId: '',
  userUnit: '',
  formCode: '',
  fieldName: '',
  draftYn: '',
  loaded: false,
})
const iframeSrc = ref('')
const showLegacyViewer = computed(
  () => pageData.loaded && pageData.isViewExe !== 'Y',
)

let previousTitle = ''

const buildViewerParameters = () => ({
  Mode:
    pageData.fieldName === 'APPLY_IMAGE' ||
    pageData.fieldName === 'CHECKDATA_IMAGE'
      ? 'FieldView'
      : 'View',
  scantitle: '案件瀏覽',
  URL: pageData.imageUrl,
  Business: 'DP',
  UserID: pageData.userId,
  CName: pageData.userName,
  Key: pageData.applyId,
  EncString: pageData.applyId,
  UserCenter: pageData.userUnit,
  UserUnit: pageData.userUnit,
  FormCode: pageData.formCode,
  Field: pageData.fieldName,
  ViewTitle: '案件瀏覽',
  DraftYN: pageData.draftYn,
})

const buildViewerUrl = (parameters, timestamp) =>
  `https://localhost:9002/mps?appname=IMView&ver=1.0.0.0&&param=${encodeURI(
    JSON.stringify(parameters),
  )}&apptitle=${encodeURI(`瀏覽${pageData.applyId}`)}&closepre=Y&_=${timestamp}`

const openViewer = async () => {
  const parameters = buildViewerParameters()
  const timestamp = Date.now()

  if (pageData.isIframe === 'Y') {
    iframeSrc.value = buildViewerUrl(parameters, timestamp)
    return
  }

  const res = await $cathayAxios.post('dsa00200/view', {
    appName: 'IMView',
    version: '1.0.0.0',
    parameters,
    appTitle: `瀏覽${pageData.applyId}`,
    closePrevious: 'Y',
    timestamp,
  })
  if (res.returnCode !== 0) return

  window.close()
}

// TODO: OVER_APPROXIMATION: 待複查影像模式、影像服務 URL、使用者與案件參數是否皆只能由伺服器注入取得？
const loadPage = async () => {
  const res = await $cathayAxios.post('dsa00200/prompt', {})
  if (res.returnCode !== 0) return

  pageData.isViewExe = res.data.isViewExe
  pageData.isIframe = res.data.isIframe
  pageData.imageUrl = res.data.imageUrl
  pageData.userId = res.data.userId
  pageData.userName = res.data.userName
  pageData.applyId = res.data.applyId
  pageData.userUnit = res.data.userUnit
  pageData.formCode = res.data.formCode
  pageData.fieldName = res.data.fieldName
  pageData.draftYn = res.data.draftYn
  pageData.loaded = true

  if (pageData.isViewExe === 'Y') {
    await openViewer()
  }
}

onMounted(async () => {
  previousTitle = document.title
  document.title = '影像瀏覽器'
  await loadPage()
})

onBeforeUnmount(() => {
  document.title = previousTitle
})
</script>

<style scoped>
.dsa00200 {
  margin: 0;
}

.dsa00200__viewer-frame {
  display: none;
  width: 10%;
  height: 10%;
  border: 0;
}
</style>
