// Nom du fichier : /pages/gm/allGenerators.tsx
import { useEffect, useState } from "react";
import prisma from "@/lib/prisma";
import { DbdGenerator } from "../api/generators";

type GeneratorStatus = {
  id: string;
  name: string;
  timeLeft: number;
  isActif: boolean;
  progress: number;
};

const AllGeneratorsPage = () => {
  const [generators, setGenerators] = useState<GeneratorStatus[]>([]);
  const [genDone, setGenDone] = useState<number>();
  const [totaleGen, setTotalGen] = useState<number>();

  // Fonction pour récupérer les générateurs depuis l'API
  const fetchGenerators = async () => {
    try {
      const response = await fetch("/api/generators/all");
      const data = await response.json();
      setGenerators(data.generators);
      setGenDone(data.totalGenDone);
      setTotalGen(data.totalGen);
    } catch (error) {
      console.error("Erreur lors du fetch des générateurs:", error);
    }
  };

  // Appel de l'API toutes les 5 secondes pour actualiser la liste des générateurs
  useEffect(() => {
    fetchGenerators(); // Fetch initial
    const interval = setInterval(fetchGenerators, 5000);

    return () => clearInterval(interval); // Nettoyage de l'intervalle au démontage
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Suivi des Générateurs</h1>
      <h3 className="text-2xl font-bold mb-4">
        Totale : {genDone}/{totaleGen}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {generators.map((generator) => (
          <div
            key={generator.id}
            className={`p-4 rounded shadow ${
              generator.timeLeft <= 0 ? "bg-green-600" : "bg-gray-600"
            }`}
          >
            <h2 className="text-xl font-semibold">{generator.name}</h2>
            <p>
              Temps restant :{" "}
              {generator.timeLeft > 0
                ? `${Math.floor(generator.timeLeft / 60)}:${(
                    generator.timeLeft % 60
                  )
                    .toString()
                    .padStart(2, "0")}`
                : "Terminé"}
            </p>
            <p className="mt-2">
              Progression : {generator.progress}%
              <progress
                value={generator.progress}
                max="100"
                className="w-full h-2 mt-1"
              ></progress>
            </p>
            <p className="mt-2">
              Statut : {generator.isActif ? "Actif" : "Inactif"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllGeneratorsPage;
