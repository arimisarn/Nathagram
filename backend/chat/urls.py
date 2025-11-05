from django.urls import path
from .views import (
    list_conversations,
    get_conversation,
    send_message_to_user,
    search_user,
    start_conversation,
)

# urls.py (projet)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("conversations/", list_conversations),
    path("conversations/<int:conversation_id>/", get_conversation),
    path(
        "conversations/<int:conversation_id>/send_message_to_user/",
        send_message_to_user,
    ),
    path("search_user/", search_user),
    path("start_conversation/", start_conversation),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
