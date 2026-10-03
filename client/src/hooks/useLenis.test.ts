import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getLenis, useLenis } from "./useLenis";

const mocks = vi.hoisted(() => ({ instances: [] as Array<{ raf: ReturnType<typeof vi.fn>; destroy: ReturnType<typeof vi.fn>; options: unknown }> }));
vi.mock("lenis", () => ({
  default: class {
    raf = vi.fn();
    destroy = vi.fn();
    constructor(public options: unknown) {
      mocks.instances.push(this);
      document.documentElement.classList.add("lenis", "lenis-smooth");
    }
  },
}));

afterEach(() => {
  vi.restoreAllMocks();
  mocks.instances.length = 0;
  document.body.innerHTML = "";
});

function setup(reduced = false) {
  const motion = { matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn() };
  vi.spyOn(window, "matchMedia").mockReturnValue(motion as unknown as MediaQueryList);
  const frames: FrameRequestCallback[] = [];
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frames.push(callback);
    return frames.length;
  });
  const cancel = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
  document.body.innerHTML = '<div class="wt-page"><div style="overflow-y:auto" id="playlist"></div><div data-lenis-prevent id="map"></div></div>';
  return { motion, frames, cancel };
}

describe("dummy-only Lenis lifecycle", () => {
  it("uses the requested options and one RAF loop; fully restores page state", () => {
    const { frames, cancel } = setup();
    document.documentElement.style.setProperty("scroll-behavior", "smooth", "important");
    const hook = renderHook(useLenis);
    const instance = mocks.instances[0];
    expect(instance.options).toEqual({ lerp: 0.1, smoothWheel: true, syncTouch: false, wheelMultiplier: 1 });
    expect(getLenis()).toBe(instance);
    expect(frames).toHaveLength(1);
    frames[0](123);
    expect(instance.raf).toHaveBeenCalledWith(123);
    expect(frames).toHaveLength(2);
    expect(document.documentElement.style.scrollBehavior).toBe("auto");
    expect(document.querySelector("#playlist")).toHaveAttribute("data-lenis-prevent");
    hook.unmount();
    expect(cancel).toHaveBeenCalledWith(2);
    expect(instance.destroy).toHaveBeenCalledOnce();
    expect(getLenis()).toBeNull();
    expect(document.documentElement.className).not.toMatch(/lenis/);
    expect(document.documentElement.style.getPropertyValue("scroll-behavior")).toBe("smooth");
    expect(document.documentElement.style.getPropertyPriority("scroll-behavior")).toBe("important");
    expect(document.querySelector("#playlist")).not.toHaveAttribute("data-lenis-prevent");
    expect(document.querySelector("#map")).toHaveAttribute("data-lenis-prevent");
    document.documentElement.style.removeProperty("scroll-behavior");
  });

  it("never starts under reduced motion and responds to preference changes", () => {
    const { motion, frames } = setup(true);
    const hook = renderHook(useLenis);
    expect(mocks.instances).toHaveLength(0);
    expect(frames).toHaveLength(0);
    expect(getLenis()).toBeNull();
    const change = motion.addEventListener.mock.calls[0][1];
    act(() => { motion.matches = false; change(); });
    expect(mocks.instances).toHaveLength(1);
    act(() => { motion.matches = true; change(); });
    expect(mocks.instances[0].destroy).toHaveBeenCalledOnce();
    expect(getLenis()).toBeNull();
    hook.unmount();
    expect(motion.removeEventListener).toHaveBeenCalledWith("change", change);
  });

  it("protects lazy-mounted inner scrollers without changing shared widgets", async () => {
    setup();
    const hook = renderHook(useLenis);
    const dialog = document.createElement("div");
    dialog.style.overflow = "auto";
    await act(async () => { document.querySelector(".wt-page")!.append(dialog); });
    expect(dialog).toHaveAttribute("data-lenis-prevent");
    hook.unmount();
    expect(dialog).not.toHaveAttribute("data-lenis-prevent");
  });

  it("protects Theatre portal drawers but leaves unrelated body content alone", async () => {
    setup();
    const hook = renderHook(useLenis);
    const backdrop = document.createElement("div");
    backdrop.className = "rainbow-theatre__drawer-backdrop";
    const drawer = document.createElement("div");
    drawer.style.overflow = "auto";
    backdrop.append(drawer);
    const unrelated = document.createElement("div");
    unrelated.style.overflow = "auto";
    await act(async () => { document.body.append(backdrop, unrelated); });
    expect(drawer).toHaveAttribute("data-lenis-prevent");
    expect(unrelated).not.toHaveAttribute("data-lenis-prevent");
    hook.unmount();
    expect(drawer).not.toHaveAttribute("data-lenis-prevent");
  });
});