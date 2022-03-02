from django.db import models
from location_field.models.plain import PlainLocationField

class University(models.Model):
    university_id = models.AutoField(primary_key=True, editable=False)
    university_name = models.CharField(max_length=128, null=False)
    university_website = models.CharField(max_length=128, null=False)
    university_location = PlainLocationField(based_fields=['city'], zoom=7, null=True)
    institutional_domain = models.CharField(max_length=128, null=False)
