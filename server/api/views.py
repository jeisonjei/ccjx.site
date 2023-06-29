from rest_framework import generics
from .models import Comment, Topic
from .serializers import AnswerSerializer, CommentSerializer, TopicSerializer

class MyQuestionList(generics.ListAPIView):
    '''
    Пока что класс используется для отображения списка вопросов, принадлежащих пользователю на странице 'Мои вопросы'
    '''
    serializer_class = TopicSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Topic.objects.all()
        return queryset.filter(user=user)

class TopicListCreate(generics.ListCreateAPIView):
    lookup_field='id'
    queryset=Topic.objects.all()
    serializer_class=TopicSerializer

class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    lookup_field='id'    
    queryset=Topic.objects.all()
    serializer_class=TopicSerializer
            
class AnswerListCreate(generics.ListCreateAPIView):
    lookup_field='id'
    serializer_class=AnswerSerializer
    queryset=Topic.objects.all()

class CommentListCreate(generics.ListCreateAPIView):
    lookup_field='id'        
    serializer_class=CommentSerializer
    queryset=Comment.objects.all()


