
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from api.repositories.student import StudentRepository
from api.models.student import Student
from api.models.curriculum import Curriculum
from api.serializers import StudentSerializer
from api.authentication import Authentication 
from api.utils import paginate_result
from django.urls import reverse
from django.shortcuts import render, redirect

class StudentList(APIView):
    """
    List all students, or create a new student.
    """
    def get(self, request, format=None):
        queryprms = request.GET
        student = StudentRepository.get_students_by_params(queryprms)
        page = 1 if not queryprms.get('page') else int(queryprms.get('page'))
        student = paginate_result(student, StudentSerializer, 'students', page)
        return Response(student)

    def post(self, request, format=None):
        errors = Authentication.validate_email(request)
        password_is_not_valid =  Authentication.validate_password(request)

        if password_is_not_valid:
            errors.append(password_is_not_valid)
        if len(errors) > 0:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        Authentication.hash_password(request)
        serialized_student = StudentRepository.create_student(request)
            
        if serialized_student.is_valid():
            Authentication.send_activation_email(serialized_student.data, request)
            return Response(serialized_student.data, status = status.HTTP_201_CREATED)
        else:
            return Response(serialized_student._errors, status = status.HTTP_400_BAD_REQUEST)

class StudentDetail(APIView):
    """
    Retrieve, update or delete a student instance.
    """
    def get(self, request, pk, format=None):
        try:
            student = StudentRepository.get_student_by_id(pk)
            serializer = StudentSerializer(student)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        errors = []
        
        if 'institutional_email' in request.data:
            errors = Authentication.validate_email(request, pk)
            request.data['is_email_verified'] = False
        if 'password' in request.data:
            password_is_not_valid =  Authentication.validate_password(request)
            if password_is_not_valid:
                errors.append(password_is_not_valid)
            else:
                Authentication.hash_password(request)

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            
        student = StudentRepository.update_student(request, pk)

        serializer = StudentSerializer(student, data=request.data, partial=True)
        
        if 'curriculums' in request.data:
            curriculums = []
            for curriculum_id in request.data['curriculums']:
                curriculum = Curriculum.objects.get(pk=curriculum_id)
                curriculums.append(curriculum)
            student.curriculums.set(curriculums)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)
        else:
            return Response(serializer._errors, status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        StudentRepository.delete_student(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

class StudentLogin(APIView):
    """
    Retrieve a student instance.
    """
    def post(self, request, format=None):
        try:
            student = StudentRepository.get_student_by_email(request.data['institutional_email'])
            serializer = StudentSerializer(student)

            if Authentication.verify_passwords(request.data['password'], student.password):
                if student.is_email_verified:
                    return Response(serializer.data)
                else:
                    return Response({"error": "You must verify your email before logging in."}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"error": "The password you entered is incorrect."}, status=status.HTTP_404_NOT_FOUND)
        except Student.DoesNotExist:
            return Response({"error": "The email you entered is incorrect."}, status=status.HTTP_404_NOT_FOUND)


def activate_student(request, uidb64, token):
    student = StudentRepository.activate_student(request, uidb64, token)
    return (redirect(reverse('login')) 
    if student.is_email_verified 
    else render(request, 'authentication/activate-failed.html', 
    {"student": student}))