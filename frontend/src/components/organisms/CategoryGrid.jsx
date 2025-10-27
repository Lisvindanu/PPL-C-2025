import { motion } from "framer-motion";
import CategoryCard from "../molecules/CategoryCard";

const categories = [
  {
    id: 1,
    title: "Pengembangan Website",
    icon: "fa-code",
    slug: "pengembangan-website",
    gradient: "linear-gradient(135deg, #4782BE 0%, #1D375B 100%)",
  },
  {
    id: 2,
    title: "Pengembangan Aplikasi Mobile",
    icon: "fa-mobile-alt",
    slug: "pengembangan-aplikasi-mobile",
    gradient: "linear-gradient(135deg, #4782BE 0%, #1D375B 100%)",
  },
  {
    id: 3,
    title: "UI/UX Design",
    icon: "fa-pencil-ruler",
    slug: "ui-ux-design",
    gradient: "linear-gradient(135deg, #4782BE 0%, #1D375B 100%)",
  },
  {
    id: 4,
    title: "Data Science & Machine Learning",
    icon: "fa-brain",
    slug: "data-science-machine-learning",
    gradient: "linear-gradient(135deg, #4782BE 0%, #1D375B 100%)",
  },
  {
    id: 5,
    title: "Cybersecurity & Testing",
    icon: "fa-shield-alt",
    slug: "cybersecurity-testing",
    gradient: "linear-gradient(135deg, #4782BE 0%, #1D375B 100%)",
  },
  {
    id: 6,
    title: "Copy Writing",
    icon: "fa-pen-fancy",
    slug: "copy-writing",
    gradient: "linear-gradient(135deg, #4782BE 0%, #1D375B 100%)",
  },
];

export default function CategoryGrid({ onCategoryClick }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-[#D8E3F3]">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#4782BE] to-[#1D375B] bg-clip-text text-transparent">
              Kategori Layanan
            </span>
          </h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Temukan freelancer profesional di berbagai bidang untuk mewujudkan
            proyek Anda
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <CategoryCard
                title={category.title}
                icon={category.icon}
                gradient={category.gradient}
                onClick={() =>
                  onCategoryClick && onCategoryClick(category.slug)
                }
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
