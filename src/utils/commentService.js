import axios from 'axios';
import { toast } from 'react-hot-toast';

/**
 * Service for handling comment-related API calls
 */
const commentService = {
  /** 
   * Create a new comment
   * @param {Object} commentData - The comment data to save
   * @returns {Promise<Object>} - The created comment
   */
  createComment: async (commentData) => {
    try {
      const response = await axios.post('/api/comments', commentData);
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to save comment');
      throw error;
    }
  },

  /**
   * Get all comments
   * @returns {Promise<Array>} - Array of comments
   */
  getAllComments: async () => {
    try {
      const response = await axios.get('/api/comments');
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
      throw error;
    }
  },

  /**
   * Like a comment
   * @param {string} commentId - The ID of the comment to like
   * @returns {Promise<Object>} - The updated comment
   */
  likeComment: async (commentId) => {
    try {
      const response = await axios.post(`/api/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Failed to like comment');
      throw error;
    }
  },

  /**
   * Unlike a comment
   * @param {string} commentId - The ID of the comment to unlike
   * @returns {Promise<Object>} - The updated comment
   */
  unlikeComment: async (commentId) => {
    try {
      const response = await axios.post(`/api/comments/${commentId}/unlike`);
      return response.data;
    } catch (error) {
      console.error('Error unliking comment:', error);
      toast.error('Failed to unlike comment');
      throw error;
    }
  }
};

export default commentService;