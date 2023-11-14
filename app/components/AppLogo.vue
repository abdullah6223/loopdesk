<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
}>(), {
  size: 40,
})
</script>

<template>
  <img
    src="/logo.svg"
    alt="Loopdesk"
    :width="size"
    :height="size"
    class="shrink-0"
  >
</template>
