import React, { useState,useEffect,useContext} from "react";
import { WalletContext } from '../context/WalletContext';
import { FaFileAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import axios from "axios";

const KnowledgeVault = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state, account } = useContext(WalletContext);
  const {kcontract} = state



  // State management
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [resources,setResources] = useState([])

  // ResourceCategory enum values
  const resourceCategories = [
    { value: 0, label: "E-Book" },
    { value: 1, label: "Video" },
    { value: 2, label: "Podcast" },
    { value: 3, label: "Article" },
  ];


  const availableTags = [
    "Tech",
    "Culture",
    "Education",
    "Health",
    "Science",
    "Art",
    "Music",
    "Finance",
    "History",
    "Design",
    "Sports",
    "Politics",
    "Business",
    "Nature",
    "Travel",
    "Innovation",
    "Web3",
    "Gaming",
    "AI & Machine Learning",
    "Blockchain",
    "Startup",
    "Environment",
    "Food",
    "Entrepreneurship",
    "Social Impact",
    "Philosophy",
    "Psychology",
    "Literature",
    "Film & Media",
    "Lifestyle",
    "Parenting",
    "Fitness",
    "Technology Trends",
    "Personal Development",
    "Marketing",
    "Venture Capital",
    "Artificial Intelligence",
    "Space Exploration",
    "Coding",
    "Programming",
    "Digital Art",
    "NFTs",
    "Design Thinking",
    "Sustainability",
    "Education Technology",
    "Smart Cities",
    "Cryptocurrency",
  ];



  const handleNewTag = () => {
    if (newTag && !availableTags.includes(newTag)) {
      availableTags.push(newTag);
      setSelectedTags((prev) => [...prev, newTag]);
      setNewTag("");
    }
  };

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFileChange = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `35cb1bf7be19d2a8fa0d`,
            pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
            "Content-Type": "multipart/form-data",
          },
        });
        const resData = await res.data;
        setFile(`https://ipfs.io/ipfs/${resData.IpfsHash}`);
        toast.success("Successfully Uploaded to IPFS.")
      } catch (error) {
        console.error("Error uploading file to IPFS", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      _title: title,
      _description: description,
      _tags: selectedTags,
      _category: category, // This will now be a number (0, 1, 2, or 3)
      _file: file,
    });
    const tx = await kcontract.submitResource(title, file, description, selectedTags, category);
    await tx.wait();
    console.log(tx);
    toast.success("Upload Success");
    setIsModalOpen(false);
  };
  const fetchResources = async () => {
    try {
      const rCount = await kcontract.resourceCount(); // Fetch resource count
      const resources = [];
      for (let i = 1; i <= rCount; i++) {
        const resource = await kcontract.resources(i); // Fetch resource details
        resources.push({
          id: resource[0].toString(),
          title: resource[1],
          url: resource[2],
          description: resource[3],
          category: resource[4].toString(),
          contributor: resource[5],
          upvotes: resource[6].toString(),
          downvotes: resource[7].toString(),
          approved: resource[8],
        });
      }
      setResources(resources); // Set resources in state
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };
  const sliceAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const handleUpvote = async (id) => {
    try {
        const tx = await kcontract.upvoteResource(id)
        await tx.wait()
        toast.success("Upvoted Successfully")
    } catch (error) {
        console.log(error)
    }

  }
  const handleDownvote = async (id) => {
    try {
        const tx = await kcontract.downvoteResource(id)
        await tx.wait()
        toast.success("Upvoted Successfully")
    } catch (error) {
        console.log(error)
    }

  }
  useEffect(() => {
    fetchResources()
  }, )



  return (
    <div>
    {/* Button to open the modal */}
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={() => setIsModalOpen(true)}
    >
      Submit Resource
    </button>

    {/* Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg w-3/4 max-h-[80vh] p-6 shadow-lg overflow-hidden">
          <h2 className="text-2xl font-bold mb-4">Submit Resource</h2>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 p-2">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                {/* Title Input */}
                <div>
                  <label htmlFor="title" className="block font-medium mb-1">
                    Title:
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Description Input */}
                <div className="col-span-2">
                  <label htmlFor="description" className="block font-medium mb-1">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="3"
                    required
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label htmlFor="fileUpload" className="block font-medium mb-1">
                    File Upload:
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                    accept=".pdf,.docx,.png,.jpg"
                    required
                  />
                </div>

                {/* Tags Dropdown */}
                <div>
                  <label htmlFor="tags" className="block font-medium mb-1">
                    Tags:
                  </label>
                  <div className="relative">
                    <div className="border rounded p-2 bg-gray-50 flex items-center justify-between cursor-pointer">
                      <span>
                        {selectedTags.length > 0
                          ? `${selectedTags.length} tag(s) selected`
                          : "Select tags"}
                      </span>
                    </div>
                    <div className="absolute bg-white border rounded shadow-lg mt-2 w-full max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                      {availableTags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center px-3 py-2 hover:bg-gray-100"
                        >
                          <input
                            type="checkbox"
                            id={tag}
                            value={tag}
                            checked={selectedTags.includes(tag)}
                            onChange={() => handleTagChange(tag)}
                            className="mr-2"
                          />
                          <label htmlFor={tag} className="text-gray-800">
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                    {/* Add New Tag */}
                    <div className="mt-2 flex">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        className="flex-grow p-2 border rounded mr-2"
                        placeholder="Add new tag"
                      />
                      <button
                        type="button"
                        onClick={handleNewTag}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category Dropdown */}
                <div>
  <label htmlFor="category" className="block font-medium mb-1">
    Category:
  </label>
  <select
    id="category"
    value={category}
    onChange={(e) => setCategory(Number(e.target.value))} // Convert to number
    className="w-full p-2 border rounded bg-gray-50"
    required
  >
    <option value="" disabled>
      Select a category
    </option>
    {resourceCategories.map((cat) => (
      <option key={cat.value} value={cat.value}>
        {cat.label}
      </option>
    ))}
  </select>
