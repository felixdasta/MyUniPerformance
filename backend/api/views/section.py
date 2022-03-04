from rest_framework import status
from rest_framework.response import Response
from api.repositories.section import SectionRepository
from api.authentication import Authentication 
from rest_framework.views import APIView
from api.models.section import Section

class SectionList(APIView):
    """
    List all sections, or create a new one.
    """
    def get(self, request, format=None):
        section = SectionRepository.get_all_sections()
        return Response(section.data)

    def post(self, request, format=None):
        errors = Authentication.get_auth_errors(request)

        if len(errors) > 0:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        Authentication.hash_password(request)
        section = SectionRepository.create_section(request)
            
        return Response(section.data 
        if section.is_valid() 
        else section._errors, 
        status = status.HTTP_201_CREATED 
        if section.is_valid() 
        else status.HTTP_400_BAD_REQUEST) 

class SectionDetail(APIView):
    """
    Retrieve, update or delete a section instance
    """
    def get(self, request, pk, format=None):
        try:
            section = SectionRepository.get_section_by_id(pk)
            return Response(section.data)
        except Section.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        errors = Authentication.get_auth_errors(request, pk)

        if len(errors) > 0:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        Authentication.hash_password(request)
        section = SectionRepository.update_section(request, pk)

        return Response(section.data 
        if section.is_valid() 
        else section._errors, 
        status = status.HTTP_201_CREATED 
        if section.is_valid() 
        else status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        SectionRepository.delete_section(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)