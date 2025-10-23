import { useState } from "react";
import ServiceCard from "./ServiceCard";

const SAMPLE = [
  {
    id: 1,
    title: "Figma Designer",
    description:
      "We are looking for figma designers who can help designing the entire mobile application ...",
    logo: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=80&h=80&fit=crop&crop=faces",
    tags: ["UI Designer", "Figma", "Landing Page"],
    type: "Paruh Waktu",
    updated: "1 Hari Lalu",
    location: "Remote",
    price: "$2500/month",
  },
  {
    id: 2,
    title: "Figma Designer",
    description:
      "We are looking for figma designers who can help designing the entire mobile application ...",
    logo: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=80&h=80&fit=crop&crop=faces",
    tags: ["UI Designer", "Figma", "Landing Page"],
    type: "Paruh Waktu",
    updated: "1 Hari Lalu",
    location: "Remote",
    price: "$2500/month",
  },
  {
    id: 3,
    title: "Figma Designer",
    description:
      "We are looking for figma designers who can help designing the entire mobile application ...",
    logo: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=80&h=80&fit=crop&crop=faces",
    tags: ["UI Designer", "Figma", "Landing Page"],
    type: "Paruh Waktu",
    updated: "1 Hari Lalu",
    location: "Remote",
    price: "$2500/month",
  },
  {
    id: 4,
    title: "Figma Designer",
    description:
      "We are looking for figma designers who can help designing the entire mobile application ...",
    logo: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=80&h=80&fit=crop&crop=faces",
    tags: ["UI Designer", "Figma", "Landing Page"],
    type: "Paruh Waktu",
    updated: "1 Hari Lalu",
    location: "Remote",
    price: "$2500/month",
  },
  {
    id: 5,
    title: "Figma Designer",
    description:
      "We are looking for figma designers who can help designing the entire mobile application ...",
    logo: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=80&h=80&fit=crop&crop=faces",
    tags: ["UI Designer", "Figma", "Landing Page"],
    type: "Paruh Waktu",
    updated: "1 Hari Lalu",
    location: "Remote",
    price: "$2500/month",
  },
  {
    id: 6,
    title: "Figma Designer",
    description:
      "We are looking for figma designers who can help designing the entire mobile application ...",
    logo: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=80&h=80&fit=crop&crop=faces",
    tags: ["UI Designer", "Figma", "Landing Page"],
    type: "Paruh Waktu",
    updated: "1 Hari Lalu",
    location: "Remote",
    price: "$2500/month",
  },
  {
    id: 7,
    title: "Figma Designer",
    description:
      "We are looking for figma designers who can help designing the entire mobile application ...",
    logo: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=80&h=80&fit=crop&crop=faces",
    tags: ["UI Designer", "Figma", "Landing Page"],
    type: "Paruh Waktu",
    updated: "1 Hari Lalu",
    location: "Remote",
    price: "$2500/month",
  },
  {
    id: 8,
    title: "Figma Designer",
    description:
      "We are looking for figma designers who can help designing the entire mobile application ...",
    logo: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=80&h=80&fit=crop&crop=faces",
    tags: ["UI Designer", "Figma", "Landing Page"],
    type: "Paruh Waktu",
    updated: "1 Hari Lalu",
    location: "Remote",
    price: "$2500/month",
  },
];

export default function BlockListSection() {
  const [showAll, setShowAll] = useState(false);

  const data = showAll ? SAMPLE : SAMPLE.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Block List</h2>
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-sm font-medium text-neutral-700 underline-offset-2 hover:underline"
          aria-label="View All"
        >
          View All
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <ServiceCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
