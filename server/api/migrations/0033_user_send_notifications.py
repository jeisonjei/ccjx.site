# Generated by Django 4.2.6 on 2023-11-09 03:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0032_alter_topic_slug'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='send_notifications',
            field=models.BooleanField(default=False),
        ),
    ]
