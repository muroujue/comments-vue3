<script setup>
import data from '../data/data.json'
import Comment from './Comment.vue'
import Answer from './Answer.vue'
import { computed, ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const commentsData = ref(data)
const increaseId = ref(5)

const currentUser = computed(() => {
  return commentsData.value.currentUser
})

const addNewComment = commentCont => {
  const newComment = {
    id: increaseId.value,
    content: commentCont,
    user: currentUser.value,
    score: 0,
    createdAt: 'today',
    replies: []
  }
  commentsData.value = {
    ...commentsData.value,
    comments: [...commentsData.value.comments, newComment]
  }
  increaseId.value++
}

const updateComment = comment => {
  const index = proxy.$R.findIndex(proxy.$R.propEq(comment.id, 'id'), commentsData.value.comments)
  const comments = proxy.$R.update(index, comment, commentsData.value.comments)
  commentsData.value = { ...commentsData.value, comments }
}

const updateReply = (comment, upperId) => {
  const upperCommentIndex = proxy.$R.findIndex(
    proxy.$R.propEq(upperId, 'id'),
    commentsData.value.comments
  )
  const upperComment = commentsData.value.comments[upperCommentIndex]
  const replyIndex = proxy.$R.findIndex(proxy.$R.propEq(comment.id, 'id'), upperComment.replies)
  const replies = proxy.$R.update(replyIndex, comment, upperComment.replies)
  const newComments = proxy.$R.update(
    upperCommentIndex,
    { ...upperComment, replies },
    commentsData.value.comments
  )
  commentsData.value = { ...commentsData.value, comments: newComments }
}

const deleteComment = commentId => {
  const index = proxy.$R.findIndex(proxy.$R.propEq(commentId, 'id'), commentsData.value.comments)
  if (index > -1) {
    const comments = proxy.$R.remove(index, 1, commentsData.value.comments)
    commentsData.value = { ...commentsData.value, comments }
  }
}

const deleteReply = (commentId, upperId) => {
  const upperCommentIndex = proxy.$R.findIndex(
    proxy.$R.propEq(upperId, 'id'),
    commentsData.value.comments
  )
  const upperComment = commentsData.value.comments[upperCommentIndex]
  const replyIndex = proxy.$R.findIndex(proxy.$R.propEq(commentId, 'id'), upperComment.replies)
  if (replyIndex > -1) {
    const replies = proxy.$R.remove(replyIndex, 1, upperComment.replies)
    const newComments = proxy.$R.update(
      upperCommentIndex,
      { ...upperComment, replies },
      commentsData.value.comments
    )
    commentsData.value = { ...commentsData.value, comments: newComments }
  }
}

const addReply = (comment, replyObject) => {
  const newReply = {
    id: increaseId.value,
    user: currentUser.value,
    score: 0,
    createdAt: 'today',
    ...replyObject
  }
  const index = proxy.$R.findIndex(proxy.$R.propEq(comment.id, 'id'), commentsData.value.comments)
  const newComment = { ...comment, replies: [...comment.replies, newReply] }
  const comments = proxy.$R.update(index, newComment, commentsData.value.comments)
  commentsData.value = { ...commentsData.value, comments }
  increaseId.value++
}

const appendReply = (comment, replyObject, upperId) => {
  const upperCommentIndex = proxy.$R.findIndex(
    proxy.$R.propEq(upperId, 'id'),
    commentsData.value.comments
  )
  const upperComment = commentsData.value.comments[upperCommentIndex]
  const newReply = {
    id: increaseId.value,
    user: currentUser.value,
    score: 0,
    createdAt: 'today',
    ...replyObject
  }
  const newComment = { ...upperComment, replies: [...upperComment.replies, newReply] }
  const comments = proxy.$R.update(upperCommentIndex, newComment, commentsData.value.comments)
  commentsData.value = { ...commentsData.value, comments }
  increaseId.value++
}
</script>

<template>
  <div class="app-wrapper">
    <div class="comment-area">
      <div class="comment-box" v-for="item in commentsData.comments" :key="item.id">
        <Comment
          :item="item"
          :currentUser="currentUser"
          @update="updateComment"
          @delete="deleteComment"
          @reply="addReply"
        />
        <div class="reply-area" v-if="item.replies.length > 0">
          <Comment
            v-for="reply in item.replies"
            :key="reply.id"
            :item="reply"
            :upperId="item.id"
            :currentUser="currentUser"
            @update="updateReply"
            @delete="deleteReply"
            @reply="appendReply"
          />
        </div>
      </div>
    </div>
    <Answer type="answer" :currentUser="currentUser" @submit="addNewComment" />
  </div>
</template>

<style scoped lang="scss">
.app-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.comment-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  .comment-box {
    .reply-area {
      padding-left: 5rem;
      position: relative;
      &::before {
        width: 1px;
        height: 100%;
        content: '';
        position: absolute;
        left: 2.5em;
        top: 0;
        background: var(--color-border);
      }
      ::v-deep .comment-item {
        width: 35rem;
      }
      ::v-deep .reply-item .answer-area {
        width: 35rem;
      }
    }
  }
}
@media (max-width: 1024px) {
  .app-wrapper {
    width: 100%;
  }
  .comment-area {
    .comment-box {
      .reply-area {
        padding-left: 3rem;
        &::before {
          left: 1.5em;
        }
        ::v-deep .comment-item {
          width: 100%;
        }
        ::v-deep .reply-item .answer-area {
          width: 100%;
        }
      }
    }
  }
}
</style>
