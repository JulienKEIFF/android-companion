const pref = 'pref_';
function setPreference(key, value) { localStorage.setItem(pref + key, value); }
function getPreference(key) { return localStorage.getItem(pref + key); }
export { setPreference, getPreference, };
export const prefKeys = {
    PREF_LOCALE: 'locale'
};
//# sourceMappingURL=db.js.map