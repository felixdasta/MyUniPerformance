from rest_framework.serializers import ModelSerializer
from api import models

class UniversitySerializer(ModelSerializer):

    class Meta:
        model = models.university.University
        fields = ['university_id','university_name','university_website','university_location', 'institutional_domain']

class DepartmentSerializer(ModelSerializer):
    university = UniversitySerializer(read_only=True)

    class Meta:
        model = models.department.Department
        fields = ['department_id','department_name','university']

class CurriculumSerializer(ModelSerializer):
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = models.curriculum.Curriculum
        fields = ['curriculum_id', 'curriculum_name', 'curriculum_year', 'department', 'courses']

class StudentSerializer(ModelSerializer):
    curriculums = CurriculumSerializer(many=True, read_only=True)

    class Meta:
        model = models.student.Student
        fields = ['user_id', 'first_name', 'last_name', 'year_of_admission', 'institutional_email', 'is_email_verified', 'password', 'curriculums']