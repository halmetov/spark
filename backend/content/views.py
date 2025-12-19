from rest_framework import viewsets

from .models import Book, Category, Partner, TeamMember
from .serializers import (
    BookSerializer,
    CategorySerializer,
    PartnerSerializer,
    TeamMemberSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    ordering = ["name"]


class BookViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BookSerializer

    def get_queryset(self):
        qs = Book.objects.select_related("category").all()
        category_id = self.request.query_params.get("category_id")
        if category_id:
            qs = qs.filter(category_id=category_id)
        return qs.order_by("-created_at")


class PartnerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Partner.objects.all().order_by("name")
    serializer_class = PartnerSerializer


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TeamMember.objects.all().order_by("name")
    serializer_class = TeamMemberSerializer
