import logging

from rest_framework import parsers, viewsets

from .models import Book, Category, Partner, TeamMember
from .serializers import (
    BookSerializer,
    CategorySerializer,
    PartnerSerializer,
    TeamMemberSerializer,
)


logger = logging.getLogger(__name__)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    ordering = ["name"]
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        count = qs.count()
        logger.info("Category queryset requested: count=%s", count)
        return qs


class BookViewSet(viewsets.ModelViewSet):
    serializer_class = BookSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser)
    pagination_class = None

    def get_queryset(self):
        qs = Book.objects.select_related("category").all()
        category_id = self.request.query_params.get("category_id")
        if category_id:
            qs = qs.filter(category_id=category_id)
        ordered_qs = qs.order_by("-created_at")
        logger.info(
            "Book queryset requested: category_id=%s count=%s",
            category_id,
            ordered_qs.count(),
        )
        return ordered_qs


class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all().order_by("name")
    serializer_class = PartnerSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser)
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        count = qs.count()
        logger.info("Partner queryset requested: count=%s", count)
        return qs


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all().order_by("name")
    serializer_class = TeamMemberSerializer
    parser_classes = (parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser)
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        count = qs.count()
        logger.info("Team member queryset requested: count=%s", count)
        return qs
