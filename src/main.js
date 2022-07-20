import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { createI18n, useI18n } from 'vue-i18n';
import { defaultLocale, languages } from './i18n/index';
const messages = Object.assign(languages);
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import './style/index.css';
const app = createApp(App, {
    setup() {
        const { t } = useI18n(); // call `useI18n`, and spread `t` from  `useI18n` returning
        return { t }; // return render context that included `t`
    }
});
const i18n = createI18n({
    locale: defaultLocale,
    useScope: 'global',
    messages,
});
app.use(ElementPlus);
app.use(i18n);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.mount('#app');
//# sourceMappingURL=main.js.map