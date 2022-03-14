from api.serializers import FeedbackSerializer
from api.models.feedback import Feedback

class FeedbackRepository:

    @staticmethod
    def get_feedback_by_params(section_id):
        feedback = Feedback.objects.all()

        if section_id != None:
            feedback = feedback.filter(section = section_id)

        return feedback

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
