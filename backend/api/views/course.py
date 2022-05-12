from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.repositories.course import CourseRepository
from api.models.course import Course
from api.serializers import CustomCourseSerializer, CourseSerializer
from api.utils import paginate_result
from rest_framework.decorators import api_view

class CourseList(APIView):
    """
    List all courses or create a new one
    """
    def get(self, request, university_id=None, format=None):
        try:
            queryprms = request.GET
            courses = CourseRepository.get_courses_by_params(queryprms, university_id)
            page = 1 if not queryprms.get('page') else int(queryprms.get('page'))
            courses = paginate_result(courses, CourseSerializer, 'courses', page, 25)
            return Response(courses)
        except Course.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def post(self, request, format=None):
        course = CourseRepository.create_course(request)
        return Response(course.data 
        if course.is_valid() 
        else course._errors, 
        status = status.HTTP_201_CREATED 
        if course.is_valid() 
        else status.HTTP_400_BAD_REQUEST)
    
class CourseDetail(APIView):
    """
    Read, update, or delete a specific course
    """
    def get(self, request, pk, format=None):
        try:
            course = CourseRepository.get_course_by_id(pk)
            serializer = CustomCourseSerializer(course)
            return Response(serializer.data, status.HTTP_200_OK)
        except Course.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        try:
            course = CourseRepository.update_course(request, pk)
            return Response(course.data 
            if course.is_valid() 
            else course._errors, 
            status = status.HTTP_201_CREATED 
            if course.is_valid() 
            else status.HTTP_400_BAD_REQUEST)
        except Course.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        CourseRepository.delete_course(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def get_courses_by_department_id(request, department_id):
        try:
            courses = CourseRepository.get_courses_by_department(department_id)
            serializer = CourseSerializer(courses, many=True)
            return Response(serializer.data)
        except Course.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)