
from rest_framework import status
from rest_framework.response import Response
from api.repositories.university import UniversityRepository
from api.models.university import University
from api.authentication import Authentication
from rest_framework.views import APIView

class UniversityList(APIView):
    """
    List all universities, or create a new one.
    """
    def get(self, request, format=None):
        university = UniversityRepository.get_all_universities()
        return Response(university.data)
    
    def post(self, request, format=None):
        errors = Authentication.get_auth_errors(request)

        if len(errors) > 0:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        Authentication.hash_password(request)
        university = UniversityRepository.create_university(request)

        return Response(university.data
        if university.is_valid()
        else university._errors,
        status = status.HTTP_201_CREATED
        if university.is_valid()
        else status.HTTP_400_BAD_REQUEST)

class UniversityDetail(APIView):
    """
    Retrieve, update or delete an instance of a University.
    """
    def get(self, request, pk, format=None):
        try:
            university = UniversityRepository.get_university_by_id(pk)
            return Response(university.data)
        except University.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        errors = Authentication.get_auth_errors(request, pk)

        if len(errors) > 0:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        Authentication.hash_password(request)
        university = UniversityRepository.update_university(request, pk)

        return Response(university.data
        if university.is_valid()
        else university._errors,
        status = status.HTTP_201_CREATED
        if university.is_valid()
        else status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        UniversityRepository.delete_university(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)