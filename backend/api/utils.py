from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from better_profanity import profanity
from googletrans import Translator
import six

def contains_profanity(word):
    #always check profanity in the english language
    translator= Translator()
    translation = translator.translate(word)
    return profanity.contains_profanity(translation.text)

def paginate_result(query_input, serializer_class, entity_name, page_number, page_size):
    paginator = Paginator(query_input, page_size)

    try:
        query_input = paginator.page(page_number)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page.
        page_number = 1
        query_input = paginator.page(page_number)
    except EmptyPage:
        # If page is out of range, deliver last page of results.
        page_number = paginator.num_pages
        query_input = paginator.page(page_number)

    query_output = serializer_class(query_input, many=True)

    return {'current_page': page_number, 'last_page': paginator.num_pages, entity_name: query_output.data}

class TokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self,user,timestamp):
        return (six.text_type(user.user_id)+six.text_type(timestamp)+six.text_type(user.is_email_verified))

generate_token = TokenGenerator()