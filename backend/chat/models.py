from django.db import models
from django.conf import settings
from django.utils import timezone


class Conversation(models.Model):
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="conversations"
    )
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Conversation {self.id}"


class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="messages_sent"
    )
    text = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Message de {self.sender} dans conv {self.conversation.id}"
