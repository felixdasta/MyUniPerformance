from api.models.student import Student
from api.repositories.student import StudentRepository
from passlib.hash import pbkdf2_sha256 as sha256
import re

class Authentication:
    @staticmethod
    def emailIsValid(email):
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b' 
        return re.fullmatch(regex, email)

    @staticmethod
    def passwordIsStrong(password):
        rexes = ('[A-Z]', '[a-z]', '[0-9]')     
        return len(password) >= 8 and all(re.search(r, password) for r in rexes)

    @staticmethod
    def get_auth_errors(request, pk=None):
            errors = []
            #Eliminate left and right whitespaces on email input, if it haves it
            request.data['institutional_email'] = request.data['institutional_email'].lstrip().rstrip().lower()
            dot_index = request.data['institutional_email'].rindex('.')
            object_exists = None
            try:
                object_exists = StudentRepository.get_student_by_email(request.data['institutional_email']).data
            except Student.DoesNotExist:
                pass

            if not Authentication.emailIsValid(request.data['institutional_email']):
                errors.append((1, "The email you entered is invalid."))
            if request.data['institutional_email'][dot_index + 1:] != "edu":
                errors.append((1, "Email must belong to .edu domain."))
            if object_exists and object_exists['user_id'] != pk:
                    errors.append((1, "This email address is already registered in our database."))

            if not Authentication.passwordIsStrong(request.data['password']):
                errors.append((2, "Your password isn't strong enough.\
                    Make sure it has at least 8 characters\
                    and that it contains at least 1 capitalized letter,\
                    1 uncapitalized letter and 1 number."))

            return errors

    @staticmethod
    def hash_password(request):
        request.data['password'] =  sha256.hash(request.data['password'])