from api.serializers import StudentSerializer
from api.models.student import Student

class StudentRepository:
    
    @staticmethod
    def get_all_students():        
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return serializer

    @staticmethod
    def create_student(request):
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def get_student_by_id(pk):
        student = Student.objects.get(pk=pk)
        serializer = StudentSerializer(student)
        return serializer

    @staticmethod
    def get_student_by_email(email):
        student = Student.objects.get(institutional_email=email)
        serializer = StudentSerializer(student)
        return serializer

    @staticmethod
    def update_student(request, pk):
        student = Student.objects.get(pk=pk)
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def delete_student(pk):
        student = Student.objects.get(pk=pk)
        return student.delete()