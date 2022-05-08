from api.models.feedback import Feedback
from api.models.feedback import Feedback_Reports
from api.models.student import Student
import datetime

class FeedbackRepository:

    @staticmethod
    def get_feedback_by_params(section_id=None):
        feedback = Feedback.objects.filter(is_misplaced=False) \
        .prefetch_related('student__curriculums__department', 'likes', 'reports') \
        .select_related('instructor__department')

        if section_id != None:
            feedback = feedback.filter(section = section_id)

        return feedback

    @staticmethod
    def get_misplaced_feedbacks_by_user_latest_30_days(student_id):
        return Feedback.objects.filter(
            timestamp__lte=datetime.datetime.today(), 
            timestamp__gt=datetime.datetime.today()-datetime.timedelta(days=30),
            student=student_id, 
            is_misplaced=True) \
        .prefetch_related('student__curriculums__department', 'likes', 'reports') \
        .select_related('instructor__department').order_by("timestamp")

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
    def report_feedback(request, user_id, feedback_id):
        feedback = Feedback.objects.get(pk=feedback_id)
        student = Student.objects.get(pk=user_id) 
        if feedback and student:
            Feedback_Reports.objects.create(**{"feedback": feedback, "student": student, "reason": request.data["reason"]})
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
