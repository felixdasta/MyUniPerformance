from os import stat
from api.serializers import FeedbackSerializer
from api.models.feedback import Feedback

class FeedbackRepository:

    @staticmethod
    def get_all_feedback():
        feedback = Feedback.objects.all()
        serializer = FeedbackSerializer(feedback, many=True)
        return serializer

    @staticmethod
    def create_feedback(request):
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def get_feedback_by_id(pk):
        feedback = Feedback.objects.get(pk=pk)
        serializer = FeedbackSerializer(feedback)
        return serializer

    @staticmethod
    def update_feedback(request, pk):
        feedback = Feedback.objects.get(pk=pk)
        serializer = FeedbackSerializer(feedback, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer
    
    @staticmethod
    def delete_feedback(pk):
        feedback = Feedback.objects.get(pk=pk)
        return feedback.delete()

    @staticmethod
    def get_all_feedback_by_section(pk):
        feedback = Feedback.objects.select_related('section').filter(section=pk)
        serializer = FeedbackSerializer(feedback, many=True)
        return serializer
