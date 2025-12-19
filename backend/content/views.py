from rest_framework import parsers, viewsets

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


class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser)

    def get_queryset(self):
        qs = Book.objects.select_related("category").all()
        category_id = self.request.query_params.get("category_id")
        if category_id:
            qs = qs.filter(category_id=category_id)
        return qs.order_by("-created_at")


class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all().order_by("name")
    serializer_class = PartnerSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser)


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all().order_by("name")
    serializer_class = TeamMemberSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser)
