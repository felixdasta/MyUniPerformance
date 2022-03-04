from api.serializers import DepartmentSerializer
from api.models.department import Department

class DepartmentRepository:

    @staticmethod
    def get_all_departments():
        department = Department.objects.all()
        serializer = DepartmentSerializer(department, many=True)
        return serializer

    @staticmethod
    def get_department_by_id(pk):
        department = Department.objects.get(pk=pk)
        serializer = DepartmentSerializer(department)
        return serializer
    
    @staticmethod
    def create_department(request):
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def update_department(request, pk):
        department = Department.objects.get(pk=pk)
        serializer = DepartmentSerializer(department, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer
    
    @staticmethod
    def delete_department(pk):
        department = Department.objects.get(pk=pk)
        return department.delete()