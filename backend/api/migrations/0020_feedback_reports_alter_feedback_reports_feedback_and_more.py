# Generated by Django 4.1.dev20220508003043 on 2022-05-08 04:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_remove_feedback_reports_feedback_reports'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback',
            name='reports',
            field=models.ManyToManyField(blank=True, related_name='feedback_reports', through='api.Feedback_Reports', to='api.student'),
        ),
        migrations.AlterField(
            model_name='feedback_reports',
            name='feedback',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reported_feedback', to='api.feedback'),
        ),
        migrations.AlterField(
            model_name='feedback_reports',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reporter', to='api.student'),
        ),
    ]
