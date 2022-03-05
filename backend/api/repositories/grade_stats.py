from api.serializers import GradeStatsSerializer
from api.models.grade_stats import Grade_stats

class GradeStatsRepository:

    @staticmethod
    def get_all_grade_stats():
        grade_stats = Grade_stats.objects.all()
        serializer = GradeStatsSerializer(grade_stats, many=True)
        return serializer

    @staticmethod
    def create_grade_stats(request):
        serializer = GradeStatsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def get_grade_stats_by_id(pk):
        grade_stats = Grade_stats.objects.get(pk=pk)
        serializer = GradeStatsSerializer(grade_stats)
        return serializer

    @staticmethod
    def update_grade_stats(request, pk):
        grade_stats = Grade_stats.objects.get(pk=pk)
        serializer = GradeStatsSerializer(grade_stats, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer
    
    @staticmethod
    def delete_grade_stats(pk):
        grade_stats = Grade_stats.objects.get(pk=pk)
        return grade_stats.delete()   
        