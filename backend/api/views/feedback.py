from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.repositories.feedback import FeedbackRepository
from api.models.feedback import Feedback

class FeedbackList(APIView):
    """
    List all feedbacks for all sections or add a new one
    """
    def get(self, request, format=None):
        feedback = FeedbackRepository.get_all_feedback()
        return Response(feedback.data)

    def post(self, request, format=None):
        feedback = FeedbackRepository.create_feedback(request)

        return Response(feedback.data 
        if feedback.is_valid() 
        else feedback._errors, 
        status = status.HTTP_201_CREATED 
        if feedback.is_valid() 
        else status.HTTP_400_BAD_REQUEST)

class FeedbackDetail(APIView):
    """
    Read, update, or delete feedback for a section
    """
    def get(self, request, pk, format=None):
        try:
            feedback = FeedbackRepository.get_feedback_by_id(pk)
            return Response(feedback.data)
        except Feedback.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk, format=None):
        feedback = FeedbackRepository.update_feedback(request, pk)

        return Response(feedback.data 
        if feedback.is_valid() 
        else feedback._errors, 
        status = status.HTTP_201_CREATED 
        if feedback.is_valid() 
        else status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        FeedbackRepository.delete_feedback(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

class FeedbackSection(APIView):
    def get(Self, request, pk, format=None):
        feedback = FeedbackRepository.get_all_feedback_by_section(pk)
        return Response(feedback.data)
