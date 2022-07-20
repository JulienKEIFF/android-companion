<template>
	<el-card class="box-card my-2 hover:bg-gray-800 cursor-pointer" shadow="never">
		<div class="flex items-center">
			<el-icon :size="30"><Folder /></el-icon>
			<span class="ml-4">{{props.file.name}}</span>
		</div>
  </el-card>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps(['file', 'fullpath'])
</script>