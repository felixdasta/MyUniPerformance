from django.db import models

from api.models.section import Section


class Grade_stats(models.Model):
    a_count = models.IntegerField(null=False, default=0)
    b_count = models.IntegerField(null=False, default=0)
    c_count = models.IntegerField(null=False, default=0)
    d_count = models.IntegerField(null=False, default=0)
    f_count = models.IntegerField(null=False, default=0)
    p_count = models.IntegerField(null=False, default=0)
    w_count = models.IntegerField(null=False, default=0)
    ib_count = models.IntegerField(null=False, default=0)
    ic_count = models.IntegerField(null=False, default=0)
    id_count = models.IntegerField(null=False, default=0)
    if_count = models.IntegerField(null=False, default=0)
    section = models.OneToOneField(Section,to_field='section_id', primary_key=True,on_delete=models.CASCADE)