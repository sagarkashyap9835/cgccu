
import { useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";

const AddRoom = ({ refreshRooms }) => {
  const { token, backendUrl } = useContext(AdminContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rent, setRent] = useState("");
  const [bhkType, setBhkType] = useState("Single Room");
  const [beds, setBeds] = useState(1);
  const [bathroomType, setBathroomType] = useState("Attached");
  const [availableRooms, setAvailableRooms] = useState(1);
  const [ownerName, setOwnerName] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [aadhaarImage, setAadhaarImage] = useState(null);

  const [amenities, setAmenities] = useState({
    wifi: false,
    furnished: false,
    fan: false,
    cooler: false,
    ac: false,
    lightType: "Bulb",
  });

  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Admin login required");

    if (aadhaarNumber.length !== 12) {
      return alert("Aadhaar Number must be exactly 12 digits.");
    }
    if (!aadhaarImage) {
      return alert("Please upload Aadhaar Image for verification.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("rent", rent);
    formData.append("bhkType", bhkType);
    formData.append("beds", beds);
    formData.append("bathroomType", bathroomType);
    formData.append("availableRooms", availableRooms);

    // Append Owner Details
    formData.append("ownerName", ownerName);
    formData.append("aadhaarNumber", aadhaarNumber);
    formData.append("ownerPhone", ownerPhone);
    formData.append("aadhaarImage", aadhaarImage);

    Object.keys(amenities).forEach((key) => {
      formData.append(key, amenities[key]);
    });

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/room/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        alert(res.data.message || "Property submitted for Verification ✅");
        setTitle("");
        setDescription("");
        setRent("");
        setBeds(1);
        setImages([]);
        setOwnerName("");
        setAadhaarNumber("");
        setOwnerPhone("");
        setAadhaarImage(null);
        if (refreshRooms) refreshRooms();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add room ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Add Property (Owner)</h2>
        <p className="text-xs text-center text-gray-500">Submit your property for Admin Verification</p>


        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-sm mb-2 text-blue-800">Owner Verification</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Owner Full Name"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="input text-sm"
              required
            />
            <input
              type="text"
              placeholder="Aadhaar Number (12 Digits)"
              value={aadhaarNumber}
              maxLength={12}
              onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
              className="input text-sm"
              required
            />
            <input
              type="text"
              placeholder="Linked Mobile Number"
              value={ownerPhone}
              maxLength={10}
              onChange={(e) => setOwnerPhone(e.target.value.replace(/\D/g, ''))}
              className="input text-sm"
              required
            />
            <div className="text-xs text-gray-500">Upload Aadhaar Card Image:</div>
            <input
              type="file"
              onChange={(e) => setAadhaarImage(e.target.files[0])}
              className="w-full text-sm"
              accept="image/*"
              required
            />
          </div>
        </div>
        <input
          type="text"
          placeholder="Room Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          required
        />
        <textarea
          placeholder="Room Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input h-24 resize-none"
        />
        <input
          type="number"
          placeholder="Monthly Rent"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          className="input"
          required
        />
        <select value={bhkType} onChange={(e) => setBhkType(e.target.value)} className="input">
          <option>Single Room</option>
          <option>1BHK</option>
          <option>2BHK</option>
          <option>3BHK</option>
        </select>


        <input
          type="number"
          placeholder="Number of Beds"
          value={beds}
          onChange={(e) => setBeds(e.target.value)}
          className="input"
        />
        <select
          value={bathroomType}
          onChange={(e) => setBathroomType(e.target.value)}
          className="input"
        >
          <option>Attached</option>
          <option>Common</option>
        </select>
        <input
          type="number"
          placeholder="Available Rooms"
          value={availableRooms}
          onChange={(e) => setAvailableRooms(e.target.value)}
          className="input"
        />
        <div className="grid grid-cols-2 gap-2 text-sm">
          {["wifi", "furnished", "fan", "cooler", "ac"].map((item) => (
            <label key={item} className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={amenities[item]}
                onChange={(e) =>
                  setAmenities({ ...amenities, [item]: e.target.checked })
                }
              />
              {item.toUpperCase()}
            </label>
          ))}
        </div>
        <select
          value={amenities.lightType}
          onChange={(e) =>
            setAmenities({ ...amenities, lightType: e.target.value })
          }
          className="input"
        >
          <option>Bulb</option>
          <option>Mercury</option>
        </select>
        <div className="space-y-1">
          <span className="text-xs text-gray-500">Property Images (Max 5)</span>
          <input
            type="file"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700"
        >
          Submit for Verification
        </button>
      </form>
      <style>{`
        .input {
          width: 100%;
          border: 1px solid #ccc;
          padding: 12px;
          border-radius: 8px;
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default AddRoom;

