import React, { useContext, useState, useEffect } from 'react';
import { WalletContext } from '../context/WalletContext';
import axios from 'axios';
import { ethers } from 'ethers';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Events = () => {
  const { state, account } = useContext(WalletContext);
  const { kcontract } = state;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [cost, setCost] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);

  // Handle IPFS file upload
  const handleIPFS = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
          headers: {
            pinata_api_key: `35cb1bf7be19d2a8fa0d`,
            pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
            'Content-Type': 'multipart/form-data',
          },
        });
        const resData = res.data;
        setCoverImage(`https://ipfs.io/ipfs/${resData.IpfsHash}`);
        toast.success("Uploaded to IPFS")
      } catch (error) {
        console.error('Error uploading file to IPFS', error);
        setError('Failed to upload image. Please try again.');
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    if (!title || !description || !date || !cost || !coverImage) {
      setError('Please fill in all the fields.');
      setIsSubmitting(false);
      return;
    }
    try {
      const tx = await kcontract.createEvent(
        title,
        description,
        date,
        coverImage,
        ethers.parseEther(cost)
      );
      await tx.wait(); // Wait for transaction confirmation
      setShowModal(false); // Close modal
      // Clear form fields
      setTitle('');
      setDescription('');
      setDate('');
      setCost('');
      setCoverImage(null);

      displayEvents(); // Refresh events
      toast.success("Submission Successful")
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayEvents = async () => {
    try {
      const count = await kcontract.eventCount();
      const eventPromises = [];

      for (let index = 1; index <= count; index++) {
        eventPromises.push(kcontract.events(index));
      }

      const eventResults = await Promise.all(eventPromises);
      const fetchedEvents = eventResults.map((event, idx) => ({
        id: idx + 1,
        title: event[1],
        description: event[2],
        date: event[3],
        coverImage: event[4],
        cost: ethers.formatEther(event[5]),
      }));
    //   console.log(fetchedEvents)

      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };
  const handleBuyTicket=async(id)=>{
    try {
        const tx = await kcontract.bookEvent(id)
        await tx.wait()
        toast.success("Bought Successfully")


    } catch (error) {
        console.log(error)

    }
  }


  // Fetch events on component mount
  useEffect(() => {
    if (kcontract) {
      displayEvents();
    }
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setShowModal(true)}
      >
        Create Event
      </button>



      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Create Event</h2>
            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              {/* Date */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* Cost */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Cost (in ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>

              {/* Cover Image */}
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Cover Image</label>
                <input type="file" accept="image/*" onChange={handleIPFS} />
                {coverImage && <img src={coverImage} alt="Cover Preview" className="mt-2 w-32 h-32 rounded" />}
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 mb-4">{error}</p>}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-blue-500 text-white rounded ${isSubmitting ? 'opacity-50' : 'hover:bg-blue-600'}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="mt-6">
  <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {events.map((event) => (
  <div key={event.id} className="border rounded-lg p-4 shadow">
    <img src={event.coverImage} alt={event.title} className="w-full h-48 object-cover rounded" />
    <h3 className="text-xl font-bold mt-2">{event.title}</h3>
    <p className="text-gray-600 mt-2">{event.description}</p>
    <p className="text-sm text-gray-500 mt-2">Date: {event.date}</p>
    <p className="text-lg font-bold text-blue-600 mt-2">Cost: {event.cost} Tokens</p>
    <button
      className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      onClick={() => handleBuyTicket(event.id)}
    >
      Buy Tickets
    </button>
  </div>
))}

  </div>
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

export default Events;
