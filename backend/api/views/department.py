from api.repositories.department import DepartmentRepository
from api.repositories.department import Department
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from api.models.department import Department

class DepartmentList(APIView):
    """
    List all departments, or create a new one.
    """
    def get(self, request, format=None):
        department = DepartmentRepository.get_all_departments()
        return Response(department.data)

class DepartmentDetail(APIView):
    """
    Retrieve, update or delete a department instance
    """
    def get(self, request, pk, format=None):
        try:
            department = DepartmentRepository.get_department_by_id(pk)
            return Response(department.data)
        except Department.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_departments_by_university(request, university_id):
    departments = DepartmentRepository.get_departments_by_university(university_id)
    return Response(departments.data)