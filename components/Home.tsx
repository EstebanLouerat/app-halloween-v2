import Image from "next/image";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <div className=" flex h-screen justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-80">
        <Image
          src={"/assets/dbd_logo.png"}
          priority={true}
          alt={"logo"}
          width="500"
          height="500"
          className="invert"
        />
        <button
          className="text-6xl font-bold text-white bg-black 
        bg-opacity-50 px-10 py-5 rounded-lg"
          onClick={() => router.push("/g")}
        >
          Play
        </button>
      </div>
    </div>
  );
};

export default Home;
