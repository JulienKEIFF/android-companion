<template>
	<el-breadcrumb :separator-icon="ArrowRight" class="mb-6 text-lg">
		<el-breadcrumb-item>{{displayedDevice}}</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(folder, i) in folderpath" :key="i">{{folder.replace('/', '')}}</el-breadcrumb-item>
  </el-breadcrumb>

	<div class="flex justify-between mb-4">
		<el-button @click="refresh(true)" @keydown.ctrl.84="refresh(true)">
			<el-icon :size="20"><Refresh /></el-icon>
		</el-button>

		<el-input class="w-11/12" :placeholder="$t('filesystem.search')" @input="search" v-model="searchItem">
			<template #prepend>
				<el-button :icon="Search" />
			</template>
		</el-input>

	</div>
	
	<!-- <el-button @click="moreAction()">
		<el-icon :size="20"><MoreFilled /></el-icon>
	</el-button> -->

	<el-card class="my-2" @click="navigate(true, null)" v-if="folderpath.length != 1">
		<el-icon><ArrowUpBold /></el-icon>
	</el-card>

	<Folder v-for="folder in folderList" :file="folder" :fullpath='folderpath' :device="props.device" @click="navigate(false, folder.name)" />
	<File  v-for="file in fileList" :file="file" :fullpath='folderpath' :device="props.device" />
</template>

<script lang="ts" setup>

import { defineProps, onMounted, ref, reactive, Ref } from 'vue'
import { ArrowRight, Search } from '@element-plus/icons-vue'
import { api } from '../../electron'

import Folder from '../fscard/Folder.vue'
import File from '../fscard/File.vue'
import { IFileSystem } from '../../typings/IFileSystem'



const props 			= defineProps(['device'])
const folderpath 	= reactive(['/sdcard'])

const tempfileList: Ref<IFileSystem[]> = ref([])
const folderList: 	Ref<IFileSystem[]> = ref([])
const fileList: 		Ref<IFileSystem[]> = ref([])

const displayedDevice = ref('')

const showCascader = ref(false)
const cascaderOption: Ref<string[]> = ref([])

const searchItem = ref('')


onMounted(async () => {
	await refresh(true)
	const infos: any = await api.android.deviceInfo.getDeviceInfo(props.device)
	displayedDevice.value = infos['ro.product.model']
})

const getFolderList = async () => {
	tempfileList.value = await api.android.filesystem.getFolderContent(props.device, folderpath.join(''))
}

const refresh = async (refreshDiskNeded: boolean) => {
	if (refreshDiskNeded) await getFolderList()

	folderList.value = []
	fileList.value = []
	
	if (tempfileList.value.length == 0) return;
	
	tempfileList.value.forEach((itemFile: IFileSystem) => {
		if (itemFile.size == 4096) folderList.value.push(itemFile)
		else fileList.value.push(itemFile)
	});

	folderList.value.sort((a, b) => {
		if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
	})

	fileList.value.sort((a, b) => {
		if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
	})
}

const search = async (itemToSearch: string) => {
	await refresh(false);
	folderList.value = folderList.value.filter(a => a.name.includes(itemToSearch))
	fileList.value = fileList.value.filter(a => a.name.includes(itemToSearch))
}

const moreAction = () => {
	showCascader.value = true
	cascaderOption.value = ['item']
}

const navigate = async (isBack: boolean, folderChoosed: string | null) => {
	if (isBack && folderpath.length == 1) return;
	if (isBack) folderpath.pop()
	else folderpath.push('/' + folderChoosed)

	searchItem.value = ''

	refresh(true);
}
</script>