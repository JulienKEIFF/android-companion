<template>
	<el-select class="mb-4" @change="changeType" v-model="packTypeChoose">
		<el-option v-for="pack in packType" :key="pack.value" :label="pack.label" :value="pack.value" />
	</el-select>
	
	<el-table :data="tableData" style="width: 100%" :empty-text="$t('applist.nodata')">
    <el-table-column prop="package" :label="$t('applist.labels.packages')" />
    <el-table-column prop="name" :label="$t('applist.labels.appname')" />
		<el-table-column fixed="right" :label="$t('applist.labels.action')">
			<template #default="scope">
				<div>
					<el-button v-if='scope.row.component' plain type="success" size="small" @click.prevent="startPackage(scope.row)">{{ $t('applist.buttons.launch') }}</el-button>
					<el-button plain type="danger" size="small" @click.prevent="stopPackage(scope.row)">{{ $t('applist.buttons.stop') }}</el-button>
				</div>
			</template>
		</el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineProps, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { IDeviceStatus } from '../../typings/interfaces'
import { api } from '../../electron'
import { IPackageType } from '../../IPackageType';

interface IPackageDescription {
	package: string, name: string, component: string
}

const { t } = useI18n()
const props = defineProps(['device'])
const tableData: Ref<IPackageDescription[]> = ref([]);
const packTypeChoose = ref({})
const packType = [
	{label: t('applist.packagetype.disabled'), value: "-d"}, 
	{label: t('applist.packagetype.enabled'), value: "-e"},
	{label: t('applist.packagetype.system'), value: "-s"},
	{label: t('applist.packagetype.third'), value: "-3"}
	]

onMounted(() => { refreshTable(IPackageType.ENABLED) })
const filterTag = (value: string, row: IDeviceStatus) => { return row.isPresent === value }

const refreshTable = async (packtype: IPackageType) => {
	tableData.value = []
	const packageList = await api.android.deviceInfo.getInstalledPackages(props.device, packtype)
	packageList.forEach(item => {
		tableData.value.push({
			package: item,
			name: item.split('.').pop() || '',
			component: '.core.process.MainProcessActivity',
		})
	})

	tableData.value.sort((a, b) => {
		if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
	})
}

const changeType = (value: string) => {
	packTypeChoose.value = value
	switch(value) {
		case '-d': refreshTable(IPackageType.DISABLED); break;
		case '-e': refreshTable(IPackageType.ENABLED); break;
		case '-s': refreshTable(IPackageType.SYSTEM); break;
		case '-3': refreshTable(IPackageType.THIRD_PARTY); break;
	}
}

const isPackageInstalled = async (packageID: string) => {
	return await api.android.deviceInfo.checkPackageInstalled(props.device, packageID) ? 'Oui' : 'Non'
}

const startPackage = async (androidPackage: IPackageDescription) => {
	console.log(androidPackage)
	await api.android.system.startPackage(props.device, androidPackage['package'] + '/' + androidPackage['component'])
}

const stopPackage = async (androidPackage: IPackageDescription) => {
	await api.android.system.stopPackage(props.device, androidPackage['package'])
}
</script>
