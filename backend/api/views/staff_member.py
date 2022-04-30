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
            return Response(serializer.data, status.HTTP_200_OK)
        except Staff_Member.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)