import { Request, Response } from 'express';
import { Types } from 'mongoose'; 
import asyncHandler from '../util/catchAsync';
import UserModel from '../models/userSchema';

export const sendFriendRequest = async (fromUserId: string, toUserId: string) => {
  const fromUser = await UserModel.findById(new Types.ObjectId(fromUserId));
  const toUser = await UserModel.findById(new Types.ObjectId(toUserId));

  if (!fromUser || !toUser) throw new Error('User not found');


  const alreadyRequested = toUser.friendRequests.some(id => id.toString() === fromUserId);
  const alreadyFriends = toUser.friends.some(id => id.toString() === fromUserId);

  if (alreadyRequested) {
    throw new Error('Friend request already sent');
  }

  if (alreadyFriends) {
    throw new Error('You are already friends with this user');
  }

  
  toUser.friendRequests.push(new Types.ObjectId(fromUserId));
  await toUser.save();
};


export const acceptFriendRequest = async (userId: string, requestId: string) => {
  const user = await UserModel.findById(new Types.ObjectId(userId));
  const friend = await UserModel.findById(new Types.ObjectId(requestId));

  if (!user || !friend) throw new Error('User not found');

  user.friends.push(new Types.ObjectId(requestId)); 
  friend.friends.push(new Types.ObjectId(userId));

  user.friendRequests = user.friendRequests.filter(id => id.toString() !== requestId);
  await user.save();
  await friend.save();
};


export const getAllFriendRequests = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.params.id).populate('friendRequests', 'name email'); 
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    res.status(200).json({
      friendRequests: user.friendRequests,
    });
  });




export const rejectFriendRequest = async (userId: string, requestId: string) => {
    const user = await UserModel.findById(new Types.ObjectId(userId));
    if (!user) throw new Error('User not found');
  
    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requestId);
    await user.save();
  };




  const getMutualFriendsCount = (userFriends: Types.ObjectId[], otherUserFriends: Types.ObjectId[]) => {
    const userFriendSet = new Set(userFriends.map(f => f.toString()));
    const mutualFriends = otherUserFriends.filter(friendId => userFriendSet.has(friendId.toString()));
    return mutualFriends.length;
  };
  
  export const getRecommendations = async (userId: string) => {
    const user = await UserModel.findById(new Types.ObjectId(userId)).populate('friends');
  
    if (!user) throw new Error('User not found');
  
    const userFriends = user.friends.map(f => f._id);
  
    // Fetch all users except the current user and their friends
    const allUsers = await UserModel.find({
      _id: { $nin: [...userFriends, new Types.ObjectId(userId)] }
    });
  
    // Sort users by the number of mutual friends
    const recommendations = allUsers
      .map(otherUser => {
        const mutualFriendsCount = getMutualFriendsCount(userFriends, otherUser.friends);
        return {
          user: otherUser,
          mutualFriendsCount,
        };
      })
      .filter(r => r.mutualFriendsCount > 0) // Only return users with mutual friends
      .sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount) // Sort by mutual friends count
      .slice(0, 10); // Limit to top 10 recommendations
  
    return recommendations;
  };



  export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
  

    const users = await UserModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },   
        { email: { $regex: query, $options: 'i' } }   
      ]
    }).limit(10);  // Limit the number of results
  
    res.status(200).json(users);
  });

  

  const getMutualFriendsCount1 = (userFriends: Types.ObjectId[], otherUserFriends: Types.ObjectId[]) => {
    const userFriendSet = new Set(userFriends.map(f => f.toString()));
    const mutualFriends = otherUserFriends.filter(friendId => userFriendSet.has(friendId.toString()));
    return mutualFriends.length;
  };
  
  // Controller to show all friends along with mutual friends count
  export const getAllFriendsWithMutuals = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id;
  
    const user = await UserModel.findById(new Types.ObjectId(userId)).populate('friends', 'name email friends');
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    const userFriends = user.friends.map(f => f._id);
  
    const friendsWithMutuals = await Promise.all(
      user.friends.map(async (friend: any) => {
        const mutualFriendsCount = getMutualFriendsCount1(userFriends, friend.friends);
        return {
          name: friend.name,
          email: friend.email,
          mutualFriendsCount,
        };
      })
    );
  
    res.status(200).json({
      friends: friendsWithMutuals,
    });
  });