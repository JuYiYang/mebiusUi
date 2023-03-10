import { reactive, ref, watch, createVNode, render } from "vue";
import GuideMaskDom from "../components/Guide/guideMask.vue";

type Guide = {
  elName: string;
  intro: string;
};

type ElInfo = {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const maskDom = ref<HTMLElement>();
// 总步骤
const totalStep = ref<number>(0);
// 当前步骤
const currentStep = ref<number>(-1);
// 步骤中的元素，元素偏移量集合
const elInfo = reactive<ElInfo[]>([]);
// 设置元素，元素偏移量集合
export const useSetGuideEl = async (guide: Guide[]) => {
  try {
    await createdIntroEl();
  } catch (err) {
    console.error(err);
  }
  for (let i = 0; i < guide.length; i++) {
    let el = document.querySelector(guide[i].elName) as Element;
    if (!el) throw new Error("没有找到需要引导的元素");
    let { x, y, width: w, height: h } = el.getBoundingClientRect();
    elInfo.push({
      name: guide[i].elName,
      x,
      y,
      w,
      h,
    });
  }
  totalStep.value = guide.length;
  currentStep.value = 0;
};
// 创建引导元素
const createdIntroEl = () => {
  return new Promise(async (resolve, reject) => {
    let intro = document.querySelector(".intro") as HTMLElement;

    if (intro) {
      window.document.removeChild(intro);
    }
    const div = document.createElement("div");

    document.body.appendChild(div);

    const MyComponentVNode = createVNode(GuideMaskDom);

    await render(MyComponentVNode, div);

    maskDom.value = document.querySelector(".intro") as HTMLElement;

    if (maskDom.value) resolve(true);

    reject("创建引导元素失败！！！");
  });
};
// 开始引导
export const useConductGuide = (step: number) => {
  maskDom.value?.setAttribute(
    "style",
    `
                top: ${elInfo[step].y}px;
                left: ${elInfo[step].x}px;
                width: ${elInfo[step].w}px;
                height: ${elInfo[step].h}px;
            `
  );
};
// currentStep控制行进
watch(
  () => currentStep.value,
  (n) => {
    if (totalStep.value === 0 || !(n >= 0)) return;
    useConductGuide(n);
  },
  { immediate: true }
);

export const useController = () => {
  const nextStep = () => (currentStep.value += 1);
  const lastStep = () => (currentStep.value -= 1);
  const close = () => {
    const body = document.querySelector("body") as HTMLElement;
    const guide = document.querySelector(".guide__intro") as HTMLElement;
    body.removeChild(guide);
  };
  return {
    nextStep,
    lastStep,
    currentStep,
    totalStep,
    close,
  };
};
