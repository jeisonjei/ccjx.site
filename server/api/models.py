from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

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
    user=models.ForeignKey(User, on_delete=models.CASCADE,null=True) 
    title=models.TextField(blank=True)
    text=models.TextField(blank=True)
    type=models.CharField(default='question')
    
class Answer(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    topic=models.ForeignKey(Topic,related_name='answers',on_delete=models.CASCADE,null=True)
    text=models.TextField(blank=True)
    type=models.CharField(default='answer')

class Comment(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,null = True)
    topic=models.ForeignKey(Topic,related_name='comments',on_delete=models.CASCADE,null=True)
    answer=models.ForeignKey(Answer,related_name='comments',on_delete=models.CASCADE,null=True)
    text=models.TextField(blank=True)
    type=models.CharField(default='comment')
    
