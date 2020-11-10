
from graphene_django import DjangoObjectType
from arrhythmias.models import UserModel
import graphene

class UserType(DjangoObjectType):
    class Meta:
        model = UserModel
        fields = "__all__"


class Query(graphene.ObjectType):
    all_users = graphene.List(UserType)
    user_by_name = graphene.Field(UserType, name=graphene.String(required=True))
    user_by_type = graphene.Field(UserType, user_type=graphene.String(required=True))

    def resolve_all_users(root, info):
        return UserModel.objects.all()

    def resolve_user_by_name(root, info, name):
        try:
            return UserModel.objects.get(name=name)
        except UserModel.DoesNotExist:
            return None

    def resolve_user_by_type(root, info, user_type):
        try:
            return UserModel.objects.get(user_type=user_type)
        except UserModel.DoesNotExist:
            return None

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