export const HOME_CAMPUS_IMAGE = {
  src: "/images/optimized/classroom-rainbow-preschool.webp",
  alt: "Rainbow Preschool campus",
  width: 400,
  height: 300,
} as const;

export const HOME_HERO_IMAGE = {
  src: "/images/optimized/hero-banner-1.webp",
  alt: "",
  width: 1200,
  height: 675,
} as const;

// Unique editorial images used on the homepage. The visitor page repeats the
// campus photo in desktop/mobile layouts and loops the filmstrip twice; the
// bot copy emits each tuple only once.
export const HOME_FILMSTRIP_IMAGES = [
  { src: "/images/gallery/rainbow-preschool-classroom-activity-01.webp", alt: "Rainbow Preschool classroom moment" },
  { src: "/images/gallery/rainbow-preschool-classroom-learning-01.webp", alt: "Rainbow Preschool classroom moment" },
  { src: "/images/gallery/rainbow-preschool-activity-room-01.webp", alt: "Rainbow Preschool classroom moment" },
  { src: "/images/gallery/rainbow-preschool-learning-through-play-01.webp", alt: "Rainbow Preschool classroom moment" },
  { src: "/images/gallery/rainbow-preschool-classroom-activity-02.webp", alt: "Rainbow Preschool classroom moment" },
  { src: "/images/gallery/rainbow-preschool-classroom-learning-02.webp", alt: "Rainbow Preschool classroom moment" },
  { src: "/images/gallery/rainbow-preschool-activity-room-02.webp", alt: "Rainbow Preschool classroom moment" },
  { src: "/images/gallery/rainbow-preschool-learning-through-play-02.webp", alt: "Rainbow Preschool classroom moment" },
] as const;

export const HOME_PROGRAMME_IMAGES = [
  { src: "/images/optimized/playgroup-child-toy-car.webp", alt: "Playgroup" },
  { src: "/images/optimized/nursery-girl-drawing.webp", alt: "Nursery" },
  { src: "/images/optimized/kindergarten-kids-colorful-mats.webp", alt: "Kindergarten" },
  { src: "/images/optimized/happy-times-daycare-kids.webp", alt: "Happy Times" },
] as const;

export const CENTRE_CARD_IMAGES = {
  manpada: { src: "/images/centres/manpada.webp", alt: "Rainbow Preschool Manpada centre, Thane", width: 400, height: 200 },
  hariniwas: { src: "/images/centres/hariniwas.webp", alt: "Rainbow Preschool Hariniwas centre, Thane", width: 400, height: 200 },
  "anand-nagar": { src: "/images/centres/anand-nagar.webp", alt: "Rainbow Preschool Anand Nagar centre, Thane", width: 400, height: 200 },
  dhokali: { src: "/images/centres/dhokali.webp", alt: "Rainbow Preschool Dhokali centre, Thane", width: 400, height: 200 },
  kalwa: { src: "/images/centres/kalwa.webp", alt: "Rainbow Preschool Kalwa centre, Thane", width: 400, height: 200 },
  kasarvadavali: { src: "/images/centres/kasarvadavali.webp", alt: "Rainbow Preschool Kasarvadavali centre, Thane", width: 400, height: 200 },
} as const;

type ProgrammeGalleryImage = { src: string; alt?: string; width: number; height: number };

export const PROGRAMME_GALLERY_IMAGES = {
  playgroup: [
    { src: "/images/optimized/DSC00002.webp", alt: "Toddler playing at Rainbow Preschool playgroup", width: 400, height: 400 },
    { src: "/images/optimized/DSC00070.webp", alt: "Happy kids at playgroup", width: 400, height: 400 },
    { src: "/images/optimized/DSC00051.webp", alt: "Children playing with colorful toys at Rainbow Preschool", width: 400, height: 400 },
    { src: "/images/optimized/DSC00175.webp", alt: "Toddler learning with educational toys", width: 400, height: 400 },
    { src: "/images/optimized/DSC00177.webp", alt: "Child playing at playgroup", width: 400, height: 400 },
  ],
  nursery: [
    { src: "/images/optimized/DSC00010.webp", width: 400, height: 400 },
    { src: "/images/optimized/DSC00011.webp", width: 400, height: 400 },
    { src: "/images/optimized/DSC00147.webp", width: 400, height: 400 },
    { src: "/images/optimized/DSC00192.webp", width: 400, height: 400 },
    { src: "/images/optimized/DSC00229.webp", width: 400, height: 400 },
  ],
  kindergarten: [
    { src: "/images/optimized/DSC00054.webp", width: 400, height: 400 },
    { src: "/images/optimized/DSC00146.webp", width: 400, height: 400 },
    { src: "/images/optimized/DSC00002.webp", width: 400, height: 400 },
    { src: "/images/optimized/DSC00070.webp", width: 400, height: 400 },
    { src: "/images/optimized/DSC00175.webp", width: 400, height: 400 },
  ],
} as const satisfies Record<"playgroup" | "nursery" | "kindergarten", readonly ProgrammeGalleryImage[]>;

export const PLAY_SCHOOL_GALLERY_IMAGES = [
  { src: "/images/optimized/DSC00002.webp", alt: "Children playing at Rainbow Preschool play school classroom", width: 400, height: 400 },
  { src: "/images/optimized/DSC00070.webp", alt: "Toddlers in play school activities", width: 400, height: 400 },
  { src: "/images/optimized/DSC00051.webp", alt: "Play school sensory activities for toddlers", width: 400, height: 400 },
  { src: "/images/optimized/play-school-classroom.webp", alt: "Rainbow Preschool space-themed classroom with colourful furniture", width: 400, height: 400 },
  { src: "/images/optimized/kid-playing-rainbow.webp", alt: "Toddler playing with stacking rings at Rainbow play school", width: 400, height: 400 },
  { src: "/images/optimized/rainbow-students-classroom.webp", alt: "Rainbow Preschool students smiling in classroom", width: 400, height: 400 },
] as const;