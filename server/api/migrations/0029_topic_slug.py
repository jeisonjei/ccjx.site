# Generated by Django 4.2.6 on 2023-11-05 14:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0028_remove_topic_is_protected'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='slug',
            field=models.SlugField(blank=True, default='', max_length=255),
        ),
    ]
