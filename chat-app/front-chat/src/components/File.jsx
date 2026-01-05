import React, { useState } from "react";

const FileSelector = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  return (
    <div className="p-4 dark:bg-gray-800 min-h-screen text-white">
      <h2 className="text-xl font-bold mb-4">Select a file from your device</h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
      />

      {selectedFile && (
        <div className="mt-2">
          <p><strong>File Name:</strong> {selectedFile.name}</p>
          <p><strong>File Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
          <p><strong>File Type:</strong> {selectedFile.type}</p>
        </div>
      )}
    </div>
  );
};

export default FileSelector;
