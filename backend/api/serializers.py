from rest_framework.serializers import ModelSerializer
from api.models.student import Student

class StudentSerializer(ModelSerializer):
    class Meta:
        model = Student
        fields = ['user_id', 'first_name', 'last_name', 'year_of_admission', 'institutional_email', 'password', 'curriculums']