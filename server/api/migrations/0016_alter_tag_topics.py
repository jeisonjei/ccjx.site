# Generated by Django 4.2.3 on 2023-07-27 15:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_tag'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tag',
            name='topics',
            field=models.ManyToManyField(related_name='tags', to='api.topic'),
        ),
    ]
