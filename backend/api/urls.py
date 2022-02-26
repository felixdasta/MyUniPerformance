from django.urls import path

from api.views.student import StudentList, StudentDetail

urlpatterns = [
    path('students', StudentList.as_view()),
    path('students/<pk>', StudentDetail.as_view())
]
