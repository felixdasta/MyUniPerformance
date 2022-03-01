from django.urls import path
from api.views import student

urlpatterns = [
    path('students', student.StudentList.as_view()),
    path('students/<pk>', student.StudentDetail.as_view()),
    path('activate-user/<uidb64>/<token>', student.activate_student, name='activate')
]
