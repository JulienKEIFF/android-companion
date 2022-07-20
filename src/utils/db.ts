const pref = 'pref_'

function setPreference(key: string, value: string) { localStorage.setItem(pref + key, value) }
function getPreference(key: string) { return localStorage.getItem(pref + key) }



export {
  setPreference,
  getPreference,
}

export const prefKeys = {
  PREF_LOCALE: 'locale'
}