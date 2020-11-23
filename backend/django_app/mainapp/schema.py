import graphene
import patientdb.schema

class Query(patientdb.schema.Query, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query)