from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.repositories.grade_stats import GradeStatsRepository 
from api.models.grade_stats import Grade_stats

class GradeStatsList(APIView):
    """
    List all grade stats for a section, or add new ones
    """
    def get(self, request, format=None):
        grade_stats = GradeStatsRepository.get_all_grade_stats()
        return Response(grade_stats.data)

    def post(self, request, format=None):
        grad_stats = GradeStatsRepository.create_grade_stats(request)

        return Response(grad_stats.data 
        if grad_stats.is_valid() 
        else grad_stats._errors, 
        status = status.HTTP_201_CREATED 
        if grad_stats.is_valid() 
        else status.HTTP_400_BAD_REQUEST)
    
class GradeStatsDetail(APIView):
    """
    Read, update or delete grade stats for a section
    """
    def get(self, request, pk, format=None):
        try:
            grad_stats = GradeStatsRepository.get_grade_stats_by_id(pk)
            return Response(grad_stats.data)
        except Grade_stats.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        grad_stats = GradeStatsRepository.update_grade_stats(request, pk)

        return Response(grad_stats.data 
        if grad_stats.is_valid() 
        else grad_stats._errors, 
        status = status.HTTP_201_CREATED 
        if grad_stats.is_valid() 
        else status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        GradeStatsRepository.delete_grade_stats(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)     
        