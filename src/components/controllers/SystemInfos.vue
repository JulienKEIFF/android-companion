<template>
	<div class="mb-4 w-64">
		<el-progress :percentage="ramPercent" :color="customColors" />
	</div>
</template>

<script lang="ts" setup>
import { onMounted, defineProps, ref } from 'vue'
import { api } from '../../electron'

const props = defineProps(['device'])
const ramUsage = ref({total: 0, free: 0})

const ramPercent = ref(0)

const customColors = [
  { color: '#5cb87a', percentage: 70 },
  { color: '#e6a23c', percentage: 90 },
  { color: '#f56c6c', percentage: 100 },
]

onMounted(async () => {
	updateRessources()
	setInterval(updateRessources, 2000)
})

const updateRessources = async () => {
	//TODO Implement
}

const calcPercent = () => {
	ramPercent.value = (100 - Math.round(ramUsage.value.free * 100 / ramUsage.value.total))
}
</script>