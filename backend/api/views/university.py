
from rest_framework import status
from rest_framework.response import Response
from api.repositories.university import UniversityRepository
from api.serializers import UniversitySerializer
from api.models.university import University
from rest_framework.views import APIView

class UniversityList(APIView):
    """
    List all universities
    """
    def get(self, request, format=None):
        queryprms = request.GET
        university = UniversityRepository.get_universities_by_params(queryprms)
        serializer = UniversitySerializer(university, many=True)
        return Response(serializer.data, status.HTTP_200_OK)

class UniversityDetail(APIView):
    """
    Retrieve an instance of a University.
    """
    def get(self, request, pk, format=None):
        try:
            university = UniversityRepository.get_university_by_id(pk)
            serializer = UniversitySerializer(university)
            return Response(serializer.data)
        except University.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)