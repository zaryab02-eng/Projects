import type { GalleryImage, GalleryCategory } from "@/types";

export const galleryCategories: GalleryCategory[] = [
  "Workshop",
  "Tools",
  "Restoration Process",
  "Repair Work",
  "Finished Projects",
  "Accessories",
];

export const galleryImages: GalleryImage[] = [
  {
    id: "g-01",
    src: "/workShop1.jpg",
    alt: "Workbench in the workshop",
    category: "Workshop",
  },
  {
    id: "g-02",
    src: "/tools2.jpg",
    alt: "Hand tools laid out on leather",
    category: "Tools",
  },
  {
    id: "g-03",
    src: "/restore1.jpg",
    alt: "Craftsman polishing a barrel",
    category: "Restoration Process",
  },
  {
    id: "g-04",
    src: "/repair1.jpg",
    alt: "Trigger mechanism repair in progress",
    category: "Repair Work",
  },
  {
    id: "g-05",
    src: "/finished2.jpg",
    alt: "Finished restored shotgun on display",
    category: "Finished Projects",
  },
  {
    id: "g-06",
    src: "/acce1.jpg",
    alt: "Leather gun case and cleaning kit",
    category: "Accessories",
  },
  {
    id: "g-07",
    src: "/tools1.jpg",
    alt: "Rows of precision files and rasps",
    category: "Tools",
  },
  // {
  //   id: "g-08",
  //   src: "https://picsum.photos/seed/workshop-08/700/500",
  //   alt: "Wooden stock being hand-sanded",
  //   category: "Restoration Process",
  // },
  {
    id: "g-09",
    src: "/workShop2.jpg",
    alt: "Front facade of the workshop",
    category: "Workshop",
  },
  {
    id: "g-10",
    src: "/repair2.jpg",
    alt: "Scope being mounted on a rifle",
    category: "Repair Work",
  },
  {
    id: "g-11",
    src: "/restore3.jpg",
    alt: "Bluing tank in the metal finishing bay",
    category: "Restoration Process",
  },
  {
    id: "g-12",
    src: "/finished1.jpg",
    alt: "Completed restoration lined up for pickup",
    category: "Finished Projects",
  },
];
