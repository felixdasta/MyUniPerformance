from django.db import models

from api.models.department import Department


class Course(models.Model):
    course_id = models.IntegerField(primary_key=True, editable=False)
    course_name = models.CharField(max_length=64, null=False)
    course_code = models.CharField(max_length=8, null=False)
    course_credits = models.SmallIntegerField(null=False)
    department_id = models.ForeignKey(Department, on_delete=models.CASCADE)