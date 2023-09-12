import React, { useState, useEffect } from "react";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  updateMetadata,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage, auth } from "@/firebase/firebase";

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState([]);

  const handleChange = (e) => setFile([...e.target.files]);
  const fileId = v4();

  const handleUpload = () => {
    console.log("Clicked");
    if (file.length > 0) { // Check if there are selected files
      const allowedFileTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ];
  
      file.forEach((selectedFile) => {
        if (!allowedFileTypes.includes(selectedFile.type)) {
          alert("Please select a valid file (JPEG, PNG, GIF, or PDF).");
          return;
        }
  
        const fileId = v4();
        const fileRef = ref(storage, `files/${fileId}`);
  
        uploadBytes(fileRef, selectedFile)
          .then((snapshot) => {
            console.log("File uploaded:", snapshot);
  
            const user = auth.currentUser;
            if (user) {
              const metadata = {
                customMetadata: {
                  uploadedBy: user.uid,
                },
              };
              updateMetadata(fileRef, metadata).then(() => {
                console.log("File metadata updated with user UID:", user.uid);
  
                getDownloadURL(fileRef).then((url) => {
                  setFileUrl((data) => [
                    ...data,
                    { url, type: selectedFile.type, id: fileId },
                  ]);
                });
              });
            }
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
          });
      });
  
      setFile([]); // Clear the selected files after uploading
    }
  };
  

  const handleDeleteFile = (indexToDelete) => {
    // Retrieve the file reference from storage using the indexToDelete
    const fileToDelete = fileUrl[indexToDelete];

    // Extract the fileId from the fileToDelete object
    const fileIdToDelete = fileToDelete.id;

    // Create a reference to the file in Firebase Storage
    const fileRef = ref(storage, `files/${fileIdToDelete}`); // Use the correct fileId

    // Delete the file from Firebase Storage
    deleteObject(fileRef)
      .then(() => {
        console.log("File deleted successfully.");

        // Create a copy of the current fileUrl array
        const updatedFileUrl = [...fileUrl];

        // Remove the file at the specified index
        updatedFileUrl.splice(indexToDelete, 1);

        // Update the state with the modified array
        setFileUrl(updatedFileUrl);
      })
      .catch((error) => {
        console.error("Error deleting file:", error);
      });
  };

  useEffect(() => {
    listAll(ref(storage, "files"))
      .then((files) => {
        const urls = [];
        const user = auth.currentUser;

        files.items.forEach((item) => {
          getMetadata(item).then((metadata) => {
            if (user && metadata.customMetadata.uploadedBy === user.uid) {
              getDownloadURL(item).then((url) => {
                urls.push({ url, type: metadata.contentType, id: item.name });
                setFileUrl(urls);
              });
            }
          });
        });
      })
      .catch((error) => {
        console.error("Error listing files:", error);
      });
  }, []);

  return (
    <div className=" flex items-center w-full flex-col justify-center">
      <div className="md:w-1/2 mb-6 md:mb-0">
        <div className="mb-6">
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select a File (Image or PDF)
          </label>
          <input
            type="file"
            id="file"
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept="image/jpeg, image/png, image/gif, application/pdf"
            multiple // Add the multiple attribute here
          />
        </div>
        <div className="mb-6">
          <button
            onClick={handleUpload}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Upload
          </button>
        </div>
      </div>
      <div className="md:w-1/2 grid  gap-4">
        {fileUrl.map((file, index) => (
          <div
            key={index}
            className="mb-4 p-4 border border-gray-200 rounded-lg"
          >
            <div className="relative">
              {file.type.startsWith("image/") ? (
                <img
                  src={file.url}
                  alt={`Image ${index}`}
                  className="rounded-lg mx-auto"
                />
              ) : (
                <embed
                  src={file.url}
                  type="application/pdf"
                  className="w-full h-64"
                />
              )}
              <button
                onClick={() => handleDeleteFile(index)}
                className="absolute top-0 right-0 bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                *{" "}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageUpload;
