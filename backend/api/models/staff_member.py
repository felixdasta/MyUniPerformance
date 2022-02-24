import uuid
from django.db import models

from api.models.department import Department

class Staff_Member(models.Model):
    member_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=46, null=False)
    last_name = models.CharField(max_length=46, null=False)
    institutional_email = models.CharField(max_length=320, null=False)
    department_id = models.ForeignKey(Department, on_delete=models.CASCADE)