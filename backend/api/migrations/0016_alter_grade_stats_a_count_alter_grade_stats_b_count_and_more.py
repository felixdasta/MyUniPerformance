# Generated by Django 4.1.dev20220314070627 on 2022-03-22 04:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_alter_section_section_syllabus'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grade_stats',
            name='a_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='grade_stats',
            name='b_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='grade_stats',
            name='c_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='grade_stats',
            name='d_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='grade_stats',
            name='f_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='grade_stats',
            name='ib_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='grade_stats',
            name='ic_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='grade_stats',
            name='id_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='grade_stats',
            name='if_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='grade_stats',
            name='p_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='grade_stats',
            name='w_count',
            field=models.IntegerField(default=0),
        ),
    ]
