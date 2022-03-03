from rest_framework.serializers import ModelSerializer
from api.models.student import Student
from api.models.course import Course


class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = ['user_id', 'first_name', 'last_name', 'year_of_admission', 'institutional_email', 'password', 'curriculums']

class CourseSerializer(ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id', 'course_name', 'course_code', 'course_credits', 'department_id']