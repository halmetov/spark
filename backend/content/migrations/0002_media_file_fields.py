from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="book",
            name="legacy_cover_image_url",
            field=models.URLField(blank=True, help_text="Previous URL-based cover image", null=True),
        ),
        migrations.AlterField(
            model_name="book",
            name="cover_image",
            field=models.ImageField(blank=True, null=True, upload_to="books/"),
        ),
        migrations.AddField(
            model_name="partner",
            name="legacy_logo_url",
            field=models.URLField(blank=True, help_text="Previous URL-based logo", null=True),
        ),
        migrations.AlterField(
            model_name="partner",
            name="logo",
            field=models.ImageField(blank=True, null=True, upload_to="partners/"),
        ),
        migrations.AddField(
            model_name="teammember",
            name="legacy_photo_url",
            field=models.URLField(blank=True, help_text="Previous URL-based photo", null=True),
        ),
        migrations.AlterField(
            model_name="teammember",
            name="photo",
            field=models.ImageField(blank=True, null=True, upload_to="team/"),
        ),
    ]
