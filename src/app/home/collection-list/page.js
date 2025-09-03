"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productCategories } from "@/app/redux/slices/productSlice";

export default function CollectionsList() {
  const dispatch = useDispatch();
  const { productCategorieData } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(productCategories());
  }, [dispatch]);

  return (
    <section className="bg-white pt-12 pb-10">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-gray-700 text-2xl md:text-3xl font-semibold mb-10">
          Introducing Premium Outfits Of Life Style
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {productCategorieData?.map((item, index) => (
            <Link
              key={index}
              href={`/collections?category=${item.title}`}
              className="group block bg-white shadow hover:shadow-lg transition rounded overflow-hidden"
            >
              <div className="aspect-square w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  width={500}
                  height={500}
                  quality={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 text-center text-gray-800">
                <h3 className="text-lg font-medium">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
