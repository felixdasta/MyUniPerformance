from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.repositories.feedback import FeedbackRepository
from api.models.feedback import Feedback
from api.serializers import FeedbackSerializer
from api.utils import paginate_result, contains_profanity
from rest_framework.decorators import api_view
from dateutil.relativedelta import relativedelta


class FeedbackList(APIView):
    """
    List all feedbacks for all sections, a specific section or add a new one
    """

    def get(self, request, section_id=None, format=None):
        queryprms = request.GET
        feedback = FeedbackRepository.get_feedback_by_params(section_id)
        page = 1 if not queryprms.get('page') else int(queryprms.get('page'))
        feedback = paginate_result(
            feedback, FeedbackSerializer, 'feedbacks', page, 25)
        return Response(feedback)

    def post(self, request, section_id, format=None):
        # section id will be passed from url parameter
        request.data['section_id'] = section_id
        # check if feedback contains profanity
        request.data['is_misplaced'] = contains_profanity(request.data['praises']) or contains_profanity(request.data['criticism'])

        misplaced_feedbacks = FeedbackRepository.get_misplaced_feedbacks_by_user_latest_30_days(request.data['student_id'])
        misplaced_count = len(misplaced_feedbacks)
        feedback = None

        if misplaced_count < 3:
            feedback = FeedbackRepository.create_feedback(request)

            if feedback.is_misplaced:
                misplaced_count += 1
                if misplaced_count < 3:
                    return Response({"error": "Your feedback isnt't shown to public because it contains profanity. \
                        You have {count} out of 3 strikes. At the third strike, you won't be allowed to comment \
                        for 30 days.".format(count=misplaced_count), misplaced_count: misplaced_count},
                        status=status.HTTP_400_BAD_REQUEST)
            else:
                if feedback:
                    serializer = FeedbackSerializer(feedback)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(serializer._errors, status=status.HTTP_400_BAD_REQUEST)
                    
        date = date = misplaced_feedbacks[misplaced_count -1].timestamp if not feedback else feedback.timestamp
        future_date = date + relativedelta(months=1)
        future_date = future_date.strftime('%m/%d/%Y')
        return Response({"error": "You're suspended from commenting until {date}.".format(date=future_date),
                        misplaced_count: misplaced_count},
                        status=status.HTTP_400_BAD_REQUEST)

class FeedbackDetail(APIView):
    """
    Read, update, or delete feedback for a section
    """

    def get(self, request, pk, format=None):
        try:
            feedback = FeedbackRepository.get_feedback_by_id(pk)
            serializer = FeedbackSerializer(feedback)
            return Response(serializer.data, status.HTTP_200_OK)
        except Feedback.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        try:
            feedback = FeedbackRepository.update_feedback(request, pk)
            serializer = FeedbackSerializer(feedback)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Feedback.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk, format=None):
        FeedbackRepository.delete_feedback(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)


class FeedbackLike(APIView):
    """
    Like, or unlike a feedback
    """

    def put(self, request, user_id, feedback_id, format=None):
        try:
            feedback = FeedbackRepository.like_feedback(user_id, feedback_id)
            serializer = FeedbackSerializer(feedback)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Feedback.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, user_id, feedback_id, format=None):
        try:
            feedback = FeedbackRepository.unlike_feedback(user_id, feedback_id)
            serializer = FeedbackSerializer(feedback)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Feedback.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def report_feedback(request, user_id, feedback_id):
    try:
        feedback = FeedbackRepository.report_feedback(request, user_id, feedback_id)
        serializer = FeedbackSerializer(feedback)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Feedback.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
