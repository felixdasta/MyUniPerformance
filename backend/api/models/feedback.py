from django.db import models

from api.models.section import Section
from api.models.student import Student


class Feedback(models.Model):
    feedback_id = models.IntegerField(primary_key=True, editable=False)
    timestamp = models.DateTimeField(auto_now_add=True, blank=True)
    praises = models.TextField()
    criticism = models.TextField()
    section_id = models.ForeignKey(Section, on_delete=models.CASCADE)
    student_id = models.ForeignKey(Student, on_delete=models.CASCADE)
    is_misplaced = models.BooleanField(default=False)
    likes = models.ManyToManyField(Student,related_name="feedback_likes", blank=True)