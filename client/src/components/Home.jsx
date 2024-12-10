import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../context/WalletContext'; // Import the WalletContext
import image1 from '../assets/images.jpg'
import image2 from '../assets/image.png'
import axios from "axios"

function Home() {
    const { state, account } = useContext(WalletContext); // Destructure the context

    const [role, setRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [imageURI, setImageURI] = useState('');
    const [profileURI, setProfileURI] = useState('');

    useEffect(() => {
        const fetchRole = async () => {
            if (state.contract && account) {
                setIsLoading(true);
                try {
                    // Fetch member details from the contract
                    const member = await state.contract.members(account);
                    if (member.isTeacher) {
                        setRole('Teacher');
                    } else if (member.isStudent) {
                        setRole('Student');
                    }
                } catch (error) {
                    console.error('Error fetching member details:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchRole();
    }, [state.contract, account]);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const res = await axios({
                    method: 'post',
                    url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
                    data: formData,
                    headers: {
                        pinata_api_key: `35cb1bf7be19d2a8fa0d`,
                        pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const resData = await res.data;
                const uploadedImageURI = `https://ipfs.io/ipfs/${resData.IpfsHash}`;
                setImageURI(uploadedImageURI);
            } catch (error) {
                console.error('Error uploading file to IPFS:', error);
            }
        }
    };

    const registerMember = async (isTeacher) => {
        if (!state.contract || !account) return;

        try {
            // Pin JSON to IPFS
            const data = JSON.stringify({ name, imageURI });
            const res = await axios({
                method: 'post',
                url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
                data,
                headers: {
                    pinata_api_key: `35cb1bf7be19d2a8fa0d`,
                    pinata_secret_api_key: `2c2e9e43bca7a619154cb48e8b060c5643ea6220d0b7c9deb565fa491b3b3a50`,
                    'Content-Type': 'application/json',
                },
            });

            const resData = await res.data;
            const uploadedProfileURI = `https://ipfs.io/ipfs/${resData.IpfsHash}`;
            setProfileURI(uploadedProfileURI);

            setIsLoading(true);
            // Call the contract method to register the member
            await state.contract.registerMember(isTeacher, uploadedProfileURI);
            setRole(isTeacher ? 'Teacher' : 'Student');
        } catch (error) {
            console.error('Error registering member:', error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="text-center ">

            <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <a href="#" class="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700" role="alert">
            <span class="text-xs bg-primary-600 rounded-full text-white px-4 py-1.5 mr-3">New</span> <span class="text-sm font-medium">Launch your project today! See how it works</span>
            <svg class="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
        </a>
        <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Empowering Dreams Through Crowdfunding</h1>
        <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Here at     Join our platform to turn creative ideas into reality. Fund projects, connect with innovators, and create a lasting impact.
        </p>
        <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
        {isLoading ? (
        <p className="text-gray-400 italic text-lg">Processing your registration...</p>
    ) : role ? (
        <p className="text-gray-200 text-xl font-semibold">
            Registered as <span className="text-blue-500">{role}</span>
        </p>
    ) : (
        <>
            <p className="text-gray-200 text-lg font-medium mb-6">Choose your role to register:</p>
            <div className="flex space-x-4">
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)} // Corrected onChange handler
                    value={name} // Corrected value binding
                    placeholder="Enter your name"
                    className="border border-gray-300 p-2 rounded-lg" // Optional styling
                />
                <input
                    type="file"
                    onChange={handleFileUpload}
                    className="border border-gray-300 p-2 rounded-lg" // Optional styling
                />
                <button
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-200"
                    onClick={() => registerMember(true, profileURI)} // Pass profileURI
                >
                    Teacher
                </button>
                <button
                    className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-200"
                    onClick={() => registerMember(false, profileURI)} // Pass profileURI
                >
                    Student
                </button>
            </div>
        </>
    )}



        </div>
        <div class="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
    <span class="font-semibold text-gray-400 uppercase">FEATURED IN</span>
    <div class="flex flex-wrap justify-center items-center mt-8 text-gray-500 space-x-12">
        {/* <!-- YouTube --> */}
        <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center text-gray-400 hover:text-red-500 transition duration-150"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                class="w-12 h-12"
            >
                <path d="M23.498 6.186a2.986 2.986 0 00-2.108-2.107C19.366 3.5 12 3.5 12 3.5s-7.366 0-9.39.579a2.986 2.986 0 00-2.108 2.107C0 8.21 0 12 0 12s0 3.79.502 5.814a2.986 2.986 0 002.108 2.107C4.634 20.5 12 20.5 12 20.5s7.366 0 9.39-.579a2.986 2.986 0 002.108-2.107C24 15.79 24 12 24 12s0-3.79-.502-5.814zM9.75 15.5V8.5l6 3.5-6 3.5z" />
            </svg>
            <span class="text-sm font-medium mt-2">YouTube</span>
        </a>

        {/* <!-- GitHub --> */}
        <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center text-gray-400 hover:text-gray-100 transition duration-150"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                class="w-12 h-12"
            >
                <path d="M12 .5A11.4 11.4 0 00.5 12a11.4 11.4 0 007.832 10.873c.574.11.784-.25.784-.554v-2.177c-3.185.693-3.857-1.538-3.857-1.538a3.042 3.042 0 00-1.276-1.676c-1.042-.714.083-.714.083-.714a2.408 2.408 0 011.758 1.195 2.416 2.416 0 003.292.942 2.419 2.419 0 01.716-1.521c-2.546-.288-5.218-1.273-5.218-5.658a4.447 4.447 0 011.207-3.064 4.1 4.1 0 01.108-3.018s.962-.313 3.153 1.19a10.9 10.9 0 015.746 0c2.192-1.503 3.154-1.19 3.154-1.19a4.1 4.1 0 01.107 3.018A4.447 4.447 0 0118.5 12c0 4.395-2.677 5.37-5.226 5.654a2.682 2.682 0 01.76 2.08v3.084c0 .308.209.67.788.553A11.4 11.4 0 0023.5 12 11.4 11.4 0 0012 .5z" />
            </svg>
            <span class="text-sm font-medium mt-2">GitHub</span>
        </a>

        {/* <!-- Vercel --> */}
        <a
            href="https://vercel.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col items-center text-gray-400 hover:text-purple-500 transition duration-150"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                class="w-12 h-12"
            >
                <path d="M12 0l12 22H0z" />
            </svg>
            <span class="text-sm font-medium mt-2">Vercel</span>
        </a>
    </div>
</div>

    </div>
</section>


            {/* Newsletter Subscription Section */}

            <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-center text-base/7 font-semibold text-indigo-600">Fund Education Smarter</h2>
        <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
        Empowering Education Through Crowdfunding        </p>
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                Seamless Accessibility                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                Support educational courses from anywhere. Our platform ensures easy navigation for funders and learners alike.                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                  <img
                    className="size-full object-cover object-top"
                    src={image2}
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
          </div>
          <div className="relative max-lg:row-start-1">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Efficient Contributions</p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                Track your funding and course progress with real-time updates. Join a movement making education accessible.                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                <img
                  className="w-full max-lg:max-w-xs"
                  src="https://tailwindui.com/plus/img/component-images/bento-03-performance.png"
                  alt=""
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
          </div>
          <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
            <div className="absolute inset-px rounded-lg bg-white"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">Transparent Collaborations</p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                Ensure trust with verified campaigns and direct interactions between funders and educators                </p>
              </div>
              <div className="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
                <img
                  className="h-[min(152px,40cqw)] object-cover"
                  src="https://tailwindui.com/plus/img/component-images/bento-03-security.png"
                  alt=""
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
          </div>
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                Trusted Transactions                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                Your contributions are secure with blockchain-based verification and smart contract execution.                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow">
                <div className="absolute bottom-0 left-10 right-0 top-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                  <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                    <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                      <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                        NotificationSetting.jsx
                      </div>
                      <div className="border-r border-gray-600/10 px-4 py-2">App.jsx</div>
                    </div>
                  </div>
                  <div className="px-6 pb-14 pt-6"></div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32 mt-8">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                        <div className="max-w-xl lg:max-w-lg">
                            <h2 className="text-4xl font-semibold tracking-tight text-white">Subscribe to our newsletter</h2>
                            <p className="mt-4 text-lg text-gray-300">
                                Stay updated with our latest news and insights.
                            </p>
                            <form className="mt-6 flex max-w-md gap-x-4">
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"
                                    placeholder="Enter your email"
                                />
                                <button
                                    type="submit"
                                    className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>
                        <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                            <div className="flex flex-col items-start">
                                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                    {/* Example Icon */}
                                    <svg
                                        className="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                                        />
                                    </svg>
                                </div>
                                <dt className="mt-4 text-base font-semibold text-white">Weekly Articles</dt>
                                <dd className="mt-2 text-base text-gray-400">
                                    Receive valuable content straight to your inbox.
                                </dd>
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                                    {/* Example Icon */}
                                    <svg
                                        className="h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15"
                                        />
                                    </svg>
                                </div>
                                <dt className="mt-4 text-base font-semibold text-white">No Spam</dt>
                                <dd className="mt-2 text-base text-gray-400">
                                    We respect your inbox. No unwanted emails.
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
    <footer className="bg-gray-900 text-gray-300 py-10">
  <div className="container mx-auto px-6 lg:px-20">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Column 1 */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">About Course Crowdfunding</h3>
        <p className="text-sm">
          Course Crowdfunding is a decentralized platform where learners and educators collaborate to fund and create high-quality courses. Empower your education journey with the power of blockchain.
        </p>
      </div>

      {/* Column 2 */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <a href="/home" className="hover:text-indigo-400">Home</a>
          </li>
          <li>
            <a href="/campaigns" className="hover:text-indigo-400">Browse Campaigns</a>
          </li>
          <li>
            <a href="/create-campaign" className="hover:text-indigo-400">Create a Campaign</a>
          </li>
          <li>
            <a href="/funded-courses" className="hover:text-indigo-400">Funded Courses</a>
          </li>
          <li>
            <a href="/dashboard" className="hover:text-indigo-400">My Dashboard</a>
          </li>
          <li>
            <a href="/faq" className="hover:text-indigo-400">FAQs</a>
          </li>
        </ul>
      </div>

      {/* Column 3 */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
        <ul className="space-y-2">
          <li>
            <a href="/support" className="hover:text-indigo-400">Help Center</a>
          </li>
          <li>
            <a href="/terms" className="hover:text-indigo-400">Terms & Conditions</a>
          </li>
          <li>
            <a href="/privacy" className="hover:text-indigo-400">Privacy Policy</a>
          </li>
          <li>
            <a href="/contact-us" className="hover:text-indigo-400">Contact Us</a>
          </li>
        </ul>
      </div>

      {/* Column 4 */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Stay Connected</h3>
        <p className="text-sm mb-4">
          Follow us on social media for updates on new campaigns, funded courses, and more.
        </p>
        <div className="flex space-x-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 0 0 1.88-2.36c-.82.5-1.73.84-2.7 1.03A4.2 4.2 0 0 0 16 4a4.2 4.2 0 0 0-4.18 5.14A12.07 12.07 0 0 1 3 4.7a4.12 4.12 0 0 0-.57 2.1c0 1.46.74 2.75 1.86 3.5a4.2 4.2 0 0 1-1.9-.53v.05a4.2 4.2 0 0 0 3.36 4.1 4.22 4.22 0 0 1-1.88.07A4.2 4.2 0 0 0 8.4 16.8a8.45 8.45 0 0 1-5.24 1.8A8.3 8.3 0 0 1 2 18a12 12 0 0 0 6.4 1.9C15.94 20 20 12.6 20 7.4V7a8.3 8.3 0 0 0 2.46-2.05z" />
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.9 3H5.1A2.1 2.1 0 0 0 3 5.1v13.8A2.1 2.1 0 0 0 5.1 21h13.8a2.1 2.1 0 0 0 2.1-2.1V5.1A2.1 2.1 0 0 0 18.9 3zM11.2 16.8h-2v-6.4h2v6.4zm-.9-7.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm7.6 7.2h-2v-3.2c0-.9-.7-1.6-1.6-1.6s-1.6.7-1.6 1.6v3.2h-2v-6.4h2v.9c.4-.7 1.1-1.2 1.9-1.2 1.4 0 2.4 1 2.4 2.4v4.3z" />
            </svg>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-indigo-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5a11.5 11.5 0 0 0-3.63 22.4c.58.1.79-.25.79-.56v-2c-3.17.69-3.84-1.54-3.84-1.54-.52-1.35-1.28-1.7-1.28-1.7-1.05-.7.08-.7.08-.7 1.15.08 1.75 1.2 1.75 1.2 1.04 1.78 2.73 1.26 3.39.97.11-.75.41-1.27.74-1.56-2.53-.3-5.19-1.27-5.19-5.64a4.4 4.4 0 0 1 1.17-3.07 4.08 4.08 0 0 1 .11-3.03s.95-.3 3.1 1.17a10.8 10.8 0 0 1 5.63 0c2.14-1.47 3.1-1.17 3.1-1.17a4.08 4.08 0 0 1 .11 3.03 4.4 4.4 0 0 1 1.17 3.07c0 4.37-2.66 5.34-5.2 5.64.42.37.79 1.1.79 2.2v3.27c0 .31.21.66.8.56A11.5 11.5 0 0 0 12 .5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div className="text-center mt-8 border-t border-gray-700 pt-4">
      <p className="text-sm">&copy; 2024 Course Crowdfunding. All rights reserved.</p>
    </div>
  </div>
</footer>

        </div>
    );
}

export default Home;
