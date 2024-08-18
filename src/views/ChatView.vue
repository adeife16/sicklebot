<template>
  <div class="flex h-screen bg-gray-100">
    <div class="mx-auto max-w-md w-full bg-white rounded-lg shadow-md">
      <div
        v-if="menu"
        class="fixed inset-0 h-screen w-screen z-20 right-[-100%]"
      >
        <div class="flex flex-col h-full p-4 bg-white rounded-lg shadow-md">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">Menu</h2>
            <Button @click="toggleMenu">
              <XMarkIcon class="h-6 w-6" />
            </Button>
          </div>
          <div
            v-for="chat in history"
            :key="chat.chatId"
            class="mt-4 space-y-2"
          >
            <div class="text-black hover:text-orange-500">
              <router-link :to="`/history/${chat.chatId}`">
                Chat on {{ chat.date }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="px-3 py-2 bg-gray-200 flex justify-between items-center">
        <Button :btnClass="'bg-orange-500 text-white'" @click="newChat"
          >New Chat</Button
        >
        <Button class="text-black" @click="logout">Logout</Button>
        <Button class="text-black-500" @click.prevent="toggleMenu">
          <Bars3Icon class="h-6 w-6" />
        </Button>
      </div>
      <div class="flex flex-col chat-interface overflow-y-auto px-3 py-2">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex',
            message.user ? 'justify-end' : 'justify-start',
            'py-2',
          ]"
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
        <div v-if="loading" class="flex justify-start py-2">
          <div class="flex items-center">
            <div class="rounded-lg p-3 max-w-xs text-white">
              <img :src="chatLoader" width="100" />
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
          :disabled="disabled"
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
import {
  Bars3Icon,
  PaperAirplaneIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";
import { ref, onMounted, onUnmounted } from "vue";
import router from "../router";
import { toast } from "vue3-toastify";
import logo from "../assets/logo.png";
import chatLoader from "../../public/chatLoader.svg";
import { useRoute } from "vue-router";

export default {
  components: {
    Button,
    Bars3Icon,
    PaperAirplaneIcon,
    UserCircleIcon,
    XMarkIcon,
  },
  setup() {
    const messageInput = ref("");
    const messages = ref([]);

    const disabled = ref(false);
    const loading = ref(false);
    const menu = ref(false);

    const history = ref([]);

    const server_url = process.env.VUE_APP_BACKEND_URL;

    // send message
    const sendMessage = async (init = null) => {
      disabled.value = true;

      const messageText = messageInput.value;
      if (!messageText) return;

      // add message to interface
      const userMessage = {
        id:
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15),
        text: messageText,
        user: true,
      };

      messages.value.push(userMessage);

      // send message to backend
      try {
        loading.value = true;
        const response = await axios.post(
          `${server_url}/chat`,
          {
            chat: {
              prompt: messageText,
              chatId: sessionStorage.getItem("chatId"),
            },
          },
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        setTimeout(() => {
          messages.value.push(response.data.bot_res);
        }, 2000);

        // auto scroll page to the bottom
        const container = document.querySelector(".chat-interface");
        container.scrollTop = container.scrollHeight;

        messageInput.value = "";
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred while sending the message."
        );
      }
      loading.value = false;
      disabled.value = false;
    };

    // initialize chat
    const initChat = async () => {
      try {
        const response = await axios.get(`${server_url}/chat/init`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        // console.log(response.data.chat);
        sessionStorage.setItem("chatId", response.data.chat);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred during chat initialization."
        );
      }
    };

    // get current chat
    const getChat = async () => {
      try {
        const authHeader = `Bearer ${sessionStorage.getItem("token")}`;

        const chatId = sessionStorage.getItem("chatId");
        const response = await axios.get(`${server_url}/chat/${chatId}`, {
          headers: {
            Authorization: authHeader,
          },
        });
        // console.log(response.data.data);
        let chats = response.data.chat;
        if (response.data.chat.length === 0) {
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

    // get chat history
    const getHistory = async () => {
      try {
        const response = await axios.get(`${server_url}/chat/history`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });

        const data = response.data.chats;

        for (let chat of data) {
          history.value.push({
            chatId: chat.chat_id,
            date: formatDate(chat.date_created.split("T")[0]),
          });
        }
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred while fetching the chat history."
        );
      }
    };

    // display menu
    const toggleMenu = () => {
      menu.value = !menu.value;
    };

    // start new chat
    const newChat = () => {
      sessionStorage.removeItem("chatId");
      // history.value = [];
      initChat();
      messages.value = [];
      router.push("/chat");
    };

    // date converter
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    const handleKeyPress = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (loading.value) return;
        sendMessage();
      }
    };


    const logout = () => {
      sessionStorage.clear();
      router.push("/");
    };

    onMounted(async () => {
      const userId = sessionStorage.getItem("userId");
      // check if user is logged in
      if (!userId || userId === "undefined") {
        router.push("/");
        return;
      }

      // check if chat is initialized
      const chatId = sessionStorage.getItem("chatId");
      if (!chatId || chatId === "undefined") {
        initChat();
      } else {
        getChat();
      }

      // get chat history
      getHistory();

      window.addEventListener("keydown", handleKeyPress);
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", handleKeyPress);
    });

    return {
      messageInput,
      messages,
      sendMessage,
      logo,
      disabled,
      loading,
      chatLoader,
      toggleMenu,
      menu,
      history,
      newChat,
      logout
    };
  },
};
</script>

<style>
.chat-interface {
  height: 83%;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
