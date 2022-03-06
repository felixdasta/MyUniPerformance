from django.db import models

from api.models.section import Section
from api.models.student import Student
from api.models.staff_member import Staff_Member

class Feedback(models.Model):
    feedback_id = models.AutoField(primary_key=True, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True, blank=True)
    praises = models.TextField()
    criticism = models.TextField()
    instructor = models.ForeignKey(Staff_Member, on_delete=models.CASCADE)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    is_misplaced = models.BooleanField(default=False)
    likes = models.ManyToManyField(Student,related_name="feedback_likes", blank=True)