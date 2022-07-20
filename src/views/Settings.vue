<template>
  <div>
    
    <h1 class="text-center text-3xl font-bold mb-20">{{ $t('settings.title')}}</h1>


    <h2 class="mb-6 font-bold text-xl border-b-gray-500 border-b-2 pb-2">{{ $t('settings.system.title')}}</h2>
    <el-form
      label-position="left"
      label-width="200px"
      :model="settings"
    >
      <el-form-item :label="$t('settings.system.locale')">
        <el-select @change="changeLocal" v-model="locale">
          <el-option v-for="locale in localeList" :label="locale.name" :value="locale.id" />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('settings.system.screenshotlocation')">
        <el-input v-model="settings.screenshotFolder" />
      </el-form-item>

      <el-form-item :label="$t('settings.system.filelocation')">
        <el-input v-model="settings.fileFolder" />
      </el-form-item>
    </el-form>

    <h2 class="mb-6 mt-12 font-bold text-xl border-b-gray-500 border-b-2 pb-2">{{ $t('settings.infos.title')}}</h2>
    <div>
      
    </div>

  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { localeList } from '../i18n/index'
import * as db from '../utils/db'

const { locale } = useI18n()

const settings = reactive({
  locale: locale.value,
  screenshotFolder: '',
  fileFolder: ''
})

const changeLocal = (e: string) => {
  locale.value = e
  db.setPreference(db.prefKeys.PREF_LOCALE, e)
}
</script>