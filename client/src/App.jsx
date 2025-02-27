import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [titles, setTitles] = useState({});
  const [employeeId, setEmployeeId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Handle multiple file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Handle title change
  const handleTitleChange = (index, value) => {
    setTitles((prevTitles) => ({ ...prevTitles, [index]: value }));
  };

  // Handle employeeId change
  const handleEmployeeIdChange = (event) => {
    setEmployeeId(event.target.value);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !employeeId) {
      alert("Please select files and enter an Employee ID.");
      return;
    }

    const formData = new FormData();
    formData.append("employeeId", employeeId);
    selectedFiles.forEach((file, index) => {
      formData.append("images", file);
      formData.append("titles", titles[index] || "Untitled");
    });

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadedFiles(response.data.employee.images);
      alert("Upload successful!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check console for details.");
    }
  };

  // Fetch uploaded images
  const fetchImages = async () => {
    if (!employeeId) {
      alert("Please enter an Employee ID.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/images/${employeeId}`);
      setUploadedFiles(response.data.images);
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("No images found for this Employee ID.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Images for Employee</h2>
      <input type="text" className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Employee ID" value={employeeId} onChange={handleEmployeeIdChange} />
      <input type="file" multiple accept="image/*" className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={handleFileChange} />
      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Selected Files:</h3>
          <div className="grid grid-cols-2 gap-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="border p-2 rounded-lg bg-white shadow-md">
                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-32 object-cover rounded" />
                <input type="text" className="w-full p-1 border border-gray-300 rounded mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter Title" value={titles[index] || ""} onChange={(e) => handleTitleChange(index, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-between">
        <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Upload
        </button>
        <button onClick={fetchImages} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Fetch Uploaded Images
        </button>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Uploaded Files:</h3>
          <div className="grid grid-cols-2 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="border p-2 rounded-lg bg-white shadow-md text-center">
                <strong>{file.title}</strong>
                <a href={`http://localhost:5000/${file.path}`} target="_blank" rel="noopener noreferrer" className="block text-blue-500 hover:underline mt-2">
                  View Image
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
