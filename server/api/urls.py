from django.urls import path
from .account import register
from .account import verify_email_with_token
from .account import send_email_new_password
from .account import new_password
from .views import MyQuestionList
from .views import TopicDetail, TopicListCreate
from .views import TopicListShort
from .views import TopicRecentList
from .views import TopicCount
from .views import AnswerListCreate, AnswerDetail
from .views import CommentListCreate, CommentDetail
from .views import VoteListCreate
from .views import TagListCreate
from .views import TagMyList
from .views import TagMyPrivateList
from .views import TagDetail
from .views import TopicTagList
from .views import TopicPopularArticlesList
from .views import TopicNonAnsweredList
# коллекции указываются во множественном числе
urlpatterns = [
    path('account/register/',register),
    path('account/register/verify-email-with-token/<str:token>',verify_email_with_token),
    path('account/send-email-new-password/',send_email_new_password),
    path('account/new-pass/',new_password),
    
    path('my-questions/',MyQuestionList.as_view()), # пока оставим
    
    path('topics/',TopicListCreate.as_view()),
    path('topics/short/',TopicListShort.as_view()),
    path('topics/<slug:slug>/',TopicDetail.as_view()),
    path('topics/recent/<int:count>/',TopicRecentList.as_view()),
    path('topics/count/',TopicCount.as_view()),
    path('topics/<int:id>/tags/', TopicTagList.as_view()), # -OBSOLETE-
    path('topics/articles/popular/<int:count>/',TopicPopularArticlesList.as_view()),
    path('topics/nonanswered/<int:count>/',TopicNonAnsweredList.as_view()),

    path('answers/',AnswerListCreate.as_view()),
    path('answers/<int:id>/',AnswerDetail.as_view()),

    path('comments/',CommentListCreate.as_view()),
    path('comments/<int:id>/', CommentDetail.as_view()),

    path('votes/', VoteListCreate.as_view()),

    path('tags/', TagListCreate.as_view()),
    path('tags/my/', TagMyList.as_view()),
    path('tags/my/private/',TagMyPrivateList.as_view()),
    path('tags/<int:id>/',TagDetail.as_view()),
]
