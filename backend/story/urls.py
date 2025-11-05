# story/urls.py
from django.urls import path
from .views import AllStoriesView, UserFollowingStorysView, StoryUploadView, UserStoryListView

urlpatterns = [
    path("", UserFollowingStorysView.as_view(), name="user-following-stories"),
    path("upload/", StoryUploadView.as_view(), name="story-upload"),
    path("all/", AllStoriesView.as_view(), name="story-list"),
]
