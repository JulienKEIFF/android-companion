<template>
	<el-card class="box-card my-2 hover:bg-gray-800 cursor-pointer" shadow="never" @click="openFile()">
		<el-row >
			<el-col :span="16" class="flex items-center">

				<el-icon :size="30" v-if="isPic"><Picture /></el-icon>
				<el-icon :size="30" v-else-if="isVid"><VideoCamera /></el-icon>
				<el-icon :size="30" v-else-if="isData"><PieChart /></el-icon>
				<el-icon :size="30" v-else-if="isApp"><Iphone /></el-icon>
				<el-icon :size="30" v-else><Document /></el-icon>

				<span class="ml-4">{{props.file.name}}</span>
			</el-col>

			<el-col :span="6" :offset="2" class="flex items-center text-right">
				<span class="mr-6">{{defineTime(props.file.mtime)}}</span> 
				<span>{{defineSize(props.file.size)}}</span>
			</el-col>
		</el-row>
  </el-card>
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted } from 'vue'
import { ElNotification } from 'element-plus'
import { api } from '../../electron';

const props = defineProps(['file', 'fullpath', 'device'])
const isPic = ref(false)
const isVid = ref(false)
const isDoc = ref(false)
const isData= ref(false)
const isApp = ref(false)

const defineSize = (size: string) => {
	const thresh = 1024
	let intSize:number = +size
	const dp = 1

  if (Math.abs(intSize) < thresh) return intSize + ' B'

  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] 
  let u = -1
  const r = 10**dp

  do {
    intSize /= thresh
    ++u
  } while (Math.round(Math.abs(intSize) * r) / r >= thresh && u < units.length - 1)

  return intSize.toFixed(dp) + ' ' + units[u]
}

const defineTime = (time: Date) => {
	return time.toLocaleDateString("fr", {hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
	const ext = props.file.name.split('.').pop();
	switch (ext) {
		case 'jpg': case 'jpeg': case 'png': { isPic.value = true; break; }
		case 'mp4': case 'wmv': case 'mov': case 'ts': { isVid.value = true; break; }
		case 'txt': case 'log': { isDoc.value = true; break }
		case 'csv': { isData.value = true; break }
		case 'apk': { isApp.value = true; break }
	}
})

const openFile = async () => {
	console.log('heya')
	const requestedFilePath = props.fullpath.join('') + '/' +  props.file.name

	await api.android.filesystem.pullFileFromDevice(props.device, requestedFilePath, './storage/' + props.file.name)
	api.node.openFileDefault('./storage/' + props.file.name)
}

const notify = (title: string, description: string) => {
  ElNotification({
    title: title,
    message: description,
		type: 'info',
  })
}
</script>
