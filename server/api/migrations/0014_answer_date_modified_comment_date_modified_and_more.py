# Generated by Django 4.2.3 on 2023-07-22 13:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_remove_answer_scores_remove_topic_scores_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='date_modified',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='comment',
            name='date_modified',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='topic',
            name='date_modified',
            field=models.DateTimeField(null=True),
        ),
    ]
