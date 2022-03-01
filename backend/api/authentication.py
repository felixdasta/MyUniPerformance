from api.models.student import Student
from api.repositories.student import StudentRepository
from api.utils import generate_token
from api.services.email import EmailThread
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from passlib.hash import pbkdf2_sha256 as sha256
import re

class Authentication:
    @staticmethod
    def send_activation_email(user, request):
        current_site = get_current_site(request)
        email_subject = 'MyUniPerformance - Please activate your account'
        email_body = render_to_string('activate.html',{
            'user':user,
            'domain':current_site,
            'uid':urlsafe_base64_encode(force_bytes(user['user_id'])),
            'token':generate_token.make_token(user)
        })

        email = EmailMultiAlternatives(
            subject=email_subject,
            body=email_body,
            from_email=settings.EMAIL_HOST_USER,
            to=[user['institutional_email']]
            )

        email.attach_alternative(email_body, "text/html")
        EmailThread(email).start()

    @staticmethod
    def email_is_valid(email):
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b' 
        return re.fullmatch(regex, email)

    @staticmethod
    def password_is_strong(password):
        rexes = ('[A-Z]', '[a-z]', '[0-9]')     
        return len(password) >= 8 and all(re.search(r, password) for r in rexes)

    @staticmethod
    def get_auth_errors(request, pk=None):
            errors = []
            #Eliminate left and right whitespaces on email input, if it haves it
            request.data['institutional_email'] = request.data['institutional_email'].lstrip().rstrip().lower()
            dot_index = request.data['institutional_email'].rindex('.')
            
            try:
                object_exists = StudentRepository.get_student_by_email(request.data['institutional_email']).data
            except Student.DoesNotExist:
                object_exists = None

            if not Authentication.email_is_valid(request.data['institutional_email']):
                errors.append((1, "The email you entered is invalid."))
            if request.data['institutional_email'][dot_index + 1:] != "edu":
                errors.append((1, "Email must belong to .edu domain."))
            if object_exists and object_exists['user_id'] != pk:
                    errors.append((1, "This email address is already registered in our database."))

            if not Authentication.password_is_strong(request.data['password']):
                errors.append((2, "Your password isn't strong enough.\
                    Make sure it has at least 8 characters\
                    and that it contains at least 1 capitalized letter,\
                    1 uncapitalized letter and 1 number."))

            return errors

    @staticmethod
    def hash_password(request):
        request.data['password'] =  sha256.hash(request.data['password'])