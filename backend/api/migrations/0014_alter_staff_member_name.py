# Generated by Django 4.0.2 on 2022-03-06 21:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_alter_feedback_instructor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='staff_member',
            name='name',
            field=models.CharField(max_length=256),
        ),
    ]