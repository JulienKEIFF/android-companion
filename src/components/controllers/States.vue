<template>
	<el-row :gutter="12" class="my-6">
		<el-col :span="6">
			<el-tooltip effect="light" :content="$t('commands.poweroff')" :show-after="500">
				<el-button @click="shutdown()"><el-icon :size="15"><SwitchButton /></el-icon></el-button>
			</el-tooltip>

			<el-tooltip effect="light" :content="$t('commands.reboot')" :show-after="500">
				<el-button @click="restart()"><el-icon :size="15"><RefreshRight /></el-icon></el-button>
			</el-tooltip>

			<el-tooltip effect="light" :content="$t('commands.screenmirror')" :show-after="500">
				<el-button @click="screenMirror()"><el-icon :size="15"><Cellphone /></el-icon></el-button>
			</el-tooltip>
		</el-col>

		<el-col :span="12" :offset="6">
			<div class="ml-6 text-right flex items-center justify-end">
				<el-icon :size="20" class="mr-2"><Iphone /></el-icon><span class="mr-4">{{deviceName}}</span> 
			</div>
		</el-col>
	</el-row>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import { api } from '../../electron'

const props = defineProps(['device'])
const deviceName = ref('')

watch(() => props.device, async (newVal, beforeVal) => {
	getDeviceName(newVal)
})

onMounted(async () => {
	getDeviceName(props.device)
})

const getDeviceName = async (deviceID: string) => {
	const actualDeviceInfos = await api.android.deviceInfo.getDeviceInfo(deviceID);
  deviceName.value = actualDeviceInfos['ro.product.model'] + ' (' + deviceID + ')'
}


const shutdown = () => {
	api.android.system.shutdown(props.device)
}

const screenMirror = () => api.node.launchCMD('scrcpy', ['-s', props.device])

const restart = () => {
	api.android.system.reboot(props.device)
}

const notify = (title: string, description: string) => {
  ElNotification({
    title: title,
    message: description,
		type: 'info',
  })
}
</script>