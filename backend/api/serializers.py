from rest_framework import serializers
from api.models.student import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['user_id', 'first_name', 'last_name', 'year_of_admission', 'institutional_email', 'password', 'curriculums']