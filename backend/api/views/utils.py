from rest_framework.decorators import api_view
from django.http import HttpResponse

@api_view(['GET'])
def get_loader_io(request):
    filename = "loaderio-2cfac6fc22e5d24034475d0fcb53e6e1.txt"
    content = 'loaderio-2cfac6fc22e5d24034475d0fcb53e6e1'
    response = HttpResponse(content, content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename={0}'.format(filename)
    return response