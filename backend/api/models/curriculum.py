from django.db import models

from api.models.department import Department
from api.models.course import Course

class Curriculum(models.Model):
    curriculum_id = models.AutoField(primary_key=True, editable=False)
    curriculum_name = models.CharField(max_length=64, null=False)
    curriculum_year = models.SmallIntegerField(null=False)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    courses = models.ManyToManyField(Course, through='Curriculum_Courses')

class Curriculum_Courses(models.Model):
    curriculum = models.ForeignKey(Curriculum, on_delete=models.CASCADE)
    semester = models.IntegerField(null=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
