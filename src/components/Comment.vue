<script setup>
import { computed, markRaw, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import Answer from './Answer.vue'
const $emit = defineEmits(['update', 'delete', 'reply'])

const props = defineProps({
  item: Object,
  currentUser: Object,
  upperId: Number || undefined
})

const isEdit = ref(false)

const isReply = ref(false)

const commentCont = ref(props.item.content)

const isMe = computed(() => {
  return props.currentUser.username === props.item.user.username
})

function onReply() {
  isReply.value = true
}

function cancelReply() {
  isReply.value = false
}

function submitReply(commentCont) {
  console.log(props.item.user.username)
  $emit(
    'reply',
    props.item,
    { content: commentCont, replyingTo: props.item.user.username },
    props.upperId
  )
  isReply.value = false
}

function onReduce() {
  if (props.item.score > 0) {
    const newScore = props.item.score - 1
    $emit('update', { ...props.item, score: newScore }, props.upperId)
  }
}

function onAdd() {
  const newScore = props.item.score + 1
  $emit('update', { ...props.item, score: newScore }, props.upperId)
}

function onDelete() {
  ElMessageBox.confirm(
    "Are you sure you want to delete thiscomment? This will remove the commentand can't be undone.",
    'Delete comment',
    {
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'No, Cancel',
      type: 'warning',
      icon: markRaw(Delete)
    }
  ).then(() => {
    // 确定删除
    $emit('delete', props.item.id, props.upperId)
  })
}

function onEdit() {
  isEdit.value = true
}

function submitEdit() {
  $emit('update', { ...props.item, content: commentCont }, props.upperId)
  isEdit.value = false
}
</script>

<template>
  <section>
    <div class="comment-item">
      <div class="pertain">
        <img :src="item.user.image.png" />
        <strong
          >{{ item.user.username }}
          <el-tag v-if="isMe" type="primary" effect="dark" size="small"> you </el-tag>
        </strong>
        <span>{{ item.createdAt }}</span>
      </div>
      <div class="content">
        <span v-if="!isEdit"
          ><strong v-if="item.replyingTo">@{{ item.replyingTo }}</strong
          >{{ item.content }}</span
        >
        <div v-else>
          <el-input
            :formatter="value => `${item.replyingTo ? `@${item.replyingTo} ` : ''}${value}`"
            :parser="value => value.replace(`@${item.replyingTo} `, '')"
            v-model="commentCont"
            :rows="4"
            type="textarea"
            placeholder="Add a comment..."
          />
          <div class="update-button"><el-button @click="submitEdit">Update</el-button></div>
        </div>
      </div>
      <div class="bottom-line">
        <div class="score">
          <span @click="onReduce"
            ><el-icon><Minus /></el-icon
          ></span>
          <strong>{{ item.score || 0 }}</strong>
          <span @click="onAdd"
            ><el-icon><Plus /></el-icon
          ></span>
        </div>
        <div class="button-box" v-if="!isMe">
          <el-button class="primary-button" @click="onReply" :text="true"
            ><el-icon><BottomLeft /></el-icon> Reply</el-button
          >
        </div>
        <div class="button-box" v-else>
          <el-button class="danger-button" :disabled="isEdit" @click="onDelete" :text="true"
            ><el-icon><Delete /></el-icon> Delete</el-button
          >
          <el-button class="primary-button" :disabled="isEdit" @click="onEdit" :text="true"
            ><el-icon><EditPen /></el-icon> Edit</el-button
          >
        </div>
      </div>
    </div>
    <div class="reply-item" v-if="isReply">
      <Answer type="reply" :currentUser="props.currentUser" @submit="submitReply" />
      <span @click="cancelReply" class="cancel-button">
        <el-icon><Close /></el-icon>
      </span>
    </div>
  </section>
</template>

<style scoped lang="scss">
section {
  margin-bottom: 1rem;
}
.reply-item {
  position: relative;
  margin-top: 0.5rem;
  border-radius: 0.7rem;
  overflow: hidden;
  .cancel-button {
    position: absolute;
    right: -2rem;
    bottom: -2rem;
    cursor: pointer;
    width: 4rem;
    height: 4rem;
    border-radius: 100%;
    padding: 0.65rem 0 0 0.7rem;
    background: var(--color-background-mute);
  }
}
.comment-item {
  position: relative;
  width: 40rem;
  min-height: 8.5rem;
  background: var(--color-white);
  border-radius: 0.7rem;
  padding: 1.5rem 1.5rem 1.5rem 5rem;
  .pertain {
    display: flex;
    align-items: center;
    img {
      width: 1.8rem;
      margin-right: 1rem;
    }
    strong {
      font-weight: bold;
      margin-right: 1rem;
      .el-tag--dark.el-tag--primary.el-tag--small {
        background: var(--color-primary);
        border: none;
        color: var(--color-white);
        height: 16px;
      }
    }
    span {
      color: var(--color-light-text);
    }
  }
  .content {
    margin-top: 0.8rem;
    strong {
      color: var(--color-primary);
      font-weight: bold;
      margin-right: 0.5rem;
    }
    .update-button {
      text-align: right;
      margin-top: 0.5rem;
      .el-button {
        background: var(--color-primary);
        border: none;
        color: var(--color-white);
        &:hover {
          background: var(--color-primary-light);
        }
      }
    }
  }
  .button-box {
    position: absolute;
    right: 1rem;
    top: 1.5rem;
    .primary-button {
      color: var(--color-primary);
      &:hover {
        color: var(--color-primary-light);
      }
    }
    .danger-button {
      color: var(--color-danger);
      &:hover {
        color: var(--color-danger-light);
      }
    }
  }

  .score {
    position: absolute;
    left: 1.5rem;
    top: 1.5rem;
    border-radius: 5px;
    background: var(--color-background);
    display: flex;
    flex-direction: column;
    width: 2rem;
    span {
      cursor: pointer;
      height: 2rem;
      width: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        font-size: 0.8rem;
        color: var(--color-light-text);
      }
      &:hover {
        i {
          color: var(--color-primary);
        }
      }
    }
    strong {
      width: 2rem;
      font-weight: bold;
      text-align: center;
      color: var(--color-primary);
    }
  }
}

@media (max-width: 1024px) {
  .comment-item {
    padding: 1.5rem;
    .bottom-line {
      margin-top: 0.5rem;
      display: flex;
      justify-content: space-between;
    }
    .score {
      position: static;
      flex-direction: row;
      width: 6rem;
      height: 2rem;
      strong {
        height: 2rem;
        line-height: 2rem;
      }
    }
    .button-box {
      position: static;
    }
  }
}
</style>
