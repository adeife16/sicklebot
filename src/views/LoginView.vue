<template>
  <div class="container">
    <div class="row-auto">
      <div class="">
        <div class="card shadow mt-36 px-6">
          <Form :formClass="'py-4 '">
            <div class="flex justify-center">
              <img :src="logo" alt="logo" class="w-20" />
            </div>
            <Input
              :type="'email'"
              :placeholder="'Email'"
              v-model="email"
              :id="'email'"
              :inputClass="'ring-0'"
            />
            <Input
              :type="'password'"
              :placeholder="'Password'"
              v-model="password"
              :id="'password'"
              :inputClass="'ring-0'"
            />
            <Button
              :text="'Login'"
              :type="'button'"
              :btnClass="'bg-orange w-full text-white font-bold py-2 rounded'"
              :disabled="btnDisabled"
              @click="handleInput"
            />
          </Form>
          <router-link to="/register" class="orange">Register</router-link>
          <router-link to="/forgot" class="orange float-right"
            >Forgot password</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "@/assets/logo.jpg";
import Form from "@/components/Form.vue";
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import router from "@/router";
import { ref, onMounted } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";

export default {
  components: {
    Form,
    Button,
    Input,
  },
  setup() {
    const email = ref("");
    const password = ref("");
    const btnDisabled = ref(false);

    const server_url = process.env.VUE_APP_BACKEND_URL;

    const handleInput = async () => {
      //   btnDisabled.value = true;

      if (!email.value || !password.value) {
        // btnDisabled.value = false;
        toast.error("Invalid Email and Password");
        return;
      }

      try {
        const response = await axios.post(`${server_url}/auth/login`, {
          login: {
            email: email.value,
            password: password.value,
          },
        });
        if (response.status === 200) {
          sessionStorage.setItem("userId", response.data.user.userId);
          sessionStorage.setItem("token", response.data.accessToken);
          toast.success(response.data.message);
          setTimeout(() => {
            router.push("/chat");
          }, 2000);
        } else {
          btnDisabled.value = false;
          toast.error(response.data.message);
        }
      } catch (error) {
        btnDisabled.value = false;
        toast.error(error.response?.data?.message || "An error occurred during login.");
      }
    };

    onMounted(() => {
      const userId = sessionStorage.getItem("userId");
      if (userId && userId !== "undefined") {
        router.push("/chat");
      }
    })    

    return {
      logo,
      email,
      password,
      btnDisabled,
      handleInput,
    };
  },
};
</script>

