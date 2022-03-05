import uuid
from django.db import models

from api.models.department import Department

class Staff_Member(models.Model):
    member_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=256, null=False, default="")
    institutional_email = models.CharField(max_length=320, null=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)