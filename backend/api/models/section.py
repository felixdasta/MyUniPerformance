from django.db import models
from api.models.course import Course
from api.models.staff_member import Staff_Member
from api.models.student import Student

class Section(models.Model):
    section_id = models.AutoField(primary_key=True, editable=False)
    section_code = models.CharField(max_length=4, null=False)
    section_syllabus = models.TextField(null=True)
    section_term = models.CharField(max_length=11, null=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    instructors = models.ManyToManyField(Staff_Member)
    enrolled_students = models.ManyToManyField(Student, through='Section_Students')

class Section_Students(models.Model):
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    grade_obtained = models.CharField(max_length=2, null=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)