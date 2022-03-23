from api.serializers import CurriculumSerializer
from api.models.curriculum import Curriculum

class CurriculumRepository:
    
    @staticmethod
    def get_all_curriculums(university_id):  
        curriculums = Curriculum.objects.prefetch_related('curriculum_courses_set__course__department') \
        .select_related('department')

        if university_id != None:
            curriculums = curriculums.filter(department__university = university_id)

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
        curriculum = Curriculum.objects.prefetch_related('curriculum_courses_set__course__department') \
        .select_related('department__university').get(pk=pk)
        serializer = CurriculumSerializer(curriculum)
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