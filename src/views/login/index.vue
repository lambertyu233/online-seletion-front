<!--登录页面-->
<template>
  <div class="login">
    <el-form class="form" :model="model" :rules="rules" ref="loginForm">
      <h1 class="title">尚品甄选后台管理系统</h1>
      <el-form-item prop="userName">
        <el-input class="text" v-model="model.userName" prefix-icon="User" clearable
          :placeholder="$t('login.username')" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input class="text" v-model="model.password" prefix-icon="Lock" show-password clearable
          :placeholder="$t('login.password')" />
      </el-form-item>

      <el-form-item prop="captcha">
        <div class="captcha">
          <el-input class="text" v-model="model.captcha" prefix-icon="Picture" placeholder="请输入验证码"></el-input>
          <img :src="captchaSrc" @click="refreshCaptcha" />
        </div>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" class="btn" size="large" @click="submit">
          {{ btnText }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="change-lang">
    <change-lang />
  </div>
  <div class="config-form">
    <h2>API 基础地址配置</h2>
    <form @submit.prevent="saveBaseUrl">
      <div class="form-group">
        <label for="baseUrl">基础 URL:</label>
        <input type="text" id="baseUrl" v-model="baseUrl" placeholder="http://192.168.200.129:8500" />
      </div>
      <button type="submit">保存配置</button>
    </form>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  ref,
  computed,
  onMounted,
  watch,
} from 'vue'
import { Login, GetValidateCode } from '@/api/login'
import { useRouter, useRoute } from 'vue-router'
import ChangeLang from '@/layout/components/Topbar/ChangeLang.vue'
import useLang from '@/i18n/useLang'
import { useApp } from '@/pinia/modules/app'

export default defineComponent({
  components: { ChangeLang },
  name: 'login',
  setup() {
    const { proxy: ctx } = getCurrentInstance() // 可以把ctx当成vue2中的this
    const router = useRouter()
    const route = useRoute()
    const { lang } = useLang()

    // 添加 baseUrl 响应式状态
    const baseUrl = ref(localStorage.getItem('baseUrl') || 'http://192.168.200.129:8500')

    // 添加保存配置的方法
    const saveBaseUrl = () => {
      if (!baseUrl.value) {
        ctx.$message.error('请输入有效的URL')
        return
      }

      try {
        // 简单验证URL格式
        new URL(baseUrl.value)
        localStorage.setItem('baseUrl', baseUrl.value)
        ctx.$message.success('配置已保存！下次请求将生效')
      } catch (e) {
        ctx.$message.error('请输入有效的URL（包含协议，如 http://）')
      }
    }

    watch(lang, () => {
      state.rules = getRules()
    })
    const getRules = () => ({
      userName: [
        {
          required: true,
          message: ctx.$t('login.rules-username'),
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: ctx.$t('login.rules-password'),
          trigger: 'blur',
        },
        {
          min: 6,
          max: 12,
          message: ctx.$t('login.rules-regpassword'),
          trigger: 'blur',
        },
      ],
      captcha: [
        {
          required: true,
          message: ctx.$t('login.rules-validate-code'),
          trigger: 'blur',
        },
      ],

    })

    // onMounted钩子函数
    onMounted(() => {
      state.refreshCaptcha()
    })

    const state = reactive({
      model: {
        userName: 'admin',
        password: '111111',
        captcha: '',      // 用户输入的验证码
        codeKey: ''       // 后端返回的验证码key
      },
      rules: getRules(),
      loading: false,
      captchaSrc: "",
      refreshCaptcha: async () => {
        const { data } = await GetValidateCode();
        state.model.codeKey = data.codeKey
        state.captchaSrc = data.codeValue
      },
      btnText: computed(() =>
        state.loading ? ctx.$t('login.logining') : ctx.$t('login.login')
      ),
      loginForm: ref(null),
      submit: () => {
        if (state.loading) {
          return
        }
        state.loginForm.validate(async valid => {
          if (valid) {
            state.loading = true
            const { code, data, message } = await Login(state.model)
            if (+code === 200) {
              ctx.$message.success({
                message: ctx.$t('login.loginsuccess'),
                duration: 1000,
              })

              const targetPath = decodeURIComponent(route.query.redirect)
              if (targetPath.startsWith('http')) {
                // 如果是一个url地址
                window.location.href = targetPath
              } else if (targetPath.startsWith('/')) {
                // 如果是内部路由地址
                router.push(targetPath)
              } else {
                router.push('/')    // 请求成功以后，进入到首页
              }
              useApp().initToken(data)
            } else {
              ctx.$message.error(message)
            }
            state.loading = false
          }
        })
      },
    })

    return {
      ...toRefs(state),
      baseUrl,        // 暴露 baseUrl 到模板
      saveBaseUrl,    // 暴露保存方法到模板
    }
  },
})
</script>

<style lang="scss" scoped>
.login {
  transition: transform 1s;
  transform: scale(1);
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #2d3a4b;

  .form {
    width: 520px;
    max-width: 100%;
    padding: 0 24px;
    box-sizing: border-box;
    margin: 160px auto 0;

    :deep {
      .el-input__wrapper {
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        background: rgba(0, 0, 0, 0.1);
      }

      .el-input-group--append>.el-input__wrapper {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      .el-input-group--prepend>.el-input__wrapper {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    .title {
      color: #fff;
      text-align: center;
      font-size: 24px;
      margin: 0 0 24px;
    }

    .text {
      font-size: 16px;

      :deep(.el-input__inner) {
        color: #fff;
        height: 48px;
        line-height: 48px;

        &::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    .btn {
      width: 100%;
    }
  }
}

.captcha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.captcha img {
  cursor: pointer;
  margin-left: 20px;
}

.change-lang {
  position: fixed;
  right: 20px;
  top: 20px;

  :deep {
    .change-lang {
      height: 24px;

      &:hover {
        background: none;
      }

      .icon {
        color: #fff;
      }
    }
  }
}

.config-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 8px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}
</style>
