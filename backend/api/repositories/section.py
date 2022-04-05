from api.serializers import SectionSerializer
from api.models.section import Section
from api.models.section import Student
from api.models.section import Section_Students

class SectionRepository:

    def get_all_sections():
        sections = Section.objects.prefetch_related('instructors', 'likes') \
        .order_by('section_term', 'course__course_code')

        return sections

    def get_sections_by_student(queryprms):
        sections = Section_Students.objects.select_related('section__course__department')
        
        if queryprms.get('student_id'):
            sections = sections.filter(student = queryprms.get('student_id'))
        if queryprms.get('section_term'):
            sections = sections.filter(section_term = queryprms.get('section_term'))

        return sections

    
    @staticmethod
    def create_section(request):
        serializer = SectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def get_section_by_id(pk):
        section = Section.objects.prefetch_related('instructors', 'likes').get(pk=pk)
        serializer = SectionSerializer(section)
        return serializer

    @staticmethod
    def get_sections_terms_by_university(university_id):
        sections = Section.objects.prefetch_related('instructors', 'likes') \
        .select_related('course__department') \
        .filter(course__department__university = university_id) \
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

        serializer = SectionSerializer(section)
        return serializer


    @staticmethod
    def drop_student(request):
        section = Section.objects.get(pk=request.data['section_id'])
        student = Student.objects.get(pk=request.data['student_id'])
        
        if student not in section.enrolled_students.all():
            raise Exception("Coudn't find student in section.")

        return section.enrolled_students.remove(student)