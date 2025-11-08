import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Categories = () => {
  const { navigate } = useAppContext();
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold md:text-4xl">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col items-center justify-center"
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scroll(0, 0);
            }}
          >
            <img
              src={category.image}
              alt={category.text}
              className="group-hover:scale-108 transition-transform max-w-24"
            />
            <p className="text-sm font-medium mt-2">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
