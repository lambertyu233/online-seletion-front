<!--
 * @Descripttion: 
 * @version: 
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2022-09-24 18:18:43
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
-->
<template>
  <div class="config-form">
    <h2>API 基础地址配置</h2>
    <form @submit.prevent="saveConfig">
      <div class="form-group">
        <label for="baseUrl">基础 URL:</label>
        <input type="text" id="baseUrl" v-model="baseUrl" placeholder="http://192.168.200.129:8500" />
      </div>
      <button type="submit">保存配置</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: localStorage.getItem('baseUrl') || 'http://192.168.200.129:8500'
    }
  },
  methods: {
    saveConfig() {
      // 简单验证输入
      if (!this.baseUrl) {
        alert('请输入有效的URL');
        return;
      }

      // 保存到 localStorage
      localStorage.setItem('baseUrl', this.baseUrl);
      alert('配置已保存！下次请求将生效');
    }
  }
}
</script>

<style scoped>
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
