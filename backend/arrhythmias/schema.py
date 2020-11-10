import graphene
from graphene_django import DjangoObjectType
from arrhythmias.models import UserModel


class UserType(DjangoObjectType):
    class Meta:
        model = UserModel
        fields = ("id", "name", "lastName", "userType")
        interface = (relay.Node, )


class Query(graphene.ObjectType):
    users = relay.Node.Field(UserModel)
    all_users = DjangoFilterConnectionField(UserModel)

    def resolve_users(self, info):
        return UserModel.objects.all()

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

class CarType(DjangoObjectType):
    class Meta:
        model = CarModel

class CreateCar(graphene.Mutation):
    id = graphene.Int()
    year = graphene.String()


    class Arguments:
        year = graphene.String()


    def mutate(self, info, year):
        car = CarModel(year=year)
        user.save()

        return CreateCar(
            id=car.id,
            year=car.year
        )


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)