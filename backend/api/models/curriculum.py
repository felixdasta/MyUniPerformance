from django.db import models

from api.models.department import Department
from api.models.course import Course

class Curriculum(models.Model):
    curriculum_id = models.IntegerField(primary_key=True, editable=False)
    curriculum_name = models.CharField(max_length=64, null=False)
    curriculum_year = models.SmallIntegerField(null=False)
    department_id = models.ForeignKey(Department, on_delete=models.CASCADE)
    courses = models.ManyToManyField(Course)
