<template>
  <el-row>
    <el-col>
      <h3 class="text-center mt-4">ADB Manipulator</h3>
      <el-menu
				style="height: 90vh"
        default-active="1"
				@select="handleSelect"
      >
				<el-menu-item index="0">
          <el-icon><House /></el-icon>
          <span>{{ $t('menu.home')}}</span>
        </el-menu-item>

        <el-sub-menu index="1">
          <template #title>
            <el-icon><Iphone /></el-icon>
            <span>{{ $t('menu.devices')}}</span>
          </template>
					
					<el-button @click="refreshList()" class="mx-10 my-2">
						<el-icon><Refresh /></el-icon> 
						{{ $t('menu.refreshlist') }} 
					</el-button>
					
					<el-menu-item v-for="(device, i) in devices" :key="i" :index="'1-' + i">
						{{ getDeviceDisplay(device.id) }} 
						<el-button link class="ml-2" @click="disconnect(device.id)"><el-icon><CircleClose /></el-icon></el-button>
					</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="2">
          <el-icon><Setting /></el-icon>
          <span>{{ $t('menu.settings')}}</span>
        </el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineEmits, Ref, defineProps, watch } from 'vue'
import { Device } from '@devicefarmer/adbkit';
import { api } from './../electron'

const devices: Ref<Device[]> = ref([]);
const devicesName: Ref<{id: string, displayName: string}[]> = ref([])

const emit = defineEmits(['deviceChange', 'showSettings'])
const props = defineProps(['updated'])

watch(() => props.updated, async (newVal, beforeVal) => {
	refreshList()
})

onMounted(() => refreshList());

const handleSelect = async (selected: string) => {
	if (!selected.includes('1-')) {
		if (selected == '0') emit('deviceChange', null)
		if (selected == '2') emit('showSettings')
		else return;
	} else {
		const thisDevice = +selected.replace('1-', '')
		devices.value[thisDevice].id
		emit('deviceChange', devices.value[thisDevice].id)
	}
}

const refreshList = async () => {
	const devices_ = await api.android.deviceInfo.getDevices();
	devices_.forEach(async (device: any) => {
		const infos = await api.android.deviceInfo.getDeviceInfo(device.id)
		devicesName.value.push({id: device.id, displayName: infos['ro.product.model']})
	});

	devices.value = devices_
}

const getDeviceDisplay = (deviceToFind: string) => {
	const item = devicesName.value.find(device => device.id == deviceToFind)
	if (item) return item.displayName + ' (' + item.id.replace(':5555', '') + ')'
	else return ''
}

const disconnect = async (device: string) => {
	const deviceHost = device.split(':')[0]
	const devicePort = +device.split(':')[1]
	await api.android.system.disconnect(deviceHost, devicePort)

	emit('deviceChange', null)
	refreshList()
}
</script>