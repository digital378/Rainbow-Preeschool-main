export type WalkthroughScene = {
  index: number;
  key: string;
  name: string;
  restTime: number;
  still: {
    mobile: string;
    desktop: string;
  };
};

export const SCENES: WalkthroughScene[] = [
  {
    index: 0,
    key: "gate",
    name: "The Gate",
    restTime: 0,
    still: {
      mobile: "/walkthrough/scenes/mobile/scene-1.webp",
      desktop: "/walkthrough/scenes/desktop/scene-1.webp",
    },
  },
  {
    index: 1,
    key: "reception",
    name: "Reception",
    restTime: 5.0417,
    still: {
      mobile: "/walkthrough/scenes/mobile/scene-2.webp",
      desktop: "/walkthrough/scenes/desktop/scene-2.webp",
    },
  },
  {
    index: 2,
    key: "corridor",
    name: "The Corridor",
    restTime: 10.0833,
    still: {
      mobile: "/walkthrough/scenes/mobile/scene-3.webp",
      desktop: "/walkthrough/scenes/desktop/scene-3.webp",
    },
  },
  {
    index: 3,
    key: "classroom",
    name: "The Classroom",
    restTime: 15.125,
    still: {
      mobile: "/walkthrough/scenes/mobile/scene-4.webp",
      desktop: "/walkthrough/scenes/desktop/scene-4.webp",
    },
  },
  {
    index: 4,
    key: "playground",
    name: "The Playground",
    restTime: 20.1667,
    still: {
      mobile: "/walkthrough/scenes/mobile/scene-5.webp",
      desktop: "/walkthrough/scenes/desktop/scene-5.webp",
    },
  },
  {
    index: 5,
    key: "theatre",
    name: "The Rainbow Theatre",
    restTime: 25.2083,
    still: {
      mobile: "/walkthrough/scenes/mobile/scene-6.webp",
      desktop: "/walkthrough/scenes/desktop/scene-6.webp",
    },
  },
  {
    index: 6,
    key: "courtyard",
    name: "The Courtyard",
    restTime: 30.25,
    still: {
      mobile: "/walkthrough/scenes/mobile/scene-7.webp",
      desktop: "/walkthrough/scenes/desktop/scene-7.webp",
    },
  },
  {
    index: 7,
    key: "aerial",
    name: "Across Thane",
    restTime: 35.2917,
    still: {
      mobile: "/walkthrough/scenes/mobile/scene-8.webp",
      desktop: "/walkthrough/scenes/desktop/scene-8.webp",
    },
  },
];

export const DURATION = 35.291667;
export const LAST = 7.5;
export const HOLD = 0.42;