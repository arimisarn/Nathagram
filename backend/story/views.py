# from django.contrib.auth import get_user_model
# from django.db.models.query import Prefetch
# from rest_framework import generics
# from .serializers import UserStorysSerializer
# from story.models import Story

# # Create your views here.


# User = get_user_model()


# class UserFollowingStorysView(generics.ListAPIView):
#     serializer_class = UserStorysSerializer
#     queryset = User.objects.all().prefetch_related('profile')

#     def get_queryset(self):
#         queryset = super().get_queryset()
#         queryset = queryset.filter(
#             followers__in=self.request.user.followings.all(),
#             storys__isnull=False).distinct()\
#                 .prefetch_related(
#                     Prefetch(
#                         'storys', queryset=Story.objects.exclude(
#                             viewers__user=self.request.user
#                         ), to_attr='filtered_storys'
#                     )
#                 )
#         return queryset


from django.contrib.auth import get_user_model
from django.db.models import Prefetch
from rest_framework import generics
from .serializers import UserStorysSerializer
from .models import Story

User = get_user_model()


class UserFollowingStorysView(generics.ListAPIView):
    serializer_class = UserStorysSerializer

    def get_queryset(self):
        # récupère tous les utilisateurs suivis par l'utilisateur connecté
        followings = self.request.user.followings.all()
        queryset = (
            User.objects.filter(
                id__in=followings.values_list("id", flat=True), storys__isnull=False
            )
            .distinct()
            .prefetch_related(
                Prefetch(
                    "storys",
                    queryset=Story.objects.exclude(viewers__user=self.request.user),
                    to_attr="filtered_storys",
                ),
                "profile",
            )
        )
        return queryset


# story/views.py
from rest_framework import generics, permissions
from .models import Story
from .serializers import StorySerializer


class StoryCreateView(generics.CreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


from rest_framework.parsers import MultiPartParser, FormParser


class StoryUploadView(generics.CreateAPIView):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


from django.contrib.auth import get_user_model
from rest_framework import generics
from .serializers import UserStorysSerializer
from .models import Story

User = get_user_model()


class UserStoryListView(generics.ListAPIView):
    serializer_class = UserStorysSerializer

    def get_queryset(self):
        # Récupère tous les utilisateurs qui ont au moins une story
        return (
            User.objects.filter(storys__isnull=False)
            .distinct()
            .prefetch_related("profile", "storys")
        )


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import StorySerializer
from .models import Story


class AllStoriesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stories = Story.objects.all()
        serializer = StorySerializer(
            stories, many=True, context={"request": request}
        )  # ✅
        return Response(serializer.data)
