from django.contrib import admin
from django.utils.html import format_html

from .models import Book, Category, Partner, TeamMember


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "created_at", "updated_at")
    search_fields = ("name", "description")
    ordering = ("name",)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "category", "cover_preview", "created_at", "updated_at")
    list_filter = ("category", "created_at")
    search_fields = ("title", "author", "description", "content")
    raw_id_fields = ("category",)
    ordering = ("-created_at",)
    readonly_fields = ("cover_preview",)

    @admin.display(description="Cover")
    def cover_preview(self, obj):
        if obj.cover_image:
            return format_html('<img src="{}" style="height: 60px;"/>', obj.cover_image.url)
        if obj.legacy_cover_image_url:
            return format_html('<img src="{}" style="height: 60px;"/>', obj.legacy_cover_image_url)
        return "—"


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ("name", "website_url", "logo_preview", "created_at", "updated_at")
    search_fields = ("name", "website_url")
    ordering = ("name",)
    readonly_fields = ("logo_preview",)

    @admin.display(description="Logo")
    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="height: 60px;"/>', obj.logo.url)
        if obj.legacy_logo_url:
            return format_html('<img src="{}" style="height: 60px;"/>', obj.legacy_logo_url)
        return "—"


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "photo_preview", "created_at", "updated_at")
    search_fields = ("name", "role")
    ordering = ("name",)
    readonly_fields = ("photo_preview",)

    @admin.display(description="Photo")
    def photo_preview(self, obj):
        if obj.photo:
            return format_html('<img src="{}" style="height: 60px;"/>', obj.photo.url)
        if obj.legacy_photo_url:
            return format_html('<img src="{}" style="height: 60px;"/>', obj.legacy_photo_url)
        return "—"
