import { useState } from "react";

const CarGallery = ({ images = [], title }) => {
  const [active, setActive] = useState(0);
  const fallback = [
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80",
  ];
  const list = images.length ? images : fallback.map((url) => ({ url }));

  return (
    <div>
      <div className="aspect-[16/10] overflow-hidden rounded-xl2 bg-gray-100 dark:bg-gray-800">
        <img
          src={list[active]?.url}
          alt={title}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1000&q=80";
          }}
          className="h-full w-full object-cover"
        />
      </div>
      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {list.map((img, i) => (
            <button
              type="button"
              key={img.fileId || i}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                active === i ? "border-primary-600" : "border-transparent"
              }`}
            >
              <img
                src={img.url}
                alt={`${title} ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarGallery;
