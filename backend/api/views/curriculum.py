
from rest_framework import status
from rest_framework.response import Response
from api.repositories.curriculum import CurriculumRepository
from rest_framework.views import APIView
from api.models.curriculum import Curriculum

class CurriculumList(APIView):
    """
    List all curriculums, or create a new curriculum.
    """
    def get(self, request, format=None):
        curriculum = CurriculumRepository.get_all_curriculums()
        return Response(curriculum.data)

    def post(self, request, format=None):
        curriculum = CurriculumRepository.create_curriculum(request)
            
        return Response(curriculum.data 
        if curriculum.is_valid() 
        else curriculum._errors, 
        status = status.HTTP_201_CREATED 
        if curriculum.is_valid() 
        else status.HTTP_400_BAD_REQUEST)

class CurriculumDetail(APIView):
    """
    Retrieve, update or delete a curriculum instance.
    """
    def get(self, request, pk, format=None):
        try:
            curriculum = CurriculumRepository.get_curriculum_by_id(pk)
            return Response(curriculum.data)
        except Curriculum.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        curriculum = CurriculumRepository.update_curriculum(request, pk)

        return Response(curriculum.data 
        if curriculum.is_valid() 
        else curriculum._errors, 
        status = status.HTTP_201_CREATED 
        if curriculum.is_valid() 
        else status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        CurriculumRepository.delete_curriculum(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)