<template>
	<div class="flex flex-row items-center mb-8">
		<el-button @click="startGetLogcat" link>
			<el-icon :size="25"><VideoPlay /></el-icon>
		</el-button>

		<el-button @click="stopGetLogcat" link>
			<el-icon :size="25"><VideoPause /></el-icon>
		</el-button>	

		<el-select v-model="debugLvl" @change="changeLvl" class="ml-4">
			<el-option
        v-for="lvl in levels"
        :key="lvl.value"
        :label="lvl.name"
        :value="lvl.value"
      />
		</el-select>

		<div v-if="fetching" class="ml-4 flex items-center">
			<el-icon class="mr-2 animate-spin-slow" :size="20" ><Loading /></el-icon> 
			<span>{{$t('state.logging')}}</span>
		</div>
	</div>

	<div style="display: flex; flex-direction: column-reverse;">
		<div v-if="logs.length < 1" class="text-center text-2xl">Pas d'entrée</div>
		<div v-for="(item, i) in logs" :key="i"> 
			<span style="color: #3f7898"> {{item.date.toLocaleDateString("fr", {hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}&nbsp;</span>
			<span style="color: #d58747"> {{item.tag}}&nbsp;</span>
			<span style="color: #609b55"> {{ item.message }} </span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { api } from '../../electron'
import { ref, Ref } from 'vue'

const { t } = useI18n()

interface ILogItem {
	date: Date, tag: string, message: string
}

const logs: Ref<ILogItem[]> = ref([])
const props = defineProps(['device'])
const debugLvl = ref('V')
const fetching = ref(false)
const levels = [
	{ name: t('debuglvl.verbose'), value: 'V' },
	{ name: t('debuglvl.debug'), value: 'D' },
	{ name: t('debuglvl.info'), value: 'I' },
	{ name: t('debuglvl.warning'), value: 'W' },
	{ name: t('debuglvl.error'), value: 'E' },
]

const addToLogs = (message: ILogItem) => {
	if (logs.value.length > 1000) logs.value.shift()
	logs.value.push(message)
}

const entryListener = (event: any) => {
	if (event.source === window) addToLogs(event.data);
}

const startGetLogcat = () => {
	fetching.value = true
	window.addEventListener("message", entryListener);
	api.android.system.getLogcat(props.device, debugLvl.value)
}

const stopGetLogcat = () => {
	fetching.value = false
	window.removeEventListener("message", entryListener);
	api.android.system.stopLogcat()
}

const changeLvl = () => {
	stopGetLogcat()
	startGetLogcat()
}

</script>