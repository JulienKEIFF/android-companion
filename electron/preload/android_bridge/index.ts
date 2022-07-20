import { IPackageType } from '../../../src/IPackageType'
import Adb from '@devicefarmer/adbkit';
import Logcat from '@devicefarmer/adbkit-logcat'
import fs from 'fs';

const client = Adb.createClient();
let logcat;


//region Filesystem
async function pullFileFromDevice(requestedDevice: string, fromPath: string, destPath: string) {
	const device = client.getDevice(requestedDevice)
	const syncInstance = await device.syncService()
	const fileStream = syncInstance.pull(fromPath)
	const destStream = fs.createWriteStream(destPath)

	await new Promise<void>((resolve, reject) => {
		destStream.on('finish', () => { resolve() })
		destStream.on('error', (error) => { console.error(error); reject() })

		fileStream.pipe(destStream, {})
	})
}

async function getFolderContent(device: string, dir: string) {
	return await client.getDevice(device).readdir(dir)
}
//endregion

//region System
function reboot(device: string) { client.getDevice(device).reboot() }
function shutdown(device: string) { client.getDevice(device).startActivity({ action: 'com.android.internal.intent.action.REQUEST_SHUTDOWN' }) }

async function connect(deviceHost: string, devicePort: number) { return await client.connect(deviceHost, devicePort) }
async function disconnect(deviceHost: string, devicePort: number) { return await client.disconnect(deviceHost, devicePort) }
async function startPackage(device: string, androidPackage: string) {
	return await client.getDevice(device).shell('am start ' + androidPackage)
}
async function stopPackage(device: string, androidPackage: string) {
	return await client.getDevice(device).shell('am force-stop ' + androidPackage)
}
async function getLogcat(device: string, priority: string) {
	logcat = await client.getDevice(device).openLogcat({clear: true})
	logcat.includeAll(Logcat.Priority.fromLetter(priority))
	logcat.on('entry', (message: any) => {
		window.postMessage(message);
	})
}
async function stopLogcat() {
	console.log('request stop logcat')
	logcat.off('entry', (message: any) => {
		window.postMessage(message);
	})
	logcat.end()
}
//endregion

//region Device
async function getDevices() { return await client.listDevices(); }

async function getDeviceInfo(device: string) {
	const realDevice = client.getDevice(device)
	return await realDevice.getProperties()
}

async function getDeviceFeatures(device: string) {
	return await client.getDevice(device).getFeatures();
}

async function getInstalledPackages (device: string, typeOfPackage: IPackageType) {
	return await client.getDevice(device).getPackages(typeOfPackage)
}

async function checkPackageInstalled(device: string, androidPackage: string) {
	return await client.getDevice(device).isInstalled(androidPackage)
}
//endregion

//region performance
async function getRamUsage(device: string) {
	const memoryDump = await client.getDevice(device).shell('dumpsys meminfo')
	const reader = await Adb.util.readAll(memoryDump)
	const result = reader.toString()

	const ramInfo = {
		totalRAM: '0',
		freeRAM: '0',
	}

	result.split('\n').forEach((item: string) => {
		if (item.includes('RAM')) {
			item = item.replace(/\s/gi, '')
			if (item.includes('TotalRAM:')) ramInfo.totalRAM = item.replace('TotalRAM:', '').split('(')[0].replace(/,/gi, '').replace('K', '')
			if (item.includes('FreeRAM:')) ramInfo.freeRAM = item.replace('FreeRAM:', '').split('(')[0].replace(/,/gi, '').replace('K', '')
		}
	})

	return ramInfo;
}
//endregion


export const filesystem = {
	pullFileFromDevice,
	getFolderContent,
}

export const system = {
	connect,
	disconnect,
	reboot,
	shutdown,
	startPackage,
	stopPackage,
	getLogcat,
	stopLogcat,
}

export const deviceInfo = {
	getDevices,
	getDeviceInfo,
	getInstalledPackages,
	getDeviceFeatures,
	checkPackageInstalled,
}