from api.serializers import StudentSerializer
from api.models.curriculum import Curriculum
from api.models.student import Student
from api.utils import generate_token
from django.utils.encoding import force_str
from django.contrib import messages
from base64 import urlsafe_b64decode

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
    def get_students_by_curriculum(curriculum_id):
        curriculums = Student.objects.prefetch_related('curriculums').filter(curriculums=curriculum_id)
        serializer = StudentSerializer(curriculums, many=True)
        return serializer

    @staticmethod
    def update_student(request, pk):
        student = Student.objects.get(pk=pk)
        serializer = StudentSerializer(student, data=request.data, partial=True)
        
        if 'curriculums' in request.data:
            curriculums = []
            for curriculum_id in request.data['curriculums']:
                curriculum = Curriculum.objects.get(pk=curriculum_id)
                curriculums.append(curriculum)
            student.curriculums.set(curriculums)

        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def delete_student(pk):
        student = Student.objects.get(pk=pk)
        return student.delete()

    @staticmethod
    def activate_student(request,uidb64,token):
        try:
            uid=force_str(urlsafe_b64decode(uidb64))
            student = Student.objects.get(pk=uid)
            serializer = StudentSerializer(student)
        except Exception as e:
            student = None

        if student and generate_token.check_token(serializer.data,token):
            student.is_email_verified = True
            student.save()

            messages.add_message(request, messages.SUCCESS,
                                'Email verified, you can now login')
        return student