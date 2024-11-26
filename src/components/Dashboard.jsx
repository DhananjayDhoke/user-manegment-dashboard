import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../Utils/Loader";
import { BASEURL } from "../Utils/Constant";
import EditPopup from "./EditPopup";
import AddUserPopup from "./AddUserPopup";

const Dashboard = () => {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddUserPopup, setShowAddUserPopup] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const usersPerPage = 5;

  const [editData, setEditData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
  });
  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
  });
  const handleEditClick = (userDate) => {
    // from data extract name, email, and phone
    const editUserData = {
      id: userDate.id,
      name: userDate.name,
      email: userDate.email,
      phone: userDate.phone,
    };
    setEditData(editUserData);
    setShowEditPopup(true);
  };

  const handleAddUser = async () => {
    setShowAddUserPopup(true);
  };

  const handelSaveUserData = async () => {
    if (!newUser.name || !newUser.email || !newUser.phone) {
      alert("Please fill all details");
      return;
    }
    try {
      const response = await axios.post(`${BASEURL}/users`, newUser);
      console.log("New User added:", response.data);
      setUsers((prevUsers) => [...prevUsers, response.data]);
      alert("User added successfully!");
      setNewUser({ id: "", name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. Please try again.");
    } finally {
      setShowAddUserPopup(false);
    }
  };

  const handleEditUser = async () => {
    if (!editData.name || !editData.email || !editData.phone) {
      alert("Please fill all details");
      return;
    }
    try {
      const response = await axios.patch(
        `${BASEURL}/users/${editData.id}`,
        editData
      );
      console.log("Response from API:", response.data);

      // setting updated data manually
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editData.id ? { ...user, ...editData } : user
        )
      );
      alert("User details updated successfully!");
      setEditData({ id: "", name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user details. Please try again.");
    } finally {
      setShowEditPopup(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await axios.delete(`${BASEURL}/users/${userId}`);
      alert("User deleted successfully!");
      // Remove the user from userlist
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASEURL}/users`);
      setUsers(response.data);
    } catch (err) {
      if (err.response) {
        setError(`Error: ${err.response.status} - ${err.response.data}`);
      } else if (err.request) {
        setError("Error: No response received from the server.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate index for current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <Loader message={"Loading users..."} />;
  }

  if (error) {
    return <div className="text-center mt-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <button
        onClick={handleAddUser}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Add User
      </button>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="px-4 py-2 border rounded-lg w-full"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white text-left">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((userData) => (
              <tr
                key={userData.id}
                className="even:bg-gray-100 hover:bg-blue-50"
              >
                <td className="px-4 py-3 border-b border-gray-200">
                  {userData.name}
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  {userData.email}
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  {userData.phone}
                </td>
                <td className="px-4 py-3 border-b border-gray-200">
                  <Link
                    to={`/userDetails/${userData.id}`}
                    className="px-3 py-1 mr-2 text-sm text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white"
                  >
                    Info
                  </Link>
                  <button
                    className="px-3 py-1 mr-2 text-sm text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-white"
                    onClick={() => handleEditClick(userData)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 text-sm text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white"
                    onClick={() => handleDelete(userData.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
          }`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageClick(index + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
          }`}
        >
          Next
        </button>
      </div>
      {/* Edit Popup */}
      {showEditPopup && (
        <EditPopup
          editData={editData}
          setEditData={setEditData}
          onSave={handleEditUser}
          onClose={() => setShowEditPopup(false)}
        />
      )}

      {/* Add User Popup */}
      {showAddUserPopup && (
        <AddUserPopup
          newUser={newUser}
          setNewUser={setNewUser}
          onAdd={handelSaveUserData}
          onClose={() => setShowAddUserPopup(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
