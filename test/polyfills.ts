/**
 * Browser APIs jsdom lacks. Loaded as the first setup file, before anything
 * imports react-dom, because React picks its event names when it loads.
 */

// Without AnimationEvent, React listens for `webkitAnimationEnd` instead of
// `animationend`, so `fireEvent.animationEnd` never reaches `onAnimationEnd`.
if (typeof window !== "undefined" && !("AnimationEvent" in window)) {
  class AnimationEventPolyfill extends Event {
    readonly animationName: string;
    readonly elapsedTime: number;
    readonly pseudoElement: string;

    constructor(type: string, init: AnimationEventInit = {}) {
      super(type, init);
      this.animationName = init.animationName ?? "";
      this.elapsedTime = init.elapsedTime ?? 0;
      this.pseudoElement = init.pseudoElement ?? "";
    }
  }

  Object.defineProperty(window, "AnimationEvent", {
    value: AnimationEventPolyfill,
    writable: true,
    configurable: true,
  });
}
