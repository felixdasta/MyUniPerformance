from api.repositories.department import DepartmentRepository
from api.repositories.department import Department
from rest_framework import status
from rest_framework.response import Response
from api.authentication import Authentication
from rest_framework.views import APIView
from api.models.department import Department

class DepartmentList(APIView):
    """
    List all departments, or create a new one.
    """
    def get(self, request, format=None):
        department = DepartmentRepository.get_all_departments()
        return Response(department.data)

    def post(self, request, format=None):
        errors = Authentication.get_auth_errors(request)

        if len(errors) > 0:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        Authentication.hash_password(request)
        department = DepartmentRepository.create_department(request)

        return Response(department.data
        if department.is_valid()
        else department._errors,
        status = status.HTTP_201_CREATED
        if department.is_valid()
        else status.HTTP_400_BAD_REQUEST)


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

    def put(self, request, pk, format=None):
        errors = Authentication.get_auth_errors(request, pk)

        if len(errors) > 0:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        Authentication.hash_password(request)
        department = DepartmentRepository.update_department(request, pk)

        return Response(department.data 
        if department.is_valid() 
        else department._errors, 
        status = status.HTTP_201_CREATED 
        if department.is_valid() 
        else status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        DepartmentRepository.delete_department(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)