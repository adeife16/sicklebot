<template>
    <form @submit.prevent="handleSubmit" 
    :class="['rounded', formClass]">
      <slot></slot>
    </form>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    props: {
      formClass: {
        type: String,
        default: ''
      }
    },
    setup(props, { emit }) {
      const handleSubmit = () => {
        emit('formSubmit');
      };
  
      return {
        handleSubmit
      };
    }

  });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>  