</div>

              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-2"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )}
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
  {resources.map((resource) => (
    <div
      key={resource.id}
      className="bg-white shadow-md rounded-lg p-4 border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
      {/* SVG Icon at the top */}
      <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-t-lg">
                <FaFileAlt className="text-gray-500 text-6xl" />
              </div>

      {/* Card Content */}
      <h3 className="text-xl font-bold mb-2 text-gray-800">{resource.title}</h3>
      <p className="text-gray-700 text-sm mb-2">
        <span className="font-semibold">Description:</span> {resource.description}
      </p>
      <p className="text-gray-700 text-sm mb-2">
        <span className="font-semibold">Category:</span> {resource.category}
      </p>
      <p className="text-gray-700 text-sm mb-2">
        <span className="font-semibold">Contributor:</span> {sliceAddress(resource.contributor)}
      </p>
      <p className="text-gray-700 text-sm mb-2">
        <span className="font-semibold">Upvotes:</span> {resource.upvotes} |{" "}
        <span className="font-semibold">Downvotes:</span> {resource.downvotes}
      </p>
      <p className="text-gray-700 text-sm mb-2">
        <span className="font-semibold">Approved:</span> {resource.approved ? "Yes" : "No"}
      </p>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline text-sm hover:text-blue-700"
      >
        View Resource
      </a>

      {/* Upvote and Downvote Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handleUpvote(resource.id)}
          className="bg-green-500 text-white text-sm py-1 px-4 rounded hover:bg-green-600"
        >
          Upvote
        </button>
        <button
          onClick={() => handleDownvote(resource.id)}
          className="bg-red-500 text-white text-sm py-1 px-4 rounded hover:bg-red-600"
        >
          Downvote
        </button>
      </div>
    </div>
  ))}
</div>
<ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

  </div>




  );
};

export default KnowledgeVault;
