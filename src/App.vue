<template>
	<el-scrollbar>
		<el-container>
			<el-aside  width="300px" style="height: 100vh"> <AsideMenu @deviceChange="setDevice" @showSettings="showSettings" :updated="updated" /> </el-aside>
			<el-main v-if="!displaySettings"> <ViewContent :device="device" @connect="updateAsideBar" /> </el-main>
			<el-main v-else> <SettingView /> </el-main>
		</el-container>
	</el-scrollbar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getPreference, prefKeys } from './utils/db'
import AsideMenu from './components/AsideMenu.vue'
import ViewContent from './views/ViewContent.vue'
import SettingView from './views/Settings.vue'

const { locale } = useI18n()
const device = ref('');
const displaySettings = ref(false)
const updated = ref(false)

const setDevice = (newDevice: string) => { displaySettings.value = false; device.value = newDevice }
const showSettings = () => displaySettings.value = true
const updateAsideBar = () => updated.value = !updated.value

onMounted(() => {
	const baseLocal = getPreference(prefKeys.PREF_LOCALE)
	if (baseLocal) locale.value = baseLocal
})
</script>

<style>
* { user-select: none; font-family: 'Segoe UI';}
body {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	height: 100vh;
}
#app { height: 100%; }
</style>