import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { GalleryItem, getGalleryItems } from "../entities/GalleryItem";
import { alertService } from "../services/alert.service";

const Home = (): JSX.Element => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryLength] = useState(0);

  useEffect(() => {
    getGalleryItems()
      .then((items) => {
        setGalleryItems(items);
      })
      .catch((error) => {
        console.error(`error getting gallery items: ${error}`);
        alertService.error(`Error getting gallery items: ${error}`, false);
      });
  }, [galleryLength]);

  return (
    <>
      <div className="mx-auto my-0">
        <div className="min-h-60">
          <p className="font-bold text-xl text-center py-8">
            “If you can design one thing, you can design everything.” &mdash;
            Massimo Vignelli
          </p>
        </div>

        <div className="flex flex-wrap">
          {galleryItems.map((item) => (
            <div className="w-full xl:w-1/2">
              <div
                className="bg-cover bg-center bg-no-repeat"
                data-src={`/images/${item.thumbnail}`}
                style={{
                  backgroundImage: `url("/images/${item.thumbnail}")`,
                }}
              >
                <NavLink
                  to={`/project/${item.name}`}
                  className="opacity-0 hover:opacity-70 hover:bg-black block relative overflow-hidden pb-2/3 transition"
                >
                  <div className="absolute box-border max-w-xs h-full p-5">
                    <h2 className="text-white mb-0 font-bold text-2xl">
                      {item.title}
                    </h2>
                    <p className="text-white text-xl">{item.caption}</p>
                  </div>
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
