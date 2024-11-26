import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { BASEURL } from "../Utils/Constant";
import Loader from "../Utils/Loader";

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // fetch the user details
  const getUserDetails = async () => {
    try {
      const response = await axios.get(`${BASEURL}/users/${id}`);
      setUser(response.data);
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
    getUserDetails();
  }, [id]);

  if (loading) {
    return <Loader message={"Loading user details..."} />;
  }

  if (error) {
    return <div className="text-center mt-4 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-4 text-gray-500">No user found.</div>;
  }

  const handelNavigate = () => {
    navigate("/");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg md:mt-4">
      <div
        onClick={handelNavigate}
        className="px-4 py-1 text-2xl text-white bg-indigo-300 rounded-md w-fit cursor-pointer"
      >
        <FaArrowAltCircleLeft />
      </div>
      <h1 className="text-2xl font-bold text-blue-500 mb-4 mt-2">
        User Details
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <span className="block font-semibold text-gray-700">Name:</span>
          <p className="text-gray-800">{user.name}</p>
        </div>
        <div>
          <span className="block font-semibold text-gray-700">Username:</span>
          <p className="text-gray-800">{user.username}</p>
        </div>
        <div>
          <span className="block font-semibold text-gray-700">Email:</span>
          <p className="text-gray-800">{user.email}</p>
        </div>
        <div>
          <span className="block font-semibold text-gray-700">Phone:</span>
          <p className="text-gray-800">{user.phone}</p>
        </div>
        <div>
          <span className="block font-semibold text-gray-700">Website:</span>
          <p className="text-gray-800">
            <a
              href={`http://${user.website}`}
              target="_blank"
              className="text-blue-500 underline"
            >
              {user.website}
            </a>
          </p>
        </div>
        <div>
          <span className="block font-semibold text-gray-700">Company:</span>
          <p className="text-gray-800">{user.company.name}</p>
          <p className="text-gray-600 text-sm">{user.company.catchPhrase}</p>
        </div>
        <div>
          <span className="block font-semibold text-gray-700">Address:</span>
          <p className="text-gray-800">{`${user.address.suite}, ${user.address.street}, ${user.address.city}`}</p>
          <p className="text-gray-600 text-sm">{`Zip: ${user.address.zipcode}`}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
