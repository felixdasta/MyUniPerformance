from django.urls import path

from api.views.student import StudentView

urlpatterns = [
    path('students', StudentView.get_all_students_or_create),
]
