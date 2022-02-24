import uuid
from django.db import models
from api.models.curriculum import Curriculum

class Student(models.Model):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=46, null=False)
    last_name = models.CharField(max_length=46, null=False)
    year_of_admission = models.SmallIntegerField(null=False)
    institutional_email = models.CharField(max_length=320, null=False)
    password = models.TextField(null=False)
    curriculums = models.ManyToManyField(Curriculum, blank=True)