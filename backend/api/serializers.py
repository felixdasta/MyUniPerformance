from rest_framework.serializers import ModelSerializer
from api.models.student import Student
from api.models.curriculum import Curriculum

class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = ['user_id', 'first_name', 'last_name', 'year_of_admission', 'institutional_email', 'is_email_verified', 'password', 'curriculums']

class CurriculumSerializer(ModelSerializer):
    class Meta:
        model = Curriculum
        fields = ['curriculum_id', 'curriculum_name', 'curriculum_year', 'department', 'courses']