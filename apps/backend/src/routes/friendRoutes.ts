import express from 'express';
import { Request, Response } from 'express';
import { sendFriendRequest, acceptFriendRequest, getRecommendations, rejectFriendRequest, getAllFriendRequests, searchUsers } from '../controllers/friendsController';

const router = express.Router();




router.post('/request/:toUserId', async (req: Request, res: Response) => {
    try {
        await sendFriendRequest(req.body.id, req.params.toUserId);
        res.status(200).json({ message: 'Request sent' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/accept/:requestId', async (req: Request, res: Response) => {
    try {
        await acceptFriendRequest(req.body.id, req.params.requestId);
        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/recommendations', async (req: Request, res: Response) => {
    try {
        const recommendations = await getRecommendations(req.body.id);
        res.status(200).json(recommendations);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



router.post('/reject-friend-request', async (req: Request, res: Response) => {
    const { userId, requestId } = req.body;

    if (!userId || !requestId) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    await rejectFriendRequest(userId, requestId);
    res.status(200).json({ message: 'Friend request rejected' });
});


router.get('/friend-requests',  getAllFriendRequests);
router.get('/search', searchUsers); 
router.get('/recommendations/:userId', async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'Missing parameters' });
    }

    const recommendations = await getRecommendations(userId);
    res.status(200).json(recommendations);
});
export default router;
