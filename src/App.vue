<template>
  <v-app class="app">
    <Chatbot></Chatbot>
  </v-app>
</template>

<script>
import Chatbot from "./components/custom/Chatbot";

export default {
  name: "App",
  components: {
    Chatbot
  },
  data() {
    return {};
  },
  methods: {
    openChatbot() {
      console.info($Chatbot);
    }
  }
};
</script>
