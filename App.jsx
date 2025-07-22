import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("https://upload-search-template.onrender.com/upload/", formData);
    setContent(res.data.content);
  };

  const search = async () => {
    const formData = new FormData();
    formData.append("query", query);
    formData.append("content", content);
    const res = await axios.post("https://upload-search-template.onrender.com/search/", formData);
    setResults(res.data.results);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-xl space-y-4">
        <h1 className="text-2xl font-bold">Upload & Search File</h1>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={uploadFile} className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>

        <input
          type="text"
          placeholder="Search query..."
          className="w-full border rounded p-2 mt-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={search} className="bg-green-600 text-white px-4 py-2 rounded mt-2">Search</button>

        <div className="mt-4">
          <h2 className="font-semibold">Results:</h2>
          <ul className="list-disc list-inside">
            {results.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;