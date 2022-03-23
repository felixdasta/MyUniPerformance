from api.serializers import SectionSerializer
from api.models.section import Section
from api.models.section import Student
from api.models.section import Section_Students

class SectionRepository:

    def get_sections_by_params(queryprms, university_id):
        sections = Section.objects.select_related('course__department') \
        .prefetch_related('instructors', 'likes') \
        .order_by('section_term', 'course__course_code')

        if university_id != None:
            sections = sections.filter(course__department__university = university_id)

        modality = queryprms.get('modality')

        if queryprms.get('course_code'):
            sections = sections.filter(course__course_code = queryprms.get('course_code'))
        if queryprms.get('section_term'):
            sections = sections.filter(section_term = queryprms.get('section_term'))
        if queryprms.get('section_code'):
            sections = sections.filter(section_code = queryprms.get('section_code'))
        if queryprms.get('department_id'):
            sections = sections.filter(course__department = queryprms.get('department_id'))
        if queryprms.get('instructor_name'):
            sections = sections.filter(instructors__name__icontains = queryprms.get('instructor_name'))
        if queryprms.get('student_id'):
            sections = sections.filter(enrolled_students = queryprms.get('student_id'))
        if modality:
            if (modality == 'D' or modality == 'H' or modality == 'E'):
                sections = sections.filter(section_code__endswith = modality)
            if (modality == 'P'):
                modalities_to_exclude = ['D', 'H', 'E']
                for current_modality in modalities_to_exclude:
                    sections = sections.exclude(section_code__endswith = current_modality)

        return sections
    
    @staticmethod
    def create_section(request):
        serializer = SectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def get_section_by_id(pk):
        section = Section.objects.select_related('course__department').get(pk=pk)
        serializer = SectionSerializer(section)
        return serializer

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