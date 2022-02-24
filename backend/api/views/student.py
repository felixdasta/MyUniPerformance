from api.models.student import Student
from api.serializers import StudentSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from passlib.hash import pbkdf2_sha256 as sha256
from api.util.utilities import HttpStatus

class StudentView:

    @csrf_exempt
    def get_all_students_or_create(request):
        if request.method == 'GET':
            students = Student.objects.all()
            serializer = StudentSerializer(students, many=True)
            return JsonResponse(serializer.data, safe=False)
        elif request.method == 'POST':
            data = JSONParser().parse(request)
            data['password'] =  sha256.hash(data['password'])
            print(data)
            serializer = StudentSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return JsonResponse(serializer.data, status=HttpStatus.CREATED)
            else:
                return JsonResponse(serializer._errors, status=HttpStatus.BAD_REQUEST)