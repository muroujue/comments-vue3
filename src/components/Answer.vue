<script setup>
import { ref } from 'vue'
const $emit = defineEmits(['submit'])

const props = defineProps({
  type: String,
  currentUser: Object
})

const myComment = ref('')

const submitComment = () => {
  $emit('submit', myComment.value)
  myComment.value = ''
}
</script>

<template>
  <div class="answer-area">
    <img :src="currentUser.image.png" />
    <el-input v-model="myComment" :rows="3" type="textarea" placeholder="Add a comment..." />
    <el-button @click="submitComment">{{ type === 'answer' ? 'SEND' : 'REPLY' }}</el-button>
  </div>
</template>

<style scoped lang="scss">
.answer-area {
  width: 40rem;
  background: var(--color-white);
  border-radius: 0.7rem;
  padding: 1.5rem;
  display: flex;
  img {
    width: 2.2rem;
    height: 2.2rem;
  }
  .el-textarea {
    margin: 0 0.8rem;
  }
  .el-button {
    background: var(--color-primary);
    border: none;
    color: var(--color-white);
    &:hover {
      background: var(--color-primary-light);
    }
  }
}
</style>
