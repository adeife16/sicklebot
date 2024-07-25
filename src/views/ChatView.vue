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
          :class="['flex', message.sender ? 'justify-end' : 'justify-start']"
        >
          <div class="flex items-center">
            <div
              class="rounded-full h-8 w-8 mr-2"
              :class="message.sender ? 'bg-teal-500' : 'bg-orange-500'"
            >
              <i class="fas fa-user-circle text-white"></i>
            </div>
            <div
              class="rounded-lg p-3 max-w-xs"
              :class="message.sender ? 'bg-teal-500' : 'bg-orange-500'"
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
          class="ml-1 rounded-lg bg-orange-500 text-white px-2 py-1"
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
import { Bars3Icon, PaperAirplaneIcon } from "@heroicons/vue/24/solid";
import { ref } from "vue";

export default {
  components: {
    Button,
    Bars3Icon,
    PaperAirplaneIcon,
  },
  setup() {
    const messageInput = ref("");
    const messages = ref([]);
  },
};
</script>

<style>
.chat-interface {
  height: 83%;
}
</style>
