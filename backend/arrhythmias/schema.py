
from graphene_django import DjangoObjectType
from arrhythmias.models import UserModel
import graphene
from graphene import Node
from graphene_django.filter import DjangoFilterConnectionField
from graphene_django.types import DjangoObjectType
from django_filters import FilterSet, OrderingFilter

class UserType(DjangoObjectType):
    class Meta:
        model = UserModel
 
        filter_fields = {
            'name':["exact", "icontains", "istartswith"], 
            'last_name':["exact", "icontains", "istartswith"], 
            'user_type':["exact", "icontains", "istartswith"]
        }

        interfaces =(Node, )

class UserFilter(FilterSet):
    model = UserModel

    order_by = OrderingFilter(
        fields=(
            ('name', 'last_name'),
        )
    )


class Query(graphene.ObjectType):
    user = Node.Field(UserType)
    all_users = DjangoFilterConnectionField(UserType, filterset_class=UserFilter)



class CreateUser(graphene.Mutation):
    id = graphene.Int()
    name = graphene.String()
    last_name = graphene.String()
    user_type = graphene.String()

    class Arguments:
        name = graphene.String()
        last_name = graphene.String()
        user_type = graphene.String()

    def mutate(self, info, name, last_name, user_type):
        user = UserModel(name=name, last_name=last_name, user_type=user_type)
        user.save()

        return CreateUser(
            id = user.id,
            name=user.name,
            last_name=user.last_name,
            user_type=user.user_type,
        )

class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)