from rest_framework import permissions

class IsRelatedToPatient(permissions.BasePermission):
    message = "Not Authorized."

    def has_object_permission(self, request, view, obj):
        return request.user == obj.patient

class IsRelatedToHospital(permissions.BasePermission):
    message = "Not Authorized."

    def has_object_permission(self, request, view, obj):
        return request.user.hospital == obj.hospital
