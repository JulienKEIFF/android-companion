<template>
	<el-input :prefix-icon="Search" v-model="search" placeholder="Rechercher une info" class="w-64 mr-2" :clearable="true" />

	<el-table :data="filterTableData" style="width: 100%" :empty-text="$t('infoslist.nodata')" >
    <el-table-column prop="key" :label="$t('infoslist.info')" />
    <el-table-column prop="value" :label="$t('infoslist.value')" />
	</el-table>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, ref, computed, Ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { api } from '../../electron'

interface IFeatureTable {
	key: string,
	value: boolean
}

const props = defineProps(['device'])
const tableData: Ref<IFeatureTable[]> = ref([])
const search = ref('')

const filterTableData = computed(() =>
  tableData.value.filter(
    (data: IFeatureTable) =>
      !search.value ||
      data.key.toLowerCase().includes(search.value.toLowerCase())
  )
)

onMounted(async () => {
	const deviceInfos = await api.android.deviceInfo.getDeviceFeatures(props.device);
	Object.keys(deviceInfos).forEach((value: string, index: number, baseArray: string[]) => {
		tableData.value.push({key: value, value: deviceInfos[value]})
	})
})
</script>