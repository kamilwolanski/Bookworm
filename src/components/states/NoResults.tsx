import Image from 'next/image';
import noresultimg from '@/app/assets/no-results.png';
const NoResults = () => {
  return (
    <div className="mx-auto flex flex-col justify-center items-center">
      <Image src={noresultimg} alt="noresults" width={500} />
      <div className="text-center">
        <h2 className="font-bold text-3xl text-primary">
          NIE ZNALEZIONO ŻADNYCH KSIĄŻEK
        </h2>
        <p className="text-2xl font-semibold mt-5 text-foreground">
          Spróbuj zmienić kryteria <br /> wyszukiwania lub odznaczyć filtry
        </p>
      </div>
    </div>
  );
};

export default NoResults;
