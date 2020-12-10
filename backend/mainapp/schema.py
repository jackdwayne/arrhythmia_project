import graphene
import patientdb.schema
from graphene_django.debug import DjangoDebug
class Query(patientdb.schema.Query, graphene.ObjectType):
    pass
    debug = graphene.Field(DjangoDebug, name='_debug')

schema = graphene.Schema(query=Query)