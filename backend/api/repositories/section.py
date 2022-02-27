import statistics
from api.serializers import SectionSerializer
from api.models.section import Section

class SectionRepository:

    @staticmethod
    def get_all_sections():
        section = Section.objects.all()
        serializer = SectionSerializer(section, many=True)
        return serializer
    
    @staticmethod
    def create_section(request):
        serializer = SectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def get_section_by_id(pk):
        section = Section.objects.get(pk=pk)
        serializer = SectionSerializer(section)
        return serializer

    #get_all_sections_by_modality -> Pick by modality and delete all that
    #match criteria

    #get_all_sections_by_instructor -> Pick by instructor and get all that
    #match criteria
    
    @staticmethod
    def update_section(request, pk):
        section = Section.objects.get(pk=pk)
        serializer = SectionSerializer(section, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def delete_section(pk):
        section = Section.objects.get(pk=pk)
        return section.delete()