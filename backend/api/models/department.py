from django.db import models

from api.models.university import University

class Department(models.Model):
    department_id = models.AutoField(primary_key=True, editable=False)
    department_name = models.CharField(max_length=64, null=False)
    university = models.ForeignKey(University, on_delete=models.CASCADE)