/**
 * This file is used to typehint the exposed electron api's.
 * The purpose of this is to get static analysis in Vue files without additional plug-ins.
 */
import { IPackageType } from './IPackageType'
import { Device, DeviceClient, Properties } from '@devicefarmer/adbkit';
import { IpcRenderer } from 'electron'
import Entry from '@devicefarmer/adbkit/dist/src/adb/sync/entry';

const ipcRenderer = window.api.ipcRenderer as IpcRenderer
const api = window.api as ElectronApi;

export {
  ipcRenderer,
	api,
}

export interface ElectronApi {
	ipcRenderer: 	Electron.IpcRenderer,
	android: 			IAndroidBridge,
	node: INodeBridge,
}

export interface IAndroidBridge {
	filesystem: {
		pullFileFromDevice(requestedDevice: string, fromPath: string, destPath: string): Promise<any>,
		getFolderContent(device: string, dir: string): Promise<Entry[]>,
	},
	
	system: {
		connect(deviceHost: string, devicePort: number): Promise<string>,
		disconnect(deviceHost: string, devicePort: number): Promise<DeviceClient>,
		reboot(device: string): void,
		shutdown(device: string): void,
		startPackage(device: string, androidPackage: string): Promise<any>,
		stopPackage(device: string, androidPackage: string): Promise<any>,
		getLogcat(device: string, priority: string): void,
		stopLogcat(): void,
	}
	
	deviceInfo: {
		getDevices(): Promise<Device[]>,
		getDeviceInfo(device: string): Promise<Properties>,
		getInstalledPackages(device: string, typeOfPackage: IPackageType): Promise<string[]>,
		getDeviceFeatures(): void,
		checkPackageInstalled(device: string, androidPackage: string): Promise<boolean>,
	}
}

export interface INodeBridge {
	openFileDefault(path: string): void,
	launchCMD(cmd: string, params: string[]): void,
}
