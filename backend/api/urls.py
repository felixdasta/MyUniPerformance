from django.urls import path
from api.views \
import student, curriculum, \
course, university, section, \
grade_stats, feedback, grade_stats, \
department, staff_member, utils


urlpatterns = [
    path('login', student.StudentLogin.as_view()),
    path('students', student.StudentList.as_view()),
    path('students/<pk>', student.StudentDetail.as_view()),
    path('students/<user_id>/sections/<section_id>', section.EnrollStudent.as_view()),
    path('send-activation-email', student.send_activation_email),
    path('departments', department.DepartmentList.as_view()),
    path('instructors/<pk>', staff_member.StaffMemberDetail.as_view()),
    
    path('universities', university.UniversityList.as_view()),
    path('universities/<pk>', university.UniversityDetail.as_view()),
    path('universities/<university_id>/curriculums', curriculum.CurriculumList.as_view()),
    path('universities/<university_id>/courses', course.CourseList.as_view()),
    path('universities/<university_id>/sections-terms', section.get_sections_terms_by_university),
    path('universities/<university_id>/departments', department.get_departments_by_university),
    path('universities/<university_id>/instructors', staff_member.StaffMemberList.as_view()),

    path('departments/<department_id>/courses', course.get_courses_by_department_id),
    path('courses', course.CourseList.as_view()),
    path('courses/<pk>', course.CourseDetail.as_view()),

    path('sections', section.SectionList.as_view()),
    path('sections/<pk>', section.SectionDetail.as_view()),
    path('sections/<section_id>/feedbacks', feedback.FeedbackList.as_view()),
    path('sections/<pk>/grade-stats', grade_stats.GradeStatsDetail.as_view()),

    path('loaderio-2cfac6fc22e5d24034475d0fcb53e6e1/', utils.get_loader_io),
    path('feedbacks/<pk>', feedback.FeedbackDetail.as_view()),
    path('students/<user_id>/feedbacks/<feedback_id>/like', feedback.FeedbackLike.as_view()),
    path('students/<user_id>/feedbacks/<feedback_id>/report', feedback.report_feedback),


    path('curriculums/<pk>', curriculum.CurriculumDetail.as_view()),
    path('curriculums', curriculum.CurriculumList.as_view()),
    path('activate-user/<uidb64>/<token>', student.activate_student, name='activate')
]
