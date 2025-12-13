import { Star } from 'lucide-react';

const StarRatingPlaceholder = () => {
  return (
    <div className="flex-col items-start gap-1 flex">
      <div className="flex gap-1">
        <button className="animate-pulse relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 rounded cursor-pointer  ">
          <Star className={`w-5 h-5 text-gray-300`} />
        </button>
        <button className="animate-pulse relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 rounded cursor-pointer  ">
          <Star className={`w-5 h-5 text-gray-300`} />
        </button>
        <button className="animate-pulse relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 rounded cursor-pointer  ">
          <Star className={`w-5 h-5 text-gray-300 `} />
        </button>
        <button className="animate-pulse relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 rounded cursor-pointer  ">
          <Star className={`w-5 h-5 text-gray-300 `} />
        </button>
        <button className="animate-pulse relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 rounded cursor-pointer  ">
          <Star className={`w-5 h-5 text-gray-300 `} />
        </button>
      </div>
    </div>
  );
};

export default StarRatingPlaceholder;
