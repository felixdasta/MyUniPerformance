from django.db import models

from api.models.section import Section


class Grade_stats(models.Model):
    a_count = models.IntegerField(null=False)
    b_count = models.IntegerField(null=False)
    c_count = models.IntegerField(null=False)
    d_count = models.IntegerField(null=False)
    f_count = models.IntegerField(null=False)
    p_count = models.IntegerField(null=False)
    w_count = models.IntegerField(null=False)
    ib_count = models.IntegerField(null=False)
    ic_count = models.IntegerField(null=False)
    id_count = models.IntegerField(null=False)
    if_count = models.IntegerField(null=False)
    section = models.OneToOneField(Section,to_field='section_id', primary_key=True,on_delete=models.CASCADE)