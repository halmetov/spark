import uuid

from django.db import models


class TimeStampedModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ["-created_at"]


class Category(TimeStampedModel):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta(TimeStampedModel.Meta):
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Book(TimeStampedModel):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    cover_image = models.ImageField(upload_to="books/", blank=True, null=True)
    legacy_cover_image_url = models.URLField(blank=True, null=True, help_text="Previous URL-based cover image")
    category = models.ForeignKey(
        Category,
        related_name="books",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )

    class Meta(TimeStampedModel.Meta):
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Partner(TimeStampedModel):
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to="partners/", blank=True, null=True)
    legacy_logo_url = models.URLField(blank=True, null=True, help_text="Previous URL-based logo")
    website_url = models.URLField(blank=True, null=True)

    class Meta(TimeStampedModel.Meta):
        ordering = ["name"]

    def __str__(self):
        return self.name


class TeamMember(TimeStampedModel):
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    photo = models.ImageField(upload_to="team/", blank=True, null=True)
    legacy_photo_url = models.URLField(blank=True, null=True, help_text="Previous URL-based photo")

    class Meta(TimeStampedModel.Meta):
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.role})"
