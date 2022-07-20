import { spawn, execSync } from "child_process"

function launchCMD(cmd: string, args: string[]) {
  spawn(cmd, args)
}

function openFileDefault(path: string) {
  execSync('start ' + path)
}

export {
  launchCMD,
  openFileDefault,
}