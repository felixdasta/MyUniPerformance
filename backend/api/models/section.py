from django.db import models
from api.models.course import Course
from api.models.staff_member import Staff_Member
from api.models.student import Student

class Section(models.Model):
    section_id = models.IntegerField(primary_key=True, editable=False)
    section_code = models.CharField(max_length=4, null=False)
    section_syllabus = models.FileField(upload_to='syllabuses/')
    section_term = models.CharField(max_length=11, null=False)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    instructor_id = models.ForeignKey(Staff_Member, on_delete=models.CASCADE)
    enrolled_students = models.ManyToManyField(Student)
    likes = models.ManyToManyField(Student,related_name="section_likes", blank=True)