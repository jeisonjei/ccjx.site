# Generated by Django 4.2.6 on 2023-11-05 17:16

from django.db import migrations
from django.utils.text import slugify
from transliterate import translit
from api.models import Topic

def fill_slug_field(apps, schema_editor):
    Topic = apps.get_model('api','Topic')
    for topic in Topic.objects.all():
        if not topic.slug:
            title_translit = translit(topic.title,'ru',reversed=True)
            slug = slugify(title_translit)
            topic.slug = f"{topic.id}-{slug}"
            topic.save(update_fields=['slug'])

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_topic_slug'),
    ]

    operations = [
        migrations.RunPython(fill_slug_field)
    ]
