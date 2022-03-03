from api.serializers import CurriculumSerializer
from api.models.curriculum import Curriculum

class CurriculumRepository:
    
    @staticmethod
    def get_all_curriculums():        
        curriculums = Curriculum.objects.all()
        serializer = CurriculumSerializer(curriculums, many=True)
        return serializer

    @staticmethod
    def create_curriculum(request):
        serializer = CurriculumSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def get_curriculum_by_id(pk):
        curriculum = Curriculum.objects.get(pk=pk)
        serializer = CurriculumSerializer(curriculum)
        return serializer

    @staticmethod
    def get_curriculums_by_university(university_id):
        curriculums = Curriculum.objects.select_related('department').select_related('department__university').filter(department__university=university_id)
        serializer = CurriculumSerializer(curriculums, many=True)
        return serializer

    @staticmethod
    def update_curriculum(request, pk):
        curriculum = Curriculum.objects.get(pk=pk)
        serializer = CurriculumSerializer(curriculum, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def delete_curriculum(pk):
        curriculum = Curriculum.objects.get(pk=pk)
        return curriculum.delete()