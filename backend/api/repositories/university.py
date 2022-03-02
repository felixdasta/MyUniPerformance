from api.serializers import UniversitySerializer
from api.models.university import University

class UniversityRepository:

    @staticmethod
    def get_all_universities():
        university = University.objects.all()
        serializer = UniversitySerializer(university, many=True)
        return serializer

    @staticmethod
    def create_university(request):
        serializer = UniversitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def get_university_by_id(pk):
        university = University.objects.get(pk=pk)
        serializer = UniversitySerializer(university)
        return serializer

    @staticmethod
    def get_university_by_name(name):
        university = University.objects.get(university_name=name)
        serializer = UniversitySerializer(university)
        return serializer
    
    @staticmethod
    def update_university(request, pk):
        university = University.objects.get(pk=pk)
        serializer = UniversitySerializer(university, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer
    
    @staticmethod
    def delete_university(pk):
        university = University.objects.get(pk=pk)
        return university.delete()