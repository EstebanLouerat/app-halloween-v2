import axios from "axios";
import {
  NotificationStatus,
  useNotification,
} from "@/contexts/NotificationContext";
import { DbdGenerator } from "@/pages/api/generators";
import { saveGeneratorToLocalStorage } from "@/utils/localStorage";
import cuid from "cuid";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";

type MenuProps = {
  generators: DbdGenerator[];
};

const Menu: React.FC<MenuProps> = ({ generators }) => {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [generatorsArray, setGeneratorsArray] = useState<DbdGenerator[]>(
    Object.values(generators) || []
  );
  const [newGeneratorName, setNewGeneratorName] = useState<string>("");
  const [editingGenerator, setEditingGenerator] = useState<DbdGenerator | null>(
    null
  );

  const [creatingGenerator, setCreatingGenerator] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<{
    id: string;
    isActif: boolean;
  } | null>(null);

  if (!generators) {
    return <>There is no generator</>;
  }

  const handleAddGenerator = () => {
    if (!newGeneratorName) {
      showNotification("Faut donner un nom avant.", NotificationStatus.DANGER);
      return;
    }

    if (newGeneratorName.toLowerCase().includes("caca")) {
      showNotification(
        "Non tu fais rire personne sale chien",
        NotificationStatus.ERREUR
      );
      return;
    }

    axios
      .post("/api/generators", {
        name: newGeneratorName,
        settingsName: "Default",
      })
      .then(() => {
        showNotification(
          "Generator created successfully!",
          NotificationStatus.SUCCESS
        );
        setNewGeneratorName("");
        setCreatingGenerator(false);
        router.reload();
      })
      .catch((error) => {
        showNotification(
          `Error creating generator: ${error}`,
          NotificationStatus.ERREUR
        );
      });
  };

  const handleEditGenerator = (id: string) => {
    if (!editingGenerator || editingGenerator.name === "") {
      showNotification("Faut donner nom valide stp", NotificationStatus.DANGER);
      return;
    }

    if (editingGenerator.name.toLowerCase().includes("caca")) {
      showNotification(
        "Vasy frr fais un effort grandi un peu",
        NotificationStatus.DANGER
      );
      return;
    }

    axios
      .put(`/api/generators`, {
        ...editingGenerator,
      })
      .then(() => {
        showNotification(
          "Generator name updated successfully!",
          NotificationStatus.SUCCESS
        );
        setEditingGenerator(null);
        router.reload();
      })
      .catch((error) => {
        showNotification(
          `Error updating generator: ${error}`,
          NotificationStatus.ERREUR
        );
      });
  };

  const handleDeleteGenerator = (id: string, isActif: boolean) => {
    if (isActif) {
      setShowDeleteModal({ id, isActif });
    } else {
      confirmDelete(id);
    }
  };

  const confirmDelete = (id: string) => {
    axios
      .delete(`/api/generators?id=${id}`)
      .then(() => {
        showNotification(
          "Generator deleted successfully!",
          NotificationStatus.SUCCESS
        );
        setShowDeleteModal(null);
        router.reload();
      })
      .catch((error) => {
        showNotification(
          `Error deleting generator: ${error}`,
          NotificationStatus.ERREUR
        );
      });
  };

  const handleSelectGenerator = (id: string, isActif: boolean) => {
    if (!isActif) {
      saveGeneratorToLocalStorage(id);
      router.push(`/g/${id}`);
    } else {
      showNotification("Déjà utilisé", NotificationStatus.DANGER);
    }
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
          onClick={() => setCreatingGenerator(true)}
        >
          Ajouter
        </button>

        <div className="h-[50vh] w-full overflow-y-scroll items-center justify-start flex flex-col">
          {generatorsArray.map((gen) => (
            <div key={gen.id} className="flex items-center mb-4">
              <button
                className="bg-gray-800 text-white text-lg px-4 py-2 rounded mr-2 hover:bg-gray-700 transition w-40 h-16 items-center justify-between"
                onClick={() => handleSelectGenerator(gen.id, gen.isActif)}
              >
                <span>{gen.name}</span>
                {gen.isActif && (
                  <span className="ml-2 w-4 h-4 bg-green-500 rounded-full animate-pulse inline-block"></span>
                )}
              </button>
              <button
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
                onClick={() => setEditingGenerator(gen)}
              >
                <MdEdit size={32} />
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                onClick={() => handleDeleteGenerator(gen.id, gen.isActif)}
              >
                <MdDelete size={32} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal pour la confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className=" p-6 rounded text-black">
            <p>T&apos;es sûre tu veux delete fais gaffe quand même</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => confirmDelete(showDeleteModal.id)}
              >
                Oui tkt bg
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowDeleteModal(null)}
              >
                Nan enfaite j&apos;ai un mini sexe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour la modification du nom */}
      {editingGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-opacity-80 bg-black p-6 rounded">
            <input
              className="mb-4 p-2 border bg-gray-800 text-white border-gray-300 rounded w-full"
              type="text"
              value={editingGenerator.name}
              onChange={(e) =>
                setEditingGenerator({
                  ...editingGenerator,
                  name: e.target.value,
                })
              }
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => handleEditGenerator(editingGenerator.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 px-4 py-2 rounded"
                onClick={() => setEditingGenerator(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {creatingGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-opacity-80 bg-black p-6 rounded">
            <input
              className="mb-4 p-2 border bg-gray-800 text-white  border-gray-300 rounded"
              type="text"
              placeholder="Nom du générateur"
              value={newGeneratorName}
              onChange={(e) => setNewGeneratorName(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => handleAddGenerator()}
              >
                Créer
              </button>
              <button
                className="bg-red-500 px-4 py-2 rounded"
                onClick={() => setCreatingGenerator(false)}
              >
                Je suis gay refouler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
