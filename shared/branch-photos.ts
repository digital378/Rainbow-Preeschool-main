export const branchPhotos = {
  "anand-nagar": {
    hero: {
      src: "/images/branches/play-school-thane-classroom-teacher.webp",
      alt: "Rainbow Preschool teacher leading a classroom lesson with children",
    },
    about: {
      src: "/images/branches/preschool-thane-classroom-learning.webp",
      alt: "Children joining a classroom lesson at Rainbow Preschool",
    },
    gallery: [
      {
        src: "/images/branches/preschool-thane-classroom.webp",
        alt: "Bright Rainbow Preschool classroom with blue tables, child-sized chairs and whiteboard",
      },
      {
        src: "/images/branches/play-school-thane-activity-room.webp",
        alt: "Colourful Rainbow play school activity room with toy storage and birthday display",
      },
      {
        src: "/images/branches/playgroup-thane-classroom-play.webp",
        alt: "Two Rainbow Preschool children smiling during a playgroup learning activity",
      },
      {
        src: "/images/branches/preschool-thane-book-character-day.webp",
        alt: "Children dressed as storybook characters for a preschool event",
      },
      {
        src: "/images/branches/preschool-thane-sports-day.webp",
        alt: "Children enjoying outdoor games during preschool sports day",
      },
      {
        src: "/images/branches/preschool-thane-daycare-room.webp",
        alt: "Colourful Rainbow Preschool daycare activity room with child-sized tables and chairs",
      },
    ],
  },
  kalwa: {
    hero: {
      src: "/images/branches/play-school-thane-learning-through-play.webp",
      alt: "Child playing with stacking toys in a Rainbow play school classroom",
    },
    about: {
      src: "/images/branches/preschool-thane-library.webp",
      alt: "Books, toys and a child-sized table in a Rainbow preschool library",
    },
    gallery: [
      {
        src: "/images/branches/nursery-school-thane-classroom.webp",
        alt: "Red tables and a projector in a Rainbow nursery school classroom",
      },
      {
        src: "/images/branches/play-school-thane-learning-room.webp",
        alt: "Colourful desks and an alphabet wall in a Rainbow play school classroom",
      },
      {
        src: "/images/branches/preschool-thane-activity-classroom.webp",
        alt: "Turquoise tables and yellow chairs in a Rainbow preschool classroom",
      },
      {
        src: "/images/branches/playgroup-thane-outdoor-play.webp",
        alt: "Slide, playhouse and toys in a covered Rainbow playgroup area",
      },
      {
        src: "/images/branches/preschool-thane-annual-day.webp",
        alt: "Three children performing on stage at a Rainbow preschool annual day",
      },
      {
        src: "/images/branches/nursery-school-thane-sandwich-activity.webp",
        alt: "Children making sandwiches during a Rainbow nursery school activity",
      },
    ],
  },
} as const;

// Canonical file → owning branch index. New branch pages must register photos here
// rather than silently borrowing from another branch's hero, About or gallery.
export const branchPhotoOwners: Record<string, keyof typeof branchPhotos> = {};
for (const [slug, photos] of Object.entries(branchPhotos)) {
  for (const photo of [photos.hero, photos.about, ...photos.gallery]) {
    if (branchPhotoOwners[photo.src]) {
      throw new Error(`Branch photo ${photo.src} belongs to both ${branchPhotoOwners[photo.src]} and ${slug}`);
    }
    branchPhotoOwners[photo.src] = slug as keyof typeof branchPhotos;
  }
}