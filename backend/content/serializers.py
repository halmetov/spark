from rest_framework import serializers

from .models import Book, Category, Partner, TeamMember


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description", "created_at", "updated_at"]


class BookSerializer(serializers.ModelSerializer):
    cover_image = serializers.ImageField(required=False, allow_null=True)
    cover_image_url = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", required=False, allow_null=True
    )

    class Meta:
        model = Book
        fields = [
            "id",
            "title",
            "author",
            "description",
            "content",
            "cover_image",
            "cover_image_url",
            "legacy_cover_image_url",
            "category_id",
            "category",
            "created_at",
            "updated_at",
        ]

    def get_cover_image_url(self, obj):
        request = self.context.get("request")
        if obj.cover_image:
            url = obj.cover_image.url
        elif obj.legacy_cover_image_url:
            url = obj.legacy_cover_image_url
        else:
            return None
        if request:
            return request.build_absolute_uri(url)
        return url


class PartnerSerializer(serializers.ModelSerializer):
    logo = serializers.ImageField(required=False, allow_null=True)
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = [
            "id",
            "name",
            "logo",
            "logo_url",
            "legacy_logo_url",
            "website_url",
            "created_at",
            "updated_at",
        ]

    def get_logo_url(self, obj):
        request = self.context.get("request")
        if obj.logo:
            url = obj.logo.url
        elif obj.legacy_logo_url:
            url = obj.legacy_logo_url
        else:
            return None
        if request:
            return request.build_absolute_uri(url)
        return url


class TeamMemberSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=False, allow_null=True)
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = [
            "id",
            "name",
            "role",
            "photo",
            "photo_url",
            "legacy_photo_url",
            "created_at",
            "updated_at",
        ]

    def get_photo_url(self, obj):
        request = self.context.get("request")
        if obj.photo:
            url = obj.photo.url
        elif obj.legacy_photo_url:
            url = obj.legacy_photo_url
        else:
            return None
        if request:
            return request.build_absolute_uri(url)
        return url
