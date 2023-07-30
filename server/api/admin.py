from django.contrib import admin
from .models import Answer, Comment, Tag, Topic, User, Vote

class UserAdmin(admin.ModelAdmin):
    pass

admin.site.register(User,UserAdmin)
admin.site.register(Topic)
admin.site.register(Answer)
admin.site.register(Comment)
admin.site.register(Vote)
admin.site.register(Tag)