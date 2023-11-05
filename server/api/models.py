from django.dispatch import receiver
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.db.models import Sum
from django.db.models.signals import pre_save, post_save
from django.utils.text import slugify
from nameof import nameof
from transliterate import translit

class UserManager(BaseUserManager):
    use_in_migrations=True
    def _create_user(self,email,password,**extra_fields):
        if not email:
            raise ValueError('Поле email обязательно')
        email=self.normalize_email(email)
        user=self.model(email=email,**extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_user(self,email,password=None,**extra_fields):
        extra_fields.setdefault('is_staff',False)
        extra_fields.setdefault('is_superuser',False)
        return self._create_user(email,password,**extra_fields)

    def create_superuser(self,email,password,**extra_fields):
        user = self.create_user(email, password=password)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using = self._db)
        return user
        
class User(AbstractUser):
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=[]
    username=None
    email=models.EmailField(unique=True)
    country=models.CharField(blank=True,max_length=52)
    city=models.CharField(blank=True,max_length=52)
    objects=UserManager()
    
class EmailVerificationToken(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    token=models.CharField(max_length=52,default='')
    class Meta:
        db_table='api_verify_email_token'

class NewPasswordToken(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    token=models.CharField(max_length=52,default='')
    class Meta:
        db_table='api_reset_password_token'
        
class Topic(models.Model):
    slug=models.SlugField(max_length=255,blank=True,default='')
    user=models.ForeignKey(User, on_delete=models.CASCADE,null=True) 
    title=models.TextField(blank=True)
    text=models.TextField(blank=True)
    type=models.CharField(default='question')
    is_article=models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True,null=True)
    date_modified = models.DateTimeField(null = True)
    
    def __str__(self) -> str:
        return self.title
    
    class Meta:
        ordering = ['-date_created']
        indexes = [
            models.Index(fields=['-date_created'])
        ]
    
@receiver(post_save,sender=Topic)
def generate_slug(sender, instance, **kwargs):
    if not instance.slug:
        title_translit = translit(instance.title,'ru',reversed=True)
        instance.slug=f"{instance.id}-{slugify(title_translit)}"

class Answer(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    topic=models.ForeignKey(Topic,related_name='answers',on_delete=models.CASCADE,null=True)
    text=models.TextField(blank=True)
    type=models.CharField(default='answer')
    date_created = models.DateTimeField(auto_now_add = True, null = True)
    date_modified = models.DateTimeField(null = True)

class Comment(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,null = True)
    topic=models.ForeignKey(Topic,related_name='comments',on_delete=models.CASCADE,null=True)
    answer=models.ForeignKey(Answer,related_name='comments',on_delete=models.CASCADE,null=True)
    text=models.TextField(blank=True)
    type=models.CharField(default='comment')
    date_created = models.DateTimeField(auto_now_add = True, null = True)
    date_modified = models.DateTimeField(null = True)
    
class Vote(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE, null = True)
    topic = models.ForeignKey(Topic, related_name = 'votes', on_delete = models.CASCADE, null = True)
    answer = models.ForeignKey(Answer, related_name = 'votes', on_delete = models.CASCADE, null = True)
    score = models.IntegerField(default=1)
    date_created = models.DateTimeField(auto_now_add = True, null = True)
    
class Tag(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, null=True)
    name = models.CharField(default='')
    is_private = models.BooleanField(default=False)
    description = models.TextField(null=True)
    topics = models.ManyToManyField(Topic,related_name='tags',blank=True)
    
    def __str__(self) -> str:
        return self.name

    class Meta:
        ordering=['name']
        indexes=[
            models.Index(fields=['name'])
        ]
