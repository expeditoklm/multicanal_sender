import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

type Payload ={
id : number
email : string
}

@Injectable()


export class JwtStrategy extends PassportStrategy(Strategy){
    constructor (
        configService : ConfigService,
        private readonly prismaService : PrismaService,

    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get("SECRET_KEY"),
            ignoreExpiration : false
        })
    }

    async validate(payload : Payload){
        const user = await this.prismaService.user.findUnique({where : {email : payload.email}})
        console.log('User:', user);
        if(!user) throw new UnauthorizedException ("Non authorized user")
        Reflect.deleteProperty(user, "password")
        return user ;
    }

}