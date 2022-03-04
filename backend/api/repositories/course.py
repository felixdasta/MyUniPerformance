from api.serializers import CourseSerializer
from api.models.course import Course

class CourseRepository:

    @staticmethod
    def get_all_courses():
        course = Course.objects.all()
        serializer = CourseSerializer(course, many=True)
        return serializer

    @staticmethod
    def create_course(request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer

    @staticmethod
    def get_course_by_id(pk):
        course = Course.objects.get(pk=pk)
        serializer = CourseSerializer(course)
        return serializer

    @staticmethod
    def update_course(request, pk):
        course = Course.objects.get(pk=pk)
        serializer = CourseSerializer(course, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return serializer
    
    @staticmethod
    def delete_course(pk):
        course = Course.objects.get(pk=pk)
        return course.delete()
