import React from "react";
import Image from "next/image";
import voyageImg from "../Assets/voyage.jpg";
import boy_with_laptop_imageImg from "../Assets/boy_with_laptop_image.png";
import girl_with_headphone_imageImg from "../Assets/girl_with_headphone_image.png";

const products = [
  {
    id: 1,
    image: girl_with_headphone_imageImg,
    title: "Your Next Adventure Awaits",
    description: "Find What You Love, Rent What You Need.",
  },
  {
    id: 2,
    image: boy_with_laptop_imageImg,
    title: "Rent with Ease, Live in Style",
    description: "Find Your Perfect Product, Book Your Dream Stay.",
  },
  {
    id: 3,
    image: girl_with_headphone_imageImg,
    title: "Discover Your Perfect Product",
    description: "Discover, Shop, and Rent – Everything You Need.",
  },
];
const redirect_iconImg = require("../Assets/redirect_icon.svg");

const FeaturedOption = () => {
  return (
    <div className=" items-center">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured</p>
        <div className="w-16 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map(({ id, image, title, description }) => (
          <div key={id} className="relative group">
            <Image
              src={image}
              alt={title}
              className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
            />
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
              <p className="font-medium text-xl lg:text-2xl">{title}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60">
                {description}
              </p>
              <button className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded">
                Shop now <Image className="h-3 w-3" src={redirect_iconImg} alt="Redirect Icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedOption;
