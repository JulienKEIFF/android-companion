<template>
	<div v-if="props.device">
		<States :device="props.device" />
		<!-- <SystemRessources :device="props.device" /> -->

		<el-row :gutter="12">
    	<el-col :span="8">
				<el-card shadow="hover" @click="packageDialog = !packageDialog" :body-style="{display: 'flex', alignItems: 'center'}"> 
					<el-icon :size="20" class="mr-2"><Menu /></el-icon> 
					<span>{{ $t('modules.apps') }}</span> 
				</el-card>

				<el-dialog v-model="packageDialog" v-if="packageDialog" :title="$t('modules.apps')" width="75%">
					<DevicePackage :device="props.device" />
				</el-dialog>
			</el-col>

			<el-col :span="8">
				<el-card shadow="hover" @click="logsDialog = !logsDialog" :body-style="{display: 'flex', alignItems: 'center'}"> 
					<el-icon :size="20" class="mr-2"><Notebook /></el-icon> 
					<span>{{ $t('modules.logs') }}</span>
				</el-card>
				<el-dialog v-if="logsDialog" v-model="logsDialog" :title="$t('modules.logs')" width="75%">
					<LogViewer :device="props.device" />
				</el-dialog>
			</el-col>

			<el-col :span="8">
				<el-card shadow="hover" @click="filesysDialog = !filesysDialog" :body-style="{display: 'flex', alignItems: 'center'}">
					<el-icon :size="20" class="mr-2"><Folder /></el-icon> 
					<span>{{ $t('modules.fs') }}</span>
				</el-card>
				<el-dialog v-model="filesysDialog" v-if="filesysDialog" :title="$t('modules.fs')" width="95%">
					<FileSystem :device="props.device" />
				</el-dialog>
			</el-col>
		</el-row>
	</div>

	<div v-else class="flex flex-col items-center">
		<el-empty description="Selectionnez un appareil" />

		<div class="w-4/12 text-center">
			<div class="mb-2">ou connectez en un</div>
			<div class="flex flex-row">
				<el-input v-model="input" placeholder="192.168.0.10:5555" />
				<el-button class="ml-4"  type="primary" @click="connectDevice()"><el-icon><CirclePlus /></el-icon></el-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref } from 'vue'
import { ElNotification } from 'element-plus'
import DevicePackage from '../components/dialog/DevicePackages.vue';
import LogViewer from '../components/dialog/LogViewer.vue';
import FileSystem from '../components/dialog/FileSystem.vue';

import States from '../components/controllers/States.vue';
import SystemRessources from '../components/controllers/SystemInfos.vue'
import { api } from '../electron';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const customClass = 'w-1/3'
const activeName = ref('0')

const packageDialog = ref(false)
const logsDialog 		= ref(false)
const filesysDialog	= ref(false)

const props = defineProps(['device'])
const emit = defineEmits(['connect'])
const input = ref('')

const connectDevice = async () => {
	if (input.value.includes(':')) {
		const host = input.value.split(':')[0]
		const port = input.value.split(':')[1]
		const result = await api.android.system.connect(host, +port)

		if (result == input.value) {
			ElNotification({ title: t('notifications.successConnectionTitle'), message: t('notifications.successConnectionDescription'), type: 'success', customClass })
			emit('connect')
		} else ElNotification({ title: t('notifications.errorConnectionTitle'), message: t('notifications.errorConnectionDescription'), type: 'error', customClass})
	
	} else {
		ElNotification({ title: t('notifications.malformedConnectionTitle'), message: t('notifications.malformedConnectionDescription'), type: 'error', customClass })
	}
}

</script>
