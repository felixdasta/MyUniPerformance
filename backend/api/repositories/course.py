from api.serializers import CustomCourseSerializer
from api.models.course import Course
from api.repositories.section import SectionRepository
from django.db.models.functions import Length
from django.db.models import Prefetch, CharField, Subquery, Q

class CourseRepository:

    @staticmethod
    def get_courses_by_params(queryprms, university_id=None):
        CharField.register_lookup(Length, 'length')
        courses = Course.objects.all()

        course_condition = Q(course_id__in = Subquery(SectionRepository.get_all_sections().values("course_id")))

        if university_id != None:
            courses = courses.filter(department__university = university_id)

        modality = queryprms.get('modality')
        
        if queryprms.get('course_code'):
            course_condition &= Q(course_code = queryprms.get('course_code'))
        if queryprms.get('section_term'):
            course_condition &= Q(section__section_term__icontains = queryprms.get('section_term'))
        if queryprms.get('section_code'):
            course_condition &= Q(section__section_code = queryprms.get('section_code'))
        if queryprms.get('department_id'):
            course_condition &= Q(department = queryprms.get('department_id'))
        if queryprms.get('instructor_name'):
            course_condition &= Q(section__instructors__name__icontains = queryprms.get('instructor_name'))
        if queryprms.get('student_id'):
            course_condition &= Q(section__enrolled_students = queryprms.get('student_id'))
        if modality:
            if (modality == 'D' or modality == 'H' or modality == 'E'):
                course_condition &= Q(section__section_code__endswith = modality) & Q(section__section_code__length__gte=4)
            if (modality == 'P'):
                modalities_to_exclude = ['D', 'H', 'E']
                for current_modality in modalities_to_exclude:
                    course_condition &= ~(Q(section__section_code__endswith = current_modality) & Q(section__section_code__length__gte=4)) 
                
        courses = courses.select_related('department') \
                    .filter(course_condition) \
                    .order_by('course_code') \
                    .distinct()


        return courses

    @staticmethod
    def create_course(request):
        serializer = CustomCourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def get_courses_by_department(department_id):
        courses = Course.objects.all().select_related('department').filter(department = department_id)
        return courses

    @staticmethod
    def get_course_by_id(pk):
        sections = SectionRepository.get_all_sections()
        course = Course.objects.select_related('department') \
                    .prefetch_related(Prefetch('section_set', queryset=sections)) \
                    .filter(course_id__in = Subquery(sections.values("course_id"))) \
                    .distinct().get(pk=pk)
        return course

    @staticmethod
    def update_course(request, pk):
        course = Course.objects.get(pk=pk)
        serializer = CustomCourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer
    
    @staticmethod
    def delete_course(pk):
        course = Course.objects.get(pk=pk)
        return course.delete()
