import { DbdGenerator } from "@/pages/api/generators";
import cuid from "cuid";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";

type MenuProps = {
  generators: DbdGenerator[];
};

const Menu: React.FC<MenuProps> = ({ generators }) => {
  const router = useRouter();

  if (!generators) {
    return <>There is no generator</>;
  }

  const [generatorsArray, setGeneratorsArray] = useState<DbdGenerator[]>(
    Object.values(generators) || []
  );

  const addGen = () => {
    const newGenerator: DbdGenerator = {
      id: cuid(),
      name: "Test",
      timeLeft: 90,
    };

    console.log(newGenerator);

    setGeneratorsArray((prev) => [...prev, newGenerator]);
  };

  return (
    <div
      className="h-screen w-screen"
      style={{ backgroundColor: "var(--color-grey-900-transparent)" }}
    >
      <div className="flex items-start justify-center h-[35svh]">
        <h1 className="text-4xl text-white mt-20 mb-6">
          Gérer les générateurs
        </h1>
      </div>

      <div className="flex flex-col items-center">
        <button
          className="bg-blue-500 text-white text-lg px-6 py-3 rounded mb-4 hover:bg-blue-600 transition"
          // onClick={() => router.push(`/g/add`)}
          onClick={() => addGen()}
        >
          Ajouter
        </button>
        <div className="h-[50vh] w-full overflow-y-scroll items-center justify-start flex flex-col">
          {generatorsArray.map((gen) => (
            <div key={gen.id} className="flex items-center mb-4">
              <button
                className="bg-gray-800 text-white text-lg px-4 py-2 rounded mr-2 hover:bg-gray-700 transition w-40 h-16"
                onClick={() => router.push(`/g/${gen.id}`)}
              >
                {gen.name}
              </button>
              <button
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
                onClick={() => {}}
              >
                <MdEdit size={32} />
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                onClick={() => {
                  /* Logique pour supprimer le générateur */
                }}
              >
                <MdDelete size={32} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
