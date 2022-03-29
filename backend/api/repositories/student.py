from django.utils.encoding import force_str
from django.contrib import messages
from api.models.student import Student
from api.serializers import StudentSerializer
from api.utils import generate_token
from base64 import urlsafe_b64decode

class StudentRepository:
    
    @staticmethod
    def get_students_by_params(queryprms):        
        students = Student.objects.prefetch_related('curriculums__curriculum_courses_set__course__department')

        if queryprms.get('university_id') != None:
            students = students.filter(curriculums__department__university = queryprms.get('university_id'))
        if queryprms.get('department_id') != None:
            students = students.filter(curriculums__department = queryprms.get('department_id'))
        if queryprms.get('curriculum_id') != None:
            students = students.filter(curriculums = queryprms.get('curriculum_id'))
        if queryprms.get('institutional_email') != None:
            students = students.filter(institutional_email = queryprms.get('institutional_email'))
        if queryprms.get('year_of_admission') != None:
            students = students.filter(year_of_admission = queryprms.get('year_of_admission'))

        return students

    @staticmethod
    def create_student(request):
        student = Student.objects.create(**request.data)
        return student

    @staticmethod
    def get_student_by_id(pk):
        student = Student.objects.prefetch_related('curriculums__curriculum_courses_set__course__department').get(pk=pk)
        return student

    @staticmethod
    def get_student_by_email(email):
        student = Student.objects.get(institutional_email=email)
        return student

    @staticmethod
    def update_student(request, pk):
        student = Student.objects.get(pk=pk)
        return student

    @staticmethod
    def delete_student(pk):
        student = Student.objects.get(pk=pk)
        return student.delete()

    @staticmethod
    def activate_student(request,uidb64,token):
        try:
            uid=force_str(urlsafe_b64decode(uidb64))
            student = Student.objects.get(pk=uid)
        except Exception as e:
            student = None

        if student and generate_token.check_token(student,token):
            student.is_email_verified = True
            student.save()

            messages.add_message(request, messages.SUCCESS,
                                'Email verified, you can now login')
        return student