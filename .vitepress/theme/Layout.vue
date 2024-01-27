<script setup>
import DefaultTheme from 'vitepress/theme'
import LogoParallax from './LogoParallax.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-image>
      <LogoParallax class="w-full h-full" />
    </template>
  </DefaultTheme.Layout>
</template>

<style>
.VPHero .image-bg {
  display: none;
}

.VPHero .image-container {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}
</style>
