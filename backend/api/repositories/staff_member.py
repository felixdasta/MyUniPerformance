from api.models.staff_member import Staff_Member
from api.repositories.section import SectionRepository
from django.db.models.functions import Length
from django.db.models import Prefetch, CharField, Subquery, Q

class StaffMemberRespository:

    @staticmethod
    def get_instructors_by_params(queryprms, university_id):
        CharField.register_lookup(Length, 'length')
        instructors = Staff_Member.objects.all()

        instructor_condition = Q(member_id__in = Subquery(SectionRepository.get_all_sections().values("instructors__member_id")))

        if university_id != None:
            instructors = instructors.filter(department__university = university_id)
        
        if queryprms.get('course_code'):
            instructor_condition &= Q(section__course__course_code = queryprms.get('course_code'))
        if queryprms.get('section_term'):
            instructor_condition &= Q(section__section_term__icontains = queryprms.get('section_term'))
        if queryprms.get('department_id'):
            instructor_condition &= Q(department = queryprms.get('department_id'))
        if queryprms.get('instructor_name'):
            instructor_condition &= Q(section__instructors__name__icontains = queryprms.get('instructor_name')) & Q(name__icontains = queryprms.get('instructor_name'))
        if queryprms.get('student_id'):
            instructor_condition &= Q(section__enrolled_students = queryprms.get('student_id'))
                
        instructors = instructors.select_related('department') \
                    .filter(instructor_condition) \
                    .order_by('name') \
                    .distinct()

        return instructors

    @staticmethod
    def get_instructor_by_id(pk):
        sections = SectionRepository.get_all_sections().select_related('course__department')
        instructor = Staff_Member.objects.select_related('department') \
                    .prefetch_related(Prefetch('section_set', queryset=sections)) \
                    .filter(member_id__in = Subquery(sections.values("instructors"))) \
                    .distinct().get(pk=pk)
        return instructor