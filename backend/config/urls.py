from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from content import views as content_views

router = DefaultRouter()
router.register(r"books", content_views.BookViewSet, basename="book")
router.register(r"categories", content_views.CategoryViewSet, basename="category")
router.register(r"partners", content_views.PartnerViewSet, basename="partner")
router.register(r"team-members", content_views.TeamMemberViewSet, basename="team-member")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
