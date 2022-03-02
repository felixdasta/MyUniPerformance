from rest_framework.serializers import ModelSerializer
from api.models.student import Student
from api.models.university import University
from api.models.section import Section
from api.models.department import Department
from api.models.curriculum import Curriculum


class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = fields = ['user_id', 'first_name', 'last_name', 'year_of_admission', 'institutional_email', 'is_email_verified', 'password', 'curriculums']

class UniversitySerializer(ModelSerializer):
    class Meta:
        model = University
        fields = ['university_id', 'university_name', 'university_website', 'university_location', 'institutional_domain']

class SectionSerializer(ModelSerializer):
    class Meta:
        model = Section
        fields = ['section_id', 'section_code', 'section_syllabus', 'section_term', 'course_id', 'instructor_id', 'enrolled_students', 'likes']

class DepartmentSerializer(ModelSerializer):
    class Meta:
        model = Department
        fields = ['department_id', 'department_name', 'university_id']

class CurriculumSerializer(ModelSerializer):
    class Meta:
        model = Curriculum
        fields = ['curriculum_id', 'curriculum_name', 'curriculum_year', 'department', 'courses']

