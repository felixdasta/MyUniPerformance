from django.urls import path
from api.views import student, curriculum
from api.views.student import StudentList, StudentDetail
from api.views.university import UniversityDetail, UniversityList
from api.views.section import SectionDetail, SectionList

urlpatterns = [
    path('students', student.StudentList.as_view()),
    path('students/<pk>', student.StudentDetail.as_view()),
    path('universities', UniversityList.as_view()),
    path('universities/<pk>', UniversityDetail.as_view()),
    path('section/', SectionList.as_view()),
    path('section/<pk>', SectionDetail.as_view()),
    path('curriculums/<curriculum_id>/students', student.CurriculumStudentList.as_view()),
    path('curriculums/<pk>', curriculum.CurriculumDetail.as_view()),
    path('curriculums', curriculum.CurriculumList.as_view()),
    path('universities/<university_id>/curriculums', curriculum.UniversityCurriculumList.as_view()),
    path('activate-user/<uidb64>/<token>', student.activate_student, name='activate')
]
