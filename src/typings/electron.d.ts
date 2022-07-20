/**
 * Should match main/preload.ts for typescript support in renderer
 */
import { ElectronApi } from '../electron'

declare global {
  interface Window {
    api: ElectronApi,
  }
}
