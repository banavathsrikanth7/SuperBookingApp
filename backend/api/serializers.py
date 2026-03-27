from rest_framework import serializers
from content import models as ContentModel
from booking.models import Booking
from .paginations import StandardResultsSetPagination
from django.contrib.auth.models import User
from user.models import User_Data


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentModel.Location
        fields = [
            "id",
            "name",
            "icon_url",
        ]


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentModel.Experience
        fields = [
            "id",
            "name",
            "description",
            "category_id",
            "location",
            "latitude",
            "longitude",
            "image_url",
            "max_daily_capacity",
            "entry_fee_base",
            "is_open",
            "opening_time",
            "closing_time",
            "last_entry_time",
            "created_at",
            "updated_at",
            "deleted_at",
        ]


class ExperienceShortSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()

    class Meta:
        model = ContentModel.Experience
        fields = [
            "id",
            "name",
            "category",
            "location",
            "image_url",
            "entry_fee_base",
            "is_open",
        ]

    def get_category(self, obj):
        category = ContentModel.Category.objects.get(id=obj.category.id)
        if category is not None:
            return category.name
        return None

    def get_location(self, obj):
        location = ContentModel.Location.objects.get(id=obj.location.id)
        if location is not None:
            return location.name
        return None


class CategorySerializer(serializers.ModelSerializer):
    experiences = serializers.SerializerMethodField()

    class Meta:
        model = ContentModel.Category
        fields = ["id", "name", "description", "icon_url", "experiences"]

    def get_experiences(self, obj):
        experiences = obj.experiences.filter(deleted_at__isnull=True).order_by("id")

        request = self.context.get("request")
        if request:
            paginator = StandardResultsSetPagination()
            paginated_experiences = paginator.paginate_queryset(experiences, request)
            serializer = ExperienceShortSerializer(paginated_experiences, many=True)
            return paginator.get_paginated_response(serializer.data).data

        experiences = experiences[:10]
        return ExperienceShortSerializer(experiences, many=True).data


class BookingSerializer(serializers.ModelSerializer):
    experience_name = serializers.CharField(source="experience_id.name", read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "booking_reference",
            "experience_id",
            "experience_name",
            "booking_date",
            "slot_time",
            "total_tickets",
            "total_amount",
            "status",
            "special_requests",
            "created_at",
            "updated_at",
        ]


class UserDataRegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True, required=False)
    first_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User_Data
        fields = (
            "username",
            "password",
            "email",
            "first_name",
            "mobile",
            "preferred_notification",
        )

    def create(self, validated_data):
        username = validated_data.pop("username")
        password = validated_data.pop("password")
        email = validated_data.pop("email", "")
        first_name = validated_data.pop("first_name", "")

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
        )
        user_data, created = User_Data.objects.get_or_create(
            user=user, defaults={"role": "user"}
        )
        for attr, value in validated_data.items():
            setattr(user_data, attr, value)
        user_data.save()

        return user_data
