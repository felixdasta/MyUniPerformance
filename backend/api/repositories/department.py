from api.serializers import DepartmentSerializer
from api.models.department import Department

class DepartmentRepository:

    @staticmethod
    def get_all_departments():
        department = Department.objects.all()
        serializer = DepartmentSerializer(department, many=True)
        return serializer
    
    @staticmethod
    def create_department(request):
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    