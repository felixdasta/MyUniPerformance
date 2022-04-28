from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.repositories.staff_member import StaffMemberRespository
from api.models.staff_member import Staff_Member
from api.serializers import StaffMemberSerializer, CustomStaffMemberSerializer
from api.utils import paginate_result

class StaffMemberList(APIView):
    """
    List all instructors
    """
    def get(self, request, university_id=None, format=None):
        try:
            queryprms = request.GET
            instructors = StaffMemberRespository.get_instructors_by_params(queryprms, university_id)
            page = 1 if not queryprms.get('page') else int(queryprms.get('page'))
            instructors = paginate_result(instructors, StaffMemberSerializer, 'instructors', page, 25)
            return Response(instructors)
        except Staff_Member.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
class StaffMemberDetail(APIView):
    """
    Read a specific instructors
    """
    def get(self, request, pk, format=None):
        try:
            instructor = StaffMemberRespository.get_instructor_by_id(pk)
            serializer = CustomStaffMemberSerializer(instructor)

            #lets convert the serializer to our desired field
            result = {
            'member_id': serializer.data['member_id'],
            'name': serializer.data['name'],
            'institutional_email': serializer.data['institutional_email'],
            'department': serializer.data['department'],
            'sections': serializer.data['sections']
            }

            unique_courses = {}
            for section in result['sections']:
                course = section.pop('course', None)
                unique_course = course['course_id']
                if(unique_course not in unique_courses):
                    unique_courses[unique_course] = course
                    unique_courses[unique_course]['sections'] = []
                unique_courses[unique_course]['sections'].append(section)

            result.pop('sections', None)
            result['courses'] = unique_courses.values()
            return Response(result, status.HTTP_200_OK)
        except Staff_Member.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)