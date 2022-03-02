from django.urls import path

from api.views.student import StudentList, StudentDetail
from api.views.university import UniversityDetail, UniversityList
from api.views.section import SectionDetail, SectionList

urlpatterns = [
    path('students', StudentList.as_view()),
    path('students/<pk>', StudentDetail.as_view()),
    path('university/', UniversityList.as_view()),
    path('university/<pk>', UniversityDetail.as_view()),
    path('section/', SectionList.as_view()),
    path('section/<pk>', SectionDetail.as_view()),
    #path('department'),
    #path('department/<pk>')
]
