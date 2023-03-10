<template>
  <teleport to="body">
    <div class="guide__intro" ref="maskRef">
      <div class="intro">
        <div class="intro__btn">
          <h3>引导标题</h3>
          <p class="intro__desc">这种艺术真的很难领悟</p>
          <div class="intro__footer">
            <span class="intro__desc"
              >{{ currentStep + 1 }}/{{ totalStep }}</span
            >
            <div class="intro__footer-btn">
              <TButton size="small" @click="close">跳过</TButton>
              <TButton size="small" @click="lastStep" v-if="isLast"
                >上一步</TButton
              >
              <TButton size="small" @click="nextStep" v-if="isNext"
                >下一步</TButton
              >
              <TButton size="small" @click="close" v-if="!isNext">关闭</TButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, toRefs, computed } from "vue";
import type { Ref } from "vue";
import { Button as TButton } from "tdesign-vue-next";
import { useController } from "../../hooks/useGuide";

const maskRef = ref();

const { nextStep, lastStep, currentStep, totalStep, close } = toRefs(
  useController()
);

const isNext = computed(() => currentStep.value + 1 < totalStep.value);

const isLast = computed(() => currentStep.value - 1 >= 0);

defineExpose<{
  maskRef: Ref<any>;
}>({
  maskRef,
});
</script>

<style lang="less">
.guide__intro {
  position: absolute;
  width: 100%;
  height: 100%;

  .intro {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 3;
    width: 0px;
    height: 0px;
    transition: all 0.75s ease-in-out;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.6), 0 0 0 5000px rgba(0, 0, 0, 0.6);
    border-radius: 10px;

    &__btn {
      width: 300px;
      height: 160px;
      position: absolute;
      bottom: -180px;
      right: 0px;
      border-radius: 10px;
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      flex-direction: column;
      padding: 10px 20px;
      background-color: #fff;

      .intro__desc {
        font-size: 12px;
        font-weight: 500;
        line-height: 24px;
        color: #9a9a9a;
      }

      .intro__footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        &-btn {
        }
      }

      .t-button {
        margin: 2px 5px;
      }
    }
  }
}
</style>
