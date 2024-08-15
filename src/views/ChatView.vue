<template>
  <div class="flex h-screen bg-gray-100">
    <div class="mx-auto max-w-md w-full bg-white rounded-lg shadow-md">
      <div class="px-3 py-2 bg-gray-200 flex justify-between items-center">
        <span class="text-lg font-bold">Chat</span>
        <Button class="text-black-500">
          <Bars3Icon class="h-6 w-6" />
        </Button>
      </div>
      <div class="flex flex-col chat-interface overflow-y-auto px-3 py-2">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['flex', message.user ? 'justify-end' : 'justify-start', 'py-2']"
        >
          <div class="flex items-center">
            <div
              class="rounded-full h-8 w-8 mr-2"
              :class="message.user ? 'bg-teal-500' : 'bg-orange-500'"
            >
              <span v-if="message.user">
                <UserCircleIcon class="h-8 w-8 text-white" />
              </span>
              <span v-else>
                <img :src="logo" width="30" height="30" />
              </span>
            </div>
            <div
              class="rounded-lg p-3 max-w-xs"
              :class="message.user ? 'bg-teal-500 text-white' : 'bg-orange-500'"
            >
              {{ message.text }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center px-1 py-2 border-t border-gray-200">
        <input
          v-model="messageInput"
          type="text"
          placeholder="Type a message"
          class="rounded-lg border border-gray-300 px-1 py-1"
        />
        <Button
          @click="sendMessage"
          class="rounded-lg bg-orange-500 text-white px-2 py-1"
        >
          <PaperAirplaneIcon class="h-6 w-6" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Button from "../components/Button.vue";
import { Bars3Icon, PaperAirplaneIcon, UserCircleIcon } from "@heroicons/vue/24/solid";
import { ref, onMounted, onUnmounted } from "vue";
import router from "../router";
import { toast } from "vue3-toastify";
import logo from "../assets/logo.png";

export default {
  components: {
    Button,
    Bars3Icon,
    PaperAirplaneIcon,
    UserCircleIcon,
  },
  setup() {
    const messageInput = ref("");
    const messages = ref([]);

    const server_url = process.env.VUE_APP_BACKEND_URL;

    const sendMessage = async (init = null) => {
      const messageText = init || messageInput.value;
      if (!messageText) return;

      const userMessage = {
        id:
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15),
        text: messageText,
        user: true,
      };

      messages.value.push(userMessage);

      try {
        const response = await axios.post(`${server_url}/chat`, {
          chat: {
            prompt: messageText,
            chat_id: sessionStorage.getItem("chatId"),
            user_id: sessionStorage.getItem("userId"),
          },
        });
        console.log(response.data.data);

        if (!init) {
          messages.value.push(response.data.data);
        }

        messageInput.value = "";
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred while sending the message."
        );
      }
    };

    const initChat = async () => {
      try {
        const response = await axios.get(`${server_url}/chat?init=true`);
        console.log(response.data.data);
        sessionStorage.setItem("chatId", response.data.data);
      } catch (error) {
        console.error(error);
        // toast.error(error.response?.data?.message || "An error occurred during chat initialization.");
      }
    };

    const getChat = async () => {
      try {
        const response = await axios.get(
          `${server_url}/chat?getchat=${sessionStorage.getItem("chatId")}`
        );
        console.log(response.data.data);
        let chats = response.data.data;
        if (response.data.data.length === 0) {
          await initChat();
        } else {
          for (let chat of chats) {
            let userMessage = {
              id:
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15),
              text: chat.user_msg,
              user: true,
            };
            messages.value.push(userMessage);

            let botMessage = {
              id:
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15),
              text: chat.bot_res,
              user: false,
            };
            messages.value.push(botMessage);
          }
        }
      } catch (error) {
        console.error(error);
        // toast.error(error.response?.data?.message || "An error occurred while fetching the chat history.");
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    };

    onMounted(() => {
      const userId = sessionStorage.getItem("userId");
      if (!userId || userId === "undefined") {
        router.push("/");
        return;
      }

      const chatId = sessionStorage.getItem("chatId");
      if (!chatId || chatId === "undefined") {
        initChat();
      } else {
        getChat();
      }

      window.addEventListener("keydown", handleKeyPress);
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", handleKeyPress);
    });

    return { messageInput, messages, sendMessage, logo };
  },
};
</script>

<style>
.chat-interface {
  height: 83%;
}
</style>
