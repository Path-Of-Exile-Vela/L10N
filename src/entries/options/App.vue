<template>
  <main class="flex flex-col h-screen items-center">
    <el-form class="w-[80vw] flex-1" label-width="120">
      <el-form-item label="资产加速服务器">
        <el-input
          v-model="poeVelaL10N.preference.assetProxy"
          placeholder="https://ghproxy.com/"
          @click="handleProxyInputClick"
        />
      </el-form-item>
      <el-form-item label="资产服务器">
        <el-input
          v-model="poeVelaL10N.preference.assetServer"
          placeholder="https://github.com/Path-Of-Exile-Vela/L10N-Assets"
        />
      </el-form-item>
      <el-form-item label="操作">
        <el-button-group>
          <el-button
            @click="handleSave"
          >
            保存
          </el-button>
          <el-button
            @click="resetAssetServer"
          >
            重置
          </el-button>
          <el-button
            @click="testAssetServer"
          >
            <mutable-icon :state="bottonState"/>
            <span class="pl-1">测速 {{ poeVelaL10N.testConnectivityResult ? poeVelaL10N.testConnectivityResult.latency + " /ms" : "" }}</span>
          </el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item label="Join US">
        <el-button-group>
          <el-button
            tag="a"
            href="https://github.com/Path-Of-Exile-Vela/L10N/discussions"
            target="_blank"
            rel="noopener noreferrer"
          >
            改善翻译
          </el-button>
          <el-button
            tag="a"
            href="https://github.com/Path-Of-Exile-Vela/L10N/discussions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Other language support
          </el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item label="感谢">
        <div class="inline-block text-left">
          POE Vela L10n 项目的诞生离不开
          <el-link target="_blank" type="primary" href="https://poedb.tw/us/">PoEDB</el-link>
          整理并开放的百科数据, 如果您有意向支持 POE Vela 项目的发展, 请优先考虑对
          <el-link target="_blank" type="primary" href="https://poedb.tw/us/">PoEDB</el-link>
          进行
          <el-link target="_blank" type="primary" href="https://poedb.tw/us/patreon">捐赠</el-link>
          .
          <br>
        </div>
      </el-form-item>
    </el-form>
    <div class="flex flex-col items-center pb-[10px]">
      <div class="flex flex-row items-center">
        <el-link
          type="primary"
          href="https://github.com/Path-Of-Exile-Vela/L10N"
          target="_blank"
          rel="noopener noreferrer"
          class="py-0 h-auto"
          title="Github Source"
        >
          支持 POE Vela L10N
        </el-link>
      </div>
      <div class="flex flex-row">
        <div class="flex flex-row items-center">
          <span class="pr-2">Source Code At</span>
          <el-link
            type="primary"
            href="https://github.com/Path-Of-Exile-Vela/L10N"
            target="_blank"
            rel="noopener noreferrer"
            class="py-0 h-auto"
            title="Github Source"
          >
            Github
          </el-link>
        </div>
      </div>
      <div class="flex flex-row">
        <p>Powered By: Vue.js</p>
        <p class="pl-2">License GPL3</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import usePoeVelaL10nPopup from "@/classifed/use-poe-vela-l10n.popup";
import MutableIcon from "@/components/mutable-icon.vue";
import {ElNotification} from "element-plus";
import {computed, onMounted} from "vue";
import {Ext} from "@poe-vela/core/browser";
import {globalx} from "@/classifed/globalx";
import {ExtMessagesIdentities} from "@/classifed/ext-messages";
import {PreferenceEntityDefault} from "@/domain/preference";

const poeVelaL10N = usePoeVelaL10nPopup();

onMounted(async () => {
  Ext.message
    .post$(globalx.port!, {identify: ExtMessagesIdentities.Initialize})
    .then(res => {
      poeVelaL10N.initial(res)
    })

  Ext.message.addListener.message(
    globalx.port!,
    message => {
      switch (message.identify) {
        case ExtMessagesIdentities.ReInitialize:
          poeVelaL10N.initial(message.payload)
          break;
        case ExtMessagesIdentities["Preference:Changed"]:
          poeVelaL10N.preference = message.payload;
          break;
      }
    }
  )
})
/**
 * 保存资产服务器和资产代理服务器的配置
 */
const handleSave = () => {
  poeVelaL10N.updatePreference({
    assetProxy: poeVelaL10N.preference.assetProxy,
    assetServer: poeVelaL10N.preference.assetServer,
  })
  ElNotification.success("保存成功")
  testAssetServer()
}

/**
 * 重置资产服务器和资产代理服务器的配置
 */
const resetAssetServer = () => {
  poeVelaL10N.updatePreference({
    assetProxy: PreferenceEntityDefault.assetProxy,
    assetServer: PreferenceEntityDefault.assetServer,
  })
  ElNotification.success("重置成功")
  testAssetServer()
}

/**
 * 检测资产服务器
 */
const testAssetServer = () => {
  poeVelaL10N.testConnectivityResult = null
  poeVelaL10N.testAssetServer()
    .then((res) => {
      if (!res.status) {
        ElNotification.error({
          message: "连接资产服务器失败",
        })
      }
    })
}

const bottonState = computed(() => {
  return poeVelaL10N.testConnectivityResult ? poeVelaL10N.testConnectivityResult ? 1 : 2 : 0
})

const handleProxyInputClick = () => {
  if (poeVelaL10N.preference.assetProxy == "" || poeVelaL10N.preference.assetProxy == null) {
    poeVelaL10N.preference.assetProxy = "https://ghproxy.com/"
  }
}

</script>

<style>

</style>
