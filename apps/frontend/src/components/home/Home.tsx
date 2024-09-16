import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from "../../hooks/useAuthContext";
import { IoMdPersonAdd } from "react-icons/io";
// import Avatar from 'react-avatar';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';
// import Avatar from 'react-avatar';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface User {
  _id: string;
  name: string;
  email: string;
}

const FriendSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { state } = useAuthContext();

  const sendFriendRequest = async (toUserId: string) => {
    try {
      await axios.post(`${import.meta.env.VITE_API}/api/friends/request/${toUserId}`,
        { id: state.user?.id });
      alert('Friend request sent');
    } catch (error) {
      alert('Failed to send friend request');
    }
  };

  useEffect(() => {
    if (query === '') {
      setResults([]);  // Clear results when query is empty
      return;
    }

    const debounceSearch = setTimeout(() => {
      if (query.length > 2) {
        setLoading(true);
        axios
          .get(`${import.meta.env.VITE_API}/api/friends/search?query=${query}`)
          .then((res) => {
            setResults(res.data);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceSearch);
  }, [query]);

  return (
    <div className="w-full max-w-screen-xl mx-auto px-6">
      <div className="flex items-center bg-gray-200 rounded-md">
        <div className="pl-2">
          <svg className="fill-current text-gray-500 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
          </svg>
        </div>
        <input
          className="w-full rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2"
          id="search"
          type="text"
          placeholder="Find Friends..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Floating suggestions */}
      {query && results.length > 0 && (
        <div className="absolute w-[20rem] rounded-2xl lg:w-[30rem] bg-white shadow-lg mt-2 max-h-70 overflow-y-auto z-10">
          <div className="py-3 text-sm">
            {loading ? (
              <p>Loading...</p>
            ) : (
              results.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center cursor-pointer text-gray-700 hover:text-indigo-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2"
                  onClick={() => sendFriendRequest(user._id)}
                >
                  <div className='flex justify-center items-center gap-1'>
                  <Avatar className="w-10 h-10 ">
                    <AvatarImage src={`/placeholder.svg?height=100&width=100&text=${4}${6}`} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>


                  <div className="flex-grow text-xl font-bold px-2">{user.name}</div>
                  </div>
                  <div className='w-30'>
                    <Button variant="outline" className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Friend
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendSearch;
