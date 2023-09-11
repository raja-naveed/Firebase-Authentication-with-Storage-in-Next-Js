import React, { useState, useEffect } from "react";
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  updateMetadata,
  getMetadata,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage, auth } from "@/firebase/firebase";

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState([]);

  const handleChange = (e) => setFile(e.target.files[0]);

  const handleUpload = () => {
    console.log("Clicked");
    if (file !== null) {
      const allowedFileTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
      ];
      if (!allowedFileTypes.includes(file.type)) {
        alert("Please select a valid file (JPEG, PNG, GIF, or PDF).");
        return;
      }

      const fileId = v4(); 
      const fileRef = ref(storage, `files/${fileId}`);

      uploadBytes(fileRef, file)
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
                setFileUrl((data) => [...data, { url, type: file.type }]);
                setFile(null); 
              });
            });
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
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
                urls.push({ url, type: metadata.contentType });
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
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold">File Upload</h1>
        </div>
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
            className="mt-1 p-2 w-full border rounded-md"
            accept="image/jpeg, image/png, image/gif, application/pdf"
          />
        </div>
        <div className="mb-6">
          <button
            onClick={handleUpload}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Upload
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {fileUrl.map((file, index) => (
            <div key={index}>
              {file.type.startsWith("image/") ? (
                <img
                  src={file.url}
                  alt={`Image ${index}`}
                  className="rounded-lg max-h-96 mx-auto"
                />
              ) : (
                <embed
                  src={file.url}
                  type="application/pdf"
                  className="w-full h-64"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
