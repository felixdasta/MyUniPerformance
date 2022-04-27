from api.models.feedback import Feedback

class FeedbackRepository:

    @staticmethod
    def get_feedback_by_params(section_id=None):
        feedback = Feedback.objects.all() \
        .prefetch_related('student__curriculums__department', 'likes') \
        .select_related('instructor')

        if section_id != None:
            feedback = feedback.filter(section = section_id)

        return feedback

    @staticmethod
    def create_feedback(request):
        feedback = Feedback.objects.create(**request.data)
        return feedback

    @staticmethod
    def get_feedback_by_id(pk):
        feedback = Feedback.objects.get(pk=pk)
        return feedback

    @staticmethod
    def like_feedback(student_id, pk):
        feedback = Feedback.objects.get(pk=pk)
        feedback.likes.add(student_id)
        return feedback

    @staticmethod
    def unlike_feedback(student_id, pk):
        feedback = Feedback.objects.get(pk=pk)
        feedback.likes.remove(student_id)
        return feedback

    @staticmethod
    def update_feedback(request, pk):
        feedback = Feedback.objects.get(pk=pk)
        if feedback:
            feedback = Feedback.objects.update(**request.data)
        return feedback
    
    @staticmethod
    def delete_feedback(pk):
        feedback = Feedback.objects.get(pk=pk)
        return feedback.delete()
