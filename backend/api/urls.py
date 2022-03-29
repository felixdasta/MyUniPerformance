from django.urls import path
from api.views \
import student, curriculum, \
course, university, section, \
grade_stats, feedback, grade_stats


urlpatterns = [
    path('login', student.StudentLogin.as_view()),
    path('students', student.StudentList.as_view()),
    path('students/<pk>', student.StudentDetail.as_view()),
    path('students/<user_id>/sections/<section_id>', section.EnrollStudent.as_view()),
    path('send-activation-email', student.send_activation_email),
    
    path('universities', university.UniversityList.as_view()),
    path('universities/<pk>', university.UniversityDetail.as_view()),
    path('universities/<university_id>/curriculums', curriculum.CurriculumList.as_view()),
    path('universities/<university_id>/sections', section.SectionList.as_view()),

    path('courses', course.CourseList.as_view()),
    path('courses/<pk>', course.CourseDetail.as_view()),

    path('sections', section.SectionList.as_view()),
    path('sections/<pk>', section.SectionDetail.as_view()),
    path('sections/<section_id>/feedbacks', feedback.FeedbackList.as_view()),
    path('sections/<pk>/grade-stats', grade_stats.GradeStatsDetail.as_view()),

    path('curriculums/<pk>', curriculum.CurriculumDetail.as_view()),
    path('curriculums', curriculum.CurriculumList.as_view()),
    path('activate-user/<uidb64>/<token>', student.activate_student, name='activate')
]
