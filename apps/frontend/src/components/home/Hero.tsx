import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthContext } from "../../hooks/useAuthContext";

// Define Types
interface Friend {
  _id: string;
  name: string;
  avatar: string;
  mutualFriendsCount: number;
}

interface FriendRequest extends Friend {
  // Additional properties if needed
}

interface HeroData {
  currentFriends: Friend[];
  suggestedFriends: Friend[];
  friendRequests: FriendRequest[];
}

// Custom Hook for Data Fetching
const useFriendData = (userId: string | undefined) => {
  const [data, setData] = useState<HeroData>({
    currentFriends: [],
    suggestedFriends: [],
    friendRequests: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return; // Handle undefined userId

    const fetchData = async () => {
      try {
        const [friendsData, requestsData, suggestionsData] = await Promise.all([
          axios.get(`http://localhost:5050/api/friends/${userId}`),
          axios.get(`http://localhost:5050/api/friends/friend-requests/${userId}`),
          axios.get(`http://localhost:5050/api/friends/recommendations/${userId}`)
        ]);
        setData({
          currentFriends: friendsData.data.friends,
          suggestedFriends: suggestionsData.data,
          friendRequests: requestsData.data.friendRequests
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return { data, loading, setData };
};

const ITEMS_PER_PAGE = 8;

const FriendCard = ({ friend, actionButton }: { friend: Friend, actionButton: React.ReactNode }) => (
  <Card className="flex flex-col items-center p-4 hover:bg-gray-50 transition-colors">
    <Avatar className="w-24 h-24 mb-4">
      <AvatarImage src={friend.avatar} alt={friend.name} />
      <AvatarFallback className='text-4xl'>{friend.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
    </Avatar>
    <h3 className="font-semibold text-lg mb-1">{friend.name}</h3>
    <p className="text-sm text-gray-500 mb-4">{friend.mutualFriendsCount} mutual friends</p>
    {actionButton}
  </Card>
);

const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => (
  <div className="flex justify-center items-center space-x-2 mt-4">
    <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <span>{currentPage} of {totalPages}</span>
    <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

const Hero = () => {
  const { state } = useAuthContext();
  const userId = state.user?.id;
  const { data, loading, setData } = useFriendData(userId);
  const [currentPage, setCurrentPage] = useState({ friends: 1, requests: 1, suggestions: 1 });

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await axios.post(`http://localhost:5050/api/friends/accept/${requestId}`, { id: userId });
      setData(prev => ({
        ...prev,
        friendRequests: prev.friendRequests.filter(request => request._id !== requestId)
      }));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await axios.post(`http://localhost:5050/api/friends/reject-friend-request`, { userId, requestId });
      setData(prev => ({
        ...prev,
        friendRequests: prev.friendRequests.filter(request => request._id !== requestId)
      }));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const paginateData = (data: Friend[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const handlePageChange = (tab: 'friends' | 'requests' | 'suggestions', page: number) => {
    setCurrentPage(prev => ({ ...prev, [tab]: page }));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Friends</h1>

      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="friends">Friends ({data.currentFriends.length})</TabsTrigger>
          <TabsTrigger value="requests">Friend Requests ({data.friendRequests.length})</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions ({data.suggestedFriends.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginateData(data.currentFriends, currentPage.friends).map(friend => (
              <FriendCard
                key={friend._id}
                friend={friend}
                actionButton={
                  <Button variant="outline" className="w-full">
                    Unfriend
                  </Button>
                }
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage.friends}
            totalPages={Math.ceil(data.currentFriends.length / ITEMS_PER_PAGE)}
            onPageChange={(page) => handlePageChange('friends', page)}
          />
        </TabsContent>

        <TabsContent value="requests">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginateData(data.friendRequests, currentPage.requests).map(request => (
              <FriendCard
                key={request._id}
                friend={request}
                actionButton={
                  <div className="flex space-x-2 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => handleAcceptRequest(request._id)}>
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleRejectRequest(request._id)}>
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage.requests}
            totalPages={Math.ceil(data.friendRequests.length / ITEMS_PER_PAGE)}
            onPageChange={(page) => handlePageChange('requests', page)}
          />
        </TabsContent>

        <TabsContent value="suggestions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginateData(data.suggestedFriends, currentPage.suggestions).map(suggestion => (
              <FriendCard
                key={suggestion._id}
                friend={suggestion}
                actionButton={
                  <Button variant="outline" className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Friend
                  </Button>
                }
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage.suggestions}
            totalPages={Math.ceil(data.suggestedFriends.length / ITEMS_PER_PAGE)}
            onPageChange={(page) => handlePageChange('suggestions', page)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Hero;
