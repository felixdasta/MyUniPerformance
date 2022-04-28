from rest_framework.serializers import ModelSerializer
from api import models

class UniversitySerializer(ModelSerializer):
    class Meta:
        model = models.university.University
        fields = ['university_id','university_name','university_website','university_location', 'institutional_domain']

class DepartmentSerializer(ModelSerializer):
    class Meta:
        model = models.department.Department
        fields = ['department_id','department_name','university']

class StaffMemberSerializer(ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    class Meta:
        model = models.staff_member.Staff_Member
        fields = ['member_id', 'name', 'institutional_email', 'department']

class GradeStatsSerializer(ModelSerializer):
    class Meta:
        model = models.grade_stats.Grade_stats
        fields = ['a_count', 'b_count', 'c_count', 'd_count', 'f_count', 'p_count', 'w_count', 'ib_count', 'ic_count', 'id_count', 'if_count']

class CourseSerializer(ModelSerializer):
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = models.course.Course
        fields = ['course_id', 'course_name', 'course_code', 'course_credits', 'department']

class CurriculumCourseSerializer(ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = models.curriculum.Curriculum_Courses
        fields = ['semester', 'course']

class CurriculumSerializer(ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    courses = CurriculumCourseSerializer(source='curriculum_courses_set', many=True, read_only=True)

    class Meta:
        model = models.curriculum.Curriculum
        fields = ['curriculum_id', 'curriculum_name', 'curriculum_year', 'department', 'courses']

class CustomCurriculumSerializer(ModelSerializer):
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = models.curriculum.Curriculum
        fields = ['curriculum_id', 'curriculum_name', 'curriculum_year', 'department']

class SectionSerializer(ModelSerializer):
    course = CourseSerializer(read_only=True)
    instructors = StaffMemberSerializer(many=True, read_only=True)
    
    class Meta:
        model = models.section.Section
        fields = ['section_id', 'section_code', 'section_term', 'course', 'instructors']

class SectionStudentSerializer(ModelSerializer):
    section = SectionSerializer(read_only=True)

    class Meta:
        model = models.section.Section_Students
        fields = ['section', 'grade_obtained']

class StudentSerializer(ModelSerializer):
    curriculums = CurriculumSerializer(many=True, read_only=True)
    enrolled_sections = SectionStudentSerializer(source='section_students_set', many=True, read_only=True)

    class Meta:
        model = models.student.Student
        fields = ['user_id', 'first_name', 'last_name', 'year_of_admission', 'institutional_email', 'curriculums', 'enrolled_sections']

class CustomStudentSerializer(ModelSerializer):
    curriculums = CustomCurriculumSerializer(many=True, read_only=True)
    class Meta:
        model = models.student.Student
        fields = ['user_id', 'first_name', 'last_name', 'year_of_admission', 'institutional_email', 'curriculums']

class FeedbackSerializer(ModelSerializer):
    student = CustomStudentSerializer(read_only=True)
    instructor = StaffMemberSerializer(read_only=True)

    class Meta:
        model = models.feedback.Feedback
        fields = ['feedback_id', 'timestamp', 'praises', 'criticism', 'instructor', 'student', 'is_misplaced', 'likes']

class CustomSectionSerializer(ModelSerializer):
    instructors = StaffMemberSerializer(many=True, read_only=True)
    grades = GradeStatsSerializer(source='grade_stats', read_only=True)
    feedbacks = FeedbackSerializer(source="feedback_set", many=True, read_only=True)
    
    class Meta:
        model = models.section.Section
        fields = ['section_id', 'section_code', 'section_syllabus', 'section_term', 'feedbacks', 'instructors', 'grades', 'likes']

class CustomCourseSerializer(ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    sections = CustomSectionSerializer(source='section_set', many=True, read_only=True)

    class Meta:
        model = models.course.Course
        fields = ['course_id', 'course_name', 'course_code', 'course_credits', 'department', 'sections']

class InstructorSectionSerializer(ModelSerializer):
    course = CourseSerializer(read_only=True)
    grades = GradeStatsSerializer(source='grade_stats', read_only=True)
    feedbacks = FeedbackSerializer(source="feedback_set", many=True, read_only=True)
    
    class Meta:
        model = models.section.Section
        fields = ['section_id', 'section_code', 'section_syllabus', 'section_term', 'feedbacks', 'grades', 'likes', 'course']

class CustomStaffMemberSerializer(ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    sections = InstructorSectionSerializer(source='section_set', many=True, read_only=True)
    class Meta:
        model = models.staff_member.Staff_Member
        fields = ['member_id', 'name', 'institutional_email', 'department', 'sections']