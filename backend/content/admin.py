from django.contrib import admin

from .models import Book, Category, Partner, TeamMember


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "created_at", "updated_at")
    search_fields = ("name", "description")
    ordering = ("name",)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "category", "created_at", "updated_at")
    list_filter = ("category", "created_at")
    search_fields = ("title", "author", "description", "content")
    raw_id_fields = ("category",)
    ordering = ("-created_at",)


@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ("name", "website_url", "created_at", "updated_at")
    search_fields = ("name", "website_url")
    ordering = ("name",)


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "created_at", "updated_at")
    search_fields = ("name", "role")
    ordering = ("name",)
