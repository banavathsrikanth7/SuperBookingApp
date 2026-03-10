from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone

from backend.user.models import User
from backend.content.models import Experience  # Import Experience (assuming this app)
from backend.booking.models import Payment    # Import Payment



class Booking(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('used', 'Used'),  # Changed from 'completed' to match DBML
    ]

    REFUND_STATUS_CHOICES = [
        ('none', 'None'),
        ('requested', 'Requested'),
        ('processed', 'Processed'),
        ('failed', 'Failed'),
    ]

    booking_reference   = models.CharField(
        max_length=50, 
        unique=True, 
        db_index=True,
        null=False
    )
    user_id               = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='user_id',
        db_index=True
    )
    experience_id            = models.ForeignKey(
        Experience, 
        on_delete=models.CASCADE,  #be careful for cascading. 
        related_name='experience_id',
        db_index=True
    )
    booking_date        = models.DateField(
        null=False,
        db_index=True
    )
    slot_time           = models.TimeField(blank=True, null=True)
    total_tickets       = models.IntegerField(null=False)
    total_amount        = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=False
    )
    payment_id             = models.OneToOneField(  # Changed to OneToOneField for 1:1 relationship
        Payment, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='booking'  # Changed to singular since it's 1:1
    )
    status              = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='pending',
        db_index=True
    )
    cancelled_at        = models.DateTimeField(blank=True, null=True)
    cancellation_reason = models.TextField(blank=True, null=True)
    refund_amount       = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        blank=True, 
        null=True
    )
    refund_status       = models.CharField(
        max_length=20, 
        choices=REFUND_STATUS_CHOICES, 
        blank=True, 
        null=True,
        default='none'
    )
    special_requests    = models.TextField(blank=True, null=True)
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)
    deleted_at          = models.DateTimeField(blank=True, null=True)

    def cancel(self, reason=None):
        """Cancel the booking with an optional reason."""
        self.status = 'cancelled'
        self.cancelled_at = timezone.now()
        self.cancellation_reason = reason
        self.save()

    def is_cancelled(self):
        return self.status == 'cancelled'

    def __str__(self):
        return f"Booking {self.booking_reference} - {self.status}"

    class Meta:
        db_table = 'bookings'
        ordering = ['-booking_date']
        # Add composite index
        indexes = [
            models.Index(fields=['monument', 'booking_date', 'status']),
        ]