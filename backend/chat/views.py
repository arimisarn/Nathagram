# chat/views.py
import traceback
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from users.models import User  # <-- ici on utilise User


from .models import Conversation
from .serializers import ConversationSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_conversations(request):
    conversations = request.user.conversations.all().order_by("-created_at")
    serializer = ConversationSerializer(conversations, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_conversation(request, conversation_id):
    conversation = get_object_or_404(Conversation, id=conversation_id)
    if request.user not in conversation.participants.all():
        return Response({"error": "Non autorisé"}, status=403)
    serializer = ConversationSerializer(conversation)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_message_to_user(request, conversation_id):
    try:
        conversation = get_object_or_404(Conversation, id=conversation_id)
        user = request.user
        if user not in conversation.participants.all():
            return Response({"error": "Non autorisé"}, status=403)

        text = request.data.get("text", "").strip()
        image_url = request.data.get("image_url", None)
        if not text and not image_url:
            return Response({"error": "Message vide"}, status=400)

        message = Message.objects.create(
            conversation=conversation,
            sender=user,
            text=text or None,
            image_url=image_url,
        )

        serializer = MessageSerializer(message)
        return Response(serializer.data, status=201)
    except Exception as e:
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_user(request):
    query = request.GET.get("q", "").strip()
    if not query:
        return Response({"users": []})
    users = User.objects.filter(username__icontains=query)[:10]  # ici username
    results = []
    for user in users:
        photo = getattr(getattr(user, "profile", None), "image", None)
        results.append(
            {
                "id": user.id,
                "nom_utilisateur": user.username,
                "photo": photo.url if photo else None,
            }
        )
    return Response({"users": results})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def start_conversation(request):
    recipient_id = request.data.get("recipient_id")
    text = request.data.get("text", "Salut 👋")
    recipient = get_object_or_404(User, id=recipient_id)

    # Chercher conversation existante
    conv = (
        Conversation.objects.filter(participants=request.user)
        .filter(participants=recipient)
        .first()
    )
    if not conv:
        conv = Conversation.objects.create()
        conv.participants.add(request.user, recipient)

    # Message initial
    message = Message.objects.create(conversation=conv, sender=request.user, text=text)

    return Response({"conversation_id": conv.id, "message_id": message.id})
