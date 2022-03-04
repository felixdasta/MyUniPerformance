from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from api.repositories.course import CourseRepository

class CourseList(APIView):
    """
    List all courses or create a new one
    """
    def get(self, request, format=None):
        courses = CourseRepository.get_all_courses()
        return Response(courses.data)
    
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
            return Response(course.data)
        except:
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
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk, format=None):
        CourseRepository.delete_course(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)