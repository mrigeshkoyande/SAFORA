const prisma = require('../config/prisma');
const { getEscapeCoachAdvice } = require('../services/gemini.service');
const { sendSuccess, sendError } = require('../utils/response');

// @route   POST /api/escape/chat
// @desc    Chat with Escape Coach
// @access  Private
const chatWithCoach = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) return sendError(res, 'Question is required', 400);

    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    if (!user) return sendError(res, 'User not found', 404);
    
    // Fetch last 5 messages for context
    const history = await prisma.escapeCoachHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    // Gemini AI call
    const answer = await getEscapeCoachAdvice(history.reverse(), question);

    // Save to DB
    const chat = await prisma.escapeCoachHistory.create({
      data: {
        userId: user.id,
        prompt: question,
        response: answer,
      }
    });

    return sendSuccess(res, 'Advice received', { chat });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/escape/history
// @desc    Get chat history
// @access  Private
const getHistory = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { firebaseUID: req.user.firebaseUID } });
    if (!user) return sendError(res, 'User not found', 404);
    
    const history = await prisma.escapeCoachHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    return sendSuccess(res, 'Chat history retrieved', { history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chatWithCoach,
  getHistory,
};
