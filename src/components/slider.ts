export function slideUp(target: HTMLElement, duration: number) {
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = `${duration}ms`;
  target.style.boxSizing = "border-box";
  target.style.height = `${target.offsetHeight}px`;

  window.setTimeout(() => {
    target.style.height = "0";
    target.style.paddingTop = "0";
    target.style.paddingBottom = "0";
    target.style.marginTop = "0";
    target.style.marginBottom = "0";
    target.style.overflow = "hidden";

    window.setTimeout(() => {
      target.style.display = "none";
      target.style.removeProperty("height");
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
    }, duration);
  }, 10);
}

export function slideDown(target: HTMLElement, duration: number) {
  target.style.removeProperty("display");
  let { display } = window.getComputedStyle(target);
  if (display === "none") {
    display = "block";
  }
  target.style.display = display;

  const { offsetHeight } = target;
  target.style.height = "0";
  target.style.paddingTop = "0";
  target.style.paddingBottom = "0";
  target.style.marginTop = "0";
  target.style.marginBottom = "0";
  target.style.overflow = "hidden";

  target.style.boxSizing = "border-box";
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = `${duration}ms`;
  window.setTimeout(() => {
    target.style.height = `${offsetHeight}px`;
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");

    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
    }, duration);
  }, 10);
}

export function slideToggle(target: HTMLElement, visible: boolean, duration: number = 500) {
  if (visible) {
    slideUp(target, duration);
  } else {
    slideDown(target, duration);
  }
}
