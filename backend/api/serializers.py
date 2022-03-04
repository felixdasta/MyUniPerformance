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

class SectionSerializer(ModelSerializer):
    enrolled_students = StudentSerializer(many=True, read_only=True)
    
    class Meta:
        model = models.section.Section
        fields = ['section_id', 'section_code', 'section_syllabus', 'section_term', 'course', 'instructor', 'enrolled_students', 'likes']

class CourseSerializer(ModelSerializer):
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = models.course.Course
        fields = ['course_id', 'course_name', 'course_code', 'course_credits', 'department']

class GradeStatsSerializer(ModelSerializer):
    section = SectionSerializer(read_only=True)

    class Meta:
        model = models.grade_stats.Grade_stats
        fields = ['a_count', 'b_count', 'c_count', 'd_count', 'f_count', 'p_count', 'w_count', 'ib_count', 'ic_count', 'id_count', 'if_count', 'section']
