<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const formState = reactive({
  username: '',
  password: '',
})

const onFinish = () => {
  localStorage.setItem('role', formState.username.trim() === 'admin' ? 'admin' : 'user')
  router.push('/home')
}
</script>

<template>
  <a-form class="login-form" :model="formState" @finish="onFinish">
    <a-form-item label="Username" name="username" :rules="[{ required: true, message: 'Please input your username' }]">
      <a-input v-model:value="formState.username" />
    </a-form-item>
    <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Please input your password' }]">
      <a-input-password v-model:value="formState.password" />
    </a-form-item>
    <a-form-item style="text-align: center;">
      <a-button type="primary" html-type="submit">Log in</a-button>
    </a-form-item>
  </a-form>
</template>

<style scoped>
.login-form {
  max-width: 420px;
  margin: 80px auto;
}
</style>
