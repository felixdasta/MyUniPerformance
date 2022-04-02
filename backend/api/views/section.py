from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.repositories.section import SectionRepository
from api.serializers import SectionSerializer
from api.models.section import Section
from api.utils import paginate_result
from django.core import serializers

class SectionList(APIView):
    """
    List all sections, or create a new one.
    """
    def get(self, request, format=None):
        try:
            queryprms = request.GET
            sections = SectionRepository.get_all_sections()
            page = 1 if not queryprms.get('page') else int(queryprms.get('page'))
            sections = paginate_result(sections, SectionSerializer, 'sections', page, 50)
            return Response(sections)
        except Section.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class SectionDetail(APIView):
    """
    Retrieve a section instance
    """
    def get(self, request, pk, format=None):
        try:
            section = SectionRepository.get_section_by_id(pk)
            return Response(section.data)
        except Section.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class EnrollStudent(APIView):
    """
    Enroll a student to section instance
    """
    def put(self, request, user_id, section_id, format=None):
        request.data['student_id'] = user_id
        request.data['section_id'] = section_id
        section = SectionRepository.enroll_student_or_update_grade(request)

        try:
            return Response({'section': section.data, 'message' : 'Student has been successfully enrolled in this section'})
        except:
            return Response(status = status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id, section_id, format=None):
        request.data['student_id'] = user_id
        request.data['section_id'] = section_id
        
        try:
            section = SectionRepository.drop_student(request)
            return Response({'section': section, 'message' : 'Student is no longer enrolled in this section!'})
        except Exception as err:
            return Response({'error': str(err)},status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_sections_terms_by_university(request, university_id):
    sections = SectionRepository.get_sections_terms_by_university(university_id)
    if sections:
        response = []
        for section in sections:
            response.append(section.section_term)
        return Response({'sections_terms' : response}, status=status.HTTP_200_OK)
    return Response({"error": "This university doesn't have any section terms!"}, status=status.HTTP_404_NOT_FOUND)