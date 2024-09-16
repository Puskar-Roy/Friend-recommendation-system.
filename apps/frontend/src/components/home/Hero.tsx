import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, UserPlus, ChevronLeft, ChevronRight } from "lucide-react"

// Mock data generator
const generateMockData = (count: number, prefix: string) => 
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${prefix} User ${i + 1}`,
    avatar: `/placeholder.svg?height=100&width=100&text=${prefix[0]}${i + 1}`,
    mutualFriends: Math.floor(Math.random() * 20),
  }))

const ITEMS_PER_PAGE = 8

const FriendCard = ({ friend, actionButton }: { friend: any, actionButton: React.ReactNode }) => (
  <Card className="flex flex-col items-center p-4 hover:bg-gray-50 transition-colors">
    <Avatar className="w-24 h-24 mb-4">
      <AvatarImage src={friend.avatar} alt={friend.name} />
      <AvatarFallback>{friend.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
    </Avatar>
    <h3 className="font-semibold text-lg mb-1">{friend.name}</h3>
    <p className="text-sm text-gray-500 mb-4">{friend.mutualFriends} mutual friends</p>
    {actionButton}
  </Card>
)

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
)

export default function Hero() {
  const [currentFriends] = useState(generateMockData(50, "Friend"))
  const [suggestedFriends] = useState(generateMockData(100, "Suggested"))
  const [friendRequests] = useState(generateMockData(30, "Request"))

  const [currentPage, setCurrentPage] = useState({ friends: 1, requests: 1, suggestions: 1 })

  const paginateData = (data: any[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }

  const handlePageChange = (tab: 'friends' | 'requests' | 'suggestions', page: number) => {
    setCurrentPage(prev => ({ ...prev, [tab]: page }))
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Friends</h1>
      
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="friends">Friends ({currentFriends.length})</TabsTrigger>
          <TabsTrigger value="requests">Friend Requests ({friendRequests.length})</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions ({suggestedFriends.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="friends">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginateData(currentFriends, currentPage.friends).map(friend => (
              <FriendCard 
                key={friend.id} 
                friend={friend} 
                actionButton={
                  <Button variant="outline" className="w-full">
                    Message
                  </Button>
                }
              />
            ))}
          </div>
          <Pagination 
            currentPage={currentPage.friends}
            totalPages={Math.ceil(currentFriends.length / ITEMS_PER_PAGE)}
            onPageChange={(page) => handlePageChange('friends', page)}
          />
        </TabsContent>

        <TabsContent value="requests">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginateData(friendRequests, currentPage.requests).map(request => (
              <FriendCard 
                key={request.id} 
                friend={request} 
                actionButton={
                  <div className="flex space-x-2 w-full">
                    <Button variant="outline" className="flex-1">
                      <Check className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button variant="outline" className="flex-1">
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
            totalPages={Math.ceil(friendRequests.length / ITEMS_PER_PAGE)}
            onPageChange={(page) => handlePageChange('requests', page)}
          />
        </TabsContent>

        <TabsContent value="suggestions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginateData(suggestedFriends, currentPage.suggestions).map(suggestion => (
              <FriendCard 
                key={suggestion.id} 
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
            totalPages={Math.ceil(suggestedFriends.length / ITEMS_PER_PAGE)}
            onPageChange={(page) => handlePageChange('suggestions', page)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}