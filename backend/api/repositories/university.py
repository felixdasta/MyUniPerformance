from api.models.university import University
from django.db.models import Q

class UniversityRepository:

    @staticmethod
    def get_universities_by_params(queryprms):
        university = University.objects.all()
        condition = Q()

        if(queryprms.get("institutional_domain")):
            condition &= Q(institutional_domain = queryprms.get("institutional_domain"))

        university=university.filter(condition)
        return university

    @staticmethod
    def get_university_by_id(pk):
        university = University.objects.get(pk=pk)
        return university

    @staticmethod
    def get_university_by_name(name):
        university = University.objects.get(university_name=name)
        return university