import TopBar from "@/components/layout/topBar/TopBar";
import notFound from "@/app/assets/not-found.png";
import Image from 'next/image';
import "./globals.css";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col">
      <TopBar />
      <div className="mx-auto flex flex-col justify-center items-center">
        <Image src={notFound} alt="noresults" width={500} />
        <div className="text-center">
          <h2 className="font-bold text-xl lg:text-3xl text-primary">
            Strona 404.
          </h2>
          <p className="lg:text-2xl font-semibold mt-5 text-foreground">
            Ups… tej strony nie znaleziono.
          </p>
        </div>
      </div>
    </div>
  );
}
