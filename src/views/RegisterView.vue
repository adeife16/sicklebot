<template>
  <div class="container">
    <div class="row-auto">
      <div class="">
        <div class="card shadow mt-24 px-6">
          <Form :formClass="'py-4 '">
            <div class="flex justify-center">
              <p class="text-3xl font-bold">Register</p>
            </div>
            <Input
              :type="'text'"
              :placeholder="'First Name'"
              v-model="firstName"
              :id="'firstName'"
              :inputClass="'ring-0'"
            />
            <Input
              :type="'text'"
              :placeholder="'Last Name'"
              v-model="lastName"
              :id="'lastName'"
              :inputClass="'ring-0'"
            />
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
            <Input
              :type="'password'"
              :placeholder="'Confirm Password'"
              v-model="confirmPassword"
              :id="'confirmPassword'"
              :inputClass="'ring-0'"
            />
            <Button
              :text="'Register'"
              :type="'button'"
              :btnClass="'bg-orange w-full text-white font-bold py-2 rounded'"
              :disabled="btnDisabled"
              @click="handleInput"
            />
          </Form>
          <router-link to="/login" class="orange">Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import Form from "../components/Form.vue";
import Button from "../components/Button.vue";
import Input from "../components/Input.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import router from "../router";

export default {
  components: {
    Form,
    Button,
    Input,
  },
  setup() {
    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const btnDisabled = ref(false);
    const server_url = process.env.VUE_APP_BACKEND_URL;

    const handleInput = async () => {
      
      if (password.value !== confirmPassword.value) {
        toast.error("Passwords do not match");
        return;
      }
      btnDisabled.value = true;
      try {
        const response = await axios.post(`${server_url}/auth/signup`, {
          register: {
            first_name: firstName.value,
            last_name: lastName.value,
            email: email.value,
            password: password.value,
            confirm_password: confirmPassword.value,
          },
        });
        if (response.status === 200) {
          toast.success(response.data.message);
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          toast.error(response.data.message);
          btnDisabled.value = false;
        }
      } catch (error) {
        console.log(error);
        btnDisabled.value = false;
        toast.error(error.response?.data?.message || "An error occurred during registration.");
      }
    };
    return {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      btnDisabled,
      handleInput,
    };
  },
};
</script>

<style>
</style>