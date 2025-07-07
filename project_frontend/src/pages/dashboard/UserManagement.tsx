import { useState, useEffect } from "react";
import { Users, Plus, Search, Mail, UserCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import * as api from "../../services/api";
import { User } from "../../types/models";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import AddUserForm from "./AddUserForm";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await api.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      return;
    }

    try {
      await api.deleteUser(id);
      toast.success("Utilisateur supprimé avec succès");
      loadUsers();
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleBlock = async (id: string) => {
    try {
      await api.toggleBlockUser(id);
      toast.success("Statut de blocage modifié !");
      loadUsers();
    } catch {
      toast.error("Erreur lors du blocage/déblocage");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-primary-100 text-primary-800";
      case "pharmacien":
        return "bg-success-100 text-success-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrateur";
      case "pharmacien":
        return "Pharmacien";
      default:
        return role;
    }
  };

  if (isLoading) {
    return <LoadingSpinner className="h-screen" />;
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Users className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des utilisateurs
          </h1>
        </div>
        <button
          className="flex items-center px-4 py-2 text-white transition-colors duration-200 rounded-lg bg-primary-600 hover:bg-primary-700"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter un utilisateur
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Rôle
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserCircle className="w-8 h-8 text-gray-400" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.nom}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <button
                      className="mr-4 text-primary-600 hover:text-primary-900"
                      onClick={() => handleEdit(user)}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-error-600 hover:text-error-900"
                    >
                      Supprimer
                    </button>
                    <button
                      onClick={() => handleBlock(user._id)}
                      className={`ml-4 ${
                        user.isBlocked ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {user.isBlocked ? "Débloquer" : "Bloquer"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Ajouter un utilisateur</h2>
            <AddUserForm
              onSuccess={() => {
                setShowAddModal(false);
                loadUsers();
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </div>
        </div>
      )}

      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Modifier l'utilisateur</h2>
            <AddUserForm
              user={editingUser}
              onSuccess={() => {
                setShowEditModal(false);
                setEditingUser(null);
                loadUsers();
              }}
              onCancel={() => {
                setShowEditModal(false);
                setEditingUser(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
