from rest_framework import serializers
from .models import Conversation, Message
from users.models import User


class UserSerializer(serializers.ModelSerializer):
    profile_photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "profile_photo"]

    def get_profile_photo(self, obj):
        return (
            getattr(getattr(obj, "profile", None), "image", None)
            and obj.profile.image.url
        )


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ["id", "sender", "text", "image_url", "created_at"]


class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ["id", "participants", "messages", "created_at"]
