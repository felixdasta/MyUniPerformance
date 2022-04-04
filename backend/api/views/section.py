from urllib import request
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.repositories.section import SectionRepository
from api.serializers import SectionSerializer, SectionStudentSerializer
from api.models.section import Section
from api.models.student import Student
from api.utils import paginate_result

class SectionList(APIView):
    """
    List all sections, or create a new one.
    """
    def get(self, request, university_id=None, format=None):
        try:
            queryprms = request.GET
            sections = SectionRepository.get_sections_by_params(queryprms, university_id)
            page = 1 if not queryprms.get('page') else int(queryprms.get('page'))
            sections = paginate_result(sections, SectionSerializer, 'sections', page)
            return Response(sections)
        except Section.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class SectionStudentsList(APIView):
    """
    List sections in which a student is found and can filter by section term
    """
    def get(self, request, format=None):
        try:
            queryprms = request.GET
            sections = SectionRepository.get_sections_by_student(queryprms)
            page = 1 if not queryprms.get('page') else int(queryprms.get('page'))
            sections = paginate_result(sections, SectionStudentSerializer, 'sections', page)
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