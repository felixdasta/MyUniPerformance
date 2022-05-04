from api.models.section import Section
from api.models.section import Student
from api.models.section import Section_Students
from api.repositories.feedback import FeedbackRepository
from django.db.models import Prefetch

class SectionRepository:

    def get_all_sections():
        feedbacks = FeedbackRepository.get_feedback_by_params()
        sections = Section.objects.prefetch_related(Prefetch('feedback_set', queryset=feedbacks),
                    'instructors__department', 'likes') \
                    .select_related('grade_stats')

        return sections

    def get_sections_by_student(queryprms):
        sections = Section_Students.objects.select_related('section__course__department')
        
        if queryprms.get('student_id'):
            sections = sections.filter(student = queryprms.get('student_id'))
        if queryprms.get('section_term'):
            sections = sections.filter(section_term = queryprms.get('section_term'))

        return sections

    @staticmethod
    def get_section_by_id(pk):
        section = Section.objects.prefetch_related('instructors__department', 'likes', 'feedback_set').get(pk=pk)
        return section

    @staticmethod
    def get_sections_terms_by_university(university_id):
        sections = Section.objects \
        .filter(course__department__university = university_id) \
        .values_list('section_term', flat=True) \
        .distinct('section_term')

        return sections

    @staticmethod
    def enroll_student_or_update_grade(request):
        section = Section.objects.get(pk=request.data['section_id'])
        student = Student.objects.get(pk=request.data['student_id'])

        if section and student:
            if student not in section.enrolled_students.all():
                student = Section_Students.objects.create(**request.data)
            else: 
                student = Section_Students.objects.update(**request.data)

        return section

    @staticmethod
    def drop_student(request):
        section = Section.objects.get(pk=request.data['section_id'])
        student = Student.objects.get(pk=request.data['student_id'])
        
        if student not in section.enrolled_students.all():
            raise Exception("Coudn't find student in section.")

        return section.enrolled_students.remove(student)