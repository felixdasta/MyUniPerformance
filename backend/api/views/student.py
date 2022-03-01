
from rest_framework import status
from rest_framework.response import Response
from api.repositories.student import StudentRepository
from api.authentication import Authentication 
from rest_framework.views import APIView
from api.models.student import Student
from django.urls import reverse
from django.shortcuts import render, redirect

class StudentList(APIView):
    """
    List all students, or create a new student.
    """
    def get(self, request, format=None):
        student = StudentRepository.get_all_students()
        return Response(student.data)

    def post(self, request, format=None):
        errors = Authentication.get_auth_errors(request)

        if len(errors) > 0:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        Authentication.hash_password(request)
        student = StudentRepository.create_student(request)
        Authentication.send_activation_email(student.data, request)
            
        return Response(student.data 
        if student.is_valid() 
        else student._errors, 
        status = status.HTTP_201_CREATED 
        if student.is_valid() 
        else status.HTTP_400_BAD_REQUEST)

class StudentDetail(APIView):
    """
    Retrieve, update or delete a student instance.
    """
    def get(self, request, pk, format=None):
        try:
            student = StudentRepository.get_student_by_id(pk)
            return Response(student.data)
        except Student.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        errors = Authentication.get_auth_errors(request, pk)

        if len(errors) > 0:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        Authentication.hash_password(request)
        student = StudentRepository.update_student(request, pk)

        return Response(student.data 
        if student.is_valid() 
        else student._errors, 
        status = status.HTTP_201_CREATED 
        if student.is_valid() 
        else status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        StudentRepository.delete_student(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

def activate_student(request, uidb64, token):
    student = StudentRepository.activate_student(request, uidb64, token)
    return (redirect(reverse('login')) 
    if student.is_email_verified 
    else render(request, 'authentication/activate-failed.html', 
    {"student": student}))